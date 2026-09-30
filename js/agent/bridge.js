// agent/bridge.js – Brücke zwischen dem Editor und dem MCP-Server (mcp/server.js).
// Wird NUR mit ?agent=1&token=… geladen (siehe index.html). Verbindet sich per
// WebSocket mit 127.0.0.1 und führt Befehle aus AGENT_COMMANDS aus. Ohne Parameter
// passiert nichts – normaler Betrieb (Schule, Kinder) bleibt unberührt.
// Regel: Die Brücke ändert Programme NUR über Blöcke. Code (Python) ist nur lesbar.

const AGENT_COMMANDS = {};   // name → async (args) => Ergebnis (JSON-tauglich)

const AGENT_BUFFER_MAX = 200000;   // Zeichen Board-Konsole
const AGENT_JS_LOG_MAX = 500;      // Einträge Browser-Konsole

// ── Puffer: Board-Konsole (Offset-basiert) ──────────────────────────────────
const agentConsole = { text: '', start: 0 };   // start = Offset des ersten Zeichens in text

function agentCleanSerial(text) {
  // Raw-REPL-Steuerzeichen raus, Zeilenenden vereinheitlichen
  return text.replace(/\r\n?/g, '\n').replace(/[\x00-\x08\x0b-\x1f\x7f]/g, '');
}

function agentPushConsole(text) {
  agentConsole.text += agentCleanSerial(text);
  const over = agentConsole.text.length - AGENT_BUFFER_MAX;
  if (over > 0) { agentConsole.text = agentConsole.text.slice(over); agentConsole.start += over; }
}

function agentReadConsole(since) {
  const end = agentConsole.start + agentConsole.text.length;
  const from = Math.max(since ?? agentConsole.start, agentConsole.start);
  return { text: agentConsole.text.slice(from - agentConsole.start), from, next_offset: end,
           truncated: since != null && since < agentConsole.start };
}

// ── Puffer: Browser-Konsole ─────────────────────────────────────────────────
const agentJsLog = [];   // {i, t, level, msg}
let agentJsSeq = 0;

function agentPushJs(level, args) {
  const msg = args.map(a => {
    if (a instanceof Error) return a.stack || a.message;
    if (typeof a === 'object') { try { return JSON.stringify(a); } catch (_) { return String(a); } }
    return String(a);
  }).join(' ');
  agentJsLog.push({ i: agentJsSeq++, t: new Date().toISOString(), level, msg: msg.slice(0, 2000) });
  if (agentJsLog.length > AGENT_JS_LOG_MAX) agentJsLog.shift();
}

for (const level of ['log', 'info', 'warn', 'error']) {
  const orig = console[level].bind(console);
  console[level] = (...args) => { agentPushJs(level, args); orig(...args); };
}
window.addEventListener('error', e => agentPushJs('error', [`${e.message} (${e.filename}:${e.lineno})`]));
window.addEventListener('unhandledrejection', e => agentPushJs('error', ['Unhandled rejection:', e.reason]));

AGENT_COMMANDS.get_console = async ({ since, clear } = {}) => {
  const r = agentReadConsole(since);
  if (clear) { agentConsole.start += agentConsole.text.length; agentConsole.text = ''; }
  return r;
};

AGENT_COMMANDS.get_js_console = async ({ since = 0 } = {}) => {
  const entries = agentJsLog.filter(e => e.i >= since);
  return { entries, next_index: agentJsSeq };
};

// wait_for_output: pollt den Puffer bis das Muster passt oder das Timeout abläuft
AGENT_COMMANDS.wait_for_output = async ({ pattern, since, timeout_ms = 10000 }) => {
  const re = new RegExp(pattern, 'm');
  const deadline = performance.now() + Math.min(timeout_ms, 60000);
  while (true) {
    const r = agentReadConsole(since);
    const m = re.exec(r.text);
    if (m) return { matched: true, match: m[0], ...r };
    if (performance.now() >= deadline) return { matched: false, ...r };
    await new Promise(res => setTimeout(res, 100));
  }
};

// ── Transport ───────────────────────────────────────────────────────────────
(function startBridge() {
  const q = new URLSearchParams(location.search);
  const token = q.get('token');
  const port = q.get('port') || '8765';
  if (!token) { console.warn('[agent] ?token fehlt – Bridge inaktiv'); return; }

  if (typeof serial !== 'undefined') serial.onDataTap = agentPushConsole;

  function connect() {
    const ws = new WebSocket(`ws://127.0.0.1:${port}/?token=${encodeURIComponent(token)}`);
    ws.onopen = () => { agentSetBadge(true); };
    ws.onclose = () => { agentSetBadge(false); setTimeout(connect, 2000); };
    ws.onerror = () => { /* onclose folgt – dort wird neu verbunden */ };
    ws.onmessage = async (ev) => {
      let msg;
      try { msg = JSON.parse(ev.data); } catch (_) { return; }
      const fn = AGENT_COMMANDS[msg.cmd];
      let reply;
      try {
        if (!fn) throw new Error('Unbekannter Befehl: ' + msg.cmd);
        reply = { id: msg.id, ok: true, result: await fn(msg.args || {}) };
      } catch (e) {
        reply = { id: msg.id, ok: false, error: e && e.message ? e.message : String(e) };
      }
      reply.serial = typeof serial !== 'undefined' && serial.isConnected;
      reply.lang = LANG;   // Server richtet Erinnerungen/Berichte danach aus
      ws.send(JSON.stringify(reply));
    };
  }
  connect();
})();

// Kleines Abzeichen unten links: zeigt, dass ein KI-Agent verbunden sein kann.
function agentSetBadge(connected) {
  let el = document.getElementById('agent-badge');
  if (!el) {
    el = document.createElement('div');
    el.id = 'agent-badge';
    el.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:9999;padding:3px 8px;border-radius:10px;font:600 11px system-ui;color:#fff;';
    document.body.appendChild(el);
  }
  el.style.background = connected ? '#16A34A' : '#94A3B8';
  el.textContent = connected ? '🤖 Agent verbunden / connected' : '🤖 Agent wartet / waiting';
}
