/* global React */
// Direction B — "Koyu premium"
// Derin siyah/kömür zemin, krem tipografi, altın sadece Karma sayısında, fintech hissi, full-bleed fotoğraflar.

function DirB() {
  const p = window.IYI_V2.profile;
  const missions = window.IYI_V2.missions.slice(0, 3);
  const ngos = Object.values(window.IYI_V2.ngos).slice(0, 4);
  return (
    <div style={{
      fontFamily:'"Inter", sans-serif', background:'#0E0E10', color:'#EAE6DE', minHeight:'100%',
    }}>
      {/* Status/Header */}
      <div style={{padding:'56px 20px 0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontFamily:'"Plus Jakarta Sans", sans-serif',fontSize:16,fontWeight:700,letterSpacing:'-0.01em'}}>iyibiri</div>
        <button style={{width:36,height:36,borderRadius:'50%',background:'#1A1A1C',border:'1px solid #27272A',color:'#EAE6DE',fontSize:13,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>A</button>
      </div>

      {/* Hero — bank balance */}
      <div style={{padding:'28px 20px 8px'}}>
        <div style={{fontSize:11,letterSpacing:'.12em',textTransform:'uppercase',color:'#8B8578',fontWeight:600}}>Merhaba, {p.firstName}</div>
        <div style={{display:'flex',alignItems:'baseline',gap:10,marginTop:10}}>
          <div style={{fontFamily:'"Plus Jakarta Sans", sans-serif',fontWeight:700,fontSize:64,lineHeight:1,letterSpacing:'-0.035em',color:'#D4AF37',fontVariantNumeric:'tabular-nums'}}>
            {window.IYI_V2.fmt(p.karma)}
          </div>
          <div style={{fontSize:13,color:'#8B8578',letterSpacing:'.04em'}}>Karma</div>
        </div>
        <div style={{display:'flex',gap:16,marginTop:20,paddingBottom:2}}>
          <Stat label="SEVİYE" value={p.tierName} highlight/>
          <div style={{width:1,background:'#27272A'}}/>
          <Stat label="GÖREV" value={p.completed}/>
          <div style={{width:1,background:'#27272A'}}/>
          <Stat label="SERİ" value={`${p.streak} gün`}/>
        </div>
        {/* Progress, subtle */}
        <div style={{marginTop:22,padding:14,borderRadius:8,background:'#18181B',border:'1px solid #27272A'}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:10,color:'#8B8578'}}>
            <span>Sonraki: <span style={{color:'#EAE6DE'}}>{p.nextTier}</span></span>
            <span style={{color:'#D4AF37'}}>+{window.IYI_V2.fmt(p.karmaToNext)} Karma</span>
          </div>
          <div style={{height:2,background:'#27272A',overflow:'hidden'}}>
            <div style={{height:'100%',width:'58%',background:'#D4AF37'}}/>
          </div>
        </div>
      </div>

      {/* Section */}
      <div style={{padding:'36px 20px 14px',display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
        <h2 style={{margin:0,fontFamily:'"Plus Jakarta Sans", sans-serif',fontWeight:600,fontSize:20,letterSpacing:'-0.015em'}}>Senin için</h2>
        <span style={{fontSize:11,color:'#8B8578',letterSpacing:'.06em'}}>TÜMÜ →</span>
      </div>

      {/* Mission — full-bleed cinematic */}
      <div style={{padding:'0 20px',display:'flex',flexDirection:'column',gap:14}}>
        {missions.map(m => {
          const ngo = window.IYI_V2.ngos[m.ngoId];
          return (
            <div key={m.id} style={{position:'relative',borderRadius:10,overflow:'hidden',background:'#18181B',border:'1px solid #27272A'}}>
              <div style={{aspectRatio:'16/10',position:'relative'}}>
                <img src={m.photo} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(0,0,0,.05) 0%,rgba(14,14,16,.45) 55%,rgba(14,14,16,.98) 100%)'}}/>
                <div style={{position:'absolute',top:12,left:12,fontSize:10,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(255,255,255,.85)',fontWeight:600,background:'rgba(0,0,0,.4)',backdropFilter:'blur(8px)',padding:'5px 10px',borderRadius:4}}>{m.category}</div>
                <div style={{position:'absolute',top:12,right:12,fontFamily:'"Plus Jakarta Sans", sans-serif',fontWeight:700,fontSize:14,color:'#D4AF37',background:'rgba(0,0,0,.55)',backdropFilter:'blur(8px)',padding:'5px 10px',borderRadius:4,letterSpacing:'-0.01em'}}>+{m.karma} Karma</div>
                <div style={{position:'absolute',left:16,right:16,bottom:14}}>
                  <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
                    <div style={{width:20,height:20,borderRadius:'50%',background:'white',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                      <img src={ngo.logo} alt="" style={{width:'75%',height:'75%',objectFit:'contain'}}/>
                    </div>
                    <span style={{fontSize:11,color:'rgba(255,255,255,.8)',letterSpacing:'.04em'}}>{ngo.name}</span>
                  </div>
                  <h3 style={{margin:0,fontFamily:'"Plus Jakarta Sans", sans-serif',fontWeight:700,fontSize:20,color:'white',letterSpacing:'-0.02em',lineHeight:1.15}}>{m.title}</h3>
                </div>
              </div>
              <div style={{padding:'14px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{display:'flex',gap:12,fontSize:11,color:'#8B8578'}}>
                  <span>◷ {m.duration}</span>
                  <span>◉ {m.location}</span>
                </div>
                <div style={{fontSize:11,color:'#D4AF37',letterSpacing:'.02em'}}>{m.spotsLeft} kişilik yer →</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* NGO strip, minimal */}
      <div style={{padding:'36px 20px 24px',marginTop:20,borderTop:'1px solid #18181B'}}>
        <h2 style={{margin:'0 0 14px',fontFamily:'"Plus Jakarta Sans", sans-serif',fontWeight:600,fontSize:20,letterSpacing:'-0.015em'}}>Ortaklarımız</h2>
        <div style={{display:'flex',gap:10,overflowX:'auto',scrollbarWidth:'none'}}>
          {ngos.map(n => (
            <div key={n.short} style={{flex:'0 0 130px'}}>
              <div style={{aspectRatio:'1',borderRadius:10,overflow:'hidden',position:'relative',border:'1px solid #27272A'}}>
                <img src={n.cover} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,transparent 40%,rgba(14,14,16,.9))'}}/>
                <div style={{position:'absolute',left:10,bottom:10,right:10,fontSize:12,fontWeight:600,color:'white',letterSpacing:'-0.01em'}}>{n.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div style={{flex:1}}>
      <div style={{fontSize:9,letterSpacing:'.18em',color:'#8B8578',fontWeight:600}}>{label}</div>
      <div style={{marginTop:4,fontSize:13,fontWeight:600,color: highlight ? '#D4AF37' : '#EAE6DE',letterSpacing:'-0.01em'}}>{value}</div>
    </div>
  );
}

window.DirB = DirB;
