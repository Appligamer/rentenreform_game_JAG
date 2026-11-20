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
class MainFlutterWindow: NSWindow, WKNavigationDelegate {
  private var webView: WKWebView!
  private let schemeHandler = BundleSchemeHandler()

  override func awakeFromNib() {
    let config = BundleSchemeHandler.makeConfiguration(schemeHandler: schemeHandler)
    #if DEBUG
    config.preferences.setValue(true, forKey: "developerExtrasEnabled")
    #endif

    self.title = "Generation Zukunft — Renten-Simulation (econo=me)"
    self.styleMask.insert([.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView])
    self.titlebarAppearsTransparent = true
    self.titleVisibility = .hidden
    self.backgroundColor = NSColor(red: 0.0, green: 0.0, blue: 0.0, alpha: 1.0)
    self.isOpaque = true

    let container = self.contentView ?? NSView(frame: NSRect(x: 0, y: 0, width: 1280, height: 800))
    self.contentView = container

    webView = WKWebView(frame: container.bounds, configuration: config)
    webView.autoresizingMask = [.width, .height]
    webView.navigationDelegate = self
    if #available(macOS 12.0, *) {
      webView.underPageBackgroundColor = NSColor.black
    }

    container.addSubview(webView)
    loadApp()

    super.awakeFromNib()
  }

  private func loadApp() {
    if schemeHandler.hasBundledApp {
      webView.load(URLRequest(url: BundleSchemeHandler.entryURL))
    } else {
      webView.loadHTMLString(
        BundleSchemeHandler.fallbackHTML(reason: "Das lokale Spielpaket (WebBundle) wurde im App-Bundle nicht gefunden."),
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
#endif
