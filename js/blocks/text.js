// text.js – handgeschriebene Text-Hilfsblöcke
// Generator in js/generator.js, Toolbox-Eintrag in js/toolbox.js

// 🔗 verbinde [ ] und [ ]  – hängt zwei Texte klar sichtbar aneinander.
// Klarer als das eingebaute text_join ("erstelle Text mit …"): zwei feste Slots
// mit dem Wort "und" dazwischen zeigen den Einsteigern direkt, was passiert.
Blockly.Blocks['text_verbinden'] = {
  init() {
    this.appendValueInput('A').appendField('🔗 verbinde');
    this.appendValueInput('B').appendField('und');
    this.setInputsInline(true);
    this.setOutput(true, 'String');
    this.setColour('#0891B2');
    this.setTooltip('Hängt zwei Texte aneinander, z. B. "Hallo " und "Welt" ergibt "Hallo Welt".');
  },
};
