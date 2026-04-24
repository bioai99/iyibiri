# User Journey Map — Yeni Kullanıcı İlk Dashboard Açılışı

**Tarih:** 2026-04-24
**Yazar:** ux-researcher
**Persona × Senaryo:** P1 "Zehra, 27, İstanbul" — kayıt + onboarding tamam, dashboard'u ilk kez açıyor.
**Hipotez etiketi:** Bu map **hipotez bazlı** — kanıtlı kullanıcı testi sonrası revize edilecek.
**Skill usage:** ✅ `user-journey-mapping` + ✅ `mobile-app-polish-standards`.

---

## 1. Persona

**Zehra, 27, İstanbul**
- Üniversite mezunu, ajansta tasarımcı.
- Arkadaşının WhatsApp mesajıyla İyiBiri'yi duydu: "Bu app çok tatlı, karma kazanıyorsun."
- Hafta içi yoğun, hafta sonu gönüllü şeyler yapmaya açık.
- Duolingo 60+ gün serisi var; gamified app'lere aşina.
- Finansal kaygı orta; ayda ₺200-500 bağış kapasitesi.
- Beklenti: app güzel görünmeli + zamanı kısa kullanıcıya saygı duymalı.

## 2. Senaryo

"Zehra kayıt + onboarding'i tamamladı. İlk kez `/dashboard`'u açıyor. Hedefi: 'Ne yapmalıyım?' sorusuna cevap bulmak ve ilk görevi başlatmak."

---

## 3. Touchpoint Tablosu (Journey steps)

| # | Ekran | Kullanıcı eylemi | Düşünce | Duygu skoru | Fırsat |
|---|---|---|---|---|---|
| 1 | `/auth/signup` sonrası → `/dashboard` load | Sayfa yükleniyor; skeleton görünmeli | "Yüklenmesi ne kadar sürecek?" | **+1** 🙂 | Skeleton delay 200ms önce → shimmer. Loading badge "Hazırlıyor..." |
| 2 | `/dashboard` ilk açılış (0-2 sn) | Hero + Karma + seviye görünür | "Oo, sıfır Karma... Ne yapmalıyım?" | **0** 😐 | **İlk kullanıcı empty state:** "İlk adımını at →" CTA. NOT generic dashboard. |
| 3 | Hero sonrası scroll | Kartlara bakar | "Çok şey var, nerden başlayayım?" | **-1** 😕 | Focal point net değilse cognitive overload. **Dark moment ihtimali.** |
| 4 | "Günün görevi" görür (öneri) | Mission card tıklar | "Bu bana uygun mu acaba?" | **+1** 🙂 | Algoritma persona uyumuna göre önermeli (causes seçimi). |
| 5 | Mission detail sayfasına geçer | Impact + Karma + süre okur | "İlginç, yapılabilir. Başvursam mı?" | **+2** 🙂 | Impact statement burada vurucu olmalı (mission detail brief P0 #15). |
| 6 | "Başvur" tıklar | Confirm olmadan direkt apply veya light confirm | "Başardım, sonraki adım ne?" | **+2** ⭐ | Haptic medium tap. Ceremony minimum (success feedback). |
| 7 | Mission "applied" state'e geçer | Tarih + hazırlık + iptal opsiyonu | "Aa, başvurdum. Ne zamanmış?" | **+2** 🙂 | State machine açıklık (mission brief P0 #15). |
| 8 | `/dashboard`'a geri döner | Hero'da "Aktif görev: 1" etiketi | "Harika, takvimimde kayıtlı şimdi." | **+3** 🤩 | **Peak moment:** İlk başarı. Haptic heavy + subtle celebration overlay. |

---

## 4. Emotion Curve

```
Adım      1    2    3    4    5    6    7    8
Skor     +1    0   -1   +1   +2   +2   +2   +3
                    ↓                      ↑
              dark moment            peak moment
```

**Curve analizi:**
- **+1 → 0 → -1** ilk 3 adımda düşüş. Hero gücü belirgin değil + scroll cognitive overload hipotezi.
- **+1 → +3** 4-8 arası yükseliş. Mission start akışı doğru kurulursa delight.
- **Dark moment (Adım 3):** Odaklanma eksikliği. Audit Kritik 3 (focal point) ile çözüm.
- **Peak moment (Adım 8):** İlk başarı sonrası hero'ya dönüş. Celebration + state güncellemesi → 60+ günlük kullanıcılık olasılığı yüksek.

---

## 5. Dark Moment Deep-Dive

### Adım 3 — "Çok şey var, nerden başlayayım?"

**Root cause:**
1. Dashboard çok kart barındırıyor (Audit H8 şiddet 3).
2. "Tek eylem" belirgin değil — Things 3 tarzı "tek ekran, tek amaç" eksik.
3. Yeni kullanıcı için default sort/filter yok — algoritmik öneri zayıf (hipotez).

**Fırsat (Action):**
- **İlk 3 gün için "Onboarding hint" hero üstü:** "İlk görevini seç, +50 Karma hediye."
- **Featured card hierarchy:** Günün görevi > diğer öneriler. Diğer kartlar kapatık (collapsed).
- **Empty state sub-category:** İlk kullanıcıda hero'nun içeriği farklı — "0 Karma → İlk Karmanı kazan" CTA'lı.

### Adım 2 — "Oo, sıfır Karma..."

**Mitigate:**
- **"Hoşgeldin bonusu: +100 Karma"** — signup sırasında verilmiş olabilir; Karma boşsa yeni kullanıcı dark moment.
- Hero'da empty state özel mesaj: "Karma biriktirmek için ilk görevini seç."

---

## 6. Peak Moment Amplification

### Adım 8 — İlk aktif görev dashboard'a yansıyor

**Amplify:**
- **Haptic heavy** tap feedback (Duolingo benzeri).
- **Celebration overlay** 1.5s — confetti + "İlk görevin aktif 🎉" text.
- **Share prompt** opsiyonel: "Arkadaşına söyle" (viral mekanik, ama aggressive değil).
- **Streak başlama:** Gün 0 → Gün 1 transition, streak flame "yanmaya" başlıyor. Breathing animation.

---

## 7. Bulgu Özeti (3 madde)

1. **En kritik friction:** Dashboard ilk açılışta focal point belirsizliği (Adım 3 dark moment). Çözüm: hero hiyerarşisi + "günün görevi" featured + onboarding hint ilk 3 gün.
2. **En güçlü peak:** İlk başvurudan sonra dashboard'a geri dönüş (Adım 8). Aktif görev etiketi + celebration burada hayati — kullanıcının "devam etme" kararını veriyor.
3. **Micro-polish gap:** Haptic + sound (opsiyonel) + micro-celebration skill `mobile-app-polish-standards` Bölüm 8'de detayda. Duolingo benchmark seviyesinde uygulanmalı.

---

## 8. UX Brief için aksiyon

Bu journey map'in çıkardığı öneriler **UX brief dashboard-ana-v2** ile senkron. UX brief'e eklenen maddeler:
- İlk kullanıcı empty state variant (Karma 0).
- Onboarding hint hero üstü (ilk 3 gün).
- Adım 8 celebration overlay (ceremony).
- Haptic choreography (Capacitor skill).

---

## 9. Ölçüm Planı

- **Onboarding → İlk görev başvurusu oranı** (hedef %50+ ilk oturum).
- **İlk oturum süresi** (hedef ≥90 sn — scroll + explore).
- **Activation hızı** (signup → ilk karma — hedef medyan ≤ 2 saat).
- **D1 retention** (ilk gün tekrar açma — hedef %40+).

---

## 10. Kaynaklar

- [Kod] `app/dashboard/page.tsx` + `dashboard-client.tsx`.
- [Kaynak] Skill `user-journey-mapping` (emotion curve + dark moment).
- [Kaynak] Skill `mobile-app-polish-standards` (Duolingo streak, Things 3 focal point, Arc delight).
- [Hipotez] User test ile doğrulanmadı — ilk turda hipotez.
- Atlas Bölüm 3 (rota), 4 (veri modeli), 6 (DS), 8 (mobile).

## 11. Self-Audit

- [x] Persona + senaryo etiketli (hipotez).
- [x] 3-10 adım journey table.
- [x] Emotion curve ayrı bölümde.
- [x] En az 1 dark moment + 1 peak moment deep-dive.
- [x] 3 bulgu özeti.
- [x] Kaynaklar listesi.
- [x] Skill usage doğrulandı (journey-mapping + polish).

✅ Pass — UX brief'e devir edilebilir.

## Handoff log

Bu journey'i alıp üreten agent'ların zinciri. Protokol: `.claude/skills/agent-communication-protocol/SKILL.md` Katman A.

- 2026-04-24 06:45 — **ui-designer** ✅ — **spec**: `docs/ui/01-specs/2026-04-24-dashboard-ana-v2-ui-spec.md`. K1-K5 → Bölüm 2-10. *(retroactive)*
- 2026-04-24 11:45 — **frontend-engineer** ✅ — **implementation complete**, HeroCardV2 + DailyMissionCard canlı. *(retroactive)*
