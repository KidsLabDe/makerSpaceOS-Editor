// bridge.js – WebSocket-Server (nur 127.0.0.1, Token) zum Editor (js/agent/bridge.js).
import { WebSocketServer } from 'ws';

export class EditorBridge {
  constructor({ port, token }) {
    this.port = port; this.token = token;
    this.client = null;
    this.pending = new Map();   // id → {resolve, reject, timer}
    this.seq = 0;
    this.listenError = null;
  }

  start() {
    this.wss = new WebSocketServer({ host: '127.0.0.1', port: this.port });
    this.wss.on('error', (e) => { this.listenError = e; console.error(`[makerspaceos-mcp] WebSocket-Port ${this.port}: ${e.message}`); });
    this.wss.on('connection', (ws, req) => {
      const token = new URL(req.url, 'http://x').searchParams.get('token');
      if (token !== this.token) { ws.close(4001, 'bad token'); return; }
      if (this.client) this.client.close(4000, 'replaced');
      this.client = ws;
      ws.on('message', (data) => this.#onMessage(data));
      ws.on('close', () => {
        if (this.client === ws) this.client = null;
        for (const [id, p] of this.pending) { clearTimeout(p.timer); p.reject(new Error('Editor-Verbindung getrennt')); this.pending.delete(id); }
      });
    });
  }

  get connected() { return !!this.client && this.client.readyState === 1; }

  #onMessage(data) {
    let msg; try { msg = JSON.parse(data.toString()); } catch { return; }
    const p = this.pending.get(msg.id);
    if (!p) return;
    clearTimeout(p.timer); this.pending.delete(msg.id);
    p.resolve(msg);
  }

  // → { ok, result | error, serial }
  call(cmd, args = {}, timeoutMs = 30000) {
    if (!this.connected) return Promise.reject(new Error('NO_EDITOR'));
    const id = ++this.seq;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error(`Timeout (${cmd})`)); }, timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      this.client.send(JSON.stringify({ id, cmd, args }));
    });
  }
}
