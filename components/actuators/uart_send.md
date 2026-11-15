---
id: uart_send
blockCategory: Pins
subCategory: ""
label: "📡 Seriell senden"
label_en: "📡 Serial send"
colour: "#64748B"
tooltip: "Schickt Text oder Bytes über eine serielle Verbindung (UART) an ein Modul – z. B. MP3-Player, Funkmodule oder andere Mikrocontroller"
tooltip_en: "Sends text or bytes over a serial connection (UART) to a module – e.g. MP3 players, radio modules or other microcontrollers"
blockType: statement
inline: true
inputs:
  - label: "📡 Seriell  Port:"
    label_en: "📡 Serial  port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: uart
  - label: "Tempo:"
    label_en: "speed:"
    name: BAUD
    fieldType: options_dropdown
    options:
      - label: "9600"
        value: "9600"
      - label: "19200"
        value: "19200"
      - label: "38400"
        value: "38400"
      - label: "57600"
        value: "57600"
      - label: "115200"
        value: "115200"
  - label: "als"
    label_en: "as"
    name: MODE
    fieldType: options_dropdown
    options:
      - label: "Text"
        label_en: "text"
        value: text
      - label: "Text + neue Zeile"
        label_en: "text + new line"
        value: line
      - label: "Bytes"
        label_en: "bytes"
        value: bytes
valueInputs:
  - name: DATA
    check: any
    label: "senden:"
    label_en: "send:"
    defaultValue: "Hallo"
    defaultValue_en: "Hello"
hardware:
  commonName: "Serielles Modul (UART)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Seriell senden (UART)

Schickt Daten über eine **serielle Verbindung** an ein angeschlossenes Modul. Viele Module (MP3-Player, Funk, GPS, andere Mikrocontroller) werden so gesteuert.

**Verdrahtung (Grove-Port):**
- weißes Kabel = **TX** (Board sendet) → RX des Moduls
- gelbes Kabel = **RX** (Board empfängt) → TX des Moduls
- Grove-Module von Seeed passen direkt.

**Welche Ports?** Am MAKER-PI-RP2040 nur **Grove 1, 3 und 4** (dort liegen die seriellen Schnittstellen). Grove 1 und 4 teilen sich eine Schnittstelle – nicht beide gleichzeitig benutzen. Auf den ESP32-Boards geht fast jeder Port.

**Tempo** (Baudrate) muss zum Modul passen – steht im Datenblatt, meist 9600.

**als …**
- **Text**: schickt den Text so, wie er ist.
- **Text + neue Zeile**: hängt ein Zeilenende (`\r\n`) an – viele Module warten darauf.
- **Bytes**: für Module mit Befehls-Codes. Eine Zahl = ein Byte (0–255), eine Liste = mehrere Bytes, ein Text wird als Hex gelesen, z. B. `7E FF 06 0D 00 00 00 EF`.

<!-- lang:en -->

# Serial send (UART)

Sends data over a **serial connection** to a connected module. Many modules (MP3 players, radio, GPS, other microcontrollers) are controlled this way.

**Wiring (Grove port):**
- white wire = **TX** (board sends) → RX of the module
- yellow wire = **RX** (board receives) → TX of the module
- Seeed Grove modules plug in directly.

**Which ports?** On the MAKER-PI-RP2040 only **Grove 1, 3 and 4** (that is where the serial interfaces are). Grove 1 and 4 share one interface – don't use both at the same time. On the ESP32 boards almost every port works.

**Speed** (baud rate) must match the module – see its datasheet, usually 9600.

**as …**
- **text**: sends the text as it is.
- **text + new line**: adds a line ending (`\r\n`) – many modules wait for it.
- **bytes**: for modules with command codes. A number = one byte (0–255), a list = several bytes, a text is read as hex, e.g. `7E FF 06 0D 00 00 00 EF`.
