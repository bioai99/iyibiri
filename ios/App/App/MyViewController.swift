import UIKit
import Capacitor

class MyViewController: CAPBridgeViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        guard let webView = self.webView else { return }

        // WebView'u tam ekrana yay (safe area'nın arkasına)
        webView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])

        // Otomatik inset ekleme — CSS env() doğru değer dönsün
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.scrollView.contentInset = .zero

        // Sayfa bounce'unu kapat
        webView.scrollView.bounces = false

        // Scroll indicator'ları gizle
        webView.scrollView.showsVerticalScrollIndicator = false
        webView.scrollView.showsHorizontalScrollIndicator = false

        // Arka plan rengini app ile eşleştir
        let bgColor = UIColor(red: 0.141, green: 0.125, blue: 0.106, alpha: 1.0) // #24201B
        webView.isOpaque = false
        webView.backgroundColor = bgColor
        webView.scrollView.backgroundColor = bgColor
    }
}
