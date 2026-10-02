// agent/workspace.js – Blöcke lesen/ändern (der EINZIGE Schreibweg für Agenten),
// Code nur lesen (get_python, get_code_editor). Es gibt bewusst keinen Befehl, der
// Python-Code setzt, das Code-Feld bearbeitet oder Code ausführt, der nicht aus den
// Blöcken erzeugt wurde.

const AGENT_TOP_OK = () => ['control_setup', 'control_forever', 'loop_parallel', ...(typeof _HAT_TYPES !== 'undefined' ? _HAT_TYPES : [])];

// Alle Änderungen eines Agenten-Aufrufs = ein Undo-Schritt
function agentEdit(fn) {
  Blockly.Events.setGroup(true);
  try { return fn(); } finally { Blockly.Events.setGroup(false); }
}

function agentBlock(id) {
  const b = workspace.getBlockById(id);
  if (!b) throw new Error(`Block nicht gefunden: ${id} (get_workspace nutzen)`);
  return b;
}

// Warnungen entstehen beim Code-Generieren (setWarningText) → erst generieren
function agentWarnings() {
  generateCode();
  const out = [];
  for (const b of workspace.getAllBlocks(false)) {
    const icon = b.getIcon && (b.getIcon('warning') || b.getIcon(Blockly.icons && Blockly.icons.IconType && Blockly.icons.IconType.WARNING));
    const text = icon && icon.getText ? icon.getText() : (b.warning && b.warning.getText && b.warning.getText());
    if (text) out.push({ id: b.id, type: b.type, text });
  }
  return out;
}

function agentFloating() {
  const ok = new Set(AGENT_TOP_OK());
  return workspace.getTopBlocks(false)
    .filter(b => !ok.has(b.type) && !b.type.startsWith('when_'))
    .map(b => ({ id: b.id, type: b.type }));
}

function agentSummary() {
  return { warnings: agentWarnings(), floating: agentFloating() };
}

function agentSetFields(block, fields) {
  for (const [name, value] of Object.entries(fields || {})) {
    const f = block.getField(name);
    if (!f) throw new Error(`Block ${block.type} hat kein Feld „${name}“. Felder: ${block.inputList.flatMap(i => i.fieldRow).filter(x => x.name).map(x => x.name).join(', ')}`);
    block.setFieldValue(value, name);
    const now = block.getFieldValue(name);
    if (String(now) !== String(value) && Number(now) !== Number(value)) {
      const opts = typeof f.getOptions === 'function' ? f.getOptions(false).map(o => o[1]).slice(0, 40) : null;
      throw new Error(`Wert „${value}“ ungültig für ${block.type}.${name}` + (opts ? `. Gültig: ${opts.join(', ')}` : ` (Wert blieb ${now})`));
    }
  }
}

// child unter parent hängen. input = Name des Eingangs oder "NEXT" (darunter)
function agentAttach(parent, input, child) {
  const pc = input === 'NEXT' ? parent.nextConnection : (parent.getInput(input) || {}).connection;
  if (!pc) throw new Error(`Block ${parent.type} hat keinen Eingang „${input}“ (describe_block nutzen)`);
  const cc = pc.type === Blockly.INPUT_VALUE ? child.outputConnection : child.previousConnection;
  if (!cc) throw new Error(`${child.type} passt nicht an „${input}“ von ${parent.type}`);
  try { pc.connect(cc); } catch (e) { throw new Error(`Verbinden fehlgeschlagen (${e.message})`); }
  if (child.getParent() !== parent) throw new Error(`${child.type} lässt sich hier nicht einhängen (Typ passt nicht zu „${input}“)`);
}

function agentFreeSpot() {
  const bottoms = workspace.getTopBlocks(false).map(t => t.getBoundingRectangle().bottom);
  return { x: 40, y: (bottoms.length ? Math.max(...bottoms) : 0) + 40 };
}

// Block-Baum als lesbare Einrückung (für kleine Modelle, statt großem JSON).
// IDs sind JSON-Strings – Blockly-IDs enthalten Sonderzeichen wie ] oder }.
function agentOutline(block, depth = 0) {
  const pad = '  '.repeat(depth);
  const fields = block.inputList.flatMap(i => i.fieldRow).filter(f => f.name && f.getValue() !== undefined)
    .map(f => `${f.name}=${JSON.stringify(f.getValue())}`).join(' ');
  let s = `${pad}${block.type} id=${JSON.stringify(block.id)}${fields ? ' ' + fields : ''}\n`;
  for (const inp of block.inputList) {
    const c = inp.connection && inp.connection.targetBlock();
    if (c && inp.name) s += `${pad}  ↳ ${inp.name}:\n` + agentOutline(c, depth + 2);
  }
  const next = block.getNextBlock();
  if (next) s += agentOutline(next, depth);
  return s;
}

AGENT_COMMANDS.get_workspace = async ({ format = 'json' } = {}) => {
  if (format === 'outline') return { outline: workspace.getTopBlocks(true).map(b => agentOutline(b)).join('\n') };
  return { state: Blockly.serialization.workspaces.save(workspace) };
};

function agentCheckTypes(state) {
  const bad = new Set(), hidden = new Set(BOARD.hideBlockIds || []);
  const walk = (b) => {
    if (!b || typeof b !== 'object') return;
    if (b.type && (!Blockly.Blocks[b.type] || hidden.has(b.type))) bad.add(b.type);
    for (const inp of Object.values(b.inputs || {})) { walk(inp.block); walk(inp.shadow); }
    if (b.next) walk(b.next.block);
  };
  for (const b of (state && state.blocks && state.blocks.blocks) || []) walk(b);
  return [...bad];
}

AGENT_COMMANDS.set_workspace = async ({ state }) => {
  if (!state || !state.blocks) throw new Error('state muss Blockly-JSON mit "blocks" sein (get_workspace liefert das Format)');
  const bad = agentCheckTypes(state);
  if (bad.length) throw new Error(`Unbekannte/ausgeblendete Block-Typen: ${bad.join(', ')} (list_blocks nutzen). Nichts wurde geändert.`);
  pushVersion();   // Sicherung im Editor-Verlauf (History-Button / restore_version)
  const before = Blockly.serialization.workspaces.save(workspace);
  try {
    agentEdit(() => Blockly.serialization.workspaces.load(migrateState(state), workspace));
  } catch (e) {
    Blockly.serialization.workspaces.load(before, workspace);
    throw new Error(`Laden fehlgeschlagen, alter Stand wiederhergestellt: ${e.message}`);
  }
  ensureFixedBlocks();
  return { ok: true, ...agentSummary() };
};

AGENT_COMMANDS.clear_workspace = async () => {
  pushVersion();
  agentEdit(() => { workspace.clear(); ensureFixedBlocks(); });
  return { ok: true, ...agentSummary() };
};

AGENT_COMMANDS.restore_version = async ({ index = 0 }) => {
  if (!getVersions()[index]) throw new Error(`Keine Version mit Index ${index}`);
  restoreVersion(index);
  return { ok: true, ...agentSummary() };
};

AGENT_COMMANDS.list_versions = async () =>
  ({ versions: getVersions().map((v, index) => ({ index, ts: new Date(v.ts).toISOString() })) });

AGENT_COMMANDS.add_block = async ({ type, fields, parent, input, x, y }) => {
  if (!Blockly.Blocks[type] || (BOARD.hideBlockIds || []).includes(type)) throw new Error(`Unbekannter/ausgeblendeter Block: ${type} (list_blocks nutzen)`);
  if (parent && !input) throw new Error('Mit parent muss input gesetzt sein (Eingangsname oder "NEXT")');
  return agentEdit(() => {
    const spot = agentFreeSpot();
    const b = workspace.newBlock(type);
    try {
      agentSetFields(b, fields);
      b.initSvg(); b.render();
      if (parent) agentAttach(agentBlock(parent), input, b);
      else b.moveBy(x ?? spot.x, y ?? spot.y);
    } catch (e) { b.dispose(false); throw e; }
    return { id: b.id, ...agentSummary() };
  });
};

AGENT_COMMANDS.connect_blocks = async ({ parent, input, child }) => agentEdit(() => {
  const c = agentBlock(child);
  const oldParent = c.getParent();
  const oldPos = c.getRelativeToSurfaceXY();
  c.unplug(false);
  try { agentAttach(agentBlock(parent), input, c); }
  catch (e) { c.moveBy(oldPos.x - c.getRelativeToSurfaceXY().x, oldPos.y - c.getRelativeToSurfaceXY().y); throw new Error(e.message + (oldParent ? ' (Block ist jetzt lose)' : '')); }
  return { ok: true, ...agentSummary() };
});

AGENT_COMMANDS.move_block = async ({ block_id, x, y }) => agentEdit(() => {
  const b = agentBlock(block_id);
  if (b.getParent()) throw new Error('Block hängt an einem anderen – mit connect_blocks umhängen');
  const p = b.getRelativeToSurfaceXY();
  b.moveBy(x - p.x, y - p.y);
  return { ok: true };
});

AGENT_COMMANDS.delete_block = async ({ block_id }) => agentEdit(() => {
  const b = agentBlock(block_id);
  if (!b.isDeletable()) throw new Error(`${b.type} ist ein Pflichtblock und nicht löschbar`);
  b.dispose(true);
  return { ok: true, ...agentSummary() };
});

AGENT_COMMANDS.set_field = async ({ block_id, field, value }) => agentEdit(() => {
  agentSetFields(agentBlock(block_id), { [field]: value });
  return { ok: true, ...agentSummary() };
});

AGENT_COMMANDS.undo = async () => { workspace.undo(false); return { ok: true, ...agentSummary() }; };

AGENT_COMMANDS.validate = async () => {
  const s = agentSummary();
  const missing = ['control_setup', 'control_forever'].filter(t => !workspace.getBlocksByType(t, false).length);
  return { ok: !s.warnings.length && !s.floating.length && !missing.length, ...s, missingFixedBlocks: missing };
};

// ── Code: NUR LESEN ─────────────────────────────────────────────────────────
AGENT_COMMANDS.get_python = async () => {
  const python = generateCode();
  return { python, warnings: agentWarnings() };
};

AGENT_COMMANDS.get_code_editor = async () => {
  const text = codeEditor.getValue();
  return { text, edit_mode: !codeEditor.getOption('readOnly'), differs_from_blocks: text !== generateCode() };
};

// ── Screenshot (SVG → PNG) ──────────────────────────────────────────────────
AGENT_COMMANDS.screenshot = async () => {
  const canvas = workspace.getCanvas();
  const bb = canvas.getBBox();
  if (!bb.width || !bb.height) throw new Error('Workspace ist leer');
  const pad = 20, w = Math.ceil(bb.width + 2 * pad), h = Math.ceil(bb.height + 2 * pad);
  const clone = canvas.cloneNode(true);
  clone.setAttribute('transform', `translate(${pad - bb.x},${pad - bb.y})`);
  let css = '';
  for (const sheet of document.styleSheets) {
    try { for (const r of sheet.cssRules) if (/blockly/i.test(r.cssText)) css += r.cssText + '\n'; } catch (_) { /* fremdes Sheet */ }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><style>${css}</style>` +
    `<rect width="100%" height="100%" fill="#FBF8F3"/>${new XMLSerializer().serializeToString(clone)}</svg>`;
  const img = new Image();
  await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('Screenshot fehlgeschlagen')); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); });
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  cv.getContext('2d').drawImage(img, 0, 0);
  return { png_base64: cv.toDataURL('image/png').split(',')[1], width: w, height: h };
};
