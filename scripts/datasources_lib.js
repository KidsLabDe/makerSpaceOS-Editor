// scripts/datasources_lib.js – gemeinsame Logik für Datenquellen
// (components/datasources/*.md): Schema-Prüfung, Pfad-Auflösung und
// Umwandlung in eine Block-Definition. Genutzt von build_blocks.js und
// test_datasources.js.
'use strict';

const fs   = require('fs');
const path = require('path');

const SCHEMA = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'schemas', 'datasource.schema.json'), 'utf8'));

// Kleiner JSON-Schema-Prüfer (nur die im Datenquellen-Schema benutzten
// Schlüsselwörter) – bewusst ohne npm-Abhängigkeit.
function validate(value, schema = SCHEMA, where = '') {
  const errs = [];
  const typeOf = v => Array.isArray(v) ? 'array'
    : v === null ? 'null'
    : (typeof v === 'number' && Number.isInteger(v)) ? 'integer'
    : typeof v;
  if (schema.type) {
    const types = [].concat(schema.type);
    const t = typeOf(value);
    const ok = types.includes(t) || (t === 'integer' && types.includes('number'));
    if (!ok) return [`${where || 'Datei'}: erwartet ${types.join('/')}, gefunden ${t}`];
  }
  if (schema.enum && !schema.enum.includes(value))
    errs.push(`${where}: "${value}" nicht erlaubt (${schema.enum.join(', ')})`);
  if (schema.not && schema.not.enum && schema.not.enum.includes(value))
    errs.push(`${where}: "${value}" ist reserviert`);
  if (schema.pattern && typeof value === 'string' && !new RegExp(schema.pattern).test(value))
    errs.push(`${where}: "${value}" passt nicht zu ${schema.pattern}`);
  if (schema.minimum !== undefined && typeof value === 'number' && value < schema.minimum)
    errs.push(`${where}: ${value} ist kleiner als ${schema.minimum}`);
  if (typeOf(value) === 'object') {
    for (const req of (schema.required || []))
      if (value[req] === undefined) errs.push(`${where ? where + '.' : ''}${req}: fehlt`);
    for (const [k, v] of Object.entries(value)) {
      const sub = (schema.properties || {})[k];
      if (!sub) {
        if (schema.additionalProperties === false) errs.push(`${where ? where + '.' : ''}${k}: unbekanntes Feld`);
        continue;
      }
      errs.push(...validate(v, sub, where ? `${where}.${k}` : k));
    }
  }
  if (Array.isArray(value) && schema.items)
    value.forEach((item, i) => errs.push(...validate(item, schema.items, `${where}[${i}]`)));
  return errs;
}

// Gleiche Regeln wie json_wert() in lib/makerspaceos_netz.py
function resolvePath(data, p) {
  for (const part of String(p).split('.')) {
    if (part === '') continue;
    if (Array.isArray(data)) {
      const i = Number(part);
      if (!Number.isInteger(i)) return undefined;
      data = data[i < 0 ? data.length + i : i];
    } else if (data && typeof data === 'object') {
      data = data[part];
    } else {
      return undefined;
    }
    if (data === undefined) return undefined;
  }
  return data;
}

// Passt der gefundene Wert zum angegebenen Typ? (wie _umwandeln() auf dem Board)
function valueMatchesType(v, type) {
  if (v === undefined || v === null) return false;
  if (type === 'number')  return typeof v === 'number' || (typeof v === 'string' && v.trim() !== '' && !isNaN(Number(v)));
  if (type === 'boolean') return typeof v === 'boolean' || ['true', 'false', '1', '0'].includes(String(v).toLowerCase());
  return typeof v !== 'object';
}

// Zusätzliche Prüfungen, die das Schema nicht ausdrücken kann
function checkDatasource(def) {
  const errs = validate(def);
  if (errs.length) return errs;
  const inUrl  = new Set([...def.url.matchAll(/\{([a-z0-9_]+)\}/g)].map(m => m[1]));
  const params = new Set((def.params || []).map(p => p.name));
  for (const n of inUrl)  if (!params.has(n)) errs.push(`url: Platzhalter {${n}} hat keinen Parameter`);
  for (const n of params) if (!inUrl.has(n))  errs.push(`params: "${n}" kommt in der url nicht vor`);
  let example;
  try { example = JSON.parse(def.exampleResponse); }
  catch (e) { errs.push(`exampleResponse: kein gültiges JSON (${e.message})`); return errs; }
  const v = resolvePath(example, def.path);
  if (v === undefined) errs.push(`path: "${def.path}" ist in exampleResponse nicht auflösbar`);
  else if (!valueMatchesType(v, def.type)) errs.push(`path: Wert ${JSON.stringify(v)} passt nicht zu type "${def.type}"`);
  return errs;
}

// Board-Typname je Datentyp (lib/makerspaceos_netz.py: _umwandeln)
const BOARD_TYPE  = { number: 'zahl', text: 'text', boolean: 'wahrheitswert' };
const OUTPUT_TYPE = { number: 'Number', text: 'String', boolean: 'Boolean' };

function datasourceToBlock(def, body) {
  const unit   = def.unit ? ` (${def.unit})` : '';
  const params = def.params || [];
  const args   = params.map(p => `, ${p.name}=\${${p.name.toUpperCase()}}`).join('');
  const info = (de) => (de
    ? `\n\n---\nQuelle: ${def.source} · Abruf höchstens alle ${def.minInterval_s} s · ` +
      (def.verified ? 'geprüft' : '**noch nicht auf echter Hardware geprüft**')
    : `\n\n---\nSource: ${def.source} · fetched at most every ${def.minInterval_s} s · ` +
      (def.verified ? 'verified' : '**not yet verified on real hardware**'));
  return {
    id:            `quelle_${def.id}`,
    blockCategory: 'Internet',
    subCategory:   def.category,
    requiresBoardFeature: 'wifi',
    label:         def.label,
    label_en:      def.label_en,
    colour:        '#7C3AED',
    tooltip:       def.tooltip    || `${def.label}${unit} – ${def.source}`,
    tooltip_en:    def.tooltip_en || `${def.label_en}${unit} – ${def.source}`,
    blockType:     'value',
    output:        OUTPUT_TYPE[def.type],
    inputs:        [{ label: `${def.label}${unit}`, label_en: `${def.label_en}${unit}` }],
    valueInputs:   params.map(p => ({
      name:         p.name.toUpperCase(),
      label:        p.label,
      label_en:     p.label_en,
      check:        p.type === 'text' ? 'String' : 'Number',
      defaultValue: p.defaultValue,
    })),
    generator: {
      imports:    ['from makerspaceos_netz import hole_quelle'],
      expression: `hole_quelle(${JSON.stringify(def.url)}, ${JSON.stringify(def.path)}, ` +
                  `${def.minInterval_s}, "${BOARD_TYPE[def.type]}"${args})`,
      order:      'FUNCTION_CALL',
    },
    doc:    (body.de || '') + info(true),
    doc_en: (body.en || body.de || '') + info(false),
    datasource: def,
  };
}

module.exports = { SCHEMA, validate, resolvePath, valueMatchesType, checkDatasource, datasourceToBlock };
