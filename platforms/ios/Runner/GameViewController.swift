import UIKit
import WebKit

final class GameViewController: UIViewController, WKNavigationDelegate, WKUIDelegate {
  private var webView: WKWebView?
  private let schemeHandler = BundleSchemeHandler()
  private var localServer: LocalBundleHTTPServer?
  private var watchdogWorkItem: DispatchWorkItem?
  private var didUseInlinedFallback = false
  private var hasStartedInitialLoad = false
  private var webContentTerminationCount = 0
  private var foregroundObserver: NSObjectProtocol?
  private var backgroundObserver: NSObjectProtocol?

  private let loadingContainer = UIView()
  private let loadingSpinner = UIActivityIndicatorView(style: .large)
  private let loadingTitleLabel = UILabel()
  private let loadingStatusLabel = UILabel()
  private let retryButton = UIButton(type: .system)

  deinit {
    watchdogWorkItem?.cancel()
    if let observer = foregroundObserver {
      NotificationCenter.default.removeObserver(observer)
    }
    if let observer = backgroundObserver {
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
    setupNativeOverlayUI()

    foregroundObserver = NotificationCenter.default.addObserver(
      forName: UIApplication.willEnterForegroundNotification,
      object: nil,
      queue: .main
    ) { [weak self] _ in
      self?.handleWillEnterForeground()
    }

    backgroundObserver = NotificationCenter.default.addObserver(
      forName: UIApplication.didEnterBackgroundNotification,
      object: nil,
      queue: .main
    ) { [weak self] _ in
      self?.handleDidEnterBackground()
    }
  }

  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    guard !hasStartedInitialLoad else { return }
    hasStartedInitialLoad = true
    DispatchQueue.main.async { [weak self] in
      self?.initializeWebViewAndLoad()
    }
  }

  private func setupNativeOverlayUI() {
    loadingContainer.translatesAutoresizingMaskIntoConstraints = false
    loadingContainer.backgroundColor = .black

    let stack = UIStackView()
    stack.translatesAutoresizingMaskIntoConstraints = false
    stack.axis = .vertical
    stack.alignment = .center
    stack.spacing = 12

    loadingSpinner.color = UIColor(red: 0.96, green: 0.62, blue: 0.04, alpha: 1.0)
    loadingSpinner.startAnimating()

    loadingTitleLabel.text = "Generation Zukunft"
    loadingTitleLabel.textColor = UIColor(red: 0.96, green: 0.96, blue: 0.97, alpha: 1.0)
    loadingTitleLabel.font = UIFont.systemFont(ofSize: 20, weight: .bold)
    loadingTitleLabel.textAlignment = .center

    loadingStatusLabel.text = "Simulation wird vorbereitet…"
    loadingStatusLabel.textColor = UIColor(red: 0.53, green: 0.53, blue: 0.55, alpha: 1.0)
    loadingStatusLabel.font = UIFont.systemFont(ofSize: 14, weight: .regular)
    loadingStatusLabel.textAlignment = .center
    loadingStatusLabel.numberOfLines = 0

    retryButton.setTitle("Erneut laden", for: .normal)
    retryButton.setTitleColor(.black, for: .normal)
    retryButton.backgroundColor = UIColor(red: 0.96, green: 0.62, blue: 0.04, alpha: 1.0)
    retryButton.titleLabel?.font = UIFont.systemFont(ofSize: 15, weight: .semibold)
    retryButton.layer.cornerRadius = 10
    retryButton.contentEdgeInsets = UIEdgeInsets(top: 10, left: 20, bottom: 10, right: 20)
    retryButton.isHidden = true
    retryButton.addTarget(self, action: #selector(handleRetryTapped), for: .touchUpInside)

    stack.addArrangedSubview(loadingSpinner)
    stack.addArrangedSubview(loadingTitleLabel)
    stack.addArrangedSubview(loadingStatusLabel)
    stack.addArrangedSubview(retryButton)

    loadingContainer.addSubview(stack)
    view.addSubview(loadingContainer)

    NSLayoutConstraint.activate([
      loadingContainer.topAnchor.constraint(equalTo: view.topAnchor),
      loadingContainer.bottomAnchor.constraint(equalTo: view.bottomAnchor),
      loadingContainer.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      loadingContainer.trailingAnchor.constraint(equalTo: view.trailingAnchor),

      stack.centerXAnchor.constraint(equalTo: loadingContainer.centerXAnchor),
      stack.centerYAnchor.constraint(equalTo: loadingContainer.centerYAnchor),
      stack.leadingAnchor.constraint(greaterThanOrEqualTo: loadingContainer.leadingAnchor, constant: 28),
      stack.trailingAnchor.constraint(lessThanOrEqualTo: loadingContainer.trailingAnchor, constant: -28),
    ])
  }

  private func showNativeStatus(message: String, showRetry: Bool) {
    loadingSpinner.isHidden = showRetry
    if showRetry {
      loadingSpinner.stopAnimating()
    } else {
      loadingSpinner.startAnimating()
    }
    loadingStatusLabel.text = message
    retryButton.isHidden = !showRetry
    loadingContainer.alpha = 1
    loadingContainer.isHidden = false
    view.bringSubviewToFront(loadingContainer)
  }

  private func hideNativeOverlay() {
    guard !loadingContainer.isHidden else { return }
    UIView.animate(withDuration: 0.2, animations: { [weak self] in
      self?.loadingContainer.alpha = 0
    }) { [weak self] _ in
      self?.loadingContainer.isHidden = true
      self?.loadingSpinner.stopAnimating()
    }
  }

  @objc private func handleRetryTapped() {
    webContentTerminationCount = 0
    showNativeStatus(message: "Simulation wird neu gestartet…", showRetry: false)
    loadGame()
  }

  private func initializeWebViewAndLoad() {
    if webView == nil {
      let config = BundleSchemeHandler.makeConfiguration(schemeHandler: schemeHandler)
      let wv = WKWebView(frame: view.bounds, configuration: config)
      wv.translatesAutoresizingMaskIntoConstraints = false
      wv.autoresizingMask = [.flexibleWidth, .flexibleHeight]
      wv.navigationDelegate = self
      wv.uiDelegate = self
      wv.isOpaque = true
      wv.backgroundColor = .black
      wv.scrollView.backgroundColor = .black
      wv.scrollView.contentInsetAdjustmentBehavior = .never
      wv.scrollView.bounces = false
      #if DEBUG
      if #available(iOS 16.4, *) {
        wv.isInspectable = true
      }
      #endif

      view.insertSubview(wv, belowSubview: loadingContainer)
      NSLayoutConstraint.activate([
        wv.topAnchor.constraint(equalTo: view.topAnchor),
        wv.bottomAnchor.constraint(equalTo: view.bottomAnchor),
        wv.leadingAnchor.constraint(equalTo: view.leadingAnchor),
        wv.trailingAnchor.constraint(equalTo: view.trailingAnchor),
      ])
      self.webView = wv
    }

    loadGame()
  }

  private func handleDidEnterBackground() {
    watchdogWorkItem?.cancel()
    if !didUseInlinedFallback {
      localServer?.stop()
    }
  }

  private func handleWillEnterForeground() {
    guard webView != nil, !didUseInlinedFallback, let server = localServer else { return }
    let previousPort = server.port
    DispatchQueue.global(qos: .userInitiated).async { [weak self] in
      let url = server.restartIfNeeded()
      DispatchQueue.main.async {
        guard let self, let webView = self.webView else { return }
        if let url, server.port != previousPort {
          webView.load(URLRequest(url: url))
          self.scheduleReadinessWatchdog(delaySeconds: 3.5)
        } else {
          self.verifyRootMounted(allowFallbackRetry: true)
        }
      }
    }
  }

  private func loadGame() {
    didUseInlinedFallback = false
    watchdogWorkItem?.cancel()

    guard let webRoot = schemeHandler.webRootURL, schemeHandler.hasBundledApp else {
      showNativeStatus(
        message: "Das lokale Spielpaket (WebBundle) wurde im iOS App-Bundle nicht gefunden.",
        showRetry: true
      )
      return
    }

    if localServer == nil {
      localServer = LocalBundleHTTPServer(rootURL: webRoot)
    }

    let server = localServer
    DispatchQueue.global(qos: .userInitiated).async { [weak self] in
      let url = server?.restartIfNeeded()
      DispatchQueue.main.async {
        guard let self, let webView = self.webView else { return }
        if let url {
          webView.load(URLRequest(url: url))
          self.scheduleReadinessWatchdog(delaySeconds: 3.5)
        } else {
          self.loadInlinedFallback(reasonPrefix: "Lokaler HTTP-Server konnte nicht gestartet werden")
        }
      }
    }
  }

  private func loadInlinedFallback(reasonPrefix: String? = nil) {
    watchdogWorkItem?.cancel()
    guard let webView else { return }
    guard !didUseInlinedFallback else {
      let msg = reasonPrefix ?? "Die Simulation konnte auf diesem Gerät nicht initialisiert werden."
      showNativeStatus(message: msg, showRetry: true)
      return
    }
    didUseInlinedFallback = true
    showNativeStatus(message: "Offline-Modus wird aktiviert…", showRetry: false)

    if let webRoot = schemeHandler.webRootURL,
       let inlinedHTML = BundleSchemeHandler.buildInlinedAppHTML(webRoot: webRoot) {
      webView.loadHTMLString(inlinedHTML, baseURL: BundleSchemeHandler.entryURL)
      scheduleReadinessWatchdog(delaySeconds: 3.0)
    } else {
      webView.load(URLRequest(url: BundleSchemeHandler.entryURL))
      scheduleReadinessWatchdog(delaySeconds: 3.0)
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
    guard let webView else { return }
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
          self.showNativeStatus(
            message: "WebView-Initialisierung fehlgeschlagen: \(error.localizedDescription)",
            showRetry: true
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

      if count > 0 {
        self.watchdogWorkItem?.cancel()
        self.hideNativeOverlay()
      } else {
        if allowFallbackRetry && !self.didUseInlinedFallback {
          self.loadInlinedFallback(reasonPrefix: details)
        } else {
          let msg = details.isEmpty
            ? "Die Simulation konnte nicht initialisiert werden (leerer Root-Container)."
            : "Startfehler: \(details)"
          self.showNativeStatus(message: msg, showRetry: true)
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
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) { [weak self] in
      self?.verifyRootMounted(allowFallbackRetry: false)
    }
    scheduleReadinessWatchdog(delaySeconds: 2.2)
  }

  func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
    handleNavigationFailure(error)
  }

  func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
    handleNavigationFailure(error)
  }

  func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
    webContentTerminationCount += 1
    if webContentTerminationCount == 1 {
      loadInlinedFallback(reasonPrefix: "WebKit-Prozess wurde vom System neu gestartet")
    } else if webContentTerminationCount == 2 {
      webView.reload()
    } else {
      showNativeStatus(
        message: "Der iOS WebKit-Prozess wurde wiederholt beendet (Speicher/Systemlimit). Tippe auf „Erneut laden“.",
        showRetry: true
      )
    }
  }

  private func handleNavigationFailure(_ error: Error) {
    let nsError = error as NSError
    if nsError.domain == NSURLErrorDomain && nsError.code == NSURLErrorCancelled {
      return
    }
    if !didUseInlinedFallback {
      loadInlinedFallback(reasonPrefix: "Ladefehler: \(error.localizedDescription)")
    } else {
      showNativeStatus(message: "Ladefehler: \(error.localizedDescription)", showRetry: true)
    }
  }
}
