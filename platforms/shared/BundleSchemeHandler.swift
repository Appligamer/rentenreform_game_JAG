import Darwin
import Foundation
import WebKit
#if os(iOS)
import UIKit
#elseif os(macOS)
import AppKit
#endif

/// Synchron bindender Loopback-HTTP-Server (`http://127.0.0.1:<port>/`) auf Basis von
/// POSIX BSD-Sockets (`127.0.0.1` only — keine Firewall-Abfrage, kein Async-Timeout).
/// Ermöglicht in WKWebView unter macOS und iOS natives Laden von ES-Modulen
/// (`<script type="module" crossorigin>`), CSS und persistentem `localStorage`.
final class LocalBundleHTTPServer {
  private let rootURL: URL
  private let lock = NSLock()
  private var listenFD: Int32 = -1
  private var isRunning = false
  private(set) var port: UInt16 = 0

  var isHealthy: Bool {
    lock.lock()
    defer { lock.unlock() }
    guard isRunning && listenFD >= 0 && port > 0 else { return false }
    var sockErr: Int32 = 0
    var len = socklen_t(MemoryLayout<Int32>.size)
    let status = Darwin.getsockopt(listenFD, SOL_SOCKET, SO_ERROR, &sockErr, &len)
    return status == 0 && sockErr == 0
  }

  var entryURL: URL? {
    lock.lock()
    let currentPort = port
    lock.unlock()
    guard currentPort > 0 else { return nil }
    return URL(string: "http://127.0.0.1:\(currentPort)/index.html")
  }

  init?(rootURL: URL) {
    let indexURL = rootURL.appendingPathComponent("index.html")
    guard FileManager.default.fileExists(atPath: indexURL.path) else {
      return nil
    }
    self.rootURL = rootURL.standardizedFileURL
  }

  deinit {
    stop()
  }

  func start() -> URL? {
    _ = Darwin.signal(SIGPIPE, SIG_IGN)

    lock.lock()
    if isRunning && listenFD >= 0 && port > 0 {
      let existing = URL(string: "http://127.0.0.1:\(port)/index.html")
      lock.unlock()
      return existing
    }
    lock.unlock()

    // Bevorzugt stabilen Port-Bereich für persistentes localStorage, sonst Kernel-Port (0)
    var candidatePorts: [UInt16] = Array(41735...41750)
    candidatePorts.append(0)

    for desiredPort in candidatePorts {
      if let url = tryBindAndListen(desiredPort: desiredPort) {
        return url
      }
    }
    return nil
  }

  private func tryBindAndListen(desiredPort: UInt16) -> URL? {
    let fd = Darwin.socket(AF_INET, SOCK_STREAM, 0)
    guard fd >= 0 else { return nil }

    var yes: Int32 = 1
    _ = Darwin.setsockopt(fd, SOL_SOCKET, SO_REUSEADDR, &yes, socklen_t(MemoryLayout<Int32>.size))
    _ = Darwin.setsockopt(fd, SOL_SOCKET, SO_NOSIGPIPE, &yes, socklen_t(MemoryLayout<Int32>.size))

    var addr = sockaddr_in()
    addr.sin_len = UInt8(MemoryLayout<sockaddr_in>.size)
    addr.sin_family = sa_family_t(AF_INET)
    addr.sin_port = desiredPort.bigEndian
    addr.sin_addr = in_addr(s_addr: Darwin.inet_addr("127.0.0.1"))

    let bindStatus = withUnsafePointer(to: &addr) { ptr in
      ptr.withMemoryRebound(to: sockaddr.self, capacity: 1) { sockPtr in
        Darwin.bind(fd, sockPtr, socklen_t(MemoryLayout<sockaddr_in>.size))
      }
    }
    guard bindStatus == 0, Darwin.listen(fd, 64) == 0 else {
      Darwin.close(fd)
      return nil
    }

    var boundAddr = sockaddr_in()
    var addrLen = socklen_t(MemoryLayout<sockaddr_in>.size)
    let nameStatus = withUnsafeMutablePointer(to: &boundAddr) { ptr in
      ptr.withMemoryRebound(to: sockaddr.self, capacity: 1) { sockPtr in
        Darwin.getsockname(fd, sockPtr, &addrLen)
      }
    }
    guard nameStatus == 0 else {
      Darwin.close(fd)
      return nil
    }

    let assignedPort = UInt16(bigEndian: boundAddr.sin_port)
    guard assignedPort > 0 else {
      Darwin.close(fd)
      return nil
    }

    lock.lock()
    self.listenFD = fd
    self.port = assignedPort
    self.isRunning = true
    lock.unlock()

    DispatchQueue.global(qos: .userInitiated).async { [weak self] in
      self?.acceptLoop(listenFD: fd)
    }

    return URL(string: "http://127.0.0.1:\(assignedPort)/index.html")
  }

  func restartIfNeeded() -> URL? {
    if isHealthy {
      return entryURL
    }
    stop()
    return start()
  }

  func stop() {
    lock.lock()
    let fd = listenFD
    listenFD = -1
    isRunning = false
    port = 0
    lock.unlock()

    if fd >= 0 {
      Darwin.shutdown(fd, SHUT_RDWR)
      Darwin.close(fd)
    }
  }

  private func acceptLoop(listenFD: Int32) {
    while true {
      lock.lock()
      let active = isRunning && self.listenFD == listenFD
      lock.unlock()
      if !active { break }

      let clientFD = Darwin.accept(listenFD, nil, nil)
      if clientFD < 0 {
        if errno == EINTR { continue }
        var shouldClose = false
        lock.lock()
        if self.listenFD == listenFD {
          isRunning = false
          self.listenFD = -1
          port = 0
          shouldClose = true
        }
        lock.unlock()
        if shouldClose {
          Darwin.close(listenFD)
        }
        break
      }

      DispatchQueue.global(qos: .userInitiated).async { [weak self] in
        self?.handleClient(clientFD)
      }
    }
  }

  private func handleClient(_ clientFD: Int32) {
    defer {
      Darwin.shutdown(clientFD, SHUT_WR)
      Darwin.close(clientFD)
    }

    var yes: Int32 = 1
    _ = Darwin.setsockopt(clientFD, SOL_SOCKET, SO_NOSIGPIPE, &yes, socklen_t(MemoryLayout<Int32>.size))
    _ = Darwin.setsockopt(clientFD, IPPROTO_TCP, TCP_NODELAY, &yes, socklen_t(MemoryLayout<Int32>.size))

    var timeout = timeval(tv_sec: 2, tv_usec: 0)
    _ = Darwin.setsockopt(clientFD, SOL_SOCKET, SO_RCVTIMEO, &timeout, socklen_t(MemoryLayout<timeval>.size))
    _ = Darwin.setsockopt(clientFD, SOL_SOCKET, SO_SNDTIMEO, &timeout, socklen_t(MemoryLayout<timeval>.size))

    var requestData = Data()
    var chunk = [UInt8](repeating: 0, count: 8192)
    let crlfEnd = Data([0x0D, 0x0A, 0x0D, 0x0A])
    let lfEnd = Data([0x0A, 0x0A])

    while requestData.count < 65536 {
      let bytesRead = chunk.withUnsafeMutableBytes { rawBuf in
        Darwin.recv(clientFD, rawBuf.baseAddress, rawBuf.count, 0)
      }
      if bytesRead < 0 {
        if errno == EINTR { continue }
        break
      }
      if bytesRead == 0 { break }
      requestData.append(chunk, count: bytesRead)
      if requestData.range(of: crlfEnd) != nil || requestData.range(of: lfEnd) != nil {
        break
      }
    }

    guard !requestData.isEmpty else { return }

    let raw = String(data: requestData, encoding: .utf8) ?? ""
    let firstLine = raw.split(whereSeparator: { $0.isNewline }).first.map(String.init) ?? ""
    let parts = firstLine.split(separator: " ")

    let method = parts.count >= 1 ? parts[0].uppercased() : "GET"
    if method == "OPTIONS" {
      let optPayload = Data([
        "HTTP/1.1 204 No Content",
        "Access-Control-Allow-Origin: *",
        "Access-Control-Allow-Methods: GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers: *",
        "Connection: close",
        "",
        ""
      ].joined(separator: "\r\n").utf8)
      sendAll(optPayload, to: clientFD)
      return
    }

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
    if (fileURL.path == rootPath || fileURL.path.hasPrefix(rootPath + "/")),
       FileManager.default.fileExists(atPath: fileURL.path, isDirectory: &isDir),
       !isDir.boolValue,
       let body = try? Data(contentsOf: fileURL) {
      let mime = BundleSchemeHandler.mimeType(for: fileURL.pathExtension.lowercased())
      sendResponse(statusCode: 200, statusText: "OK", mimeType: mime, body: body, headOnly: method == "HEAD", to: clientFD)
      return
    }

    if !relativePath.hasPrefix("artworks/"),
       (relativePath as NSString).pathExtension.isEmpty,
       let indexData = try? Data(contentsOf: rootURL.appendingPathComponent("index.html")) {
      sendResponse(statusCode: 200, statusText: "OK", mimeType: "text/html; charset=utf-8", body: indexData, headOnly: method == "HEAD", to: clientFD)
      return
    }

    let notFound = Data("Not Found".utf8)
    sendResponse(statusCode: 404, statusText: "Not Found", mimeType: "text/plain; charset=utf-8", body: notFound, headOnly: method == "HEAD", to: clientFD)
  }

  private func sendResponse(
    statusCode: Int,
    statusText: String,
    mimeType: String,
    body: Data,
    headOnly: Bool,
    to clientFD: Int32
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
    sendAll(payload, to: clientFD)
  }

  private func sendAll(_ data: Data, to clientFD: Int32) {
    data.withUnsafeBytes { rawBuf in
      guard let base = rawBuf.baseAddress else { return }
      var offset = 0
      var temporaryRetries = 0
      while offset < data.count {
        let sent = Darwin.send(clientFD, base.advanced(by: offset), data.count - offset, 0)
        if sent < 0 {
          if errno == EINTR {
            continue
          }
          if errno == EAGAIN || errno == EWOULDBLOCK {
            temporaryRetries += 1
            if temporaryRetries > 50 {
              break
            }
            usleep(1000)
            continue
          }
          break
        }
        if sent == 0 { break }
        temporaryRetries = 0
        offset += sent
      }
    }
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
    if let bundledIndex = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "WebBundle") {
      return bundledIndex.deletingLastPathComponent()
    }
    if let distBundle = Bundle.main.resourceURL?.appendingPathComponent("dist"),
       FileManager.default.fileExists(atPath: distBundle.appendingPathComponent("index.html").path) {
      return distBundle
    }
    if let res = Bundle.main.resourceURL,
       FileManager.default.fileExists(atPath: res.appendingPathComponent("index.html").path) {
      return res
    }
    if let flatIndex = Bundle.main.url(forResource: "index", withExtension: "html") {
      return flatIndex.deletingLastPathComponent()
    }
    return nil
  }

  /// Erzeugt eine komplett autarke Offline-HTML-Variante (CSS + JS direkt eingebettet),
  /// falls `http://127.0.0.1` auf einem Gerät durch Profile/VPN/Sockets blockiert wird.
  static func buildInlinedAppHTML(webRoot: URL) -> String? {
    let indexURL = webRoot.appendingPathComponent("index.html")
    guard var html = try? String(contentsOf: indexURL, encoding: .utf8) else {
      return nil
    }

    // Externe Google Fonts im Offline-Fallback entfernen, damit WebKit sofort rendert
    if let fontRegex = try? NSRegularExpression(
      pattern: #"<link[^>]*fonts\.googleapis\.com[^>]*>"#,
      options: [.caseInsensitive]
    ) {
      let range = NSRange(html.startIndex..<html.endIndex, in: html)
      html = fontRegex.stringByReplacingMatches(in: html, range: range, withTemplate: "")
    }

    // Lokales Stylesheet (<link rel="stylesheet" ... href="./assets/...">) direkt einbetten
    if let cssRegex = try? NSRegularExpression(
      pattern: #"<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>"#,
      options: [.caseInsensitive]
    ) {
      let matches = cssRegex.matches(in: html, range: NSRange(html.startIndex..<html.endIndex, in: html))
      for match in matches.reversed() {
        guard match.numberOfRanges >= 2,
              let fullRange = Range(match.range(at: 0), in: html),
              let hrefRange = Range(match.range(at: 1), in: html) else { continue }
        var rel = String(html[hrefRange])
        while rel.hasPrefix("./") || rel.hasPrefix("/") {
          rel = String(rel.dropFirst(rel.hasPrefix("./") ? 2 : 1))
        }
        let cssURL = webRoot.appendingPathComponent(rel).standardizedFileURL
        if let cssText = try? String(contentsOf: cssURL, encoding: .utf8) {
          html.replaceSubrange(fullRange, with: "<style>\n\(cssText)\n</style>")
        }
      }
    }

    // Lokales ES-Modul (<script type="module" ... src="./assets/...">) direkt einbetten
    if let jsRegex = try? NSRegularExpression(
      pattern: #"<script[^>]*src=["']([^"']+)["'][^>]*>\s*</script>"#,
      options: [.caseInsensitive]
    ) {
      let matches = jsRegex.matches(in: html, range: NSRange(html.startIndex..<html.endIndex, in: html))
      for match in matches.reversed() {
        guard match.numberOfRanges >= 2,
              let fullRange = Range(match.range(at: 0), in: html),
              let srcRange = Range(match.range(at: 1), in: html) else { continue }
        var rel = String(html[srcRange])
        while rel.hasPrefix("./") || rel.hasPrefix("/") {
          rel = String(rel.dropFirst(rel.hasPrefix("./") ? 2 : 1))
        }
        let jsURL = webRoot.appendingPathComponent(rel).standardizedFileURL
        if let jsText = try? String(contentsOf: jsURL, encoding: .utf8) {
          let safeJS = jsText.replacingOccurrences(of: "</script", with: "<\\/script", options: .caseInsensitive)
          html.replaceSubrange(fullRange, with: "<script type=\"module\">\n\(safeJS)\n</script>")
        }
      }
    }

    return html
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

    guard (fileURL.path == rootPath || fileURL.path.hasPrefix(rootPath + "/")),
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
    let safeReason = reason
      .replacingOccurrences(of: "&", with: "&amp;")
      .replacingOccurrences(of: "<", with: "&lt;")
      .replacingOccurrences(of: ">", with: "&gt;")
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
        <p>\(safeReason)</p>
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
    config.userContentController.add(HapticBridge(), name: HapticBridge.handlerName)
    let errorGuardJS = """
    (function() {
      window.__EARLY_LOGS__ = window.__EARLY_LOGS__ || [];
      function pushEarly(level, source, msg) {
        var now = new Date();
        var ts = now.toTimeString().slice(0, 8) + '.' + String(now.getMilliseconds()).padStart(3, '0');
        window.__EARLY_LOGS__.push({ timestamp: ts, level: level, source: source, message: String(msg) });
      }
      function escapeHtml(str) {
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }
      function showErr(msg) {
        var root = document.getElementById('root');
        if (!root || root.childElementCount > 0) return;
        root.innerHTML = '<div style="min-height:100vh;background:#000;color:#f5f5f7;font-family:-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center"><div style="max-width:460px;background:#161617;border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:24px"><h2 style="color:#f59e0b;margin:0 0 8px;font-size:18px">Generation Zukunft</h2><p style="color:#86868b;font-size:13px;margin:0">' + escapeHtml(msg) + '</p></div></div>';
      }
      window.addEventListener('error', function(e) {
        if (e && e.message) {
          pushEarly('error', 'early-onerror', e.message + (e.filename ? ' (' + e.filename + ':' + e.lineno + ')' : ''));
          showErr(e.message);
        } else if (e && e.target && e.target.tagName) {
          var tag = String(e.target.tagName).toLowerCase();
          var src = e.target.src || e.target.href || '';
          pushEarly('error', 'early-resource', '<' + tag + '> Ladefehler: ' + src);
          if (tag === 'script') {
            showErr('Skript konnte nicht geladen werden: ' + src);
          }
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

/// Natives haptisches Feedback über `window.webkit.messageHandlers.haptics.postMessage({ style })`.
/// - iOS/iPadOS: Taptic Engine via `UIImpactFeedbackGenerator`, `UISelectionFeedbackGenerator` und `UINotificationFeedbackGenerator`
/// - macOS: Force-Touch-Trackpad via `NSHapticFeedbackManager`
final class HapticBridge: NSObject, WKScriptMessageHandler {
  static let handlerName = "haptics"

  func userContentController(
    _ userContentController: WKUserContentController,
    didReceive message: WKScriptMessage
  ) {
    let rawStyle: String?
    if let dict = message.body as? [String: Any], let s = dict["style"] as? String {
      rawStyle = s
    } else if let s = message.body as? String {
      rawStyle = s
    } else {
      rawStyle = nil
    }

    guard let style = rawStyle else { return }
    trigger(style: style)
  }

  private func trigger(style: String) {
    DispatchQueue.main.async {
      #if os(iOS)
      switch style {
      case "selection":
        let generator = UISelectionFeedbackGenerator()
        generator.prepare()
        generator.selectionChanged()
      case "light":
        let generator = UIImpactFeedbackGenerator(style: .light)
        generator.prepare()
        generator.impactOccurred()
      case "medium":
        let generator = UIImpactFeedbackGenerator(style: .medium)
        generator.prepare()
        generator.impactOccurred()
      case "heavy":
        let generator = UIImpactFeedbackGenerator(style: .heavy)
        generator.prepare()
        generator.impactOccurred()
      case "success":
        let generator = UINotificationFeedbackGenerator()
        generator.prepare()
        generator.notificationOccurred(.success)
      case "warning":
        let generator = UINotificationFeedbackGenerator()
        generator.prepare()
        generator.notificationOccurred(.warning)
      case "error":
        let generator = UINotificationFeedbackGenerator()
        generator.prepare()
        generator.notificationOccurred(.error)
      default:
        break
      }
      #elseif os(macOS)
      let pattern: NSHapticFeedbackManager.FeedbackPattern
      switch style {
      case "selection", "light":
        pattern = .alignment
      case "medium", "success", "warning":
        pattern = .levelChange
      case "heavy", "error":
        pattern = .generic
      default:
        return
      }
      NSHapticFeedbackManager.defaultPerformer.perform(pattern, performanceTime: .now)
      #endif
    }
  }
}
