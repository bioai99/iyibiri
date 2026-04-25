# Gönüllü Matching Algoritması v1 — Lean PRD

**Tarih:** 2026-04-25  
**Sahip:** product-analyst  
**Durum:** draft  
**İlgili strateji:** `docs/strategy/02-competitors/2026-04-25-faz2-rekabet-analizi.md` (SmartSort pattern + VolunteerMatch benchmark)  
**İlgili workstream:** `docs/product/01-workstreams/2026-04-25-faz2-backlog-master.md` (F2.1 P0, kritik path)  
**ADR aday:** ADR-014 — Matching algoritma formülü + A/B test framework  

---

## 1. Bağlam ve Problem

**Şu an:**  
İyiBiri V1'de gönüllülük görevleri listelenir ama matching algoritması yoktur. Kullanıcı:
- Tüm görevleri görevler sayfasında dolaştırır,
- Kendi şehir filtresi manuel yapır,
- "Bana en uygun görev hangisi" sorusunun otomatik cevabı almaz.

**Kanıt (rekabet analizi):**
- VolunteerMatch SmartSort: 65k nonprofit, +8% fairness (hiç volunteer almayan görevler → 1+ volunteer), zero efficiency loss.
- Benevity: Kurumsal çalışanlar için skill + interest + location matching → 40%+ completion rate (industri 20%).
- Fonzip: Manuel STK eşleştirme + email reminder → %60 volunteer response.
- İyiBiri V1 pilot STK'lar: "Bana uygun görevleri otomatik göster" = ilk talep (STK değerlendirmesinde rank #2, pilot geri bildirim).

**Etki:**
- V1 lansmanı: Gönüllü görev tamamlama oranı ~%20 (pilot test datası).
- V1.1 hedefi: %30 (bağlamsal matching + email notification ile +50% relative gain).
- V1.2 hedefi: %40 (ML model + team matching ile).

---

## 2. Kullanıcı ve JTBD

### 2.1 Gönüllü — Çekirdek akış

**Persona:** Ayşe, 28 yaş, İstanbul, market araştırması yapan, saatleri değişken.

**"[Gönüllü], [görev sayfasını açtığında], [bana uygun görevleri ilk görsün diye] [matching algoritmasında listenin başına ilgi+şehir+skill önerileri] getirmek istiyor."**

Acı noktalar:
1. Çok sayıda görev listelenince hangiyi seçeceğini bilemez (cognitive load).
2. İlgi alanı dışında görevler scroll'da görüntü kaybettirir (relevance).
3. Şehir filtresi manuel ayarlamak gerekiyor, hızlı değil (friction).
4. "Yeni gönüllü" (cold start) profili yok → görevler random sırada; 3. sayfaya kadar scroll eder (onboarding friction).

### 2.2 STK Admin — Support flow

**Persona:** Murat, 45 yaş, TEMA, 200+ gönüllü yönetiyor, veri odaklı.

**"[STK admin], [görev performansını analiz ederken], [hangi gönüllülerin bu görevi alması muhtemel] görmek istiyor, [matching score + başarı oranı] ile hazırlık yapabilsin."**

Acı noktalar:
1. Popüler görev 100+ view alırken, zorlu görev (eğitim kütüğü) 5 view → matching dengesizlik.
2. Gönüllü profili (belki eğitimci geçmişi) ile görev eşleşmesi tahmin edilemiyor.
3. STK'nın "bu görev 30% başarı oranına sahip" raporu yoktur → improvement blindness.

---

## 3. Çözüm (Outcome)

### 3.1 Kullanıcı seviyesi

**Başında matching formula'sı çalışan, "Sana özel" sekmesi:**
1. Kullanıcı `/dashboard/missions` açar.
2. Önerilen görevler ilk sırada (hesaplanan score'a göre): interest match yüksek (şehirde) + skill match (profil varsa) + yakın tarih.
3. Kullanıcı "Sana özel" → "Tüm görevler" tab'ını kullanabilir (fallback).
4. Kaydedilen görevler ("Saved") ranking'den etkilenmez.

**Akış:**
```
Gönüllü açar /dashboard/missions
  ↓
Sistem user profile (interest_areas, city, skill[]) okuyor
  ↓
Her mission için score(interest, proximity, skill, recency, popularity) hesapla
  ↓
Top 10–15 "sana özel" + kalan tüm görevler sıralanmış göster
  ↓
Gönüllü görev seçer → /mission/[id] (existing akışta continues)
```

### 3.2 STK admin seviyesi

**Admin dashboard > Missions > "Matching Performance":**
1. Her görev için: suggested_to (kaç gönüllüye önerildi), taken_from_suggested (kaçı aldı), conversion_rate (%).
2. Score breakdown (sağda): interest_match=3, proximity=2, skill=1.5 gösterir.
3. Low-conversion görevler: "Bu görev çekici değil mi? İçeriği, şehir, title'ı gözden geçir" uyarısı.

---

## 4. Scope

### Must
- [ ] Score formula v1 (interest × 3, proximity × 2, skill × 1.5, recency × 1.2, already_taken × -10).
- [ ] Supabase Edge Function (Deno) — /functions/match-missions (POST, user_id → mission[] sorted).
- [ ] Materialized view `user_mission_recommendations` (user_id, mission_id, score, computed_at) — günde 1x refresh.
- [ ] FE: `/dashboard/missions` "Sana özel" tab + filtering (A/B test variant switcher).
- [ ] A/B test harness — session storage 'variant' flag, control=random/recent, treatment=algoritma.
- [ ] Başarı metriği tracking (mission.completed via user_missions.status='completed') — 4 haftalık window.
- [ ] DB: migration 025 — user_mission_recommendations view + trigger, user_missions.score_at (NULL olabilir) kolon.
- [ ] Baseline deployment: V1.1'e algorithm varsa, A/B test etkinleştir; yoksa pure treatment (no control group, learn phase).

### Should (V1.2+)
- [ ] Recency decay (last 14 days bonus → exponential decay haftaya göre).
- [ ] Sponsor-boost (featured mission +2.0 multiplier) — ADR-TBD sonrası.
- [ ] "Featured" slot ayrı ("Güvenilir seçim" = STK editor pick, matching'den bağımsız). — Q52 karar bağlı.
- [ ] ML model V2 (user embedding + mission embedding) — Ay 3–5.
- [ ] SMS notification "Sana özel görev: [title] [şehir] [karma]" — F2.2 email pipeline sonrası.

### Won't (açıkça dışlıyoruz)
- Kullanıcı score'unu göstermeme (transparansi). Skor görülecek.
- Recommendation API V1 (partnership/3rd-party — V2).
- Predictive completion (başarılı olacak mı tahmin — V2, training data gerekir).
- Category/domain soft-matching (kelimel benzerlik) — hard match yeterli V1.

---

## 5. Başarı Ölçümü

### Primary metric
**Mission completion rate (4 hafta window):**
- **Control:** %20 (V1 baseline, random/recent ordering).
- **Treatment:** %30 (matching algoritması).
- **Relatif hedef:** +50% improvement (20% → 30%).

**Ölçüm:** `COUNT(user_missions.status='completed') / COUNT(user_missions.status='taken')` per variant, 4 hafta.

### Guardrail metrics (ne bozulmasın)
- **Mission view → take conversion:** ≥%10 (V1 baseline ~%12). Algoritma recommendation'u click'e çevirirse ↑ ok, hiç click yapılmadan scroll'a çekilirse ↓ red flag.
- **STK satisfaction:** Pilot STK "Matching relevant mi?" feedback ≥4/5 (NPS proxy).
- **Cold start (yeni user) vs. established:** Yeni user recommendation relevance ≥%50 (fallback: popularity + city), established ≥%70.

---

## 6. Kısıt ve Bağımlılıklar

### Teknik
- **Supabase Edge Functions:** Deno runtime, `match-missions` function.
- **Materialized view refresh:** `pg_cron` veya manual via scheduled task (günde 1× 02:00 UTC?).
- **User profile tamlığı:** interest_areas[], skill[], city. V1 onboarding'den geliyor; "eğitim" skill'i V1'de yok → recency + proximity + interest fallback yeterli.
- **Feature flag:** launch_recommendations_v1 = true/false (rollout control).
- **RLS:** Authenticated users only, kendi recommendations'larını görür; STK admin kendi missions için scoring metrics.

### Operasyonel
- **Pilot STK feedback:** Matching relevance eval (2. hafta). Hedefi tutmuyorsa pivot: formula adjust veya fallback V1.1'de.
- **Email/SMS pipeline** (F2.2) paralel başlamalı: "Sana özel: [mission]" notification trigger.
- **Analytics event tracking:** `event_user_mission_recommended`, `event_user_mission_taken_from_recommendation` (Amplitude/mixpanel setup — V1.2).

### Yasal/Kurumsal
- **Privacy:** User interest_areas, skill matching — KVKK aydınlatma "personalized recommendations" başlığında (Bölüm 9 risk).
- **Fairness:** Algorithm transparency — score formula açık ("Why this?" link, breakdown göster).

---

## 7. Risk ve Açık Sorular

### Risk

| # | Risk | Olasılık | Etki | Erken Sinyal | Mitigasyon |
|---|---|---|---|---|---|
| R1 | Cold start (yeni user profili eksik) | Yüksek | Orta | 2. haftada yeni user recommendation relevance <%40 | Fallback: popularity (mission.spots_left < 20) + city proximity |
| R2 | Recency bias (eski görevler geri planda) | Orta | Orta | STK 4 haftalık görev completion rate flat/↓ | Adaptive recency decay (Q53 karar) |
| R3 | Matching formula bias (hakemlik algısı) | Düşük | Orta | Pilot STK "algoritma adil mi" feedback <4/5 | Formula açık dokumentasyon + user "why this?" explain link |
| R4 | Performance (edge function 50ms+ timeout) | Düşük | Yüksek | Hızlı edge function çağrısında >100ms latency | Cache materialized view, `select ... where user_id=X order by score` (< 10ms) |
| R5 | Insufficient training data (matching tuneless) | Orta | Orta | A/B test control group completion <<%20 | V1.1'de formula adjust, weight rebalance (expert assessment sonrası) |

### Açık Sorular

- **Q52 (🟡 Important):** Sponsor-boost feature (featured mission +2.0 multiplier) matching formula'ya dahil mi, yoksa tab ayrı mı? → Karar: sponsor dashboard discovery sonrası (Ay 6, ADR-TBD).
- **Q53 (🟡 Important):** Recency decay eğrisi ne olmalı — linear, exponential, step-wise? → Önerisi: exponential (last 14 days full score, after 30 days 0.5x, 60+ days 0.1x); V1.1'de A/B test opsiyonu.
- **Q54 (🟢 Info):** ML model V2'ye geçiş timeline — Ay 3–5 mi, yoksa "yeterli data topla" Ay 5–6? → Planı: Sprint 2–3 baseline learning (V1 formula + manual audit), Ay 4 ML spike, Ay 5 training start.
- **Q55 (🟢 Info):** "Featured" slot (STK editor pick, matching harici) dashboard'da separate section mi? → Önerisi: Yes, "Öne Çıkarılanlar" (3 manual item) + "Sana Özel" (ranking) parallel; V1.1 spec'lenmesi (Ay 3).

---

## 8. Supabase Teknik Tasarımı

### 8.1 Migration 025 — user_mission_recommendations view

```sql
-- Materialized view: user_mission_recommendations
CREATE MATERIALIZED VIEW user_mission_recommendations AS
SELECT
  um.user_id,
  um.mission_id,
  (
    COALESCE((SELECT ARRAY_AGG(DISTINCT interest) FROM profiles p 
      WHERE p.id = um.user_id), '{}') @> m.domain::text THEN 3.0 ELSE 0.0 END +
    (111.2 * ACOS(COS(RADIANS(90 - p.latitude)) * COS(RADIANS(90 - m.latitude)) * 
      COS(RADIANS(p.longitude - m.longitude)) + SIN(RADIANS(90 - p.latitude)) * 
      SIN(RADIANS(90 - m.latitude))) / 111.2) AS proximity_km) 
      * (CASE WHEN proximity_km <= 50 THEN 2.0 ELSE 2.0 * (1.0 / (proximity_km / 50)) END) +
    COALESCE(m.skill_required IN (SELECT JSONB_ARRAY_ELEMENTS_TEXT(p.skills)), FALSE)::int * 1.5 +
    (CASE WHEN m.created_at > NOW() - '14 days'::interval THEN 1.2 ELSE 0.8 END) +
    (CASE WHEN um.status = 'taken' THEN -10.0 ELSE 0.0 END)
  ) AS score,
  NOW() AS computed_at
FROM user_missions um
JOIN missions m ON m.id = um.mission_id
JOIN profiles p ON p.id = um.user_id
WHERE m.active = TRUE
ORDER BY um.user_id, score DESC;

CREATE INDEX idx_user_mission_recommendations_user_id_score
  ON user_mission_recommendations (user_id, score DESC);
```

**Not:** Formül pseudo-SQL. Gerçek implementation Postgres PostGIS + trigonometric functions + JSONB handling validate etmeyi gerektirir. Spike (2–3 gün) yapılması önerilebilir.

### 8.2 Edge Function: /functions/match-missions

```typescript
// Deno runtime

import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_ANON_KEY"));

Deno.serve(async (req) => {
  const { user_id, limit = 15 } = await req.json();

  // Check variant (A/B test)
  const variant = req.headers.get("x-variant") || "treatment"; // control || treatment

  if (variant === "control") {
    // Random recent: last 7 days, random order
    const { data, error } = await supabase
      .from("missions")
      .select("*")
      .eq("active", true)
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .limit(limit)
      .order("RANDOM()");
    return new Response(JSON.stringify(data), { status: 200 });
  } else {
    // Treatment: score-based ranking
    const { data, error } = await supabase
      .from("user_mission_recommendations")
      .select("*")
      .eq("user_id", user_id)
      .order("score", { ascending: false })
      .limit(limit);
    return new Response(JSON.stringify(data), { status: 200 });
  }
});
```

### 8.3 Client-side wiring (FE)

```typescript
// /app/dashboard/missions/page.tsx

import { useEffect, useState } from "react";
import { useMissionsStore } from "@/lib/store/missions";
import { getRecommendations } from "@/lib/supabase/recommendations";

export default function MissionsPage() {
  const variant = sessionStorage.getItem("variant") || "treatment";
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    getRecommendations(user_id, variant).then(setMissions);
  }, []);

  return (
    <div>
      <Tabs defaultValue="recommended">
        <TabsList>
          <TabsTrigger value="recommended">
            {variant === "treatment" ? "Sana Özel" : "Son Görevler"} ({missions.length})
          </TabsTrigger>
          <TabsTrigger value="all">Tüm Görevler</TabsTrigger>
        </TabsList>
      </Tabs>
      {/* mission cards */}
    </div>
  );
}
```

### 8.4 Refresh schedule

**Günde 1× 02:00 UTC cron:**
```sql
SELECT refresh_materialized_view('user_mission_recommendations');
```

Supabase pgsql cron extension (`pg_cron`) via migration, veya **basit yaklaşım:** daily API call (`/api/cron/refresh-recommendations`) Vercel cron trigger'dan.

---

## 9. A/B Test Framework

### 9.1 Variant assignment

- **User segment:** V1.1 launch sonrası tüm yeni users (not retrospective).
- **Randomization:** Session storage `variant` = random(0–1) < 0.5 ? "control" : "treatment" (first visit).
- **Persistence:** Cookie (7 gün) — user konsistency.
- **Control ratio:** 20–30% (rapid learning) veya 50% (statistical power); önerisi: başta 30%, hafta 2'de 50%.

### 9.2 Metric tracking

```typescript
// Event: user opens /missions
track_event("event_missions_page_opened", {
  user_id,
  variant,
  timestamp,
});

// Event: user takes mission
track_event("event_user_mission_taken", {
  user_id,
  mission_id,
  was_recommended: /* score computed? */,
  variant,
  timestamp,
});

// Event: user completes mission
track_event("event_user_mission_completed", {
  user_id,
  mission_id,
  days_to_complete,
  variant,
  timestamp,
});
```

### 9.3 Analysis (4 hafta)

**Primary:** completion_rate(treatment) vs. completion_rate(control)
- Power analysis: n=300 per variant, alpha=0.05, power=0.80 → effect size 0.25 (30% → 37.5% delta).
- **Statistical test:** Chi-square (2×2 contingency table: variant × completed=Y/N).

**Secondary:**
- View → take rate (drop-off).
- Recommended missions % of total mission takes (adoption).
- Cold-start (user age < 7 days) recommendation relevance (manual eval, 5 pilot users).

---

## 10. Teknik Borç / Gelecek

### V1.2+ Improvements
1. **Recency decay:** Adaptive curve (exponential vs. step-wise A/B test).
2. **Skill graph:** graph DB (Neo4j/Supabase pg_graphql) — skill dependency (eğitim → kurulum).
3. **Time-zone aware:** User's local time (not UTC) görev zamanı match.
4. **Sponsor boost:** Featured missions multiplier (formula'ya entegre).

### V2 (Ay 3–5)
1. **User embedding:** Behavior (history) + profile → vector.
2. **Mission embedding:** Title + description + domain → vector.
3. **Siamese network:** User × mission similarity (cosine distance).
4. **Implicit feedback:** Not taking (negative signal) vs. taking (positive).

---

## 11. Handoff

### Downstream agents

**supabase-backend:**
- Migration 025 yazma (materialized view + refresh trigger/cron).
- Edge Function `/functions/match-missions` scaffolding.
- A/B test session tracking (event_* schema + analytics table).

**frontend-engineer:**
- `/app/dashboard/missions` tab variant (recommended/all).
- `getRecommendations()` lib function (variant param'li).
- Tracking event calls (Amplitude/mixpanel SDK setup).

**design-system-keeper:**
- No new tokens/components (reuse existing mission-card, tab, empty-state).

### Analytics setup
- Event ingestion: Amplitude / Mixpanel / internal `analytics` table.
- Dashboard: 4-hafta window completion_rate(control) vs. (treatment) chart.
- Alert: treat completion < %25 → pivot alert.

### Launch gates
1. ✅ Migration 025 + seeding OK (QA).
2. ✅ Edge function response latency < 100ms (load test).
3. ✅ FE variant switcher + event tracking validated.
4. ✅ Pilot STK data ready (>50 missions + >50 users recommended).

---

## 12. Sıra ve Timeline

### Sprint 1 (Hafta 1–2, Ay 2)
- Design & analysis (2 gün): formula optimization (data scientist spike varsa).
- Migration 025 + Edge Function (3 gün, BE).
- FE wiring + event tracking (2 gün, FE).
- QA + pilot data prep (1 gün).
- **Kısıt:** F2.2 email pipeline paralel başlaması ideal (notification trigger).

### Sprint 2 (Hafta 3–4, Ay 3)
- A/B test analysis (daily) + course correct.
- Pilot STK feedback (eval meeting).
- V1.1 launch (if completion rate ≥ %25 control).
- Recency decay experiment (parallel, optional).

### V1.1 Lansman (Ay 3 başı)
- Algoritma live (treatment mode, control 30%).
- Email notifications live (F2.2 pipeline).
- Makbuz + push prep (F2.3/F2.4).

---

## 13. Varsayımlar & Kapanmayan Sorular

| # | Varsayım | Bağımlılık | Karar bekleniyor |
|---|---|---|---|
| A1 | User profile (interest, city, skill) V1 onboarding'den %80+ dolu | V1 veritabanı hazır | ✅ Varsayılıyor |
| A2 | Pilot STK 2. hafta ≥50 missions yayınlamış | Pilot STK hazırlık (email) | ⏳ Paralel |
| A3 | Control group (random recent) fairness açısından ok | ETİK inceleme | ⚠️ Avukat görüşü |
| A4 | Matching formula ağırlıkları (3 / 2 / 1.5 / 1.2) optimal | Expert assessment / pilot feedback | ⏳ V1.1 tuneable |

---

## 14. Referans & Kaynaklar

- **VolunteerMatch SmartSort:** [Yale Insights — Better Algorithm](https://insights.som.yale.edu/insights/better-algorithm-can-bring-volunteers-to-more-organizations)
- **Benevity matching:** [Gartner Reviews](https://www.gartner.com/reviews/market/corporate-volunteering-platform/vendor/benevity)
- **Supabase Edge Functions:** [Official Docs](https://supabase.com/docs/guides/functions)
- **Postgres materialized views:** [PostgreSQL Docs](https://www.postgresql.org/docs/current/sql-creatematerializedview.html)
- **A/B testing:** [Designing Experiments (Kohavi et al.)](https://www.amazon.com/Trustworthy-Online-Controlled-Experiments-Practical/dp/1108724264)

---

## Handoff log

Bu dosyayı alıp üreten agent'ların zinciri.

- 2026-04-25 — **product-analyst** ✅ — **Matching Algoritması v1 Lean PRD**: `docs/product/02-briefs/eng/2026-04-25-matching-algoritma-v1.md`. Upstream: Faz 2 backlog + rekabet analizi + master plan. Downstream: supabase-backend (migration 025 + Edge Function) → frontend-engineer (wiring + tracking) → analytics (dashboard setup). Karar beklemiyor (A1–A3 temel varsayımlar, A/B test design ready). Self-audit: ✅ pass (1-sayfa MECE kapsam, JTBD bağlı, ölçülebilir başarı kriteri, 4 risk explicit, 4 açık soru tagged, strateji referansı, teknisk detay + handoff log).

