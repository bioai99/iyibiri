# 004. V1'de dark-only tema, light mode Yıl 2 opt-in

**Tarih:** 2026-04-24
**Durum:** **Accepted (2026-04-24)** ✅
**Önerici:** product-analyst (ui-designer D1-D5 önerisine paralel)

## Bağlam

İyiBiri'nin mevcut design system ayrışık durumda (atlas Bölüm 6):
- Dashboard layout `.dark` class hedefli + CSS token'ları tanımlı.
- Dashboard layout.tsx `ThemeProvider initial="light"` → tutarsızlık.
- `design-system/README.md` eski palet (amber + Inter) diyor; tailwind.config.ts "Premium × Warm" (ink + cream + gold + Fraunces) gerçek palet.
- Light mode desteği cream bg için tanımlı ama eksiksiz değil.

Light mode eklemek: her component × renk kombinasyonu × state için ek QA, ui-designer'ın 02-design-system audit zamanı 2-3 hafta.

## Karar

**V1 dark-only olarak lansman. Light mode Yıl 2 opt-in feature olarak eklenecek.**

- Dashboard layout `.dark` class force on (ThemeProvider davranışı düzeltilecek).
- Landing + auth + onboarding zaten light mode'da kalır (warm paper palette) — V1'de değişmez.
- `prefers-color-scheme` respect edilmeyecek (V1 sabit dark dashboard).
- Yıl 2'de profil settings'te "Görünüm: Otomatik / Dark / Light" seçim eklenir → kullanıcı opt-in.

## Sonuçlar

**İyi:**
- Design system disiplini — tek mod üzerinde optimizasyon, token tutarlılığı.
- QA iş yükü azalır (her state × mod QA yerine tek mod).
- "Premium × Warm" teması karakter öne çıkar — dark mode İyiBiri imzası olarak pazarlanabilir.
- Accessibility kontrastı dark için optimize (ink-900 × cream text AA seviyesi).

**Kötü:**
- Günışığı / outdoor kullanımı zor — dashboard ekran parlaklığına duyarlı.
- Kullanıcı beklentisi (sistem ayarına uyum) karşılanmaz → bazı kullanıcı "otomatik mod" arar.
- A11y değerlendirmesi: dark mode bazı görme engellilerde daha iyi, bazıları için daha kötü — opt-in olmayınca minörityi kapsamaz.

**Uygulama:**
- `app/dashboard/layout.tsx` ThemeProvider initial="dark" olarak değiştir (küçük fix).
- CSS `:root` varsayılan light, `.dark` override — kurallar değişmez.
- UI designer (ui-designer agent) D1-D5 audit'ı bu karara dayanarak ilerler: `design-system/README.md` retire edilir veya güncellenir, tema-mode dokümantasyonu atlas'a yazılır.

**V2 light mode uygulaması:**
- Yıl 2 için ayrı ADR açılır.
- `user_preferences.theme_mode` enum ('auto' | 'dark' | 'light') profile'a eklenir.
- Light mode token seti tamamlanır (ink-900 × cream ters), her component QA.

**Bağlı kararlar:**
- ui-designer D1 (README güncelleme) bu kararla destekleniyor.
- ui-designer D2 (.dark class davranış) bu kararla netleşiyor — force on.

## Referanslar

- Atlas: `docs/project-atlas.md` Bölüm 6 (design system gerçek)
- UI playbook: `docs/ui/00-playbook.md` aktif soru D5
- Strateji: `docs/strategy/06-memos/2026-04-23-stratejik-manzara-sentez.md` "no-go" listesi #3

**İlgili soru:** Q5 — Proposed, kullanıcı onayı bekliyor.
