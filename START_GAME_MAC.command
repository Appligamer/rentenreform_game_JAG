#!/bin/bash
# ==============================================================================
# GENERATION ZUKUNFT — APPLE macOS UNIVERSAL LAUNCHER (.command)
# Doppelklickbar im macOS Finder | Funktioniert Online (Vite) & Offline (WebBundle)
# ==============================================================================

set -u
cd "$(dirname "$0")" || exit 1

# Homebrew (Apple Silicon & Intel), NVM, Volta, fnm & Flutter in PATH aufnehmen
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
[ -d "$HOME/.volta/bin" ] && export PATH="$HOME/.volta/bin:$PATH"
[ -d "$HOME/flutter/bin" ] && export PATH="$HOME/flutter/bin:$PATH"
[ -d "/opt/homebrew/Caskroom/flutter/latest/flutter/bin" ] && export PATH="/opt/homebrew/Caskroom/flutter/latest/flutter/bin:$PATH"
if [ -d "$HOME/.nvm/versions/node" ]; then
    LATEST_NVM_NODE="$(ls -d "$HOME/.nvm/versions/node/"*/bin 2>/dev/null | sort -V | tail -n 1 || true)"
    [ -n "${LATEST_NVM_NODE:-}" ] && export PATH="$LATEST_NVM_NODE:$PATH"
fi

echo "====================================================================="
echo "   GENERATION ZUKUNFT — DIE RENTEN-SIMULATION (ECONO=ME)"
echo "   Apple macOS Universal Launcher"
echo "====================================================================="
echo ""

# 1. Selbstheilung: Fehlende Xcode-Runner-Dateien nur bei Bedarf ergänzen
REPAIRED=0
if [ ! -f "macos/Runner/AppDelegate.swift" ] || [ ! -f "macos/Runner/Info.plist" ]; then
    if [ -f "pension_game_simulation/macos/Runner/AppDelegate.swift" ]; then
        echo "[INFO] Fehlende macOS Runner Dateien werden synchronisiert..."
        mkdir -p macos
        cp -r pension_game_simulation/macos/* macos/ 2>/dev/null || true
        REPAIRED=1
    fi
fi

# 2. Natives macOS App-Bundle oder Xcode-Projekt (einmalig) öffnen
echo "[1/3] Prüfe natives macOS-Projekt..."
NATIVE_APP=""
for candidate in \
    "build/Build/Products/Release/Runner.app" \
    "macos/build/Release/Runner.app" \
    "pension_game_simulation/build/macos/Build/Products/Release/Runner.app"
do
    if [ -d "$candidate" ]; then
        NATIVE_APP="$candidate"
        break
    fi
done

if [ -n "$NATIVE_APP" ]; then
    echo "  -> Starte kompilierte macOS App: $NATIVE_APP"
    open "$NATIVE_APP"
elif [ -d "/Applications/Xcode.app" ]; then
    if [ -d "macos/Runner.xcodeproj" ]; then
        echo "  -> Öffne macos/Runner.xcodeproj in Xcode (Cmd+R für natives macOS-Fenster)..."
        open "macos/Runner.xcodeproj"
    elif [ -d "pension_game_simulation/macos/Runner.xcodeproj" ]; then
        echo "  -> Öffne pension_game_simulation/macos/Runner.xcodeproj in Xcode..."
        open "pension_game_simulation/macos/Runner.xcodeproj"
    fi
else
    echo "  -> Xcode nicht gefunden (übersprungen, starte Game Engine direkt)."
fi

# 3. Game Engine starten (bevorzugt Vite Dev-Server mit Auto-Install, sonst Offline-WebBundle)
echo "[2/3] Prüfe Game Engine & Abhängigkeiten..."

SERVER_PID=""
cleanup() {
    if [ -n "${SERVER_PID:-}" ] && kill -0 "$SERVER_PID" 2>/dev/null; then
        kill "$SERVER_PID" 2>/dev/null || true
    fi
}
trap cleanup EXIT INT TERM

# Falls bereits ein Server auf Port 3000 läuft, direkt öffnen
if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 1 "http://127.0.0.1:3000" >/dev/null 2>&1; then
    echo "  -> Game Engine läuft bereits auf http://localhost:3000"
    echo "[3/3] Öffne Generation Zukunft im Browser..."
    open "http://localhost:3000"
    exit 0
fi

STARTED_DEV=0
if command -v npm >/dev/null 2>&1 && [ -f "package.json" ]; then
    if [ ! -x "node_modules/.bin/vite" ]; then
        echo "  -> Erststart: Installiere lokale Pakete (npm install)..."
        if ! npm install --no-audit --no-fund; then
            echo "  [WARNUNG] npm install fehlgeschlagen — wechsle auf Offline-WebBundle."
        fi
    fi

    if [ -x "node_modules/.bin/vite" ]; then
        echo "  -> Starte Vite Game Engine auf http://localhost:3000 ..."
        LOG_FILE="/tmp/gz_vite_$$.log"
        npm run dev > "$LOG_FILE" 2>&1 &
        SERVER_PID=$!

        READY=0
        for _ in $(seq 1 40); do
            if ! kill -0 "$SERVER_PID" 2>/dev/null; then
                break
            fi
            if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 1 "http://127.0.0.1:3000" >/dev/null 2>&1; then
                READY=1
                break
            fi
            sleep 0.5
        done

        if [ "$READY" -eq 1 ]; then
            STARTED_DEV=1
            echo "[3/3] Öffne Generation Zukunft im Browser (http://localhost:3000)..."
            open "http://localhost:3000"
            echo ""
            echo "====================================================================="
            echo "  [OK] Generation Zukunft läuft! (Ctrl+C zum Beenden)"
            echo "  Dieses Terminal-Fenster während des Spielens geöffnet lassen."
            echo "====================================================================="
            wait "$SERVER_PID"
            exit 0
        else
            echo "  [WARNUNG] Vite-Server konnte nicht rechtzeitig gestartet werden:"
            tail -n 10 "$LOG_FILE" 2>/dev/null || true
            kill "$SERVER_PID" 2>/dev/null || true
            SERVER_PID=""
        fi
        rm -f "$LOG_FILE" 2>/dev/null || true
    fi
fi

# Fallback: Eingebautes Offline-WebBundle über lokalen HTTP-Server (benötigt kein npm/vite)
if [ "$STARTED_DEV" -eq 0 ]; then
    WEB_DIR=""
    for candidate in \
        "dist" \
        "macos/Runner/WebBundle" \
        "ios/Runner/WebBundle" \
        "pension_game_simulation/macos/Runner/WebBundle"
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
        echo "  -> Starte Offline-WebBundle ($WEB_DIR) auf http://127.0.0.1:$PORT ..."
        python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$WEB_DIR" >/dev/null 2>&1 &
        SERVER_PID=$!

        for _ in $(seq 1 20); do
            if ! kill -0 "$SERVER_PID" 2>/dev/null; then
                break
            fi
            if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 1 "http://127.0.0.1:$PORT/index.html" >/dev/null 2>&1; then
                break
            fi
            sleep 0.25
        done

        echo "[3/3] Öffne Generation Zukunft (Offline-Modus) im Browser..."
        open "http://127.0.0.1:$PORT/index.html"
        echo ""
        echo "====================================================================="
        echo "  [OK] Generation Zukunft läuft im Offline-Modus! (Ctrl+C zum Beenden)"
        echo "  Dieses Terminal-Fenster während des Spielens geöffnet lassen."
        echo "====================================================================="
        wait "$SERVER_PID"
        exit 0
    fi
fi

if [ "$REPAIRED" -eq 1 ]; then
    echo ""
    echo "[TIPP] Um reparierte Xcode-Dateien in GitHub zu sichern:"
    echo "git add . && git commit -m 'Fix Xcode Runner files' && git push"
fi

echo ""
echo "[FEHLER] Konnte weder Vite (npm) noch das Offline-WebBundle starten."
echo "Tipp: Installiere Node.js (https://nodejs.org) oder öffne macos/Runner.xcodeproj in Xcode."
read -r -p "Drücke Enter zum Schließen..."
exit 1
