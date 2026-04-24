# 05 — UX Brief'leri (UI designer'a devir)

Bir UX araştırması veya audit bulgusundan çıkan, UI tarafının tasarlamasını gerektiren değişiklikler için brief. Product-analyst'in feature-level brief'inden sonra, UI designer'ın visual spec'inden önce.

**Dosya:** `YYYY-MM-DD-feature-slug.md`

**Şablon:** `.claude/skills/writing-plans/SKILL.md` içindeki "UX Design Brief" + UX-spesifik katkılar:

```
## UX spesifik eklenti bölümler
### Mevcut akış (kaynak)
Kod path + ekran akışı adımları (3–7).

### Önerilen akış (delta)
Sadece değişen adımlar. Değişmeyen kısımları "[aynı]" olarak geç.

### Taşınan yük (cognitive)
Kullanıcıdan ne azaldı / ne yeni eklendi?

### Test önerisi
5-second test / 1. tıklama testi / usability test senaryosu.
```

**Örnek sıradaki ilk brief'ler:**
- `loading-empty-error-dashboard.md` — sistemik state brief'i
- `onboarding-causes-dbSync.md` — localStorage → DB sync timing
- `missions-detail-state-machine-clarity.md` — 4 state arasında görsel geçiş

---

## İletişim protokolü notu

Her UX brief (bu klasörde) yayınlandığında, dosyanın sonuna **Handoff log** bölümü açılır ([agent-communication-protocol SKILL](../../../.claude/skills/agent-communication-protocol/SKILL.md) Katman A).

Downstream agent (ui-designer) brief'i alıp UI spec ürettiğinde, bu dosyanın Handoff log'una 1 satır ekler. Böylece 2 hafta sonra brief'i açan kullanıcı, zincirin uçlarını tek dosyada görür.

**Not:** `docs/product/02-briefs/ux/` (product-analyst'in yazdıkları) vs `docs/ux/05-briefs/` (ux-researcher'ın yazdıkları) ayrı klasörler — ikinci klasör daha detaylı UX-spesifik katkılar taşır, ikisi birbirini tekrarlamaz.
