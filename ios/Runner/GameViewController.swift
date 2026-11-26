import UIKit
import WebKit

final class GameViewController: UIViewController, WKNavigationDelegate {
  private var webView: WKWebView!
  private let schemeHandler = BundleSchemeHandler()
  private var localServer: LocalBundleHTTPServer?

  deinit {
    localServer?.stop()
  }

  override var preferredStatusBarStyle: UIStatusBarStyle {
    return .lightContent
  }

  override func viewDidLoad() {
    super.viewDidLoad()
    view.backgroundColor = .black

    let config = BundleSchemeHandler.makeConfiguration(schemeHandler: schemeHandler)
    webView = WKWebView(frame: .zero, configuration: config)
    webView.translatesAutoresizingMaskIntoConstraints = false
    webView.navigationDelegate = self
    webView.isOpaque = false
    webView.backgroundColor = .black
    webView.scrollView.backgroundColor = .black
    webView.scrollView.contentInsetAdjustmentBehavior = .never
    webView.scrollView.bounces = false

    view.addSubview(webView)
    NSLayoutConstraint.activate([
      webView.topAnchor.constraint(equalTo: view.topAnchor),
      webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
      webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
    ])

    loadGame()
  }

  private func loadGame() {
    guard let webRoot = schemeHandler.webRootURL, schemeHandler.hasBundledApp else {
      webView.loadHTMLString(
        BundleSchemeHandler.fallbackHTML(reason: "Das lokale Spielpaket (WebBundle) wurde im iOS App-Bundle nicht gefunden."),
        baseURL: nil
      )
      return
    }

    if let server = LocalBundleHTTPServer(rootURL: webRoot) {
      self.localServer = server
      server.start { [weak self] url in
        guard let self else { return }
        if let url {
          self.webView.load(URLRequest(url: url))
        } else {
          self.webView.load(URLRequest(url: BundleSchemeHandler.entryURL))
        }
      }
    } else {
      webView.load(URLRequest(url: BundleSchemeHandler.entryURL))
    }
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { [weak self] in
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
        let parts = text.split(separator: ":", maxSplits: 2, omittingEmptySubsequences: false)
        if let first = parts.first, let count = Int(first), count == 0 {
          let details = parts.count >= 3 ? String(parts[2]) : ""
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
