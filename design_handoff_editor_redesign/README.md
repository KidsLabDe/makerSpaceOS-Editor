# Handoff: CircuitBlox Editor — KidsLab Redesign

## Overview
Visual redesign of the **CircuitBlox** Blockly editor (`makerSpaceOS-Editor`) to match the
**KidsLab** brand. The current editor uses a dark "cyber" theme (navy/cyan, Segoe UI, emoji
icons). The redesign moves to the KidsLab look: warm off-white paper UI, the seven hand-drawn
crayon brand colors on the blocks, a sticker-style primary action, Heroicons instead of emoji,
and **Monofur** as the code font. The code- and serial-panel stay dark (best of both for a code
tool).

## About the design files
The files in `reference/` are a **design reference created in HTML** (a Design Component
prototype). They show the intended look and behavior — they are **not** production code to drop
in. Your task is to **apply this design to the existing `makerSpaceOS-Editor` codebase** (vanilla
JS + Blockly 9 + CodeMirror 5), editing its real files, keeping all current functionality intact.

Open `reference/CircuitBlox Editor.dc.html` in a browser (it loads `support.js` next to it) to
see the target. It is the single source of truth for exact colors, spacing, fonts, and the inline
Heroicons SVGs — copy values straight out of it.

## Fidelity
**High-fidelity.** Final colors, type, spacing, radii, shadows, and icon set. Recreate
pixel-faithfully using the existing codebase, do not introduce a framework.

---

## What changes, file by file

The redesign touches **four areas**: (1) global CSS, (2) the page `<head>` (fonts) and emoji
icons in `index.html`, (3) the Blockly theme + grid in `js/app.js`, and (4) the block/category
colors spread across several JS files.

### 1. `index.html` — fonts + icons

**a) Add the three webfonts** to `<head>` (before `css/style.css`):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.cdnfonts.com/css/monofur" rel="stylesheet">
```

- **Pixelify Sans** → logo wordmark / display only.
- **Inter** → all UI text (buttons, labels, status).
- **Monofur** → code editor, serial monitor, serial input, block value chips.
  (Loaded from cdnfonts because Monofur is not on Google Fonts. If you prefer self-hosting, drop a
  `monofur.woff2` into the project and swap for an `@font-face` rule.)

**b) Replace every emoji** with an inline Heroicons (outline, stroke ~1.8, `currentColor`) SVG.
The exact SVGs are in the reference file — copy them. Mapping:

| Element (current emoji) | Heroicon |
|---|---|
| Logo `⚡` | drop the emoji — the KidsLab wordmark PNG now carries the brand (see Assets) |
| `▶ Ausführen` | `play` (solid triangle path) |
| `⏹ Stopp` | `stop` |
| `💾 Auf RP2040` | `cpu-chip` |
| `🕘 Verlauf` | `clock` |
| `🤖 KI-Block` | `sparkles` |
| `📋` copy | `clipboard` |
| `✏️` edit | `pencil-square` |
| `🗑️` clear / trash | `trash` |
| `✕` close | `x-mark` (`M6 18 18 6M6 6l12 12`) |
| `⚙️` settings | `cog-6-tooth` |
| `Senden` / `✨ Generieren` | `paper-airplane` / `sparkles` |
| Status dot | keep as the CSS `.status-dot` circle, recolor to `#4AB8A6` |

**c) Header logo lockup.** Replace the `.logo` markup with: the wide KidsLab PNG
(`assets/kids-lab-logo-breit.png`, height 30px) → a 1.5px `#E5DFD0` vertical divider →
a column with `CircuitBlox` (Pixelify Sans, 21px, `#111`) above
`MAKEYOURSCHOOL · MAKER-PI RP2040` (Inter, 10.5px, uppercase, `#64748b`).

### 2. `css/style.css` — full reskin

Replace the `:root` dark palette with the KidsLab tokens below and restyle the chrome. The
reference file has every exact value; key points:

```css
:root {
  --header-h: 64px;
  --panel-w: 452px;

  /* Surfaces — light, warm */
  --bg:         #FBF8F3;   /* paper */
  --bg-alt:     #F3EDE1;
  --surface:    #ffffff;
  --line:       #E5DFD0;   /* warm hairline */
  --line-strong:#1a1a1a;   /* sticker outline */

  /* Text */
  --text:       #111111;
  --text-muted: #64748b;
  --text-subtle:#94a3b8;

  /* Crayon brand palette */
  --brand-orange:#F39A1B; --brand-purple:#A57BC3; --brand-coral:#E98685;
  --brand-teal:  #4AB8A6; --brand-sky:   #4FBFE8; --brand-yellow:#F7D94C;
  --brand-red:   #E24D3D; --brand-blue:  #2563eb;

  /* Roles */
  --accent:     #4AB8A6;   /* primary "run" action */
  --danger:     #E24D3D;

  /* Dark code panel (kept dark) */
  --code-bg:    #0f172a;
  --code-bar:   #16213e;
  --code-line:  #243049;
  --serial-bg:  #0d1117;
  --serial-fg:  #a5d6a7;

  --font-body:  'Inter', system-ui, sans-serif;
  --font-display:'Pixelify Sans', ui-rounded, cursive, system-ui;
  --font-mono:  'monofur', 'JetBrains Mono', ui-monospace, monospace;

  --radius-sm:6px; --radius-md:8px; --radius-lg:12px; --radius-pill:999px;
  --ease-out: cubic-bezier(.2,.7,.2,1);
}
```

Restyle rules (match reference exactly):

- **`body`**: `background: var(--bg); color: var(--text); font-family: var(--font-body);`
- **`#header`**: white surface, `border-bottom: 3px solid #1a1a1a` (sticker line — or 1px
  `--line` for a softer look), height 64px.
- **`.btn`**: radius 9px, 1.5px border, Inter 13px/600. Ghost buttons = white bg + 1.5px `--line`,
  hover `border-color:#1a1a1a; translateY(-1px)`.
- **Primary "Ausführen"** = sticker treatment: `background: var(--accent); color:#0d2b27;
  border:1.5px solid #1a1a1a; box-shadow:2px 2px 0 #1a1a1a;` hover
  `transform:translate(-1px,-1px); box-shadow:3px 3px 0 #1a1a1a;` active settles to `1px 1px 0`.
- **Stopp** = `--danger` solid, white text, `opacity:.38` while disabled.
- **`.status-indicator`**: white pill, 1.5px `--line`; dot `#4AB8A6` with
  `box-shadow:0 0 0 3px rgba(74,184,166,.25)`.
- **`#code-panel` / panel-header / serial**: keep DARK using `--code-*` / `--serial-*` tokens.
  Panel-header label color `#7dd3fc`, uppercase, 11px/700.
- **`.CodeMirror`**: `font-family: var(--font-mono) !important;` — this is what switches the code
  editor to Monofur. **`<pre>` in CodeMirror inherits fine**, but if you render any raw `<pre>`
  elsewhere, set `font-family` on them directly (browsers force `pre { font-family: monospace }`).
- **`::-webkit-scrollbar-thumb`**: `#cfc7b5` on light areas, `#334155` on the dark panel.
- **Toolbox/flyout CSS overrides** at the bottom (`.blocklyToolboxDiv`, `.blocklyTreeLabel`,
  `.blocklyFlyoutBackground`, `.blocklyMainBackground`): retune to the light theme — toolbox bg
  `#ffffff`, label color `#1e293b`, flyout bg `#F3EDE1`/`#ffffff`, workspace fill `#FBF8F3`,
  selected tree row tint `rgba(74,184,166,.14)`.

### 3. `js/app.js` — Blockly theme + grid (lines ~15–40)

```js
const cbTheme = Blockly.Theme.defineTheme('makerspaceos', {
  base: Blockly.Themes.Classic,
  fontStyle: { family: "'Inter', system-ui, sans-serif", weight: '600', size: 13 },
  componentStyles: {
    workspaceBackgroundColour: '#FBF8F3',
    toolboxBackgroundColour:   '#ffffff',
    toolboxForegroundColour:   '#1e293b',
    flyoutBackgroundColour:    '#F3EDE1',
    flyoutForegroundColour:    '#1e293b',
    flyoutOpacity:             1,
    scrollbarColour:           '#cfc7b5',
    scrollbarOpacity:          0.7,
  },
});
// …
grid: { spacing: 22, length: 3, colour: '#E3DCCB', snap: true },
```

### 4. Block & category colors — crayon mapping

The blocks are colored by `setColour(...)` / `colour:` literals (Blockly themes don't repaint
existing per-block colors). Do a **find-and-replace of the hex literals** across
`js/toolbox.js`, `js/blocks_db.js`, `js/blocks/events.js`, `js/blocks/control.js`,
`js/block_builder.js`, `js/ai_chat.js`:

| Old hex (meaning) | New crayon | Token |
|---|---|---|
| `#0D47A1` (Ereignisse / when_*) | `#F39A1B` | orange |
| `#546E7A`, `#37474F` (Steuerung / control) | `#A57BC3` | purple |
| `#1565C0` (Mathematik / generic default) | `#2563eb` | blue |
| `#00695C` (Text) | `#4AB8A6` | teal |
| `#4E342E` (Logik) | `#4FBFE8` | sky |
| `#880E4F` (Variablen) | `#F7D94C` | yellow |
| `#E65100` (Sensoren — hardware) | `#E98685` | coral |
| `#6A1B9A` (Aktoren / Motor — hardware) | `#E24D3D` | red |
| `#00838F`, `#006064` (NeoPixel / LCD) | `#E24D3D` | red |
| `#7c6af7` (KI-Blöcke) | `#A57BC3` | purple |

Also strip the leading emoji from the toolbox category names in `toolbox.js`
(`'🔁 Steuerung'` → `'Steuerung'`, etc.) and from `block_builder.js` category defs — or replace
with the colored square + label treatment used in the reference toolbox.

**⚠ Yellow contrast:** Zelos draws block text white. On the yellow `#F7D94C` Variablen blocks
that's low-contrast. Either nudge to a deeper yellow (`#E8C534`) or set a dedicated block style
with dark text (`'colourPrimary':'#F7D94C', 'colourTertiary':'#caa92f'` + a dark
`field`/text color) for that category.

---

## Interactions & behavior
No behavioral changes. Preserve everything: serial connect/run/stop, save-to-RP2040, history
drawer, AI-block drawer, resize divider, live code generation, autosave. Hover/press timings
follow KidsLab motion: `--dur-fast 120ms`, easing `cubic-bezier(.2,.7,.2,1)`, buttons lift
`translateY(-1px)` on hover and settle to `0` on press. No entrance animations, no backdrop-blur.

## Design tokens
See the `:root` block above. Spacing on a 4px grid. Radii 6/8/12px. Two shadow languages:
soft functional (`0 2px 4px rgba(17,17,17,.1)`) for floating panels, and the **hard sticker
shadow** `2–3px 2–3px 0 #1a1a1a` reserved for the primary action and the floating zoom controls.

## Assets
In `reference/assets/` (copied from the KidsLab design system, originally
`github.com/kidslabde/kidslab.de`):
- `kids-lab-logo-breit.png` — wide hand-drawn KIDS·LAB wordmark, for the header (2206×503, alpha).
- `kids-lab-bulb.png` — standalone bulb mark (optional, e.g. favicon or empty states).

Copy these into the editor's `assets/` (or `css/`-adjacent) folder and reference by relative path.
Icons are inline Heroicons SVG (no asset files) — lift them from the reference HTML.

## Files
- `reference/CircuitBlox Editor.dc.html` — the target design (open in a browser).
- `reference/support.js` — runtime that renders the `.dc.html` (must sit next to it).
- `reference/assets/*.png` — brand logos.

### Files to edit in the real project
- `index.html` — fonts in `<head>`, emoji → Heroicons, logo lockup.
- `css/style.css` — full token + chrome reskin (keep code panel dark).
- `js/app.js` — Blockly theme + grid colors + font family.
- `js/toolbox.js`, `js/blocks_db.js`, `js/blocks/events.js`, `js/blocks/control.js`,
  `js/block_builder.js`, `js/ai_chat.js` — crayon hex remap + emoji removal in category names.
