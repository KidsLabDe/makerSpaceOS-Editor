// js/docs_data.js – gemeinsame Doku-Daten + Rendering für js/docs.js (In-App-
// Rechtsklick-Hilfe) UND viewer.html (externe Bauteil-/Block-Referenz).
//
// Bewusst OHNE i18n.js-Abhängigkeit (globales L()/LF()/IS_EN): viewer.html
// lädt i18n.js nicht (bleibt rein deutsch, siehe CLAUDE.md). Alle Funktionen
// hier nehmen daher ein explizites `isEn`-Flag statt sich auf globalen State
// zu verlassen. js/docs.js ruft sie mit dem globalen IS_EN auf, viewer.html
// immer mit `false`.
//
// Kein externes Markdown-Laden – alles liegt in geladenen JS-Dateien, damit
// auch file:// funktioniert.

const CONTROL_COLOUR = '#7C3AED';
const EVENT_COLOUR   = '#D97706';
const LOGIC_COLOUR   = '#4FBFE8';
const MATH_COLOUR    = '#16A34A';
const VAR_COLOUR     = '#CA8A04';
const TEXT_COLOUR    = '#0891B2';
const FAQ_COLOUR     = '#64748B';
const LIST_COLOUR    = '#9333EA';
const MATRIX_COLOUR  = '#EC4899';

const CORE_SECTIONS = [
  { name: 'Steuerung',  label_en: 'Control',   colour: CONTROL_COLOUR },
  { name: 'Ereignisse', label_en: 'Events',    colour: EVENT_COLOUR },
  { name: 'Logik',      label_en: 'Logic',     colour: LOGIC_COLOUR },
  { name: 'Mathe',      label_en: 'Math',      colour: MATH_COLOUR },
  { name: 'Variablen',  label_en: 'Variables', colour: VAR_COLOUR },
  { name: 'Listen',     label_en: 'Lists',     colour: LIST_COLOUR },
  { name: 'Text',       label_en: 'Text',      colour: TEXT_COLOUR },
  { name: 'FAQ',        label_en: 'FAQ',       colour: FAQ_COLOUR },
];

const CORE_DOCS = [
  {
    id: 'control_setup', label: 'SETUP', label_en: 'SETUP', colour: CONTROL_COLOUR, section: 'Steuerung',
    tooltip: 'Code hier läuft einmal beim Einschalten / Neustart',
    tooltip_en: 'Code here runs once after power-on / restart',
    doc: `Alles in diesem Block wird **genau einmal** ausgeführt – direkt nach dem
Einschalten oder Neustart des Boards. Perfekt für Dinge, die nur am Anfang
passieren sollen: eine Begrüßung anzeigen, Lichter ausschalten, einen Startwert setzen.

Danach starten automatisch alle anderen Stapel (FÜR IMMER, Schleifen, Ereignisse) –
und zwar **gleichzeitig**.`,
    doc_en: `Everything in this block runs **exactly once** – right after the board is
powered on or restarted. Perfect for things that should only happen at the
beginning: show a greeting, turn off lights, set a starting value.

After that, all other stacks (FOREVER, loops, events) start automatically –
and they all run **at the same time**.`,
  },
  {
    id: 'control_forever', label: 'FÜR IMMER', label_en: 'FOREVER', colour: CONTROL_COLOUR, section: 'Steuerung',
    tooltip: 'Code hier wird immer wieder wiederholt',
    tooltip_en: 'Code here repeats over and over',
    doc: `Die Blöcke hier drin werden **endlos wiederholt** – wie eine Schleife ohne Ende.
Das ist das Herz der meisten Programme: messen, prüfen, reagieren, und wieder von vorn.

Tipp: Baue ein **Warte**-Häppchen ein, wenn etwas nicht tausendmal pro Sekunde
passieren soll (z.B. eine Anzeige aktualisieren).`,
    doc_en: `The blocks inside are **repeated forever** – like a loop without an end.
This is the heart of most programs: measure, check, react, and start over.

Tip: add a small **wait** block if something shouldn't happen a thousand times
per second (e.g. updating a display).`,
  },
  {
    id: 'loop_parallel', label: 'Schleife (läuft parallel)', label_en: 'Loop (runs in parallel)', colour: EVENT_COLOUR, section: 'Ereignisse',
    tooltip: 'Wiederholt sich endlos – läuft gleichzeitig zu anderen Stapeln',
    tooltip_en: 'Repeats forever – runs at the same time as other stacks',
    doc: `Wie FÜR IMMER – aber als **zusätzlicher** Stapel. Damit kann dein Programm
mehrere Dinge **gleichzeitig** tun: In einer Schleife blinkt eine LED, in einer
anderen wird die Temperatur gemessen. Beide laufen nebeneinander, ohne sich zu stören.`,
    doc_en: `Like FOREVER – but as an **additional** stack. This lets your program do
several things **at the same time**: one loop blinks an LED while another
measures the temperature. Both run side by side without disturbing each other.`,
  },
  {
    id: 'control_wait', label: 'Warte … Sekunden', label_en: 'Wait … seconds', colour: CONTROL_COLOUR, section: 'Steuerung',
    tooltip: 'Wartet die angegebene Anzahl Sekunden',
    tooltip_en: 'Waits for the given number of seconds',
    doc: `Hält den eigenen Stapel für die angegebene Zeit an. Auch halbe Sekunden gehen: \`0.5\`.

Das Warten blockiert nur **diesen** Stapel – alle anderen Schleifen und
Ereignisse laufen währenddessen normal weiter.`,
    doc_en: `Pauses its own stack for the given time. Half seconds work too: \`0.5\`.

Waiting only blocks **this** stack – all other loops and events keep
running normally in the meantime.`,
  },
  {
    id: 'control_print', label: 'Ausgabe', label_en: 'Print', colour: CONTROL_COLOUR, section: 'Steuerung',
    tooltip: 'Gibt einen Wert im Seriellen Monitor aus',
    tooltip_en: 'Prints a value to the serial monitor',
    doc: `Schreibt einen Wert oder Text in den **Seriellen Monitor** (rechts im Editor,
Board muss verbunden sein). Super zum Nachschauen, was dein Programm gerade denkt –
z.B. den aktuellen Sensorwert ausgeben.`,
    doc_en: `Writes a value or text to the **serial monitor** (on the right of the editor,
board must be connected). Great for checking what your program is thinking –
e.g. printing the current sensor value.`,
  },
  {
    id: 'control_wait_until', label: 'warte bis', label_en: 'wait until', colour: LOGIC_COLOUR, section: 'Logik',
    tooltip: 'Hält an dieser Stelle an, bis die Bedingung erfüllt ist',
    tooltip_en: 'Pauses here until the condition is true',
    doc: `Hält den Stapel an, **bis** die Bedingung wahr wird – z.B. "warte bis Taster
gedrückt". Andere Stapel laufen währenddessen weiter.`,
    doc_en: `Pauses the stack **until** the condition becomes true – e.g. "wait until
button pressed". Other stacks keep running in the meantime.`,
  },
  {
    id: 'control_while', label: 'solange … mache', label_en: 'while … do', colour: LOGIC_COLOUR, section: 'Logik',
    tooltip: 'Wiederholt die Blöcke, solange die Bedingung erfüllt ist',
    tooltip_en: 'Repeats the blocks while the condition is true',
    doc: `Wiederholt die Blöcke im Inneren, **solange** die Bedingung wahr ist.
Wird die Bedingung falsch, geht es dahinter weiter.`,
    doc_en: `Repeats the blocks inside **while** the condition is true.
Once the condition becomes false, the program continues below.`,
  },
  {
    id: 'when_button', label: 'Wenn Taster …', label_en: 'When button …', colour: EVENT_COLOUR, section: 'Ereignisse',
    tooltip: 'Startet, sobald der Taster gedrückt bzw. losgelassen wird',
    tooltip_en: 'Starts as soon as the button is pressed or released',
    doc: `Ein **Ereignis-Hut**: Die Blöcke darunter starten in dem Moment, in dem der
Taster gedrückt (oder losgelassen) wird – einmal pro Tastendruck, nicht dauernd.

Zur Auswahl stehen die Onboard-Taster des Boards (falls vorhanden) und externe
Taster an einem Grove-Port.`,
    doc_en: `An **event hat**: the blocks below start the moment the button is pressed
(or released) – once per press, not continuously.

You can choose the board's onboard buttons (if any) and external buttons
connected to a Grove port.`,
  },
  {
    id: 'when_encoder', label: 'Wenn Drehgeber …', label_en: 'When rotary encoder …', colour: EVENT_COLOUR, section: 'Ereignisse',
    tooltip: 'Startet, sobald der Drehgeber in die gewählte Richtung gedreht wird',
    tooltip_en: 'Starts as soon as the encoder is turned in the chosen direction',
    doc: `Startet bei jedem "Klick" des Drehgebers in die gewählte Richtung
(hoch = im Uhrzeigersinn). So kannst du z.B. mit dem Drehknopf eine Zahl
hoch- und runterzählen.`,
    doc_en: `Starts at every "click" of the encoder in the chosen direction
(up = clockwise). This lets you count a number up and down with the knob,
for example.`,
  },
  {
    id: 'when_sound', label: 'Wenn Geräusch erkannt', label_en: 'When sound detected', colour: EVENT_COLOUR, section: 'Ereignisse',
    tooltip: 'Startet, sobald ein Geräusch erkannt wird',
    tooltip_en: 'Starts as soon as a sound is detected',
    doc: `Startet, sobald der Geräuschsensor am gewählten Port ein Geräusch meldet –
z.B. Klatschen. Feuert einmal pro Erkennung.`,
    doc_en: `Starts as soon as the sound sensor on the chosen port detects a sound –
e.g. clapping. Fires once per detection.`,
  },
  {
    id: 'when_touch', label: 'Wenn berührt', label_en: 'When touched', colour: EVENT_COLOUR, section: 'Ereignisse',
    tooltip: 'Startet, sobald der Sensor berührt wird',
    tooltip_en: 'Starts as soon as the sensor is touched',
    doc: `Startet, sobald der Berührungssensor am gewählten Port angefasst wird.
Funktioniert wie ein Taster – nur ohne Drücken.`,
    doc_en: `Starts as soon as the touch sensor on the chosen port is touched.
Works like a button – just without pressing.`,
  },
  {
    id: 'when_motion', label: 'Wenn bewegt …', label_en: 'When moved …', colour: EVENT_COLOUR, section: 'Ereignisse',
    tooltip: 'Startet, sobald der Bewegungssensor (ICM20948) geschüttelt oder stark beschleunigt wird',
    tooltip_en: 'Starts as soon as the motion sensor (ICM20948) is shaken or strongly accelerated',
    doc: `Startet, wenn der Bewegungssensor (ICM20948, am I2C-Port) bewegt wird:

- **geschüttelt** – reagiert schon auf kräftiges Schütteln (mehr als 2 g)
- **3g / 6g / 9g** – reagiert erst bei stärkeren Stößen (z.B. Aufprall)

> Braucht \`adafruit_icm20x.mpy\` und \`adafruit_register/\` auf \`CIRCUITPY/lib/\`.`,
    doc_en: `Starts when the motion sensor (ICM20948, on the I2C port) is moved:

- **shaken** – already reacts to vigorous shaking (more than 2 g)
- **3g / 6g / 9g** – only reacts to stronger impacts (e.g. a crash)

> Needs \`adafruit_icm20x.mpy\` and \`adafruit_register/\` on \`CIRCUITPY/lib/\`.`,
  },
  {
    id: 'when_distance', label: 'Wenn Abstand …', label_en: 'When distance …', colour: EVENT_COLOUR, section: 'Ereignisse',
    tooltip: 'Startet, sobald der gemessene Abstand die Bedingung erfüllt',
    tooltip_en: 'Starts as soon as the measured distance meets the condition',
    doc: `Misst laufend den Abstand mit dem Ultraschallsensor und startet, **sobald**
die Bedingung erfüllt wird – z.B. "Abstand < 20 cm" wenn sich jemand nähert.
Feuert einmal beim Wahr-Werden, nicht dauernd.`,
    doc_en: `Continuously measures the distance with the ultrasonic sensor and starts
**as soon as** the condition is met – e.g. "distance < 20 cm" when someone
approaches. Fires once when it becomes true, not continuously.`,
  },
  {
    id: 'when_light', label: 'Wenn Helligkeit …', label_en: 'When brightness …', colour: EVENT_COLOUR, section: 'Ereignisse',
    tooltip: 'Startet, sobald die Helligkeit (0–100 %) die Bedingung erfüllt',
    tooltip_en: 'Starts as soon as the brightness (0–100 %) meets the condition',
    doc: `Überwacht den Lichtsensor (0 % = dunkel, 100 % = hell) und startet, sobald
die Bedingung erfüllt wird – z.B. Licht einschalten, wenn es dunkel wird.`,
    doc_en: `Monitors the light sensor (0 % = dark, 100 % = bright) and starts as soon
as the condition is met – e.g. turn on a light when it gets dark.`,
  },
  {
    id: 'when_temperature', label: 'Wenn Temperatur …', label_en: 'When temperature …', colour: EVENT_COLOUR, section: 'Ereignisse',
    tooltip: 'Startet, sobald die Temperatur (DHT11) die Bedingung erfüllt',
    tooltip_en: 'Starts as soon as the temperature (DHT11) meets the condition',
    doc: `Überwacht die Temperatur (DHT11-Sensor) und startet, sobald die Bedingung
erfüllt wird – z.B. einen Lüfter-Motor starten, wenn es wärmer als 28 °C wird.`,
    doc_en: `Monitors the temperature (DHT11 sensor) and starts as soon as the condition
is met – e.g. start a fan motor when it gets warmer than 28 °C.`,
  },
  {
    id: 'when_humidity', label: 'Wenn Luftfeuchtigkeit …', label_en: 'When humidity …', colour: EVENT_COLOUR, section: 'Ereignisse',
    tooltip: 'Startet, sobald die Luftfeuchtigkeit (DHT11) die Bedingung erfüllt',
    tooltip_en: 'Starts as soon as the humidity (DHT11) meets the condition',
    doc: `Überwacht die Luftfeuchtigkeit (DHT11-Sensor, 0–100 %) und startet, sobald
die Bedingung erfüllt wird – z.B. eine Warn-LED bei zu trockener Luft.`,
    doc_en: `Monitors the humidity (DHT11 sensor, 0–100 %) and starts as soon as the
condition is met – e.g. a warning LED when the air is too dry.`,
  },

  // ── Steuerung (Blockly-Standard) ──
  {
    id: 'controls_repeat_ext', label: 'wiederhole … mal', label_en: 'repeat … times', colour: CONTROL_COLOUR, section: 'Steuerung',
    doc: `Wiederholt die Blöcke im Inneren **so oft, wie du angibst** – z.B. 10-mal
blinken. Danach geht das Programm dahinter weiter.`,
    doc_en: `Repeats the blocks inside **as many times as you say** – e.g. blink
10 times. Afterwards the program continues below.`,
  },
  {
    id: 'controls_whileUntil', label: 'wiederhole solange / bis', label_en: 'repeat while / until', colour: CONTROL_COLOUR, section: 'Steuerung',
    doc: `Wiederholt die Blöcke im Inneren, **solange** eine Bedingung wahr ist –
oder **bis** sie wahr wird (im Dropdown umschaltbar).`,
    doc_en: `Repeats the blocks inside **while** a condition is true – or **until**
it becomes true (switchable in the dropdown).`,
  },

  // ── Logik (Blockly-Standard) ──
  {
    id: 'controls_if', label: 'falls … mache', label_en: 'if … do', colour: LOGIC_COLOUR, section: 'Logik',
    doc: `Führt die Blöcke im Inneren nur aus, **wenn** die Bedingung wahr ist –
z.B. "falls Taster gedrückt → LED an".

Mit dem **Zahnrad** am Block kannst du ein **sonst** ergänzen: Das läuft immer
dann, wenn die Bedingung **nicht** erfüllt ist.`,
    doc_en: `Only runs the blocks inside **if** the condition is true –
e.g. "if button pressed → LED on".

Using the **gear** on the block you can add an **else**: that part runs
whenever the condition is **not** met.`,
  },
  {
    id: 'logic_compare', label: 'Vergleich (= < >)', label_en: 'Compare (= < >)', colour: LOGIC_COLOUR, section: 'Logik',
    doc: `Vergleicht zwei Werte und liefert **wahr** oder **falsch** – z.B.
"Temperatur > 25". Passt in jeden Bedingungs-Slot (falls, warte bis, solange …).`,
    doc_en: `Compares two values and returns **true** or **false** – e.g.
"temperature > 25". Fits into any condition slot (if, wait until, while …).`,
  },
  {
    id: 'logic_operation', label: 'und / oder', label_en: 'and / or', colour: LOGIC_COLOUR, section: 'Logik',
    doc: `Verbindet zwei Bedingungen: **und** ist nur wahr, wenn beide stimmen –
**oder** schon, wenn eine stimmt. Z.B. "dunkel **und** Bewegung erkannt".`,
    doc_en: `Combines two conditions: **and** is only true if both are true –
**or** already if one is true. E.g. "dark **and** motion detected".`,
  },
  {
    id: 'logic_negate', label: 'nicht', label_en: 'not', colour: LOGIC_COLOUR, section: 'Logik',
    doc: `Dreht eine Bedingung um: aus wahr wird falsch und umgekehrt –
z.B. "**nicht** Taster gedrückt".`,
    doc_en: `Flips a condition: true becomes false and vice versa –
e.g. "**not** button pressed".`,
  },
  {
    id: 'logic_boolean', label: 'wahr / falsch', label_en: 'true / false', colour: LOGIC_COLOUR, section: 'Logik',
    doc: `Der feste Wert **wahr** oder **falsch** – zum Testen oder als Startwert
für eine Variable.`,
    doc_en: `The fixed value **true** or **false** – for testing or as a starting
value for a variable.`,
  },

  // ── Mathe (Blockly-Standard) ──
  {
    id: 'math_number', label: 'Zahl', label_en: 'Number', colour: MATH_COLOUR, section: 'Mathe',
    doc: `Eine einfache Zahl. Reinklicken und eintippen – auch Kommazahlen
gehen (mit Punkt: \`0.5\`).`,
    doc_en: `A simple number. Click in and type – decimals work too
(with a dot: \`0.5\`).`,
  },
  {
    id: 'math_arithmetic', label: 'Rechnen (+ − × ÷)', label_en: 'Arithmetic (+ − × ÷)', colour: MATH_COLOUR, section: 'Mathe',
    doc: `Rechnet mit zwei Werten: plus, minus, mal, geteilt oder hoch.
Auch Sensorwerte kannst du hier einsetzen – z.B. "Abstand ÷ 2".`,
    doc_en: `Calculates with two values: plus, minus, times, divided or to the power of.
You can also plug in sensor values – e.g. "distance ÷ 2".`,
  },
  {
    id: 'math_single', label: 'Wurzel, Betrag …', label_en: 'Square root, absolute …', colour: MATH_COLOUR, section: 'Mathe',
    doc: `Rechnet mit **einer** Zahl: Quadratwurzel, Betrag (Vorzeichen weg),
Vorzeichen umdrehen und mehr – im Dropdown wählbar.`,
    doc_en: `Calculates with **one** number: square root, absolute value (drop the sign),
negate and more – selectable in the dropdown.`,
  },
  {
    id: 'math_constrain', label: 'begrenze Zahl', label_en: 'constrain number', colour: MATH_COLOUR, section: 'Mathe',
    doc: `Hält eine Zahl in einem Bereich fest: Ist sie kleiner als das Minimum,
kommt das Minimum heraus – ist sie größer als das Maximum, das Maximum.
Praktisch, damit z.B. ein Tempo nie über 100 % rutscht.`,
    doc_en: `Keeps a number inside a range: if it is smaller than the minimum, you get
the minimum – if it is larger than the maximum, the maximum.
Handy so that e.g. a speed never slips above 100 %.`,
  },
  {
    id: 'math_random_int', label: 'Zufallszahl', label_en: 'Random number', colour: MATH_COLOUR, section: 'Mathe',
    doc: `Würfelt eine **ganze Zufallszahl** zwischen den beiden Grenzen (beide
eingeschlossen) – z.B. 1 bis 6 für einen Würfel.`,
    doc_en: `Rolls a **random whole number** between the two limits (both included) –
e.g. 1 to 6 for a dice.`,
  },

  // ── Variablen ──
  {
    id: 'variables_set', label: 'setze Variable auf …', label_en: 'set variable to …', colour: VAR_COLOUR, section: 'Variablen',
    doc: `Eine **Variable** ist ein Merkzettel mit Namen, auf dem dein Programm
einen Wert speichert – z.B. einen Punktestand. Dieser Block schreibt einen
neuen Wert auf den Merkzettel (der alte wird überschrieben).

Neue Variablen legst du in der Toolbox unter **Variablen** mit dem Knopf an.`,
    doc_en: `A **variable** is a named sticky note on which your program stores a
value – e.g. a score. This block writes a new value onto the note
(the old one is overwritten).

You create new variables in the toolbox under **Variables** using the button.`,
  },
  {
    id: 'variables_get', label: 'Variable (Wert holen)', label_en: 'Variable (get value)', colour: VAR_COLOUR, section: 'Variablen',
    doc: `Liefert den aktuell gespeicherten Wert der Variable – einsetzbar überall,
wo eine Zahl oder ein Text erwartet wird.`,
    doc_en: `Returns the currently stored value of the variable – usable anywhere a
number or text is expected.`,
  },
  {
    id: 'var_increase', label: 'erhöhe … um …', label_en: 'increase … by …', colour: VAR_COLOUR, section: 'Variablen',
    doc: `Zählt die Variable um den angegebenen Wert **hoch** – z.B. bei jedem
Tastendruck "erhöhe Punkte um 1".`,
    doc_en: `Counts the variable **up** by the given value – e.g. "increase score by 1"
on every button press.`,
  },
  {
    id: 'var_decrease', label: 'verringere … um …', label_en: 'decrease … by …', colour: VAR_COLOUR, section: 'Variablen',
    doc: `Zählt die Variable um den angegebenen Wert **runter** – z.B. "verringere
Leben um 1", wenn etwas schiefgeht.`,
    doc_en: `Counts the variable **down** by the given value – e.g. "decrease lives by 1"
when something goes wrong.`,
  },

  // ── Listen ──
  {
    id: 'lists_create_empty', label: 'leere Liste', label_en: 'empty list', colour: LIST_COLOUR, section: 'Listen',
    doc: `Eine **Liste** ist ein Merkzettel mit vielen nummerierten Plätzen – Platz 1,
Platz 2, Platz 3 … Dieser Block erzeugt eine Liste ganz ohne Einträge.
Speichere sie mit "setze … auf" in einer Variable, z.B. im SETUP.`,
    doc_en: `A **list** is a sticky note with many numbered places – place 1,
place 2, place 3 … This block creates a list with no entries at all.
Store it in a variable with "set … to", e.g. in SETUP.`,
  },
  {
    id: 'lists_create_with', label: 'Liste mit Werten', label_en: 'list with values', colour: LIST_COLOUR, section: 'Listen',
    doc: `Erzeugt eine Liste, die schon Werte enthält – z.B. die Töne einer Melodie.
Über das Zahnrad kannst du Plätze hinzufügen oder entfernen.`,
    doc_en: `Creates a list that already contains values – e.g. the notes of a melody.
Use the gear icon to add or remove places.`,
  },
  {
    id: 'list_append', label: 'hänge an Liste an', label_en: 'append to list', colour: LIST_COLOUR, section: 'Listen',
    doc: `Hängt einen Wert **hinten** an die Liste an – z.B. jeden neuen Messwert.
Gibt es die Liste noch nicht, wird sie dabei automatisch angelegt.`,
    doc_en: `Adds a value to the **end** of the list – e.g. every new measurement.
If the list does not exist yet, it is created automatically.`,
  },
  {
    id: 'list_get', label: 'Element Nr. … aus Liste', label_en: 'item no. … of list', colour: LIST_COLOUR, section: 'Listen',
    doc: `Liefert den Wert an einer Stelle der Liste. **Nr. 1 ist der erste Platz.**
Gibt es die Nummer nicht (Liste zu kurz), meldet der Serielle Monitor einen
\`IndexError\`.`,
    doc_en: `Returns the value at one place in the list. **No. 1 is the first place.**
If the number does not exist (list too short), the serial monitor shows an
\`IndexError\`.`,
  },
  {
    id: 'list_set', label: 'setze Element Nr. …', label_en: 'set item no. …', colour: LIST_COLOUR, section: 'Listen',
    doc: `Überschreibt den Wert an einer Stelle der Liste. Die Liste wird dabei
nicht länger – zum Verlängern nimm "hänge an".`,
    doc_en: `Overwrites the value at one place in the list. The list does not get
longer – to make it longer, use "append".`,
  },
  {
    id: 'list_remove', label: 'lösche Element Nr. …', label_en: 'remove item no. …', colour: LIST_COLOUR, section: 'Listen',
    doc: `Entfernt den Eintrag an einer Stelle aus der Liste. Die Liste wird um
einen Platz kürzer, alle Einträge dahinter rutschen nach vorne – aus Nr. 3
wird Nr. 2. "lösche Element Nr. 1" entfernt also immer den ältesten Eintrag.`,
    doc_en: `Removes the entry at one place in the list. The list gets one place
shorter and all entries after it move up – no. 3 becomes no. 2.
"remove item no. 1" therefore always removes the oldest entry.`,
  },
  {
    id: 'lists_length', label: 'Länge der Liste', label_en: 'length of list', colour: LIST_COLOUR, section: 'Listen',
    doc: `Zählt, wie viele Einträge in der Liste stehen.`,
    doc_en: `Counts how many entries the list has.`,
  },
  {
    id: 'lists_isEmpty', label: 'Liste ist leer', label_en: 'list is empty', colour: LIST_COLOUR, section: 'Listen',
    doc: `Ist **wahr**, wenn die Liste keinen einzigen Eintrag hat.`,
    doc_en: `Is **true** if the list has no entries at all.`,
  },
  {
    id: 'controls_forEach', label: 'für jeden Wert aus der Liste', label_en: 'for each item in list', colour: LIST_COLOUR, section: 'Listen',
    doc: `Geht die Liste von vorne nach hinten durch. Bei jedem Durchlauf steht der
aktuelle Eintrag in der Variable (z.B. \`i\`) – so kannst du z.B. alle Werte
mit dem Ausgabe-Block im Seriellen Monitor anzeigen.`,
    doc_en: `Goes through the list from front to back. On each round the current
entry is stored in the variable (e.g. \`i\`) – so you can e.g. show every value
in the serial monitor with the print block.`,
  },

  // ── Text ──
  {
    id: 'text', label: 'Text', label_en: 'Text', colour: TEXT_COLOUR, section: 'Text',
    doc: `Ein Stück Text in Anführungszeichen – z.B. für die Ausgabe im Seriellen
Monitor oder auf dem LCD.`,
    doc_en: `A piece of text in quotes – e.g. for printing to the serial monitor
or showing on the LCD.`,
  },
  {
    id: 'text_verbinden', label: 'verbinde Texte', label_en: 'join texts', colour: TEXT_COLOUR, section: 'Text',
    doc: `Hängt zwei Dinge zu einem Text zusammen – z.B. \`"Temperatur: "\` und den
Messwert. So werden Ausgaben lesbar.`,
    doc_en: `Joins two things into one text – e.g. \`"Temperature: "\` and the measured
value. This makes output readable.`,
  },
  {
    id: 'text_length', label: 'Länge von Text', label_en: 'length of text', colour: TEXT_COLOUR, section: 'Text',
    doc: `Zählt, aus wie vielen Zeichen ein Text besteht (Leerzeichen zählen mit).`,
    doc_en: `Counts how many characters a text has (spaces count too).`,
  },

  // ── 8×8 Matrix (Lichter) ──
  {
    id: 'matrix_on', label: 'Matrix anschalten', label_en: 'Matrix on', colour: MATRIX_COLOUR, section: 'Lichter',
    doc: `Schaltet **alle 64 LEDs** der 8×8-Matrix in einer Farbe an.
Datenkabel der Matrix an einen der Anschlüsse S1–S4.`,
    doc_en: `Turns on **all 64 LEDs** of the 8×8 matrix in one colour.
Connect the matrix data cable to one of the connectors S1–S4.`,
  },
  {
    id: 'matrix_off', label: 'Matrix ausschalten', label_en: 'Matrix off', colour: MATRIX_COLOUR, section: 'Lichter',
    doc: `Macht die ganze Matrix dunkel (alle LEDs aus).`,
    doc_en: `Makes the whole matrix dark (all LEDs off).`,
  },
  {
    id: 'matrix_brightness', label: 'Matrix-Helligkeit', label_en: 'Matrix brightness', colour: MATRIX_COLOUR, section: 'Lichter',
    doc: `Stellt ein, wie hell die Matrix leuchtet (0–100 %). Tipp: 10–30 % reichen
meist völlig – volle Helligkeit blendet und braucht viel Strom.`,
    doc_en: `Sets how brightly the matrix glows (0–100 %). Tip: 10–30 % is usually
plenty – full brightness is blinding and uses a lot of power.`,
  },
  {
    id: 'matrix_symbol', label: 'zeige Symbol', label_en: 'show symbol', colour: MATRIX_COLOUR, section: 'Lichter',
    doc: `Zeigt ein fertiges Symbol (Herz, Smiley, Pfeil …) auf der Matrix –
Symbol und Farbe im Dropdown wählen.`,
    doc_en: `Shows a ready-made symbol (heart, smiley, arrow …) on the matrix –
choose symbol and colour in the dropdown.`,
  },
  {
    id: 'matrix_set_pixel', label: 'Pixel setzen', label_en: 'set pixel', colour: MATRIX_COLOUR, section: 'Lichter',
    doc: `Schaltet **eine einzelne LED** an: Spalte (x) und Zeile (y) von 0 bis 7
angeben, dazu die Farbe. So kannst du Punkt für Punkt zeichnen oder animieren.`,
    doc_en: `Turns on **a single LED**: give column (x) and row (y) from 0 to 7,
plus the colour. This lets you draw or animate dot by dot.`,
  },
  {
    id: 'matrix_draw', label: 'zeige LEDs (malen)', label_en: 'show LEDs (paint)', colour: MATRIX_COLOUR, section: 'Lichter',
    doc: `Male dein eigenes Bild: Im 8×8-Raster auf dem Block die Punkte anklicken,
die leuchten sollen, und eine Farbe wählen.`,
    doc_en: `Paint your own picture: click the dots in the 8×8 grid on the block
that should light up, and choose a colour.`,
  },
  {
    id: 'faq_robo_esp32', label: 'Robo ESP32: Anschlüsse und Bauteile', colour: FAQ_COLOUR, section: 'FAQ',
    label_en: 'Robo ESP32: ports and parts',
    tooltip: 'Welcher Pin ist wo, und was steckt man wohin?',
    tooltip_en: 'Which pin is where, and what plugs in where?',
    doc: `Diese Seite erklärt dir, was auf dem Robo ESP32 ist, welche Anschlüsse es gibt und wie du Bauteile richtig ansteckst. Mit dieser Anleitung vermeidest du den häufigsten Fehler: **zwei Bauteile am selben Pin**.

> **Wichtig:** Auf dem Board stehen keine Nummern wie „Grove 1“. Suche einen Anschluss anhand der **GPIO-Zahlen** neben dem Stecker (zum Beispiel \`17\` und \`16\`).

## 1. Das ist auf dem Board

- 7 Grove-Anschlüsse (kleine weiße Stecker mit 4 Kabeln)
- 1 Maker-Anschluss (kleiner Stecker, teilt sich die Pins mit dem I2C-Grove-Anschluss)
- 4 Servo-Anschlüsse
- 2 Motor-Anschlüsse für kleine Gleichstrommotoren
- 2 Tasten, 1 Piezo-Summer (Buzzer) mit Stumm-Schalter
- 2 RGB-LEDs, 10 Status-LEDs für Pins
- Ein Reset-Knopf und ein Ein/Aus-Schalter
- Ein Steckplatz für ein NodeMCU ESP32 (30 Pins) mit Pin-Leiste

Die Pins für Tasten, Summer, RGB-LEDs und Motoren stehen im [Datenblatt des Boards](https://docs.google.com/document/d/1sX5PVDH0t97U6eEQNhdARgjXWjdCvVvBfn_B1Vv0p9o/edit?usp=sharing). Diese Pins sind schon belegt. Benutze sie nicht für eigene Bauteile, wenn du die Tasten, den Summer oder die Motoren auch brauchst.

## 2. Strom

Das Board bekommt Strom auf drei Wegen. Es reicht einer davon:

- über **USB** (5 V)
- über einen **LiPo-Akku** (1 Zelle)
- über die **VIN-Klemmen** (3,6 bis 6 V)

Der Ein/Aus-Schalter schaltet alles. Die Motoren nutzen dieselbe Stromquelle wie das Board.

## 3. Anschluss-Übersicht

Diese Anschlüsse haben wir am Board geprüft. „Ausgang“ bedeutet, dass der Pin auch Signale senden kann.

| Anschluss (GPIO-Pins) | Für was | Hinweis |
|---|---|---|
| **22 (SDA) und 21 (SCL)** | I2C-Geräte (OLED, viele Sensoren) | Auch am Maker-Anschluss. Bei uns ist **SDA = 22 und SCL = 21**. |
| **17 und 16** | zwei Signalleitungen | Beide Pins sind Ausgang. |
| **26 und 25** | zwei Signalleitungen | Beide Pins sind Ausgang. Kein Analog-Lesen mit WLAN (ADC2). |
| **33 und 32** | zwei Signalleitungen | Beide Pins sind Ausgang. Analog-Lesen mit WLAN geht. |
| **36 und 39** | **nur Sensoren lesen** | Nur Eingang. Kein Display, kein LED-Streifen. |
| **Servo: 4, 5, 18, 19** | Servos oder eine Signalleitung | Ausgang. Am Servo-Anschluss gibt es auch 5 V und GND. Pin 5 lieber nicht benutzen (siehe Abschnitt 4). |

> **Achtung, diese Anschlüsse teilen sich Pins:**
>
> - **22 + 39** teilt sich Pin 22 mit dem I2C-Anschluss.
> - **25 + 33** teilt sich Pin 25 mit dem Anschluss 26 + 25 und Pin 33 mit dem Anschluss 33 + 32.
>
> Wenn du dort ein Bauteil ansteckst und der andere Anschluss auch benutzt wird, gibt es Fehler.

## 4. Regeln für Pins

1. **Jeder Pin nur für ein Bauteil.** Wenn zwei Anschlüsse denselben Pin haben, kannst du nur einen davon benutzen. Ausnahme: I2C-Geräte dürfen sich einen I2C-Anschluss teilen, wenn sie verschiedene Adressen haben.
2. **Pins 34 bis 39 können nur lesen.** Sie können nichts senden. Für Displays, LED-Streifen, Servos und den DHT-Sensor gehen sie nicht.
3. **Pins 6 bis 11 nie benutzen.** Sie hängen am Speicher des ESP32.
4. **Vorsicht bei den Pins 0, 2, 5, 12 und 15.** Sie beeinflussen den Start des Boards. Wenn du sie benutzt, kann das Hochladen oder der Start fehlschlagen.
5. **WLAN und analoges Lesen:** Pins auf ADC2 (zum Beispiel 25 und 26) können kein Analog-Lesen, wenn WLAN an ist. Nimm dafür 32, 33, 36 oder 39.

## 5. Welches Bauteil kommt wohin?

### I2C-Geräte (OLED-Display, viele Sensoren)

- Stecke sie an den **I2C-Anschluss** (22 und 21).
- Im Code: \`Wire.begin(22, 21);\` (erst SDA, dann SCL).
- Mehrere I2C-Geräte gehen zusammen an denselben Anschluss, wenn sie verschiedene Adressen haben. Die meisten OLEDs haben \`0x3C\`.
- Wenn das Gerät nicht gefunden wird, tausche SDA und SCL im Code.

### 4-Ziffern-Display (TM1637)

- Braucht **zwei Ausgangs-Pins** (CLK und DIO). Nimm zum Beispiel 17 und 16.
- Jedes Display braucht sein **eigenes Pin-Paar**.
- Wenn ein Display dunkel bleibt: tausche CLK und DIO im Code.
- Schreibe die Zahl im Programm regelmäßig neu (zum Beispiel jede Sekunde). Dann bleibt das Display nach einem Stromfehler nicht dunkel.

### Temperatur- und Feuchtigkeitssensor (DHT11 / DHT22)

- Hat **eine Datenleitung**. Der Pin muss ein **Ausgang** sein, also nicht 34 bis 39. Nimm einen Servo-Pin wie 4.
- Strom nur mit **3,3 V**, nicht mit 5 V. Sonst bekommt der ESP32 zu viel Spannung.
- Lies ihn höchstens alle 2 Sekunden.

### LED-Streifen (WS2812 / NeoPixel)

- Hat **eine Datenleitung**. Nimm einen Ausgangs-Pin, zum Beispiel 18.
- Setze einen Widerstand mit **330 Ω** in die Datenleitung.
- Strom mit **5 V**. Für mehr als etwa 8 LEDs brauchst du ein eigenes 5-V-Netzteil. Verbinde dann dessen **GND** mit dem **GND** vom Board.
- Stelle die Helligkeit am Anfang niedrig ein (zum Beispiel 30 von 255).

### Servos und Motoren

- Servos gehören an die **4 Servo-Anschlüsse**. Motoren an die **2 Motor-Anschlüsse**.
- Motoren und Servos brauchen viel Strom. Nutze ein Netzteil oder einen Akku, nicht nur USB.

### Analoge Sensoren (zum Beispiel Licht, Boden-Feuchtigkeit)

- Nimm einen Pin, der Analog lesen kann: **36, 39, 32 oder 33**. Diese gehen auch mit WLAN.

## 6. Fehler finden

| Problem | Das kannst du tun |
|---|---|
| Ein Gerät reagiert gar nicht | Ist der Stecker ganz drin? Ist das Board an? Prüfe die Pin-Zahlen im Code. |
| OLED oder I2C-Sensor wird nicht gefunden | Tausche SDA und SCL. Prüfe, ob das Gerät am I2C-Anschluss steckt. |
| Display bleibt dunkel | Tausche CLK und DIO. Schreibe die Zahl regelmäßig neu. |
| Sensor zeigt „TIMEOUT“ | Hängt er an einem Ausgangs-Pin (nicht 34 bis 39)? Prüfe die 3,3 V. |
| LEDs leuchten falsch oder gar nicht | Prüfe GND, 5 V, den Datenpin und den 330-Ω-Widerstand. Trage die richtige LED-Anzahl im Code ein. |
| Hochladen klappt nicht | Ziehe alle Stecker von den Pins 0, 2, 5, 12 und 15 ab und versuche es noch einmal. |
| Das Board spinnt | Ziehe alle Stecker ab und stecke sie einzeln wieder an, bis du das Bauteil findest. |

## 7. Prompt für Chat-KIs

Du willst, dass dir eine KI (zum Beispiel ChatGPT oder Claude) beim Programmieren hilft? Kopiere den Text unten und füge ihn **vor deine Frage** ein. Schreibe am Ende bei \`[HIER KOMMT DEINE AUFGABE]\`, was du bauen willst und welche Bauteile du benutzt.

\`\`\`text
Du hilfst Schülerinnen und Schülern der Klassen 7 bis 9 beim Programmieren mit dem Cytron Robo ESP32.

Sprache: Antworte auf einfachem Deutsch mit kurzen Sätzen. Erkläre Fachwörter kurz. Erkläre den Code in wenigen Schritten.

Board: Cytron Robo ESP32 (ESP32 mit Arduino-Framework, PlatformIO oder Arduino IDE).

Anschlüsse, die ich benutzen darf (GPIO-Pins):
- I2C: SDA = 22, SCL = 21. Übergib sie im Code immer selbst, zum Beispiel Wire.begin(22, 21).
- Zwei Signalleitungen (beide Ausgang): 17 und 16
- Zwei Signalleitungen (beide Ausgang): 26 und 25 (ADC2, kein Analog-Lesen mit WLAN)
- Zwei Signalleitungen (beide Ausgang): 33 und 32
- Nur Eingang (nur Sensoren lesen): 36 und 39
- Servo-Anschlüsse (Ausgang): 4, 5, 18, 19 (Pin 5 lieber nicht benutzen)

Regeln:
1. Benutze nur die oben genannten Pins. Erfinde keine anderen Pins.
2. GPIO 34 bis 39 können nur lesen. Benutze sie nie als Ausgang (kein Display, kein LED-Streifen, kein Servo, kein DHT-Sensor).
3. Benutze nicht die Pins 6 bis 11. Vermeide 0, 2, 5, 12 und 15.
4. Jeder Pin darf nur von einem Bauteil benutzt werden. Wenn meine Aufgabe zwei Bauteile am selben Pin brauchen würde, sag mir das und schlage eine Lösung vor.
5. Die Anschlüsse 22 + 39 und 25 + 33 teilen sich Pins mit anderen Anschlüssen. Benutze sie nicht.
6. Schreibe die Pins am Anfang des Programms als Konstanten, zum Beispiel: constexpr uint8_t LED_PIN = 18;
7. Wenn ein Gerät mit zwei Signalleitungen (I2C oder 4-Ziffern-Display) nicht geht, weise mich darauf hin, dass ich die beiden Pins tauschen kann.
8. Ein DHT-Sensor braucht 3,3 V und darf höchstens alle 2 Sekunden gelesen werden. Ein LED-Streifen braucht 5 V, einen 330-Ohm-Widerstand in der Datenleitung und eine niedrige Helligkeit am Anfang (zum Beispiel 30).
9. 4-Ziffern-Displays sollen ihre Zahl regelmäßig neu bekommen (zum Beispiel jede Sekunde).
10. Gib mir kompletten Code, den ich direkt kopieren kann. Schreibe Kommentare auf Deutsch.
11. Wenn du etwas nicht sicher weißt, frag mich zuerst, statt zu raten.

Meine Bauteile und meine Aufgabe:
[HIER KOMMT DEINE AUFGABE]
\`\`\`

> **Tipp:** Wenn die KI Pins benutzt, die nicht in der Liste stehen, sag ihr: „Bitte benutze nur die Pins aus meiner Liste.“`,
    doc_en: `This page explains what is on the Robo ESP32, which ports it has and how to plug in parts correctly. This guide helps you avoid the most common mistake: **two parts on the same pin**.

> **Important:** The board has no numbers like "Grove 1". Find a port by the **GPIO numbers** next to the connector (for example \`17\` and \`16\`).

## 1. What is on the board

- 7 Grove ports (small white connectors with 4 wires)
- 1 Maker port (small connector, shares its pins with the I2C Grove port)
- 4 servo ports
- 2 motor ports for small DC motors
- 2 buttons, 1 piezo buzzer with a mute switch
- 2 RGB LEDs, 10 status LEDs for pins
- A reset button and an on/off switch
- A socket for a NodeMCU ESP32 (30 pins) with a pin header

The pins for the buttons, buzzer, RGB LEDs and motors are listed in the [board's datasheet](https://docs.google.com/document/d/1sX5PVDH0t97U6eEQNhdARgjXWjdCvVvBfn_B1Vv0p9o/edit?usp=sharing). These pins are already in use. Don't use them for your own parts if you also need the buttons, the buzzer or the motors.

## 2. Power

The board can get power in three ways. One of them is enough:

- via **USB** (5 V)
- via a **LiPo battery** (1 cell)
- via the **VIN terminals** (3.6 to 6 V)

The on/off switch turns everything on and off. The motors use the same power source as the board.

## 3. Port overview

We tested these ports on the board. "Output" means the pin can also send signals.

| Port (GPIO pins) | What for | Note |
|---|---|---|
| **22 (SDA) and 21 (SCL)** | I2C devices (OLED, many sensors) | Also on the Maker port. On our board **SDA = 22 and SCL = 21**. |
| **17 and 16** | two signal lines | Both pins are outputs. |
| **26 and 25** | two signal lines | Both pins are outputs. No analog reading with Wi-Fi (ADC2). |
| **33 and 32** | two signal lines | Both pins are outputs. Analog reading with Wi-Fi works. |
| **36 and 39** | **reading sensors only** | Input only. No display, no LED strip. |
| **Servo: 4, 5, 18, 19** | servos or one signal line | Output. The servo port also has 5 V and GND. Better not use pin 5 (see section 4). |

> **Careful, these ports share pins:**
>
> - **22 + 39** shares pin 22 with the I2C port.
> - **25 + 33** shares pin 25 with port 26 + 25 and pin 33 with port 33 + 32.
>
> If you plug a part in there while the other port is also in use, you will get errors.

## 4. Pin rules

1. **Each pin for one part only.** If two ports share a pin, you can only use one of them. Exception: I2C devices may share one I2C port if they have different addresses.
2. **Pins 34 to 39 can only read.** They cannot send anything. They don't work for displays, LED strips, servos or the DHT sensor.
3. **Never use pins 6 to 11.** They are connected to the ESP32's memory.
4. **Be careful with pins 0, 2, 5, 12 and 15.** They affect how the board starts. If you use them, uploading or starting may fail.
5. **Wi-Fi and analog reading:** Pins on ADC2 (for example 25 and 26) cannot read analog values while Wi-Fi is on. Use 32, 33, 36 or 39 instead.

## 5. Which part goes where?

### I2C devices (OLED display, many sensors)

- Plug them into the **I2C port** (22 and 21).
- In code: \`Wire.begin(22, 21);\` (SDA first, then SCL).
- Several I2C devices can share the same port if they have different addresses. Most OLEDs use \`0x3C\`.
- If the device is not found, swap SDA and SCL in the code.

### 4-digit display (TM1637)

- Needs **two output pins** (CLK and DIO). Use 17 and 16, for example.
- Each display needs its **own pin pair**.
- If a display stays dark: swap CLK and DIO in the code.
- Write the number again regularly in your program (for example every second). Then the display doesn't stay dark after a power glitch.

### Temperature and humidity sensor (DHT11 / DHT22)

- Has **one data line**. The pin must be an **output**, so not 34 to 39. Use a servo pin like 4.
- Power it with **3.3 V** only, not 5 V. Otherwise the ESP32 gets too much voltage.
- Read it at most every 2 seconds.

### LED strip (WS2812 / NeoPixel)

- Has **one data line**. Use an output pin, for example 18.
- Put a **330 Ω** resistor in the data line.
- Power it with **5 V**. For more than about 8 LEDs you need a separate 5 V power supply. Then connect its **GND** to the board's **GND**.
- Start with a low brightness (for example 30 out of 255).

### Servos and motors

- Servos go into the **4 servo ports**, motors into the **2 motor ports**.
- Motors and servos need a lot of power. Use a power supply or a battery, not just USB.

### Analog sensors (for example light, soil moisture)

- Use a pin that can read analog values: **36, 39, 32 or 33**. These also work with Wi-Fi.

## 6. Finding problems

| Problem | What you can do |
|---|---|
| A device doesn't react at all | Is the connector pushed in all the way? Is the board on? Check the pin numbers in the code. |
| OLED or I2C sensor is not found | Swap SDA and SCL. Check that the device is on the I2C port. |
| Display stays dark | Swap CLK and DIO. Write the number again regularly. |
| Sensor shows "TIMEOUT" | Is it on an output pin (not 34 to 39)? Check the 3.3 V. |
| LEDs light up wrong or not at all | Check GND, 5 V, the data pin and the 330 Ω resistor. Enter the correct number of LEDs in the code. |
| Uploading doesn't work | Unplug everything from pins 0, 2, 5, 12 and 15 and try again. |
| The board acts strangely | Unplug everything and plug the parts back in one by one until you find the culprit. |

## 7. Prompt for chat AIs

Do you want an AI (for example ChatGPT or Claude) to help you program? Copy the text below and paste it **before your question**. At \`[YOUR TASK GOES HERE]\` at the end, write what you want to build and which parts you use.

\`\`\`text
You help students in grades 7 to 9 program the Cytron Robo ESP32.

Language: Answer in simple English with short sentences. Briefly explain technical terms. Explain the code in a few steps.

Board: Cytron Robo ESP32 (ESP32 with the Arduino framework, PlatformIO or Arduino IDE).

Ports I may use (GPIO pins):
- I2C: SDA = 22, SCL = 21. Always pass them yourself in code, for example Wire.begin(22, 21).
- Two signal lines (both outputs): 17 and 16
- Two signal lines (both outputs): 26 and 25 (ADC2, no analog reading with Wi-Fi)
- Two signal lines (both outputs): 33 and 32
- Input only (reading sensors only): 36 and 39
- Servo ports (output): 4, 5, 18, 19 (better not use pin 5)

Rules:
1. Only use the pins listed above. Don't make up other pins.
2. GPIO 34 to 39 can only read. Never use them as outputs (no display, no LED strip, no servo, no DHT sensor).
3. Don't use pins 6 to 11. Avoid 0, 2, 5, 12 and 15.
4. Each pin may be used by only one part. If my task would need two parts on the same pin, tell me and suggest a solution.
5. Ports 22 + 39 and 25 + 33 share pins with other ports. Don't use them.
6. Write the pins as constants at the start of the program, for example: constexpr uint8_t LED_PIN = 18;
7. If a device with two signal lines (I2C or 4-digit display) doesn't work, remind me that I can swap the two pins.
8. A DHT sensor needs 3.3 V and may be read at most every 2 seconds. An LED strip needs 5 V, a 330 ohm resistor in the data line and a low brightness at the start (for example 30).
9. 4-digit displays should get their number again regularly (for example every second).
10. Give me complete code that I can copy directly. Write comments in English.
11. If you are not sure about something, ask me first instead of guessing.

My parts and my task:
[YOUR TASK GOES HERE]
\`\`\`

> **Tip:** If the AI uses pins that are not in the list, tell it: "Please only use the pins from my list."`,
  },
];

// ── Doku pro Board-Profil (Port-Tabelle wird dynamisch angehängt) ──────────

const BOARD_DOCS = {
  maker_pi_rp2040: `Das Standard-Board von makerSpaceOS: ein RP2040 mit ganz viel
schon eingebaut – einfach USB anstecken und loslegen.

## Eingebaut auf dem Board

- **2 Taster** B1 und B2
- **Summer** (Piepser) für Töne
- **2 NeoPixel** (bunte LEDs)
- **2 Motor-Anschlüsse** M1 und M2 (mit Test-Tastern)
- **4 Servo-Anschlüsse** S1 bis S4
- **7 Grove-Ports** für Sensoren und Aktoren
- **Batterie-Messung** über den Batterie-Block

## ⚠️ Wichtig: Motor-Stromversorgung

**Maximal 6 Volt** an den Versorgungseingang (VIN/Batterie-Anschluss) –
**keine 9-V-Blöcke!** Das zerstört das Board. Geeignet: 4× AA-Batterien (6 V)
oder ein LiPo-Akku (3,7 V).

## Gut zu wissen

- Die Grove-Ports liefern **3,3 V** (nicht 5 V). Der Grove-LCD **V4** braucht
  5 V und bleibt an 3,3 V leer – Version **V5** funktioniert direkt.
- Analoge Sensoren (Lichtsensor, Drehregler, Luftqualität …) gehören an die
  **Analog-Ports Grove 5, 6 oder 7**.`,

  lolin_s2_mini: `Ein kleines, günstiges ESP32-S2-Board – ohne eingebaute Extras.
Taster, Motoren und NeoPixel vom Maker-Pi gibt es hier nicht, dafür viele
frei nutzbare Pins.

## Anders als beim Maker-Pi

- **Keine** Onboard-Taster, **kein** Motortreiber, **kein** NeoPixel onboard
  (nur eine blaue LED an IO15).
- Die Ports sind **Pin-Paare** (z.B. "2/3" = IO2 und IO3) statt nummerierter
  Grove-Buchsen – Sensoren werden direkt oder über ein Steckbrett angeschlossen.
- Analog können die Pins **IO1 bis IO10** (auch mit WLAN nutzbar).
- I2C-Geräte (LCD, Bewegungssensor …) funktionieren an **jedem** Pin-Paar.

## Gut zu wissen

Die Bibliotheken (\`makerspaceos.py\`, \`asyncio\`, \`adafruit_ticks\`, \`neopixel\`)
müssen wie beim Maker-Pi auf \`CIRCUITPY/lib/\` liegen.`,

  esp32_d1_r32: `Ein ESP32 im Arduino-Uno-Format (AZ-Delivery) mit aufgestecktem
**Grove Base Shield** – dadurch gibt es wieder echte Grove-Buchsen.

## ⚠️ Wichtig: Schalter auf 3V3

Der **VCC-Schalter des Shields muss auf 3V3** stehen – die ESP32-Pins vertragen
keine 5 Volt!

## Besonderheiten der Ports

- Die Port-Namen (D2–D8, A0–A3, I2C) entsprechen dem **Aufdruck auf dem Shield**.
- **Benachbarte D-Ports teilen sich einen Pin** (Grove-Verdrahtung) – also nicht
  zwei direkt nebeneinanderliegende D-Ports gleichzeitig benutzen.
- **A2 und A3** können nur **lesen** (Sensoren ja, LEDs/Summer nein).
- Das Signal von **A0** hängt an der **Onboard-LED** – die blinkt dann mit.
- **I2C** (LCD, Bewegungssensor …) nur an der fest verdrahteten I2C-Buchse.

## Gut zu wissen

Das Board hat **kein CIRCUITPY-Laufwerk** am Computer. Bibliotheken kommen per
Thonny auf das Board – oder man flasht das fertige Komplett-Image
\`firmware/makerSpaceOS_firmware_esp32-d1-r32.bin\` (enthält schon alles).
Ausführliche Anleitung mit Fotos: \`docs/esp32-d1-r32.md\` im Projekt.`,
};

const BOARD_DOCS_EN = {
  maker_pi_rp2040: `The standard makerSpaceOS board: an RP2040 with lots of things
already built in – just plug in USB and get started.

## Built into the board

- **2 buttons** B1 and B2
- **Buzzer** (beeper) for sounds
- **2 NeoPixels** (colourful LEDs)
- **2 motor connectors** M1 and M2 (with test buttons)
- **4 servo connectors** S1 to S4
- **7 Grove ports** for sensors and actuators
- **Battery measurement** via the battery block

## ⚠️ Important: motor power supply

**Maximum 6 volts** at the supply input (VIN/battery connector) –
**no 9 V blocks!** That destroys the board. Suitable: 4× AA batteries (6 V)
or a LiPo battery (3.7 V).

## Good to know

- The Grove ports supply **3.3 V** (not 5 V). The Grove LCD **V4** needs
  5 V and stays blank at 3.3 V – version **V5** works right away.
- Analog sensors (light sensor, rotary knob, air quality …) belong on the
  **analog ports Grove 5, 6 or 7**.`,

  lolin_s2_mini: `A small, inexpensive ESP32-S2 board – without built-in extras.
The Maker-Pi's buttons, motors and NeoPixels are not available here, but there
are many freely usable pins instead.

## Different from the Maker-Pi

- **No** onboard buttons, **no** motor driver, **no** onboard NeoPixel
  (just a blue LED on IO15).
- The ports are **pin pairs** (e.g. "2/3" = IO2 and IO3) instead of numbered
  Grove sockets – sensors are connected directly or via a breadboard.
- Pins **IO1 to IO10** can do analog (usable together with Wi-Fi).
- I2C devices (LCD, motion sensor …) work on **any** pin pair.

## Good to know

The libraries (\`makerspaceos.py\`, \`asyncio\`, \`adafruit_ticks\`, \`neopixel\`)
must be placed on \`CIRCUITPY/lib/\`, just like on the Maker-Pi.`,

  esp32_d1_r32: `An ESP32 in Arduino Uno format (AZ-Delivery) with a
**Grove Base Shield** on top – which brings back real Grove sockets.

## ⚠️ Important: switch to 3V3

The **shield's VCC switch must be set to 3V3** – the ESP32 pins do not
tolerate 5 volts!

## Port peculiarities

- The port names (D2–D8, A0–A3, I2C) match the **printing on the shield**.
- **Neighbouring D ports share a pin** (Grove wiring) – so don't use two
  directly adjacent D ports at the same time.
- **A2 and A3** can only **read** (sensors yes, LEDs/buzzer no).
- The signal of **A0** is tied to the **onboard LED** – it will blink along.
- **I2C** (LCD, motion sensor …) only on the hard-wired I2C socket.

## Good to know

The board has **no CIRCUITPY drive** on the computer. Libraries are copied to
the board via Thonny – or you flash the ready-made complete image
\`firmware/makerSpaceOS_firmware_esp32-d1-r32.bin\` (contains everything).
Detailed guide with photos: \`docs/esp32-d1-r32.md\` in the project.`,
};

// ── Feld-/Sprachauswahl ohne globalen i18n-State (Nachbau von LF() aus i18n.js) ──

function docsPick(obj, field, isEn) {
  if (!obj) return '';
  const v = isEn ? (obj[field + '_en'] ?? obj[field]) : obj[field];
  return v ?? '';
}

const GROVE_ROLE_LABELS_DE = {
  digital: 'digitaler Grove-Port', analog: 'analoger Grove-Port',
  i2c: 'I2C-Port', '2pin': 'Grove-Port (beide Pins)',
};
const GROVE_ROLE_LABELS_EN = {
  digital: 'digital Grove port', analog: 'analog Grove port',
  i2c: 'I2C port', '2pin': 'Grove port (both pins)',
};
function groveRoleLabel(role, isEn) {
  return (isEn ? GROVE_ROLE_LABELS_EN : GROVE_ROLE_LABELS_DE)[role] || role;
}

// ── Mini-Markdown → HTML (Headings, Listen, Code, Bilder, Zitate) ─────────

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Relative Bildpfade (../images/x.png) gegen den Ordner der .md auflösen.
function resolveSrc(src, baseDir) {
  if (/^(https?:|data:|\/)/.test(src)) return src;
  const parts = ((baseDir || '') + '/' + src).split('/').filter(p => p && p !== '.');
  const out = [];
  for (const p of parts) {
    if (p === '..') out.pop(); else out.push(p);
  }
  return out.join('/');
}

function mdInline(s, baseDir) {
  let h = escHtml(s);
  h = h.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g,
    (_, alt, src) => `<img src="${resolveSrc(src, baseDir)}" alt="${alt}" loading="lazy">`);
  h = h.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>');
  h = h.replace(/`([^`]+)`/g, '<code>$1</code>');
  h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  return h;
}

function mdToHtml(md, baseDir) {
  const lines = String(md).split('\n');
  const out = [];
  let para = [], list = null, quote = [], code = null, tbl = null;

  const flushPara  = () => { if (para.length)  { out.push('<p>' + mdInline(para.join(' '), baseDir) + '</p>'); para = []; } };
  const flushList  = () => { if (list) { out.push(`<${list.tag}>` + list.items.map(i => '<li>' + mdInline(i, baseDir) + '</li>').join('') + `</${list.tag}>`); list = null; } };
  const flushQuote = () => { if (quote.length) { out.push('<blockquote>' + mdInline(quote.join(' '), baseDir) + '</blockquote>'); quote = []; } };
  const flushTable = () => {
    if (!tbl) return;
    const [head, , ...rows] = tbl;   // 2. Zeile = |---|---|
    const row = (cells, tag) => '<tr>' + cells.map(c => `<${tag}>` + mdInline(c, baseDir) + `</${tag}>`).join('') + '</tr>';
    out.push('<table class="lib-table">' + row(head, 'th') + rows.map(r => row(r, 'td')).join('') + '</table>');
    tbl = null;
  };
  const flushAll   = () => { flushTable(); flushPara(); flushList(); flushQuote(); };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');

    if (code !== null) {
      if (/^```/.test(line)) { out.push('<pre><code>' + escHtml(code.join('\n')) + '</code></pre>'); code = null; }
      else code.push(raw);
      continue;
    }
    if (/^```/.test(line)) { flushAll(); code = []; continue; }

    if (!line.trim()) { flushAll(); continue; }

    if (/^\|.*\|$/.test(line.trim())) {
      flushPara(); flushList(); flushQuote();
      tbl = tbl || [];
      tbl.push(line.trim().slice(1, -1).split('|').map(c => c.trim()));
      continue;
    }
    flushTable();

    const hm = line.match(/^(#{1,4})\s+(.*)$/);
    if (hm) {
      flushAll();
      const lvl = Math.min(hm[1].length + 2, 5);   // # → h3 (h1/h2 gehören der Seite)
      out.push(`<h${lvl}>` + mdInline(hm[2], baseDir) + `</h${lvl}>`);
      continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) { flushAll(); out.push('<hr>'); continue; }

    const qm = line.match(/^>\s?(.*)$/);
    if (qm) { flushPara(); flushList(); quote.push(qm[1]); continue; }

    const um = line.match(/^[-*]\s+(.*)$/);
    const om = line.match(/^\d+[.)]\s+(.*)$/);
    if (um || om) {
      flushPara(); flushQuote();
      const tag = um ? 'ul' : 'ol';
      if (!list || list.tag !== tag) { flushList(); list = { tag, items: [] }; }
      list.items.push((um || om)[1]);
      continue;
    }
    // Fortsetzungszeile einer Liste (eingerückt)
    if (list && /^\s{2,}\S/.test(raw)) { list.items[list.items.length - 1] += ' ' + line.trim(); continue; }

    flushList(); flushQuote();
    para.push(line.trim());
  }
  flushAll();
  if (code !== null) out.push('<pre><code>' + escHtml(code.join('\n')) + '</code></pre>');
  return out.join('\n');
}

// ── Einträge sammeln (Boards + Grundlagen + Hardware-Blöcke), flache Map ──
//
// Liefert NUR die flache key→entry-Map (kind: 'board'|'core'|'block'), OHNE
// Baum-/Kategorie-Struktur – die baut sich jeder Aufrufer nach eigenem Bedarf
// selbst (js/docs.js für den Rechtsklick-Drawer braucht nur einzelne
// Einträge, viewer.html baut daraus eine eigene 3-Bereiche-Navigation).

function docsBuildEntries(isEn) {
  const entries = new Map();

  // 1. Boards
  const boardIds = [BOARD_ID, ...Object.keys(BOARD_PROFILES).filter(id => id !== BOARD_ID)];
  for (const id of boardIds) {
    const p = BOARD_PROFILES[id];
    entries.set('board:' + id, {
      key: 'board:' + id, kind: 'board', boardId: id,
      label: p.name + (id === BOARD_ID ? (isEn ? '  · active' : '  · aktiv') : ''),
      colour: '#64748B', tooltip: '',
      doc: (isEn ? BOARD_DOCS_EN[id] : BOARD_DOCS[id]) || BOARD_DOCS[id] || '',
      baseDir: '',
    });
  }

  const hideIds = new Set((typeof BOARD !== 'undefined' && BOARD.hideBlockIds) || []);

  // 2. Kern- und Standard-Blöcke
  for (const c of CORE_DOCS) {
    if (hideIds.has(c.id)) continue;
    entries.set('block:' + c.id, {
      key: 'block:' + c.id, kind: 'core', blockType: c.id,
      label: docsPick(c, 'label', isEn), colour: c.colour, section: c.section,
      tooltip: docsPick(c, 'tooltip', isEn), doc: docsPick(c, 'doc', isEn), baseDir: '',
    });
  }

  // 3. Hardware-Blöcke aus BLOCKS_DB
  for (const def of (typeof BLOCKS_DB !== 'undefined' ? BLOCKS_DB : [])) {
    if (hideIds.has(def.id)) continue;
    const catDef = (typeof BLOCKS_CATALOG !== 'undefined' ? BLOCKS_CATALOG.categories : [])
      .find(c => c.id === def.blockCategory);
    const dir = def._file ? 'components/' + def._file.split('/').slice(0, -1).join('/') : 'components';
    entries.set('block:' + def.id, {
      key: 'block:' + def.id, kind: 'block', blockType: def.id, def, catDef,
      label: docsPick(def, 'label', isEn) || def.id,
      colour: def.colour || (catDef && catDef.colour),
      tooltip: docsPick(def, 'tooltip', isEn),
      doc: docsPick(def, 'doc', isEn),
      baseDir: dir,
    });
  }

  return entries;
}

// ── Detail-Karte (gemeinsam für Rechtsklick-Panel und viewer.html) ────────

function cardHtml(entry, isEn) {
  const parts = [];

  if (entry.image) {
    parts.push(`<img class="lib-card-image" src="${resolveSrc(entry.image, entry.baseDir)}" alt="${escHtml(entry.label)}" loading="lazy">`);
  }

  parts.push(`<div class="lib-card-header" style="border-left-color:${entry.colour || '#4AB8A6'}">
    <div class="lib-card-label">${escHtml(entry.label)}</div>
    ${cardSubtitle(entry, isEn)}
  </div>`);

  const chips = cardChips(entry, isEn);
  if (chips) parts.push(`<div class="lib-chips">${chips}</div>`);

  if (entry.tooltip) parts.push(`<p class="lib-intro">${escHtml(entry.tooltip)}</p>`);
  if (entry.doc)     parts.push(`<div class="lib-doc">${mdToHtml(entry.doc, entry.baseDir)}</div>`);
  if (!entry.tooltip && !entry.doc) {
    parts.push('<p class="lib-intro">' + (isEn
      ? 'There is no detailed explanation for this entry yet.'
      : 'Für diesen Eintrag gibt es noch keine ausführliche Erklärung.') + '</p>');
  }

  if (entry.kind === 'board') parts.push(boardPortTable(entry.boardId, isEn));

  return `<div class="lib-card">${parts.join('\n')}</div>`;
}

function cardSubtitle(entry, isEn) {
  if (entry.kind === 'board') return '<div class="lib-card-sub">' + (isEn ? 'Board profile' : 'Board-Profil') + '</div>';
  const def = entry.def;
  if (def && def.hardware && def.hardware.commonName) {
    return `<div class="lib-card-sub">${escHtml(def.hardware.commonName)}</div>`;
  }
  return '';
}

function cardChips(entry, isEn) {
  const chips = [];
  const def = entry.def;
  if (def) {
    if (def.blockCategory) {
      const catDef = entry.catDef;
      const catLbl = catDef ? docsPick(catDef, 'label', isEn) : def.blockCategory;
      const subLbl = def.subCategory
        ? ((isEn && catDef && catDef.subCategories_en && catDef.subCategories_en[def.subCategory]) || def.subCategory)
        : '';
      chips.push(escHtml(catLbl + (subLbl ? ' · ' + subLbl : '')));
    }
    const roles = new Set((def.inputs || [])
      .filter(i => i.fieldType === 'grove_dropdown')
      .map(i => groveRoleLabel(i.groveRole || 'digital', isEn)));
    for (const r of roles) chips.push('🔌 ' + escHtml(r));
    if (def.hardware && def.hardware.kitStandard) chips.push(isEn ? '✓ included in the kit' : '✓ im Kit enthalten');
  } else if (entry.kind === 'core') {
    const secDef = CORE_SECTIONS.find(sc => sc.name === entry.section);
    const secLbl = secDef ? (isEn ? secDef.label_en : secDef.name) : entry.section;
    chips.push(escHtml(entry.section === 'Lichter' ? (isEn ? 'Lights · 8×8 matrix' : 'Lichter · 8×8 Matrix') : (secLbl || (isEn ? 'Basics' : 'Grundlagen'))));
  }
  return chips.map(c => `<span class="lib-chip">${c}</span>`).join('');
}

function boardPortTable(boardId, isEn) {
  const p = BOARD_PROFILES[boardId];
  if (!p || !p.grovePorts || !p.grovePorts.length) return '';
  const rows = p.grovePorts.map(port => {
    const kann = [
      'digital',
      port.analog ? 'analog' : null,
      port.i2c ? 'I2C' : null,
    ].filter(Boolean).join(', ');
    return `<tr><td>${escHtml(port.label)}</td><td><code>${escHtml(port.signal)}</code>`
      + ` + <code>${escHtml(port.pin1)}</code></td><td>${kann}</td></tr>`;
  }).join('');
  return `<h3>${isEn ? 'Connectors (ports)' : 'Anschlüsse (Ports)'}</h3>
    <table class="lib-table">
      <thead><tr><th>Port</th><th>${isEn ? 'Pins (signal + second pin)' : 'Pins (Signal + zweiter Pin)'}</th><th>${isEn ? 'Can do' : 'Kann'}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}
