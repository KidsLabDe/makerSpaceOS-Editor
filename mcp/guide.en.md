# makerSpaceOS – guide for AI agents

makerSpaceOS is a Blockly IDE for kids and beginners: blocks → CircuitPython for boards
(MAKER-PI-RP2040, Wemos S2 Mini, ESP32 D1 R32). Audience: children – keep programs simple and clear.

## Rules (mandatory)
1. **Work with blocks only.** Programs change exclusively through block tools (`add_block`, `connect_blocks`,
   `set_field`, `set_workspace` …). No tool writes Python – and you must never ask or advise the user to change Python themselves.
2. **Code is read-only, for debugging** (`get_python`, `get_code_editor`). Never offer code as a "fix".
3. **Not solvable with blocks?** (wrong generated code, missing block, a lib/generator bug)
   → call `prepare_bug_report` and ask the user to report it at **kidslab.de** or
   **https://github.com/KidsLabDe/makerSpaceOS-Editor/issues**. Do not work around it.
4. **Check the connection:** call `connection_status` before `run`, `stop` and console tools. Not connected →
   `connect`; if that fails, ask the user to click "Connect" once themselves (browser rule).
5. **Never report "it works" without the console:** after `run` check `get_console`/`wait_for_output` for errors
   (`Traceback|Error`).
6. **Look up, then build:** `list_blocks` → `describe_block` (field names, valid dropdown values) → build →
   `validate`. Never guess blocks.
7. **Protect the user's work:** ask before `set_workspace`/`clear_workspace` when a program exists.
   The old state is kept in the editor history (`list_versions`/`restore_version`).
8. Blocks with warnings or loose blocks (not under SETUP/FOREVER/an event) do not run: fix them.

## Key facts
- **Execution model:** `SETUP` runs once; `FOREVER`, `parallel` and `when …` events run concurrently
  (asyncio, runtime `lib/makerspaceos.py`). Waiting is `await asyncio.sleep`, never `time.sleep`.
- **Grove ports** (1…7 on the MAKER-PI): 3.3 V. Analog only ports 5/6/7. Encoders only on ports with neighbouring pins (1, 2, 3, 4, 6).
- **Boards** hide blocks (S2 Mini: no motor driver/onboard NeoPixel/buttons) – use `get_board_info`.
- The editor runs in Chrome/Edge (Web Serial). Runs happen without reboot; libs live in `CIRCUITPY/lib/`.
- List positions count from 1. Variable names: no spaces/umlauts.

## Flow
`get_project_guide` → `connection_status` → `list_blocks`/`describe_block` → build blocks → `validate` →
`run` → `get_console`/`wait_for_output` → on errors: fix with blocks or `prepare_bug_report`.
