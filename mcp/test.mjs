// test.mjs – Rauchtest: echter MCP-Server (stdio) + gefälschter Editor (WebSocket). Aufruf: npm test
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import WebSocket from 'ws';

const PORT = 18000 + Math.floor(Math.random() * 1000), TOKEN = 'testtoken';
const client = new Client({ name: 'test', version: '0' });
await client.connect(new StdioClientTransport({
  command: 'node', args: ['server.js'],
  env: { ...process.env, MAKERSPACEOS_PORT: String(PORT), MAKERSPACEOS_TOKEN: TOKEN, MAKERSPACEOS_LANG: 'en' },
}));
const call = async (name, args = {}) => {
  const r = await client.callTool({ name, arguments: args });
  return { err: !!r.isError, text: r.content.map(c => c.text ?? `[${c.type}]`).join('\n') };
};

// 1. Regeln: kein Werkzeug schreibt/bearbeitet/startet Code
const names = (await client.listTools()).tools.map(t => t.name);
assert.ok(names.includes('run') && names.includes('get_python'));
assert.ok(!names.some(n => /raw|set_code|edit_code|run_code|write_code/.test(n)), 'kein Code-Schreibwerkzeug erlaubt');
assert.match((await client.listTools()).tools.find(t => t.name === 'get_python').description, /READ-ONLY/);
assert.match(client.getInstructions(), /ONLY with block tools/);

// 2. Ohne Editor: Wissen aus Dateien geht, Editor-Werkzeuge melden die URL
assert.match((await call('get_project_guide')).text, /kidslab\.de/);
assert.match((await call('search_docs', { query: 'ESP32' })).text, /file:esp32-d1-r32/);
let r = await call('run');
assert.ok(r.err); assert.match(r.text, new RegExp(`port=${PORT}&token=${TOKEN}`));

// 3. Gefälschter Editor mit falschem Token wird abgewiesen
const bad = new WebSocket(`ws://127.0.0.1:${PORT}/?token=nope`);
await new Promise(res => bad.on('close', res));

// 4. Gefälschter Editor mit richtigem Token
let serial = false, warnings = [];
const page = new WebSocket(`ws://127.0.0.1:${PORT}/?token=${TOKEN}`);
await new Promise(res => page.on('open', res));
const handlers = {
  connection_status: () => ({ ok: true, result: { serial, lang: 'en' } }),
  run: () => serial ? { ok: true, result: { ok: true } } : { ok: false, error: 'NOT_CONNECTED: Board nicht verbunden' },
  get_console: () => ({ ok: true, result: { text: 'Traceback (most recent call last):', from: 0, next_offset: 33 } }),
  add_block: () => ({ ok: true, result: { id: 'b1', warnings, floating: [] } }),
  get_code_editor: () => ({ ok: true, result: { text: 'x', edit_mode: true, differs_from_blocks: true } }),
  bug_report_data: () => ({ ok: true, result: { boardName: 'B', boardId: 'b', serial, lang: 'en', userAgent: 'UA', workspace: { blocks: {} }, python: 'print(1)', warnings: [], consoleTail: 'oops', jsErrors: [] } }),
};
page.on('message', (d) => {
  const m = JSON.parse(d.toString());
  page.send(JSON.stringify({ id: m.id, serial, lang: 'en', ...handlers[m.cmd](m.args) }));
});
r = await call('run');
assert.ok(r.err); assert.match(r.text, /NOT_CONNECTED/); assert.match(r.text, /click "Connect" once/);
r = await call('get_console');
assert.match(r.text, /Board not connected/); assert.match(r.text, /prepare_bug_report/);
warnings = [{ id: 'b1', type: 'x', text: 'w' }];
assert.match((await call('add_block', { type: 'x' })).text, /1 block warning/);
assert.match((await call('get_code_editor')).text, /edited by hand/);
r = await call('prepare_bug_report', { summary: 'generator emits wrong pin' });
assert.match(r.text, /github\.com\/KidsLabDe\/makerSpaceOS-Editor\/issues/); assert.match(r.text, /print\(1\)/);

console.log('mcp smoke test ok');
page.close(); await client.close(); process.exit(0);
