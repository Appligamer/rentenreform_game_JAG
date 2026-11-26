import Foundation
import WebKit

final class BundleSchemeHandler: NSObject, WKURLSchemeHandler {
  static let scheme = "app"
  static let entryURL = URL(string: "app://local/index.html")!

  private let webRootURL: URL?

  override init() {
    if let webBundle = Bundle.main.resourceURL?.appendingPathComponent("WebBundle"),
       FileManager.default.fileExists(atPath: webBundle.appendingPathComponent("index.html").path) {
      self.webRootURL = webBundle
    } else if let distBundle = Bundle.main.resourceURL?.appendingPathComponent("dist"),
              FileManager.default.fileExists(atPath: distBundle.appendingPathComponent("index.html").path) {
      self.webRootURL = distBundle
    } else {
      self.webRootURL = Bundle.main.resourceURL
    }
    super.init()
  }

  var hasBundledApp: Bool {
    guard let root = webRootURL else { return false }
    return FileManager.default.fileExists(atPath: root.appendingPathComponent("index.html").path)
  }

  func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
    guard let requestURL = urlSchemeTask.request.url else {
      urlSchemeTask.didFailWithError(URLError(.badURL))
      return
    }

    if urlSchemeTask.request.httpMethod?.uppercased() == "OPTIONS" {
      let headers: [String: String] = [
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "*"
      ]
      let response = HTTPURLResponse(
        url: requestURL,
        statusCode: 204,
        httpVersion: "HTTP/1.1",
        headerFields: headers
      )!
      urlSchemeTask.didReceive(response)
      urlSchemeTask.didFinish()
      return
    }

    var relativePath = requestURL.path
    if relativePath.isEmpty || relativePath == "/" {
      relativePath = "/index.html"
    }
    while relativePath.hasPrefix("/") {
      relativePath.removeFirst()
    }

    guard let root = webRootURL else {
      sendFallbackHTML(to: urlSchemeTask, requestURL: requestURL, reason: "Kein Ressourcenverzeichnis im App-Bundle.")
      return
    }

    let fileURL = root.appendingPathComponent(relativePath).standardizedFileURL
    let rootPath = root.standardizedFileURL.path

    guard fileURL.path.hasPrefix(rootPath),
          let data = try? Data(contentsOf: fileURL) else {
      if (relativePath as NSString).pathExtension.isEmpty,
         let indexData = try? Data(contentsOf: root.appendingPathComponent("index.html")) {
        sendResponse(data: indexData, mimeType: "text/html; charset=utf-8", url: requestURL, task: urlSchemeTask)
        return
      }
      let notFound = Data("Not Found".utf8)
      let response = HTTPURLResponse(
        url: requestURL,
        statusCode: 404,
        httpVersion: "HTTP/1.1",
        headerFields: [
          "Content-Type": "text/plain; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        ]
      )!
      urlSchemeTask.didReceive(response)
      urlSchemeTask.didReceive(notFound)
      urlSchemeTask.didFinish()
      return
    }

    let mimeType = Self.mimeType(for: fileURL.pathExtension.lowercased())
    sendResponse(data: data, mimeType: mimeType, url: requestURL, task: urlSchemeTask)
  }

  func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {}

  private func sendResponse(data: Data, mimeType: String, url: URL, task: WKURLSchemeTask) {
    let headers: [String: String] = [
      "Content-Type": mimeType,
      "Content-Length": "\(data.count)",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Cache-Control": "no-cache"
    ]
    let response = HTTPURLResponse(
      url: url,
      statusCode: 200,
      httpVersion: "HTTP/1.1",
      headerFields: headers
    )!
    task.didReceive(response)
    task.didReceive(data)
    task.didFinish()
  }

  private func sendFallbackHTML(to task: WKURLSchemeTask, requestURL: URL, reason: String) {
    let html = Self.fallbackHTML(reason: reason)
    sendResponse(data: Data(html.utf8), mimeType: "text/html; charset=utf-8", url: requestURL, task: task)
  }

  static func fallbackHTML(reason: String) -> String {
    return """
    <!doctype html>
    <html lang="de">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
      <style>
        body{margin:0;background:#000;color:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;text-align:center}
        .card{max-width:460px;background:#161617;border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:24px}
        h1{color:#f59e0b;font-size:20px;margin:0 0 10px}
        p{color:#86868b;font-size:14px;line-height:1.5;margin:0}
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Generation Zukunft</h1>
        <p>\(reason)</p>
      </div>
    </body>
    </html>
    """
  }

  static func makeConfiguration(schemeHandler: BundleSchemeHandler) -> WKWebViewConfiguration {
    let config = WKWebViewConfiguration()
    config.setURLSchemeHandler(schemeHandler, forURLScheme: Self.scheme)
    config.websiteDataStore = WKWebsiteDataStore.default()
    config.defaultWebpagePreferences.allowsContentJavaScript = true
    if #available(macOS 11.3, iOS 14.5, *) {
      config.preferences.isFraudulentWebsiteWarningEnabled = false
    }
    let errorGuardJS = """
    (function() {
      window.__EARLY_LOGS__ = window.__EARLY_LOGS__ || [];
      function pushEarly(level, source, msg) {
        var now = new Date();
        var ts = now.toTimeString().slice(0, 8) + '.' + String(now.getMilliseconds()).padStart(3, '0');
        window.__EARLY_LOGS__.push({ timestamp: ts, level: level, source: source, message: String(msg) });
      }
      function showErr(msg) {
        var root = document.getElementById('root');
        if (!root || root.childElementCount > 0) return;
        root.innerHTML = '<div style="min-height:100vh;background:#000;color:#f5f5f7;font-family:-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center"><div style="max-width:440px;background:#161617;border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:24px"><h2 style="color:#f59e0b;margin:0 0 8px;font-size:18px">Generation Zukunft</h2><p style="color:#86868b;font-size:13px;margin:0">' + String(msg) + '</p></div></div>';
      }
      window.addEventListener('error', function(e) {
        if (e && e.message) {
          pushEarly('error', 'early-onerror', e.message + (e.filename ? ' (' + e.filename + ':' + e.lineno + ')' : ''));
          showErr(e.message);
        } else if (e && e.target && e.target.tagName) {
          var src = e.target.src || e.target.href || '';
          pushEarly('error', 'early-resource', '<' + e.target.tagName.toLowerCase() + '> Ladefehler: ' + src);
        }
      }, true);
      window.addEventListener('unhandledrejection', function(e) {
        var msg = e && e.reason && e.reason.message ? e.reason.message : String(e && e.reason);
        pushEarly('error', 'early-promise', msg);
        showErr(msg);
      });
      pushEarly('info', 'webkit-init', 'WKWebView early-boot hook aktiv');
    })();
    """
    let script = WKUserScript(source: errorGuardJS, injectionTime: .atDocumentStart, forMainFrameOnly: true)
    config.userContentController.addUserScript(script)
    #if os(iOS)
    config.allowsInlineMediaPlayback = true
    config.mediaTypesRequiringUserActionForPlayback = []
    #endif
    return config
  }

  static func mimeType(for ext: String) -> String {
    switch ext {
    case "html", "htm": return "text/html; charset=utf-8"
    case "js", "mjs": return "application/javascript; charset=utf-8"
    case "css": return "text/css; charset=utf-8"
    case "json": return "application/json; charset=utf-8"
    case "svg": return "image/svg+xml"
    case "png": return "image/png"
    case "jpg", "jpeg": return "image/jpeg"
    case "webp": return "image/webp"
    case "woff2": return "font/woff2"
    case "woff": return "font/woff"
    case "ico": return "image/x-icon"
    default: return "application/octet-stream"
    }
  }
}
