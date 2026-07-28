// i18n.js – Zweisprachigkeit (Deutsch = Default, Englisch optional)
//
// Muss als ERSTES App-Skript geladen werden (vor boards.js), damit L() überall
// verfügbar ist. Die Sprache liegt in localStorage['makerspaceos.lang'];
// Wechsel lädt die Seite neu (wie beim Board-Wechsel), weil Blöcke/Toolbox
// nur einmal bei der Registrierung gebaut werden.
//
// Konventionen:
//   L('deutsch', 'english')  → String in der aktiven Sprache
//   Markdown-Blöcke: Frontmatter-Felder *_en (label_en, tooltip_en …),
//   Doku-Body-Abschnitt nach "<!-- lang:en -->" (siehe scripts/build_blocks.js)

const LANG_STORAGE = 'makerspaceos.lang';

// index.html liest die Sprache schon vor dem Blockly-Locale-Laden und legt sie
// in window.MSOS_LANG ab; Fallback hier für Seiten ohne dieses Inline-Skript.
let LANG = (typeof window !== 'undefined' && window.MSOS_LANG) || null;
if (!LANG) {
  try {
    const stored = localStorage.getItem(LANG_STORAGE);
    if (stored === 'en' || stored === 'de') LANG = stored;
  } catch (e) { /* localStorage evtl. nicht verfügbar */ }
}
if (!LANG) {
  // Keine gespeicherte Wahl: Browsersprache als Default nutzen (Fallback für
  // Seiten ohne das Inline-Skript in index.html, siehe dort).
  const nav = (typeof navigator !== 'undefined' && (navigator.language || navigator.userLanguage)) || 'de';
  LANG = String(nav).toLowerCase().startsWith('de') ? 'de' : 'en';
}
window.MSOS_LANG = LANG;

const IS_EN = LANG === 'en';

// Zentrale Übersetzungs-Helfer: Deutsch ist immer der erste Parameter.
function L(de, en) {
  return IS_EN && en !== undefined ? en : de;
}

// Feld-Auswahl für Objekte mit *_en-Feldern (BLOCKS_DB, CORE_DOCS, catalog …):
// LF(def, 'label') → def.label_en (en) bzw. def.label (de), mit Fallback.
function LF(obj, field) {
  if (!obj) return '';
  const v = IS_EN ? (obj[field + '_en'] ?? obj[field]) : obj[field];
  return v ?? '';
}

// Sprache wechseln: persistieren + Reload (Dropdowns/Toolbox/Blöcke werden nur
// einmal aus den Registrierungsdaten gebaut, daher Reload statt Live-Wechsel).
function setLang(id) {
  if ((id !== 'de' && id !== 'en') || id === LANG) return;
  try { localStorage.setItem(LANG_STORAGE, id); } catch (e) { /* ignorieren */ }
  location.reload();
}

// ── Statische index.html-Texte übersetzen (nur bei EN nötig) ─────────────────
// Deutsch bleibt direkt im HTML; Elemente tragen data-i18n / data-i18n-title /
// data-i18n-ph mit dem englischen Text. Ersetzt wird nur der letzte Text-Knoten,
// damit SVG-Icons in Buttons erhalten bleiben.

function _setLastTextNode(el, text) {
  for (let i = el.childNodes.length - 1; i >= 0; i--) {
    const n = el.childNodes[i];
    if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
      n.textContent = text;
      return;
    }
  }
  el.appendChild(document.createTextNode(text));
}

document.addEventListener('DOMContentLoaded', () => {
  // Sprach-Dropdown im Header vorbelegen + Wechsel-Handler
  const langSel = document.getElementById('lang-select');
  if (langSel) {
    langSel.value = LANG;
    langSel.addEventListener('change', () => setLang(langSel.value));
  }

  if (!IS_EN) return;

  document.documentElement.lang = 'en';

  for (const el of document.querySelectorAll('[data-i18n]')) {
    _setLastTextNode(el, el.getAttribute('data-i18n'));
  }
  for (const el of document.querySelectorAll('[data-i18n-title]')) {
    el.title = el.getAttribute('data-i18n-title');
  }
  for (const el of document.querySelectorAll('[data-i18n-ph]')) {
    el.placeholder = el.getAttribute('data-i18n-ph');
  }
});
