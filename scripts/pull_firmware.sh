#!/usr/bin/env bash
# pull_firmware.sh – zieht das komplette Firmware-Image (gesamten Flash)
# eines angeschlossenen RP2040 mit picotool und legt es in firmware/ ab.
#
# Das Board MUSS im BOOTSEL-Modus sein:
#   - MAKER-PI-RP2040: USB anschließen und dabei DOPPELT RESETTEN
#     (zwei schnelle Resets) → das Volume „RP2040 BOOT“ erscheint.
#   - Alternativ: BOOTSEL-Taster gedrückt halten, während USB verbunden wird.
#
# Aufruf:
#   scripts/pull_firmware.sh
#   scripts/pull_firmware.sh /pfad/zu/ziel.bin     # eigenes Ziel-Datei
#
# Ohne BOOTSEL-Gerät beendet das Skript mit einer Anleitung.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FIRMWARE_DIR="$REPO_ROOT/firmware"
TS="$(date +%Y%m%d_%H%M%S)"
OUT="${1:-$FIRMWARE_DIR/makerSpaceOS_firmware_rp2040_$TS.uf2}"

if ! command -v picotool >/dev/null 2>&1; then
  echo "Fehler: picotool ist nicht installiert."
  echo "  Installation:  pip install picotool   (bzw. pipx install picotool)"
  exit 1
fi

# Gibt es ein Gerät im BOOTSEL-Modus? (picotool liefert sonst Exit-Code 249)
if ! picotool info >/dev/null 2>&1; then
  echo "Kein RP2040 im BOOTSEL-Modus gefunden."
  echo
  echo "So kommst du in den BOOTSEL-Modus:"
  echo "  1. Board per USB verbinden."
  echo "  2. Dabei DOPPELT RESETTEN (zwei schnelle Resets), oder"
  echo "     den BOOTSEL-Taster gedrückt halten, während USB verbunden wird."
  echo "  3. Das USB-Volume „RP2040 BOOT“ muss erscheinen."
  echo "  4. Dieses Skript erneut ausführen."
  exit 1
fi

mkdir -p "$(dirname "$OUT")"
echo "Gerät im BOOTSEL-Modus gefunden – ziehe kompletten Flash …"
picotool save -a "$OUT"

echo
echo "✓ Firmware abgelegt: $OUT"
echo
echo "Details:"
picotool info "$OUT" || true
