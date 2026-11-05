// docs.js – Erklärungs-Leiste im Editor ("❓ Anleitung")
//
// Angedocktes Panel rechts (wie der Code-Bereich), standardmäßig offen mit
// "Erste Schritte"; Klick auf einen Block bzw. Rechtsklick "❓ Wie
// funktioniert das?" zeigt dessen Erklärung. Workspace bleibt daneben bedienbar. Für den vollständigen Katalog (alle Bauteile,
// Programmier-Blöcke, Boards) verlinkt der Header-Button "Bibliothek" sowie
// der Panel-Footer auf viewer.html (eigene Seite, per QR-Code/Link auch
// außerhalb des Editors nutzbar).
//
// Daten (CORE_DOCS, BOARD_DOCS, Markdown-Rendering, Karten-HTML) kommen aus
// js/docs_data.js – gemeinsam mit viewer.html genutzt, siehe dort.

(function () {
  'use strict';

  let _entries = null;   // key → entry (aus docsBuildEntries)

  function buildEntries() {
    if (_entries) return;
    _entries = docsBuildEntries(IS_EN);
  }

  // ── Erklärungs-Panel (angedockt rechts, wie der Code-Bereich) ──────────────
  //
  // Standardmäßig offen und zeigt "Erste Schritte"; ein Klick auf einen Block
  // zeigt dessen Erklärung. Offen/zu wird in localStorage gemerkt.

  const OPEN_KEY = 'makerspaceos.docsOpen';
  let _drawer = null, _drawerKey = null;   // _drawerKey null = Erste Schritte

  function _resizeWorkspace() {
    try {
      if (typeof workspace !== 'undefined' && workspace &&
          typeof Blockly !== 'undefined' && Blockly.svgResize) {
        Blockly.svgResize(workspace);
      }
    } catch (_) { /* Workspace evtl. noch nicht initialisiert */ }
  }

  function buildDrawer() {
    if (_drawer) return;
    _drawer = document.createElement('div');
    _drawer.id = 'docs-panel';
    _drawer.innerHTML = `
      <div id="docs-panel-header">
        <span>${L('❓ Anleitung', '❓ Guide')}</span>
        <button id="docs-panel-home" hidden>${L('← Erste Schritte', '← Getting started')}</button>
        <button id="docs-panel-close" title="${L('Erklärung schließen (Esc)', 'Close explanation (Esc)')}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18 18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div id="docs-panel-body"></div>
      <div id="docs-panel-footer">
        <button id="docs-panel-library" class="btn btn-ghost">${L('📚 Mehr in der Bibliothek', '📚 More in the library')}</button>
      </div>`;
    // Ins Haupt-Layout einhängen (ganz rechts, neben Code-Panel) –
    // Fallback body, falls #main fehlt (z.B. in Tests).
    (document.getElementById('main') || document.body).appendChild(_drawer);

    _drawer.querySelector('#docs-panel-close').addEventListener('click', closeDocsDrawer);
    _drawer.querySelector('#docs-panel-home').addEventListener('click', showDocsHome);
    _drawer.querySelector('#docs-panel-library').addEventListener('click', () => {
      window.open(_drawerKey ? 'viewer.html?id=' + encodeURIComponent(_drawerKey) : 'viewer.html', '_blank');
    });
    // Links im Erste-Schritte-Text (z. B. zur Board-Doku)
    _drawer.querySelector('#docs-panel-body').addEventListener('click', e => {
      const a = e.target.closest('[data-docs-key]');
      if (a) { e.preventDefault(); openDocsDrawer(a.dataset.docsKey); }
    });
  }

  function _isOpen() { return !!_drawer && _drawer.classList.contains('open'); }

  function _setOpen(open) {
    buildDrawer();
    if (_isOpen() !== open) {
      _drawer.classList.toggle('open', open);
      _resizeWorkspace();
    }
    const btn = document.getElementById('btn-docs');
    if (btn) btn.classList.toggle('active', open);
    try { localStorage.setItem(OPEN_KEY, open ? 'open' : 'closed'); } catch (_) {}
  }

  function _showHtml(key, html) {
    _drawerKey = key;
    const body = _drawer.querySelector('#docs-panel-body');
    body.innerHTML = html;
    body.scrollTop = 0;
    _drawer.querySelector('#docs-panel-home').hidden = !key;
  }

  function homeHtml() {
    const board = (typeof BOARD !== 'undefined' && BOARD.name) || '';
    const entry = {
      label: L('🚀 Erste Schritte', '🚀 Getting started'),
      colour: '#4AB8A6',
      doc: IS_EN ? GETTING_STARTED_EN : GETTING_STARTED,
    };
    const boardLink = (typeof BOARD_ID !== 'undefined' && _entries.has('board:' + BOARD_ID))
      ? `<p class="docs-home-link"><a href="#" data-docs-key="board:${escHtml(BOARD_ID)}">${
          escHtml(L('🔌 Alles über dein Board', '🔌 All about your board') + (board ? ' (' + board + ')' : ''))}</a></p>`
      : '';
    return cardHtml(entry, IS_EN) + boardLink;
  }

  window.showDocsHome = function () {
    buildEntries();
    buildDrawer();
    _showHtml(null, homeHtml());
  };

  window.openDocsDrawer = function (key) {
    buildEntries();
    const entry = _entries.get(key);
    if (!entry) return;
    buildDrawer();
    _showHtml(key, cardHtml(entry, IS_EN));
    _setOpen(true);
  };

  window.closeDocsDrawer = function () {
    if (_isOpen()) _setOpen(false);
  };

  window.toggleDocsDrawer = function () {
    _setOpen(!_isOpen());
  };

  // Vom Workspace (app.js nach inject): Auswahl eines Blocks → Erklärung.
  // Neu aus der Bausteine-Leiste gezogene Blöcke werden dabei auch ausgewählt.
  // Abwählen lässt die letzte Erklärung stehen (kein Flackern).
  window.docsAttachWorkspace = function (ws) {
    ws.addChangeListener(e => {
      if (e.type !== Blockly.Events.SELECTED || !e.newElementId || !_isOpen()) return;
      buildEntries();
      const block = ws.getBlockById(e.newElementId);
      const key = block && 'block:' + block.type;
      if (key && key !== _drawerKey && _entries.has(key)) openDocsDrawer(key);
    });
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && _drawer && _drawer.classList.contains('open')) closeDocsDrawer();
  });

  // ── Rechtsklick-Menü: "❓ Wie funktioniert das?" ────────────────────────────

  if (typeof Blockly !== 'undefined' && Blockly.ContextMenuRegistry) {
    // Eingebauten "Hilfe"-Eintrag entfernen: Er erscheint nur bei Blockly-
    // Standard-Blöcken (helpUrl) und verlinkt auf englische Blockly-/Wikipedia-
    // Seiten – stattdessen gibt es überall "❓ Wie funktioniert das?".
    // Blockly registriert seine Default-Einträge u.U. erst bei inject() (nach
    // diesem Skript), daher zusätzlich lazy in preconditionFn entfernen.
    function removeBuiltinBlockHelp() {
      const reg = Blockly.ContextMenuRegistry.registry;
      if (reg.getItem && reg.getItem('blockHelp')) reg.unregister('blockHelp');
    }
    removeBuiltinBlockHelp();

    Blockly.ContextMenuRegistry.registry.register({
      id: 'makerspaceos_block_help',
      scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
      weight: 100,   // ganz unten im Menü
      displayText: () => L('❓ Wie funktioniert das?', '❓ How does this work?'),
      preconditionFn: (scope) => {
        removeBuiltinBlockHelp();
        buildEntries();
        const type = scope.block && scope.block.type;
        return type && _entries.has('block:' + type) ? 'enabled' : 'hidden';
      },
      callback: (scope) => openDocsDrawer('block:' + scope.block.type),
    });
  }

  // ── Header-Buttons + Startzustand ──────────────────────────────────────────
  //
  // "Bibliothek" öffnet den vollständigen Katalog in neuem Tab, "Anleitung"
  // blendet die Leiste ein/aus. Der Listener hängt vor dem aus app.js, damit
  // die Leiste schon steht, wenn Blockly die Workspace-Größe misst.

  document.addEventListener('DOMContentLoaded', () => {
    const lib = document.getElementById('btn-library');
    if (lib) lib.addEventListener('click', () => window.open('viewer.html', '_blank'));
    const btn = document.getElementById('btn-docs');
    if (btn) btn.addEventListener('click', toggleDocsDrawer);

    // Start: offen – außer zuletzt geschlossen oder schmales Display (dort
    // läge die Leiste unter dem Workspace und nähme ihm die halbe Höhe).
    let stored = null;
    try { stored = localStorage.getItem(OPEN_KEY); } catch (_) {}
    const open = stored ? stored === 'open' : !window.matchMedia('(max-width: 768px)').matches;
    showDocsHome();
    _drawer.classList.toggle('open', open);
    if (btn) btn.classList.toggle('active', open);
  });

})();
