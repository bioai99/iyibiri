# 011. Karma Kalibrasyon — Domain Genişleme + Platform Formula + Grandfather

**Tarih:** 2026-04-24
**Durum:** **Accepted (2026-04-24)** ✅
**Önerici:** product-analyst + strategy-consultant (Q6 + Q7 + Q9 birleşik paketi)
**Onaylayan:** Bahadır

## Bağlam

Karma platformun ana para birimi — kullanıcı motivasyonu + sponsor marka ödül değeri + STK rekabeti hepsi buna dayanıyor. Üç sorun birikmiştir:

1. **Q6 — Domain taksonomisi:** Mevcut `missions.domain` 4 değer (`nature / education / social / financial`). Gerçek dünya görevler (kan bağışı, hayvan bakımı, afet müdahalesi, sanat atölyesi) bu dört kategoriyle kapsanmıyor. Taxonomy memo'su 10 domain önermişti.
2. **Q7 — Karma kim karar verir:** STK admin mi serbest değer girer, yoksa platform formül ile hesaplar mı? STK serbest olursa Karma enflasyonu riski (herkes 500 Karma verir, ekonomi çöker).
3. **Q9 — Grandfather:** Mevcut 12 seed mission'ın Karma değerleri manuel. Formül uygulansa değerleri değişmeli mi (retroactive recalc)?

Karma ekonomisi **ölçüm + kontrol gerektiren** bir sistem. Platform bu kontrolü kaybederse user trust ve sponsor marka value proposition bozulur.

## Karar

### Q6 — Domain 4 → 10 genişleme

`missions.domain` check constraint **text+check** olduğu için lookup table yerine doğrudan enum-gibi genişleme (migration 018):

| Domain | Açıklama | Karma multiplier |
|---|---|---|
| `nature` | Doğa / çevre | 1.0× |
| `education` | Eğitim | 1.0× |
| `social` | Sosyal / topluluk | 1.0× |
| `health` | Sağlık (kan bağışı, sağlık taraması) | 1.3× |
| `animals` | Hayvanlar (barınak, mama) | 1.1× |
| `arts` | Sanat / kültür | 0.9× |
| `sports` | Spor / aktif | 0.9× |
| `advocacy` | Savunuculuk / imza | 1.0× |
| `economic` | Ekonomik / geçim (mentor) | 1.0× |
| `emergency` | Acil durum / afet | 1.5× |

**Gerekçe multiplier'lar için:**
- `emergency` 1.5×: Afet müdahalesi en yüksek etki (Şubat 2023 depremi sonrası %25 bağış artışı — TÜSEV 2024)
- `health` 1.3×: Doğrudan yaşam etkisi (kan bağışı 1 kişiye 3 hayata dokunur)
- `animals` 1.1×: Yüksek empati, orta ölçek etki
- `arts/sports` 0.9×: Düşük doğrudan etki ama tecrübeli gönüllü çeker
- Diğerleri 1.0× baseline

### Q7 — Platform-controlled formula (Yol B)

`lib/missions/karma-formula.ts` implementation:

```typescript
karma = round(base_karma × domain_multiplier × duration_factor)

base_karma = { easy: 30, medium: 60, hard: 100 }[difficulty]
domain_multiplier = DOMAIN_MULTIPLIER[domain]  // yukarıdaki tabloya göre
duration_factor = parseDuration(duration_string)
  // "15 dakika" → 0.3
  // "1 saat" → 0.7
  // "2-3 saat" → 1.0 (baseline)
  // "4-5 saat" → 1.4
  // "tam gün" → 1.8
```

**Yumuşak geçiş:** V1'de STK admin UI "Görev yayınla" formunda **önerilen Karma** gösterilir. STK admin kabul eder veya override eder (V1 grandfather esnekliği). V1.1'de formül zorunlu, override kaldırılır.

### Q9 — Grandfather (no retroactive recalc)

Mevcut 12 seed mission'ın `karma` değerleri korundu:
- TEMA fidan 80, TEGV okuma 100, HAYTAP mama 60, LÖSEV kan 120 vb.

Formül ile hesaplanan değerler farklı (ör. LÖSEV kan formülle 20, manuel 120 — 6× fark). **Retroactive recalc yapılmaz** çünkü:

1. **User trust:** "Dün 80 kazanmıştım, bugün aynı görev 45" olamaz
2. **Historical integrity:** `karma_transactions` kayıtları manuel değerlerle tutarlı olmalı
3. **Formula calibration:** İlk 6 ay pilot verisi formülü tune edecek — şimdi dondurmak erken

**Geçiş dönemi (V1):** Mevcut görevler manuel kalır, yeni görevler formülle çıkar. 3-6 ay sonra kalibre formül Mission History'nin büyük çoğunluğunu domine edecek.

## Sonuçlar

**Pozitif:**
- 10 domain gerçek dünya görev çeşitliliğini yakalar
- Platform-controlled formula Karma enflasyonunu engeller, ekonomi bütünlüğünü korur
- Grandfather yaklaşımı user trust'ı bozmadan yumuşak geçiş sağlar
- STK admin UI'da "önerilen Karma" butonu → STK'ya formül şeffaflığı + override esnekliği

**Negatif:**
- V1'de STK override edebildiği için hala Karma enflasyonu riski (ama pilot dönemi küçük hacim)
- Formül kalibrasyonu için 6 ay veri toplamayı gerektirir — V1.1 öncesi belirsizlik
- Duration string parsing heuristic (regex) — TR locale varyasyonları için edge case'ler olabilir

**Riskler:**
- STK admin override'lı %20+ mission varsa formül kalibrasyonu yanıltıcı olabilir — data temizliği gerek
- Pilot sonrası formül büyük değişirse yine user trust endişesi → iletişim şart ("Karma formülü iyileştirildi" explainer)

## Implementation durumu

**Kod canlı (2026-04-24):**
- ✅ Migration 018 — check constraint 10 domain + seed re-mapping (LÖSEV → health, HAYTAP → animals)
- ✅ `lib/supabase/types.ts` — domain enum genişletildi
- ✅ `lib/missions/karma-formula.ts` — `computeKarma(input)` helper + `DOMAIN_TR_LABELS` + `domainLabel()`
- ⏳ Admin UI #2 "Görev yayınla" — formül buton'u yazılacak (ADR-010 scope içinde)
- ⏳ ADR-011 formula unit test — karma-formula.ts için

**Kod dokunulmadı (grandfather):**
- ❌ Mevcut `missions.karma` değerleri — dokunulmadı
- ❌ `karma_transactions` geçmişi — aynı

## Referanslar

- Karar kuyruğu Q6+Q7+Q9: `docs/_decisions-queue.md`
- Migration 018: `supabase/migrations/018_mission_domain_expansion.sql`
- Karma formula helper: `lib/missions/karma-formula.ts`
- Taxonomy memo'su (kaynak): `docs/strategy/06-memos/2026-04-23-gorev-kategorizasyon-taxonomy.md`
- ADR-001 North Star (MAKE) — Karma ekonomisi için temel metrik

## Sonraki adım

1. `lib/missions/karma-formula.ts` için unit test (baseline × multiplier × duration kombinasyonları)
2. ADR-010 scope'una "Görev yayınla" formunda `computeKarma()` buton UI
3. Pilot 6 ay sonu değerlendirme — multipliers tune edilir, V1.1'de override kaldırılır
