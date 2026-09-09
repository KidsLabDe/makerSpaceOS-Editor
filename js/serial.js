// serial.js – Web Serial API + CircuitPython Raw REPL

// Aufräum-Prolog: gibt alle Pins/Objekte des vorherigen REPL-Laufs frei
// (deinit/exit), bevor das neue Skript startet. So vermeidet man „GPx in use"
// OHNE Soft-Reboot – dadurch läuft code.py/main.py des Boards NICHT mit an.
const PIN_RESET_PRELUDE =
`for _cb_n in list(globals()):
    _cb_o = globals().get(_cb_n)
    try:
        _cb_o.deinit()
    except Exception:
        try:
            _cb_o.exit()
        except Exception:
            pass
`;

class CircuitPythonSerial {
  constructor() {
    this.port     = null;
    this.reader   = null;
    this.writer   = null;
    this._reading = false;
    this.onData   = null;  // callback(string)
    this.onDisconnect = null;        // callback() bei unerwartetem Verbindungsverlust
    this._intentionalClose = false;  // true = vom Nutzer ausgelöstes Trennen
    this._disconnectBound  = false;
    this._capturing = false;         // true = eingehende Bytes zusätzlich mitschneiden
    this._rxBuffer  = '';            // Mitschnitt-Puffer für den Upload-Handshake
    this._suppressOnData = false;    // true = Bytes NICHT an den Monitor (onData) weiterreichen
  }

  get isConnected() {
    return this.port !== null;
  }

  async connect() {
    if (!('serial' in navigator)) {
      throw new Error(L('Web Serial API nicht verfügbar. Bitte Chrome oder Edge verwenden.', 'Web Serial API not available. Please use Chrome or Edge.'));
    }
    this.port = await navigator.serial.requestPort();
    await this.port.open({ baudRate: 115200 });
    this._intentionalClose = false;
    this._bindDisconnectEvent();
    this._startReading();
  }

  // OS-Ereignis: Gerät physisch abgesteckt → Lese-Schleife beenden lassen
  _bindDisconnectEvent() {
    if (this._disconnectBound) return;
    this._disconnectBound = true;
    navigator.serial.addEventListener('disconnect', (e) => {
      const p = e.port || e.target;
      if (p && p === this.port) this._reading = false;
    });
  }

  async disconnect() {
    this._intentionalClose = true;
    this._reading = false;
    try { if (this.reader) { await this.reader.cancel(); this.reader = null; } } catch(_) {}
    try { if (this.writer) { this.writer.releaseLock(); this.writer = null; } } catch(_) {}
    try { if (this.port)   { await this.port.close();   this.port   = null; } } catch(_) {}
  }

  _startReading() {
    this._reading = true;
    const self = this;
    (async () => {
      try {
        // Solange lesbar: Reader holen und lesen. KEIN tight-retry – bei done/Fehler
        // endet die Schleife sauber (verhindert den Microtask-Busy-Loop = Freeze).
        while (self._reading && self.port && self.port.readable) {
          self.reader = self.port.readable.getReader();
          try {
            while (true) {
              const { value, done } = await self.reader.read();
              if (done) { self._reading = false; break; }   // Stream zu = getrennt
              if (value) {
                const text = new TextDecoder().decode(value);
                if (self._capturing) self._rxBuffer += text;
                if (self.onData && !self._suppressOnData) self.onData(text);
              }
            }
          } finally {
            try { self.reader.releaseLock(); } catch(_) {}
            self.reader = null;
          }
        }
      } catch (e) {
        // Lesefehler (abgesteckt / USB-Reset) – beenden, NICHT endlos weiterlaufen
        if (self._reading) console.warn('Serial read error:', e);
      }
      // Schleife beendet → aufräumen; bei unerwartetem Verlust das UI benachrichtigen
      const intentional = self._intentionalClose;
      self._intentionalClose = false;
      self._reading = false;
      if (!intentional) self._handleUnexpectedDisconnect();
    })();
  }

  _handleUnexpectedDisconnect() {
    try { if (this.writer) this.writer.releaseLock(); } catch(_) {}
    this.writer = null;
    try { if (this.port) this.port.close().catch(() => {}); } catch(_) {}
    this.port   = null;
    this.reader = null;
    if (this.onDisconnect) { try { this.onDisconnect(); } catch(_) {} }
  }

  async _write(data) {
    if (!this.port || !this.port.writable) return;
    const writer = this.port.writable.getWriter();
    try {
      if (typeof data === 'string') {
        await writer.write(new TextEncoder().encode(data));
      } else {
        await writer.write(data);
      }
    } finally {
      writer.releaseLock();
    }
  }

  async _delay(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // Wartet (per Polling des Mitschnitt-Puffers), bis einer der Marker-Strings
  // empfangen wurde. Voraussetzung: _capturing ist aktiv. Liefert true bei Treffer,
  // false bei Timeout.
  async _waitFor(markers, timeoutMs) {
    const list = Array.isArray(markers) ? markers : [markers];
    const start = performance.now();
    while (performance.now() - start < timeoutMs) {
      if (list.some(m => this._rxBuffer.includes(m))) return true;
      await this._delay(20);
    }
    return false;
  }

  // Code per Raw REPL auf das Board laden und ausführen.
  // Prompt-bewusst: wartet aktiv auf die Antworten des Boards, statt blinde
  // Delays zu nutzen. Zuerst wird das Board zuverlässig auf den normalen
  // Prompt (>>>) gebracht – egal in welchem Zustand es ist (normal, raw oder
  // mit laufendem Programm) –, erst dann wird der neue Code gesendet. Auch die
  // Kompilier-Bestätigung ('OK') wird geprüft. Die Sperre verhindert zwei
  // parallele Starts (z. B. Doppelpressen auf „Play").
  async uploadAndRun(code) {
    if (!this.port) throw new Error('Nicht verbunden');
    if (this._uploading) throw new Error('Der vorige Start läuft noch – bitte kurz warten.');
    this._uploading = true;

    this._rxBuffer = '';
    this._capturing = true;
    try {
      // 1. Zuverlässig auf den normalen Prompt (>>>):
      //    – Ctrl+C unterbricht ein laufendes Programm (oder zeigt den Prompt neu),
      //    – ein einzelnes Enter erzwingt einen frischen „>>>", wenn das Board
      //      am normalen REPL steht,
      //    – Ctrl+B verlässt die Raw-REPL, falls sie noch aktiv ist (nach dem
      //      vorherigen Play steht das Board nämlich in der Raw-REPL).
      //    Weiter geht es erst, wenn „>>>" wirklich angekommen ist (max. 3
      //    Durchgänge) – sonst läuft vielleicht noch das alte Programm und der
      //    neue Code würde nie gestartet.
      let ready = false;
      for (let versuch = 1; versuch <= 3 && !ready; versuch++) {
        this._rxBuffer = '';
        await this._write('\x03');
        await this._delay(80);
        await this._write('\x03');
        await this._write('\r');
        if (await this._waitFor('>>>', 1500)) { ready = true; break; }
        await this._write('\x02');
        if (await this._waitFor('>>>', 1500)) { ready = true; break; }
      }
      if (!ready) {
        throw new Error('Das Board ist noch beschäftigt – das laufende Programm konnte nicht gestoppt werden. Bitte „Stop“ drücken oder kurz warten und erneut versuchen.');
      }

      // 2. Raw REPL aktivieren (Ctrl+A) und auf dessen Banner warten.
      this._rxBuffer = '';
      await this._write('\x01');
      if (!await this._waitFor('raw REPL', 1500)) {
        // Zweiter Versuch: Raw REPL erneut anfordern.
        this._rxBuffer = '';
        await this._write('\x01');
        if (!await this._waitFor('raw REPL', 1500)) {
          throw new Error('Board reagiert nicht (Raw REPL). Bitte erneut versuchen.');
        }
      }

      // 3. Aufräum-Prolog (gibt Pins des vorherigen Laufs frei) + eigentlichen Code senden.
      //    Kein Soft-Reboot → code.py/main.py des Boards wird NICHT gestartet.
      this._rxBuffer = '';
      await this._write(PIN_RESET_PRELUDE + '\n' + code);

      // 4. Ausführen (Ctrl+D) und auf die Kompilier-Bestätigung ('OK') warten.
      //    Geprüft: Ohne Bestätigung ist der Code NICHT gestartet (z. B. Syntax-Fehler).
      await this._write('\x04');
      if (!await this._waitFor('OK', 4000)) {
        throw new Error('Der Code wurde nicht gestartet – das Board hat keine Bestätigung („OK“) geschickt. Bitte erneut versuchen.');
      }
    } finally {
      this._uploading = false;
      this._capturing = false;
      this._rxBuffer = '';
    }
  }

  // Board-Kennung (board.board_id) leise über die REPL abfragen.
  // Liefert z.B. "lolin_s2_mini" / "cytron_maker_pi_rp2040" oder null (Timeout/Fehler).
  // Läuft im normalen REPL; der Monitor wird währenddessen unterdrückt.
  async readBoardId() {
    if (!this.port) return null;
    this._rxBuffer = '';
    this._capturing = true;
    this._suppressOnData = true;
    try {
      // Laufenden Code unterbrechen und auf den normalen Prompt warten.
      await this._write('\x03');
      await this._delay(60);
      await this._write('\x03');
      if (!await this._waitFor('>>>', 1200)) return null;

      // Abfrage senden. Marker (>> … <<) per Konkatenation gebaut, damit das
      // REPL-Echo der Befehlszeile nicht fälschlich als Treffer zählt.
      this._rxBuffer = '';
      await this._write('import board; print(">"+">"+board.board_id+"<"+"<")\r\n');
      await this._waitFor('>>' , 1500);
      const m = this._rxBuffer.match(/>>([a-z0-9_.\-]+)<</i);
      return m ? m[1] : null;
    } catch (_) {
      return null;
    } finally {
      this._capturing = false;
      this._suppressOnData = false;
      this._rxBuffer = '';
    }
  }

  // Code stoppen (Ctrl+C)
  async stop() {
    await this._write('\x03');
    await this._delay(100);
    await this._write('\x03');
    // Zurück zu normalem REPL (Ctrl+B)
    await this._write('\x02');
  }

  // Einzelnen Befehl im normalen REPL senden
  async sendLine(line) {
    await this._write(line + '\r\n');
  }
}
