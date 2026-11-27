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
  private var watchdogWorkItem: DispatchWorkItem?
  private var didUseInlinedFallback = false

  deinit {
    watchdogWorkItem?.cancel()
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
    #if DEBUG
    if #available(macOS 13.3, *) {
      wv.isInspectable = true
    }
    #endif
    self.webView = wv
    self.view = wv
  }

  override func viewDidLoad() {
    super.viewDidLoad()
    loadApp()
  }

  private func loadApp() {
    didUseInlinedFallback = false
    watchdogWorkItem?.cancel()

    guard let webRoot = schemeHandler.webRootURL, schemeHandler.hasBundledApp else {
      webView.loadHTMLString(
        BundleSchemeHandler.fallbackHTML(reason: "Das lokale Spielpaket (WebBundle) wurde im macOS App-Bundle nicht gefunden."),
        baseURL: nil
      )
      return
    }

    if localServer == nil {
      localServer = LocalBundleHTTPServer(rootURL: webRoot)
    }

    if let url = localServer?.restartIfNeeded() {
      webView.load(URLRequest(url: url))
      scheduleReadinessWatchdog(delaySeconds: 4.5)
    } else {
      loadInlinedFallback()
    }
  }

  private func loadInlinedFallback(reasonPrefix: String? = nil) {
    watchdogWorkItem?.cancel()
    guard !didUseInlinedFallback else {
      let msg = reasonPrefix ?? "Die Simulation konnte nicht initialisiert werden."
      webView.loadHTMLString(BundleSchemeHandler.fallbackHTML(reason: msg), baseURL: nil)
      return
    }
    didUseInlinedFallback = true

    if let webRoot = schemeHandler.webRootURL,
       let inlinedHTML = BundleSchemeHandler.buildInlinedAppHTML(webRoot: webRoot) {
      webView.loadHTMLString(inlinedHTML, baseURL: BundleSchemeHandler.entryURL)
      scheduleReadinessWatchdog(delaySeconds: 3.5)
    } else {
      webView.load(URLRequest(url: BundleSchemeHandler.entryURL))
      scheduleReadinessWatchdog(delaySeconds: 3.5)
    }
  }

  private func scheduleReadinessWatchdog(delaySeconds: TimeInterval) {
    watchdogWorkItem?.cancel()
    let item = DispatchWorkItem { [weak self] in
      self?.verifyRootMounted(allowFallbackRetry: true)
    }
    watchdogWorkItem = item
    DispatchQueue.main.asyncAfter(deadline: .now() + delaySeconds, execute: item)
  }

  private func verifyRootMounted(allowFallbackRetry: Bool) {
    let probeJS = """
    (function() {
      var r = document.getElementById('root');
      var count = r ? r.childElementCount : -1;
      var logs = (window.__EARLY_LOGS__ || []).map(function(l) { return l.level + ': ' + l.message; }).join(' | ');
      return count + '::' + logs;
    })()
    """
    webView.evaluateJavaScript(probeJS) { [weak self] result, error in
      guard let self else { return }

      if let error {
        if allowFallbackRetry && !self.didUseInlinedFallback {
          self.loadInlinedFallback(reasonPrefix: "WebView-Prüfung fehlgeschlagen: \(error.localizedDescription)")
        } else {
          self.webView.loadHTMLString(
            BundleSchemeHandler.fallbackHTML(reason: "WebView-Initialisierung fehlgeschlagen: \(error.localizedDescription)"),
            baseURL: nil
          )
        }
        return
      }

      guard let text = result as? String else {
        if allowFallbackRetry && !self.didUseInlinedFallback {
          self.loadInlinedFallback()
        }
        return
      }

      let parts = text.components(separatedBy: "::")
      let count = Int(parts.first ?? "-1") ?? -1
      let details = parts.count >= 2 ? parts.dropFirst().joined(separator: "::") : ""

      if count <= 0 {
        if allowFallbackRetry && !self.didUseInlinedFallback {
          self.loadInlinedFallback(reasonPrefix: details)
        } else {
          let msg = details.isEmpty
            ? "Die Simulation konnte nicht initialisiert werden (leerer Root-Container)."
            : "Startfehler: \(details)"
          self.webView.loadHTMLString(BundleSchemeHandler.fallbackHTML(reason: msg), baseURL: nil)
        }
      }
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
    scheduleReadinessWatchdog(delaySeconds: 2.2)
  }

  func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
    handleNavigationFailure(error)
  }

  func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
    handleNavigationFailure(error)
  }

  func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
    loadApp()
  }

  private func handleNavigationFailure(_ error: Error) {
    let nsError = error as NSError
    if nsError.domain == NSURLErrorDomain && nsError.code == NSURLErrorCancelled {
      return
    }
    if !didUseInlinedFallback {
      loadInlinedFallback(reasonPrefix: "Ladefehler: \(error.localizedDescription)")
    } else {
      webView.loadHTMLString(
        BundleSchemeHandler.fallbackHTML(reason: "Ladefehler: \(error.localizedDescription)"),
        baseURL: nil
      )
    }
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
