/* global React */
// Direction B' — Premium × Warm (not dark)
// B'nin fintech disiplini + altın Karma korundu. Saf siyah → warm charcoal. Daha az ağır, daha okunaklı.

function DirBPrime() {
  const p = window.IYI_V2.profile;
  const missions = window.IYI_V2.missions.slice(0, 3);
  const ngos = Object.values(window.IYI_V2.ngos).slice(0, 5);

  // Palette
  const C = {
    bg:      '#24201B',  // warm ink, not black
    card:    '#2E2923',  // raised surface
    cardHi:  '#36302A',  // hover/highlight surface
    line:    '#3F3830',  // hairlines
    text:    '#F4EEDF',  // warm cream
    muted:   '#A89E8A',  // muted cream
    gold:    '#E8C268',  // matte gold (accent)
    goldDim: '#B58F3D',  // secondary gold
  };

  return (
    <div style={{
      fontFamily:'"Inter", sans-serif', background:C.bg, color:C.text, minHeight:'100%',
      paddingBottom: 100,
    }}>
      {/* Header */}
      <div style={{padding:'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:11,letterSpacing:'.14em',textTransform:'uppercase',color:C.muted,fontWeight:600}}>18 NİSAN · CUMARTESİ</div>
          <div style={{fontFamily:'"Plus Jakarta Sans", sans-serif',fontSize:20,fontWeight:600,letterSpacing:'-0.02em',marginTop:2,color:C.text}}>
            Günaydın, {p.firstName}
          </div>
        </div>
        <button style={{width:40,height:40,borderRadius:'50%',border:`1px solid ${C.line}`,background:C.card,color:C.text,fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'"Plus Jakarta Sans", sans-serif'}}>A</button>
      </div>

      {/* Hero — statement */}
      <div style={{padding:'24px 16px 0'}}>
        <div style={{
          background:C.card, borderRadius:22, padding:'22px 22px 18px',
          border:`1px solid ${C.line}`, position:'relative', overflow:'hidden',
        }}>
          {/* Subtle gold arc */}
          <svg width="200" height="200" style={{position:'absolute',right:-60,top:-60,opacity:.12,pointerEvents:'none'}} viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" stroke={C.gold} strokeWidth="0.8" fill="none"/>
            <circle cx="100" cy="100" r="60" stroke={C.gold} strokeWidth="0.8" fill="none"/>
            <circle cx="100" cy="100" r="30" stroke={C.gold} strokeWidth="0.8" fill="none"/>
          </svg>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div style={{fontSize:10,letterSpacing:'.22em',textTransform:'uppercase',color:C.muted,fontWeight:600}}>Karma Hesabın</div>
            <div style={{padding:'4px 9px',borderRadius:999,background:'rgba(232,194,104,.12)',border:`1px solid ${C.gold}40`,color:C.gold,fontSize:10,fontWeight:600,letterSpacing:'.04em'}}>
              Çok İyi Biri
            </div>
          </div>
          <div style={{display:'flex',alignItems:'baseline',gap:6,marginTop:10}}>
            <div style={{fontFamily:'"Plus Jakarta Sans", sans-serif',fontWeight:700,fontSize:58,lineHeight:.95,letterSpacing:'-0.035em',color:C.gold,fontVariantNumeric:'tabular-nums'}}>
              {window.IYI_V2.fmt(p.karma)}
            </div>
            <div style={{fontSize:13,color:C.muted,letterSpacing:'.04em',marginLeft:4}}>Karma</div>
          </div>

          {/* Progress */}
          <div style={{marginTop:18}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:8}}>
              <span style={{color:C.muted}}>Çoook İyi Biri'ye</span>
              <span style={{color:C.gold,fontWeight:600,fontVariantNumeric:'tabular-nums'}}>{window.IYI_V2.fmt(p.karmaToNext)} kaldı</span>
            </div>
            <div style={{height:6,background:'rgba(255,255,255,.06)',borderRadius:999,overflow:'hidden',position:'relative'}}>
              <div style={{height:'100%',width:'58%',background:`linear-gradient(90deg, ${C.goldDim}, ${C.gold})`,borderRadius:999}}/>
            </div>
          </div>

          {/* Stat row */}
          <div style={{display:'flex',gap:0,marginTop:18,paddingTop:16,borderTop:`1px solid ${C.line}`}}>
            <StatB label="GÖREV" value={p.completed} sub="tamamlandı" C={C}/>
            <div style={{width:1,background:C.line}}/>
            <StatB label="SERİ" value={`${p.streak} gün`} sub="kesintisiz" C={C}/>
            <div style={{width:1,background:C.line}}/>
            <StatB label="SIRA" value="#142" sub="bu ay" C={C}/>
          </div>
        </div>
      </div>

      {/* Chips */}
      <div style={{padding:'26px 0 4px',display:'flex',gap:8,overflowX:'auto',scrollbarWidth:'none',paddingLeft:20,paddingRight:20}}>
        {[['Tümü',true],['Yakınımda',false],['Bu hafta sonu',false],['Online',false],['Kısa',false]].map(([l,active]) => (
          <button key={l} style={{
            flexShrink:0,padding:'9px 14px',borderRadius:999,border:'1px solid',
            borderColor: active ? C.gold : C.line,
            background: active ? 'rgba(232,194,104,.1)' : 'transparent',
            color: active ? C.gold : C.muted,
            fontSize:13,fontWeight:500,cursor:'pointer',letterSpacing:'-0.01em',
          }}>{l}</button>
        ))}
      </div>

      {/* Section */}
      <div style={{padding:'24px 20px 10px',display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
        <h2 style={{margin:0,fontFamily:'"Plus Jakarta Sans", sans-serif',fontWeight:700,fontSize:22,letterSpacing:'-0.025em',color:C.text}}>Senin için</h2>
        <span style={{fontSize:11,color:C.gold,letterSpacing:'.06em',fontWeight:600}}>TÜMÜ →</span>
      </div>

      {/* Mission cards */}
      <div style={{padding:'12px 16px',display:'flex',flexDirection:'column',gap:16}}>
        {missions.map(m => {
          const ngo = window.IYI_V2.ngos[m.ngoId];
          return (
            <div key={m.id} style={{
              background:C.card, borderRadius:20, overflow:'hidden',
              border:`1px solid ${C.line}`,
            }}>
              <div style={{position:'relative',aspectRatio:'16/10'}}>
                <img src={m.photo} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                {/* Softer gradient — photo stays visible */}
                <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(36,32,27,0) 40%, rgba(36,32,27,.35) 70%, rgba(36,32,27,.85) 100%)'}}/>
                <div style={{position:'absolute',top:12,left:12,right:12,display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div style={{padding:'5px 10px',borderRadius:999,background:'rgba(36,32,27,.6)',backdropFilter:'blur(10px)',fontSize:10,letterSpacing:'.14em',textTransform:'uppercase',fontWeight:700,color:C.text,border:`1px solid rgba(244,238,223,.12)`}}>
                    {m.category}
                  </div>
                  <button style={{width:34,height:34,borderRadius:'50%',border:`1px solid rgba(244,238,223,.14)`,background:'rgba(36,32,27,.6)',backdropFilter:'blur(10px)',color:C.text,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  </button>
                </div>
                {/* NGO byline on photo */}
                <div style={{position:'absolute',left:14,bottom:14,display:'flex',alignItems:'center',gap:8}}>
                  <div style={{width:24,height:24,borderRadius:'50%',background:'white',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                    <img src={ngo.logo} alt="" style={{width:'72%',height:'72%',objectFit:'contain'}}/>
                  </div>
                  <span style={{fontSize:11,color:C.text,fontWeight:600,letterSpacing:'.02em',textShadow:'0 1px 2px rgba(0,0,0,.4)'}}>{ngo.name}</span>
                </div>
              </div>

              <div style={{padding:'16px 18px 16px'}}>
                <h3 style={{margin:0,fontFamily:'"Plus Jakarta Sans", sans-serif',fontWeight:700,fontSize:19,letterSpacing:'-0.02em',lineHeight:1.2,color:C.text}}>{m.title}</h3>
                <p style={{margin:'6px 0 14px',fontSize:13,lineHeight:1.5,color:C.muted}}>{m.impact}</p>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{display:'flex',gap:6}}>
                    <ChipB icon={<IconClockB col={C.muted}/>} C={C}>{m.duration}</ChipB>
                    <ChipB icon={<IconPinB col={C.muted}/>} C={C}>{m.location}</ChipB>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:5,background:'rgba(232,194,104,.1)',border:`1px solid ${C.gold}50`,padding:'7px 11px',borderRadius:999}}>
                    <span style={{fontFamily:'"Plus Jakarta Sans", sans-serif',fontSize:13,fontWeight:700,color:C.gold,letterSpacing:'-0.01em',fontVariantNumeric:'tabular-nums'}}>+{m.karma}</span>
                    <svg width="9" height="9" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5.5" fill={C.gold}/></svg>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* NGO rail */}
      <div style={{padding:'32px 0 8px'}}>
        <div style={{padding:'0 20px 14px',display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
          <h2 style={{margin:0,fontFamily:'"Plus Jakarta Sans", sans-serif',fontSize:20,fontWeight:700,letterSpacing:'-0.02em',color:C.text}}>Ortaklarımız</h2>
          <span style={{fontSize:11,color:C.gold,fontWeight:600,letterSpacing:'.06em'}}>TÜMÜ →</span>
        </div>
        <div style={{display:'flex',gap:10,overflowX:'auto',padding:'0 20px 20px',scrollbarWidth:'none'}}>
          {ngos.map(n => (
            <div key={n.short} style={{flex:'0 0 150px',background:C.card,border:`1px solid ${C.line}`,borderRadius:16,overflow:'hidden'}}>
              <div style={{aspectRatio:'1',overflow:'hidden',position:'relative'}}>
                <img src={n.cover} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,transparent 50%,rgba(36,32,27,.85))'}}/>
                <div style={{position:'absolute',left:10,bottom:10,width:32,height:32,borderRadius:'50%',background:'white',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                  <img src={n.logo} alt="" style={{width:'72%',height:'72%',objectFit:'contain'}}/>
                </div>
              </div>
              <div style={{padding:'10px 12px 12px'}}>
                <div style={{fontFamily:'"Plus Jakarta Sans", sans-serif',fontSize:13,fontWeight:600,color:C.text,letterSpacing:'-0.01em'}}>{n.name}</div>
                <div style={{fontSize:10,color:C.muted,marginTop:2}}>12 aktif görev</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNavB C={C}/>
    </div>
  );
}

function StatB({ label, value, sub, C }) {
  return (
    <div style={{flex:1,textAlign:'center'}}>
      <div style={{fontSize:9,letterSpacing:'.16em',color:C.muted,fontWeight:600}}>{label}</div>
      <div style={{fontFamily:'"Plus Jakarta Sans", sans-serif',fontSize:16,fontWeight:700,color:C.text,marginTop:4,letterSpacing:'-0.015em'}}>{value}</div>
      <div style={{fontSize:10,color:C.muted,marginTop:2}}>{sub}</div>
    </div>
  );
}

function ChipB({ icon, children, C }) {
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:11,color:C.muted,background:'rgba(255,255,255,.04)',padding:'6px 9px',borderRadius:999,border:`1px solid ${C.line}`,fontWeight:500}}>
      <span style={{display:'flex',alignItems:'center'}}>{icon}</span>
      {children}
    </span>
  );
}

function IconClockB({ col }) { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function IconPinB({ col }) { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }

function BottomNavB({ C }) {
  const items = [
    { label:'Ana Sayfa', active:true, icon:(c)=> <svg width="22" height="22" viewBox="0 0 24 24" fill={c===C.gold?C.gold:'none'} stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l9-9 9 9v9a2 2 0 0 1-2 2h-5v-6h-4v6H5a2 2 0 0 1-2-2z"/></svg> },
    { label:'Keşfet', active:false, icon:(c)=> <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg> },
    { label:'Görevler', active:false, icon:(c)=> <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
    { label:'Ödüller', active:false, icon:(c)=> <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg> },
    { label:'Profil', active:false, icon:(c)=> <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];
  return (
    <div style={{position:'absolute',left:0,right:0,bottom:0,background:'rgba(36,32,27,.88)',backdropFilter:'blur(18px)',borderTop:`1px solid ${C.line}`,padding:'10px 8px 28px',display:'flex',justifyContent:'space-around',zIndex:100}}>
      {items.map(it => {
        const c = it.active ? C.gold : C.muted;
        return (
          <div key={it.label} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,flex:1,cursor:'pointer'}}>
            {it.icon(c)}
            <span style={{fontSize:10,fontWeight:600,color:c,letterSpacing:'.02em'}}>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
}

window.DirBPrime = DirBPrime;
