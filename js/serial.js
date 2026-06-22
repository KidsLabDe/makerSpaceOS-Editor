// serial.js – Web Serial API + CircuitPython Raw REPL

class CircuitPythonSerial {
  constructor() {
    this.port     = null;
    this.reader   = null;
    this.writer   = null;
    this._reading = false;
    this.onData   = null;  // callback(string)
  }

  get isConnected() {
    return this.port !== null;
  }

  async connect() {
    if (!('serial' in navigator)) {
      throw new Error('Web Serial API nicht verfügbar. Bitte Chrome oder Edge verwenden.');
    }
    this.port = await navigator.serial.requestPort();
    await this.port.open({ baudRate: 115200 });
    this._startReading();
  }

  async disconnect() {
    this._reading = false;
    try { if (this.reader) { await this.reader.cancel(); this.reader = null; } } catch(_) {}
    try { if (this.writer) { this.writer.releaseLock(); this.writer = null; } } catch(_) {}
    try { if (this.port)   { await this.port.close();   this.port   = null; } } catch(_) {}
  }

  _startReading() {
    this._reading = true;
    const self = this;
    (async () => {
      while (self.port && self._reading) {
        try {
          self.reader = self.port.readable.getReader();
          while (true) {
            const { value, done } = await self.reader.read();
            if (done) break;
            if (value && self.onData) {
              self.onData(new TextDecoder().decode(value));
            }
          }
        } catch(e) {
          if (self._reading) console.warn('Serial read error:', e);
        } finally {
          try { self.reader.releaseLock(); } catch(_) {}
        }
      }
    })();
  }

  async _write(data) {
    if (!this.port) return;
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

  // Code per Raw REPL auf das Board laden und ausführen
  async uploadAndRun(code) {
    if (!this.port) throw new Error('Nicht verbunden');

    // 1. Laufenden Code unterbrechen (Ctrl+C)
    await this._write('\x03');
    await this._delay(150);
    await this._write('\x03');
    await this._delay(150);

    // 2. Soft-Reboot (Ctrl+D im normalen REPL): setzt die VM zurück und gibt ALLE
    //    Pins des vorherigen Laufs frei – verhindert „GPx in use" beim erneuten Start.
    await this._write('\x02');   // sicher im normalen REPL (Ctrl+B)
    await this._delay(150);
    await this._write('\x04');   // Soft-Reboot
    await this._delay(800);

    // 3. Automatischen Start von code.py sofort wieder unterbrechen
    await this._write('\x03');
    await this._delay(150);
    await this._write('\x03');
    await this._delay(150);

    // 4. Raw REPL aktivieren (Ctrl+A)
    await this._write('\x01');
    await this._delay(300);

    // 5. Code senden
    await this._write(code);
    await this._delay(100);

    // 6. Ausführen (Ctrl+D)
    await this._write('\x04');
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
