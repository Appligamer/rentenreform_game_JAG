<#
.SYNOPSIS
Erzeugt ein versandfertiges, signiertes Windows-Paket (Einzel-EXE + Portable ZIP + Inno Setup) fuer Generation Zukunft.
#>
param(
    [string]$PfxPath = "",
    [string]$PfxPassword = "",
    [string]$CertThumbprint = "",
    [switch]$SkipSign
)

$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $PSScriptRoot
$FlutterDir = $RootDir
$OutDir = Join-Path $RootDir "dist_windows"
$BundleDir = Join-Path $OutDir "GenerationZukunft_Windows"

$AppVersion = "1.0.0"
$PkgPath = Join-Path $RootDir "package.json"
if (Test-Path $PkgPath) {
    try {
        $pkg = Get-Content $PkgPath -Raw | ConvertFrom-Json
        if ($pkg.version) { $AppVersion = [string]$pkg.version }
    } catch {}
}
$AssemblyVersion = if ($AppVersion -match '^\d+\.\d+\.\d+$') { "$AppVersion.0" } else { "1.0.0.0" }

Write-Host "=== Generation Zukunft v${AppVersion}: Windows Packaging ===" -ForegroundColor Yellow
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
}

# 3. EINE EINZIGE eigenstaendige .exe mit Windows-Bordmitteln (.NET csc.exe) erzeugen
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
    Write-Host "[2/4] Erstelle eigenstaendige Einzel-EXE mit Icon, Manifest & Version v$AppVersion..." -ForegroundColor Cyan

    # Stellt sicher, dass favicon.ico auch im WebBundle liegt (fuer Edge App-Fenster & Windows-Taskleiste)
    if (Test-Path $IconPath) {
        Copy-Item -Path $IconPath -Destination (Join-Path $WebSourceForSingle "favicon.ico") -Force
    }

    $EmbeddedZip = Join-Path $OutDir "WebBundle.zip"
    if (Test-Path $EmbeddedZip) { Remove-Item -Force $EmbeddedZip }
    Compress-Archive -Path (Join-Path $WebSourceForSingle "*") -DestinationPath $EmbeddedZip -Force

    $ManifestPath = Join-Path $OutDir "app.manifest"
    $ManifestXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<assembly xmlns="urn:schemas-microsoft-com:asm.v1" manifestVersion="1.0">
  <assemblyIdentity version="$AssemblyVersion" name="GenerationZukunft.App" type="win32" />
  <description>Generation Zukunft - Renten-Simulation (econo=me)</description>
  <trustInfo xmlns="urn:schemas-microsoft-com:asm.v3">
    <security>
      <requestedPrivileges>
        <requestedExecutionLevel level="asInvoker" uiAccess="false" />
      </requestedPrivileges>
    </security>
  </trustInfo>
  <compatibility xmlns="urn:schemas-microsoft-com:compatibility.v1">
    <application>
      <supportedOS Id="{8e0f7a12-bfb3-4fe8-b9a5-48fd50a15a9a}" />
      <supportedOS Id="{1f676c76-80e1-4239-95bb-83d0f6d0da78}" />
    </application>
  </compatibility>
</assembly>
"@
    Set-Content -Path $ManifestPath -Value $ManifestXml -Encoding UTF8

    $CsPath = Join-Path $OutDir "GenerationZukunftLauncher.cs"
    $AssemblyHeader = @"
using System;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows.Forms;

[assembly: AssemblyTitle("Generation Zukunft - Renten-Simulation")]
[assembly: AssemblyDescription("Interaktive Simulation zur deutschen Rentenversicherung (econo=me)")]
[assembly: AssemblyProduct("Generation Zukunft")]
[assembly: AssemblyCompany("Jacob Glathe & Team (econo=me)")]
[assembly: AssemblyCopyright("Copyright (c) Jacob Glathe & Team")]
[assembly: ComVisible(false)]
[assembly: AssemblyVersion("$AssemblyVersion")]
[assembly: AssemblyFileVersion("$AssemblyVersion")]
"@
    $CsCode = $AssemblyHeader + @'

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
        "/win32manifest:$ManifestPath",
        "/resource:$EmbeddedZip,WebBundle.zip"
    )
    if (Test-Path $IconPath) {
        $CompArgs += "/win32icon:$IconPath"
    }
    $CompArgs += $CsPath

    & $CscExe @CompArgs
    Remove-Item -Force $CsPath, $EmbeddedZip, $ManifestPath -ErrorAction SilentlyContinue
}

# 4. Automatische Code-Signatur (PFX / Zertifikatsspeicher / lokales Dev-Zertifikat)
$SignMode = "NICHT_SIGNIERT"
function Invoke-SignExecutable {
    param([string]$TargetExe)
    if ($SkipSign -or -not (Test-Path $TargetExe)) { return }

    $cert = $null
    $isSelfSigned = $false

    # A) Explizites oder im Projekt liegendes .pfx-Zertifikat
    if (-not $PfxPath) {
        foreach ($cand in @((Join-Path $RootDir "code-signing.pfx"), (Join-Path $PSScriptRoot "code-signing.pfx"))) {
            if (Test-Path $cand) { $PfxPath = $cand; break }
        }
    }
    if ($PfxPath -and (Test-Path $PfxPath)) {
        $secPwd = if ($PfxPassword) { ConvertTo-SecureString $PfxPassword -AsPlainText -Force } else { Read-Host "PFX-Passwort eingeben" -AsSecureString }
        $cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($PfxPath, $secPwd, [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::Exportable)
    }

    # B) Zertifikat per Thumbprint oder vorhandenes CA-CodeSigning-Zertifikat im Store
    if (-not $cert -and $CertThumbprint) {
        $cert = Get-ChildItem Cert:\CurrentUser\My -CodeSigningCert | Where-Object { $_.Thumbprint -eq $CertThumbprint } | Select-Object -First 1
    }
    if (-not $cert) {
        $cert = Get-ChildItem Cert:\CurrentUser\My -CodeSigningCert | Where-Object { $_.Issuer -ne $_.Subject } | Select-Object -First 1
    }

    try {
        if (-not $cert) {
            $isSelfSigned = $true
            $subject = "CN=Jacob Glathe (Generation Zukunft Local)"
            $cert = Get-ChildItem Cert:\CurrentUser\My -CodeSigningCert | Where-Object { $_.Subject -eq $subject } | Select-Object -First 1
            if (-not $cert) {
                Write-Host "      Erstelle lokales Code-Signing-Zertifikat ($subject)..." -ForegroundColor DarkCyan
                $cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject $subject -CertStoreLocation "Cert:\CurrentUser\My" -NotAfter (Get-Date).AddYears(5)
                try {
                    $storeRoot = New-Object System.Security.Cryptography.X509Certificates.X509Store("Root", "CurrentUser")
                    $storeRoot.Open("ReadWrite"); $storeRoot.Add($cert); $storeRoot.Close()
                    $storePub = New-Object System.Security.Cryptography.X509Certificates.X509Store("TrustedPublisher", "CurrentUser")
                    $storePub.Open("ReadWrite"); $storePub.Add($cert); $storePub.Close()
                } catch {}
            }
        }

        if ($cert) {
            if ($isSelfSigned) {
                $sig = Set-AuthenticodeSignature -FilePath $TargetExe -Certificate $cert -HashAlgorithm SHA256
                if ($sig.Status -eq "Valid" -or $sig.Status -eq "UnknownError") {
                    $script:SignMode = "LOKAL_SELBSTSIGNIERT"
                }
            } else {
                Set-AuthenticodeSignature -FilePath $TargetExe -Certificate $cert -HashAlgorithm SHA256 -TimestampServer "http://timestamp.digicert.com" | Out-Null
                $script:SignMode = "CA_OFFIZIELL"
            }
        }
    } catch {
        Write-Host "      Hinweis: Signierung uebersprungen ($($_.Exception.Message))" -ForegroundColor DarkYellow
    }
}

if (Test-Path $SingleExePath) {
    Write-Host "[3/5] Signiere GenerationZukunft.exe (SHA-256)..." -ForegroundColor Cyan
    Invoke-SignExecutable -TargetExe $SingleExePath
    if (-not $BuiltNative) {
        Copy-Item -Path $SingleExePath -Destination (Join-Path $BundleDir "GenerationZukunft.exe") -Force
    }
}
if ($BuiltNative -and (Test-Path (Join-Path $BundleDir "GenerationZukunft.exe"))) {
    Invoke-SignExecutable -TargetExe (Join-Path $BundleDir "GenerationZukunft.exe")
}

# 5. ZIP-Archiv zum direkten Versenden erzeugen (enthaelt nun die signierte GenerationZukunft.exe)
Write-Host "[4/5] Erstelle portables ZIP-Archiv..." -ForegroundColor Cyan
$ZipPath = Join-Path $OutDir "GenerationZukunft_Windows_Portable.zip"
Compress-Archive -Path (Join-Path $BundleDir "*") -DestinationPath $ZipPath -Force

# 6. Optional: Inno Setup (.iss) Skript erzeugen und falls ISCC.exe installiert ist Setup.exe bauen
Write-Host "[5/5] Erzeuge Inno Setup Skript fuer Installer..." -ForegroundColor Cyan
$MainExe = "GenerationZukunft.exe"
$IssPath = Join-Path $OutDir "GenerationZukunft_Setup.iss"
$IssContent = @"
[Setup]
AppName=Generation Zukunft - Renten-Simulation
AppVersion=$AppVersion
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
    Invoke-SignExecutable -TargetExe $SetupExePath
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
if ($SignMode -eq "CA_OFFIZIELL") {
    Write-Host "Signatur-Status:                  OFFIZIELLES CA-ZERTIFIKAT (Smart App Control OK)" -ForegroundColor Green
} elseif ($SignMode -eq "LOKAL_SELBSTSIGNIERT") {
    Write-Host "Signatur-Status:                  LOKAL SELBST-SIGNIERT (auf diesem PC vertrauenswuerdig)" -ForegroundColor Yellow
    Write-Host "Hinweis Smart App Control:        Fuer fremde Win11-PCs mit aktivem Smart App Control ist ein" -ForegroundColor Gray
    Write-Host "                                  offizielles CA-Code-Signing-Zertifikat (.pfx / Store) noetig." -ForegroundColor Gray
}


