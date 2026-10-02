// agent/board.js – Verbindung, Ausführen und Fehlerbericht.
// „Ausführen“ startet immer nur den aus den BLÖCKEN erzeugten Code (generateCode()),
// nie vom Agenten gelieferten oder im Code-Feld handbearbeiteten Text.

AGENT_COMMANDS.connection_status = async () => ({
  serial: serial.isConnected, boardId: BOARD_ID, boardName: BOARD.name, lang: LANG,
  edit_mode: !codeEditor.getOption('readOnly'),
  console_offset: agentReadConsole().next_offset,
});

// Öffnet einen bereits freigegebenen Port (ohne Dialog). Der erste Zugriff braucht
// einen echten Klick auf „Verbinden“ – das kann kein Agent auslösen.
AGENT_COMMANDS.connect = async ({ index } = {}) => {
  if (serial.isConnected) return { ok: true, already: true };
  if (!('serial' in navigator)) throw new Error('Web Serial nicht verfügbar (Chrome/Edge nötig)');
  const ports = await navigator.serial.getPorts();
  if (!ports.length) throw new Error('NO_GRANTED_PORT: Bitte einmal selbst auf „Verbinden“ klicken und das Board wählen.');
  if (ports.length > 1 && index === undefined) {
    throw new Error(`${ports.length} Ports freigegeben – connect mit index (0–${ports.length - 1}) aufrufen: ` +
      ports.map((p, i) => `${i}=${JSON.stringify(p.getInfo())}`).join(' '));
  }
  await connectBoard(ports[index ?? 0]);
  return { ok: true };
};

AGENT_COMMANDS.run = async () => {
  if (!serial.isConnected) throw new Error('NOT_CONNECTED: Board nicht verbunden (connect oder Klick auf „Verbinden“).');
  const s = agentSummary();
  if (s.warnings.length) throw new Error('BLOCK_WARNINGS: Blöcke haben Warnungen – erst beheben: ' + s.warnings.map(w => `${w.type}[${w.id}]: ${w.text}`).join(' | '));
  const offset = agentReadConsole().next_offset;
  await serial.uploadAndRun(generateCode());
  pushVersion();
  saveCurrent();
  return { ok: true, console_offset: offset, floating: s.floating };
};

AGENT_COMMANDS.stop = async () => {
  if (!serial.isConnected) throw new Error('NOT_CONNECTED: Board nicht verbunden.');
  await serial.stop();
  return { ok: true };
};

// Rohdaten für prepare_bug_report (Text wird im Server zusammengesetzt)
AGENT_COMMANDS.bug_report_data = async () => {
  const python = generateCode();
  const text = codeEditor.getValue();
  return {
    userAgent: navigator.userAgent, lang: LANG, boardId: BOARD_ID, boardName: BOARD.name,
    libVersion: window.LIB_MANIFEST && window.LIB_MANIFEST.libVersion,
    serial: serial.isConnected,
    workspace: Blockly.serialization.workspaces.save(workspace),
    python, codeEditorDiffers: text !== python, codeEditorText: text !== python ? text : undefined,
    warnings: agentWarnings(),
    consoleTail: agentReadConsole(Math.max(0, agentReadConsole().next_offset - 4000)).text,
    jsErrors: agentJsLog.filter(e => e.level === 'error' || e.level === 'warn').slice(-20),
  };
};
