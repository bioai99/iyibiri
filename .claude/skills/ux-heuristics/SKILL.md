---
name: ux-heuristics
description: Nielsen 10 (usability heuristics) + WCAG AA erişilebilirlik temeli + İyiBiri özel UX heuristikleri. Sayfa/akış heuristik audit yaparken, bir kullanıcı deneyimi ihlali tespit ederken, veya bir UI spec'ini review ederken bu skill'i kullan. Her heuristik için "ne demek", "ihlal örneği", "şiddet skalası", ve İyiBiri kod tabanı için özel not var. Kontrast/klavye/touch target gibi a11y temel kuralları da burada.
---

# UX Heuristik Audit Kılavuzu

## 1. Nielsen 10 — heuristikler ve İyiBiri özel notları

### 1. Visibility of system status — Sistem durumu görünür olmalı
Kullanıcı her an sistemin ne yaptığını bilmeli. Loading, saving, success, error — görünür.

- **İyiBiri durumu:** `docs/page-audit.md` → hiçbir sayfada `loading.tsx` yok. 🔴 Sistemik ihlal. Dashboard data yüklemesinde skeleton yok. Mission take/complete sonrası feedback (confetti var ama karma guncelleme anında görünmüyor mu?).
- **Kontrol:** Fetch var → skeleton görünüyor mu? Mutation var → optimistik UI var mı? Network fail → toast/inline error?

### 2. Match between system and the real world — Dil ve kavramlar tanıdık olmalı
Teknik jargon değil, kullanıcının dünyasından.

- **İyiBiri durumu:** "Karma", "görev", "İyilik Öncüleri" — tanıdık. "Subscription" yerine "takip" tercihi — iyi. Ama "streak" vs "seri" (Türkçe) kullanımı tutarlı mı? Kod grep gerek.
- **Kontrol:** İngilizce terim kaçtı mı? Metafor (karma, seri, tier) tutarlı kullanılıyor mu?

### 3. User control and freedom — Çıkış yolu, geri alma
Kullanıcı yanlış yere tıklayınca kolayca geri dönebilmeli. "Geri" net.

- **İyiBiri durumu:** Mobile-first'te header'da geri ok olmalı. Her dashboard subpage'de var mı? Mission take ettikten sonra iptal etme yolu yok (HANDOFF açık karar).
- **Kontrol:** Her detay sayfasında ChevronLeft var mı? Destructive action öncesi confirm dialog var mı? Onboarding adımında geri butonu var mı?

### 4. Consistency and standards — Tutarlılık
Aynı eylem aynı şekilde, aynı renk aynı anlamda.

- **İyiBiri durumu:** Gold = primary CTA, clay = uyarı, success = pozitif — atlas net. Ama kullanım tutarlı mı? Hardcoded #E8C268 yerine `text-gold` token kullanılıyor mu? Domain renkleri sürekli kart üstünde aynı mı?
- **Kontrol:** `Grep` ile `#[0-9A-F]{6}` hardcoded renk ara. Her domain için aynı token stable mı?

### 5. Error prevention — Hataları önle
Kullanıcı yanlış yapmadan önce uyar.

- **İyiBiri durumu:** KVKK checkbox zorla checkmark yok → form submit olmalı. Password strength gösterilmeli (signup'ta var). QR scan manuel kod giriş fallback'i var (iyi).
- **Kontrol:** Form submit öncesi validasyon var mı? Destructive (unsubscribe, cancel membership) öncesi "emin misin?" var mı?

### 6. Recognition rather than recall — Tanıma, hatırlama değil
Kullanıcıya opsiyonları göster, akıldan hatırlatma.

- **İyiBiri durumu:** Bottom nav 5 item görünür — iyi. Saved missions, subscribed ngos görünür — iyi. Mission filtreleri (domain) chip olarak — iyi. Ama kullanıcı "dün kazandığım Karma ne için" → geçmiş yok (Karma log eksik, HANDOFF açık).
- **Kontrol:** Temel aksiyonlara bir tıklama kadar uzakta mı? Geçmiş/history görünüyor mu?

### 7. Flexibility and efficiency of use — Hız + seçenek
Yeni kullanıcıya rehberlik, güçlü kullanıcıya kısayol.

- **İyiBiri durumu:** Yeni için onboarding var. Ama güç kullanıcıya shortcut — örn. favori görev, mission list'te kayıtlıya hızlı erişim? `saved/` sayfa var, erişim bottom nav'da mı yok mu?
- **Kontrol:** Sık yapılan eylem (görev tamamla, Karma harca) kaç tıklama? 3+ ise çok.

### 8. Aesthetic and minimalist design — Estetik ve minimal
Gereksiz görsel yok. Her şey işe yarasın.

- **İyiBiri durumu:** Design system "warm paper" — disiplinli. Dashboard'da çok card var — **H2 hipotezi: cognitive overload**. Test edilmeli.
- **Kontrol:** Bir sayfa açınca 3'ten fazla birincil CTA var mı? Decoration (emoji, illustration) anlama hizmet ediyor mu?

### 9. Help users recognize, diagnose, and recover from errors — Hata iletişimi
Plain dille, ne oldu + nasıl düzelir.

- **İyiBiri durumu:** Error state'ler sistemik olarak yok. Supabase fetch fail → ? Payment fail (donation mock) → mockvar ama gerçek hata mesajı tasarımı yok.
- **Kontrol:** Hata mesajı Türkçe "sen" dilinde mi? Aksiyon öneriyor mu ("Yeniden dene", "Destek yaz")?

### 10. Help and documentation — Yardım + dokümantasyon
Nadir kullanılır, ama aranan bulunmalı.

- **İyiBiri durumu:** Support action var (`app/support-action.ts`) — iyi. FAQ / nasıl çalışır sayfası? Onboarding sırasında "bu ne işe yarar" açıklama mikrokopyası yeterli mi?
- **Kontrol:** Yeni gelen ilk ekranda ne yapacağını anlıyor mu? Zor noktada "Yardım" ikonu var mı?

## 2. İyiBiri özel heuristikleri (markaya özgü)

### I1. Ton tutarlılığı — "Sen" dili, sıcak, samimi
- **Kontrol:** Mikrokopya 2. tekil şahıs mı? "Kullanıcılarımız" / "siz" YANLIŞ, "sen" DOĞRU.
- **Grep:** "kullanıcı" kelimesi UI metninde geçiyorsa ihlal (sadece kod yorumunda kabul).

### I2. Karma görselliği tutarlı
- Her Karma gösterimi `+` ile ("+150 Karma"), gold renk, tabular-nums, büyük hero yerlerde 40–80px.
- **Kontrol:** KarmaCounter component her yerde mi kullanılıyor? Yoksa ad hoc render var mı?

### I3. İmpact statement her görevde
- "Bu görevle [etki]; [sonuç/his]" — iki parçalı duygusal.
- **Kontrol:** Mission card + detail sayfasında impact_statement görünüyor mu?

### I4. Seviye isimleri Title Case
- "İyi Biri", "Çok İyi Biri", "Çoook İyi Biri", "Gerçekten İyi Biri", "İyiliğin Öncüsü".
- **Kontrol:** Seviye UI'da bu formatta mı?

### I5. Bottom nav + safe area her mobile sayfada
- `.pb-safe` uygulanmış mı? Bottom nav 5 item, fixed.
- **Kontrol:** Dashboard subpage'lerin hepsinde content'in altında bottom nav'a yer var mı?

### I6. Hero glow imzası
- Dashboard hero, tier badge gibi primary yerlerde `shadow-[0_8px_32px_rgba(251,146,60,0.35)]`.
- **Kontrol:** İmza gölge kullanım tutarlı mı?

## 3. A11y temel (WCAG AA + mobile)

### Kontrast
- Metin / background kontrastı AA: normal text ≥4.5:1, büyük text (18pt+) ≥3:1.
- Atlas paleti kombinasyonları:
  - `ink-900 (#24201B)` × `cream (#F4EEDF)` → yüksek (15+) ✅
  - `gold (#E8C268)` × `ink-800 (#2E2923)` → ~8 ✅
  - `gold-dim (#B58F3D)` × `cream` → **sınırda**, kontrol et.
  - `ink-400 (#7A6F5E)` × `cream` → **AA sınır** muted text için, büyük boyda ok.

### Focus order + keyboard
- Tab ile sayfa dolaşılabilir mi?
- `outline` kapalı mı (globals.css `-webkit-tap-highlight-color: transparent`) — **klavye kullanıcısı için focus ring zorunlu**, ayrı `focus-visible:ring-2 ring-ring` kontrol.

### Touch target
- ≥44×44px (Apple HIG + WCAG). Küçük ikonlar için padding ile.
- **Kontrol:** `IconButton`, small `Chip`, close button — tap alanı yeterli mi?

### Screen reader
- `<button>` vs `<div onClick>` — button olmalı.
- Image → `alt` text.
- Icon-only button → `aria-label`.
- Heading hierarchy (h1 → h2 → h3) — atlanmamalı.

### Reduced motion
- `globals.css` zaten `@media (prefers-reduced-motion: reduce)` ile mockup animasyonları kapatıyor — iyi. Ama Framer Motion animasyonlarının da bu kural altında durması lazım (`useReducedMotion` hook kullanımı).

## 4. Şiddet skalası

| Skor | Anlam | Aksiyon |
|---|---|---|
| 1 | Cosmetic | Fix when convenient |
| 2 | Minor | Next release |
| 3 | Major | Current release |
| 4 | Catastrophic | Blocks release — acil |

A11y ihlalleri default olarak minimum 3; kontrast fail 4.

## 5. Audit yürütürken checklist

- [ ] Sayfanın tsx dosyası Read edildi mi?
- [ ] Route + durum (mock/beta/prod) not alındı mı?
- [ ] 10 Nielsen heuristiği tek tek sorgulandı mı?
- [ ] 6 İyiBiri özel heuristiği kontrol edildi mi?
- [ ] A11y: kontrast + keyboard + touch + sreader kontrolü
- [ ] En kritik 3 ihlal "hızlı kazanım" olarak öne çıktı mı?
- [ ] Her ihlal için: heuristik + şiddet + kanıt + öneri
- [ ] Öneriler implementation değil, UX brief tonunda mı?

Checklist tam değilse audit sonlandırılmaz.
