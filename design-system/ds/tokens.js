// İyiBiri — Design System Tokens v2
// Palette: "Premium × Warm" — mürekkep zemin, mat altın aksan, terracotta bağlam.
// Not: Bu token dosyası hem app kiti hem preview kartları tarafından kullanılır.

window.IYI = {
  /* ────── COLORS ──────
     Rule: tek aksan (gold). Terracotta sadece vurgu, yeşil/pembe/mavi YOK. */
  color: {
    // Ink — warm charcoal scale (pure siyah değil)
    ink:      '#1A1612',   // en koyu yüzey (bottom nav, koyu CTA)
    ink900:   '#24201B',   // app zemini (warm ink)
    ink800:   '#2E2923',   // raised surface (kart)
    ink700:   '#36302A',   // hover/pressed surface
    ink600:   '#3F3830',   // hairline / divider
    ink500:   '#574E42',   // disabled text on dark
    ink400:   '#7A6F5E',   // tertiary text on dark
    ink300:   '#A89E8A',   // muted text on dark
    ink200:   '#CEC5B2',   // soft text on dark
    ink100:   '#E6DEC9',   // secondary cream on dark
    cream:    '#F4EEDF',   // primary text on dark

    // Paper — light mode (aydınlık ekranlar için, pastel temelli)
    paper:    '#FAF5E9',   // en açık zemin
    paper100: '#F5EEDD',   // kart zemini
    paper200: '#EBE3CE',   // raised on light
    paper300: '#D9CFB4',   // border
    paper400: '#B8AD92',   // secondary on light
    paper500: '#7A6F5E',   // body on light
    paper600: '#3E3830',   // heading on light
    paper700: '#241E18',   // display on light

    // Accents — sparing use
    gold:     '#E8C268',   // primary accent (Karma, active state)
    goldDim:  '#B58F3D',   // gold secondary (shadow'da, progress end)
    goldSoft: 'rgba(232,194,104,.12)',  // gold tinted fill
    goldLine: 'rgba(232,194,104,.32)',  // gold tinted border

    // Terracotta — sadece "uyarı / davet" bağlamında (light mode aksan)
    clay:     '#C8553D',
    claySoft: 'rgba(200,85,61,.12)',

    // Pastel soft — selam / yumuşak vurgu (az kullanım)
    blush:    '#E9CFC2',   // soft terracotta
    sage:     '#C4CBAC',   // soft olive
    wheat:    '#EADDB8',   // soft gold

    // Semantic
    success:  '#6B8E4E',
    warning:  '#D19B3C',
    danger:   '#B84E3B',
  },

  /* ────── TYPE ──────
     Display: Fraunces (serif, editorial warmth)
     UI: Plus Jakarta Sans (humanist geometric, Turkish-friendly)
     Tabular numerals via fontVariantNumeric */
  font: {
    display: '"Fraunces", ui-serif, Georgia, serif',
    ui: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace',
  },

  type: {
    // Display (serif)
    d1: { family:'display', size:56, lh:1.02, weight:500, track:'-0.03em' },
    d2: { family:'display', size:44, lh:1.05, weight:500, track:'-0.028em' },
    d3: { family:'display', size:32, lh:1.1,  weight:500, track:'-0.02em' },
    // Heading (ui / sans)
    h1: { family:'ui', size:24, lh:1.2,  weight:700, track:'-0.02em' },
    h2: { family:'ui', size:20, lh:1.25, weight:700, track:'-0.02em' },
    h3: { family:'ui', size:17, lh:1.3,  weight:600, track:'-0.01em' },
    // Body
    bodyLg: { family:'ui', size:16, lh:1.5, weight:400, track:'-0.01em' },
    body:   { family:'ui', size:14, lh:1.55, weight:400, track:'0' },
    bodySm: { family:'ui', size:13, lh:1.5,  weight:400, track:'0' },
    // Labels / micro
    label:    { family:'ui', size:11, lh:1.3, weight:600, track:'.04em' },
    eyebrow:  { family:'ui', size:10, lh:1.2, weight:700, track:'.22em', upper:true },
    caption:  { family:'ui', size:11, lh:1.4, weight:500, track:'0' },
    // Numeric (tabular)
    numHero:  { family:'ui', size:56, lh:0.95, weight:700, track:'-0.035em', tabular:true },
    numBig:   { family:'ui', size:32, lh:1,    weight:700, track:'-0.025em', tabular:true },
    numMed:   { family:'ui', size:18, lh:1.1,  weight:700, track:'-0.015em', tabular:true },
  },

  /* ────── RADII ──────
     Airbnb-adjacent: conservative radii. Big cards 16, buttons pill, chips pill. */
  radius: {
    xs: 6, sm: 10, md: 12, lg: 16, xl: 20, pill: 9999,
  },

  /* ────── SPACING ──────
     4px base grid. */
  space: {
    '0': 0, '1': 4, '2': 8, '3': 12, '4': 16, '5': 20, '6': 24, '7': 32, '8': 40, '9': 48, '10': 64,
  },

  /* ────── SHADOWS ──────
     Soft, warm. Dark mode kartlarda shadow yerine border + subtle inner glow. */
  shadow: {
    sm:   '0 1px 2px rgba(26,22,18,.06), 0 2px 6px rgba(26,22,18,.04)',
    md:   '0 2px 4px rgba(26,22,18,.06), 0 8px 20px rgba(26,22,18,.06)',
    lg:   '0 4px 8px rgba(26,22,18,.08), 0 16px 36px rgba(26,22,18,.08)',
    xl:   '0 8px 16px rgba(26,22,18,.08), 0 32px 56px rgba(26,22,18,.08)',
    // gold glow (sparing)
    gold: '0 0 0 1px rgba(232,194,104,.3), 0 8px 24px rgba(232,194,104,.18)',
  },

  /* ────── MOTION ──────
     Airbnb-adjacent: 200-280ms, custom cubic. Press: scale(0.98). */
  motion: {
    fast:   '160ms cubic-bezier(.2,.8,.2,1)',
    base:   '220ms cubic-bezier(.2,.8,.2,1)',
    slow:   '320ms cubic-bezier(.2,.8,.2,1)',
    spring: '360ms cubic-bezier(.34,1.56,.64,1)',
  },
};

// Convenience: inline typography helper
window.IYI.typo = (k) => {
  const t = window.IYI.type[k];
  if (!t) return {};
  return {
    fontFamily: window.IYI.font[t.family],
    fontSize: t.size,
    lineHeight: t.lh,
    fontWeight: t.weight,
    letterSpacing: t.track,
    ...(t.upper ? { textTransform: 'uppercase' } : {}),
    ...(t.tabular ? { fontVariantNumeric: 'tabular-nums' } : {}),
  };
};
