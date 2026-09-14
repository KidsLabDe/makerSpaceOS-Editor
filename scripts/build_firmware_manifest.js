#!/usr/bin/env node
/**
 * build_firmware_manifest.js – Erzeugt js/firmware_manifest.js aus firmware/*.uf2
 *
 * Sammelt alle UF2-Images (Pico/RP2040-Bootloader-Format) aus firmware/ mit
 * Größe + SHA-256. js/firmware_flash.js nutzt die Liste für den
 * Firmware-Dialog: Das gewählte Image wird per fetch() vom Server geladen,
 * gegen die Manifest-Prüfdaten verifiziert und per File System Access API
 * auf das UF2-Bootloader-Volume (RP2040/RPI-RP2) des Boards geschrieben –
 * der Bootloader validiert das Image und startet in die Firmware.
 *
 * Nicht-UF2-Dateien (z. B. ESP32 .bin) werden bewusst ausgeschlossen –
 * die können nicht per UF2/Mass-Storage geflasht werden.
 *
 * Aufruf:  node scripts/build_firmware_manifest.js
 * Läuft automatisch am Ende von scripts/build_blocks.js mit.
 */

const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const ROOT   = path.join(__dirname, '..');
const FW_DIR = path.join(ROOT, 'firmware');
const OUT    = path.join(ROOT, 'js', 'firmware_manifest.js');

function sha256Hex(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

const names = fs.existsSync(FW_DIR)
  ? fs.readdirSync(FW_DIR).filter((n) => n.toLowerCase().endsWith('.uf2'))
  : [];

const files = names.sort().map((name) => {
  const buf = fs.readFileSync(path.join(FW_DIR, name));
  return { name, size: buf.length, sha256: sha256Hex(buf) };
});

if (files.length === 0) {
  console.warn('⚠️  Keine .uf2-Dateien in firmware/ – leeres Manifest erzeugt');
}

const out = [
  '// GENERIERT von scripts/build_firmware_manifest.js – NICHT MANUELL BEARBEITEN!',
  `// Generiert am ${new Date().toISOString()} aus firmware/ (${files.length} UF2-Dateien).`,
  'window.FIRMWARE_MANIFEST = {',
  `  generatedAt: ${JSON.stringify(new Date().toISOString())},`,
  `  files: ${JSON.stringify(files, null, 2).replace(/\n/g, '\n  ')},`,
  '};',
  '',
].join('\n');

fs.writeFileSync(OUT, out, 'utf8');
console.log(`✅ ${files.length} UF2-Firmware(s) → ${path.relative(process.cwd(), OUT)}`);
