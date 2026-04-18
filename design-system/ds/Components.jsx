/* global React */
// İyiBiri — Core Components
// Button, Input (Airbnb-style floating label), Chip, Badge, Divider.
// Dark-mode (app) primary; light-mode variant notes inline.

const C = () => window.IYI.color;

// ───────────── BUTTON
function Button({ variant='primary', size='md', children, icon, iconRight, full, onClick, style={} }) {
  const pad = size === 'lg' ? '14px 22px' : size === 'sm' ? '8px 14px' : '11px 18px';
  const fs = size === 'lg' ? 15 : size === 'sm' ? 13 : 14;

  const styles = {
    primary: {
      background: C().gold, color: '#241E18',
      border: '1px solid transparent',
      boxShadow: '0 1px 2px rgba(26,22,18,.3), inset 0 1px 0 rgba(255,255,255,.3)',
    },
    secondary: {
      background: C().ink800, color: C().cream,
      border: `1px solid ${C().ink600}`,
    },
    ghost: {
      background: 'transparent', color: C().cream,
      border: `1px solid ${C().ink600}`,
    },
    outlineGold: {
      background: 'transparent', color: C().gold,
      border: `1px solid ${C().gold}`,
    },
    lightPrimary: {  // light mode (paper bg)
      background: C().paper700, color: C().paper,
      border: '1px solid transparent',
    },
    lightSecondary: {
      background: 'transparent', color: C().paper700,
      border: `1px solid ${C().paper300}`,
    },
  };

  return (
    <button
      onClick={onClick}
      style={{
        display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,
        padding: pad, borderRadius: 999,
        fontFamily: window.IYI.font.ui, fontSize: fs, fontWeight: 600,
        letterSpacing:'-0.01em',cursor:'pointer',
        transition: `transform ${window.IYI.motion.fast}, box-shadow ${window.IYI.motion.fast}, background ${window.IYI.motion.fast}`,
        width: full ? '100%' : 'auto',
        ...styles[variant], ...style,
      }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {icon && <span style={{display:'flex'}}>{icon}</span>}
      {children}
      {iconRight && <span style={{display:'flex'}}>{iconRight}</span>}
    </button>
  );
}

// ───────────── INPUT (Airbnb-style)
// Tek büyük pill-ish container, floating label, soft focus ring.
function Input({ label, value='', onChange, placeholder, type='text', icon, theme='dark', style={} }) {
  const [focused, setFocused] = React.useState(false);
  const [v, setV] = React.useState(value);
  const has = v.length > 0;
  const active = focused || has;

  const tokens = theme === 'dark' ? {
    bg: C().ink800, bgActive: C().ink700,
    border: C().ink600, borderActive: C().gold,
    text: C().cream, label: C().ink300, placeholder: C().ink400,
    shadow: active ? '0 0 0 4px rgba(232,194,104,.12)' : 'none',
  } : {
    bg: C().paper, bgActive: '#FFF',
    border: C().paper300, borderActive: C().paper700,
    text: C().paper700, label: C().paper500, placeholder: C().paper400,
    shadow: active ? '0 1px 2px rgba(26,22,18,.04), 0 8px 20px rgba(26,22,18,.08)' : '0 1px 2px rgba(26,22,18,.04)',
  };

  return (
    <label style={{
      display:'block', position:'relative',
      background: active ? tokens.bgActive : tokens.bg,
      border: `1px solid ${active ? tokens.borderActive : tokens.border}`,
      borderRadius: 14,
      padding: '11px 16px 9px', paddingLeft: icon ? 44 : 16,
      transition: `border-color ${window.IYI.motion.base}, box-shadow ${window.IYI.motion.base}, background ${window.IYI.motion.base}`,
      boxShadow: tokens.shadow,
      ...style,
    }}>
      {icon && (
        <span style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:tokens.label}}>
          {icon}
        </span>
      )}
      <span style={{
        display:'block',
        fontFamily: window.IYI.font.ui,
        fontSize: active ? 10 : 14, lineHeight: 1,
        fontWeight: active ? 700 : 400,
        letterSpacing: active ? '.12em' : '-0.01em',
        textTransform: active ? 'uppercase' : 'none',
        color: tokens.label,
        transition: `all ${window.IYI.motion.base}`,
        marginBottom: active ? 6 : 0,
        transform: active ? 'translateY(0)' : 'translateY(10px)',
        pointerEvents:'none',
      }}>{label}</span>
      <input
        type={type}
        value={v}
        onChange={e => { setV(e.target.value); onChange && onChange(e.target.value); }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={active ? placeholder : ''}
        style={{
          width:'100%',border:'none',outline:'none',background:'transparent',
          fontFamily: window.IYI.font.ui, fontSize: 15, fontWeight: 500,
          color: tokens.text, letterSpacing: '-0.01em',
          padding: 0, minHeight: active ? 20 : 0,
          opacity: active ? 1 : 0,
          transition: `opacity ${window.IYI.motion.base}`,
        }}
      />
    </label>
  );
}

// ───────────── CHIP (filter scroll)
function Chip({ active, children, icon, onClick, theme='dark' }) {
  const tokens = theme === 'dark' ? {
    bg: active ? 'rgba(232,194,104,.12)' : 'transparent',
    border: active ? C().gold : C().ink600,
    color: active ? C().gold : C().ink300,
  } : {
    bg: active ? C().paper700 : 'transparent',
    border: active ? C().paper700 : C().paper300,
    color: active ? C().paper : C().paper600,
  };
  return (
    <button onClick={onClick} style={{
      flexShrink:0, display:'inline-flex', alignItems:'center', gap:6,
      padding:'9px 14px', borderRadius: 999,
      border: `1px solid ${tokens.border}`,
      background: tokens.bg, color: tokens.color,
      fontFamily: window.IYI.font.ui, fontSize:13, fontWeight:500,
      letterSpacing:'-0.01em', cursor:'pointer',
      transition: `all ${window.IYI.motion.base}`,
      whiteSpace:'nowrap',
    }}>
      {icon && <span style={{display:'flex'}}>{icon}</span>}
      {children}
    </button>
  );
}

// ───────────── BADGE (meta pill)
function Badge({ children, icon, variant='neutral', style={} }) {
  const v = {
    neutral: { bg:'rgba(255,255,255,.04)', border:C().ink600, color:C().ink300 },
    gold:    { bg:'rgba(232,194,104,.12)', border:C().goldLine, color:C().gold },
    dark:    { bg: C().ink, border: 'transparent', color: C().cream },
    onImage: { bg:'rgba(26,22,18,.55)', border:'rgba(244,238,223,.16)', color:C().cream },
    onImageLight: { bg:'rgba(250,245,233,.92)', border:'rgba(26,22,18,.06)', color:C().paper700 },
  }[variant];
  return (
    <span style={{
      display:'inline-flex',alignItems:'center',gap:5,
      padding:'5px 10px',borderRadius:999,
      background: v.bg, border:`1px solid ${v.border}`, color: v.color,
      fontFamily: window.IYI.font.ui, fontSize:11, fontWeight:600,
      letterSpacing:'.04em', backdropFilter: variant?.startsWith('onImage') ? 'blur(10px)' : undefined,
      ...style,
    }}>
      {icon && <span style={{display:'flex'}}>{icon}</span>}
      {children}
    </span>
  );
}

// ───────────── ICON BUTTON (round)
function IconButton({ icon, onClick, size=36, theme='dark', style={} }) {
  const tokens = theme === 'dark' ? {
    bg:'rgba(26,22,18,.55)', border:'rgba(244,238,223,.14)', color: '#F4EEDF',
  } : {
    bg:'rgba(250,245,233,.95)', border:'rgba(26,22,18,.08)', color:'#241E18',
  };
  return (
    <button onClick={onClick} style={{
      width:size,height:size,borderRadius:'50%',
      background: tokens.bg, border:`1px solid ${tokens.border}`, color: tokens.color,
      display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',
      backdropFilter:'blur(10px)',
      transition:`all ${window.IYI.motion.base}`,
      ...style,
    }}>{icon}</button>
  );
}

Object.assign(window, { Button, Input, Chip, Badge, IconButton });
