import Foundation
import Network
import WebKit

/// Lokaler Loopback-HTTP-Server (`http://127.0.0.1:<port>/`), damit WKWebView
/// ES-Module (`<script type="module" crossorigin>`), `localStorage` und CSS
/// ohne Custom-Scheme-CORS-Beschränkungen auf macOS und iOS vollständig lädt.
final class LocalBundleHTTPServer {
  private let rootURL: URL
  private let queue = DispatchQueue(label: "com.appligamer.localbundle.http", qos: .userInitiated)
  private var listener: NWListener?
  private var didNotify = false

  init?(rootURL: URL) {
    let indexURL = rootURL.appendingPathComponent("index.html")
    guard FileManager.default.fileExists(atPath: indexURL.path) else {
      return nil
    }
    self.rootURL = rootURL.standardizedFileURL
  }

  func start(completion: @escaping (URL?) -> Void) {
    do {
      let params = NWParameters.tcp
      params.allowLocalEndpointReuse = true
      params.requiredLocalEndpoint = NWEndpoint.hostPort(host: .ipv4(.loopback), port: .any)

      let listener = try NWListener(using: params)
      self.listener = listener

      listener.stateUpdateHandler = { [weak self] state in
        guard let self else { return }
        switch state {
        case .ready:
          if !self.didNotify, let port = listener.port?.rawValue {
            self.didNotify = true
            let url = URL(string: "http://127.0.0.1:\(port)/index.html")
            DispatchQueue.main.async {
              completion(url)
            }
          }
        case .failed, .cancelled:
          if !self.didNotify {
            self.didNotify = true
            DispatchQueue.main.async {
              completion(nil)
            }
          }
        default:
          break
        }
      }

      listener.newConnectionHandler = { [weak self] connection in
        self?.handleConnection(connection)
      }

      listener.start(queue: queue)

      queue.asyncAfter(deadline: .now() + 2.0) { [weak self] in
        guard let self, !self.didNotify else { return }
        self.didNotify = true
        DispatchQueue.main.async {
          completion(nil)
        }
      }
    } catch {
      DispatchQueue.main.async {
        completion(nil)
      }
    }
  }

  func stop() {
    queue.async { [weak self] in
      self?.listener?.cancel()
      self?.listener = nil
    }
  }

  private func handleConnection(_ connection: NWConnection) {
    connection.start(queue: queue)
    receiveRequest(on: connection, buffer: Data())
  }

  private func receiveRequest(on connection: NWConnection, buffer: Data) {
    let headerEnd = Data([0x0D, 0x0A, 0x0D, 0x0A])
    connection.receive(minimumIncompleteLength: 1, maximumLength: 65536) { [weak self] chunk, _, isComplete, error in
      guard let self else {
        connection.cancel()
        return
      }
      var nextBuffer = buffer
      if let chunk {
        nextBuffer.append(chunk)
      }

      if nextBuffer.range(of: headerEnd) != nil || isComplete || error != nil {
        self.processHTTPRequest(nextBuffer, on: connection)
      } else {
        self.receiveRequest(on: connection, buffer: nextBuffer)
      }
    }
  }

  private func processHTTPRequest(_ data: Data, on connection: NWConnection) {
    let raw = String(data: data, encoding: .utf8) ?? ""
    let firstLine = raw.components(separatedBy: "\r\n").first ?? ""
    let parts = firstLine.split(separator: " ")

    let method = parts.count >= 1 ? parts[0].uppercased() : "GET"
    let rawTarget = parts.count >= 2 ? String(parts[1]) : "/"

    let noQuery = rawTarget.split(separator: "?", maxSplits: 1, omittingEmptySubsequences: false).first.map(String.init) ?? "/"
    let noHash = noQuery.split(separator: "#", maxSplits: 1, omittingEmptySubsequences: false).first.map(String.init) ?? "/"
    var relativePath = noHash.removingPercentEncoding ?? noHash
    while relativePath.hasPrefix("/") {
      relativePath.removeFirst()
    }
    if relativePath.isEmpty {
      relativePath = "index.html"
    }

    let fileURL = rootURL.appendingPathComponent(relativePath).standardizedFileURL
    let rootPath = rootURL.path

    var isDir: ObjCBool = false
    if fileURL.path.hasPrefix(rootPath),
       FileManager.default.fileExists(atPath: fileURL.path, isDirectory: &isDir),
       !isDir.boolValue,
       let body = try? Data(contentsOf: fileURL) {
      let mime = BundleSchemeHandler.mimeType(for: fileURL.pathExtension.lowercased())
      sendHTTPResponse(statusCode: 200, statusText: "OK", mimeType: mime, body: body, headOnly: method == "HEAD", on: connection)
      return
    }

    if !relativePath.hasPrefix("artworks/"),
       (relativePath as NSString).pathExtension.isEmpty,
       let indexData = try? Data(contentsOf: rootURL.appendingPathComponent("index.html")) {
      sendHTTPResponse(statusCode: 200, statusText: "OK", mimeType: "text/html; charset=utf-8", body: indexData, headOnly: method == "HEAD", on: connection)
      return
    }

    let notFound = Data("Not Found".utf8)
    sendHTTPResponse(statusCode: 404, statusText: "Not Found", mimeType: "text/plain; charset=utf-8", body: notFound, headOnly: method == "HEAD", on: connection)
  }

  private func sendHTTPResponse(
    statusCode: Int,
    statusText: String,
    mimeType: String,
    body: Data,
    headOnly: Bool,
    on connection: NWConnection
  ) {
    let header = [
      "HTTP/1.1 \(statusCode) \(statusText)",
      "Content-Type: \(mimeType)",
      "Content-Length: \(body.count)",
      "Access-Control-Allow-Origin: *",
      "Access-Control-Allow-Methods: GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers: *",
      "Cache-Control: no-cache",
      "Connection: close",
      "",
      ""
    ].joined(separator: "\r\n")

    var payload = Data(header.utf8)
    if !headOnly {
      payload.append(body)
    }

    connection.send(content: payload, completion: .contentProcessed { _ in
      connection.cancel()
    })
  }
}

final class BundleSchemeHandler: NSObject, WKURLSchemeHandler {
  static let scheme = "app"
  static let entryURL = URL(string: "app://local/index.html")!

  let webRootURL: URL?

  override init() {
    self.webRootURL = Self.resolveWebRootURL()
    super.init()
  }

  static func resolveWebRootURL() -> URL? {
    if let webBundle = Bundle.main.resourceURL?.appendingPathComponent("WebBundle"),
       FileManager.default.fileExists(atPath: webBundle.appendingPathComponent("index.html").path) {
      return webBundle
    }
    if let distBundle = Bundle.main.resourceURL?.appendingPathComponent("dist"),
       FileManager.default.fileExists(atPath: distBundle.appendingPathComponent("index.html").path) {
      return distBundle
    }
    if let res = Bundle.main.resourceURL,
       FileManager.default.fileExists(atPath: res.appendingPathComponent("index.html").path) {
      return res
    }
    return nil
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
      if !relativePath.hasPrefix("artworks/"),
         (relativePath as NSString).pathExtension.isEmpty,
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
        .card{max-width:520px;background:#161617;border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:24px}
        h1{color:#f59e0b;font-size:20px;margin:0 0 10px}
        p{color:#86868b;font-size:14px;line-height:1.5;margin:0;word-break:break-word}
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
        root.innerHTML = '<div style="min-height:100vh;background:#000;color:#f5f5f7;font-family:-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center"><div style="max-width:460px;background:#161617;border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:24px"><h2 style="color:#f59e0b;margin:0 0 8px;font-size:18px">Generation Zukunft</h2><p style="color:#86868b;font-size:13px;margin:0">' + String(msg) + '</p></div></div>';
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
