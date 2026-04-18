/* global React */
// İyiBiri — Icon Set v2
// Özel çizilmiş ince-line ikonlar. Stroke: 1.6, rounded caps, 24x24 viewBox.
// Emoji yok. Renk stroke'tan gelir, fill var olan yerde pointsubtle.

const iconBase = {
  width: 24, height: 24, viewBox: '0 0 24 24',
  fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round',
};

const mk = (children, size) => ({ size: s = size || 20, color = 'currentColor', style = {} } = {}) => (
  React.createElement('svg', { ...iconBase, width: s, height: s, style: { color, display:'block', ...style } }, children)
);

window.Icon = {
  // ─── NAV
  home: mk(<>
    <path d="M3 11.5 12 3l9 8.5"/>
    <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/>
  </>),
  search: mk(<>
    <circle cx="11" cy="11" r="7"/>
    <path d="m20 20-3.5-3.5"/>
  </>),
  missions: mk(<>
    <path d="M4 6h12l4 4v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"/>
    <path d="M16 6v4h4"/>
    <path d="m8 14 2.5 2.5L16 11"/>
  </>),
  rewards: mk(<>
    <path d="M4 9h16v3H4z"/>
    <path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"/>
    <path d="M12 9v12"/>
    <path d="M12 9c0-3-3-6-5-6a2 2 0 0 0 0 4c2 0 5-1 5 2Z"/>
    <path d="M12 9c0-3 3-6 5-6a2 2 0 0 1 0 4c-2 0-5-1-5 2Z"/>
  </>),
  profile: mk(<>
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/>
  </>),

  // ─── META / meta
  clock: mk(<>
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7v5l3.5 2"/>
  </>),
  pin: mk(<>
    <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </>),
  calendar: mk(<>
    <rect x="3.5" y="5" width="17" height="16" rx="2"/>
    <path d="M3.5 10h17M8 3v4M16 3v4"/>
  </>),
  users: mk(<>
    <circle cx="9" cy="8" r="3.5"/>
    <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5"/>
    <circle cx="17" cy="9" r="2.5"/>
    <path d="M15 20c0-2.5 1.5-4 4-4s2 1 2 1"/>
  </>),

  // ─── ACTION
  heart: mk(<>
    <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"/>
  </>),
  bookmark: mk(<>
    <path d="M6 3h12v18l-6-4-6 4V3Z"/>
  </>),
  share: mk(<>
    <circle cx="6" cy="12" r="2.5"/>
    <circle cx="18" cy="6" r="2.5"/>
    <circle cx="18" cy="18" r="2.5"/>
    <path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>
  </>),
  plus: mk(<>
    <path d="M12 5v14M5 12h14"/>
  </>),
  check: mk(<>
    <path d="m5 12 4.5 4.5L19 7"/>
  </>),
  chevron: mk(<>
    <path d="m9 6 6 6-6 6"/>
  </>),
  arrow: mk(<>
    <path d="M4 12h16M14 6l6 6-6 6"/>
  </>),
  close: mk(<>
    <path d="M6 6l12 12M18 6 6 18"/>
  </>),
  filter: mk(<>
    <path d="M3 6h18M6 12h12M10 18h4"/>
  </>),

  // ─── CONCEPT (Karma, streak, tier)
  karma: mk(<>
    <circle cx="12" cy="12" r="8"/>
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 4v2M12 18v2M4 12h2M18 12h2"/>
  </>),
  flame: mk(<>
    <path d="M12 3c2 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-4 3-6 1 2 3 2 3 5"/>
  </>),
  trophy: mk(<>
    <path d="M8 21h8M12 17v4"/>
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"/>
    <path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/>
  </>),
  leaf: mk(<>
    <path d="M5 21s0-10 8-14c5-2.5 7 0 7 0s-1 11-8 14c-4 1.5-7 0-7 0Z"/>
    <path d="M5 21c3-7 7-10 13-13"/>
  </>),
  spark: mk(<>
    <path d="M12 3v6M12 15v6M3 12h6M15 12h6"/>
    <path d="M5.5 5.5 8 8M16 16l2.5 2.5M5.5 18.5 8 16M16 8l2.5-2.5"/>
  </>),

  // ─── UI
  settings: mk(<>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5 7.5 7.5M16.5 16.5 18.5 18.5M5.5 18.5 7.5 16.5M16.5 7.5 18.5 5.5"/>
  </>),
  bell: mk(<>
    <path d="M6 10a6 6 0 1 1 12 0c0 4 2 6 2 6H4s2-2 2-6Z"/>
    <path d="M10 20a2 2 0 0 0 4 0"/>
  </>),
  globe: mk(<>
    <circle cx="12" cy="12" r="9"/>
    <path d="M3 12h18M12 3c3 3 4.5 6 4.5 9s-1.5 6-4.5 9c-3-3-4.5-6-4.5-9s1.5-6 4.5-9Z"/>
  </>),
  check_circle: mk(<>
    <circle cx="12" cy="12" r="9"/>
    <path d="m8 12 3 3 5-6"/>
  </>),

  // ─── EXTENDED (Part 2)
  book: mk(<>
    <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/>
    <path d="M4 19a2 2 0 0 1 2-2h13M9 7h6M9 11h5"/>
  </>),
  paw: mk(<>
    <circle cx="6" cy="9" r="1.8"/>
    <circle cx="10" cy="6" r="1.8"/>
    <circle cx="14" cy="6" r="1.8"/>
    <circle cx="18" cy="9" r="1.8"/>
    <path d="M8 17c0-3 2-5 4-5s4 2 4 5c0 1.5-1 3-2.5 3h-3C9 20 8 18.5 8 17Z"/>
  </>),
  expand: mk(<>
    <path d="M4 10V4h6M14 4h6v6M20 14v6h-6M10 20H4v-6"/>
  </>),
  info: mk(<>
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 11v5M12 8v.01"/>
  </>),
  star: mk(<>
    <path d="m12 3 2.9 6 6.1.5-4.6 4 1.4 6L12 16.5 6.2 19.5l1.4-6L3 9.5 9 9z"/>
  </>),
};

// Karma dot — özel small component, tek kullanımlık
window.KarmaDot = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" style={{display:'block'}}>
    <circle cx="6" cy="6" r="5.5" fill="#E8C268"/>
    <circle cx="6" cy="6" r="2.8" fill="none" stroke="#B58F3D" strokeWidth="0.8"/>
  </svg>
);
