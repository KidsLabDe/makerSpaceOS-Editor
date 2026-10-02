// rules.js – Regeltexte und Erinnerungen (DE/EN) an EINER Stelle.
// instructions() geht beim MCP-Start an jeden Client; reminders() hängt sich an Werkzeug-Ergebnisse.

const T = {
  de: {
    rules: [
      'REGELN: Programme NUR mit Block-Werkzeugen ändern. Es gibt kein Werkzeug, das Python schreibt; empfiehl dem Nutzer nie, Code selbst zu ändern.',
      'Code (get_python, get_code_editor) ist nur zum Lesen/Debuggen.',
      'Nicht mit Blöcken lösbar (Generator-/Lib-Fehler, fehlender Block)? → prepare_bug_report und Nutzer bitten, bei kidslab.de oder https://github.com/KidsLabDe/makerSpaceOS-Editor/issues zu melden.',
      'Vor run/stop/Konsole connection_status prüfen. Nach run die Konsole auf Fehler prüfen, bevor du Erfolg meldest.',
      'Erst list_blocks/describe_block, dann bauen, dann validate. Bei vorhandenem Programm vor set_workspace/clear_workspace nachfragen.',
      'Beginne mit get_project_guide.',
    ],
    notConnected: 'Board nicht verbunden. connection_status prüfen, dann connect; klappt das nicht: den Nutzer bitten, einmal selbst „Verbinden“ zu klicken.',
    warnings: n => `${n} Warnung(en) an Blöcken – vor run beheben (validate zeigt Details).`,
    floating: n => `${n} lose(r) Block/Blöcke außerhalb von SETUP/FÜR IMMER/Ereignis – wird nicht ausgeführt.`,
    afterRun: 'Gestartet heißt nicht, dass es funktioniert: mit get_console/wait_for_output (Muster „Traceback|Error“) prüfen, bevor du Erfolg meldest.',
    readOnlyCode: 'Nur lesen. Fehler mit Blöcken beheben; wenn das nicht geht: prepare_bug_report – niemals Code-Änderungen vorschlagen.',
    codeDiffers: 'Das Code-Feld wurde von Hand geändert. „run“ nutzt trotzdem NUR den Blockcode, nicht diesen Text.',
    traceback: 'Fehler in der Konsole: mit Blöcken beheben. Liegt es am generierten Code/der Lib, prepare_bug_report nutzen – nicht Code empfehlen.',
    snapshot: 'Der vorige Stand liegt im Editor-Verlauf (list_versions / restore_version).',
    noEditor: 'Editor nicht verbunden. Öffne die URL aus get_editor_url in Chrome/Edge.',
  },
  en: {
    rules: [
      'RULES: change programs ONLY with block tools. No tool writes Python; never advise the user to change code themselves.',
      'Code (get_python, get_code_editor) is read-only, for debugging.',
      'Not solvable with blocks (generator/lib bug, missing block)? → prepare_bug_report and ask the user to report it at kidslab.de or https://github.com/KidsLabDe/makerSpaceOS-Editor/issues.',
      'Check connection_status before run/stop/console. After run, check the console for errors before reporting success.',
      'list_blocks/describe_block first, then build, then validate. Ask before set_workspace/clear_workspace when a program exists.',
      'Start with get_project_guide.',
    ],
    notConnected: 'Board not connected. Check connection_status, then connect; if that fails ask the user to click "Connect" once themselves.',
    warnings: n => `${n} block warning(s) – fix before run (validate shows details).`,
    floating: n => `${n} loose block(s) outside SETUP/FOREVER/an event – they will not run.`,
    afterRun: 'Started ≠ working: check get_console/wait_for_output (pattern "Traceback|Error") before reporting success.',
    readOnlyCode: 'Read-only. Fix problems with blocks; if that is impossible use prepare_bug_report – never suggest code changes.',
    codeDiffers: 'The code pane was edited by hand. "run" still uses ONLY the block code, not this text.',
    traceback: 'Error in the console: fix with blocks. If it is the generated code/a lib, use prepare_bug_report – do not recommend code changes.',
    snapshot: 'The previous state is kept in the editor history (list_versions / restore_version).',
    noEditor: 'Editor not connected. Open the URL from get_editor_url in Chrome/Edge.',
  },
};

export const t = (lang) => T[lang] || T.de;

export const instructions = (lang) => t(lang).rules.join('\n');

const NEEDS_BOARD = new Set(['run', 'stop', 'get_console', 'wait_for_output']);
const EDITS = new Set(['add_block', 'connect_blocks', 'set_field', 'set_workspace', 'clear_workspace', 'undo', 'restore_version']);

// → Liste kurzer Erinnerungen passend zu Werkzeug und Ergebnis
export function reminders({ tool, result, error, serial, lang }) {
  const m = t(lang), out = [];
  if (NEEDS_BOARD.has(tool) && serial === false) out.push(m.notConnected);
  if (error && /NOT_CONNECTED|NO_GRANTED_PORT/.test(error) && !out.includes(m.notConnected)) out.push(m.notConnected);
  const warnings = result && result.warnings && result.warnings.length;
  const floating = result && result.floating && result.floating.length;
  if ((EDITS.has(tool) || tool === 'validate') && warnings) out.push(m.warnings(warnings));
  if ((EDITS.has(tool) || tool === 'validate') && floating) out.push(m.floating(floating));
  if (tool === 'set_workspace' || tool === 'clear_workspace') out.push(m.snapshot);
  if (tool === 'run' && !error) out.push(m.afterRun);
  if (tool === 'get_python' || tool === 'get_code_editor') out.push(m.readOnlyCode);
  if (tool === 'get_code_editor' && result && result.differs_from_blocks) out.push(m.codeDiffers);
  if ((tool === 'get_console' || tool === 'wait_for_output') && result && /Traceback|Error/.test(result.text || result.match || '')) out.push(m.traceback);
  return out;
}
