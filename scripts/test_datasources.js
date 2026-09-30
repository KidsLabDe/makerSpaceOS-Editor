#!/usr/bin/env node
// scripts/test_datasources.js – prüft die Datenquellen in components/datasources/
//
//   node scripts/test_datasources.js           Offline: Schema, Platzhalter,
//                                              Pfad in exampleResponse auflösbar
//   node scripts/test_datasources.js --online  zusätzlich: echte API mit den
//                                              Standard-Parametern abrufen,
//                                              Pfad + Typ prüfen, Größe messen
//
// APIs ändern sich still – ohne Proxy ist der Online-Test die wichtigste
// Absicherung. Vor jedem Hackday laufen lassen. Exit-Code 1 bei Fehlern.
'use strict';

const fs   = require('fs');
const path = require('path');
const { checkDatasource, resolvePath, valueMatchesType } = require('./datasources_lib.js');

const DIR    = path.join(__dirname, '..', 'components', 'datasources');
const ONLINE = process.argv.includes('--online');

// Frontmatter mit demselben Parser wie build_blocks.js lesen
const buildSrc = fs.readFileSync(path.join(__dirname, 'build_blocks.js'), 'utf8');
const parserSrc = buildSrc.slice(buildSrc.indexOf('function parseYAML'), buildSrc.indexOf('// ── Markdown Front-Matter'));
const { parseYAML } = new Function(`${parserSrc}; return { parseYAML };`)();

function frontMatter(content) {
  const lines = content.split('\n');
  if (lines[0].trim() !== '---') return null;
  const end = lines.indexOf('---', 1);
  return end === -1 ? null : parseYAML(lines.slice(1, end).join('\n'));
}

function fillUrl(def) {
  let url = def.url;
  for (const p of (def.params || [])) {
    let v = p.defaultValue;
    if (typeof v === 'number' && Number.isInteger(v)) v = String(v);
    url = url.replace(`{${p.name}}`, encodeURIComponent(String(v)));
  }
  return url;
}

async function onlineCheck(def) {
  const url = fillUrl(def);
  const t0  = Date.now();
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const text = await res.text();
  const ms   = Date.now() - t0;
  const size = Buffer.byteLength(text, 'utf8');
  const errs = [];
  if (!res.ok) errs.push(`HTTP ${res.status}`);
  let data;
  try { data = JSON.parse(text); } catch (e) { errs.push('Antwort ist kein JSON'); }
  if (data !== undefined) {
    const v = resolvePath(data, def.path);
    if (v === undefined) errs.push(`Pfad "${def.path}" nicht in der echten Antwort`);
    else if (!valueMatchesType(v, def.type)) errs.push(`Wert ${JSON.stringify(v)} passt nicht zu "${def.type}"`);
    else console.log(`      Wert: ${JSON.stringify(v)}${def.unit ? ' ' + def.unit : ''}`);
  }
  console.log(`      ${size} Bytes, ${ms} ms – ${url}`);
  if (def.responseSize_bytes && size > def.responseSize_bytes * 2)
    errs.push(`Antwort ist mehr als doppelt so groß wie dokumentiert (${def.responseSize_bytes} Bytes)`);
  return errs;
}

(async () => {
  const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter(f => f.endsWith('.md')).sort() : [];
  let failed = 0;
  const ids = new Set();
  for (const f of files) {
    const def = frontMatter(fs.readFileSync(path.join(DIR, f), 'utf8'));
    let errs = def ? checkDatasource(def) : ['kein Frontmatter'];
    if (def && ids.has(def.id)) errs.push(`id "${def.id}" doppelt`);
    if (def) ids.add(def.id);
    if (!errs.length && ONLINE) {
      try { errs = await onlineCheck(def); }
      catch (e) { errs = [`Abruf fehlgeschlagen: ${e.message}`]; }
    }
    const mark = def && def.verified ? '' : '  (verified: false)';
    console.log(`${errs.length ? 'FEHLER' : 'ok    '} ${f}${mark}`);
    errs.forEach(e => console.log(`      - ${e}`));
    if (errs.length) failed++;
  }
  console.log(`\n${files.length - failed}/${files.length} Datenquellen ok${ONLINE ? ' (online)' : ' (offline)'}`);
  process.exit(failed ? 1 : 0);
})();
