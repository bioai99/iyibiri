# Pattern F — KVKK Label Click Delegation

**Tespit eden:** test-engineer (regression vol-3, 2026-04-26)
**Tarih:** 2026-04-26 16:50
**Etkilenen bug'lar:** BUG-012 (KVKK label click visual state'i tetiklemiyor)
**Severity:** P1 (UX — kullanıcı KVKK'yı tıkladığını sansa state değişmiyor)
**Etkilenen kullanıcı segmenti:** Tüm signup yapan kullanıcılar

## Kök neden

Sprint Vol-1'de KVKK checkbox a11y için native `<input type="checkbox">` refactor edildi (BUG-006 fix). DOM'da native input var (✅) ama label'a click yapıldığında React state update'i tetiklenmiyor. JS ile `cb.click()` doğrudan çağrıldığında state değişiyor (visual update geliyor).

Bu **delegation** problemi: label-input wire'ı tam çalışmıyor.

## Kanıt

Test akışı:
1. /auth/signup açıldı, KVKK label boş kare görünüyor
2. Visual click `(40, 620)` koordinata yapıldı (label alanı)
3. Screenshot: hala boş kare, "Hesabımı oluştur" disabled
4. JS: `document.querySelector('input[type="checkbox"]').click()` çağrıldı
5. Screenshot: gold ✓ visible, button gold/aktif

Conclusion: label click → input click delegation broken.

## Hipotezler

### H1 — `htmlFor` mismatch
Label'ın `htmlFor` attribute'u input'un `id` ile uyumsuz olabilir.
```tsx
<label htmlFor="kvkk-consent">  ✅ doğru
<input id="kvkk-consent" type="checkbox">
```

Sprint Vol-1 fix önerisi'nde bu doğru yapılmıştı, ama gerçek implementation farklı olabilir.

### H2 — `pointer-events: none` overlay
Label'ın üzerinde başka bir element (`span`, custom checkbox visual) `pointer-events: none` set edilmemiş, click'i absorbe ediyor olabilir.

### H3 — visually-hidden input click target dışında
Native input `position: absolute; opacity: 0` ile visually-hidden yapıldı. Eğer width/height 0 veya etrafına z-index doğru ayarlanmadıysa, label click input'a propagate olmaz.

### H4 — React controlled input + onChange yerine onClick
Native `<input>`'ın `onChange` handler'ı eksik veya yanlış scope'ta — click event input'a ulaşıyor ama state güncelleme tetiklenmiyor.

## Önerilen sistemik fix

### A — Native HTML pattern (basit + güvenli)

```tsx
<label htmlFor="kvkk-consent" style={{ display: 'flex', cursor: 'pointer' }}>
  <input
    id="kvkk-consent"
    type="checkbox"
    checked={accepted}
    onChange={(e) => setAccepted(e.target.checked)}
    style={{
      // Native checkbox visible-but-styled (en basit):
      width: 18,
      height: 18,
      accentColor: c.gold,  // Modern CSS, auto theme
      cursor: 'pointer',
      flexShrink: 0,
    }}
    aria-describedby="kvkk-desc"
  />
  <span id="kvkk-desc" style={{ marginLeft: 10 }}>
    <strong>KVKK Aydınlatma Metni</strong>'ni okudum, kabul ediyorum...
  </span>
</label>
```

`accent-color: c.gold` (CSS) — native checkbox'ı tema renginde göstermek için. Browser native click delegation otomatik çalışır, custom visual katman gereksiz.

### B — Custom visual + invisible input (mevcut pattern, fix)

Eğer custom visual kalsın isteniyorsa:
- Input `position: absolute; inset: 0; opacity: 0; cursor: pointer; z-index: 1` (label'ı tamamen kaplayacak)
- Visual span `pointer-events: none` (click input'a passes)
- Label `position: relative`

Bu düzgün uygulanırsa label tap = input tap = state update.

### C — Verify (regression test)

Native test:
1. /auth/signup
2. Mouse ile KVKK label'a tıkla
3. Beklenen: ✓ gold check görünür, button aktif

A11y test:
1. Tab ile KVKK input'a focus
2. Space tuşuna bas
3. Beklenen: ✓ toggle, focus ring görünür

## Dosyalar etkilenen

- `app/auth/signup/page.tsx` — KVKK label/input wire fix

## Estimated effort

- Fix (Option A native): 15 dk
- Fix (Option B custom): 30 dk
- Verify regression: 5 dk

**Toplam:** ~30 dk

## Handoff

- **Lead:** frontend-engineer (KVKK component fix)
- **Acil mi:** P1 — UX bug, signup flow yavaşlatıyor (kullanıcı 2-3 click denemesi yapabilir).

## Handoff Log

- 2026-04-26 16:50 — test-engineer ✅ — Pattern memo açıldı.
- (bekleniyor) — frontend-engineer 📥 — Review + fix scope onayı.
