# 03 — Motion & Interaction Spec'leri

Varsayılan: `{type:'spring', stiffness:400, damping:30}`. Tap: `whileTap={scale:0.93–0.97}`. Entry: `{opacity:0, y:16} → {opacity:1, y:0}`, stagger `i*0.05`.

**Dosya:** `YYYY-MM-DD-konu-slug.md`

**Rapor iskeleti:**
```markdown
# [Motion adı]

## Amaç
Hangi duyguyu / feedback'i sağlıyor?

## Specifikasyon
- Library: Framer Motion | CSS | GSAP | Lottie
- Trigger: hover | tap | entry | scroll | state-change
- Easing: ...
- Duration: ...
- Stagger: ...

## Reduced-motion fallback
`prefers-reduced-motion: reduce` altında ne görünür? (min: statik state, motion devre dışı)

## Koreografi (birden fazla element)
Sıra + zaman ekseni.

## Performans notu
GPU-accelerated mı (transform/opacity), layout-thrashing riski var mı?
```

**İlk motion konuları:**
- `karma-counter-animation.md` — +50 Karma animasyonu (KarmaCounter component)
- `streak-flame-pulse.md` — ateş +scale pulse
- `mission-card-stagger-entry.md` — liste entry choreography
- `confetti-on-complete.md` — canvas-confetti parametreleri
- `bottom-nav-selected-transition.md` — tab geçiş motion
