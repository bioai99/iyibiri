/* global React */
// Direction C — "Türk toprağı"
// Sıcak toprak tonları (kil, zeytin, eski altın), modern ama kültürel kök, dokulu zemin, humanist tipografi.

function DirC() {
  const p = window.IYI_V2.profile;
  const missions = window.IYI_V2.missions.slice(0, 3);
  const ngos = Object.values(window.IYI_V2.ngos).slice(0, 4);
  // Paper grain via SVG noise as bg
  const grain = 'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 seed=%222%22/><feColorMatrix values=%220 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .08 0%22/></filter><rect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22/></svg>")';
  return (
    <div style={{
      fontFamily:'"Inter", sans-serif', background:'#EDE4D3', color:'#2B2416', minHeight:'100%',
      backgroundImage:`${grain}`, backgroundBlendMode:'multiply',
    }}>
      {/* Header */}
      <div style={{padding:'56px 20px 0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:26,height:26,background:'#B26E3F',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'"Fraunces", serif',fontWeight:600,color:'#EDE4D3',fontSize:14}}>i</div>
          <div style={{fontFamily:'"Fraunces", serif',fontSize:20,fontWeight:600,letterSpacing:'-0.02em',color:'#2B2416'}}>İyiBiri</div>
        </div>
        <div style={{fontSize:11,letterSpacing:'.1em',color:'#6F6450'}}>selam, {p.firstName}</div>
      </div>

      {/* Hero — handcraft tally */}
      <div style={{padding:'24px 20px 20px'}}>
        <div style={{background:'#FAF4E6',border:'1px solid #D9CCAF',borderRadius:20,padding:'24px 20px',position:'relative',overflow:'hidden'}}>
          {/* Corner crest */}
          <svg width="56" height="56" style={{position:'absolute',right:14,top:14,opacity:.85}} viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="26" stroke="#B26E3F" strokeWidth="1"/>
            <circle cx="28" cy="28" r="20" stroke="#B26E3F" strokeWidth="1"/>
            <path d="M28 10 L30 24 L44 26 L32 34 L36 48 L28 40 L20 48 L24 34 L12 26 L26 24 Z" fill="#B26E3F"/>
          </svg>
          <div style={{fontSize:10,letterSpacing:'.24em',textTransform:'uppercase',color:'#7A6E52',fontWeight:600}}>Karma Biriktirdin</div>
          <div style={{display:'flex',alignItems:'baseline',gap:6,marginTop:10}}>
            <div style={{fontFamily:'"Fraunces", serif',fontWeight:500,fontSize:60,lineHeight:.95,letterSpacing:'-0.03em',color:'#2B2416',fontVariantNumeric:'tabular-nums'}}>{window.IYI_V2.fmt(p.karma)}</div>
          </div>
          <div style={{marginTop:14,fontSize:13,color:'#5C5040',lineHeight:1.55,maxWidth:260}}>
            <span style={{fontFamily:'"Fraunces", serif',fontStyle:'italic',color:'#B26E3F'}}>Çok İyi Biri</span> seviyesindesin. <span style={{fontFamily:'"Fraunces", serif',fontStyle:'italic'}}>Çoook İyi Biri</span> olana <b>{window.IYI_V2.fmt(p.karmaToNext)}</b> Karma kaldı.
          </div>
          {/* Tally marks progress */}
          <div style={{marginTop:18,display:'flex',gap:3,alignItems:'flex-end'}}>
            {Array.from({length: 20}).map((_, i) => (
              <div key={i} style={{flex:1,height: i < 12 ? 18 : 8,background: i < 12 ? '#B26E3F' : '#D9CCAF',borderRadius:1}}/>
            ))}
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:8,fontSize:10,color:'#7A6E52',letterSpacing:'.08em'}}>
            <span>{p.completed} görev · {p.streak} gün</span>
            <span>58%</span>
          </div>
        </div>
      </div>

      {/* Section */}
      <div style={{padding:'16px 20px 12px'}}>
        <div style={{fontFamily:'"Fraunces", serif',fontStyle:'italic',fontSize:13,color:'#B26E3F',marginBottom:4}}>— bu hafta</div>
        <h2 style={{margin:0,fontFamily:'"Fraunces", serif',fontWeight:500,fontSize:26,letterSpacing:'-0.025em',color:'#2B2416',lineHeight:1.1}}>Sana uygun gönüllülükler</h2>
      </div>

      {/* Mission — handmade card */}
      <div style={{padding:'10px 20px',display:'flex',flexDirection:'column',gap:16}}>
        {missions.map(m => {
          const ngo = window.IYI_V2.ngos[m.ngoId];
          return (
            <div key={m.id} style={{background:'#FAF4E6',border:'1px solid #D9CCAF',borderRadius:16,overflow:'hidden'}}>
              <div style={{position:'relative',aspectRatio:'16/9',overflow:'hidden'}}>
                <img src={m.photo} alt="" style={{width:'100%',height:'100%',objectFit:'cover',filter:'sepia(.12) saturate(.95) contrast(1.02)'}}/>
                <div style={{position:'absolute',top:10,left:10,background:'#FAF4E6',padding:'5px 10px',borderRadius:999,fontSize:10,letterSpacing:'.14em',textTransform:'uppercase',fontWeight:700,color:'#2B2416',display:'flex',alignItems:'center',gap:5}}>
                  <span style={{width:5,height:5,borderRadius:'50%',background:'#7A8B5C'}}/>
                  {m.category}
                </div>
              </div>
              <div style={{padding:'16px 18px 18px'}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                  <img src={ngo.logo} alt="" style={{height:18,maxWidth:46,objectFit:'contain'}}/>
                  <span style={{fontSize:11,letterSpacing:'.04em',color:'#7A6E52',fontWeight:600}}>{ngo.name}</span>
                </div>
                <h3 style={{margin:0,fontFamily:'"Fraunces", serif',fontWeight:500,fontSize:22,letterSpacing:'-0.02em',lineHeight:1.15,color:'#2B2416'}}>{m.title}</h3>
                <p style={{margin:'8px 0 14px',fontSize:13.5,color:'#5C5040',lineHeight:1.55,fontStyle:'italic',fontFamily:'"Fraunces", serif'}}>{m.impact}</p>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:12,borderTop:'1px dashed #D9CCAF'}}>
                  <div style={{display:'flex',gap:10,fontSize:11,color:'#7A6E52'}}>
                    <span>{m.date}</span><span>·</span><span>{m.duration}</span>
                  </div>
                  <div style={{fontFamily:'"Fraunces", serif',fontSize:16,fontWeight:500,color:'#B26E3F',letterSpacing:'-0.01em',fontVariantNumeric:'tabular-nums'}}>+{m.karma}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* NGO strip */}
      <div style={{padding:'32px 20px 24px'}}>
        <div style={{fontFamily:'"Fraunces", serif',fontStyle:'italic',fontSize:13,color:'#B26E3F',marginBottom:4}}>— birlikte çalıştığımız</div>
        <h2 style={{margin:'0 0 14px',fontFamily:'"Fraunces", serif',fontWeight:500,fontSize:22,letterSpacing:'-0.02em',color:'#2B2416'}}>İyiliğin öncüleri</h2>
        <div style={{display:'flex',gap:10,overflowX:'auto',scrollbarWidth:'none'}}>
          {ngos.map(n => (
            <div key={n.short} style={{flex:'0 0 150px',background:'#FAF4E6',border:'1px solid #D9CCAF',borderRadius:12,overflow:'hidden'}}>
              <div style={{aspectRatio:'1',overflow:'hidden'}}>
                <img src={n.cover} alt="" style={{width:'100%',height:'100%',objectFit:'cover',filter:'sepia(.18) saturate(.9)'}}/>
              </div>
              <div style={{padding:'10px 12px'}}>
                <div style={{fontFamily:'"Fraunces", serif',fontSize:14,fontWeight:500,color:'#2B2416',letterSpacing:'-0.01em'}}>{n.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.DirC = DirC;
