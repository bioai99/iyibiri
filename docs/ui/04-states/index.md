# 04 — State Spec'leri (Loading / Empty / Error / Success)

Atlas Bölüm 10 ve page-audit'e göre bu alan sistemik eksik. Her sayfa için bu 4 state'i belgele.

**Dosya:** `YYYY-MM-DD-sayfa-slug.md` (veya sistemik ise `YYYY-MM-DD-sistemik-X.md`)

**Rapor iskeleti:**
```markdown
# [Sayfa] — State Spec

## Loading (skeleton)
- Layout: ...
- Token: ink-800 background + ink-700 shimmer
- Süre: 200ms delay önce → sonra shimmer
- Accessibility: aria-busy="true"

## Empty state
- Illustration (varsa, SVG + gold accent)
- Başlık + açıklama (Türkçe, "sen" dili)
- Primary CTA (ne yapmalı)
- Sekonder action (opsiyonel)

## Error state
- Token: clay accent + kart içi
- Mesaj: spesifik + action
- Retry button (varsa)

## Success state
- Token: success + konfeti
- Animasyon: slide-up + scale
- Sonraki adım CTA
```

**İlk sistemik spec adayları:**
- `sistemik-loading-skeleton.md` — dashboard altındaki tüm sayfalar için ortak skeleton sistemi
- `sistemik-empty-state-library.md` — tek bir EmptyState component'inin kullanımları
- `sistemik-error-toast-vs-inline.md` — ne zaman toast, ne zaman inline?
- `dashboard-missions-empty.md` — hiç görev yokken
- `dashboard-notifications-empty.md` — bildirim yok
- `dashboard-saved-empty.md` — hiç kaydedilmemiş
