/* global React */
// Direction A' — Editorial × Mobile
// A'nın olgunluğu (krem + terracotta + Fraunces) + iOS-katı floating kartlar, yumuşak radius, micro-interactions.

function DirAPrime() {
  const p = window.IYI_V2.profile;
  const missions = window.IYI_V2.missions.slice(0, 3);
  const ngos = Object.values(window.IYI_V2.ngos).slice(0, 5);
  return (
    <div style={{
      fontFamily:'"Inter", sans-serif', background:'#F5F1EA', color:'#1A1A1A', minHeight:'100%',
      paddingBottom: 100,
    }}>
      {/* Header — sade, mobil */}
      <div style={{padding:'58px 20px 0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:11,letterSpacing:'.14em',textTransform:'uppercase',color:'#8B8578',fontWeight:600}}>Cumartesi · 18 Nisan</div>
          <div style={{fontFamily:'"Fraunces", serif',fontSize:22,fontWeight:500,letterSpacing:'-0.02em',marginTop:2,color:'#1A1A1A'}}>
            Günaydın, <span style={{fontStyle:'italic'}}>{p.firstName}</span>.
          </div>
        </div>
        <button style={{width:40,height:40,borderRadius:'50%',border:'none',background:'#1A1A1A',color:'#F5F1EA',fontSize:14,fontWeight:600,fontFamily:'"Fraunces", serif',boxShadow:'0 2px 10px rgba(0,0,0,.15)'}}>A</button>
      </div>

      {/* Hero — floating krem kart, editorial balance */}
      <div style={{padding:'20px 16px 0'}}>
        <div style={{
          background:'#FFFFFF', borderRadius:22, padding:'22px 22px 18px',
          boxShadow:'0 1px 2px rgba(26,20,10,.04), 0 12px 28px rgba(26,20,10,.06)',
          position:'relative', overflow:'hidden',
        }}>
          {/* Corner mark */}
          <div style={{position:'absolute',top:20,right:22,display:'flex',alignItems:'center',gap:6}}>
            <span style={{fontSize:10,letterSpacing:'.2em',color:'#8B8578',fontWeight:600,textTransform:'uppercase'}}>Karma</span>
            <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5.5" fill="#C8553D"/></svg>
          </div>
          <div style={{fontSize:10,letterSpacing:'.22em',textTransform:'uppercase',color:'#8B8578',fontWeight:600}}>Biriktirdiğin</div>
          <div style={{display:'flex',alignItems:'baseline',gap:8,marginTop:6}}>
            <div style={{fontFamily:'"Fraunces", serif',fontWeight:500,fontSize:62,lineHeight:.95,letterSpacing:'-0.035em',color:'#1A1A1A',fontVariantNumeric:'tabular-nums'}}>
              {window.IYI_V2.fmt(p.karma)}
            </div>
          </div>
          <div style={{fontSize:13,color:'#5C5448',lineHeight:1.5,marginTop:10,maxWidth:280}}>
            <span style={{fontFamily:'"Fraunces", serif',fontStyle:'italic',color:'#C8553D'}}>Çok İyi Biri</span> seviyesindesin. <b style={{color:'#1A1A1A',fontWeight:600}}>{window.IYI_V2.fmt(p.karmaToNext)} Karma</b> sonra <span style={{fontFamily:'"Fraunces", serif',fontStyle:'italic'}}>Çoook İyi Biri</span>.
          </div>
          {/* App-style progress */}
          <div style={{marginTop:18,height:4,background:'#F0EADB',borderRadius:999,overflow:'hidden'}}>
            <div style={{height:'100%',width:'58%',background:'#C8553D',borderRadius:999}}/>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:14,paddingTop:14,borderTop:'1px solid #F0EADB'}}>
            <Stat label="GÖREV" value={p.completed} sub="tamamlandı"/>
            <div style={{width:1,background:'#F0EADB'}}/>
            <Stat label="SERİ" value={`${p.streak} gün`} sub="kesintisiz"/>
            <div style={{width:1,background:'#F0EADB'}}/>
            <Stat label="SIRA" value="#142" sub="bu ay"/>
          </div>
        </div>
      </div>

      {/* Horizontal filter chips (mobil) */}
      <div style={{padding:'24px 0 4px',display:'flex',gap:8,overflowX:'auto',scrollbarWidth:'none',paddingLeft:20,paddingRight:20}}>
        {[['Tümü',true],['Yakınımda',false],['Bu hafta sonu',false],['Online',false],['Kısa',false],['Uzun',false]].map(([l,active]) => (
          <button key={l} style={{
            flexShrink:0,padding:'9px 14px',borderRadius:999,border:'1px solid',
            borderColor: active ? '#1A1A1A' : '#E2DCCF',
            background: active ? '#1A1A1A' : 'transparent',
            color: active ? '#F5F1EA' : '#3E3A34',
            fontSize:13,fontWeight:500,letterSpacing:'-0.01em',cursor:'pointer',
          }}>{l}</button>
        ))}
      </div>

      {/* Section — editorial headline, app spacing */}
      <div style={{padding:'22px 20px 10px',display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
        <div>
          <div style={{fontSize:10,letterSpacing:'.22em',textTransform:'uppercase',color:'#C8553D',marginBottom:3,fontWeight:600}}>Bu Hafta</div>
          <h2 style={{margin:0,fontFamily:'"Fraunces", serif',fontSize:24,fontWeight:500,letterSpacing:'-0.02em',lineHeight:1.1}}>Sana göre seçtik</h2>
        </div>
      </div>

      {/* Mission cards — editorial type on photo, floating, pill details */}
      <div style={{padding:'12px 16px',display:'flex',flexDirection:'column',gap:16}}>
        {missions.map(m => {
          const ngo = window.IYI_V2.ngos[m.ngoId];
          return (
            <article key={m.id} style={{
              background:'#FFFFFF', borderRadius:20, overflow:'hidden',
              boxShadow:'0 1px 2px rgba(26,20,10,.04), 0 10px 24px rgba(26,20,10,.05)',
            }}>
              {/* Photo with editorial overlays */}
              <div style={{position:'relative',aspectRatio:'16/10',overflow:'hidden'}}>
                <img src={m.photo} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                {/* Top row: category + save */}
                <div style={{position:'absolute',top:12,left:12,right:12,display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div style={{background:'rgba(245,241,234,.95)',backdropFilter:'blur(10px)',padding:'5px 10px',borderRadius:999,fontSize:10,letterSpacing:'.14em',textTransform:'uppercase',fontWeight:700,color:'#1A1A1A',display:'flex',alignItems:'center',gap:5}}>
                    <span style={{width:5,height:5,borderRadius:'50%',background:'#C8553D'}}/>{m.category}
                  </div>
                  <button style={{width:34,height:34,borderRadius:'50%',border:'none',background:'rgba(245,241,234,.95)',backdropFilter:'blur(10px)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  </button>
                </div>
                {/* Bottom: spots left (urgency cue) */}
                {m.spotsLeft <= 5 && (
                  <div style={{position:'absolute',bottom:12,left:12,background:'#1A1A1A',color:'#F5F1EA',padding:'5px 10px',borderRadius:999,fontSize:10,letterSpacing:'.1em',fontWeight:600,textTransform:'uppercase'}}>
                    Son {m.spotsLeft} kişi
                  </div>
                )}
              </div>

              {/* Body — editorial typography in an app container */}
              <div style={{padding:'16px 18px 18px'}}>
                {/* NGO byline */}
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                  <div style={{width:22,height:22,borderRadius:'50%',background:'#F0EADB',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',flexShrink:0}}>
                    <img src={ngo.logo} alt="" style={{width:'70%',height:'70%',objectFit:'contain'}}/>
                  </div>
                  <span style={{fontSize:11,fontWeight:600,color:'#5C5448',letterSpacing:'.02em'}}>{ngo.name}</span>
                </div>
                {/* Editorial title */}
                <h3 style={{margin:0,fontFamily:'"Fraunces", serif',fontWeight:500,fontSize:21,letterSpacing:'-0.02em',lineHeight:1.15,color:'#1A1A1A'}}>
                  {m.title}
                </h3>
                <p style={{margin:'6px 0 14px',fontSize:13.5,lineHeight:1.5,color:'#5C5448'}}>{m.impact}</p>

                {/* Meta + CTA row — app-style pills */}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    <Chip icon={<IconClock/>}>{m.duration}</Chip>
                    <Chip icon={<IconPin/>}>{m.location}</Chip>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:4,background:'#F5F1EA',padding:'7px 11px',borderRadius:999,border:'1px solid #E2DCCF'}}>
                    <span style={{fontFamily:'"Fraunces", serif',fontSize:14,fontWeight:600,color:'#C8553D',fontVariantNumeric:'tabular-nums',letterSpacing:'-0.01em'}}>+{m.karma}</span>
                    <svg width="10" height="10" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5.5" fill="#C8553D"/></svg>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* NGO rail — editorial tiles, app-scrolled */}
      <div style={{padding:'32px 0 8px'}}>
        <div style={{padding:'0 20px 14px',display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
          <div>
            <div style={{fontSize:10,letterSpacing:'.22em',textTransform:'uppercase',color:'#C8553D',marginBottom:3,fontWeight:600}}>Ortaklar</div>
            <h2 style={{margin:0,fontFamily:'"Fraunces", serif',fontSize:22,fontWeight:500,letterSpacing:'-0.02em'}}>İyiliğin öncüleri</h2>
          </div>
        </div>
        <div style={{display:'flex',gap:12,overflowX:'auto',padding:'0 20px 20px',scrollbarWidth:'none'}}>
          {ngos.map(n => (
            <div key={n.short} style={{flex:'0 0 160px',background:'#FFFFFF',borderRadius:18,overflow:'hidden',boxShadow:'0 1px 2px rgba(26,20,10,.04), 0 8px 20px rgba(26,20,10,.05)'}}>
              <div style={{aspectRatio:'4/5',overflow:'hidden',position:'relative'}}>
                <img src={n.cover} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                <div style={{position:'absolute',bottom:10,left:10,width:34,height:34,borderRadius:'50%',background:'#FFFFFF',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 8px rgba(0,0,0,.15)',overflow:'hidden'}}>
                  <img src={n.logo} alt="" style={{width:'72%',height:'72%',objectFit:'contain'}}/>
                </div>
              </div>
              <div style={{padding:'12px 14px 14px'}}>
                <div style={{fontFamily:'"Fraunces", serif',fontSize:15,fontWeight:500,letterSpacing:'-0.01em',color:'#1A1A1A',lineHeight:1.2}}>{n.name}</div>
                <div style={{fontSize:11,color:'#8B8578',marginTop:2}}>12 aktif görev</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav — app disipline */}
      <BottomNav/>
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div style={{flex:1,textAlign:'center'}}>
      <div style={{fontSize:9,letterSpacing:'.16em',color:'#8B8578',fontWeight:600}}>{label}</div>
      <div style={{fontFamily:'"Fraunces", serif',fontSize:18,fontWeight:500,color:'#1A1A1A',marginTop:3,letterSpacing:'-0.01em'}}>{value}</div>
      <div style={{fontSize:10,color:'#8B8578',marginTop:1}}>{sub}</div>
    </div>
  );
}

function Chip({ icon, children }) {
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:11,color:'#5C5448',background:'#F5F1EA',padding:'6px 9px',borderRadius:999,border:'1px solid #E2DCCF',fontWeight:500}}>
      <span style={{display:'flex',alignItems:'center'}}>{icon}</span>
      {children}
    </span>
  );
}

function IconClock() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8B8578" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function IconPin() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8B8578" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }

function BottomNav() {
  const items = [
    { label:'Ana Sayfa', active:true, icon:(c)=> <svg width="22" height="22" viewBox="0 0 24 24" fill={c==='#C8553D'?'#C8553D':'none'} stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l9-9 9 9v9a2 2 0 0 1-2 2h-5v-6h-4v6H5a2 2 0 0 1-2-2z"/></svg> },
    { label:'Keşfet', active:false, icon:(c)=> <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg> },
    { label:'Görevler', active:false, icon:(c)=> <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
    { label:'Ödüller', active:false, icon:(c)=> <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg> },
    { label:'Profil', active:false, icon:(c)=> <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];
  return (
    <div style={{position:'absolute',left:0,right:0,bottom:0,background:'rgba(245,241,234,.92)',backdropFilter:'blur(16px)',borderTop:'1px solid #E2DCCF',padding:'10px 8px 28px',display:'flex',justifyContent:'space-around',zIndex:100}}>
      {items.map(it => {
        const c = it.active ? '#C8553D' : '#8B8578';
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

window.DirAPrime = DirAPrime;
