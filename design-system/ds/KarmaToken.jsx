/* global React */
// İyiBiri — Karma Token
// Mat altın coin. İki varyant: token (standalone) ve inline (sayı + coin).
// Emoji yok, fazla süslü değil. Kenarda ince ring, içte 'i' monogram.

function KarmaToken({ size = 64, style = {} }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" style={{display:'block',...style}}>
      <defs>
        <radialGradient id="kt-face" cx="40%" cy="36%" r="70%">
          <stop offset="0%" stopColor="#F4D98A"/>
          <stop offset="55%" stopColor="#E8C268"/>
          <stop offset="100%" stopColor="#B58F3D"/>
        </radialGradient>
        <linearGradient id="kt-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4D98A"/>
          <stop offset="100%" stopColor="#8A6A2C"/>
        </linearGradient>
      </defs>
      {/* drop shadow */}
      <ellipse cx="32" cy="58" rx="22" ry="2" fill="rgba(26,22,18,.2)"/>
      {/* outer ring (edge) */}
      <circle cx="32" cy="32" r="30" fill="url(#kt-edge)"/>
      {/* face */}
      <circle cx="32" cy="32" r="27" fill="url(#kt-face)"/>
      {/* inner groove */}
      <circle cx="32" cy="32" r="22" fill="none" stroke="#8A6A2C" strokeOpacity=".4" strokeWidth="0.6"/>
      <circle cx="32" cy="32" r="20" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="0.6"/>
      {/* monogram "i" — serif dotless-i tad, Fraunces vibe */}
      <g transform="translate(32,32)">
        <circle cx="0" cy="-9" r="2.4" fill="#3E2F14"/>
        <path d="M-3 -3 L-3 12 L3 12 L3 -3 Z" fill="#3E2F14"/>
        {/* serif feet */}
        <path d="M-6 12 L6 12 L6 10 L-6 10 Z" fill="#3E2F14"/>
      </g>
      {/* highlight */}
      <path d="M 12 20 Q 20 12 32 12" stroke="rgba(255,255,255,.55)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// Küçük inline versiyon — sadece yuvarlak+iç halka, detailsiz (listelerde)
function KarmaDotToken({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" style={{display:'block'}}>
      <defs>
        <radialGradient id="kdt-face" cx="40%" cy="36%" r="70%">
          <stop offset="0%" stopColor="#F4D98A"/>
          <stop offset="100%" stopColor="#B58F3D"/>
        </radialGradient>
      </defs>
      <circle cx="6" cy="6" r="5.5" fill="url(#kdt-face)"/>
      <circle cx="6" cy="6" r="2.6" fill="none" stroke="#3E2F14" strokeOpacity=".35" strokeWidth="0.6"/>
    </svg>
  );
}

// +150 Karma pill — kartlarda, hero'da
function KarmaPill({ amount, variant = 'dark' }) {
  const dark = variant === 'dark';
  return (
    <span style={{
      display:'inline-flex',alignItems:'center',gap:5,
      padding:'6px 10px 6px 8px',borderRadius:999,
      background: dark ? 'rgba(232,194,104,.12)' : 'rgba(232,194,104,.18)',
      border: `1px solid ${dark ? 'rgba(232,194,104,.35)' : 'rgba(181,143,61,.45)'}`,
    }}>
      <KarmaDotToken size={12}/>
      <span style={{
        fontFamily: window.IYI.font.ui,
        fontSize: 13, fontWeight: 700,
        color: dark ? '#E8C268' : '#8A6A2C',
        letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums',
      }}>+{amount}</span>
    </span>
  );
}

window.KarmaToken = KarmaToken;
window.KarmaDotToken = KarmaDotToken;
window.KarmaPill = KarmaPill;
