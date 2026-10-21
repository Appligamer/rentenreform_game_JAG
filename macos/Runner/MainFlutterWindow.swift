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
  var webView: WKWebView!

  override func awakeFromNib() {
    let config = WKWebViewConfiguration()
    config.preferences.setValue(true, forKey: "developerExtrasEnabled")

    self.title = "Generation Zukunft — Renten-Simulation (econo=me)"
    self.styleMask.insert([.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView])
    self.titlebarAppearsTransparent = true
    self.titleVisibility = .hidden
    self.backgroundColor = NSColor(red: 0.0, green: 0.0, blue: 0.0, alpha: 1.0)

    let contentView = self.contentView ?? NSView(frame: NSRect(x: 0, y: 0, width: 1280, height: 800))
    self.contentView = contentView

    webView = WKWebView(frame: contentView.bounds, configuration: config)
    webView.autoresizingMask = [.width, .height]
    webView.navigationDelegate = self
    webView.setValue(false, forKey: "drawsBackground")
    
    contentView.addSubview(webView)

    // Load web dist if available, else connect to local dev server
    if let htmlPath = Bundle.main.path(forResource: "index", ofType: "html", inDirectory: "dist") {
      let fileUrl = URL(fileURLWithPath: htmlPath)
      webView.loadFileURL(fileUrl, allowingReadAccessTo: fileUrl.deletingLastPathComponent())
    } else if let localUrl = URL(string: "http://localhost:3000") {
      let request = URLRequest(url: localUrl)
      webView.load(request)
    }

    super.awakeFromNib()
  }
}
#endif
