# Pattern I — Mission Take Membership Mismatch (BUG-021)

**Tespit eden:** test-engineer (Faz 2 D2/D3 koşusu, 2026-04-26)
**Tarih:** 2026-04-26
**Etkilenen bug'lar:** BUG-021 (mission take silent fail) + BUG-020 (kategori chip theme-blind)
**Severity:** P0 (mission take tüm public missions için bloke)
**Etkilenen kullanıcı segmenti:** TÜM kullanıcılar (NGO üyesi olmayanlar)

## Kök neden

`lib/missions/actions.ts#takeMission` server action'ı **TÜM** `mission.ngo_id` olan görevler için NGO üyelik şart koşuyordu (line 92-105). Halbuki ADR-008 spec ve mission detail UI copy'si "**Tek seferlik — üye olmana gerek yok**" diyor (passthrough mode). Bu copy + business logic çelişkisi mission take'i sessizce başarısız kılıyordu.

```typescript
// ESKI (yanlış)
if (mission.ngo_id) {
  // membership check → REQUIRES_MEMBERSHIP error
}

// YENİ (BUG-021 fix)
if (mission.ngo_id && mission.access_level === 'members_only') {
  // sadece members_only missions için membership check
}
```

Migration 015 zaten `access_level` field'ı yaratmış (default 'public', constraint check 'public'|'members_only'). Backend logic field'ı kullanmıyordu.

## Kanıt

### Symptom
- Mission detail "Bu göreve katıl" tıklandı
- Server action POST 200 OK (network log)
- UI değişmiyor (still "Bu göreve katıl" CTA)
- DB query: `user_missions WHERE user_id=...` → boş array
- Error toast/alert görünmüyor (scroll dışında kalmış olabilir veya setTakeError tetiklenmemiş)

### Root cause
- `actions.ts:92` `if (mission.ngo_id)` her zaman true (fixture missions hep NGO'ya bağlı)
- `+t5` user TEMA üyesi değil → membership query null → `REQUIRES_MEMBERSHIP` döner
- `result.ok = false` → `setTakeError('Bu göreve katılmak için önce gönüllü olman gerek.')`
- Hata render ediliyor ama line 535 koordinatında (sticky CTA üstünde) — scroll geride kalmışsa görünmüyor

## Önerilen sistemik fix

### A — actions.ts membership guard'ı access_level conditional yap ✅ APPLIED

```typescript
if (mission.ngo_id && mission.access_level === 'members_only') {
  // membership check
}
```

ADR-008 ile align: passthrough (public) mode → just consent, no membership.

### B — takeError UI'sı sticky/floating yap (gelecek iyileştirme)

Şu anki render: bottom CTA üstünde inline alert. Scroll geri olursa kullanıcı görmez. Öneri: 
- Fixed position toast (top right veya bottom)
- veya snackbar component (3-5 saniye visible, fade out)
- veya sticky CTA içine inline (button üstünde error label, her zaman visible)

### C — UI copy "Tek seferlik" var ama geçerli mi field?

Mission detail "VERİ PAYLAŞIMI - Tek seferlik" copy'si **statik** — mission'ın access_level'ine göre değişmeli:
- `access_level='public'` → "Tek seferlik — üye olmana gerek yok"
- `access_level='members_only'` → "Sadece üyeler — TEMA gönüllüsü olmalısın"

Bu Vol-10 sonraki iterasyon işi.

## Bonus diagnoz: BUG-020 mission detail kategori chip

Aynı sayfada test ederken kategori chip light mode'da theme-blind bulundu:
- `bg: rgb(36,30,24)` (ink800 dark)
- `color: rgb(36,30,24)` (SAME = invisible)

mission-detail-client.tsx'de chip component hardcoded dark. Light mode için theme-aware tokenization gerek.

## Dosyalar etkilenen

- `lib/missions/actions.ts` — takeMission + (gelecek) completeMission membership conditional
- `app/dashboard/missions/[id]/mission-detail-client.tsx` — kategori chip theme-aware (BUG-020) + takeError UI placement (gelecek)

## Estimated effort

- A) takeMission access_level fix: ✅ 5 dk (yapıldı)
- B) takeError sticky UI: 20 dk (Vol-11)
- C) UI copy access_level conditional: 15 dk (Vol-11)
- BUG-020 chip theme: 20 dk (Vol-10/11)

## Handoff

- **Lead:** frontend-engineer (mission-detail chip + takeError UI) + supabase-backend (zaten yapıldı)
- **Acil mi:** P0 — mission take core feature broken

## Handoff Log

- 2026-04-26 ~22:30 — test-engineer ✅ — Pattern memo açıldı + actions.ts access_level fix uygulandı.
- (bekleniyor) — Vol-10 push + +t5 re-test mission take.
- (bekleniyor) — Vol-11 BUG-020 chip + UI copy refactor.
