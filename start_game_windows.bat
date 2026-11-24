@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
title Generation Zukunft - Renten-Simulation (econo=me)

:: 1. Falls bereits nativ kompilierte Release-EXE existiert -> direkt starten
if exist "GenerationZukunft.exe" (
    start "" "GenerationZukunft.exe"
    exit /b 0
)
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
if not defined WEB_DIR if exist "ios\Runner\WebBundle\index.html" set "WEB_DIR=%CD%\ios\Runner\WebBundle"

if defined WEB_DIR (
    echo [OK] Offline-WebBundle gefunden: !WEB_DIR!
    echo Starte lokales Desktop-Fenster...
    powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -Command ^
      "$root = '!WEB_DIR!';" ^
      "$listener = $null; $port = 4173;" ^
      "foreach ($p in 4173..4190) {" ^
      "  try {" ^
      "    $l = New-Object System.Net.HttpListener;" ^
      "    $l.Prefixes.Add(('http://127.0.0.1:{0}/' -f $p));" ^
      "    $l.Start(); $listener = $l; $port = $p; break" ^
      "  } catch {}" ^
      "}" ^
      "if (-not $listener) { exit 1 };" ^
      "$url = 'http://127.0.0.1:' + $port + '/index.html';" ^
      "$edgeCandidates = @('msedge.exe', \"$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe\", \"${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe\");" ^
      "$edge = $edgeCandidates | Where-Object { Get-Command $_ -ErrorAction SilentlyContinue } | Select-Object -First 1;" ^
      "if ($edge) { Start-Process $edge -ArgumentList ('--app=' + $url), '--window-size=1280,840' }" ^
      "elseif (Get-Command 'chrome.exe' -ErrorAction SilentlyContinue) { Start-Process 'chrome.exe' -ArgumentList ('--app=' + $url), '--window-size=1280,840' }" ^
      "else { Start-Process $url };" ^
      "$mime = @{'.html'='text/html; charset=utf-8';'.js'='application/javascript; charset=utf-8';'.mjs'='application/javascript; charset=utf-8';'.css'='text/css; charset=utf-8';'.png'='image/png';'.svg'='image/svg+xml';'.json'='application/json; charset=utf-8';'.woff2'='font/woff2'};" ^
      "$idleDeadline = (Get-Date).AddMinutes(180);" ^
      "$pending = $listener.GetContextAsync();" ^
      "while ($listener.IsListening -and (Get-Date) -lt $idleDeadline) {" ^
      "  if ($pending.Wait(1000)) {" ^
      "    $ctx = $pending.Result;" ^
      "    $pending = $listener.GetContextAsync();" ^
      "    $reqPath = $ctx.Request.Url.AbsolutePath.TrimStart('/');" ^
      "    if ([string]::IsNullOrEmpty($reqPath)) { $reqPath = 'index.html' };" ^
      "    $file = Join-Path $root ($reqPath -replace '/', '\');" ^
      "    if (-not (Test-Path $file -PathType Leaf)) { $file = Join-Path $root 'index.html' };" ^
      "    $ext = [System.IO.Path]::GetExtension($file).ToLower();" ^
      "    $ctx.Response.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' };" ^
      "    $bytes = [System.IO.File]::ReadAllBytes($file);" ^
      "    $ctx.Response.ContentLength64 = $bytes.Length;" ^
      "    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length);" ^
      "    $ctx.Response.Close();" ^
      "  }" ^
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
    start "" http://localhost:3000
    exit /b 0
)

echo [FEHLER] Weder Release-EXE, WebBundle noch Flutter/Node gefunden.
pause
