#!/usr/bin/env node
/**
 * build_examples.js – Erzeugt js/examples_db.js aus examples/projects/
 *
 * examples/projects/examples.json listet die Beispielprojekte (Datei, Board,
 * Titel/Beschreibung DE + EN). Die zugehörigen XML-Dateien (Blockly-Export über
 * „Datei exportieren“) werden direkt in die JS-Datei eingebettet – so lädt das
 * Projekt-Menü die Beispiele auch, wenn der Editor per file:// geöffnet ist
 * (fetch() ginge dort nicht).
 *
 * Neues Beispiel: Projekt im Editor exportieren, XML nach examples/projects/
 * legen, Eintrag in examples.json ergänzen, dann
 *   node scripts/build_examples.js
 * Läuft automatisch am Ende von scripts/build_blocks.js mit.
 */

const fs   = require('fs');
const path = require('path');

const ROOT    = path.join(__dirname, '..');
const DIR     = path.join(ROOT, 'examples', 'projects');
const CATALOG = path.join(DIR, 'examples.json');
const OUTPUT  = path.join(ROOT, 'js', 'examples_db.js');

const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
const examples = catalog.map(e => {
  const file = path.join(DIR, e.file);
  if (!fs.existsSync(file)) throw new Error(`Beispiel fehlt: examples/projects/${e.file}`);
  return { id: e.file.replace(/\.xml$/, ''), ...e, xml: fs.readFileSync(file, 'utf8') };
});

const output = `// js/examples_db.js – GENERIERT von scripts/build_examples.js
// Nicht manuell bearbeiten! Quelle: examples/projects/ (examples.json + *.xml)

const EXAMPLES_DB = ${JSON.stringify(examples, null, 2)};
`;
fs.writeFileSync(OUTPUT, output, 'utf8');
console.log(`✅ ${examples.length} Beispiel(e) → ${path.relative(process.cwd(), OUTPUT)}`);
