---
id: actuator_buzzer_port
blockCategory: Aktionen
subCategory: Ton
requiresBoardFeature: externalBuzzer
label: "🔔 Buzzer Ton"
label_en: "🔔 Buzzer tone"
colour: "#DC2626"
tooltip: "Spielt einen Ton mit einem passiven Buzzer am gewählten Anschluss (z.B. 440 = Kammerton A)"
tooltip_en: "Plays a tone with a passive buzzer on the chosen connector (e.g. 440 = concert pitch A)"
blockType: statement
inline: true
inputs:
  - label: "🔔 Buzzer  Port:"
    label_en: "🔔 Buzzer  port:"
    name: PIN
    fieldType: grove_dropdown
    groveRole: digital
valueInputs:
  - name: FREQ
    label: "Ton:"
    label_en: "tone:"
    check: Number
    defaultValue: 440
  - name: DURATION
    label: "Hz  für"
    label_en: "Hz  for"
    check: Number
    defaultValue: 0.5
    suffix: "Sekunden"
    suffix_en: "seconds"
generator:
  imports:
    - "import board"
    - "import pwmio"
  defs:
    - key: "init_buzz_${PIN}"
      val: "_buzz_${PIN} = pwmio.PWMOut(board.${PIN}, duty_cycle=0, frequency=440, variable_frequency=True)"
  code: "_buzz_${PIN}.frequency = ${FREQ}\n_buzz_${PIN}.duty_cycle = 32768\nawait asyncio.sleep(${DURATION})\n_buzz_${PIN}.duty_cycle = 0\n"
hardware:
  commonName: "Passiver Buzzer (extern)"
  verbrauch3j: 14
  kitStandard: true
legacyGenerator: false
---

# Buzzer-Ton (externer Buzzer)

Spielt Töne mit einem **passiven Buzzer**, den du an einen Anschluss steckst (beim RoboBuddy: A0, A1 oder A2). Die Frequenz bestimmt die Tonhöhe: 262 = C, 440 = A.

> Beim RoboBuddy sind die Ton-Ausgänge knapp: Neben den vier Servos gehen höchstens **zwei** weitere Ton-/PWM-Ausgänge gleichzeitig (Buzzer oder PWM-Block). Ein dritter bricht mit einer Fehlermeldung ab.

<!-- lang:en -->

# Buzzer tone (external buzzer)

Plays tones with a **passive buzzer** that you plug into a connector (on the RoboBuddy: A0, A1 or A2). The frequency sets the pitch: 262 = C, 440 = A.

> On the RoboBuddy, tone outputs are scarce: besides the four servos, at most **two** more tone/PWM outputs work at the same time (buzzer or PWM block). A third one stops with an error message.
