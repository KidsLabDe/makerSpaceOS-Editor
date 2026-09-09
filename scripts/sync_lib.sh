#!/usr/bin/env bash
# sync_lib.sh – kopiert die lib/-Dateien des Repos auf das Board (CIRCUITPY/lib/)
#
# Findet das CIRCUITPY-Volume automatisch:
#   macOS:  /Volumes/CIRCUITPY
#   Linux:  /run/media/<user>/CIRCUITPY oder /media/<user>/CIRCUITPY
# Bei mehreren Volumes wird nach dem richtigen gefragt.
#
# Wichtig: Nach dem Kopieren USB trennen und neu stecken – das Board
# merkt sich geladene Module im Speicher (sys.modules), neue Dateien
# werden ohne Neustart NICHT geladen.
#
# Aufruf:
#   scripts/sync_lib.sh
#
# Suchpfade überschreiben (notfalls):
#   SEARCH_ROOTS="/tmp/mein_mount" scripts/sync_lib.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LIB_SRC="$REPO_ROOT/lib"
SEARCH_ROOTS="${SEARCH_ROOTS:-/Volumes /run/media /media /mnt}"

if [ ! -d "$LIB_SRC" ]; then
  echo "Fehler: lib/-Ordner nicht gefunden: $LIB_SRC" >&2
  exit 1
fi

# ── CIRCUITPY-Volume suchen ─────────────────────────────────────────────────
MOUNTS=()
for root in $SEARCH_ROOTS; do
  [ -d "$root" ] || continue
  while IFS= read -r m; do
    MOUNTS+=("$m")
  done < <(find "$root" -maxdepth 3 -type d -name CIRCUITPY 2>/dev/null)
done

if [ ${#MOUNTS[@]} -eq 0 ]; then
  echo "Kein CIRCUITPY-Volume gefunden."
  echo "Ist das Board per USB angeschlossen und eingebunden?"
  echo "  macOS:  /Volumes/CIRCUITPY"
  echo "  Linux:  /run/media/<user>/CIRCUITPY (oder /media/<user>/CIRCUITPY)"
  exit 1
fi

MNT="${MOUNTS[0]}"
if [ ${#MOUNTS[@]} -gt 1 ]; then
  echo "Mehrere CIRCUITPY-Volumes gefunden:"
  i=1
  for m in "${MOUNTS[@]}"; do
    echo "  $i) $m"
    i=$((i + 1))
  done
  printf "Welches verwenden? [1] "
  read -r choice
  choice=${choice:-1}
  if ! [[ "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 1 ] || [ "$choice" -gt ${#MOUNTS[@]} ]; then
    echo "Fehler: ungültige Auswahl." >&2
    exit 1
  fi
  MNT="${MOUNTS[$((choice - 1))]}"
fi

echo "Ziel: $MNT"
mkdir -p "$MNT/lib"

# ── Kopieren (ohne __pycache__) ─────────────────────────────────────────────
if command -v rsync >/dev/null 2>&1; then
  rsync -a --exclude='__pycache__' "$LIB_SRC/" "$MNT/lib/"
else
  cp -R "$LIB_SRC/." "$MNT/lib/"
  rm -rf "$MNT/lib/__pycache__"
fi

count=$(find "$MNT/lib" -type f -not -path '*/__pycache__/*' | wc -l | tr -d ' ')
echo "✓ lib/ synchronisiert ($count Dateien auf dem Board)."
echo "→ Für neue/geänderte Libraries: USB des Boards trennen und neu stecken."
