// docs.js – Rechtsklick-Hilfe im Editor ("❓ Wie funktioniert das?")
//
// Öffnet ein angedocktes Panel rechts (wie der Code-Bereich), Workspace
// bleibt daneben bedienbar. Für den vollständigen Katalog (alle Bauteile,
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

  let _drawer = null, _drawerKey = null;

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
        <span>${L('❓ Erklärung', '❓ Explanation')}</span>
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
    _drawer.querySelector('#docs-panel-library').addEventListener('click', () => {
      window.open('viewer.html?id=' + encodeURIComponent(_drawerKey || ''), '_blank');
    });
  }

  window.openDocsDrawer = function (key) {
    buildEntries();
    const entry = _entries.get(key);
    if (!entry) return;
    buildDrawer();
    _drawerKey = key;
    _drawer.querySelector('#docs-panel-body').innerHTML = cardHtml(entry, IS_EN);
    _drawer.querySelector('#docs-panel-body').scrollTop = 0;
    if (!_drawer.classList.contains('open')) {
      _drawer.classList.add('open');
      _resizeWorkspace();
    }
  };

  window.closeDocsDrawer = function () {
    if (_drawer && _drawer.classList.contains('open')) {
      _drawer.classList.remove('open');
      _resizeWorkspace();
    }
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

  // ── Header-Button: öffnet die vollständige Bibliothek in neuem Tab ─────────

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-library');
    if (btn) btn.addEventListener('click', () => window.open('viewer.html', '_blank'));
  });

})();
