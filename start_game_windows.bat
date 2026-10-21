@echo off
title Generation Zukunft - Renten-Simulation (econo=me)
cls
echo =====================================================================
echo    GENERATION ZUKUNFT - DIE RENTEN-SIMULATION (ECONO=ME)
echo    Windows Launcher
echo =====================================================================
echo.

:: 1. Pruefen ob Flutter installiert ist
where flutter >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Flutter SDK gefunden.
    echo Starte native Windows Desktop App...
    echo.
    flutter run -d windows
    goto end
)

:: 2. Pruefen ob Node.js / NPM installiert ist
where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Starte Spiel-Engine ueber Desktop Web-App...
    echo.
    start "" npm run dev
    timeout /t 3 /nobreak >nul
    start http://localhost:3000
    goto end
)

:: 3. Fallback: Edge App-Modus (verhaelt sich wie eine native Windows .exe)
echo [INFO] Starte im Windows App-Modus...
start msedge --app=http://localhost:3000

:end
pause
