#!/usr/bin/env node
/**
 * build_lib_manifest.js – Erzeugt js/lib_manifest.js aus dem lib/-Ordner
 *
 * Durchsucht lib/ rekursiv (__pycache__ ausgenommen), berechnet pro Datei
 * Größe + SHA-256 und daraus das libVersion-Aggregat: SHA-256 über die
 * sortierten "Pfad:Datei-Hash"-Paare. Das Aggregat speichert
 * js/board_setup.js als .makerspaceos_lib_version auf dem CIRCUITPY-Volumen
 * des Boards – so ist der Start-Check nur noch ein String-Vergleich, statt
 * jeder Datei einzeln zu hashen.
 *
 * Aufruf:  node scripts/build_lib_manifest.js
 * Läuft automatisch am Ende von scripts/build_blocks.js mit.
 */

const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const ROOT    = path.join(__dirname, '..');
const LIB_DIR = path.join(ROOT, 'lib');
const OUT     = path.join(ROOT, 'js', 'lib_manifest.js');

function sha256Hex(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

// Rekursiver Walk: liefert [{ path, size, sha256 }] mit Schrägstrich-Pfaden.
function walk(dir, prefix) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? prefix + '/' + entry.name : entry.name;
    if (entry.isDirectory()) {
      if (entry.name === '__pycache__') continue;
      files.push(...walk(path.join(dir, entry.name), rel));
    } else if (entry.isFile()) {
      const buf = fs.readFileSync(path.join(dir, entry.name));
      files.push({ path: rel.split(path.sep).join('/'), size: buf.length, sha256: sha256Hex(buf) });
    }
  }
  return files;
}

const files = walk(LIB_DIR, '').sort((a, b) => a.path.localeCompare(b.path));

// Aggregat: ändert sich bei jeder Datei-Änderung in lib/ (Inhalt ODER Name).
const libVersion = sha256Hex(Buffer.from(files.map(f => `${f.path}:${f.sha256}`).join('\n')));

const out = [
  '// GENERIERT von scripts/build_lib_manifest.js – NICHT MANUELL BEARBEITEN!',
  `// Generiert am ${new Date().toISOString()} aus lib/ (${files.length} Dateien).`,
  'window.LIB_MANIFEST = {',
  `  generatedAt: ${JSON.stringify(new Date().toISOString())},`,
  `  libVersion: "${libVersion}",`,
  `  files: ${JSON.stringify(files, null, 2).replace(/\n/g, '\n  ')},`,
  '};',
  '',
].join('\n');

fs.writeFileSync(OUT, out, 'utf8');
console.log(`✅ ${files.length} lib/-Dateien → ${path.relative(process.cwd(), OUT)} (libVersion ${libVersion.slice(0, 16)}…)`);
