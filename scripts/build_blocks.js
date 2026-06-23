#!/usr/bin/env node
// scripts/build_blocks.js – liest components/**/*.md, erzeugt js/blocks_db.js
// Ausführen: node scripts/build_blocks.js

const fs   = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '..', 'components');
const OUTPUT_FILE    = path.join(__dirname, '..', 'js', 'blocks_db.js');

// ── YAML-Parser (Subset: strings, booleans, numbers, arrays, nested objects) ──

function parseYAML(text) {
  const lines = text.split('\n');
  return parseBlock(lines, 0, -1).obj;
}

function parseBlock(lines, startLine, parentIndent) {
  const obj = {};
  let i = startLine;

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trimStart();

    // skip blank lines and comments
    if (!trimmed || trimmed.startsWith('#')) { i++; continue; }

    const indent = raw.length - trimmed.length;

    // dedent = end of this block
    if (indent <= parentIndent) break;

    // array item at this level
    if (trimmed.startsWith('- ')) {
      // caller handles arrays; break so array-parent can collect
      break;
    }

    // key: value
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) { i++; continue; }

    let key  = trimmed.slice(0, colonIdx).trim();
    const rest = trimmed.slice(colonIdx + 1); // keep leading space

    // strip quotes from key
    key = unquote(key);

    const restTrimmed = rest.trim();

    if (!restTrimmed || restTrimmed === '') {
      // nested block
      i++;
      // peek ahead
      const { obj: child, nextLine } = parseBlock(lines, i, indent);
      // check if next non-blank line is an array item
      const firstContentLine = firstNonBlank(lines, i);
      if (firstContentLine !== -1 &&
          lines[firstContentLine].trimStart().startsWith('- ')) {
        const { arr, nextLine: nl } = parseArray(lines, i, indent);
        obj[key] = arr;
        i = nl;
      } else {
        obj[key] = child;
        i = nextLine;
      }
      continue;
    }

    if (restTrimmed === '|') {
      // block scalar
      const blockIndent = indent + 2;
      const blines = [];
      i++;
      while (i < lines.length) {
        const bl = lines[i];
        const blt = bl.trimStart();
        if (!blt) { blines.push(''); i++; continue; }
        const bi = bl.length - blt.length;
        if (bi < blockIndent) break;
        blines.push(bl.slice(blockIndent));
        i++;
      }
      // trim trailing blank lines
      while (blines.length && blines[blines.length - 1] === '') blines.pop();
      obj[key] = blines.join('\n');
      continue;
    }

    obj[key] = parseScalar(restTrimmed);
    i++;
  }

  return { obj, nextLine: i };
}

function parseArray(lines, startLine, parentIndent) {
  const arr = [];
  let i = startLine;

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trimStart();
    if (!trimmed || trimmed.startsWith('#')) { i++; continue; }

    const indent = raw.length - trimmed.length;
    if (indent <= parentIndent) break;

    if (!trimmed.startsWith('- ')) break;

    const itemText = trimmed.slice(2).trim();

    if (!itemText) {
      // multi-line object item
      i++;
      const { obj: child, nextLine } = parseBlock(lines, i, indent + 1);
      arr.push(child);
      i = nextLine;
      continue;
    }

    // inline value or start of inline object
    if (itemText.includes(':') && !itemText.startsWith('"') && !itemText.startsWith("'")) {
      // treat as single-line object: "key: val key2: val2" → not YAML standard
      // Instead, read as a block object from the current item line
      // Reparse: create a synthetic block from the item text onward
      const syntheticLines = [' '.repeat(indent + 2) + itemText];
      // collect any subsequent deeper lines
      let j = i + 1;
      while (j < lines.length) {
        const jl = lines[j];
        const jt = jl.trimStart();
        if (!jt || jt.startsWith('#')) { j++; continue; }
        const ji = jl.length - jt.length;
        if (ji <= indent + 1) break;
        syntheticLines.push(jl);
        j++;
      }
      const { obj: child, nextLine: nl } = parseBlock(syntheticLines, 0, indent);
      arr.push(child);
      i = j;
      continue;
    }

    arr.push(parseScalar(itemText));
    i++;
  }

  return { arr, nextLine: i };
}

function firstNonBlank(lines, from) {
  for (let i = from; i < lines.length; i++) {
    if (lines[i].trim()) return i;
  }
  return -1;
}

function unquote(s) {
  s = s.trim();
  if ((s.startsWith('"') && s.endsWith('"')) ||
      (s.startsWith("'") && s.endsWith("'"))) {
    const inner = s.slice(1, -1);
    return s.startsWith('"') ? processEscapes(inner) : inner;
  }
  return s;
}

function processEscapes(s) {
  return s
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

function parseScalar(s) {
  s = s.trim();
  if (s === 'true')  return true;
  if (s === 'false') return false;
  if (s === 'null' || s === '~') return null;
  if ((s.startsWith('"') && s.endsWith('"')) ||
      (s.startsWith("'") && s.endsWith("'"))) {
    const inner = s.slice(1, -1);
    return s.startsWith('"') ? processEscapes(inner) : inner;
  }
  const n = Number(s);
  if (!isNaN(n) && s !== '') return n;
  return s;
}

// ── Markdown Front-Matter extractor ──────────────────────────────────────────

function extractFrontMatter(content) {
  const lines = content.split('\n');
  if (lines[0].trim() !== '---') return null;
  const endIdx = lines.indexOf('---', 1);
  if (endIdx === -1) return null;
  return lines.slice(1, endIdx).join('\n');
}

// ── File walker ───────────────────────────────────────────────────────────────

function walkDir(dir, ext = '.md') {
  const results = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) results.push(...walkDir(full, ext));
    else if (entry.endsWith(ext)) results.push(full);
  }
  return results;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const catalogPath = path.join(COMPONENTS_DIR, 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// Build ordering maps
const catOrder    = {};
const subCatOrder = {};
catalog.categories.forEach((cat, ci) => {
  catOrder[cat.id] = ci;
  (cat.subCategories || []).forEach((sc, si) => {
    subCatOrder[`${cat.id}::${sc}`] = si;
  });
});

const mdFiles = walkDir(COMPONENTS_DIR).filter(f => !f.endsWith('catalog.json'));
const blocks  = [];
const errors  = [];

for (const filePath of mdFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fmText  = extractFrontMatter(content);
  if (!fmText) { errors.push(`${filePath}: kein Front-Matter`); continue; }

  let def;
  try {
    def = parseYAML(fmText);
  } catch (e) {
    errors.push(`${filePath}: YAML-Fehler – ${e.message}`);
    continue;
  }

  if (!def.id || !def.blockCategory || !def.blockType) {
    errors.push(`${filePath}: fehlende Pflichtfelder (id, blockCategory, blockType)`);
    continue;
  }

  def._file = path.relative(COMPONENTS_DIR, filePath);
  blocks.push(def);
}

// Sort: category order → subcategory order → id
blocks.sort((a, b) => {
  const ca = catOrder[a.blockCategory] ?? 999;
  const cb = catOrder[b.blockCategory] ?? 999;
  if (ca !== cb) return ca - cb;
  const sa = subCatOrder[`${a.blockCategory}::${a.subCategory}`] ?? 999;
  const sb = subCatOrder[`${b.blockCategory}::${b.subCategory}`] ?? 999;
  if (sa !== sb) return sa - sb;
  return a.id.localeCompare(b.id);
});

if (errors.length) {
  console.warn('⚠️  Warnungen:');
  errors.forEach(e => console.warn('   ' + e));
}

// Emoji aus allen label-Feldern strippen (KidsLab: keine Emoji auf Blöcken).
// Pfeil → (U+2192) und ° bleiben erhalten.
function stripEmoji(s) {
  return typeof s === 'string'
    ? s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{22A1}]/gu, '').replace(/^\s+/, '')
    : s;
}
function cleanLabelsDeep(node) {
  if (Array.isArray(node)) return node.forEach(cleanLabelsDeep);
  if (node && typeof node === 'object')
    for (const k of Object.keys(node))
      (k === 'label') ? (node[k] = stripEmoji(node[k])) : cleanLabelsDeep(node[k]);
}
cleanLabelsDeep(blocks);
cleanLabelsDeep(catalog);

const output = `// js/blocks_db.js – GENERIERT von scripts/build_blocks.js
// Nicht manuell bearbeiten! Neu generieren: node scripts/build_blocks.js
// Generiert: ${new Date().toISOString()}

const BLOCKS_CATALOG = ${JSON.stringify(catalog, null, 2)};

const BLOCKS_DB = ${JSON.stringify(blocks, null, 2)};
`;

fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
console.log(`✅ ${blocks.length} Blöcke → ${path.relative(process.cwd(), OUTPUT_FILE)}`);
