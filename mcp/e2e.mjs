// e2e.mjs – manueller Test gegen den ECHTEN Editor im Browser (nicht Teil von npm test).
// Editor öffnen: http://localhost:8000/index.html?agent=1&port=8766&token=e2e  → dann: node e2e.mjs
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
const c = new Client({ name: 'e2e', version: '0' });
await c.connect(new StdioClientTransport({ command: 'node', args: ['server.js'], env: { ...process.env, MAKERSPACEOS_PORT: '8766', MAKERSPACEOS_TOKEN: 'e2e' } }));
const call = async (n, a = {}) => { const r = await c.callTool({ name: n, arguments: a }); console.log(`\n### ${n} ${JSON.stringify(a)}${r.isError ? ' [ERROR]' : ''}\n` + r.content.map(x => (x.text ?? `[${x.type}]`).slice(0, 700)).join('\n')); return r; };
console.log('waiting for editor…'); await new Promise(r => setTimeout(r, +process.env.WAIT || 20000));
for (const step of JSON.parse(process.env.STEPS || '[]')) await call(...step);
await c.close(); process.exit(0);
