/* global React */
// İyiBiri — Logo (new palette)
// Tek düşünce: "iyi" kelimesindeki noktalı i harflerinin her biri bir coin.
// Dotless base + iki altın coin nokta. Kök serif tad (Fraunces inspired).

// — Wordmark (primary) — "iyibiri" tek satır, 'i' noktaları altın coin
function LogoWordmark({ height = 40, color = '#F4EEDF', accent = '#E8C268' }) {
  // Base SVG ratio 200:44 (~4.5:1)
  const w = height * (200/44);
  return (
    <svg width={w} height={height} viewBox="0 0 200 44" style={{display:'block'}}>
      <g fontFamily='"Fraunces", serif' fontWeight="500" fontSize="40" letterSpacing="-1">
        {/* dotless i */}
        <text x="0" y="36" fill={color}>ı</text>
        {/* coin dot */}
        <circle cx="11" cy="10" r="4" fill={accent}/>
        <circle cx="11" cy="10" r="1.6" fill="none" stroke={color} strokeOpacity=".45" strokeWidth="0.6"/>

        {/* yibir */}
        <text x="20" y="36" fill={color}>y</text>
        <text x="38" y="36" fill={color}>ı</text>
        {/* coin dot #2 */}
        <circle cx="49" cy="10" r="4" fill={accent}/>
        <circle cx="49" cy="10" r="1.6" fill="none" stroke={color} strokeOpacity=".45" strokeWidth="0.6"/>

        <text x="58" y="36" fill={color}>b</text>
        <text x="80" y="36" fill={color}>ı</text>
        {/* coin dot #3 */}
        <circle cx="91" cy="10" r="4" fill={accent}/>
        <circle cx="91" cy="10" r="1.6" fill="none" stroke={color} strokeOpacity=".45" strokeWidth="0.6"/>

        <text x="100" y="36" fill={color}>r</text>
        <text x="118" y="36" fill={color}>ı</text>
        {/* coin dot #4 (final) */}
        <circle cx="129" cy="10" r="4" fill={accent}/>
        <circle cx="129" cy="10" r="1.6" fill="none" stroke={color} strokeOpacity=".45" strokeWidth="0.6"/>
      </g>
    </svg>
  );
}

// — Monogram (app icon / avatar) — dairede iki coin üstte, 'b' tabanı
// Daha basit: dairesel altın çerçeve + 'i' harfi
function LogoMark({ size = 56, bg = '#24201B', accent = '#E8C268', text = '#F4EEDF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{display:'block'}}>
      {/* bg disk */}
      <circle cx="32" cy="32" r="32" fill={bg}/>
      {/* ring */}
      <circle cx="32" cy="32" r="28.5" fill="none" stroke={accent} strokeWidth="1.2" strokeOpacity=".7"/>
      {/* 'i' mono — two coin dots + stem */}
      <g transform="translate(32,32)">
        {/* stem */}
        <rect x="-3" y="-4" width="6" height="18" rx="1" fill={text}/>
        <rect x="-7" y="13" width="14" height="2.4" rx="1" fill={text}/>
        {/* coin dot */}
        <circle cx="0" cy="-11" r="4.2" fill={accent}/>
        <circle cx="0" cy="-11" r="1.6" fill="none" stroke={bg} strokeWidth="0.6"/>
      </g>
    </svg>
  );
}

// — Lockup (wordmark + tagline)
function LogoLockup({ height = 40, color = '#F4EEDF', accent = '#E8C268' }) {
  return (
    <div style={{display:'inline-flex',flexDirection:'column',gap:4}}>
      <LogoWordmark height={height} color={color} accent={accent}/>
      <div style={{
        fontFamily: window.IYI.font.ui,
        fontSize: Math.round(height * 0.26),
        letterSpacing: '.24em', textTransform: 'uppercase',
        color, opacity: .55, paddingLeft: 2,
      }}>iyilik · biriktir</div>
    </div>
  );
}

window.LogoWordmark = LogoWordmark;
window.LogoMark = LogoMark;
window.LogoLockup = LogoLockup;
