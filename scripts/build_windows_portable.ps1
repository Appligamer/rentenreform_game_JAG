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

# 0. Optionale fertige Artworks aus dem eindeutigen Ordner artworks/ synchronisieren
$ArtworksDir = Join-Path $RootDir "artworks"
$FlutterImagesDir = Join-Path $FlutterDir "assets\images"
if (Test-Path $ArtworksDir) {
    Get-ChildItem -Path $ArtworksDir -Recurse -File | Where-Object {
        $_.Extension -match '^\.(png|jpg|jpeg|webp|svg)$'
    } | ForEach-Object {
        $rel = $_.FullName.Substring($ArtworksDir.Length).TrimStart('\', '/')
        $dest = Join-Path $FlutterImagesDir $rel
        $destParent = Split-Path -Parent $dest
        if (-not (Test-Path $destParent)) { New-Item -ItemType Directory -Path $destParent -Force | Out-Null }
        Copy-Item -Path $_.FullName -Destination $dest -Force
    }
}

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
    Write-Host "[1/4] Flutter SDK nicht gefunden -> erstelle Offline-Portable-Paket mit WebBundle..." -ForegroundColor Yellow
    if ((Get-Command npm -ErrorAction SilentlyContinue) -and (Test-Path (Join-Path $RootDir "package.json")) -and (Test-Path (Join-Path $RootDir "node_modules"))) {
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
    $SourceArtworks = Join-Path $WebSource "artworks"
    if (Test-Path $SourceArtworks) {
        Copy-Item -Path $SourceArtworks -Destination (Join-Path $TargetWeb "artworks") -Recurse -Force
    }
    # Zusaetzlich ggf. manuell abgelegte Bilder aus artworks/ direkt uebernehmen
    if (Test-Path $ArtworksDir) {
        Get-ChildItem -Path $ArtworksDir -Recurse -File | Where-Object {
            $_.Extension -match '^\.(png|jpg|jpeg|webp|svg)$'
        } | ForEach-Object {
            $rel = $_.FullName.Substring($ArtworksDir.Length).TrimStart('\', '/')
            $dest = Join-Path (Join-Path $TargetWeb "artworks") $rel
            $destParent = Split-Path -Parent $dest
            if (-not (Test-Path $destParent)) { New-Item -ItemType Directory -Path $destParent -Force | Out-Null }
            Copy-Item -Path $_.FullName -Destination $dest -Force
        }
    }
    Copy-Item -Path (Join-Path $RootDir "start_game_windows.bat") -Destination $BundleDir -Force
    Copy-Item -Path (Join-Path $RootDir "START_GAME_WINDOWS.exe") -Destination $BundleDir -Force
}

# 3. ZIP-Archiv zum direkten Versenden erzeugen
Write-Host "[2/4] Erstelle portables ZIP-Archiv..." -ForegroundColor Cyan
$ZipPath = Join-Path $OutDir "GenerationZukunft_Windows_Portable.zip"
Compress-Archive -Path (Join-Path $BundleDir "*") -DestinationPath $ZipPath -Force

# 4. EINE EINZIGE eigenstaendige .exe mit Windows-Bordmitteln (.NET csc.exe) erzeugen
$SingleExePath = Join-Path $OutDir "GenerationZukunft.exe"
$IconPath = Join-Path $RootDir "windows\runner\resources\app_icon.ico"
$CscCandidates = @(
    (Join-Path $env:WINDIR "Microsoft.NET\Framework64\v4.0.30319\csc.exe"),
    (Join-Path $env:WINDIR "Microsoft.NET\Framework\v4.0.30319\csc.exe")
)
$CscExe = $CscCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
$WebSourceForSingle = Join-Path $BundleDir "WebBundle"
if (-not (Test-Path (Join-Path $WebSourceForSingle "index.html"))) {
    if (Test-Path (Join-Path $RootDir "dist\index.html")) {
        $WebSourceForSingle = Join-Path $RootDir "dist"
    } elseif (Test-Path (Join-Path $RootDir "macos\Runner\WebBundle\index.html")) {
        $WebSourceForSingle = Join-Path $RootDir "macos\Runner\WebBundle"
    }
}

if ($CscExe -and (Test-Path (Join-Path $WebSourceForSingle "index.html"))) {
    Write-Host "[3/4] Erstelle eigenstaendige Einzel-EXE mit Windows-.NET-Compiler..." -ForegroundColor Cyan
    $EmbeddedZip = Join-Path $OutDir "WebBundle.zip"
    if (Test-Path $EmbeddedZip) { Remove-Item -Force $EmbeddedZip }
    Compress-Archive -Path (Join-Path $WebSourceForSingle "*") -DestinationPath $EmbeddedZip -Force

    $CsPath = Join-Path $OutDir "GenerationZukunftLauncher.cs"
    $CsCode = @'
using System;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Reflection;
using System.Threading;
using System.Windows.Forms;

namespace GenerationZukunftApp
{
    internal static class Program
    {
        private static string _webRoot;
        private static HttpListener _listener;

        [STAThread]
        private static void Main()
        {
            try
            {
                string localApp = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                string baseDir = Path.Combine(localApp, "GenerationZukunft");
                _webRoot = Path.Combine(baseDir, "AppFiles");
                string profileDir = Path.Combine(baseDir, "BrowserProfile");

                ExtractEmbeddedBundle(_webRoot);
                Directory.CreateDirectory(profileDir);

                int port = StartHttpServer();
                string url = string.Format("http://127.0.0.1:{0}/index.html", port);

                Thread serverThread = new Thread(ServeRequests);
                serverThread.IsBackground = true;
                serverThread.Start();

                string browser = FindAppBrowser();
                if (!string.IsNullOrEmpty(browser))
                {
                    ProcessStartInfo psi = new ProcessStartInfo();
                    psi.FileName = browser;
                    psi.Arguments = string.Format(
                        "--app={0} \"--user-data-dir={1}\" --window-size=1280,840 --no-first-run",
                        url,
                        profileDir
                    );
                    psi.UseShellExecute = false;
                    using (Process proc = Process.Start(psi))
                    {
                        if (proc != null)
                        {
                            proc.WaitForExit();
                        }
                    }
                }
                else
                {
                    Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
                    Thread.Sleep(TimeSpan.FromMinutes(180));
                }

                if (_listener != null && _listener.IsListening)
                {
                    _listener.Stop();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    "Fehler beim Starten von Generation Zukunft:\n\n" + ex.Message,
                    "Generation Zukunft",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error
                );
            }
        }

        private static void ExtractEmbeddedBundle(string targetDir)
        {
            Directory.CreateDirectory(targetDir);
            string fullTarget = Path.GetFullPath(targetDir);
            Assembly asm = Assembly.GetExecutingAssembly();
            using (Stream resStream = asm.GetManifestResourceStream("WebBundle.zip"))
            {
                if (resStream == null)
                {
                    throw new InvalidOperationException("Eingebettetes Spielpaket wurde nicht gefunden.");
                }
                using (ZipArchive archive = new ZipArchive(resStream, ZipArchiveMode.Read))
                {
                    foreach (ZipArchiveEntry entry in archive.Entries)
                    {
                        string relPath = entry.FullName.Replace('/', Path.DirectorySeparatorChar);
                        string destPath = Path.GetFullPath(Path.Combine(fullTarget, relPath));
                        if (!destPath.StartsWith(fullTarget, StringComparison.OrdinalIgnoreCase))
                        {
                            continue;
                        }
                        if (string.IsNullOrEmpty(entry.Name))
                        {
                            Directory.CreateDirectory(destPath);
                            continue;
                        }
                        string parent = Path.GetDirectoryName(destPath);
                        if (!string.IsNullOrEmpty(parent))
                        {
                            Directory.CreateDirectory(parent);
                        }
                        using (Stream inStream = entry.Open())
                        using (FileStream outStream = File.Create(destPath))
                        {
                            inStream.CopyTo(outStream);
                        }
                    }
                }
            }
        }

        private static int StartHttpServer()
        {
            for (int port = 41735; port <= 41760; port++)
            {
                try
                {
                    HttpListener listener = new HttpListener();
                    listener.Prefixes.Add(string.Format("http://127.0.0.1:{0}/", port));
                    listener.Start();
                    _listener = listener;
                    return port;
                }
                catch
                {
                }
            }
            throw new InvalidOperationException("Kein lokaler Port zwischen 41735 und 41760 verfuegbar.");
        }

        private static void ServeRequests()
        {
            string fullRoot = Path.GetFullPath(_webRoot);
            while (_listener != null && _listener.IsListening)
            {
                HttpListenerContext ctx = null;
                try
                {
                    ctx = _listener.GetContext();
                }
                catch
                {
                    break;
                }

                try
                {
                    string reqPath = ctx.Request.Url.AbsolutePath.TrimStart('/');
                    if (string.IsNullOrEmpty(reqPath))
                    {
                        reqPath = "index.html";
                    }
                    string rel = reqPath.Replace('/', Path.DirectorySeparatorChar);
                    string candidate = Path.GetFullPath(Path.Combine(fullRoot, rel));
                    if (!candidate.StartsWith(fullRoot, StringComparison.OrdinalIgnoreCase) || !File.Exists(candidate))
                    {
                        if (reqPath.StartsWith("artworks/", StringComparison.OrdinalIgnoreCase))
                        {
                            ctx.Response.StatusCode = 404;
                            ctx.Response.Close();
                            continue;
                        }
                        candidate = Path.Combine(fullRoot, "index.html");
                    }

                    ctx.Response.ContentType = GetMimeType(Path.GetExtension(candidate));
                    byte[] data = File.ReadAllBytes(candidate);
                    ctx.Response.ContentLength64 = data.Length;
                    ctx.Response.OutputStream.Write(data, 0, data.Length);
                    ctx.Response.Close();
                }
                catch
                {
                    try
                    {
                        if (ctx != null)
                        {
                            ctx.Response.Abort();
                        }
                    }
                    catch
                    {
                    }
                }
            }
        }

        private static string GetMimeType(string ext)
        {
            switch ((ext ?? "").ToLowerInvariant())
            {
                case ".html": return "text/html; charset=utf-8";
                case ".js":
                case ".mjs": return "application/javascript; charset=utf-8";
                case ".css": return "text/css; charset=utf-8";
                case ".png": return "image/png";
                case ".jpg":
                case ".jpeg": return "image/jpeg";
                case ".webp": return "image/webp";
                case ".svg": return "image/svg+xml";
                case ".json": return "application/json; charset=utf-8";
                case ".woff2": return "font/woff2";
                case ".ico": return "image/x-icon";
                default: return "application/octet-stream";
            }
        }

        private static string FindAppBrowser()
        {
            string pf = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles);
            string pf86 = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86);
            string local = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);

            string[] candidates = new string[]
            {
                Path.Combine(pf86, @"Microsoft\Edge\Application\msedge.exe"),
                Path.Combine(pf, @"Microsoft\Edge\Application\msedge.exe"),
                Path.Combine(local, @"Microsoft\Edge\Application\msedge.exe"),
                Path.Combine(pf, @"Google\Chrome\Application\chrome.exe"),
                Path.Combine(pf86, @"Google\Chrome\Application\chrome.exe"),
                Path.Combine(local, @"Google\Chrome\Application\chrome.exe")
            };

            foreach (string path in candidates)
            {
                if (!string.IsNullOrEmpty(path) && File.Exists(path))
                {
                    return path;
                }
            }
            return null;
        }
    }
}
'@
    Set-Content -Path $CsPath -Value $CsCode -Encoding UTF8

    $NetDir = Split-Path -Parent $CscExe
    $CompArgs = @(
        "/nologo",
        "/target:winexe",
        "/optimize+",
        "/out:$SingleExePath",
        "/r:System.dll",
        "/r:System.Core.dll",
        "/r:System.Windows.Forms.dll",
        "/r:$(Join-Path $NetDir 'System.IO.Compression.dll')",
        "/r:$(Join-Path $NetDir 'System.IO.Compression.FileSystem.dll')",
        "/resource:$EmbeddedZip,WebBundle.zip"
    )
    if (Test-Path $IconPath) {
        $CompArgs += "/win32icon:$IconPath"
    }
    $CompArgs += $CsPath

    & $CscExe @CompArgs
    Remove-Item -Force $CsPath, $EmbeddedZip -ErrorAction SilentlyContinue
}

# 5. Optional: Inno Setup (.iss) Skript erzeugen und falls ISCC.exe installiert ist Setup.exe bauen
Write-Host "[4/4] Erzeuge Inno Setup Skript fuer Installer..." -ForegroundColor Cyan
$MainExe = if ($BuiltNative) { "GenerationZukunft.exe" } else { "START_GAME_WINDOWS.exe" }
$IssPath = Join-Path $OutDir "GenerationZukunft_Setup.iss"
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
if (Test-Path $SingleExePath) {
    Write-Host "EINZELNE EXE (sofort versendbar): $SingleExePath" -ForegroundColor Green
}
Write-Host "ZIP zum Versenden:                $ZipPath"
Write-Host "Ordner zum Testen:                $BundleDir"
if (Test-Path $SetupExePath) {
    Write-Host "Inno Setup EXE:                   $SetupExePath" -ForegroundColor Green
}

