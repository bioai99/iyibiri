import UIKit
import Capacitor

class MyViewController: CAPBridgeViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        guard let webView = self.webView else { return }

        // Scroll ayarları
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.scrollView.bounces = false
        webView.scrollView.showsVerticalScrollIndicator = false
        webView.scrollView.showsHorizontalScrollIndicator = false

        // Arka plan rengi
        let bgColor = UIColor(red: 0.141, green: 0.125, blue: 0.106, alpha: 1.0)
        webView.backgroundColor = bgColor
        webView.scrollView.backgroundColor = bgColor
    }
}
