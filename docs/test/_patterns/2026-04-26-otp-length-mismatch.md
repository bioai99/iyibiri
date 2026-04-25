# Pattern E — OTP Length Mismatch

**Tespit eden:** test-engineer (regression vol-3, 2026-04-26)
**Tarih:** 2026-04-26 17:00
**Etkilenen bug'lar:** BUG-013 (signup OTP length mismatch)
**Severity:** P0 (signup → onboarding flow tamamen bloke)
**Etkilenen kullanıcı segmenti:** Tüm yeni kullanıcılar (her signup verify adımı)

## Kök neden

Supabase email OTP'yi **8 haneli** sayı olarak gönderiyor (örn. `04069695`), ama frontend verify sayfası **6 input** kutusu render ediyor. Kullanıcı 6 hane girdiğinde Supabase token mismatch döndürüyor → "Bu kod çalışmadı" error.

## Kanıt

### Email içeriği (canlı production)
- Subject: "İyiBiri — Doğrulama Kodunuz: **04069695**"
- Body: "0 4 0 6 9 6 9 5" (8 hane, gold büyük rakam grid)
- Email TR template tier-1 quality ✅
- From: `noreply@mail.app.supabase.io`

### Frontend
- Route: `/auth/verify?email=...`
- 6 input box (each one digit)
- Auto-submit when all 6 filled
- Error: "Bu kod çalışmadı. Yeni bir kod almayı dene."
- Tested both first-6 (`040696`) and last-6 (`069695`) → both fail

### Supabase config (tahmin)
Supabase Dashboard veya `supabase/config.toml`'da:
```toml
[auth.email]
otp_length = 8  # NON-DEFAULT, was changed somewhere
```

VEYA email template `{{ .Token }}` tag'i 8 haneli token üretiyor (Supabase 2024+ token format).

## Mimari analiz

Supabase **email confirmation** iki farklı token tipi kullanır:
1. **Magic link token** — UUID-ish hash (uzun)
2. **Numeric OTP** — varsayılan 6 hane, config ile 4-10 hane arası

Bahadır'ın config'inde otp_length 8 olarak ayarlanmış olabilir, veya email template `{{ .Token }}` direkt confirmation_token (uzun) kullanıyor olabilir.

## Önerilen sistemik fix

### A — Frontend defensive (önerilen, hızlı)

`app/auth/verify/page.tsx`'te input array length'i sabit 6 yerine **dynamic** yap:

```typescript
// const OTP_LENGTH = 6  // SABIT, BUG-013 sebebi
const OTP_LENGTH = Number(process.env.NEXT_PUBLIC_OTP_LENGTH ?? 6)
```

Veya daha defensive: paste handler'ında uzunluğu auto-detect et:
```typescript
function handlePaste(e: React.ClipboardEvent) {
  const text = e.clipboardData.getData('text').replace(/\D/g, '')
  if (text.length >= 6 && text.length <= 10) {
    // Render N input boxes dynamically
    setOtpLength(text.length)
    setValue(text)
  }
}
```

Veya en basit: tek `<input type="text" inputMode="numeric" maxLength={10}>` kullan, segmented design'ı CSS ile simüle et — uzun OTP'ler de çalışır.

### B — Backend config (Supabase)

Supabase Dashboard → Auth → Settings → "Email OTP" alanını bul:
- Length: 6 (varsayılan)
- Expiry: 60 dakika

Eğer length 8 ise → 6'ya çek.

`supabase/config.toml` (varsa):
```toml
[auth.email]
otp_length = 6
otp_expiry = 3600
```

### C — Verify (regression test)

Yeni signup → email gelmeli → 6 hane içermeli. Verify sayfasında 6 hane gir → success → /onboarding/welcome.

## Dosyalar etkilenen

- `app/auth/verify/page.tsx` — defensive length OR fixed 6
- `supabase/config.toml` — `otp_length` ayarı (varsa)
- Supabase Dashboard manuel — Auth → Email OTP length

## Estimated effort

- Frontend defensive (Option A): 30 dk
- Supabase config (Option B): 15 dk + manual Dashboard check
- Both (en güvenli): 45 dk

**Toplam:** ~30-45 dk

## Handoff

- **Lead:** auth-capacitor (Supabase config + frontend wire)
- **Support:** frontend-engineer (verify page defensive)
- **Acil mi:** **P0 — yeni kullanıcı signup flow tamamen bloke**.

## Handoff Log

- 2026-04-26 17:00 — test-engineer ✅ — Pattern memo açıldı.
- (bekleniyor) — auth-capacitor 📥 — Review + fix scope onayı.
