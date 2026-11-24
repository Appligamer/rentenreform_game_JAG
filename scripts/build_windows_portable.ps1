<#
.SYNOPSIS
Erzeugt ein versandfertiges Windows-Paket (Portable ZIP + Inno Setup .iss / Setup.exe) fuer Generation Zukunft.
#>
$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $PSScriptRoot
$FlutterDir = Join-Path $RootDir "pension_game_simulation"
$OutDir = Join-Path $RootDir "dist_windows"
$BundleDir = Join-Path $OutDir "GenerationZukunft_Windows"

Write-Host "=== Generation Zukunft: Windows Packaging ===" -ForegroundColor Yellow
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
    $TargetAssets = Join-Path $TargetWeb "assets"
    New-Item -ItemType Directory -Path $TargetAssets -Force | Out-Null
    Copy-Item -Path (Join-Path $WebSource "index.html") -Destination $TargetWeb -Force
    $SourceAssets = Join-Path $WebSource "assets"
    if (Test-Path $SourceAssets) {
        Get-ChildItem -Path $SourceAssets -File | Copy-Item -Destination $TargetAssets -Force
    }
    Copy-Item -Path (Join-Path $RootDir "start_game_windows.bat") -Destination $BundleDir -Force
    Copy-Item -Path (Join-Path $RootDir "START_GAME_WINDOWS.exe") -Destination $BundleDir -Force
}

# 3. ZIP-Archiv zum direkten Versenden erzeugen
Write-Host "[2/3] Erstelle portables ZIP-Archiv..." -ForegroundColor Cyan
$ZipPath = Join-Path $OutDir "GenerationZukunft_Windows_Portable.zip"
Compress-Archive -Path (Join-Path $BundleDir "*") -DestinationPath $ZipPath -Force

# 4. Inno Setup (.iss) Skript erzeugen und falls ISCC.exe installiert ist direkt zu einer Setup.exe kompilieren
Write-Host "[3/3] Erzeuge Inno Setup Skript fuer Einzel-Installer (.exe)..." -ForegroundColor Cyan
$MainExe = if ($BuiltNative) { "GenerationZukunft.exe" } else { "START_GAME_WINDOWS.exe" }
$IssPath = Join-Path $OutDir "GenerationZukunft_Setup.iss"
$IconPath = Join-Path $RootDir "windows\runner\resources\app_icon.ico"
$IssContent = @"
[Setup]
AppName=Generation Zukunft - Renten-Simulation
AppVersion=1.0.0
AppPublisher=Jacob Glathe & Team (econo=me)
DefaultDirName={autopf}\GenerationZukunft
DefaultGroupName=Generation Zukunft
OutputDir=$OutDir
OutputBaseFilename=GenerationZukunft_Windows_Setup
SetupIconFile=$IconPath
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest

[Files]
Source: "$BundleDir\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\Generation Zukunft"; Filename: "{app}\$MainExe"
Name: "{autodesktop}\Generation Zukunft"; Filename: "{app}\$MainExe"

[Run]
Filename: "{app}\$MainExe"; Description: "Generation Zukunft jetzt starten"; Flags: nowait postinstall skipifsilent
"@
Set-Content -Path $IssPath -Value $IssContent -Encoding UTF8

$IsccCandidates = @(
    "ISCC.exe",
    "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe",
    "$env:ProgramFiles\Inno Setup 6\ISCC.exe"
)
$Iscc = $IsccCandidates | Where-Object { Get-Command $_ -ErrorAction SilentlyContinue } | Select-Object -First 1
$SetupExePath = Join-Path $OutDir "GenerationZukunft_Windows_Setup.exe"
if ($Iscc) {
    Write-Host "      Inno Setup gefunden -> kompiliere $SetupExePath ..." -ForegroundColor Cyan
    & $Iscc $IssPath
}

Write-Host ""
Write-Host "FERTIG!" -ForegroundColor Green
Write-Host "Ordner zum Testen:      $BundleDir"
Write-Host "ZIP zum Versenden:      $ZipPath"
Write-Host "Inno Setup Skript:      $IssPath"
if (Test-Path $SetupExePath) {
    Write-Host "Einzelne Setup-EXE:     $SetupExePath" -ForegroundColor Green
} else {
    Write-Host "Tipp fuer 1-Datei-EXE:  Oeffne $IssPath in Inno Setup und druecke Ctrl+F9." -ForegroundColor Gray
}
