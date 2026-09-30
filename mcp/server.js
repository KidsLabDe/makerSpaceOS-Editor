#!/usr/bin/env node
// server.js – MCP-Server für den makerSpaceOS-Editor (stdio). Siehe README.md.
// Blöcke bauen/lesen, Board verbinden/starten, Konsole lesen. Code ist NUR lesbar.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { EditorBridge } from './bridge.js';
import { instructions, reminders, t } from './rules.js';
import { buildReport, REPORT_TARGETS } from './report.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(HERE, '..', 'docs');
const PORT = Number(process.env.MAKERSPACEOS_PORT || 8765);
const EDITOR_URL = process.env.MAKERSPACEOS_EDITOR_URL || 'http://localhost:8000/index.html';
let lang = process.env.MAKERSPACEOS_LANG === 'en' ? 'en' : 'de';   // wird vom Editor überschrieben

// Token: stabil über Neustarts (Datei), damit die Editor-URL gleich bleibt
const tokenFile = path.join(HERE, '.agent_token');
let token = process.env.MAKERSPACEOS_TOKEN;
if (!token) {
  try { token = fs.readFileSync(tokenFile, 'utf8').trim(); } catch { /* neu erzeugen */ }
  if (!token) { token = crypto.randomBytes(16).toString('hex'); fs.writeFileSync(tokenFile, token, { mode: 0o600 }); }
}
const editorUrl = () => `${EDITOR_URL}?agent=1&port=${PORT}&token=${token}`;

const bridge = new EditorBridge({ port: PORT, token });
bridge.start();

const server = new McpServer({ name: 'makerspaceos', version: '0.1.0' }, { instructions: instructions(lang) });

// ── Hilfen ──────────────────────────────────────────────────────────────────
const text = (obj) => ({ type: 'text', text: typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2) });
const guide = () => fs.readFileSync(path.join(HERE, `guide.${lang}.md`), 'utf8');
const docFiles = () => fs.existsSync(DOCS_DIR) ? fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md')) : [];
const readDocFile = (name) => {
  const f = docFiles().find(x => x === name + '.md');
  if (!f) throw new Error(`Kein Dokument „${name}“. Vorhanden: ${docFiles().map(x => x.slice(0, -3)).join(', ')}`);
  return fs.readFileSync(path.join(DOCS_DIR, f), 'utf8');
};

// Werkzeug registrieren: Editor-Befehl aufrufen, Erinnerungen anhängen, Fehler sauber melden.
// map(result) darf das Ergebnis umformen (z. B. Bild); extra() liefert Text ohne Editor.
function tool(name, description, shape, { cmd = name, timeout, post, local } = {}) {
  server.registerTool(name, { description, inputSchema: shape }, async (args) => {
    let result, error, serial;
    try {
      if (local) result = await local(args);
      else {
        const r = await bridge.call(cmd, args, timeout);
        serial = r.serial;
        if (r.lang) lang = r.lang === 'en' ? 'en' : 'de';
        if (r.ok) result = r.result; else error = r.error;
      }
    } catch (e) {
      error = e.message === 'NO_EDITOR'
        ? `${t(lang).noEditor}\n${editorUrl()}${bridge.listenError ? `\n(WebSocket: ${bridge.listenError.message})` : ''}`
        : e.message;
    }
    const rem = reminders({ tool: name, result, error, serial, lang });
    const content = [];
    if (error) content.push(text(error));
    else if (post) content.push(...post(result));
    else content.push(text(result));
    if (rem.length) content.push(text('Reminders:\n- ' + rem.join('\n- ')));
    return { content, isError: !!error };
  });
}

const id = z.string().describe('Block id (from get_workspace)');

// ── Wissen ──────────────────────────────────────────────────────────────────
tool('get_project_guide', 'START HERE. Short guide + mandatory rules (blocks only, code is read-only, connection checks, bug reports).', {},
  { local: async () => guide() });
tool('get_editor_url', 'URL to open in Chrome/Edge so the editor connects to this server (contains a secret token, do not share).', {},
  { local: async () => editorUrl() });
tool('list_categories', 'Toolbox categories/subcategories available on the active board.', {});
tool('list_blocks', 'List available blocks (id, label, category, tooltip), optionally filtered by category and/or search words.',
  { category: z.string().optional(), query: z.string().optional() });
tool('describe_block', 'Full description of one block: docs, field names, valid dropdown values, inputs, connection types. Call before add_block.', { id: z.string() });
tool('get_board_info', 'Active board profile: pins, Grove ports, servos, hidden blocks, required lib/ files.', {});
tool('search_docs', 'Full-text search in the built-in library (blocks, boards) and docs/*.md.', { query: z.string() },
  {
    local: async ({ query }) => {
      const words = query.toLowerCase().split(/\s+/).filter(Boolean);
      const files = docFiles().map(f => ({ key: 'file:' + f.slice(0, -3), body: fs.readFileSync(path.join(DOCS_DIR, f), 'utf8') }))
        .filter(d => words.every(w => d.body.toLowerCase().includes(w)))
        .map(d => ({ key: d.key, kind: 'file', label: d.key.slice(5) }));
      let page = { hits: [] };
      try { const r = await bridge.call('search_docs', { query }); if (r.ok) page = r.result; } catch { /* Editor optional */ }
      return { count: page.hits.length + files.length, hits: [...page.hits, ...files] };
    },
  });
tool('get_doc', 'Read one article: key like block:<id>, board:<id> or file:<name> (docs/*.md).', { key: z.string() },
  {
    local: async ({ key }) => {
      if (key.startsWith('file:')) return readDocFile(key.slice(5));
      const r = await bridge.call('get_doc', { key });
      if (!r.ok) throw new Error(r.error);
      return r.result;
    },
  });

// ── Workspace (einziger Schreibweg) ─────────────────────────────────────────
tool('get_workspace', 'Read the current blocks. format "outline" (indented, with ids; best for small models) or "json" (Blockly JSON).',
  { format: z.enum(['outline', 'json']).optional() },
  { post: (r) => [text(r.outline ?? r)] });
tool('set_workspace', 'Replace ALL blocks with Blockly JSON (same format as get_workspace json). Validates block types first; the old state goes to editor history. Ask the user first if a program exists.',
  { state: z.record(z.any()) });
tool('add_block', 'Create a block. With parent+input attach it (input = input name, or "NEXT" to place below parent); otherwise it is placed loose. Fields: {FIELD: value}. Returns the new id.',
  { type: z.string(), fields: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(), parent: z.string().optional(), input: z.string().optional(), x: z.number().optional(), y: z.number().optional() });
tool('connect_blocks', 'Move an existing block (child) into an input of parent, or below it with input "NEXT".',
  { parent: id, input: z.string(), child: id });
tool('move_block', 'Move a top-level (unattached) block to x/y.', { block_id: id, x: z.number(), y: z.number() });
tool('delete_block', 'Delete one block (its following blocks close the gap). SETUP/FOREVER cannot be deleted.', { block_id: id });
tool('set_field', 'Change a field of an existing block (validated against the allowed values).',
  { block_id: id, field: z.string(), value: z.union([z.string(), z.number(), z.boolean()]) });
tool('clear_workspace', 'Remove all blocks (SETUP/FOREVER stay). The old state goes to editor history. Ask the user first.', {});
tool('undo', 'Undo the last editor change.', {});
tool('validate', 'Check warnings, loose blocks and missing SETUP/FOREVER without running anything.', {});
tool('list_versions', 'List saved program versions (editor history).', {});
tool('restore_version', 'Restore a version from the editor history by index (0 = newest).', { index: z.number().int().min(0) });
tool('screenshot', 'PNG image of the current blocks (for vision models).', {},
  { post: (r) => [{ type: 'image', data: r.png_base64, mimeType: 'image/png' }] });

// ── Code: nur lesen ─────────────────────────────────────────────────────────
tool('get_python', 'READ-ONLY. CircuitPython generated from the blocks (+ block warnings). For debugging, never as a fix.', {},
  { post: (r) => [text(r.python), ...(r.warnings.length ? [text({ warnings: r.warnings })] : [])] });
tool('get_code_editor', 'READ-ONLY. Text currently in the code pane and whether a human edited it by hand (differs_from_blocks).', {});

// ── Board & Konsole ─────────────────────────────────────────────────────────
tool('connection_status', 'Is the editor connected, is the board connected, which board/language. Check before run/stop/console.', {});
tool('connect', 'Connect to an already-permitted board port without a dialog. The user must click "Connect" once themselves first.',
  { index: z.number().int().min(0).optional() });
tool('run', 'Run the program built from the CURRENT BLOCKS on the board (never any other code). Refuses when disconnected or blocks have warnings. Afterwards read the console.', {}, { timeout: 60000 });
tool('stop', 'Stop the running program (Ctrl+C).', {});
tool('get_console', 'Board output (print, tracebacks) from an offset. Use next_offset for the following call.',
  { since: z.number().int().min(0).optional(), clear: z.boolean().optional() },
  { post: (r) => [text(r.text || '(empty)'), text({ from: r.from, next_offset: r.next_offset, truncated: r.truncated })] });
tool('wait_for_output', 'Wait until board output matches a regex (e.g. "Traceback|Error|Ready"), up to timeout_ms (max 60000).',
  { pattern: z.string(), since: z.number().int().min(0).optional(), timeout_ms: z.number().int().min(100).max(60000).optional() },
  { timeout: 65000 });
tool('get_js_console', 'Browser console of the editor (errors of the editor itself).', { since: z.number().int().min(0).optional() });

tool('prepare_bug_report', 'Use when a problem cannot be fixed with blocks. Returns a ready-to-paste report (blocks, generated code, console, versions). NOTHING is sent; ask the user to review it and report at kidslab.de or GitHub.',
  { summary: z.string().describe('What went wrong, in one or two sentences'), steps: z.string().optional() },
  {
    local: async ({ summary, steps }) => {
      const r = await bridge.call('bug_report_data');
      if (!r.ok) throw new Error(r.error);
      const en = lang === 'en';
      return `${buildReport(r.result, { summary, steps, lang })}\n\n---\n` +
        (en ? 'Tell the user: please review this report and post it at ' : 'Sag dem Nutzer: bitte den Bericht prüfen und melden bei ')
        + REPORT_TARGETS.join(en ? ' or ' : ' oder ') + '.';
    },
  });

// ── Ressourcen (für Clients, die Ressourcen bevorzugen) ─────────────────────
server.registerResource('guide', 'makerspaceos://guide', { description: 'Agent guide and rules', mimeType: 'text/markdown' },
  async (uri) => ({ contents: [{ uri: uri.href, mimeType: 'text/markdown', text: guide() }] }));
server.registerResource('docs', new ResourceTemplate('makerspaceos://docs/{name}', {
  list: async () => ({ resources: docFiles().map(f => ({ uri: `makerspaceos://docs/${f.slice(0, -3)}`, name: f })) }),
}), { description: 'Project docs (docs/*.md)', mimeType: 'text/markdown' },
async (uri, { name }) => ({ contents: [{ uri: uri.href, mimeType: 'text/markdown', text: readDocFile(name) }] }));

// Client weg (stdin zu) → beenden, sonst blockiert ein verwaister Server den WebSocket-Port
process.stdin.on('close', () => process.exit(0));
await server.connect(new StdioServerTransport());
console.error(`[makerspaceos-mcp] bereit. Editor öffnen: ${editorUrl()}`);
