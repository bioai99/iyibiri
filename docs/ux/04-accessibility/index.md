# 04 — Erişilebilirlik Audit

WCAG AA hedef. `prefers-reduced-motion` kodda zaten sayılı (globals.css). Kontrast + klavye + touch target + screen reader odaklı.

**Dosya:** `YYYY-MM-DD-konu-slug.md`

**Başlangıç a11y audit listesi:**
- `YYYY-MM-DD-kontrast-testi-paleti.md` — atlas Bölüm 6 renk kombinasyonları × WCAG AA.
- `YYYY-MM-DD-touch-target-audit.md` — btm nav, buton, IconButton ≥44×44?
- `YYYY-MM-DD-focus-order-onboarding.md` — klavye navigation.
- `YYYY-MM-DD-screen-reader-dashboard.md` — ARIA label, heading hierarchy.
- `YYYY-MM-DD-reduced-motion-verify.md` — animasyonların `prefers-reduced-motion` için düzgün fallback'i var mı?

**Kontrast matematiği** için `consulting-methodology` yerine hızlı referans: online WCAG contrast checker + kod taraması (`text-*`, `bg-*` Tailwind class'ları). Sonuçlar tabloya.
