# İyiBiri — Claude Code Handoff Notları

**Durum:** App v2.html'de 23 ekran + design system, 6 dosyalık React prototip. Bir sonraki adım: gerçek app kodbase'ine taşıma.

---

## Bitti olanlar (design-ready)

### Ekranlar (23)
**Temel (5):** Dashboard · Keşfet · Görev Detayı · Karma Marketi · Profil
**Görev durum makinesi (4):** Başvuru öncesi · Başvuruldu · Check-in · Tamamlandı
**Onboarding (4):** Hoş geldin · İlgi alanları · Konum+yarıçap · 100 Karma hediye
**Etkileşim (3):** Bildirimler · Seri (7 gün) · Leaderboard
**NGO üyelik (3):** NGO profili · Aylık planlar · Üyelik başladı
**Bağış (4):** Kampanya · Tutar seç · Özet · Teşekkürler

### Design system (ds/)
- `tokens.js` — renk, font, motion, typo tokens (`window.IYI.color/.font/.typo`)
- `icons.jsx` — 20+ line icon (tek kaynak)
- `KarmaToken.jsx` — altın sikke (4 boyut varyantı)
- `Logo.jsx` — wordmark + icon lockup'ları
- `Components.jsx` — Chip, Stat, IconButton, SegmentBar, TabBar
- `Blocks.jsx` — MissionCard, NGOCard, HeroCard, TierBadge, BottomNav, RewardCard, MetaChip
- `Screens.jsx / Screens2.jsx / Screens3.jsx` — ekran composition'ları

---

## Claude Code'a geçerken eksikler / kararlar

### 🔴 Kritik (dev başlamadan karar verilmeli)
1. **Ödeme sağlayıcı** — Bağış + üyelik akışları için. iyzico? Stripe? PayTR? Kart tokenization akışı ayrı ekran gerektirir, henüz mock.
2. **NGO onay süreci** — Mission'lara NGO başvurusu 24 saatte onaylanıyor (demo). Gerçek iş akışı: manuel mi, otomatik mi, hangi criteria?
3. **Konum servisi** — Keşfet'te harita var ama provider seçilmedi (Mapbox / Google / OSM). Harita interaction'ı sadece görsel mock.
4. **Karma ekonomisi** — Demo oranlar:
   - Görev tamamlama: 50-300 Karma (görev başına sabit)
   - Bağış: her ₺10 = +5 Karma
   - Üyelik: aylık plan başına 50/120/250 Karma
   - Onboarding hediye: 100 Karma
   - **Dev başlamadan ekonomi ekibi / ürün ile final oranlar netlenmeli.**
5. **Ödül envanteri** — Market'teki ödüller static. Gerçek partner listesi + Karma fiyatları + stok yönetimi backend gerektirir.

### 🟡 Tasarım tarafında eksik (benden ekstra iş)
- **Hata state'leri**: ağ yok, ödeme reddedildi, görev dolu, konum kapalı — henüz tasarım yok
- **Boş state'ler**: ilk kullanıcı (henüz görev yok), bildirim yok, arkadaş yok
- **Görev iptali akışı**: başvurdum ama gelemiyorum → NGO'ya nasıl iletilir
- **Arkadaş sistemi**: Leaderboard'da "Arkadaşlar" tab var ama arkadaş ekle / davet akışı yok
- **Karma detay log**: Profil'de "Karma geçmişi" listesi yok
- **Profil düzenleme**: avatar, bio, çıkar — ayarlar ekranı yok
- **Paylaşım kartı**: "Paylaş" butonları var ama paylaşım card template'i tasarlanmadı (Instagram story / WhatsApp preview)
- **Push bildirim copy**: Bildirim ekranında içerik var ama gerçek copy sistemi yok
- **Light mode**: şu an sadece dark. Karar: dark-first mi, iki mod mu?

### 🟢 Dev için notlar
- **Tipografi**: Fraunces (display, italik vurgu için) + Plus Jakarta Sans (ui) + IBM Plex Mono (numeric rarely). React Native'de `@expo-google-fonts` ile direkt.
- **İkonlar**: SVG tek dosyada (`ds/icons.jsx`). RN için `react-native-svg` ile `<Path>` olarak port edilir.
- **Renkler**: Tüm token'lar `ds/tokens.js`'te. Theme provider'a direkt taşınabilir.
- **Görev state machine**: `MissionDetailWithState` tek component, `state` prop'u ile 4 ekran renderluyor — bu pattern'i prod'da koru.
- **Animasyon**: Onboarding ve streak ekranlarında kullanılan ring/glow efektler CSS blur + radial-gradient. RN'de `react-native-svg` + `Animated` ile yapılır.

### 🔵 İş akışı / business
- **KVKK**: üyelik + bağış akışları için aydınlatma metinleri ve onay checkbox'ları eklenmeli
- **Bağış makbuzu**: e-mail ile PDF makbuz gönderme altyapısı gerekiyor (vergi indirimi için)
- **NGO sözleşmeleri**: %100 aktarım taahhüdü işlemsel olarak nasıl garanti edilecek (escrow? anında transfer?)

---

## Önerilen sıra (dev için)
1. Tokens + design system → Storybook
2. Auth + onboarding (KVKK dahil)
3. Core 5 ekran (Dashboard, Keşfet, Görev Detayı, Market, Profil)
4. Görev state machine (4 state)
5. NGO üyelik + bağış (ödeme sağlayıcı entegre)
6. Engagement (bildirim, streak, leaderboard)
7. Boş/hata state'leri + eksik tasarımlar ben ekleyeyim
