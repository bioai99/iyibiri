/* global React */
// Direction A — "Kağıt / editorial"
// Krem kağıt zemini, serif display başlıklar, terracotta tek aksan, keskin köşeler, bol beyaz.

function DirA() {
  const p = window.IYI_V2.profile;
  const missions = window.IYI_V2.missions.slice(0, 3);
  const ngos = Object.values(window.IYI_V2.ngos).slice(0, 4);
  return (
    <div style={{
      fontFamily:'"Inter", sans-serif', background:'#F5F1EA', color:'#1A1A1A', minHeight:'100%',
      '--ink':'#1A1A1A', '--paper':'#F5F1EA', '--rule':'#1A1A1A', '--muted':'#6B6358', '--accent':'#C8553D',
    }}>
      {/* Masthead */}
      <div style={{padding:'56px 20px 0'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:10,borderBottom:'1px solid #1A1A1A'}}>
          <div style={{fontFamily:'"Fraunces", serif',fontSize:22,fontWeight:700,letterSpacing:'-0.02em'}}>İyiBiri</div>
          <div style={{fontSize:10,letterSpacing:'.2em',textTransform:'uppercase',color:'#6B6358'}}>Sayı 47 · Cumartesi</div>
        </div>
      </div>

      {/* Hero — editorial balance sheet */}
      <div style={{padding:'24px 20px 8px'}}>
        <div style={{fontSize:10,letterSpacing:'.24em',textTransform:'uppercase',color:'#6B6358',marginBottom:8}}>Hesabın · Karma</div>
        <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:4}}>
          <div style={{fontFamily:'"Fraunces", serif',fontWeight:500,fontSize:68,lineHeight:.9,letterSpacing:'-0.03em',fontVariantNumeric:'tabular-nums'}}>{window.IYI_V2.fmt(p.karma)}</div>
        </div>
        <div style={{fontSize:13,color:'#6B6358',lineHeight:1.5,maxWidth:300}}>
          <i style={{fontFamily:'"Fraunces", serif'}}>Çok İyi Biri</i> seviyesindesin. <b style={{color:'#1A1A1A'}}>{window.IYI_V2.fmt(p.karmaToNext)} Karma</b> daha — sonra <i style={{fontFamily:'"Fraunces", serif'}}>Çoook İyi Biri</i>.
        </div>
        <div style={{height:1,background:'#D8D2C5',marginTop:18,position:'relative'}}>
          <div style={{position:'absolute',left:0,top:-1,height:3,width:'58%',background:'#1A1A1A'}}/>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:8,fontSize:10,letterSpacing:'.18em',textTransform:'uppercase',color:'#6B6358'}}>
          <span>{p.completed} görev · {p.streak} gün seri</span>
          <span>58% → sonraki</span>
        </div>
      </div>

      {/* Section rule */}
      <div style={{padding:'32px 20px 10px',display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
        <div>
          <div style={{fontSize:10,letterSpacing:'.24em',textTransform:'uppercase',color:'#C8553D',marginBottom:4}}>Bu Hafta</div>
          <div style={{fontFamily:'"Fraunces", serif',fontSize:26,fontWeight:500,letterSpacing:'-0.02em',lineHeight:1}}>Senin için seçtiklerimiz.</div>
        </div>
        <div style={{fontSize:11,color:'#1A1A1A',textDecoration:'underline',textUnderlineOffset:3}}>Tümü →</div>
      </div>

      {/* Editorial mission cards — image-led, generous */}
      <div style={{padding:'14px 20px',display:'flex',flexDirection:'column',gap:28}}>
        {missions.map((m, i) => {
          const ngo = window.IYI_V2.ngos[m.ngoId];
          return (
            <article key={m.id} style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{position:'relative',aspectRatio:'4/3',overflow:'hidden',background:'#1A1A1A'}}>
                <img src={m.photo} alt="" style={{width:'100%',height:'100%',objectFit:'cover',filter:'saturate(.9) contrast(1.02)'}}/>
                <div style={{position:'absolute',top:10,left:10,display:'flex',alignItems:'center',gap:6,background:'#F5F1EA',padding:'4px 10px',fontSize:10,letterSpacing:'.16em',textTransform:'uppercase',fontWeight:700}}>
                  <span style={{width:6,height:6,borderRadius:'50%',background:'#C8553D'}}/>
                  {m.category}
                </div>
                <div style={{position:'absolute',bottom:10,right:10,background:'#1A1A1A',color:'#F5F1EA',padding:'6px 10px',fontFamily:'"Fraunces", serif',fontSize:14,fontWeight:500,fontVariantNumeric:'tabular-nums'}}>
                  +{m.karma}
                </div>
              </div>
              <div>
                <div style={{display:'flex',alignItems:'center',gap:6,fontSize:10,letterSpacing:'.14em',textTransform:'uppercase',color:'#6B6358',marginBottom:6}}>
                  <img src={ngo.logo} alt="" style={{height:14,maxWidth:40,objectFit:'contain'}}/>
                  <span style={{fontWeight:600}}>{ngo.name}</span>
                </div>
                <h3 style={{margin:0,fontFamily:'"Fraunces", serif',fontWeight:500,fontSize:24,letterSpacing:'-0.02em',lineHeight:1.1,color:'#1A1A1A'}}>
                  {m.title}
                </h3>
                <p style={{margin:'8px 0 0',fontSize:14,lineHeight:1.55,color:'#3E3A34',maxWidth:340}}>{m.impact}</p>
                <div style={{display:'flex',gap:14,marginTop:14,fontSize:11,letterSpacing:'.06em',color:'#6B6358'}}>
                  <span>{m.date}</span><span style={{color:'#D8D2C5'}}>·</span>
                  <span>{m.duration}</span><span style={{color:'#D8D2C5'}}>·</span>
                  <span>{m.location}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* NGO rail */}
      <div style={{padding:'36px 0 24px',borderTop:'1px solid #D8D2C5',marginTop:24}}>
        <div style={{padding:'20px 20px 12px',display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
          <div>
            <div style={{fontSize:10,letterSpacing:'.24em',textTransform:'uppercase',color:'#C8553D',marginBottom:4}}>Ortaklar</div>
            <div style={{fontFamily:'"Fraunces", serif',fontSize:22,fontWeight:500,letterSpacing:'-0.02em'}}>İyiliğin Öncüleri.</div>
          </div>
        </div>
        <div style={{display:'flex',gap:10,overflowX:'auto',padding:'0 20px 20px',scrollbarWidth:'none'}}>
          {ngos.map(n => (
            <div key={n.short} style={{flex:'0 0 180px',display:'flex',flexDirection:'column',gap:8}}>
              <div style={{aspectRatio:'4/5',overflow:'hidden',background:'#1A1A1A'}}>
                <img src={n.cover} alt="" style={{width:'100%',height:'100%',objectFit:'cover',filter:'grayscale(.3) contrast(1.02)'}}/>
              </div>
              <div style={{fontFamily:'"Fraunces", serif',fontSize:16,fontWeight:500,letterSpacing:'-0.01em'}}>{n.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.DirA = DirA;
