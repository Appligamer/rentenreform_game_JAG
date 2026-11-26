#!/bin/bash
# ==============================================================================
# GENERATION ZUKUNFT — APPLE macOS UNIVERSAL LAUNCHER (.command)
# Hält den Server-Prozess aktiv im Vordergrund (kein vorzeitiges Beenden).
# ==============================================================================

set -u
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

# Homebrew (Apple Silicon & Intel), NVM, Volta, fnm & Flutter in PATH aufnehmen
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
[ -d "$HOME/.volta/bin" ] && export PATH="$HOME/.volta/bin:$PATH"
[ -d "$HOME/flutter/bin" ] && export PATH="$HOME/flutter/bin:$PATH"
[ -d "/opt/homebrew/Caskroom/flutter/latest/flutter/bin" ] && export PATH="/opt/homebrew/Caskroom/flutter/latest/flutter/bin:$PATH"
if [ -d "$HOME/.nvm/versions/node" ]; then
    LATEST_NVM_NODE="$(ls -d "$HOME/.nvm/versions/node/"*/bin 2>/dev/null | sort -V | tail -n 1 || true)"
    [ -n "${LATEST_NVM_NODE:-}" ] && export PATH="$LATEST_NVM_NODE:$PATH"
fi

WATCHER_PID=""
cleanup() {
    if [ -n "${WATCHER_PID:-}" ] && kill -0 "$WATCHER_PID" 2>/dev/null; then
        kill "$WATCHER_PID" 2>/dev/null || true
    fi
}
trap cleanup EXIT INT TERM

echo "====================================================================="
echo "   GENERATION ZUKUNFT — DIE RENTEN-SIMULATION (ECONO=ME)"
echo "   Apple macOS Universal Launcher"
echo "====================================================================="
echo ""

# 1. Natives macOS App-Bundle oder Xcode-Projekt (einmalig) öffnen
echo "[1/3] Prüfe natives macOS-Projekt..."
NATIVE_APP=""
for candidate in \
    "build/macos/Build/Products/Release/Runner.app" \
    "build/Build/Products/Release/Runner.app" \
    "macos/build/Release/Runner.app"
do
    if [ -d "$candidate" ]; then
        NATIVE_APP="$candidate"
        break
    fi
done

if [ -n "$NATIVE_APP" ]; then
    echo "  -> Starte kompilierte macOS App: $NATIVE_APP"
    open "$NATIVE_APP"
elif [ -d "/Applications/Xcode.app" ] && [ -d "macos/Runner.xcodeproj" ]; then
    echo "  -> Öffne macos/Runner.xcodeproj in Xcode (Cmd+R für natives macOS-Fenster)..."
    open "macos/Runner.xcodeproj"
else
    echo "  -> Xcode nicht gefunden (übersprungen, starte Game Engine direkt)."
fi

# 2. Game Engine direkt im Vordergrund starten (bleibt aktiv bis Ctrl+C / Schließen)
echo "[2/3] Prüfe Game Engine & Abhängigkeiten..."

# Falls bereits ein Server auf Port 3000 läuft, Browser öffnen und Fenster offen halten
if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 1 "http://127.0.0.1:3000" >/dev/null 2>&1; then
    echo "  -> Game Engine läuft bereits auf http://localhost:3000"
    echo "[3/3] Öffne Generation Zukunft im Browser..."
    open "http://localhost:3000"
    echo ""
    echo "[OK] Server ist aktiv. Dieses Fenster überwacht Port 3000 (Ctrl+C zum Schließen)..."
    while curl -fsS --max-time 1 "http://127.0.0.1:3000" >/dev/null 2>&1; do
        sleep 2
    done
    read -r -p "Server wurde beendet. Drücke Enter zum Schließen..."
    exit 0
fi

if command -v npm >/dev/null 2>&1 && [ -f "package.json" ]; then
    if [ ! -x "node_modules/.bin/vite" ]; then
        echo "  -> Erststart: Installiere lokale Pakete (npm install)..."
        if ! npm install --no-audit --no-fund; then
            echo "  [WARNUNG] npm install fehlgeschlagen — wechsle auf Offline-WebBundle."
        fi
    fi

    if [ -x "node_modules/.bin/vite" ]; then
        echo "[3/3] Starte Vite Game Engine im Vordergrund (http://localhost:3000)..."
        echo "  Hinweis: Dieses Terminal-Fenster geöffnet lassen, solange du spielst (Ctrl+C zum Beenden)."
        echo ""

        MAIN_PID=$$
        (
            for _ in $(seq 1 60); do
                if ! kill -0 "$MAIN_PID" 2>/dev/null; then
                    exit 0
                fi
                if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 1 "http://127.0.0.1:3000" >/dev/null 2>&1; then
                    open "http://localhost:3000"
                    exit 0
                fi
                sleep 0.5
            done
        ) &
        WATCHER_PID=$!

        # Im Vordergrund ausführen -> Prozess bleibt dauerhaft am Leben!
        npm run dev
        DEV_EXIT=$?
        cleanup
        echo ""
        echo "[INFO] Vite-Server beendet (Exit-Code: $DEV_EXIT)."
        if [ "$DEV_EXIT" -eq 0 ] || [ "$DEV_EXIT" -eq 130 ]; then
            read -r -p "Drücke Enter zum Schließen..."
            exit "$DEV_EXIT"
        fi
        echo "  -> Wechsle automatisch auf Offline-WebBundle..."
    fi
fi

# Fallback: Eingebautes Offline-WebBundle über lokalen HTTP-Server im Vordergrund
WEB_DIR=""
for candidate in \
    "dist" \
    "macos/Runner/WebBundle" \
    "ios/Runner/WebBundle"
do
    if [ -f "$candidate/index.html" ]; then
        WEB_DIR="$candidate"
        break
    fi
done

if [ -n "$WEB_DIR" ] && command -v python3 >/dev/null 2>&1; then
    PORT="$(python3 -c '
import socket
for p in range(41735, 41760):
    with socket.socket() as s:
        if s.connect_ex(("127.0.0.1", p)) != 0:
            print(p)
            break
' 2>/dev/null || echo 41735)"

    echo "[3/3] Starte Offline-WebBundle ($WEB_DIR) im Vordergrund auf http://127.0.0.1:$PORT ..."
    echo "  Hinweis: Dieses Terminal-Fenster geöffnet lassen, solange du spielst (Ctrl+C zum Beenden)."
    echo ""

    MAIN_PID=$$
    (
        for _ in $(seq 1 40); do
            if ! kill -0 "$MAIN_PID" 2>/dev/null; then
                exit 0
            fi
            if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 1 "http://127.0.0.1:$PORT/index.html" >/dev/null 2>&1; then
                open "http://127.0.0.1:$PORT/index.html"
                exit 0
            fi
            sleep 0.25
        done
        open "http://127.0.0.1:$PORT/index.html" 2>/dev/null || true
    ) &
    WATCHER_PID=$!

    # Im Vordergrund ausführen -> Prozess bleibt dauerhaft am Leben!
    python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$WEB_DIR"
    PY_EXIT=$?
    cleanup
    echo ""
    read -r -p "Offline-Server beendet (Exit-Code: $PY_EXIT). Drücke Enter zum Schließen..."
    exit "$PY_EXIT"
fi

echo ""
echo "[FEHLER] Konnte weder Vite (npm) noch das Offline-WebBundle starten."
echo "Tipp: Installiere Node.js (https://nodejs.org) oder öffne macos/Runner.xcodeproj in Xcode."
read -r -p "Drücke Enter zum Schließen..."
exit 1
