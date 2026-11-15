---
id: mp3_control
blockCategory: Aktionen
component: grove_mp3
subCategory: Ton
label: "Musik steuern"
label_en: "control music"
colour: "#DC2626"
tooltip: "Hält die Musik an, spielt weiter, stoppt oder springt zum nächsten/vorherigen Titel"
tooltip_en: "Pauses, resumes or stops the music, or skips to the next/previous track"
blockType: statement
inline: true
inputs:
  - label: "Port:"
    label_en: "port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: uart
  - label: ""
    name: ACTION
    fieldType: options_dropdown
    options:
      - label: "⏸ Pause"
        label_en: "⏸ pause"
        value: "0x0E"
      - label: "▶ weiter"
        label_en: "▶ resume"
        value: "0x0D"
      - label: "⏹ Stopp"
        label_en: "⏹ stop"
        value: "0x16"
      - label: "⏭ nächster Titel"
        label_en: "⏭ next track"
        value: "0x01"
      - label: "⏮ vorheriger Titel"
        label_en: "⏮ previous track"
        value: "0x02"
hardware:
  commonName: "Grove-MP3 v2.0 (KT403A)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Grove-MP3 v2.0 (MP3-Player)

Spielt MP3-Dateien von einer microSD-Karte über Lautsprecher oder Kopfhörer.

**Verdrahtung:** Grove-Kabel an **Grove 1, 3 oder 4** (MAKER-PI-RP2040) – das Modul braucht einen seriellen Port. Läuft auch an den 3,3 V der Grove-Ports.

**SD-Karte vorbereiten:**
- microSD bis 8 GB, formatiert als FAT32
- Dateien direkt ins Hauptverzeichnis, Namen `0001.mp3`, `0002.mp3`, `0003.mp3` …
- ⚠ „Titel Nr.“ zählt in der **Reihenfolge, in der die Dateien auf die Karte kopiert wurden** – am besten einzeln und der Reihe nach kopieren.

**Blöcke:** Titel abspielen, Pause/Weiter/Stopp/Nächster/Vorheriger, Lautstärke (0–100 %).

<!-- lang:en -->

# Grove-MP3 v2.0 (MP3 player)

Plays MP3 files from a microSD card through a speaker or headphones.

**Wiring:** Grove cable to **Grove 1, 3 or 4** (MAKER-PI-RP2040) – the module needs a serial port. Also works with the 3.3 V of the Grove ports.

**Preparing the SD card:**
- microSD up to 8 GB, formatted as FAT32
- files directly in the root folder, named `0001.mp3`, `0002.mp3`, `0003.mp3` …
- ⚠ “track no.” counts in the **order the files were copied to the card** – best copy them one by one, in order.

**Blocks:** play track, pause/resume/stop/next/previous, volume (0–100 %).
