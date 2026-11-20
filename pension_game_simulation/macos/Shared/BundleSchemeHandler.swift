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
        headerFields: ["Content-Type": "text/plain; charset=utf-8"]
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
    config.websiteDataStore = WKWebsiteDataStore.nonPersistent()
    config.defaultWebpagePreferences.allowsContentJavaScript = true
    if #available(macOS 11.3, iOS 14.5, *) {
      config.preferences.isFraudulentWebsiteWarningEnabled = false
    }
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
    default: return "application/octet-stream"
    }
  }
}
