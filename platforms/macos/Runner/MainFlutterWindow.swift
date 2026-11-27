import Cocoa
import WebKit

#if canImport(FlutterMacOS)
import FlutterMacOS

class MainFlutterWindow: NSWindow {
  override func awakeFromNib() {
    let flutterViewController = FlutterViewController()
    let windowFrame = self.frame
    self.contentViewController = flutterViewController
    self.setFrame(windowFrame, display: true)

    #if canImport(GeneratedPluginRegistrant)
    RegisterGeneratedPlugins(registry: flutterViewController)
    #endif

    super.awakeFromNib()
  }
}
#else
final class MacGameViewController: NSViewController, WKNavigationDelegate, WKUIDelegate {
  private var webView: WKWebView!
  private let schemeHandler = BundleSchemeHandler()
  private var localServer: LocalBundleHTTPServer?

  deinit {
    webView?.configuration.userContentController.removeScriptMessageHandler(forName: HapticBridge.handlerName)
    localServer?.stop()
  }

  override func loadView() {
    let config = BundleSchemeHandler.makeConfiguration(schemeHandler: schemeHandler)
    #if DEBUG
    config.preferences.setValue(true, forKey: "developerExtrasEnabled")
    #endif

    let wv = WKWebView(frame: NSRect(x: 0, y: 0, width: 1280, height: 820), configuration: config)
    wv.autoresizingMask = [.width, .height]
    wv.navigationDelegate = self
    wv.uiDelegate = self
    if #available(macOS 12.0, *) {
      wv.underPageBackgroundColor = NSColor.black
    }
    self.webView = wv
    self.view = wv
  }

  override func viewDidLoad() {
    super.viewDidLoad()
    loadApp()
  }

  private func loadApp() {
    guard let webRoot = schemeHandler.webRootURL, schemeHandler.hasBundledApp else {
      webView.loadHTMLString(
        BundleSchemeHandler.fallbackHTML(reason: "Das lokale Spielpaket (WebBundle) wurde im macOS App-Bundle nicht gefunden."),
        baseURL: nil
      )
      return
    }

    if let server = LocalBundleHTTPServer(rootURL: webRoot),
       let url = server.start() {
      self.localServer = server
      webView.load(URLRequest(url: url))
    } else {
      webView.load(URLRequest(url: BundleSchemeHandler.entryURL))
    }
  }

  func webView(
    _ webView: WKWebView,
    createWebViewWith configuration: WKWebViewConfiguration,
    for navigationAction: WKNavigationAction,
    windowFeatures: WKWindowFeatures
  ) -> WKWebView? {
    if navigationAction.targetFrame == nil, let url = navigationAction.request.url {
      if url.scheme == "http" || url.scheme == "https",
         url.host != "127.0.0.1",
         url.host != "localhost" {
        NSWorkspace.shared.open(url)
      } else {
        webView.load(URLRequest(url: url))
      }
    }
    return nil
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) { [weak self] in
      guard let self else { return }
      let probeJS = """
      (function() {
        var r = document.getElementById('root');
        var count = r ? r.childElementCount : -1;
        var logs = (window.__EARLY_LOGS__ || []).map(function(l) { return l.level + ': ' + l.message; }).join(' | ');
        return count + '::' + logs;
      })()
      """
      self.webView.evaluateJavaScript(probeJS) { result, _ in
        guard let text = result as? String else { return }
        let parts = text.components(separatedBy: "::")
        if let first = parts.first, let count = Int(first), count == 0 {
          let details = parts.count >= 2 ? parts.dropFirst().joined(separator: "::") : ""
          let msg = details.isEmpty
            ? "Die Simulation konnte nicht initialisiert werden (leerer Root-Container)."
            : "Startfehler: \(details)"
          self.webView.loadHTMLString(BundleSchemeHandler.fallbackHTML(reason: msg), baseURL: nil)
        }
      }
    }
  }

  func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
    renderError(error)
  }

  func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
    renderError(error)
  }

  private func renderError(_ error: Error) {
    webView.loadHTMLString(
      BundleSchemeHandler.fallbackHTML(reason: "Ladefehler: \(error.localizedDescription)"),
      baseURL: nil
    )
  }
}

class MainFlutterWindow: NSWindow {
  override func awakeFromNib() {
    let windowFrame = (self.frame.width >= 400 && self.frame.height >= 300)
      ? self.frame
      : NSRect(x: 0, y: 0, width: 1280, height: 820)

    self.title = "Generation Zukunft — Renten-Simulation (econo=me)"
    self.styleMask.insert([.titled, .closable, .miniaturizable, .resizable])
    self.titlebarAppearsTransparent = true
    self.appearance = NSAppearance(named: .darkAqua)
    self.backgroundColor = NSColor.black
    self.isOpaque = true
    self.minSize = NSSize(width: 960, height: 640)

    let gameViewController = MacGameViewController()
    self.contentViewController = gameViewController
    self.setFrame(windowFrame, display: true)
    self.center()

    super.awakeFromNib()
  }
}
#endif
