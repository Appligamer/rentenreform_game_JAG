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
if exist "build\windows\x64\runner\Release\pension_game_simulation.exe" (
    start "" "build\windows\x64\runner\Release\pension_game_simulation.exe"
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

if not defined WEB_DIR goto :try_dev

echo [OK] Offline-WebBundle gefunden: %WEB_DIR%
echo Starte lokales Desktop-Fenster...

set "PS_SCRIPT=%TEMP%\gz_launcher_%RANDOM%.ps1"
> "%PS_SCRIPT%" echo $root = $env:GZ_WEB_DIR
>> "%PS_SCRIPT%" echo $listener = $null
>> "%PS_SCRIPT%" echo $port = 41735
>> "%PS_SCRIPT%" echo foreach ($p in 41735..41750) {
>> "%PS_SCRIPT%" echo   try {
>> "%PS_SCRIPT%" echo     $l = New-Object System.Net.HttpListener
>> "%PS_SCRIPT%" echo     $l.Prefixes.Add("http://127.0.0.1:$p/")
>> "%PS_SCRIPT%" echo     $l.Start()
>> "%PS_SCRIPT%" echo     $listener = $l
>> "%PS_SCRIPT%" echo     $port = $p
>> "%PS_SCRIPT%" echo     break
>> "%PS_SCRIPT%" echo   } catch {}
>> "%PS_SCRIPT%" echo }
>> "%PS_SCRIPT%" echo if (-not $listener) { exit 1 }
>> "%PS_SCRIPT%" echo $url = "http://127.0.0.1:$port/index.html"
>> "%PS_SCRIPT%" echo $pf = [Environment]::GetFolderPath('ProgramFiles')
>> "%PS_SCRIPT%" echo $pf86 = [Environment]::GetFolderPath('ProgramFilesX86')
>> "%PS_SCRIPT%" echo $localApp = [Environment]::GetFolderPath('LocalApplicationData')
>> "%PS_SCRIPT%" echo $profileDir = Join-Path $localApp 'GenerationZukunft\BrowserProfile'
>> "%PS_SCRIPT%" echo New-Item -ItemType Directory -Path $profileDir -Force ^| Out-Null
>> "%PS_SCRIPT%" echo $browserCandidates = @(
>> "%PS_SCRIPT%" echo   (Join-Path $pf86 'Microsoft\Edge\Application\msedge.exe'),
>> "%PS_SCRIPT%" echo   (Join-Path $pf 'Microsoft\Edge\Application\msedge.exe'),
>> "%PS_SCRIPT%" echo   (Join-Path $localApp 'Microsoft\Edge\Application\msedge.exe'),
>> "%PS_SCRIPT%" echo   (Join-Path $pf 'Google\Chrome\Application\chrome.exe'),
>> "%PS_SCRIPT%" echo   (Join-Path $pf86 'Google\Chrome\Application\chrome.exe')
>> "%PS_SCRIPT%" echo )
>> "%PS_SCRIPT%" echo $browser = $browserCandidates ^| Where-Object { Test-Path $_ } ^| Select-Object -First 1
>> "%PS_SCRIPT%" echo $proc = $null
>> "%PS_SCRIPT%" echo if ($browser) {
>> "%PS_SCRIPT%" echo   $proc = Start-Process -FilePath $browser -ArgumentList "--app=$url", "--user-data-dir=$profileDir", '--window-size=1280,840', '--no-first-run' -PassThru
>> "%PS_SCRIPT%" echo } else {
>> "%PS_SCRIPT%" echo   Start-Process $url
>> "%PS_SCRIPT%" echo }
>> "%PS_SCRIPT%" echo $mime = @{'.html'='text/html; charset=utf-8';'.js'='application/javascript; charset=utf-8';'.mjs'='application/javascript; charset=utf-8';'.css'='text/css; charset=utf-8';'.png'='image/png';'.jpg'='image/jpeg';'.webp'='image/webp';'.svg'='image/svg+xml';'.json'='application/json; charset=utf-8';'.woff2'='font/woff2';'.ico'='image/x-icon'}
>> "%PS_SCRIPT%" echo $idleDeadline = (Get-Date).AddMinutes(180)
>> "%PS_SCRIPT%" echo $pending = $listener.GetContextAsync()
>> "%PS_SCRIPT%" echo while ($listener.IsListening -and (Get-Date) -lt $idleDeadline) {
>> "%PS_SCRIPT%" echo   if ($proc -and $proc.HasExited) { break }
>> "%PS_SCRIPT%" echo   if ($pending.Wait(500)) {
>> "%PS_SCRIPT%" echo     $ctx = $pending.Result
>> "%PS_SCRIPT%" echo     $pending = $listener.GetContextAsync()
>> "%PS_SCRIPT%" echo     $reqPath = $ctx.Request.Url.AbsolutePath.TrimStart('/')
>> "%PS_SCRIPT%" echo     if ([string]::IsNullOrEmpty($reqPath)) { $reqPath = 'index.html' }
>> "%PS_SCRIPT%" echo     $file = Join-Path $root ($reqPath -replace '/', '\')
>> "%PS_SCRIPT%" echo     if (-not (Test-Path $file -PathType Leaf)) {
>> "%PS_SCRIPT%" echo       if ($reqPath -like 'artworks/*') { $ctx.Response.StatusCode = 404; $ctx.Response.Close(); continue }
>> "%PS_SCRIPT%" echo       $file = Join-Path $root 'index.html'
>> "%PS_SCRIPT%" echo     }
>> "%PS_SCRIPT%" echo     $ext = [System.IO.Path]::GetExtension($file).ToLower()
>> "%PS_SCRIPT%" echo     $ctx.Response.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
>> "%PS_SCRIPT%" echo     $bytes = [System.IO.File]::ReadAllBytes($file)
>> "%PS_SCRIPT%" echo     $ctx.Response.ContentLength64 = $bytes.Length
>> "%PS_SCRIPT%" echo     $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
>> "%PS_SCRIPT%" echo     $ctx.Response.Close()
>> "%PS_SCRIPT%" echo   }
>> "%PS_SCRIPT%" echo }
>> "%PS_SCRIPT%" echo $listener.Stop()
>> "%PS_SCRIPT%" echo Remove-Item -Path $MyInvocation.MyCommand.Path -Force -ErrorAction SilentlyContinue

set "GZ_WEB_DIR=%WEB_DIR%"
start "" /min powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%PS_SCRIPT%"
exit /b 0

:try_dev
:: 3. Entwickler-Modus (Flutter oder Node.js)
where flutter >nul 2>nul
if %errorlevel% equ 0 if exist "pubspec.yaml" (
    flutter run -d windows
    exit /b 0
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

