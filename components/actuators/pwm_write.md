---
id: pwm_write
blockCategory: Pins
subCategory: ""
label: "⚡ PWM"
label_en: "⚡ PWM"
colour: "#64748B"
tooltip: "Gibt auf einem Port eine stufenlose Stärke aus (0 % = aus, 100 % = voll an) – z. B. für MOSFET-Module, LED-Streifen oder Lüfter"
tooltip_en: "Outputs a variable power level on a port (0 % = off, 100 % = fully on) – e.g. for MOSFET modules, LED strips or fans"
blockType: statement
inline: true
inputs:
  - label: "⚡ PWM  Port:"
    label_en: "⚡ PWM  port:"
    name: PIN
    fieldType: grove_dropdown
    groveRole: digital
valueInputs:
  - name: PERCENT
    label: "Stärke"
    label_en: "power"
    check: Number
    defaultValue: 50
    suffix: "%"
generator:
  imports:
    - "import board"
    - "import pwmio"
  defs:
    - key: "init_pwmout_${PIN}"
      val: "_pwmout_${PIN} = pwmio.PWMOut(board.${PIN}, frequency=1000, duty_cycle=0)"
  code: "_pwmout_${PIN}.duty_cycle = max(0, min(65535, int((${PERCENT}) * 655.35)))\n"
legacyGenerator: false
---

# PWM-Ausgabe

Schaltet den Port nicht nur **an oder aus**, sondern stufenlos dazwischen:
0 % = aus, 50 % = halbe Kraft, 100 % = voll an. Dafür schaltet der Pin sehr
schnell (1000-mal pro Sekunde) an und aus. Je länger er jedes Mal an bleibt,
desto heller leuchtet eine LED oder desto schneller dreht ein Lüfter.

**Typischer Einsatz: MOSFET-Modul.** Der Pin selbst liefert nur wenig Strom.
Ein MOSFET-Modul schaltet damit große Lasten mit eigener Stromversorgung:
LED-Streifen dimmen, Lüfter oder kleine Motoren langsamer und schneller laufen
lassen. Das Signal-Kabel (gelb / SIG) des Grove-Ports kommt an den Signal-Eingang
des Moduls.

**Gut zu wissen:**
- Am besten **Grove 1–4** nutzen. Auf dem MAKER-PI teilen sich immer zwei Pins
  einen Taktgeber: Grove 5 und 6 vertragen sich nicht mit Motor M2, Grove 7
  nicht mit Servo S1/S2 – wer beides gleichzeitig nutzt, bekommt beim Start
  einen Fehler.
- Denselben Port im Programm nicht zusätzlich mit „🔌 Digital" schalten.
- Werte unter 0 % oder über 100 % werden automatisch begrenzt.

<!-- lang:en -->

# PWM output

Switches the port not just **on or off**, but smoothly in between:
0 % = off, 50 % = half power, 100 % = fully on. To do this the pin switches
on and off very quickly (1000 times per second). The longer it stays on each
time, the brighter an LED shines or the faster a fan spins.

**Typical use: MOSFET module.** The pin itself only supplies a little current.
A MOSFET module uses it to switch big loads with their own power supply:
dim LED strips, make fans or small motors run slower or faster. The signal wire
(yellow / SIG) of the Grove port goes to the signal input of the module.

**Good to know:**
- Best use **Grove 1–4**. On the MAKER-PI two pins always share one timer:
  Grove 5 and 6 do not get along with motor M2, Grove 7 not with servo S1/S2 –
  using both at the same time gives an error at start.
- Do not also switch the same port with "🔌 Digital" in the program.
- Values below 0 % or above 100 % are limited automatically.
