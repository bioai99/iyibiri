# 013. Tamamlanmış Görev İptal Edilemez — Business Rule + DB Trigger

**Tarih:** 2026-04-24
**Durum:** **Accepted (2026-04-24)** ✅
**Önerici:** Bahadır (Q42-UX yanıtında net sezgi)
**Onaylayan:** Bahadır

## Bağlam

Q42-UX başlangıç sorusu: "Admin iptal ettiği görevde kullanıcıların kazandığı Karma geri alınsın mı?"

Bahadır'ın net cevabı soruyu geçersiz kıldı:

> "Mantıklı düşün — bir görev tamamlandıysa iptal olamaz. Bu case gerçekçi değil. Bir görev tamamlandıysa kullanıcılar tarafından iptal edilemez."

Gerçekten de **`missions.status` bir timeline, geri sarılamaz**:

```
draft → active → (cancelled | completed)
              └─ cancelled: etkinlik YAŞANMAYACAK (future tense)
              └─ completed: etkinlik gerçekleşti (past tense)
```

**Semantik ayrım:**
- `cancelled` = "Olay olmayacak, iptal et" — sadece kimse tamamlamadıysa geçerli
- `completed` = "Olay oldu, arşivle" — etkinlik yaşandı, geriye dönüş yok

Bir görev en az 1 kullanıcı tarafından tamamlanmışsa (`user_missions.status='completed'` kaydı var), bu olay **gerçekleşmiş**. "Cancelled" anlamı zayıflar — çünkü olay oldu.

## Karar

**Business rule:** STK admin, en az 1 `user_missions.status='completed'` kaydı bulunan görevi `missions.status = 'cancelled'` yapamaz. Ancak `'completed'` işaretleyebilir.

**Uygulama katmanları:**

### 1. DB-level guardrail (migration 017)

Postgres trigger `tg_prevent_completed_mission_cancel`:

```sql
create or replace function prevent_completed_mission_cancel()
returns trigger as $$
declare completion_count int;
begin
  if new.status = 'cancelled' and old.status <> 'cancelled' then
    select count(*) into completion_count
      from user_missions
      where mission_id = new.id and status = 'completed';

    if completion_count > 0 then
      raise exception using
        message = format('Bu görev %s kullanıcı tarafından tamamlanmış — iptal edilemez. Ancak ''tamamlandı'' olarak işaretleyebilirsin.', completion_count),
        errcode = 'check_violation';
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger tg_prevent_completed_mission_cancel
  before update of status on missions
  for each row when (new.status is distinct from old.status)
  execute function prevent_completed_mission_cancel();
```

**DB seviyesinde hard constraint** — uygulama katmanı bug'lı bile olsa kural sistem tarafından korunur.

### 2. Application-level error mapping

`lib/missions/error-codes.ts` MISSION_CANCELLED mesajı güncellendi — "Karma sende kalır" tanımı kaldırıldı (artık olamaz).

### 3. UI consequence (ADR-010 kapsamında)

STK admin UI #3 "Görevlerim listesi" sayfasında **state-aware CTA**:
- Görevin `user_missions.status='completed'` sayısı = 0 → "İptal et" butonu (normal)
- Sayı ≥ 1 → "Tamamlandı olarak işaretle" butonu (cancel seçeneği disabled, tooltip açıklama)

### 4. UI metin güncellemesi

`components/mission/mission-state-banner.tsx` `cancelled` variant copy:

**Eski:** *"STK tarafından iptal edildi. Önceden kazandığın Karma sende kalır — sorun değil."*
**Yeni:** *"STK görev planından vazgeçti. Benzer görevlere bakmak ister misin?"*

Yeni metin daha basit çünkü senaryo artık net — kimse tamamlamadan iptal edildi, Karma bahsi gereksiz.

## Sonuçlar

**Pozitif:**
- Veri bütünlüğü DB seviyesinde garanti → bug'lı code bile kuralı bozamaz
- Semantik netlik — `cancelled` vs `completed` anlam farkı belirgin
- UX tutarlılığı — kullanıcı "iptal edildi ama Karma aldım" çelişkisi yaşamaz
- STK admin yanlışlıkla "iptal" deyip gerçekten yaşanan bir etkinliği silemez

**Negatif:**
- STK gerçekten istisnai durumda (ör. kullanıcı tamamlanmış diyor ama sahte kanıt) iptal edemiyor — `admin_review_status='rejected'` akışından geçmeli (Q41-UX ile tutarlı)
- Trigger error message Türkçe, Postgres locale ayarına bağlı olarak raise exception'da i/İ uyumsuzluğu riski → TR locale'de test edilmeli

**Riskler:**
- "Sahtekarlıkla Karma kazandı" durumunda hızlı iptal yapamama → reject akışı kullanılmalı, bu da kullanıcı bazında (mission bazında değil)

## Implementation durumu

**Kod canlı (2026-04-24):**
- ✅ Migration 017 — `tg_prevent_completed_mission_cancel` trigger
- ✅ `lib/missions/error-codes.ts` — MISSION_CANCELLED mesajı sadeleştirildi
- ✅ `components/mission/mission-state-banner.tsx` — cancelled copy güncellendi
- ⏳ STK admin UI #3 state-aware CTA (ADR-010 kapsamında)

## Referanslar

- Karar kuyruğu Q42-UX: `docs/_decisions-queue.md`
- Migration 017: `supabase/migrations/017_mission_cancel_guardrail.sql`
- Mission FSM: `lib/missions/state.ts`
- ADR-010 (admin UI state-aware CTA için)

## Sonraki adım

1. Trigger error message unit test (Postgres'te manuel test, Supabase console üzerinden)
2. Admin UI "İptal et" → "Tamamlandı işaretle" CTA swap (ADR-010)
3. Documentation: STK onboarding kılavuzuna "cancelled vs completed" ayrımı eklensin
