/* global React */
const { useState } = React;

// ====== Primitive: Icon (simple inline SVGs, lucide-like stroke 2) ======
function Icon({ name, size = 18, color = 'currentColor' }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home: <><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></>,
    list: <><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>,
    gift: <><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v9H5v-9"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8M16.5 8a2.5 2.5 0 0 0 0-5C14 3 12 8 12 8"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></>,
    flame: <path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 1-3s-3 2-3 6a6 6 0 0 0 12 0c0-5-6-11-6-11z"/>,
    sparkles: <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></>,
    check: <><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
    chevron: <path d="M9 6l6 6-6 6"/>,
    lock: <><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
    pencil: <><path d="M4 20h4l10-10-4-4L4 16v4z"/><path d="M14 6l4 4"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    x: <><path d="M6 6l12 12M6 18L18 6"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></>,
    map: <><path d="M21 6v14l-6-2-6 2-6-2V4l6 2 6-2 6 2z"/><path d="M9 4v14M15 6v14"/></>,
    trophy: <><path d="M6 4h12v4a6 6 0 0 1-12 0V4z"/><path d="M6 6H3v2a3 3 0 0 0 3 3M18 6h3v2a3 3 0 0 1-3 3"/><path d="M9 16h6l-1 4h-4z"/></>,
  };
  return <svg {...p}>{paths[name]}</svg>;
}

// ====== Status bar ======
function StatusBar() {
  return (
    <div style={{height:44,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 24px',fontSize:13,fontWeight:700,color:'#1C1917'}}>
      <span>9:41</span>
      <span style={{display:'flex',gap:4,alignItems:'center',fontSize:11}}>
        <span>●●●●</span><span>📶</span><span>🔋</span>
      </span>
    </div>
  );
}

// ====== Bottom Nav ======
function BottomNav({ active, onChange }) {
  const items = [
    { id:'home', label:'Ana Sayfa', icon:'home' },
    { id:'missions', label:'Görevler', icon:'list' },
    { id:'ngos', label:'Kuruluşlar', icon:'heart' },
    { id:'rewards', label:'Ödüller', icon:'gift' },
    { id:'profile', label:'Profil', icon:'user' },
  ];
  return (
    <nav style={{position:'absolute',bottom:0,left:0,right:0,height:72,background:'white',borderTop:'1px solid #E7E5E0',display:'flex',alignItems:'flex-start',paddingTop:8,paddingBottom:18,zIndex:30}}>
      {items.map(it=>{
        const on = active === it.id;
        return (
          <button key={it.id} onClick={()=>onChange(it.id)} style={{flex:1,background:'none',border:'none',padding:'4px 0',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
            <div style={{width:44,height:26,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:999,background: on?'rgba(244,185,66,.18)':'transparent'}}>
              <Icon name={it.icon} size={20} color={on?'#C18613':'#A8A29E'} />
            </div>
            <span style={{fontSize:10,fontWeight:600,color:on?'#C18613':'#A8A29E'}}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ====== Header ======
function Header({ title, onBack, right }) {
  return (
    <div style={{padding:'56px 16px 12px',display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,background:'rgba(250,250,245,.95)',backdropFilter:'blur(8px)',zIndex:20}}>
      {onBack && <button onClick={onBack} style={{width:36,height:36,borderRadius:999,border:'1px solid #E7E5E0',background:'white',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="chevron" size={18} color="#1C1917" /></button>}
      <h1 style={{flex:1,margin:0,fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:22,letterSpacing:'-0.01em',color:'#1C1917'}}>{title}</h1>
      {right}
    </div>
  );
}

// ====== Hero Card (Dashboard) ======
function HeroCard({ profile }) {
  const tier = window.IYI.tierFor(profile.karma);
  const next = window.IYI.nextTier(profile.karma);
  const pct = next ? Math.min(100, Math.round(((profile.karma - tier.min) / (next.min - tier.min)) * 100)) : 100;
  return (
    <div style={{margin:'0 16px',borderRadius:28,background:'linear-gradient(135deg,#F4B942 0%,#F97316 100%)',padding:20,boxShadow:'0 8px 32px rgba(251,146,60,0.35)',color:'white',position:'relative',overflow:'hidden'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
        <div>
          <div style={{fontSize:13,opacity:.8,fontWeight:500}}>Merhaba,</div>
          <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:26,lineHeight:1.1}}>{profile.firstName}</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(255,255,255,.22)',padding:'6px 12px',borderRadius:999}}>
          <Icon name="flame" size={14} color="white"/><b style={{fontSize:13}}>{profile.streak}</b><span style={{fontSize:11,opacity:.8}}>gün</span>
        </div>
      </div>
      <div style={{display:'flex',alignItems:'flex-end',gap:8}}>
        <Icon name="sparkles" size={22} color="rgba(255,255,255,.8)"/>
        <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:900,fontSize:46,letterSpacing:'-0.02em',lineHeight:1,fontVariantNumeric:'tabular-nums'}}>{window.IYI.fmt(profile.karma)}</div>
      </div>
      <div style={{fontSize:12,opacity:.8,fontWeight:500,marginTop:4,marginBottom:14}}>toplam Karma</div>
      {next && (
        <>
          <div style={{height:8,background:'rgba(255,255,255,.22)',borderRadius:999,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${pct}%`,background:'white',borderRadius:999}}/>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:6,fontSize:11,fontWeight:700,opacity:.9,letterSpacing:'.04em'}}>
            <span>{tier.emoji} {tier.name}</span>
            <span>{window.IYI.fmt(next.min - profile.karma)} Karma → {next.emoji} {next.name}</span>
          </div>
        </>
      )}
      <div style={{position:'absolute',top:14,right:80,fontSize:56,opacity:.35,lineHeight:1}}>{profile.avatar}</div>
    </div>
  );
}

// ====== Mission Card ======
function MissionCard({ mission, compact, onClick, completed, taken }) {
  const ngo = window.IYI_DATA.ngos.find(n=>n.id===mission.ngoId);
  const dom = window.IYI.domains[mission.domain];
  const diff = window.IYI.difficulty[mission.difficulty];
  return (
    <button onClick={onClick} style={{all:'unset',cursor:'pointer',display:'block',width:compact?230:'100%',borderRadius:24,overflow:'hidden',background:'white',boxShadow:'0 4px 24px rgba(0,0,0,.08)',border:'1px solid #F5F5F4',opacity:completed?.7:1}}>
      <div style={{background:dom.gradient,padding:'12px 12px 10px',position:'relative'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <img src={ngo.logo} alt={ngo.name} style={{width:30,height:30,borderRadius:8,background:'rgba(255,255,255,.95)',padding:3,objectFit:'contain'}}/>
            <span style={{color:'white',fontWeight:600,fontSize:12,maxWidth:110,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ngo.short}</span>
          </div>
          <div style={{background:'rgba(255,255,255,.22)',padding:'3px 10px',borderRadius:999,display:'flex',alignItems:'center',gap:4}}>
            <Icon name="sparkles" size={11} color="rgba(255,255,255,.95)"/>
            <b style={{color:'white',fontSize:12}}>{mission.karma}</b>
          </div>
        </div>
        <div style={{textAlign:'right',marginTop:6,fontSize:10,letterSpacing:'.16em',fontWeight:700,color:'rgba(255,255,255,.7)'}}>{dom.icon} {dom.label}</div>
        {completed && <div style={{position:'absolute',top:10,right:68}}><Icon name="check" size={16} color="white"/></div>}
      </div>
      <div style={{padding:'10px 12px 12px',background:'white'}}>
        <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:14,color:'#1C1917',lineHeight:1.3,display:'-webkit-box',WebkitLineClamp:1,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{mission.title}</div>
        {taken && !completed && (
          <div style={{marginTop:6}}>
            <div style={{fontSize:10,color:'#3B82F6',fontWeight:700}}>Devam ediyor</div>
            <div style={{height:3,background:'#F5F5F4',borderRadius:999,marginTop:3,overflow:'hidden'}}><div style={{height:'100%',width:'55%',background:'#60A5FA'}}/></div>
          </div>
        )}
        {!compact && <div style={{fontSize:12,color:'#78716C',marginTop:4,display:'-webkit-box',WebkitLineClamp:1,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{mission.description}</div>}
        <div style={{display:'flex',alignItems:'center',gap:8,marginTop:8}}>
          <span style={{display:'flex',alignItems:'center',gap:3,fontSize:11,color:'#A8A29E'}}><Icon name="clock" size={11}/>{mission.duration}</span>
          <span style={{background:diff.bg,color:diff.fg,fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:999}}>{diff.label}</span>
          <span style={{marginLeft:'auto',color:'#D6D3D1'}}><Icon name="chevron" size={14}/></span>
        </div>
      </div>
    </button>
  );
}

// ====== Reward Card ======
function RewardCard({ reward, userKarma, onClaim }) {
  const locked = userKarma < reward.cost;
  return (
    <div style={{display:'flex',background:'white',borderRadius:20,overflow:'hidden',boxShadow:'0 4px 24px rgba(0,0,0,.08)',border:'1px solid #F5F5F4',opacity:locked?.65:1}}>
      <div style={{width:96,background:reward.gradient,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'white',padding:'12px 6px',gap:4}}>
        <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:11,letterSpacing:'.02em',textAlign:'center'}}>{reward.brand}</div>
        <div style={{fontSize:30,lineHeight:1}}>{reward.icon}</div>
      </div>
      <div style={{borderLeft:'1.5px dashed #E7E5E0',margin:'10px 0'}}/>
      <div style={{flex:1,padding:'14px 14px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
        <div>
          <div style={{fontWeight:700,fontSize:14,color:'#1C1917',lineHeight:1.3}}>{reward.title}</div>
          <div style={{fontSize:11,color:'#78716C',marginTop:4,lineHeight:1.45}}>{reward.desc}</div>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
          <span style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:14,color:'#C18613'}}>{window.IYI.fmt(reward.cost)} Karma</span>
          <button onClick={()=>!locked && onClaim(reward)} disabled={locked} style={{background:locked?'#E7E5E0':'#F4B942',color:locked?'#A8A29E':'#1C1917',fontWeight:700,fontSize:12,padding:'7px 14px',borderRadius:999,border:'none',cursor:locked?'not-allowed':'pointer',boxShadow:locked?'none':'0 2px 10px rgba(244,185,66,.4)',display:'flex',alignItems:'center',gap:4}}>
            {locked && <Icon name="lock" size={11}/>}{locked?'Kilitli':'Kullan'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ====== NGO Card ======
function NGOCard({ ngo, onClick }) {
  return (
    <button onClick={onClick} style={{all:'unset',cursor:'pointer',display:'block',width:200,flex:'0 0 200px',borderRadius:22,overflow:'hidden',background:'white',boxShadow:'0 4px 24px rgba(0,0,0,.08)',border:'1px solid #F5F5F4'}}>
      <div style={{height:90,background:ngo.color,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <img src={ngo.logo} alt={ngo.name} style={{maxHeight:60,maxWidth:'70%',background:'rgba(255,255,255,.92)',borderRadius:12,padding:8,objectFit:'contain'}}/>
      </div>
      <div style={{padding:'10px 12px 14px'}}>
        <div style={{fontWeight:700,fontSize:13,color:'#1C1917'}}>{ngo.name}</div>
        <div style={{fontSize:11,color:'#78716C',marginTop:2}}>Gönüllülük ortağı</div>
      </div>
    </button>
  );
}

// ====== Section header ======
function SectionHeader({ title, action }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 16px',marginBottom:12}}>
      <h2 style={{margin:0,fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:19,color:'#1C1917'}}>{title}</h2>
      {action && <button onClick={action.onClick} style={{all:'unset',cursor:'pointer',fontSize:13,fontWeight:700,color:'#C18613'}}>{action.label}</button>}
    </div>
  );
}

Object.assign(window, { IyiIcon: Icon, StatusBar, BottomNav, Header, HeroCard, MissionCard, RewardCard, NGOCard, SectionHeader });
