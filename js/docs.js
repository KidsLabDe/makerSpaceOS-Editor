// docs.js – Bauteil-Bibliothek (Vollbild-Galerie) + Block-Hilfe per Rechtsklick
//
// Zwei Einstiege:
//   1. Header-Button "Bibliothek" → openLibrary() (Vollbild-Galerie)
//   2. Rechtsklick auf einen Block → "❓ Wie funktioniert das?" →
//      openDocsDrawer(key): angedocktes Panel rechts (wie der Code-Bereich),
//      Workspace bleibt daneben bedienbar; von dort Sprung in die Bibliothek.
//
// Inhalte kommen aus BLOCKS_DB (Feld `doc` = Markdown-Body der components/*.md),
// den handgeschriebenen CORE_DOCS (SETUP, FÜR IMMER, Ereignis-Hüte …) und den
// BOARD_DOCS (ein Eintrag pro Board-Profil). Kein externes Markdown-Laden –
// alles liegt in geladenen JS-Dateien, damit auch file:// funktioniert.

(function () {
  'use strict';

  // ── Doku für handgeschriebene Kern- und Standard-Blöcke ────────────────────
  // section = Baum-Sektion in der Bibliothek (Reihenfolge/Farben wie Toolbox).

  const CONTROL_COLOUR = '#7C3AED';
  const EVENT_COLOUR   = '#D97706';
  const LOGIC_COLOUR   = '#4FBFE8';
  const MATH_COLOUR    = '#16A34A';
  const VAR_COLOUR     = '#CA8A04';
  const TEXT_COLOUR    = '#0891B2';
  const MATRIX_COLOUR  = '#EC4899';

  const CORE_SECTIONS = [
    { name: 'Steuerung',  colour: CONTROL_COLOUR },
    { name: 'Ereignisse', colour: EVENT_COLOUR },
    { name: 'Logik',      colour: LOGIC_COLOUR },
    { name: 'Mathe',      colour: MATH_COLOUR },
    { name: 'Variablen',  colour: VAR_COLOUR },
    { name: 'Text',       colour: TEXT_COLOUR },
  ];

  const CORE_DOCS = [
    {
      id: 'control_setup', label: 'SETUP', colour: CONTROL_COLOUR, section: 'Steuerung',
      tooltip: 'Code hier läuft einmal beim Einschalten / Neustart',
      doc: `Alles in diesem Block wird **genau einmal** ausgeführt – direkt nach dem
Einschalten oder Neustart des Boards. Perfekt für Dinge, die nur am Anfang
passieren sollen: eine Begrüßung anzeigen, Lichter ausschalten, einen Startwert setzen.

Danach starten automatisch alle anderen Stapel (FÜR IMMER, Schleifen, Ereignisse) –
und zwar **gleichzeitig**.`,
    },
    {
      id: 'control_forever', label: 'FÜR IMMER', colour: CONTROL_COLOUR, section: 'Steuerung',
      tooltip: 'Code hier wird immer wieder wiederholt',
      doc: `Die Blöcke hier drin werden **endlos wiederholt** – wie eine Schleife ohne Ende.
Das ist das Herz der meisten Programme: messen, prüfen, reagieren, und wieder von vorn.

Tipp: Baue ein **Warte**-Häppchen ein, wenn etwas nicht tausendmal pro Sekunde
passieren soll (z.B. eine Anzeige aktualisieren).`,
    },
    {
      id: 'loop_parallel', label: 'Schleife (läuft parallel)', colour: EVENT_COLOUR, section: 'Ereignisse',
      tooltip: 'Wiederholt sich endlos – läuft gleichzeitig zu anderen Stapeln',
      doc: `Wie FÜR IMMER – aber als **zusätzlicher** Stapel. Damit kann dein Programm
mehrere Dinge **gleichzeitig** tun: In einer Schleife blinkt eine LED, in einer
anderen wird die Temperatur gemessen. Beide laufen nebeneinander, ohne sich zu stören.`,
    },
    {
      id: 'control_wait', label: 'Warte … Sekunden', colour: CONTROL_COLOUR, section: 'Steuerung',
      tooltip: 'Wartet die angegebene Anzahl Sekunden',
      doc: `Hält den eigenen Stapel für die angegebene Zeit an. Auch halbe Sekunden gehen: \`0.5\`.

Das Warten blockiert nur **diesen** Stapel – alle anderen Schleifen und
Ereignisse laufen währenddessen normal weiter.`,
    },
    {
      id: 'control_print', label: 'Ausgabe', colour: CONTROL_COLOUR, section: 'Steuerung',
      tooltip: 'Gibt einen Wert im Seriellen Monitor aus',
      doc: `Schreibt einen Wert oder Text in den **Seriellen Monitor** (rechts im Editor,
Board muss verbunden sein). Super zum Nachschauen, was dein Programm gerade denkt –
z.B. den aktuellen Sensorwert ausgeben.`,
    },
    {
      id: 'control_wait_until', label: 'warte bis', colour: LOGIC_COLOUR, section: 'Logik',
      tooltip: 'Hält an dieser Stelle an, bis die Bedingung erfüllt ist',
      doc: `Hält den Stapel an, **bis** die Bedingung wahr wird – z.B. "warte bis Taster
gedrückt". Andere Stapel laufen währenddessen weiter.`,
    },
    {
      id: 'control_while', label: 'solange … mache', colour: LOGIC_COLOUR, section: 'Logik',
      tooltip: 'Wiederholt die Blöcke, solange die Bedingung erfüllt ist',
      doc: `Wiederholt die Blöcke im Inneren, **solange** die Bedingung wahr ist.
Wird die Bedingung falsch, geht es dahinter weiter.`,
    },
    {
      id: 'when_button', label: 'Wenn Taster …', colour: EVENT_COLOUR, section: 'Ereignisse',
      tooltip: 'Startet, sobald der Taster gedrückt bzw. losgelassen wird',
      doc: `Ein **Ereignis-Hut**: Die Blöcke darunter starten in dem Moment, in dem der
Taster gedrückt (oder losgelassen) wird – einmal pro Tastendruck, nicht dauernd.

Zur Auswahl stehen die Onboard-Taster des Boards (falls vorhanden) und externe
Taster an einem Grove-Port.`,
    },
    {
      id: 'when_encoder', label: 'Wenn Drehgeber …', colour: EVENT_COLOUR, section: 'Ereignisse',
      tooltip: 'Startet, sobald der Drehgeber in die gewählte Richtung gedreht wird',
      doc: `Startet bei jedem "Klick" des Drehgebers in die gewählte Richtung
(hoch = im Uhrzeigersinn). So kannst du z.B. mit dem Drehknopf eine Zahl
hoch- und runterzählen.`,
    },
    {
      id: 'when_sound', label: 'Wenn Geräusch erkannt', colour: EVENT_COLOUR, section: 'Ereignisse',
      tooltip: 'Startet, sobald ein Geräusch erkannt wird',
      doc: `Startet, sobald der Geräuschsensor am gewählten Port ein Geräusch meldet –
z.B. Klatschen. Feuert einmal pro Erkennung.`,
    },
    {
      id: 'when_touch', label: 'Wenn berührt', colour: EVENT_COLOUR, section: 'Ereignisse',
      tooltip: 'Startet, sobald der Sensor berührt wird',
      doc: `Startet, sobald der Berührungssensor am gewählten Port angefasst wird.
Funktioniert wie ein Taster – nur ohne Drücken.`,
    },
    {
      id: 'when_motion', label: 'Wenn bewegt …', colour: EVENT_COLOUR, section: 'Ereignisse',
      tooltip: 'Startet, sobald der Bewegungssensor (ICM20948) geschüttelt oder stark beschleunigt wird',
      doc: `Startet, wenn der Bewegungssensor (ICM20948, am I2C-Port) bewegt wird:

- **geschüttelt** – reagiert schon auf kräftiges Schütteln (mehr als 2 g)
- **3g / 6g / 9g** – reagiert erst bei stärkeren Stößen (z.B. Aufprall)

> Braucht \`adafruit_icm20x.mpy\` und \`adafruit_register/\` auf \`CIRCUITPY/lib/\`.`,
    },
    {
      id: 'when_distance', label: 'Wenn Abstand …', colour: EVENT_COLOUR, section: 'Ereignisse',
      tooltip: 'Startet, sobald der gemessene Abstand die Bedingung erfüllt',
      doc: `Misst laufend den Abstand mit dem Ultraschallsensor und startet, **sobald**
die Bedingung erfüllt wird – z.B. "Abstand < 20 cm" wenn sich jemand nähert.
Feuert einmal beim Wahr-Werden, nicht dauernd.`,
    },
    {
      id: 'when_light', label: 'Wenn Helligkeit …', colour: EVENT_COLOUR, section: 'Ereignisse',
      tooltip: 'Startet, sobald die Helligkeit (0–100 %) die Bedingung erfüllt',
      doc: `Überwacht den Lichtsensor (0 % = dunkel, 100 % = hell) und startet, sobald
die Bedingung erfüllt wird – z.B. Licht einschalten, wenn es dunkel wird.`,
    },
    {
      id: 'when_temperature', label: 'Wenn Temperatur …', colour: EVENT_COLOUR, section: 'Ereignisse',
      tooltip: 'Startet, sobald die Temperatur (DHT11) die Bedingung erfüllt',
      doc: `Überwacht die Temperatur (DHT11-Sensor) und startet, sobald die Bedingung
erfüllt wird – z.B. einen Lüfter-Motor starten, wenn es wärmer als 28 °C wird.`,
    },
    {
      id: 'when_humidity', label: 'Wenn Luftfeuchtigkeit …', colour: EVENT_COLOUR, section: 'Ereignisse',
      tooltip: 'Startet, sobald die Luftfeuchtigkeit (DHT11) die Bedingung erfüllt',
      doc: `Überwacht die Luftfeuchtigkeit (DHT11-Sensor, 0–100 %) und startet, sobald
die Bedingung erfüllt wird – z.B. eine Warn-LED bei zu trockener Luft.`,
    },

    // ── Steuerung (Blockly-Standard) ──
    {
      id: 'controls_repeat_ext', label: 'wiederhole … mal', colour: CONTROL_COLOUR, section: 'Steuerung',
      doc: `Wiederholt die Blöcke im Inneren **so oft, wie du angibst** – z.B. 10-mal
blinken. Danach geht das Programm dahinter weiter.`,
    },
    {
      id: 'controls_whileUntil', label: 'wiederhole solange / bis', colour: CONTROL_COLOUR, section: 'Steuerung',
      doc: `Wiederholt die Blöcke im Inneren, **solange** eine Bedingung wahr ist –
oder **bis** sie wahr wird (im Dropdown umschaltbar).`,
    },

    // ── Logik (Blockly-Standard) ──
    {
      id: 'controls_if', label: 'falls … mache', colour: LOGIC_COLOUR, section: 'Logik',
      doc: `Führt die Blöcke im Inneren nur aus, **wenn** die Bedingung wahr ist –
z.B. "falls Taster gedrückt → LED an".

Mit dem **Zahnrad** am Block kannst du ein **sonst** ergänzen: Das läuft immer
dann, wenn die Bedingung **nicht** erfüllt ist.`,
    },
    {
      id: 'logic_compare', label: 'Vergleich (= < >)', colour: LOGIC_COLOUR, section: 'Logik',
      doc: `Vergleicht zwei Werte und liefert **wahr** oder **falsch** – z.B.
"Temperatur > 25". Passt in jeden Bedingungs-Slot (falls, warte bis, solange …).`,
    },
    {
      id: 'logic_operation', label: 'und / oder', colour: LOGIC_COLOUR, section: 'Logik',
      doc: `Verbindet zwei Bedingungen: **und** ist nur wahr, wenn beide stimmen –
**oder** schon, wenn eine stimmt. Z.B. "dunkel **und** Bewegung erkannt".`,
    },
    {
      id: 'logic_negate', label: 'nicht', colour: LOGIC_COLOUR, section: 'Logik',
      doc: `Dreht eine Bedingung um: aus wahr wird falsch und umgekehrt –
z.B. "**nicht** Taster gedrückt".`,
    },
    {
      id: 'logic_boolean', label: 'wahr / falsch', colour: LOGIC_COLOUR, section: 'Logik',
      doc: `Der feste Wert **wahr** oder **falsch** – zum Testen oder als Startwert
für eine Variable.`,
    },

    // ── Mathe (Blockly-Standard) ──
    {
      id: 'math_number', label: 'Zahl', colour: MATH_COLOUR, section: 'Mathe',
      doc: `Eine einfache Zahl. Reinklicken und eintippen – auch Kommazahlen
gehen (mit Punkt: \`0.5\`).`,
    },
    {
      id: 'math_arithmetic', label: 'Rechnen (+ − × ÷)', colour: MATH_COLOUR, section: 'Mathe',
      doc: `Rechnet mit zwei Werten: plus, minus, mal, geteilt oder hoch.
Auch Sensorwerte kannst du hier einsetzen – z.B. "Abstand ÷ 2".`,
    },
    {
      id: 'math_single', label: 'Wurzel, Betrag …', colour: MATH_COLOUR, section: 'Mathe',
      doc: `Rechnet mit **einer** Zahl: Quadratwurzel, Betrag (Vorzeichen weg),
Vorzeichen umdrehen und mehr – im Dropdown wählbar.`,
    },
    {
      id: 'math_constrain', label: 'begrenze Zahl', colour: MATH_COLOUR, section: 'Mathe',
      doc: `Hält eine Zahl in einem Bereich fest: Ist sie kleiner als das Minimum,
kommt das Minimum heraus – ist sie größer als das Maximum, das Maximum.
Praktisch, damit z.B. ein Tempo nie über 100 % rutscht.`,
    },
    {
      id: 'math_random_int', label: 'Zufallszahl', colour: MATH_COLOUR, section: 'Mathe',
      doc: `Würfelt eine **ganze Zufallszahl** zwischen den beiden Grenzen (beide
eingeschlossen) – z.B. 1 bis 6 für einen Würfel.`,
    },

    // ── Variablen ──
    {
      id: 'variables_set', label: 'setze Variable auf …', colour: VAR_COLOUR, section: 'Variablen',
      doc: `Eine **Variable** ist ein Merkzettel mit Namen, auf dem dein Programm
einen Wert speichert – z.B. einen Punktestand. Dieser Block schreibt einen
neuen Wert auf den Merkzettel (der alte wird überschrieben).

Neue Variablen legst du in der Toolbox unter **Variablen** mit dem Knopf an.`,
    },
    {
      id: 'variables_get', label: 'Variable (Wert holen)', colour: VAR_COLOUR, section: 'Variablen',
      doc: `Liefert den aktuell gespeicherten Wert der Variable – einsetzbar überall,
wo eine Zahl oder ein Text erwartet wird.`,
    },
    {
      id: 'var_increase', label: 'erhöhe … um …', colour: VAR_COLOUR, section: 'Variablen',
      doc: `Zählt die Variable um den angegebenen Wert **hoch** – z.B. bei jedem
Tastendruck "erhöhe Punkte um 1".`,
    },
    {
      id: 'var_decrease', label: 'verringere … um …', colour: VAR_COLOUR, section: 'Variablen',
      doc: `Zählt die Variable um den angegebenen Wert **runter** – z.B. "verringere
Leben um 1", wenn etwas schiefgeht.`,
    },

    // ── Text ──
    {
      id: 'text', label: 'Text', colour: TEXT_COLOUR, section: 'Text',
      doc: `Ein Stück Text in Anführungszeichen – z.B. für die Ausgabe im Seriellen
Monitor oder auf dem LCD.`,
    },
    {
      id: 'text_verbinden', label: 'verbinde Texte', colour: TEXT_COLOUR, section: 'Text',
      doc: `Hängt zwei Dinge zu einem Text zusammen – z.B. \`"Temperatur: "\` und den
Messwert. So werden Ausgaben lesbar.`,
    },
    {
      id: 'text_length', label: 'Länge von Text', colour: TEXT_COLOUR, section: 'Text',
      doc: `Zählt, aus wie vielen Zeichen ein Text besteht (Leerzeichen zählen mit).`,
    },

    // ── 8×8 Matrix (Lichter) ──
    {
      id: 'matrix_on', label: 'Matrix anschalten', colour: MATRIX_COLOUR, section: 'Lichter',
      doc: `Schaltet **alle 64 LEDs** der 8×8-Matrix in einer Farbe an.
Datenkabel der Matrix an einen der Anschlüsse S1–S4.`,
    },
    {
      id: 'matrix_off', label: 'Matrix ausschalten', colour: MATRIX_COLOUR, section: 'Lichter',
      doc: `Macht die ganze Matrix dunkel (alle LEDs aus).`,
    },
    {
      id: 'matrix_brightness', label: 'Matrix-Helligkeit', colour: MATRIX_COLOUR, section: 'Lichter',
      doc: `Stellt ein, wie hell die Matrix leuchtet (0–100 %). Tipp: 10–30 % reichen
meist völlig – volle Helligkeit blendet und braucht viel Strom.`,
    },
    {
      id: 'matrix_symbol', label: 'zeige Symbol', colour: MATRIX_COLOUR, section: 'Lichter',
      doc: `Zeigt ein fertiges Symbol (Herz, Smiley, Pfeil …) auf der Matrix –
Symbol und Farbe im Dropdown wählen.`,
    },
    {
      id: 'matrix_set_pixel', label: 'Pixel setzen', colour: MATRIX_COLOUR, section: 'Lichter',
      doc: `Schaltet **eine einzelne LED** an: Spalte (x) und Zeile (y) von 0 bis 7
angeben, dazu die Farbe. So kannst du Punkt für Punkt zeichnen oder animieren.`,
    },
    {
      id: 'matrix_draw', label: 'zeige LEDs (malen)', colour: MATRIX_COLOUR, section: 'Lichter',
      doc: `Male dein eigenes Bild: Im 8×8-Raster auf dem Block die Punkte anklicken,
die leuchten sollen, und eine Farbe wählen.`,
    },
  ];

  // ── Doku pro Board-Profil (Port-Tabelle wird dynamisch angehängt) ──────────

  const BOARD_DOCS = {
    maker_pi_rp2040: `Das Standard-Board von makerSpaceOS: ein RP2040 mit ganz viel
schon eingebaut – einfach USB anstecken und loslegen.

## Eingebaut auf dem Board

- **2 Taster** B1 und B2
- **Summer** (Piepser) für Töne
- **2 NeoPixel** (bunte LEDs)
- **2 Motor-Anschlüsse** M1 und M2 (mit Test-Tastern)
- **4 Servo-Anschlüsse** S1 bis S4
- **7 Grove-Ports** für Sensoren und Aktoren
- **Batterie-Messung** über den Batterie-Block

## ⚠️ Wichtig: Motor-Stromversorgung

**Maximal 6 Volt** an den Versorgungseingang (VIN/Batterie-Anschluss) –
**keine 9-V-Blöcke!** Das zerstört das Board. Geeignet: 4× AA-Batterien (6 V)
oder ein LiPo-Akku (3,7 V).

## Gut zu wissen

- Die Grove-Ports liefern **3,3 V** (nicht 5 V). Der Grove-LCD **V4** braucht
  5 V und bleibt an 3,3 V leer – Version **V5** funktioniert direkt.
- Analoge Sensoren (Lichtsensor, Drehregler, Luftqualität …) gehören an die
  **Analog-Ports Grove 5, 6 oder 7**.`,

    lolin_s2_mini: `Ein kleines, günstiges ESP32-S2-Board – ohne eingebaute Extras.
Taster, Motoren und NeoPixel vom Maker-Pi gibt es hier nicht, dafür viele
frei nutzbare Pins.

## Anders als beim Maker-Pi

- **Keine** Onboard-Taster, **kein** Motortreiber, **kein** NeoPixel onboard
  (nur eine blaue LED an IO15).
- Die Ports sind **Pin-Paare** (z.B. "2/3" = IO2 und IO3) statt nummerierter
  Grove-Buchsen – Sensoren werden direkt oder über ein Steckbrett angeschlossen.
- Analog können die Pins **IO1 bis IO10** (auch mit WLAN nutzbar).
- I2C-Geräte (LCD, Bewegungssensor …) funktionieren an **jedem** Pin-Paar.

## Gut zu wissen

Die Bibliotheken (\`makerspaceos.py\`, \`asyncio\`, \`adafruit_ticks\`, \`neopixel\`)
müssen wie beim Maker-Pi auf \`CIRCUITPY/lib/\` liegen.`,

    esp32_d1_r32: `Ein ESP32 im Arduino-Uno-Format (AZ-Delivery) mit aufgestecktem
**Grove Base Shield** – dadurch gibt es wieder echte Grove-Buchsen.

## ⚠️ Wichtig: Schalter auf 3V3

Der **VCC-Schalter des Shields muss auf 3V3** stehen – die ESP32-Pins vertragen
keine 5 Volt!

## Besonderheiten der Ports

- Die Port-Namen (D2–D8, A0–A3, I2C) entsprechen dem **Aufdruck auf dem Shield**.
- **Benachbarte D-Ports teilen sich einen Pin** (Grove-Verdrahtung) – also nicht
  zwei direkt nebeneinanderliegende D-Ports gleichzeitig benutzen.
- **A2 und A3** können nur **lesen** (Sensoren ja, LEDs/Summer nein).
- Das Signal von **A0** hängt an der **Onboard-LED** – die blinkt dann mit.
- **I2C** (LCD, Bewegungssensor …) nur an der fest verdrahteten I2C-Buchse.

## Gut zu wissen

Das Board hat **kein CIRCUITPY-Laufwerk** am Computer. Bibliotheken kommen per
Thonny auf das Board – oder man flasht das fertige Komplett-Image
\`firmware/makerSpaceOS_firmware_esp32-d1-r32.bin\` (enthält schon alles).
Ausführliche Anleitung mit Fotos: \`docs/esp32-d1-r32.md\` im Projekt.`,
  };

  // ── Mini-Markdown → HTML (Headings, Listen, Code, Bilder, Zitate) ─────────

  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Relative Bildpfade (../images/x.png) gegen den Ordner der .md auflösen.
  function resolveSrc(src, baseDir) {
    if (/^(https?:|data:|\/)/.test(src)) return src;
    const parts = ((baseDir || '') + '/' + src).split('/').filter(p => p && p !== '.');
    const out = [];
    for (const p of parts) {
      if (p === '..') out.pop(); else out.push(p);
    }
    return out.join('/');
  }

  function mdInline(s, baseDir) {
    let h = escHtml(s);
    h = h.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g,
      (_, alt, src) => `<img src="${resolveSrc(src, baseDir)}" alt="${alt}" loading="lazy">`);
    h = h.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>');
    h = h.replace(/`([^`]+)`/g, '<code>$1</code>');
    h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    return h;
  }

  function mdToHtml(md, baseDir) {
    const lines = String(md).split('\n');
    const out = [];
    let para = [], list = null, quote = [], code = null;

    const flushPara  = () => { if (para.length)  { out.push('<p>' + mdInline(para.join(' '), baseDir) + '</p>'); para = []; } };
    const flushList  = () => { if (list) { out.push(`<${list.tag}>` + list.items.map(i => '<li>' + mdInline(i, baseDir) + '</li>').join('') + `</${list.tag}>`); list = null; } };
    const flushQuote = () => { if (quote.length) { out.push('<blockquote>' + mdInline(quote.join(' '), baseDir) + '</blockquote>'); quote = []; } };
    const flushAll   = () => { flushPara(); flushList(); flushQuote(); };

    for (const raw of lines) {
      const line = raw.replace(/\s+$/, '');

      if (code !== null) {
        if (/^```/.test(line)) { out.push('<pre><code>' + escHtml(code.join('\n')) + '</code></pre>'); code = null; }
        else code.push(raw);
        continue;
      }
      if (/^```/.test(line)) { flushAll(); code = []; continue; }

      if (!line.trim()) { flushAll(); continue; }

      const hm = line.match(/^(#{1,4})\s+(.*)$/);
      if (hm) {
        flushAll();
        const lvl = Math.min(hm[1].length + 2, 5);   // # → h3 (h1/h2 gehören der Seite)
        out.push(`<h${lvl}>` + mdInline(hm[2], baseDir) + `</h${lvl}>`);
        continue;
      }
      if (/^(-{3,}|\*{3,})$/.test(line.trim())) { flushAll(); out.push('<hr>'); continue; }

      const qm = line.match(/^>\s?(.*)$/);
      if (qm) { flushPara(); flushList(); quote.push(qm[1]); continue; }

      const um = line.match(/^[-*]\s+(.*)$/);
      const om = line.match(/^\d+[.)]\s+(.*)$/);
      if (um || om) {
        flushPara(); flushQuote();
        const tag = um ? 'ul' : 'ol';
        if (!list || list.tag !== tag) { flushList(); list = { tag, items: [] }; }
        list.items.push((um || om)[1]);
        continue;
      }
      // Fortsetzungszeile einer Liste (eingerückt)
      if (list && /^\s{2,}\S/.test(raw)) { list.items[list.items.length - 1] += ' ' + line.trim(); continue; }

      flushList(); flushQuote();
      para.push(line.trim());
    }
    flushAll();
    if (code !== null) out.push('<pre><code>' + escHtml(code.join('\n')) + '</code></pre>');
    return out.join('\n');
  }

  // ── Einträge sammeln (Boards + Grundlagen + Hardware-Blöcke) ──────────────

  const GROVE_ROLE_LABELS = {
    digital: 'digitaler Grove-Port',
    analog:  'analoger Grove-Port',
    i2c:     'I2C-Port',
    '2pin':  'Grove-Port (beide Pins)',
  };

  let _entries = null;          // key → entry
  let _sections = null;         // [{label, colour, groups:[{sub, keys:[]}]}]

  function buildEntries() {
    if (_entries) return;
    _entries = new Map();
    _sections = [];

    // 1. Boards
    const boardGroup = { sub: null, keys: [] };
    const boardIds = [BOARD_ID, ...Object.keys(BOARD_PROFILES).filter(id => id !== BOARD_ID)];
    for (const id of boardIds) {
      const p = BOARD_PROFILES[id];
      const key = 'board:' + id;
      _entries.set(key, {
        key, kind: 'board', boardId: id,
        label: p.name + (id === BOARD_ID ? '  · aktiv' : ''),
        colour: '#64748B',
        tooltip: '',
        doc: BOARD_DOCS[id] || '',
        baseDir: '',
      });
      boardGroup.keys.push(key);
    }
    _sections.push({ label: 'Boards', colour: '#64748B', groups: [boardGroup] });

    // Board-spezifische Ausblendungen (wie in der Toolbox)
    const hideCats = new Set(BOARD.hideCategories    || []);
    const hideSubs = new Set(BOARD.hideSubCategories || []);
    const hideIds  = new Set(BOARD.hideBlockIds      || []);

    const addCoreEntry = (c, group) => {
      const key = 'block:' + c.id;
      _entries.set(key, {
        key, kind: 'core', blockType: c.id,
        label: c.label, colour: c.colour, section: c.section,
        tooltip: c.tooltip || '', doc: c.doc || '', baseDir: '',
      });
      group.keys.push(key);
    };

    // 2. Kern- und Standard-Blöcke, gruppiert wie die Toolbox
    for (const sec of CORE_SECTIONS) {
      const group = { sub: null, keys: [] };
      for (const c of CORE_DOCS) {
        if (c.section === sec.name && !hideIds.has(c.id)) addCoreEntry(c, group);
      }
      if (group.keys.length) {
        _sections.push({ label: sec.name, colour: sec.colour, groups: [group] });
      }
    }

    // 3. Hardware-Blöcke aus BLOCKS_DB – gefiltert wie die Toolbox

    for (const catDef of BLOCKS_CATALOG.categories) {
      if (hideCats.has(catDef.id)) continue;
      const catBlocks = BLOCKS_DB.filter(b => b.blockCategory === catDef.id && !hideIds.has(b.id));
      if (!catBlocks.length) continue;

      const groups = [];
      const addBlocks = (sub, defs) => {
        if (!defs.length) return;
        const g = { sub, keys: [] };
        for (const def of defs) {
          const key = 'block:' + def.id;
          const dir = def._file ? 'components/' + def._file.split('/').slice(0, -1).join('/') : 'components';
          _entries.set(key, {
            key, kind: 'block', blockType: def.id, def,
            label: def.label || def.id,
            colour: def.colour || catDef.colour,
            tooltip: def.tooltip || '',
            doc: def.doc || '',
            baseDir: dir,
          });
          g.keys.push(key);
        }
        groups.push(g);
      };

      if (catDef.subCategories && catDef.subCategories.length) {
        for (const sc of catDef.subCategories) {
          if (hideSubs.has(sc)) continue;
          addBlocks(sc, catBlocks.filter(b => b.subCategory === sc));
        }
        addBlocks(null, catBlocks.filter(b => !b.subCategory || !catDef.subCategories.includes(b.subCategory)));
      } else {
        addBlocks(null, catBlocks);
      }

      if (groups.length) _sections.push({ label: catDef.label, colour: catDef.colour, groups });
    }

    // 4. 8×8-Matrix-Blöcke (matrix.js) in die Lichter-Sektion mergen –
    //    wie in der Toolbox als eigene Untergruppe.
    const matrixGroup = { sub: '8×8 Matrix', keys: [] };
    for (const c of CORE_DOCS) {
      if (c.section === 'Lichter' && !hideIds.has(c.id)) addCoreEntry(c, matrixGroup);
    }
    if (matrixGroup.keys.length) {
      const lichter = _sections.find(s => s.label === 'Lichter');
      if (lichter) lichter.groups.push(matrixGroup);
      else _sections.push({ label: 'Lichter', colour: MATRIX_COLOUR, groups: [matrixGroup] });
    }
  }

  function entryForBlockType(type) {
    buildEntries();
    return _entries.get('block:' + type) || null;
  }

  // ── Overlay-DOM ─────────────────────────────────────────────────────────────

  let _root = null, _activeItem = null;

  function buildDom() {
    if (_root) return;
    _root = document.createElement('div');
    _root.id = 'library';
    _root.innerHTML = `
      <div id="library-header">
        <span id="library-title">📚 Bauteil-Bibliothek</span>
        <input id="library-search" type="search" placeholder="Suchen… (z.B. Taster, LED, Abstand)" autocomplete="off">
        <span id="library-count"></span>
        <button id="library-close" class="btn btn-ghost" title="Bibliothek schließen (Esc)">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18 18 6M6 6l12 12"/></svg>
          Schließen
        </button>
      </div>
      <div id="library-main">
        <div id="library-tree"></div>
        <div id="library-detail">
          <div id="library-placeholder">
            <div class="lib-ph-icon">📦</div>
            <p>Wähle links ein Bauteil oder einen Block aus –<br>hier erscheint dann die Erklärung dazu.</p>
          </div>
        </div>
      </div>`;
    document.body.appendChild(_root);

    _root.querySelector('#library-close').addEventListener('click', closeLibrary);
    _root.querySelector('#library-search').addEventListener('input', function () {
      renderTree(this.value);
    });
  }

  // Esc schließt zuerst die Bibliothek, sonst das Erklärungs-Panel.
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (_root && _root.classList.contains('open')) closeLibrary();
    else if (_drawer && _drawer.classList.contains('open')) closeDocsDrawer();
  });

  function matches(entry, q) {
    if (!q) return true;
    const hw = entry.def && entry.def.hardware ? (entry.def.hardware.commonName || '') : '';
    return (entry.label + ' ' + entry.tooltip + ' ' + entry.doc + ' ' + hw)
      .toLowerCase().includes(q);
  }

  function renderTree(filter) {
    buildEntries();
    const tree = _root.querySelector('#library-tree');
    tree.innerHTML = '';
    const q = (filter || '').trim().toLowerCase();
    let total = 0;

    for (const section of _sections) {
      const items = [];
      for (const group of section.groups) {
        const visible = group.keys.map(k => _entries.get(k)).filter(e => matches(e, q));
        if (!visible.length) continue;
        if (group.sub) {
          const lbl = document.createElement('div');
          lbl.className = 'lib-subcat';
          lbl.textContent = group.sub;
          items.push(lbl);
        }
        for (const e of visible) {
          const el = document.createElement('div');
          el.className = 'lib-item';
          el.dataset.key = e.key;
          el.textContent = e.label;
          el.addEventListener('click', () => selectEntry(e.key));
          items.push(el);
          total++;
        }
      }
      if (!items.length) continue;

      const hdr = document.createElement('div');
      hdr.className = 'lib-cat';
      hdr.innerHTML = `<span class="cb-cat-square" style="background:${section.colour}"></span>`
        + `<span>${escHtml(section.label)}</span>`;
      tree.appendChild(hdr);
      for (const el of items) tree.appendChild(el);
    }

    _root.querySelector('#library-count').textContent =
      q ? `${total} Treffer` : `${total} Einträge`;
  }

  // ── Detail-Karte (gemeinsam für Galerie und Erklärungs-Panel) ──────────────

  function cardHtml(entry) {
    const parts = [];

    parts.push(`<div class="lib-card-header" style="border-left-color:${entry.colour}">
      <div class="lib-card-label">${escHtml(entry.label)}</div>
      ${cardSubtitle(entry)}
    </div>`);

    const chips = cardChips(entry);
    if (chips) parts.push(`<div class="lib-chips">${chips}</div>`);

    if (entry.tooltip) parts.push(`<p class="lib-intro">${escHtml(entry.tooltip)}</p>`);
    if (entry.doc)     parts.push(`<div class="lib-doc">${mdToHtml(entry.doc, entry.baseDir)}</div>`);
    if (!entry.tooltip && !entry.doc) {
      parts.push('<p class="lib-intro">Für diesen Eintrag gibt es noch keine ausführliche Erklärung.</p>');
    }

    if (entry.kind === 'board') parts.push(boardPortTable(entry.boardId));

    return `<div class="lib-card">${parts.join('\n')}</div>`;
  }

  function selectEntry(key, scrollIntoView) {
    const entry = _entries.get(key);
    if (!entry) return;

    if (_activeItem) _activeItem.classList.remove('active');
    _activeItem = _root.querySelector(`.lib-item[data-key="${key}"]`);
    if (_activeItem) {
      _activeItem.classList.add('active');
      if (scrollIntoView) _activeItem.scrollIntoView({ block: 'center' });
    }

    const detail = _root.querySelector('#library-detail');
    detail.innerHTML = cardHtml(entry);
    detail.scrollTop = 0;
  }

  function cardSubtitle(entry) {
    if (entry.kind === 'board') return '<div class="lib-card-sub">Board-Profil</div>';
    const def = entry.def;
    if (def && def.hardware && def.hardware.commonName) {
      return `<div class="lib-card-sub">${escHtml(def.hardware.commonName)}</div>`;
    }
    return '';
  }

  function cardChips(entry) {
    const chips = [];
    const def = entry.def;
    if (def) {
      if (def.blockCategory) {
        chips.push(escHtml(def.blockCategory + (def.subCategory ? ' · ' + def.subCategory : '')));
      }
      const roles = new Set((def.inputs || [])
        .filter(i => i.fieldType === 'grove_dropdown')
        .map(i => GROVE_ROLE_LABELS[i.groveRole || 'digital']));
      for (const r of roles) chips.push('🔌 ' + escHtml(r));
      if (def.hardware && def.hardware.kitStandard) chips.push('✓ im Kit enthalten');
    } else if (entry.kind === 'core') {
      chips.push(escHtml(entry.section === 'Lichter' ? 'Lichter · 8×8 Matrix' : (entry.section || 'Grundlagen')));
    }
    return chips.map(c => `<span class="lib-chip">${c}</span>`).join('');
  }

  function boardPortTable(boardId) {
    const p = BOARD_PROFILES[boardId];
    if (!p || !p.grovePorts || !p.grovePorts.length) return '';
    const rows = p.grovePorts.map(port => {
      const kann = [
        'digital',
        port.analog ? 'analog' : null,
        port.i2c ? 'I2C' : null,
      ].filter(Boolean).join(', ');
      return `<tr><td>${escHtml(port.label)}</td><td><code>${escHtml(port.signal)}</code>`
        + ` + <code>${escHtml(port.pin1)}</code></td><td>${kann}</td></tr>`;
    }).join('');
    return `<h3>Anschlüsse (Ports)</h3>
      <table class="lib-table">
        <thead><tr><th>Port</th><th>Pins (Signal + zweiter Pin)</th><th>Kann</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  // ── Erklärungs-Panel (angedockt rechts, wie der Code-Bereich) ──────────────

  let _drawer = null, _drawerKey = null;

  function _resizeWorkspace() {
    try {
      if (typeof workspace !== 'undefined' && workspace &&
          typeof Blockly !== 'undefined' && Blockly.svgResize) {
        Blockly.svgResize(workspace);
      }
    } catch (_) { /* Workspace evtl. noch nicht initialisiert */ }
  }

  function buildDrawer() {
    if (_drawer) return;
    _drawer = document.createElement('div');
    _drawer.id = 'docs-panel';
    _drawer.innerHTML = `
      <div id="docs-panel-header">
        <span>❓ Erklärung</span>
        <button id="docs-panel-close" title="Erklärung schließen (Esc)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18 18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div id="docs-panel-body"></div>
      <div id="docs-panel-footer">
        <button id="docs-panel-library" class="btn btn-ghost">📚 In der Bibliothek öffnen</button>
      </div>`;
    // Ins Haupt-Layout einhängen (ganz rechts, neben Code-Panel) –
    // Fallback body, falls #main fehlt (z.B. in Tests).
    (document.getElementById('main') || document.body).appendChild(_drawer);

    _drawer.querySelector('#docs-panel-close').addEventListener('click', closeDocsDrawer);
    _drawer.querySelector('#docs-panel-library').addEventListener('click', () => {
      openLibrary(_drawerKey);
    });
  }

  window.openDocsDrawer = function (key) {
    buildEntries();
    const entry = _entries.get(key);
    if (!entry) return;
    buildDrawer();
    _drawerKey = key;
    _drawer.querySelector('#docs-panel-body').innerHTML = cardHtml(entry);
    _drawer.querySelector('#docs-panel-body').scrollTop = 0;
    if (!_drawer.classList.contains('open')) {
      _drawer.classList.add('open');
      _resizeWorkspace();
    }
  };

  window.closeDocsDrawer = function () {
    if (_drawer && _drawer.classList.contains('open')) {
      _drawer.classList.remove('open');
      _resizeWorkspace();
    }
  };

  // ── Öffnen / Schließen ──────────────────────────────────────────────────────

  window.openLibrary = function (key) {
    buildDom();
    buildEntries();
    if (!_root.querySelector('#library-tree').childElementCount) renderTree('');
    _root.classList.add('open');
    if (key && _entries.has(key)) {
      const search = _root.querySelector('#library-search');
      if (search.value) { search.value = ''; renderTree(''); }
      selectEntry(key, true);
    } else if (!_activeItem) {
      selectEntry('board:' + BOARD_ID, true);
    }
  };

  window.closeLibrary = function () {
    if (_root) _root.classList.remove('open');
  };

  // ── Rechtsklick-Menü: "❓ Wie funktioniert das?" ────────────────────────────

  if (typeof Blockly !== 'undefined' && Blockly.ContextMenuRegistry) {
    // Eingebauten "Hilfe"-Eintrag entfernen: Er erscheint nur bei Blockly-
    // Standard-Blöcken (helpUrl) und verlinkt auf englische Blockly-/Wikipedia-
    // Seiten – stattdessen gibt es überall "❓ Wie funktioniert das?".
    // Blockly registriert seine Default-Einträge u.U. erst bei inject() (nach
    // diesem Skript), daher zusätzlich lazy in preconditionFn entfernen.
    function removeBuiltinBlockHelp() {
      const reg = Blockly.ContextMenuRegistry.registry;
      if (reg.getItem && reg.getItem('blockHelp')) reg.unregister('blockHelp');
    }
    removeBuiltinBlockHelp();

    Blockly.ContextMenuRegistry.registry.register({
      id: 'makerspaceos_block_help',
      scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
      weight: 100,   // ganz unten im Menü
      displayText: () => '❓ Wie funktioniert das?',
      preconditionFn: (scope) => {
        removeBuiltinBlockHelp();
        buildEntries();
        const type = scope.block && scope.block.type;
        return type && _entries.has('block:' + type) ? 'enabled' : 'hidden';
      },
      callback: (scope) => openDocsDrawer('block:' + scope.block.type),
    });
  }

  // ── Header-Button ───────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-library');
    if (btn) btn.addEventListener('click', () => openLibrary());
  });

})();
