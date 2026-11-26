#!/bin/bash
# ==============================================================================
# GENERATION ZUKUNFT — APPLE iOS / iPadOS STARTER (.command)
# Startet die App automatisch im iOS Simulator oder öffnet ios/Runner.xcodeproj.
# ==============================================================================

set -u
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

echo "====================================================================="
echo "   GENERATION ZUKUNFT — iOS & iPadOS (econo=me)"
echo "   Apple iOS / Simulator Launcher"
echo "====================================================================="
echo ""

if [ ! -d "ios/Runner.xcodeproj" ]; then
    echo "[FEHLER] ios/Runner.xcodeproj wurde nicht gefunden."
    read -r -p "Drücke Enter zum Schließen..."
    exit 1
fi

if [ ! -d "/Applications/Xcode.app" ]; then
    echo "[INFO] Xcode ist nicht installiert. Öffne Projektordner..."
    open "ios"
    read -r -p "Drücke Enter zum Schließen..."
    exit 0
fi

# 1. Xcode öffnen (für iPhone / iPad Deployment direkt bereit)
echo "[1/3] Öffne ios/Runner.xcodeproj in Xcode..."
open "ios/Runner.xcodeproj"

# 2. Verfügbaren iPhone/iPad Simulator suchen und automatisch bauen & starten
if command -v xcrun >/dev/null 2>&1 && command -v xcodebuild >/dev/null 2>&1; then
    SIM_UDID="$(xcrun simctl list devices available 'iPhone' 2>/dev/null | grep -E 'iPhone [0-9]+' | head -n 1 | sed -E 's/.*\(([0-9A-F-]+)\).*/\1/' || true)"
    if [ -n "$SIM_UDID" ]; then
        echo "[2/3] Starte iOS Simulator ($SIM_UDID) und kompiliere App..."
        open -a Simulator >/dev/null 2>&1 || true
        xcrun simctl boot "$SIM_UDID" >/dev/null 2>&1 || true

        if xcodebuild \
            -project ios/Runner.xcodeproj \
            -scheme Runner \
            -configuration Debug \
            -sdk iphonesimulator \
            -destination "id=$SIM_UDID" \
            -derivedDataPath build/ios-derived \
            CODE_SIGN_IDENTITY="" \
            CODE_SIGNING_REQUIRED=NO \
            CODE_SIGNING_ALLOWED=NO \
            build; then
            APP_PATH="$(find build/ios-derived/Build/Products/Debug-iphonesimulator -maxdepth 1 -name '*.app' | head -n 1 || true)"
            if [ -n "$APP_PATH" ] && [ -d "$APP_PATH" ]; then
                echo "[3/3] Installiere & starte Generation Zukunft im iOS Simulator..."
                xcrun simctl install "$SIM_UDID" "$APP_PATH"
                xcrun simctl launch "$SIM_UDID" com.appligamer.rentenreformGameJAG.ios
                echo ""
                echo "[OK] Generation Zukunft läuft im iOS Simulator!"
                read -r -p "Drücke Enter zum Schließen..."
                exit 0
            fi
        fi
        echo "  [INFO] Simulator-Build übersprungen — starte in Xcode mit Cmd+R."
    else
        echo "[INFO] Kein iPhone-Simulator gefunden. Bitte iOS Simulator in Xcode installieren."
    fi
fi

echo ""
echo "[OK] ios/Runner.xcodeproj wurde geöffnet. Wähle iPhone/iPad oder Simulator und drücke Cmd+R."
read -r -p "Drücke Enter zum Schließen..."
exit 0
