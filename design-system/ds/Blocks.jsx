/* global React */
// İyiBiri — App UI Building Blocks v2
// MissionCard, NGOCard, HeroCard, BottomNav, TierBadge, RewardCard
// Theme: Premium × Warm (ink900 bg, gold accent).
// Proportions: Airbnb-adjacent. 4:3 photos, 12px card radius, heart bookmark top-right, pill meta chips.

const _C = () => window.IYI.color;
const _f = () => window.IYI.font;

// ═════════════════════════════════ MISSION CARD ═════════════════════════════════
// Airbnb-style: photo dominant (4:3), minimal overlay, meta below.
// Onboard photo corners: NGO avatar + name.  Top-right: heart save.
// Body: title serif + impact body + location/date row + Karma pill bottom-right.
function MissionCard({ mission, ngo, onClick }) {
  const m = mission;
  const c = _C();
  const [saved, setSaved] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  return (
    <article
      onClick={onClick}
      onMouseDown={()=>setPressed(true)} onMouseUp={()=>setPressed(false)} onMouseLeave={()=>setPressed(false)}
      style={{
        background: c.ink800, borderRadius: 16, overflow: 'hidden',
        border: `1px solid ${c.ink600}`,
        transition: `transform ${window.IYI.motion.base}, box-shadow ${window.IYI.motion.base}`,
        transform: pressed ? 'scale(0.985)' : 'scale(1)',
        cursor:'pointer',
      }}>
      {/* Photo — 4:3 Airbnb ratio */}
      <div style={{position:'relative',aspectRatio:'4/3',overflow:'hidden'}}>
        <img src={m.photo} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
        {/* Soft bottom gradient — photo still breathes */}
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(26,22,18,0) 55%, rgba(26,22,18,.55) 100%)',pointerEvents:'none'}}/>

        {/* Top row — category + heart */}
        <div style={{position:'absolute',top:12,left:12,right:12,display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <Badge variant="onImage">{m.category}</Badge>
          <IconButton
            icon={<Icon.heart size={16} style={{fill: saved ? c.gold : 'none', color: saved ? c.gold : c.cream, transition:`all ${window.IYI.motion.base}`}}/>}
            onClick={(e)=>{ e.stopPropagation(); setSaved(s=>!s); }}
          />
        </div>

        {/* Bottom left — NGO lockup on photo */}
        <div style={{position:'absolute',left:12,bottom:12,display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:26,height:26,borderRadius:'50%',background:'white',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',flexShrink:0,boxShadow:'0 2px 6px rgba(0,0,0,.25)'}}>
            <img src={ngo.logo} alt="" style={{width:'72%',height:'72%',objectFit:'contain'}}/>
          </div>
          <span style={{
            fontFamily: _f().ui, fontSize: 12, fontWeight: 600,
            color: c.cream, letterSpacing:'-0.01em',
            textShadow: '0 1px 2px rgba(0,0,0,.4)',
          }}>{ngo.name}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{padding:'16px 18px 16px'}}>
        <h3 style={{
          margin:0, ...window.IYI.typo('h2'),
          color: c.cream, fontFamily: _f().ui,
        }}>{m.title}</h3>

        <p style={{
          margin:'6px 0 14px', ...window.IYI.typo('bodySm'),
          color: c.ink300,
        }}>{m.impact}</p>

        {/* Meta row */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            <MetaChip icon={<Icon.clock size={11} color={c.ink300}/>}>{m.duration}</MetaChip>
            <MetaChip icon={<Icon.pin size={11} color={c.ink300}/>}>{m.location}</MetaChip>
          </div>
          <KarmaPill amount={m.karma}/>
        </div>

        {/* Urgency (sparse) */}
        {m.spotsLeft <= 5 && (
          <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${c.ink600}`,display:'flex',alignItems:'center',gap:6}}>
            <Icon.flame size={13} color={c.gold}/>
            <span style={{fontFamily:_f().ui,fontSize:11,fontWeight:600,color:c.gold,letterSpacing:'.04em'}}>
              Son {m.spotsLeft} kişi · {m.date}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

function MetaChip({ icon, children }) {
  const c = _C();
  return (
    <span style={{
      display:'inline-flex',alignItems:'center',gap:4,
      fontSize:11, fontWeight:500, color: c.ink200,
      background:'rgba(255,255,255,.03)', padding:'5px 9px',
      borderRadius:999, border:`1px solid ${c.ink600}`,
      fontFamily: _f().ui, letterSpacing:'0',
    }}>
      {icon && <span style={{display:'flex'}}>{icon}</span>}
      {children}
    </span>
  );
}

// ═════════════════════════════════ NGO CARD ═════════════════════════════════
// Compact rail tile: cover photo + consistent-size logo disk + name.
// Logo disk is ALWAYS the same visible size — fixes Partner logo normalization.
function NGOCard({ ngo, activeMissions = 12 }) {
  const c = _C();
  return (
    <div style={{
      flexShrink:0, width: 158,
      background: c.ink800, borderRadius: 14, overflow:'hidden',
      border:`1px solid ${c.ink600}`,
    }}>
      <div style={{position:'relative',aspectRatio:'1',overflow:'hidden'}}>
        <img src={ngo.cover} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(26,22,18,0) 45%, rgba(26,22,18,.85) 100%)'}}/>
        {/* Logo disk — fixed 36px, object-contain ensures all partners feel same weight */}
        <div style={{position:'absolute',left:10,bottom:10,width:36,height:36,borderRadius:'50%',background:'white',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,.3)'}}>
          <img src={ngo.logo} alt="" style={{width:'72%',height:'72%',objectFit:'contain'}}/>
        </div>
      </div>
      <div style={{padding:'11px 14px 13px'}}>
        <div style={{
          fontFamily:_f().ui, fontSize:14, fontWeight:600,
          color: c.cream, letterSpacing:'-0.015em',
          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
        }}>{ngo.name}</div>
        <div style={{fontSize:11, color: c.ink300, marginTop:2}}>{activeMissions} aktif görev</div>
      </div>
    </div>
  );
}

// ═════════════════════════════════ HERO DASHBOARD ═════════════════════════════════
// Stat card: big Karma number (gold), tier pill, progress bar, stat row.
function HeroCard({ profile }) {
  const c = _C();
  const p = profile;
  const pct = Math.round((p.karma / (p.karma + p.karmaToNext)) * 100);

  return (
    <div style={{
      background: c.ink800, borderRadius: 20, padding: '22px 22px 18px',
      border: `1px solid ${c.ink600}`, position:'relative', overflow:'hidden',
    }}>
      {/* Concentric gold arcs in corner (subtle) */}
      <svg width="240" height="240" viewBox="0 0 240 240"
        style={{position:'absolute',right:-80,top:-80,opacity:.1,pointerEvents:'none'}}>
        {[110, 80, 50, 20].map(r => (
          <circle key={r} cx="120" cy="120" r={r} stroke={c.gold} strokeWidth="0.8" fill="none"/>
        ))}
      </svg>

      {/* Header row */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',position:'relative'}}>
        <div>
          <div style={{...window.IYI.typo('eyebrow'), color: c.ink300, fontFamily:_f().ui}}>Karma Hesabın</div>
          <div style={{display:'flex',alignItems:'baseline',gap:6,marginTop:8}}>
            <KarmaDotToken size={18}/>
            <div style={{
              fontFamily:_f().ui, fontWeight:700, fontSize:56, lineHeight:.95,
              letterSpacing:'-0.035em', color: c.gold, fontVariantNumeric:'tabular-nums',
              marginLeft: 4,
            }}>{window.IYI_V2.fmt(p.karma)}</div>
          </div>
        </div>
        <TierBadge tier={p.tierName}/>
      </div>

      {/* Progress */}
      <div style={{marginTop:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',fontSize:11,marginBottom:8,gap:12}}>
          <span style={{color:c.ink300,fontFamily:_f().ui,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',minWidth:0,flex:'1 1 auto'}}>
            <span style={{fontFamily:_f().display,fontStyle:'italic',color:c.cream}}>{p.nextTier}</span>'ye
          </span>
          <span style={{color:c.gold,fontWeight:700,fontFamily:_f().ui,fontVariantNumeric:'tabular-nums',whiteSpace:'nowrap',flexShrink:0}}>
            {window.IYI_V2.fmt(p.karmaToNext)} kaldı
          </span>
        </div>
        <div style={{height:6,background:'rgba(255,255,255,.05)',borderRadius:999,overflow:'hidden'}}>
          <div style={{
            height:'100%', width:`${pct}%`,
            background:`linear-gradient(90deg, ${c.goldDim}, ${c.gold})`,
            borderRadius:999,
            transition:`width ${window.IYI.motion.slow}`,
          }}/>
        </div>
      </div>

      {/* Stat strip */}
      <div style={{display:'flex',marginTop:18,paddingTop:16,borderTop:`1px solid ${c.ink600}`}}>
        <HeroStat label="GÖREV" value={p.completed} sub="tamamlandı"/>
        <div style={{width:1,background:c.ink600}}/>
        <HeroStat label="SERİ" value={`${p.streak} gün`} sub="kesintisiz" icon={<Icon.flame size={11} color={c.gold}/>}/>
        <div style={{width:1,background:c.ink600}}/>
        <HeroStat label="SIRA" value="#142" sub="bu ay"/>
      </div>
    </div>
  );
}

function HeroStat({ label, value, sub, icon }) {
  const c = _C();
  return (
    <div style={{flex:1,textAlign:'center',padding:'0 4px'}}>
      <div style={{...window.IYI.typo('eyebrow'), color: c.ink300, fontFamily:_f().ui, fontSize:9}}>{label}</div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:4,marginTop:5}}>
        {icon}
        <div style={{
          fontFamily:_f().ui, fontSize:16, fontWeight:700, color: c.cream,
          letterSpacing:'-0.015em', fontVariantNumeric:'tabular-nums',
        }}>{value}</div>
      </div>
      <div style={{fontSize:10, color: c.ink300, marginTop:3}}>{sub}</div>
    </div>
  );
}

// ═════════════════════════════════ TIER BADGE ═════════════════════════════════
function TierBadge({ tier }) {
  const c = _C();
  return (
    <span style={{
      display:'inline-flex',alignItems:'center',gap:5,flexShrink:0,whiteSpace:'nowrap',
      padding:'5px 10px 5px 8px', borderRadius:999,
      background: c.goldSoft, border:`1px solid ${c.goldLine}`,
    }}>
      <svg width="10" height="10" viewBox="0 0 12 12">
        <path d="M6 1l1.5 3L11 4.5l-2.5 2L9 10 6 8.3 3 10l.5-3.5L1 4.5 4.5 4z" fill={c.gold}/>
      </svg>
      <span style={{
        fontFamily:_f().ui, fontSize: 11, fontWeight: 700,
        color: c.gold, letterSpacing:'.02em',
      }}>{tier}</span>
    </span>
  );
}

// ═════════════════════════════════ BOTTOM NAV ═════════════════════════════════
function BottomNav({ active = 'home' }) {
  const c = _C();
  const items = [
    { k:'home',     label:'Ana Sayfa', Icn: Icon.home },
    { k:'search',   label:'Keşfet',    Icn: Icon.search },
    { k:'missions', label:'Görevler',  Icn: Icon.missions },
    { k:'rewards',  label:'Ödüller',   Icn: Icon.rewards },
    { k:'profile',  label:'Profil',    Icn: Icon.profile },
  ];
  return (
    <div style={{
      position:'absolute',left:0,right:0,bottom:0,zIndex:100,
      background:'rgba(26,22,18,.85)',
      backdropFilter:'blur(18px) saturate(140%)',
      borderTop:`1px solid ${c.ink600}`,
      padding:'10px 8px 28px',
      display:'flex',justifyContent:'space-around',
    }}>
      {items.map(it => {
        const isActive = active === it.k;
        const col = isActive ? c.gold : c.ink300;
        return (
          <button key={it.k} style={{
            background:'none',border:'none',cursor:'pointer',
            display:'flex',flexDirection:'column',alignItems:'center',gap:3,
            flex:1, padding:'4px 0',
            transition:`all ${window.IYI.motion.base}`,
          }}>
            <div style={{position:'relative'}}>
              {isActive && <div style={{position:'absolute',inset:-8,borderRadius:'50%',background:c.goldSoft}}/>}
              <it.Icn size={22} color={col} style={{position:'relative'}}/>
            </div>
            <span style={{fontFamily:_f().ui,fontSize:10,fontWeight:600,color:col,letterSpacing:'.02em'}}>
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ═════════════════════════════════ REWARD CARD ═════════════════════════════════
// Prize tile — photo + partner logo + cost in Karma.
function RewardCard({ title, partnerLogo, partnerName, cost, image }) {
  const c = _C();
  return (
    <div style={{
      background: c.ink800, borderRadius: 14, overflow:'hidden',
      border: `1px solid ${c.ink600}`,
    }}>
      <div style={{position:'relative',aspectRatio:'4/3',overflow:'hidden'}}>
        <img src={image} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(26,22,18,0) 50%, rgba(26,22,18,.8))'}}/>
        <div style={{position:'absolute',left:10,bottom:10,display:'flex',alignItems:'center',gap:6}}>
          <div style={{width:22,height:22,borderRadius:'50%',background:'white',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
            <img src={partnerLogo} alt="" style={{width:'72%',height:'72%',objectFit:'contain'}}/>
          </div>
          <span style={{fontSize:11,fontFamily:_f().ui,fontWeight:600,color:c.cream,textShadow:'0 1px 2px rgba(0,0,0,.4)'}}>
            {partnerName}
          </span>
        </div>
      </div>
      <div style={{padding:'12px 14px 14px'}}>
        <div style={{fontFamily:_f().ui,fontSize:14,fontWeight:600,color:c.cream,letterSpacing:'-0.015em',lineHeight:1.25}}>{title}</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:10,paddingTop:10,borderTop:`1px solid ${c.ink600}`}}>
          <div style={{display:'flex',alignItems:'center',gap:5}}>
            <KarmaDotToken size={11}/>
            <span style={{fontFamily:_f().ui,fontSize:13,fontWeight:700,color:c.gold,fontVariantNumeric:'tabular-nums',letterSpacing:'-0.01em'}}>
              {window.IYI_V2.fmt(cost)}
            </span>
          </div>
          <span style={{fontSize:10,color:c.ink300,fontWeight:600,letterSpacing:'.08em'}}>TAKAS →</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MissionCard, NGOCard, HeroCard, HeroStat, TierBadge, BottomNav, RewardCard, MetaChip });
