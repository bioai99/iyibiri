/* global React, HeroCard, MissionCard, RewardCard, NGOCard, SectionHeader, StatusBar, BottomNav, Header */
const { useState } = React;

// ============ SCREENS ============
function HomeScreen({ profile, onMission }) {
  const featured = window.IYI_DATA.missions.filter(m=>m.featured);
  const ngos = window.IYI_DATA.ngos;
  return (
    <>
      <div style={{padding:'12px 0 6px'}}>
        <HeroCard profile={profile}/>
      </div>
      <div style={{paddingTop:20}}>
        <SectionHeader title="Senin İçin Seçtiklerimiz" action={{label:'Tümü →'}}/>
        <div style={{display:'flex',gap:10,overflowX:'auto',padding:'0 16px 4px',scrollbarWidth:'none'}}>
          {featured.map(m=>(<MissionCard key={m.id} mission={m} compact onClick={()=>onMission(m)}/>))}
        </div>
      </div>
      <div style={{paddingTop:22}}>
        <SectionHeader title="Kuruluşlardan"/>
        <div style={{display:'flex',gap:10,overflowX:'auto',padding:'0 16px 4px',scrollbarWidth:'none'}}>
          {ngos.map(n=>(<NGOCard key={n.id} ngo={n}/>))}
        </div>
      </div>
      <div style={{paddingTop:22}}>
        <SectionHeader title="Senin İçin Ödüller" action={{label:'Tümü →'}}/>
        <div style={{padding:'0 16px',display:'flex',flexDirection:'column',gap:10}}>
          {window.IYI_DATA.rewards.slice(0,2).map(r=>(<RewardCard key={r.id} reward={r} userKarma={profile.karma} onClaim={()=>{}}/>))}
        </div>
      </div>
    </>
  );
}

function MissionsScreen({ onMission, takenIds, completedIds }) {
  const cats = ['all', ...Object.keys(window.IYI.domains)];
  const [cat, setCat] = useState('all');
  const missions = cat==='all' ? window.IYI_DATA.missions : window.IYI_DATA.missions.filter(m=>m.domain===cat);
  return (
    <>
      <Header title="Görevler"/>
      <div style={{display:'flex',gap:8,overflowX:'auto',padding:'0 16px 12px',scrollbarWidth:'none'}}>
        {cats.map(c=>{
          const on = c===cat;
          const d = c!=='all' ? window.IYI.domains[c] : null;
          return <button key={c} onClick={()=>setCat(c)} style={{flexShrink:0,all:'unset',cursor:'pointer',padding:'8px 14px',borderRadius:999,fontSize:12,fontWeight:700,background:on?(d?d.gradient:'linear-gradient(90deg,#44403C,#57534E)'):'white',color:on?'white':'#78716C',border:on?'none':'1px solid #E7E5E0'}}>{d?`${d.icon} ${d.label}`:'✦ Tümü'}</button>
        })}
      </div>
      <div style={{padding:'0 16px 16px',display:'flex',flexDirection:'column',gap:12}}>
        {missions.map(m=>(<MissionCard key={m.id} mission={m} onClick={()=>onMission(m)} taken={takenIds.has(m.id)} completed={completedIds.has(m.id)}/>))}
      </div>
    </>
  );
}

function MissionDetailScreen({ mission, onBack, onTake, taken, completed, onComplete }) {
  const ngo = window.IYI_DATA.ngos.find(n=>n.id===mission.ngoId);
  const dom = window.IYI.domains[mission.domain];
  const diff = window.IYI.difficulty[mission.difficulty];
  return (
    <>
      <div style={{height:220,background:dom.gradient,position:'relative',padding:'56px 16px 0'}}>
        <button onClick={onBack} style={{width:40,height:40,borderRadius:999,background:'rgba(255,255,255,.25)',border:'none',cursor:'pointer',color:'white',display:'flex',alignItems:'center',justifyContent:'center',transform:'rotate(180deg)'}}><IyiIcon name="chevron" size={20}/></button>
        <div style={{position:'absolute',bottom:-24,left:16,right:16,background:'white',borderRadius:20,padding:'14px 16px',boxShadow:'0 6px 28px rgba(0,0,0,.1)',display:'flex',alignItems:'center',gap:12}}>
          <img src={ngo.logo} alt="" style={{width:44,height:44,borderRadius:10,border:'1px solid #F5F5F4',padding:4,objectFit:'contain'}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:'#78716C',fontWeight:600,letterSpacing:'.05em',textTransform:'uppercase'}}>{ngo.name}</div>
            <div style={{fontSize:11,color:'#A8A29E',marginTop:2}}>{dom.icon} {dom.label}</div>
          </div>
          <div style={{background:'linear-gradient(135deg,#F4B942,#F97316)',color:'white',padding:'6px 12px',borderRadius:999,fontWeight:800,fontSize:13,fontFamily:'"Plus Jakarta Sans",sans-serif'}}>+{mission.karma}</div>
        </div>
      </div>
      <div style={{padding:'40px 16px 16px'}}>
        <h1 style={{margin:0,fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:24,color:'#1C1917',letterSpacing:'-0.015em',lineHeight:1.2}}>{mission.title}</h1>
        <div style={{display:'flex',gap:8,marginTop:10,flexWrap:'wrap'}}>
          <span style={{fontSize:11,color:'#78716C',display:'flex',alignItems:'center',gap:4,background:'#F5F5F4',padding:'5px 10px',borderRadius:999,fontWeight:600}}><IyiIcon name="clock" size={11}/>{mission.duration}</span>
          <span style={{fontSize:11,padding:'5px 10px',borderRadius:999,fontWeight:700,background:diff.bg,color:diff.fg}}>{diff.label}</span>
        </div>
        <div style={{marginTop:18,padding:'14px 16px',background:'white',border:'1px solid #F5F5F4',borderLeft:`4px solid ${diff.fg}`,borderRadius:16,boxShadow:'0 2px 12px rgba(0,0,0,.04)'}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:'.16em',textTransform:'uppercase',color:'#A8A29E',marginBottom:6}}>Etkin</div>
          <div style={{fontSize:14,color:'#44403C',lineHeight:1.55}}>{mission.impact}</div>
        </div>
        <h3 style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:15,color:'#1C1917',margin:'20px 0 8px'}}>Görev Nedir?</h3>
        <p style={{fontSize:14,color:'#57534E',lineHeight:1.55,margin:0}}>{mission.description}</p>
        <h3 style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:15,color:'#1C1917',margin:'20px 0 8px'}}>Adımlar</h3>
        <ol style={{margin:0,paddingLeft:18,fontSize:13,color:'#57534E',lineHeight:1.8}}>
          <li>Görevi kabul et</li><li>{ngo.short} koordinatörüyle buluş</li><li>Görev fotoğrafını yükle</li><li>Karma'n hesaba düşsün 🎉</li>
        </ol>
      </div>
      <div style={{position:'sticky',bottom:72,padding:'12px 16px',background:'linear-gradient(to top,#FAFAF5 60%,transparent)'}}>
        {completed ? (
          <button disabled style={{width:'100%',padding:'16px',border:'none',borderRadius:16,background:'#D1FAE5',color:'#065F46',fontSize:15,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}><IyiIcon name="check" size={18}/> Tamamlandı · +{mission.karma} Karma</button>
        ) : taken ? (
          <button onClick={()=>onComplete(mission)} style={{width:'100%',padding:'16px',border:'none',borderRadius:16,background:'#2D9E5A',color:'white',fontSize:15,fontWeight:800,cursor:'pointer',boxShadow:'0 4px 20px rgba(45,158,90,.35)'}}>✓ Tamamladım</button>
        ) : (
          <button onClick={()=>onTake(mission)} style={{width:'100%',padding:'16px',border:'none',borderRadius:16,background:'#F4B942',color:'#1C1917',fontSize:15,fontWeight:800,cursor:'pointer',boxShadow:'0 8px 24px rgba(244,185,66,.45)'}}>Göreve Başla →</button>
        )}
      </div>
    </>
  );
}

function NGOsScreen({ onOpen }) {
  return (
    <>
      <Header title="Kuruluşlar"/>
      <div style={{padding:'0 16px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {window.IYI_DATA.ngos.map(n=>(
          <button key={n.id} onClick={()=>onOpen && onOpen(n)} style={{all:'unset',cursor:'pointer',borderRadius:20,overflow:'hidden',background:'white',boxShadow:'0 4px 24px rgba(0,0,0,.08)',border:'1px solid #F5F5F4'}}>
            <div style={{height:72,background:n.color,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <img src={n.logo} alt={n.name} style={{maxHeight:48,maxWidth:'75%',background:'rgba(255,255,255,.94)',borderRadius:10,padding:6,objectFit:'contain'}}/>
            </div>
            <div style={{padding:'10px 12px 12px'}}>
              <div style={{fontWeight:700,fontSize:12,color:'#1C1917'}}>{n.name}</div>
              <div style={{fontSize:10,color:'#78716C',marginTop:2}}>Aktif görev: {window.IYI_DATA.missions.filter(m=>m.ngoId===n.id).length}</div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

function RewardsScreen({ profile, onClaim }) {
  return (
    <>
      <Header title="Ödüller"/>
      <div style={{margin:'0 16px 16px',padding:'14px 18px',borderRadius:20,background:'linear-gradient(135deg,#FEF3C7,#FDE68A)',display:'flex',alignItems:'center',gap:14,border:'1px solid #FDE68A'}}>
        <div style={{fontSize:30}}>🎁</div>
        <div style={{flex:1}}>
          <div style={{fontSize:12,color:'#92400E',fontWeight:600}}>Kullanabileceğin</div>
          <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:900,fontSize:22,color:'#78350F',fontVariantNumeric:'tabular-nums'}}>{window.IYI.fmt(profile.karma)} Karma</div>
        </div>
      </div>
      <div style={{padding:'0 16px',display:'flex',flexDirection:'column',gap:12}}>
        {window.IYI_DATA.rewards.map(r=>(<RewardCard key={r.id} reward={r} userKarma={profile.karma} onClaim={onClaim}/>))}
      </div>
    </>
  );
}

function ProfileScreen({ profile, completedIds }) {
  const tier = window.IYI.tierFor(profile.karma);
  const completed = window.IYI_DATA.missions.filter(m=>completedIds.has(m.id));
  return (
    <>
      <Header title="Profil"/>
      <div style={{padding:'0 16px 16px'}}>
        <div style={{background:'white',borderRadius:24,padding:'20px 18px',boxShadow:'0 4px 24px rgba(0,0,0,.06)',border:'1px solid #F5F5F4',textAlign:'center'}}>
          <div style={{width:84,height:84,borderRadius:999,background:'linear-gradient(135deg,#FEF3C7,#F4B942)',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'center',fontSize:48,boxShadow:'0 8px 24px rgba(244,185,66,.35)'}}>{profile.avatar}</div>
          <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:19,color:'#1C1917',marginTop:12}}>{profile.name}</div>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'5px 12px',marginTop:8,borderRadius:999,background:tier.bg,color:tier.fg,fontWeight:700,fontSize:12}}>
            <span>{tier.emoji}</span>{tier.name}
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginTop:12}}>
          {[
            {n:window.IYI.fmt(profile.karma),l:'Karma',c:'#F4B942'},
            {n:profile.completed,l:'Görev',c:'#2D9E5A'},
            {n:`${profile.streak} 🔥`,l:'Seri',c:'#F97316'},
          ].map((s,i)=>(
            <div key={i} style={{background:'white',borderRadius:16,padding:'12px 10px',textAlign:'center',border:'1px solid #F5F5F4',boxShadow:'0 2px 12px rgba(0,0,0,.04)'}}>
              <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:900,fontSize:18,color:s.c,fontVariantNumeric:'tabular-nums'}}>{s.n}</div>
              <div style={{fontSize:10,color:'#A8A29E',fontWeight:600,letterSpacing:'.05em',textTransform:'uppercase',marginTop:2}}>{s.l}</div>
            </div>
          ))}
        </div>
        <h3 style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:15,color:'#1C1917',margin:'18px 0 8px'}}>Tamamladığın Görevler</h3>
        {completed.length ? (
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {completed.map(m=>(<MissionCard key={m.id} mission={m} completed/>))}
          </div>
        ) : (
          <div style={{padding:'24px',textAlign:'center',color:'#A8A29E',fontSize:13,background:'white',borderRadius:16,border:'1px dashed #E7E5E0'}}>Henüz tamamlanmış görev yok. İlk göreve başlayalım mı?</div>
        )}
      </div>
    </>
  );
}

Object.assign(window, { HomeScreen, MissionsScreen, MissionDetailScreen, NGOsScreen, RewardsScreen, ProfileScreen });
