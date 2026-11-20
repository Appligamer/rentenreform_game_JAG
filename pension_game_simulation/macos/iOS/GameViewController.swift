import UIKit
import WebKit

final class GameViewController: UIViewController, WKNavigationDelegate {
  private var webView: WKWebView!
  private let schemeHandler = BundleSchemeHandler()

  override var preferredStatusBarStyle: UIStatusBarStyle {
    return .lightContent
  }

  override func viewDidLoad() {
    super.viewDidLoad()
    view.backgroundColor = .black

    let config = BundleSchemeHandler.makeConfiguration(schemeHandler: schemeHandler)
    webView = WKWebView(frame: view.bounds, configuration: config)
    webView.translatesAutoresizingMaskIntoConstraints = false
    webView.navigationDelegate = self
    webView.isOpaque = true
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
    if schemeHandler.hasBundledApp {
      webView.load(URLRequest(url: BundleSchemeHandler.entryURL))
    } else {
      webView.loadHTMLString(
        BundleSchemeHandler.fallbackHTML(reason: "Das lokale Spielpaket (WebBundle) wurde im iOS App-Bundle nicht gefunden."),
        baseURL: nil
      )
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
