# 003. V1 lansmanını İstanbul pilot olarak başlat

**Tarih:** 2026-04-24
**Durum:** **Accepted (2026-04-24)** ✅
**Önerici:** product-analyst

## Bağlam

Ürün V1 lansmanı coğrafi kapsam kararı gerektiriyor. Seçenekler:
- **A)** Türkiye geneli — her yerden görev oluşabilir, maksimum erişim.
- **B)** İstanbul pilot — görevler sadece İstanbul + online.
- **C)** 3 büyükşehir (İstanbul + Ankara + İzmir).
- **D)** Mikro-pilot (İstanbul tek ilçe, örn. Kadıköy).

Strateji pazar memosu (`docs/strategy/01-market/2026-04-23-tr-gonullulk-bagis-pazari-ilk-tur.md`): SAM'ın ~%30'u İstanbul'da, yoğunluk + STK ofis yoğunluğu + sponsor marka temaslı avantaj.

## Karar

**V1 lansmanı = İstanbul pilot + online/remote görevler her yerden.**

- `missions.location_type = 'field' | 'on_site_*'` olan görevler İstanbul merkezli.
- `missions.location_type = 'remote'` her yerden yapılabilir.
- Filtre: UI'da "İstanbul" ve "Online" iki seçenek var; diğer şehir yok. V1.1 genişlemeye hazır.
- Kullanıcı kaydı herhangi yerden — görev arzı İstanbul-merkezli.
- Pilot 3 STK (ADR-005) İstanbul ofislerini öncelikli verir.

## Sonuçlar

**İyi:**
- Coğrafi yoğunluk → topluluk hızlı form alır, network etkisi başlar.
- Sponsor marka temsilci + STK partnership müzakere İstanbul'da tek konumda.
- Product-market fit sinyali dar alanda daha hızlı ölçülür.
- Pazar memosu tahminiyle 2-3M 18-34 dijital yerli İstanbul'da erişilebilir.

**Kötü:**
- Türkiye geneli kullanıcı "bende görev yok" deneyimi → ilk hayal kırıklığı riski. UI'da "Yakında şehrinde" mesajı + online görev vurgusu şart.
- STK'lar genelde ulusal ağlı (TEMA 80+ il) — sadece İstanbul görev yayınlama gereksinimi müzakere gerektirir.
- Marketing bütçesi İstanbul-merkezli konumlandırılmalı.

**Uygulama:**
- `missions` tablosuna `city` text (STK oluştururken seçer) veya `location_city` enum Workstream 5'te.
- Onboarding'de lokasyon seçimi zaten var (`/onboarding/city`) — İstanbul dışı seçenler "online görevler" akışına yönlendirilir.
- UI banner: "V1'de İstanbul + online aktif — yakında şehrinde!"
- Analytics: İstanbul-dışı kullanıcı edinimi + retention farkı takip.

**Bağlı kararlar:**
- ADR-005 (pilot 3 STK) İstanbul ofisleri hedef.
- Workstream 2 (STK pilot onboarding) kapsamı İstanbul.
- V1.1 (Ay 6-9) Ankara + İzmir genişleme — ADR-003-v2 açılır.

## Referanslar

- Strateji: `docs/strategy/01-market/2026-04-23-tr-gonullulk-bagis-pazari-ilk-tur.md` segment haritası
- Strateji: `docs/strategy/06-memos/2026-04-23-stratejik-manzara-sentez.md` karar tablosu

**İlgili soru:** Q4 — Proposed, kullanıcı onayı bekliyor.
