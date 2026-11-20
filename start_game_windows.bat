@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
title Generation Zukunft - Renten-Simulation (econo=me)

:: 1. Falls bereits nativ kompilierte Release-EXE existiert -> direkt starten
if exist "pension_game_simulation.exe" (
    start "" "pension_game_simulation.exe"
    exit /b 0
)
if exist "pension_game_simulation\build\windows\x64\runner\Release\pension_game_simulation.exe" (
    start "" "pension_game_simulation\build\windows\x64\runner\Release\pension_game_simulation.exe"
    exit /b 0
)
if exist "Release\pension_game_simulation.exe" (
    start "" "Release\pension_game_simulation.exe"
    exit /b 0
)

:: 2. Offline Standalone-Modus ueber eingebettetes WebBundle (benoetigt KEIN Node.js oder Flutter)
set "WEB_DIR="
if exist "WebBundle\index.html" set "WEB_DIR=%CD%\WebBundle"
if not defined WEB_DIR if exist "dist\index.html" set "WEB_DIR=%CD%\dist"
if not defined WEB_DIR if exist "macos\Runner\WebBundle\index.html" set "WEB_DIR=%CD%\macos\Runner\WebBundle"

if defined WEB_DIR (
    echo [OK] Offline-WebBundle gefunden: !WEB_DIR!
    echo Starte lokales Desktop-Fenster im Edge App-Modus...
    powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -Command ^
      "$root = '!WEB_DIR!';" ^
      "$listener = New-Object System.Net.HttpListener;" ^
      "$listener.Prefixes.Add('http://127.0.0.1:4173/');" ^
      "$listener.Start();" ^
      "Start-Process 'msedge.exe' -ArgumentList '--app=http://127.0.0.1:4173/index.html','--window-size=1280,840';" ^
      "$mime = @{'.html'='text/html; charset=utf-8';'.js'='application/javascript; charset=utf-8';'.css'='text/css; charset=utf-8';'.png'='image/png';'.svg'='image/svg+xml';'.json'='application/json'};" ^
      "$idleDeadline = (Get-Date).AddMinutes(180);" ^
      "while ($listener.IsListening -and (Get-Date) -lt $idleDeadline) {" ^
      "  $ctx = $listener.GetContext();" ^
      "  $reqPath = $ctx.Request.Url.AbsolutePath.TrimStart('/');" ^
      "  if ([string]::IsNullOrEmpty($reqPath)) { $reqPath = 'index.html' };" ^
      "  $file = Join-Path $root $reqPath;" ^
      "  if (-not (Test-Path $file -PathType Leaf)) { $file = Join-Path $root 'index.html' };" ^
      "  $ext = [System.IO.Path]::GetExtension($file).ToLower();" ^
      "  $ctx.Response.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' };" ^
      "  $bytes = [System.IO.File]::ReadAllBytes($file);" ^
      "  $ctx.Response.ContentLength64 = $bytes.Length;" ^
      "  $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length);" ^
      "  $ctx.Response.Close();" ^
      "}"
    exit /b 0
)

:: 3. Entwickler-Modus (Flutter oder Node.js)
where flutter >nul 2>nul
if %errorlevel% equ 0 (
    if exist "pension_game_simulation\pubspec.yaml" (
        cd /d "pension_game_simulation"
        flutter run -d windows
        exit /b 0
    )
)

where npm >nul 2>nul
if %errorlevel% equ 0 (
    start "" npm run dev
    timeout /t 3 /nobreak >nul
    start "" msedge --app=http://localhost:3000
    exit /b 0
)

echo [FEHLER] Weder Release-EXE, WebBundle noch Flutter/Node gefunden.
pause
