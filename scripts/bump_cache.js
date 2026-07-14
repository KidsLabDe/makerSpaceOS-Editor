#!/usr/bin/env node
// scripts/bump_cache.js – Cache-Busting für lokale JS/CSS-Einbindungen.
// Stempelt in allen HTML-Dateien einen ?v=<Zeitstempel> an src/href von js/… und css/…,
// damit Browser nach einem Deploy nicht mit alten Dateien aus dem HTTP-Cache arbeiten.
// Aufruf: node scripts/bump_cache.js   (läuft auch automatisch am Ende von build_blocks.js)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const HTML_FILES = ['index.html', 'viewer.html', 'admin.html'];

function bump() {
  const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12); // JJJJMMTThhmm
  const re = /(\b(?:src|href)=")((?:js|css)\/[^"?]+)(?:\?v=[^"]*)?(")/g;

  for (const file of HTML_FILES) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) continue;
    const html = fs.readFileSync(filePath, 'utf8');
    const updated = html.replace(re, `$1$2?v=${stamp}$3`);
    if (updated !== html) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`🔄 Cache-Version ${stamp} → ${file}`);
    }
  }
}

bump();

module.exports = bump;
