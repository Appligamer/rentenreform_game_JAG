#!/bin/bash
# ==============================================================================
# GENERATION ZUKUNFT — APPLE macOS LAUNCHER (.command)
# Doppelklickbar im macOS Finder
# ==============================================================================

cd "$(dirname "$0")" || exit 1

echo "====================================================================="
echo "   GENERATION ZUKUNFT — DIE RENTEN-SIMULATION (ECONO=ME)"
echo "   Apple macOS Universal Launcher"
echo "====================================================================="
echo ""

# 1. Selbstheilung: Fehlende Dateien wiederherstellen, falls frisch geklont
if [ ! -f "macos/Runner/AppDelegate.swift" ] || [ ! -f "macos/Runner/Info.plist" ]; then
    echo "[INFO] Fehlende macOS Runner Dateien werden automatisch synchronisiert..."
    if [ -f "pension_game_simulation/macos/Runner/AppDelegate.swift" ]; then
        mkdir -p macos
        cp -r pension_game_simulation/macos/* macos/ 2>/dev/null
    fi
    # Falls online, Tarball beziehen
    curl -fsSL "https://ais-dev-6rd3ufs7e3xca5ruygcd56-729708878252.europe-west2.run.app/download/macos_full_fix.tar.gz" 2>/dev/null | tar -xz 2>/dev/null
fi

echo "[1/3] Prüfe macOS Application Bundle..."
if [ -d "GenerationZukunft.app" ]; then
    chmod +x GenerationZukunft.app/Contents/MacOS/GenerationZukunft 2>/dev/null
    echo "  -> Starte GenerationZukunft.app..."
    open "GenerationZukunft.app"
fi

echo "[2/3] Prüfe Apple Xcode Runner Projekt..."
if [ -d "macos/Runner.xcodeproj" ]; then
    echo "  -> Öffne macos/Runner.xcodeproj in Xcode..."
    open macos/Runner.xcodeproj
elif [ -d "pension_game_simulation/macos/Runner.xcodeproj" ]; then
    echo "  -> Öffne pension_game_simulation/macos/Runner.xcodeproj in Xcode..."
    open pension_game_simulation/macos/Runner.xcodeproj
fi

echo "[3/3] Starte interaktive Game Engine (Vite/TypeScript)..."
if command -v npm &> /dev/null; then
    npm run dev &
    sleep 2
    open "http://localhost:3000"
elif [ -f "dist/index.html" ]; then
    open dist/index.html
fi

echo ""
echo "[TIPP] Um diese Reparatur dauerhaft in GitHub zu sichern, führe aus:"
echo "git add . && git commit -m 'Fix Xcode Runner files' && git push"
echo ""
