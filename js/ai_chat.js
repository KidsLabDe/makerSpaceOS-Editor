// ai_chat.js – KI-Block-Generator (OpenRouter / Gemma)

const AI_KEY_STORE    = 'makerspaceos_ai_key';
const AI_MODEL_STORE  = 'makerspaceos_ai_model';
const AI_BLOCKS_STORE = 'makerspaceos_ai_blocks';
const AI_CHAT_STORE   = 'makerspaceos_ai_chat';
const AI_DEFAULT_MODEL = 'google/gemma-3-27b-it';

const AI_SYSTEM_PROMPT = `Du bist ein CircuitPython-Experte für den Cytron MAKER-PI-RP2040 (RP2040, CircuitPython 8+).
Deine Aufgabe: Generiere eine einzelne CircuitPython-Hilfsfunktion basierend auf der Beschreibung des Nutzers.

Antworte NUR mit einem JSON-Objekt in diesem exakten Format – kein Text davor oder danach:
{
  "label": "🌈 Regenbogen-Animation",
  "tooltip": "Spielt eine Regenbogen-Animation auf den NeoPixel-LEDs",
  "colour": "#E24D3D",
  "functionName": "regenbogen_animation",
  "imports": ["import board", "import neopixel", "import time"],
  "inits": {
    "init_pixels": "_pixels = neopixel.NeoPixel(board.GP18, 13, brightness=0.3, auto_write=False)"
  },
  "functionCode": "def regenbogen_animation():\\n    for i in range(13):\\n        _pixels[i] = (i*20, 0, 255-i*20)\\n    _pixels.show()"
}

Regeln:
- functionName: nur Kleinbuchstaben und Unterstriche, kein Leerzeichen
- imports: Liste der benötigten Import-Anweisungen
- inits: Initialisierungen, die einmal im globalen Scope stehen (Keys sind eindeutige Bezeichner)
- functionCode: vollständige def-Funktion als einzeiliger String mit \\n für Zeilenumbrüche und 4 Leerzeichen Einrückung
- NeoPixel-Pin ist GP18 (13 LEDs), Buzzer GP22, externe GPIO-Pins: GP4, GP5, GP16, GP17, GP26, GP27, GP28
- Verfügbare Bibliotheken: board, digitalio, analogio, neopixel, pwmio, busio, time, math
- Alle Texte im JSON auf Deutsch (label, tooltip)`;

// ── Gespeicherte Blöcke beim Start laden (sync, vor DOMContentLoaded) ─────────

var _aiBlocks = [];
var _aiChat   = [];

(function loadSavedAIBlocks() {
  try {
    _aiBlocks = JSON.parse(localStorage.getItem(AI_BLOCKS_STORE) || '[]');
    _aiChat   = JSON.parse(localStorage.getItem(AI_CHAT_STORE)   || '[]');
  } catch (_) {
    _aiBlocks = [];
    _aiChat   = [];
  }
  for (const def of _aiBlocks) _registerAIBlock(def);
  _refreshAIToolboxVar();
})();

// ── Block-Registrierung ───────────────────────────────────────────────────────

function _aiImportToKey(imp) {
  if (imp.startsWith('from ')) {
    const m = imp.match(/import\s+(\w+)/);
    return 'from_' + (m ? m[1] : 'unknown');
  }
  const m = imp.match(/import\s+(\w+)$/);
  if (!m) return 'import_' + imp.replace(/\W+/g, '_');
  return 'import_' + m[1].replace(/^adafruit_/, '');
}

function _registerAIBlock(def) {
  const id = 'ai_' + def.functionName;
  if (Blockly.Blocks[id]) return;

  Blockly.Blocks[id] = {
    init: function () {
      this.appendDummyInput().appendField(def.label || def.functionName);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(def.colour || '#A57BC3');
      this.setTooltip(def.tooltip || '');
    }
  };

  Blockly.Python[id] = function () {
    for (const imp of (def.imports || [])) {
      _defs[_aiImportToKey(imp)] = imp;
    }
    for (const [k, v] of Object.entries(def.inits || {})) {
      _defs[k] = v;
    }
    _defs['fn_' + def.functionName] = def.functionCode;
    return def.functionName + '()\n';
  };
}

function _refreshAIToolboxVar() {
  window.AI_BLOCKS_TOOLBOX = _aiBlocks.length
    ? [{
        kind:     'category',
        name:     'KI-Blöcke',
        colour:   '#A57BC3',
        contents: _aiBlocks.map(d => ({ kind: 'block', type: 'ai_' + d.functionName })),
      }]
    : [];
}

function _refreshToolbox() {
  _refreshAIToolboxVar();
  const ws = Blockly.getMainWorkspace();
  if (ws) ws.updateToolbox(buildFinalToolbox());
}

// ── OpenRouter API-Call ───────────────────────────────────────────────────────

async function _callOpenRouter(userMessage) {
  const apiKey = localStorage.getItem(AI_KEY_STORE) || '';
  const model  = localStorage.getItem(AI_MODEL_STORE) || AI_DEFAULT_MODEL;
  if (!apiKey) throw new Error('Kein API-Key gespeichert. Bitte in ⚙️ Einstellungen eintragen.');

  const messages = [
    { role: 'system', content: AI_SYSTEM_PROMPT },
    ..._aiChat.slice(-10),
    { role: 'user', content: userMessage },
  ];

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type':  'application/json',
      'HTTP-Referer':  window.location.origin,
      'X-Title':       'makerSpaceOS',
    },
    body: JSON.stringify({ model, messages }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`API-Fehler ${res.status}: ${err?.error?.message || res.statusText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

function _extractJSON(text) {
  try { return JSON.parse(text.trim()); } catch (_) {}
  const m = text.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch (_) {} }
  throw new Error('Keine gültige JSON-Antwort vom Modell erhalten.');
}

// ── Chat senden ───────────────────────────────────────────────────────────────

async function aiSend() {
  const input   = document.getElementById('ai-input');
  const sendBtn = document.getElementById('ai-send-btn');
  const text    = input.value.trim();
  if (!text) return;

  input.value   = '';
  sendBtn.disabled = true;

  _appendUserMsg(text);
  const thinkingEl = _appendThinkingMsg();

  try {
    const raw = await _callOpenRouter(text);
    const def = _extractJSON(raw);

    if (!def.functionName || !def.functionCode) {
      throw new Error('Antwort enthält keinen Funktionsnamen oder Code.');
    }
    def.functionName = def.functionName.replace(/[^a-z0-9_]/g, '_');

    thinkingEl.remove();
    _appendBotMsg(def);

    _aiChat.push({ role: 'user',      content: text });
    _aiChat.push({ role: 'assistant', content: JSON.stringify(def) });
    if (_aiChat.length > 20) _aiChat.splice(0, _aiChat.length - 20);
    localStorage.setItem(AI_CHAT_STORE, JSON.stringify(_aiChat));

  } catch (e) {
    thinkingEl.remove();
    _appendErrorMsg(e.message);
  } finally {
    sendBtn.disabled = false;
    input.focus();
  }
}

// ── Block hinzufügen / löschen ────────────────────────────────────────────────

function aiAddBlock(def, btn) {
  if (_aiBlocks.find(b => b.functionName === def.functionName)) {
    showToast('Block bereits vorhanden!', 'warn');
    return;
  }
  _registerAIBlock(def);
  _aiBlocks.push(def);
  localStorage.setItem(AI_BLOCKS_STORE, JSON.stringify(_aiBlocks));
  _refreshToolbox();
  showToast(`Block "${def.label}" hinzugefügt!`, 'ok');
  if (btn) { btn.disabled = true; btn.textContent = '✔ Hinzugefügt'; }
}

function aiDeleteBlock(functionName) {
  _aiBlocks = _aiBlocks.filter(b => b.functionName !== functionName);
  localStorage.setItem(AI_BLOCKS_STORE, JSON.stringify(_aiBlocks));
  delete Blockly.Blocks['ai_' + functionName];
  delete Blockly.Python['ai_' + functionName];
  _refreshToolbox();
  showToast('Block entfernt.', 'ok');
}

// ── Chat-Verlauf löschen ──────────────────────────────────────────────────────

function aiClearChat() {
  if (!confirm('Chat-Verlauf löschen?')) return;
  _aiChat = [];
  localStorage.removeItem(AI_CHAT_STORE);
  document.getElementById('ai-messages').innerHTML = '';
}

// ── Nachrichten-Elemente ──────────────────────────────────────────────────────

function _appendUserMsg(text) {
  const el = document.createElement('div');
  el.className = 'ai-msg-user';
  el.textContent = text;
  _appendToChat(el);
}

function _appendThinkingMsg() {
  const el = document.createElement('div');
  el.className = 'ai-msg-thinking';
  el.textContent = '⏳ Generiere Code…';
  _appendToChat(el);
  return el;
}

function _appendBotMsg(def) {
  const el    = document.createElement('div');
  el.className = 'ai-msg-bot';

  const label = document.createElement('div');
  label.className = 'ai-block-label';
  label.textContent = def.label || def.functionName;

  const pre = document.createElement('pre');
  pre.textContent = def.functionCode || '';

  const actions = document.createElement('div');
  actions.className = 'ai-actions';

  const addBtn = document.createElement('button');
  addBtn.className   = 'ai-add-btn';
  addBtn.textContent = '＋ Block hinzufügen';
  addBtn.onclick     = () => aiAddBlock(def, addBtn);

  const delBtn = document.createElement('button');
  delBtn.className   = 'ai-del-btn';
  delBtn.textContent = '✕ Entfernen';
  delBtn.title       = 'Nachricht entfernen';
  delBtn.onclick     = () => el.remove();

  actions.append(addBtn, delBtn);
  el.append(label, pre, actions);
  _appendToChat(el);
}

function _appendErrorMsg(msg) {
  const el = document.createElement('div');
  el.className = 'ai-msg-error';
  el.textContent = '⚠️ ' + msg;
  _appendToChat(el);
}

function _appendToChat(el) {
  const container = document.getElementById('ai-messages');
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
}

// ── Drawer-Steuerung ──────────────────────────────────────────────────────────

function aiOpen() {
  document.getElementById('ai-drawer').classList.add('open');
  document.getElementById('ai-overlay').classList.add('show');
  setTimeout(() => document.getElementById('ai-input').focus(), 50);
}

function aiClose() {
  document.getElementById('ai-drawer').classList.remove('open');
  document.getElementById('ai-overlay').classList.remove('show');
}

function aiToggleSettings() {
  const s      = document.getElementById('ai-settings');
  const hidden = s.style.display === 'none' || !s.style.display;
  s.style.display = hidden ? 'flex' : 'none';
  if (hidden) {
    document.getElementById('ai-key-input').value   = localStorage.getItem(AI_KEY_STORE)   || '';
    document.getElementById('ai-model-input').value = localStorage.getItem(AI_MODEL_STORE) || AI_DEFAULT_MODEL;
  }
}

function aiSaveSettings() {
  const key   = document.getElementById('ai-key-input').value.trim();
  const model = document.getElementById('ai-model-input').value.trim() || AI_DEFAULT_MODEL;
  if (key) localStorage.setItem(AI_KEY_STORE, key);
  localStorage.setItem(AI_MODEL_STORE, model);
  document.getElementById('ai-settings').style.display = 'none';
  showToast('Einstellungen gespeichert.', 'ok');
}

// ── Tastaturkürzel ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const inp = document.getElementById('ai-input');
  if (inp) {
    inp.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        aiSend();
      }
    });
  }
});
