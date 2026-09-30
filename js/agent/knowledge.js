// agent/knowledge.js – Wissens-Befehle (Bibliothek/Wiki) für den MCP-Server.
// Alles nur lesend. Quelle: dieselben Daten wie die Bibliothek im Editor
// (docsBuildEntries → CORE_DOCS + BLOCKS_DB + Board-Doku), gefiltert aufs aktive Board.

function agentEntries() { return docsBuildEntries(IS_EN); }

function agentBlockEntries() {
  return [...agentEntries().values()].filter(e => e.kind === 'block' || e.kind === 'core');
}

function agentCategoryOf(e) {
  return e.kind === 'core' ? e.section : [e.def.blockCategory, e.def.subCategory].filter(Boolean).join(' / ');
}

AGENT_COMMANDS.list_categories = async () => {
  const hideCats = new Set(BOARD.hideCategories || []);
  const hideSubs = new Set(BOARD.hideSubCategories || []);
  const hardware = BLOCKS_CATALOG.categories.filter(c => !hideCats.has(c.id)).map(c => ({
    id: c.id, label: LF(c, 'label'),
    subCategories: (c.subCategories || []).filter(s => !hideSubs.has(s))
      .map(s => ({ id: s, label: (IS_EN && c.subCategories_en && c.subCategories_en[s]) || s })),
  }));
  const core = CORE_SECTIONS.map(s => ({ id: s.name, label: IS_EN ? s.label_en : s.name }));
  return { core, hardware };
};

AGENT_COMMANDS.list_blocks = async ({ category, query } = {}) => {
  const cat = category && category.toLowerCase();
  const words = (query || '').toLowerCase().split(/\s+/).filter(Boolean);
  const blocks = agentBlockEntries()
    .filter(e => !cat || agentCategoryOf(e).toLowerCase().includes(cat))
    .filter(e => {
      const hay = `${e.blockType} ${e.label} ${e.tooltip}`.toLowerCase();
      return words.every(w => hay.includes(w));
    })
    .map(e => ({ id: e.blockType, label: e.label, category: agentCategoryOf(e), tooltip: e.tooltip }));
  return { count: blocks.length, blocks };
};

// Echte Struktur eines Blocks: eine Wegwerf-Instanz (ohne Events) auslesen –
// liefert Feld-/Eingangsnamen und gültige Dropdown-Werte, genau wie sie beim
// Bauen (add_block/set_workspace) gebraucht werden.
function agentBlockShape(type) {
  if (!Blockly.Blocks[type]) return null;
  Blockly.Events.disable();
  let b;
  try {
    b = workspace.newBlock(type);
    const fields = [], inputs = [];
    for (const inp of b.inputList) {
      const conn = inp.connection;
      if (conn) inputs.push({ name: inp.name, kind: conn.type === Blockly.NEXT_STATEMENT ? 'statement' : 'value', check: conn.getCheck() });
      for (const f of inp.fieldRow) {
        if (!f.name) continue;
        const opts = typeof f.getOptions === 'function' ? f.getOptions(false) : null;
        fields.push({
          name: f.name, value: f.getValue(),
          options: opts ? opts.slice(0, 60).map(o => ({ label: typeof o[0] === 'string' ? o[0] : '', value: o[1] })) : undefined,
        });
      }
    }
    return {
      fields, inputs,
      output: b.outputConnection ? (b.outputConnection.getCheck() || 'any') : null,
      previous: !!b.previousConnection, next: !!b.nextConnection,
    };
  } finally {
    if (b) b.dispose(false);
    Blockly.Events.enable();
  }
}

AGENT_COMMANDS.describe_block = async ({ id }) => {
  const e = agentEntries().get('block:' + id);
  const shape = agentBlockShape(id);
  if (!e && !shape) throw new Error(`Unbekannter Block: ${id} (list_blocks nutzen)`);
  if (BOARD.hideBlockIds && BOARD.hideBlockIds.includes(id)) throw new Error(`Block ${id} ist auf diesem Board ausgeblendet`);
  const def = e && e.def;
  return {
    id, label: e && e.label, category: e && agentCategoryOf(e), tooltip: e && e.tooltip,
    doc: e && e.doc, shape,
    hardware: def && def.hardware, valueInputs: def && def.valueInputs,
    generatorImports: def && def.generator && def.generator.imports,
  };
};

AGENT_COMMANDS.get_board_info = async () => {
  const info = JSON.parse(JSON.stringify(BOARD));   // Funktionen fallen weg
  return {
    boardId: BOARD_ID, name: BOARD.name, lang: LANG, profile: info,
    libVersion: window.LIB_MANIFEST && window.LIB_MANIFEST.libVersion,
    libFiles: window.LIB_MANIFEST && window.LIB_MANIFEST.files.map(f => f.path),
    knownBoards: Object.entries(BOARD_PROFILES).map(([id, p]) => ({ id, name: p.name })),
  };
};

AGENT_COMMANDS.search_docs = async ({ query }) => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const hits = [];
  for (const e of agentEntries().values()) {
    const hay = `${e.label} ${e.tooltip || ''} ${e.doc || ''}`.toLowerCase();
    if (!words.every(w => hay.includes(w))) continue;
    const i = hay.indexOf(words[0]);
    const doc = e.doc || '';
    hits.push({
      key: e.key, label: e.label, kind: e.kind,
      snippet: (doc || e.tooltip || '').replace(/\s+/g, ' ').slice(Math.max(0, i - 60), i + 140),
    });
  }
  return { count: hits.length, hits: hits.slice(0, 20) };
};

AGENT_COMMANDS.get_doc = async ({ key }) => {
  const e = agentEntries().get(key);
  if (!e) throw new Error(`Kein Artikel „${key}“ – Schlüssel wie block:<id> oder board:<id> (search_docs nutzen)`);
  return { key, label: e.label, kind: e.kind, tooltip: e.tooltip, doc: e.doc };
};
