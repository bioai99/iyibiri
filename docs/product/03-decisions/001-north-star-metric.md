# 001. Kuzey Yıldızı metriği olarak Aylık Karma Kazanan Kullanıcı (MAKE) kullan

**Tarih:** 2026-04-24
**Durum:** **Accepted (2026-04-24)** ✅
**Önerici:** product-analyst (strategy-consultant önerisinden türetildi)

## Bağlam

İyiBiri 6 gelir kolu, 3 pillar ve 11 aday workstream ile genişleyen bir ürün. Her workstream'in başarı kriteri tek bir "pusula metriği" ile hizalanmazsa, ölçüm kaosu olur. Alternatifler:

- **MAU (Monthly Active User):** standart mobil metrik ama "açma" = "değer yaratma" değil.
- **Aylık Aktif Bağışçı:** V1'de bağış yok (ADR-006) — erken gösterge değil.
- **Weekly Retention (W4):** LTV öngörüsü güçlü ama iç disiplin metriği, liderlik iletişimi için soyut.
- **Monthly Active Karma Earner (MAKE):** ay içinde en az 1 görev tamamlamış, en az 1 Karma kazanmış kullanıcı.

Strateji memosu (`docs/strategy/06-memos/2026-04-23-stratejik-manzara-sentez.md`) karar tablosunda MAKE önerilmişti. Her gelir kolu (sponsor aracılık, premium, üyelik, ödül redemption) ve üç pillar (Karma Loop, Sponsor Reward, STK Ekosistem) buna bağlı — tek sinyal hepsini özetliyor.

## Karar

**North-star metric (NSM) = Aylık Karma Kazanan Kullanıcı (MAKE).**

Tanım: "Bir ay içinde en az bir görev tamamlayarak en az 1 Karma kazanmış benzersiz kullanıcı sayısı."

Ölçüm noktası: `karma_transactions.type = 'mission_complete'` row'u olan distinct `user_id`'ler, rolling 30 gün.

Secondary (guardrail) metrikler:
- **W4 retention of activated users** — aktif Karma kazanan kohort'un 4. hafta geri dönüş oranı.
- **Karma per MAKE** — aktif kullanıcı başına ay ortalama Karma (engagement derinliği).
- **First-mission time** — onboarding → ilk görev tamamlama medyan süresi.

## Sonuçlar

**İyi:**
- Her gelir kolu MAKE'e bağlanıyor — ölçüm birleşir.
- Kullanıcı davranışı "değer yaratma" olarak ölçülüyor, "sadece açma" değil.
- Mevcut `karma_transactions` tablosu zaten tetikleyici — ek altyapı minimum.

**Kötü:**
- Metric gaming riski: kullanıcılar mikro görevlerle Karma biriktirip gerçek katkı yapmayabilir. Guardrail "Karma per MAKE" bunu yakalar.
- Premium/bağış kullanıcısı ayrı görünür olmayabilir — secondary cohort metrikleri gerekir.
- MAU'dan daha muhafazakar sayıda olur (örn. %60-70'i MAU'nun). Yatırımcı/ekip eğitimi şart.

**Uygulama:**
- Analytics katmanı (V1 basit): Supabase view `monthly_active_karma_earners` + rolling calculation.
- Dashboard (Faz 2 `release-manager` bağlı): haftalık otomatik rapor.
- Target (Y1): Ay 12 → 10.000 MAKE (konservatif); Ay 12 → 30.000 (orta senaryo). Revenue memo'sundaki 500k MAU orta senaryosuna göre MAKE ≈ %60 → 300k. Y1 için çok daha mütevazı hedef.

**Bağlı kararlar:**
- Tüm workstream'lerin "başarı kriteri" bölümünde MAKE veya türevi olmalı.
- Karma formülü (Workstream 5) MAKE'in kalitesini etkiler — deterministik olması metric gaming'i azaltır.

## Referanslar

- Strateji: `docs/strategy/05-focus/2026-04-23-blue-ocean-stratejik-odak.md` PILLAR 1
- Strateji: `docs/strategy/06-memos/2026-04-23-stratejik-manzara-sentez.md` karar tablosu
- Benchmark: Duolingo MAU→premium %8.8 [S10], Day-30 retention benchmark %30-40 [S14]

**İlgili soru:** Q1 açık kuyrukta — bu ADR Proposed ise `resolved.md` taşıma bekliyor.
