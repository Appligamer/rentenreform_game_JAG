<#
.SYNOPSIS
Erzeugt ein versandfertiges Windows-Paket (einzelne EXE + ZIP) für Generation Zukunft.
#>
$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $PSScriptRoot
$FlutterDir = Join-Path $RootDir "pension_game_simulation"
$OutDir = Join-Path $RootDir "dist_windows"
$BundleDir = Join-Path $OutDir "GenerationZukunft_Windows"

Write-Host "=== Generation Zukunft: Windows Packaging ===" -ForegroundColor Amber
if (Test-Path $OutDir) { Remove-Item -Recurse -Force $OutDir }
New-Item -ItemType Directory -Path $BundleDir | Out-Null

$BuiltNative = $false

# 1. Bevorzugt: Echter nativer Flutter Windows Release-Build
if ((Get-Command flutter -ErrorAction SilentlyContinue) -and (Test-Path (Join-Path $FlutterDir "pubspec.yaml"))) {
    Write-Host "[1/3] Baue native Flutter Windows Release-App..." -ForegroundColor Cyan
    Push-Location $FlutterDir
    try {
        flutter config --enable-windows-desktop | Out-Null
        flutter pub get
        flutter build windows --release
        $ReleaseDir = Join-Path $FlutterDir "build\windows\x64\runner\Release"
        if (Test-Path (Join-Path $ReleaseDir "pension_game_simulation.exe")) {
            Copy-Item -Path (Join-Path $ReleaseDir "*") -Destination $BundleDir -Recurse -Force
            Rename-Item -Path (Join-Path $BundleDir "pension_game_simulation.exe") -NewName "GenerationZukunft.exe" -Force
            $BuiltNative = $true
        }
    } finally {
        Pop-Location
    }
}

# 2. Fallback: Offline Standalone WebBundle + Windows Starter (funktioniert auf jedem Windows 10/11 PC)
if (-not $BuiltNative) {
    Write-Host "[1/3] Flutter SDK nicht gefunden -> erstelle Offline-Portable-Paket mit WebBundle..." -ForegroundColor Yellow
    if ((Get-Command npm -ErrorAction SilentlyContinue) -and (Test-Path (Join-Path $RootDir "package.json"))) {
        Push-Location $RootDir
        try {
            npm run build
        } finally {
            Pop-Location
        }
    }
    $WebSource = Join-Path $RootDir "macos\Runner\WebBundle"
    if (Test-Path (Join-Path $RootDir "dist\index.html")) {
        $WebSource = Join-Path $RootDir "dist"
    }
    if (-not (Test-Path (Join-Path $WebSource "index.html"))) {
        throw "Kein WebBundle gefunden. Bitte zuerst 'npm run build' ausfuehren."
    }
    $TargetWeb = Join-Path $BundleDir "WebBundle"
    New-Item -ItemType Directory -Path $TargetWeb | Out-Null
    Copy-Item -Path (Join-Path $WebSource "index.html") -Destination $TargetWeb -Force
    if (Test-Path (Join-Path $WebSource "assets")) {
        Copy-Item -Path (Join-Path $WebSource "assets") -Destination $TargetWeb -Recurse -Force
    }
    Copy-Item -Path (Join-Path $RootDir "start_game_windows.bat") -Destination $BundleDir -Force
    Copy-Item -Path (Join-Path $RootDir "START_GAME_WINDOWS.exe") -Destination $BundleDir -Force
}

# 3. ZIP-Archiv zum direkten Versenden erzeugen
Write-Host "[2/3] Erstelle portables ZIP-Archiv..." -ForegroundColor Cyan
$ZipPath = Join-Path $OutDir "GenerationZukunft_Windows_Portable.zip"
Compress-Archive -Path (Join-Path $BundleDir "*") -DestinationPath $ZipPath -Force

# 4. Optionale Einzel-EXE ueber eingebautes Windows IExpress (nur bei WebBundle oder flachem Ordner)
$SedPath = Join-Path $OutDir "package.sed"
$TargetSingleExe = Join-Path $OutDir "GenerationZukunft_Setup_SingleFile.exe"
$LaunchCmd = if ($BuiltNative) { "GenerationZukunft.exe" } else { "cmd.exe /c start_game_windows.bat" }

if (Get-Command iexpress.exe -ErrorAction SilentlyContinue) {
    Write-Host "[3/3] Erzeuge einzelne selbstentpackende EXE via IExpress..." -ForegroundColor Cyan
    $AllFiles = Get-ChildItem -Path $BundleDir -File -Recurse
    $SourceFiles = ""
    $FileRefs = ""
    $Idx = 0
    foreach ($f in $AllFiles) {
        # IExpress entpackt flach in einen Temp-Ordner; bei nativem Build nur flache Dateien, fuer Unterordner ZIP nutzen
        if ($f.DirectoryName -eq $BundleDir) {
            $SourceFiles += "FILE$Idx=`"$($f.Name)`"`r`n"
            $FileRefs += "%FILE$Idx%=`r`n"
            $Idx++
        }
    }
    if ($Idx -gt 0 -and -not $BuiltNative) {
        Write-Host "Hinweis: Fuer Ordner mit Unterverzeichnissen (data/ oder WebBundle/assets/) ist die ZIP-Datei das zuverlaessigste Einzelpaket." -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "FERTIG!" -ForegroundColor Green
Write-Host "Ordner zum Testen:      $BundleDir"
Write-Host "ZIP zum Versenden:      $ZipPath"
