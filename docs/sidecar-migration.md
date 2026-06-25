# Umsetzungsplan: Sidecar-JS pro Bauteil (Trennung Inhalt / Logik)

## Context

Heute sind Hardware-Blöcke deklarativ (`components/**/*.md` → `scripts/build_blocks.js`
→ `js/blocks_db.js` → `js/block_builder.js`). Block-**Logik**, die das YAML nicht
ausdrücken kann, liegt aber verstreut in Monolithen: `js/generator.js`
(`legacyGenerator`-Fälle), `js/blocks/events.js` (Ereignis-Hüte), `js/blocks/matrix.js`
(Matrix + Custom-Field-Klassen), `js/blocks/control.js` (Kern-Blöcke). Die statische
Toolbox steckt in `js/toolbox.js`.

**Ziel:** Jedes Bauteil wird eine in sich geschlossene Einheit — **Inhalt** in `.md`,
**Logik** in optionaler gleichnamiger `.js` daneben. Zentrale JS-Dateien behalten nur
noch die *gemeinsame Engine* (Helfer, `_defs`-Mechanik, `finish()`), keine einzelnen
Block-Definitionen mehr. `index.html` bleibt statisch/inhaltsfrei. Kein App-Build-Schritt
neu — der bestehende `build_blocks.js`-Lauf bündelt die Sidecars mit.

**Ergebnis:** Saubere Trennung Inhalt/Logik + Erweiterbarkeit (neues Bauteil =
neuer Ordnereintrag, keine zentralen Dateien anfassen).

## Zielstruktur pro Bauteil

```
components/actuators/motor_forward.md   ← Inhalt: Felder, Label, Toolbox, Metadaten
components/actuators/motor_forward.js   ← Logik (optional): Generator, ggf. Custom-Field
```

- `.md` **ohne** `.js` → Generator wird wie heute aus dem YAML gebaut (Normalfall, unverändert).
- `.md` **mit** `.js` → die `.js` liefert die Logik; ersetzt das heutige
  `legacyGenerator: true` + den Eintrag in `js/generator.js`.

## Architektur-Entscheidung: Registry statt Lade-Reihenfolge

Heute funktioniert `legacyGenerator` über Lade-Reihenfolge (`generator.js` lädt nach
`block_builder.js` und überschreibt). Das ist fragil. Stattdessen: **explizite Registry**,
die `block_builder.js` konsultiert — Sidecars sind dann reihenfolge-unabhängig.

**Neue Datei `js/component_engine.js`** (klein, lädt vor dem Sidecar-Bundle):

```js
// Globale Registry + Helfer für Bauteil-Logik
window.COMPONENT_LOGIC = window.COMPONENT_LOGIC || {};
window.MSOS = window.MSOS || {};
// Sidecar ruft das auf:
MSOS.register = function (id, impl) {
  // impl: { init?(def), generator?(block), fields?: {Name: FieldClass}, toolbox?(def) }
  window.COMPONENT_LOGIC[id] = impl;
};
```

Die gemeinsamen Generator-Helfer (`_defs`, `_digitalInDef`, `_digitalOutDef`,
`_motorDefs`, `_whenTask`, `_indent`, `finish` …) bleiben global verfügbar — sie wandern
aus `js/generator.js` in ein **Engine-Modul** und werden von den Sidecars genutzt.

**`js/block_builder.js` anpassen** (Registrierungs-Schleife, heute ~Z. 286–296):

```js
for (const def of BLOCKS_DB) {
  const custom = window.COMPONENT_LOGIC[def.id] || {};
  // Definition: Sidecar-init gewinnt, sonst aus YAML bauen
  if (!Blockly.Blocks[def.id]) {
    Blockly.Blocks[def.id] = { init: custom.init ? custom.init.bind(null, def) ... : buildInit(def) };
  }
  // Generator: Sidecar gewinnt, sonst aus YAML (wenn vorhanden)
  if (custom.generator)        Blockly.Python[def.id] = custom.generator;
  else if (def.generator)      Blockly.Python[def.id] = buildGenerator(def);
}
```

Damit entfällt das Flag `legacyGenerator` (Bedeutung „Logik liegt im Sidecar" ergibt
sich aus Existenz der `.js`). Bestehende `legacyGenerator: true` bleiben übergangsweise
gültig, bis das jeweilige Bauteil migriert ist.

## Sidecar-API (Konvention)

Eine `<bauteil>.js` registriert genau für ihre `id`:

```js
// components/actuators/motor_forward.js
MSOS.register('actuator_motor_forward', {
  generator(block) {
    const m = block.getFieldValue('MOTOR');
    const speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_NONE) || '75';
    _motorDefs(m);                       // gemeinsamer Engine-Helfer
    return `_motor_${m}.throttle = ${speed} / 100\n`;
  },
  // optional: init(def){...}  für Sonder-Layouts
  // optional: fields: { PIXELS: FieldMatrix8x8 }  für Custom-Fields
});
```

Custom-Field-Klassen (Matrix) werden in der Sidecar-`.js` definiert und über
`fields` registriert bzw. direkt in `init` verwendet.

## Auslieferung ohne neuen App-Build

`scripts/build_blocks.js` erweitern: zusätzlich zum bestehenden `blocks_db.js`
einen **gebündelten Sidecar-Output** erzeugen.

- Beim Scan der `components/**/*.md` zusätzlich prüfen, ob eine gleichnamige `.js`
  existiert.
- Alle gefundenen Sidecar-`.js` in `js/components_bundle.js` konkatenieren
  (mit `// === <pfad> ===`-Trennkommentaren; Datei als „GENERIERT, nicht editieren"
  markieren — analog `blocks_db.js`).
- `index.html` lädt das Bundle in dieser Reihenfolge:
  ```html
  <script src="js/component_engine.js"></script>   <!-- Registry + Engine-Helfer -->
  <script src="js/components_bundle.js"></script>  <!-- GENERIERT: alle Sidecars -->
  <script src="js/blocks_db.js"></script>
  <script src="js/block_builder.js"></script>      <!-- konsultiert Registry -->
  <script src="js/toolbox.js"></script>
  ```

## Migrationsreihenfolge (inkrementell, jeder Schritt für sich lauffähig)

### Schritt 1 — Engine + Loader (Fundament)
- `js/component_engine.js` anlegen (Registry + aus `generator.js` extrahierte Helfer
  `_defs`, `_digitalInDef`, `_digitalOutDef`, `_motorDefs`, `_whenTask`, `_indent`,
  `finish`, asyncio-Sammlung).
- `scripts/build_blocks.js`: Sidecar-Scan + `components_bundle.js`-Erzeugung.
- `js/block_builder.js`: Registry-Auswertung (siehe oben).
- `index.html`: neue `<script>`-Zeilen.
- **Test:** `node scripts/build_blocks.js`, App in Chrome öffnen — alles läuft wie zuvor
  (noch keine Bauteile migriert, Bundle leer/klein).

### Schritt 2 — Legacy-Generatoren je Bauteil auslagern
Aus `js/generator.js` einzeln in die jeweilige Sidecar-`.js` ziehen und `legacyGenerator`
in der `.md` entfernen:
- Motor: `actuator_motor_forward/_back/_stop` → `components/actuators/motor_*.js`
- Servo, Buzzer (`actuator_buzzer_*`), LCD (Grove RGB), ISD1820
- `digital_read`, `analog_read`, `sensor_encoder`
- Ultraschall `event_ultrasonic`
- **Test:** generierten Code je Bauteil gegen einen Referenz-Workspace vergleichen
  (identischer CircuitPython-Output vor/nach Migration).

### Schritt 3 — Matrix + Custom-Fields
- `js/blocks/matrix.js` → `components/lights/matrix_*.{md,js}`; Field-Klassen
  `FieldMatrix8x8`, `FieldSymbolPicker` in die Sidecar-`.js`.
- `MATRIX_TOOLBOX_CONTENTS`-Sonderfall in `js/toolbox.js` entfällt (Toolbox-Eintrag
  kommt aus den `.md`).
- **Test:** Matrix-Block setzen, Pixel-Editor öffnen, Code generieren.

### Schritt 4 — Kern-Blöcke + Ereignis-Hüte als Bauteil-Paare
- `js/blocks/control.js` → `components/core/{setup,forever,wait,print}.{md,js}`
  (Meta-Flag z.B. `core: true` / `notDeletable` ergänzen, damit Toolbox-/Pflicht-Logik
  greift).
- `js/blocks/events.js` + zugehörige Generatoren in `generator.js` →
  `components/events/when_*.{md,js}` (async-Hut-Generator via `_whenTask`).
- `_HAT_TYPES` und Toolbox-Kategorie „Ereignisse" entsprechend datengetrieben ableiten.
- **Test:** Hüte feuern, paralleler Code generiert korrekt.

### Schritt 5 — Statische Toolbox deklarieren
- Feste Kategorien (Steuerung/Logik/Mathe/Variablen/Text) + Blockly-Standardblöcke
  (`controls_if`, `logic_compare`, `math_number` …) in `components/catalog.json` bzw.
  ein Toolbox-Manifest auslagern.
- `js/toolbox.js` schrumpft auf reine Aufbau-Logik (liest Manifest + `BLOCKS_DB`).
- **Test:** Toolbox-Reihenfolge/Inhalte unverändert sichtbar.

## Zu ändernde / neue Dateien (Übersicht)
- **neu:** `js/component_engine.js`, `js/components_bundle.js` (generiert), je Bauteil `.js`
- **ändern:** `scripts/build_blocks.js`, `js/block_builder.js`, `index.html`,
  `js/toolbox.js`, `components/catalog.json`
- **schrumpfen/auflösen:** `js/generator.js` (nur noch Engine), `js/blocks/events.js`,
  `js/blocks/matrix.js`, `js/blocks/control.js`
- **`.md` anpassen:** `legacyGenerator`-Flags entfernen, sobald Bauteil migriert

## Risiken / offene Punkte
- **Lade-/Init-Reihenfolge der Custom-Fields:** müssen vor `block_builder`-`init`
  existieren → Bundle vor `block_builder.js` laden (im Plan berücksichtigt).
- **Generator-Determinismus:** `_defs`-Keys müssen identisch bleiben, sonst ändert sich
  der generierte Code → Referenz-Diff je Bauteil in Schritt 2–4.
- **`blocks_db.js` vs. Bundle** beide generiert: in einem `build_blocks.js`-Lauf
  erzeugen, damit sie nie auseinanderlaufen.

## Verifikation (End-to-End)
1. `node scripts/build_blocks.js` (erzeugt `blocks_db.js` **und** `components_bundle.js`).
2. `index.html` in Chrome/Edge öffnen, DevTools-Konsole auf stille JS-Fehler prüfen.
3. Referenz-Workspace laden, Code generieren, gegen Pre-Migration-Output diffen
   (pro migriertem Bauteil) — Output muss identisch sein.
4. Web-Serial-Upload auf MAKER-PI-RP2040 für mind. ein migriertes Bauteil je Klasse
   (Sensor-Wert, Aktor, Ereignis-Hut, Matrix).
