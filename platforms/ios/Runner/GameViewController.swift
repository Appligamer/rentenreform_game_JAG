import UIKit
import WebKit

final class GameViewController: UIViewController, WKNavigationDelegate, WKUIDelegate {
  private var webView: WKWebView!
  private let schemeHandler = BundleSchemeHandler()
  private var localServer: LocalBundleHTTPServer?
  private var watchdogWorkItem: DispatchWorkItem?
  private var didUseInlinedFallback = false
  private var hasStartedInitialLoad = false
  private var foregroundObserver: NSObjectProtocol?

  deinit {
    watchdogWorkItem?.cancel()
    if let observer = foregroundObserver {
      NotificationCenter.default.removeObserver(observer)
    }
    webView?.configuration.userContentController.removeScriptMessageHandler(forName: HapticBridge.handlerName)
    localServer?.stop()
  }

  override var preferredStatusBarStyle: UIStatusBarStyle {
    return .lightContent
  }

  override func viewDidLoad() {
    super.viewDidLoad()
    view.backgroundColor = .black

    let config = BundleSchemeHandler.makeConfiguration(schemeHandler: schemeHandler)
    webView = WKWebView(frame: view.bounds, configuration: config)
    webView.translatesAutoresizingMaskIntoConstraints = false
    webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    webView.navigationDelegate = self
    webView.uiDelegate = self
    webView.isOpaque = true
    webView.backgroundColor = .black
    webView.scrollView.backgroundColor = .black
    webView.scrollView.contentInsetAdjustmentBehavior = .never
    webView.scrollView.bounces = false
    #if DEBUG
    if #available(iOS 16.4, *) {
      webView.isInspectable = true
    }
    #endif

    view.addSubview(webView)
    NSLayoutConstraint.activate([
      webView.topAnchor.constraint(equalTo: view.topAnchor),
      webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
      webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
    ])

    foregroundObserver = NotificationCenter.default.addObserver(
      forName: UIApplication.willEnterForegroundNotification,
      object: nil,
      queue: .main
    ) { [weak self] _ in
      self?.handleWillEnterForeground()
    }

    loadGame()
  }

  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    if !hasStartedInitialLoad {
      loadGame()
    }
  }

  private func handleWillEnterForeground() {
    guard !didUseInlinedFallback, let server = localServer else { return }
    let previousPort = server.port
    if let url = server.restartIfNeeded(), server.port != previousPort {
      webView.load(URLRequest(url: url))
      scheduleReadinessWatchdog(delaySeconds: 4.0)
    } else {
      verifyRootMounted(allowFallbackRetry: true)
    }
  }

  private func loadGame() {
    hasStartedInitialLoad = true
    didUseInlinedFallback = false
    watchdogWorkItem?.cancel()

    guard let webRoot = schemeHandler.webRootURL, schemeHandler.hasBundledApp else {
      webView.loadHTMLString(
        BundleSchemeHandler.fallbackHTML(reason: "Das lokale Spielpaket (WebBundle) wurde im iOS App-Bundle nicht gefunden."),
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
      loadInlinedFallback(reasonPrefix: "Lokaler HTTP-Server konnte nicht gestartet werden")
    }
  }

  private func loadInlinedFallback(reasonPrefix: String? = nil) {
    watchdogWorkItem?.cancel()
    guard !didUseInlinedFallback else {
      let msg = reasonPrefix ?? "Die Simulation konnte auf diesem Gerät nicht initialisiert werden."
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
      return count + '::' + window.location.href + '::' + logs;
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
      let details = parts.count >= 3 ? parts.dropFirst(2).joined(separator: "::") : ""

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
        UIApplication.shared.open(url)
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
    loadGame()
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
