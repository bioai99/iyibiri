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
