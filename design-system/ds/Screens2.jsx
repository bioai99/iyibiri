/* global React */
// İyiBiri — App Screens v2 (Part 2)
// Discover, Rewards, Profile, Onboarding, Mission flow states, Notifications, Streak, Leaderboard.

const __C = () => window.IYI.color;
const __f = () => window.IYI.font;

// ═════════════════════════════════ DISCOVER ═════════════════════════════════
function Discover() {
  const c = __C();
  const missions = window.IYI_V2.missions;
  const ngosArr = Object.values(window.IYI_V2.ngos);
  const cats = [
    { name:'Çevre',     color:'#C4CBAC', Icn: Icon.leaf },
    { name:'Eğitim',    color:'#EADDB8', Icn: Icon.book },
    { name:'Hayvanlar', color:'#E9CFC2', Icn: Icon.paw },
    { name:'Sağlık',    color:'#E8B4A8', Icn: Icon.heart },
  ];

  return (
    <div style={{background:c.ink900,color:c.cream,minHeight:'100%',paddingBottom:140}}>
      <div style={{padding:'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0'}}>
        <h1 style={{margin:0,fontFamily:__f().display,fontSize:30,fontWeight:500,letterSpacing:'-0.025em',lineHeight:1.05,color:c.cream}}>
          Bugün <span style={{fontStyle:'italic',color:c.gold}}>iyi</span> yapacağın şey?
        </h1>
      </div>

      {/* Search */}
      <div style={{padding:'20px 16px 0'}}>
        <Input theme="dark" label="NGO, kategori veya şehir" placeholder="örn. TEMA, çevre, İzmir" icon={<Icon.search size={16}/>}/>
      </div>

      {/* Map preview */}
      <div style={{padding:'16px 16px 0'}}>
        <div style={{
          position:'relative', borderRadius:16, overflow:'hidden', aspectRatio:'16/9',
          border:`1px solid ${c.ink600}`,
          background:'linear-gradient(135deg,#2E2923,#24201B)',
        }}>
          <svg viewBox="0 0 400 225" style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:.5}}>
            <defs><pattern id="gMap" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#3F3830" strokeWidth=".5"/></pattern></defs>
            <rect width="400" height="225" fill="url(#gMap)"/>
            <path d="M20 80 Q80 60 140 80 T260 90 T380 70" stroke="#E8C268" strokeWidth="1.2" fill="none" opacity=".3"/>
            <path d="M30 140 Q100 120 180 150 T320 145" stroke="#C4CBAC" strokeWidth="1" fill="none" opacity=".3"/>
          </svg>
          {[
            {x:28,y:45,k:8,on:true},
            {x:56,y:62,k:3},
            {x:72,y:38,k:12},
            {x:42,y:78,k:5},
          ].map((p,i)=>(
            <div key={i} style={{position:'absolute',left:`${p.x}%`,top:`${p.y}%`,transform:'translate(-50%,-100%)'}}>
              <div style={{
                background: p.on?c.gold:c.ink800, color:p.on?'#241E18':c.cream,
                border:`1px solid ${p.on?c.gold:c.ink600}`,
                padding:'4px 9px 4px 7px', borderRadius:999,
                fontFamily:__f().ui, fontSize:11, fontWeight:700, display:'flex',alignItems:'center',gap:4,
                boxShadow: p.on ? '0 6px 14px rgba(232,194,104,.25)' : '0 4px 10px rgba(0,0,0,.4)',
                fontVariantNumeric:'tabular-nums',
              }}>
                <svg width="10" height="10" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill={p.on?'#3E2F14':c.gold}/></svg>
                {p.k}
              </div>
              <div style={{width:2,height:6,background:p.on?c.gold:c.ink600,margin:'0 auto'}}/>
            </div>
          ))}
          <div style={{position:'absolute',bottom:12,left:12,display:'flex',alignItems:'center',gap:6,background:'rgba(26,22,18,.7)',backdropFilter:'blur(10px)',padding:'6px 10px',borderRadius:999,fontSize:11,color:c.cream,fontFamily:__f().ui,fontWeight:600}}>
            <Icon.pin size={11} color={c.gold}/> İstanbul · 47 görev
          </div>
          <button style={{position:'absolute',top:12,right:12,width:36,height:36,borderRadius:10,background:'rgba(26,22,18,.7)',backdropFilter:'blur(10px)',border:`1px solid ${c.ink600}`,color:c.cream,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
            <Icon.expand size={14}/>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div style={{padding:'24px 20px 0'}}>
        <h2 style={{margin:0,fontFamily:__f().display,fontSize:20,fontWeight:500,letterSpacing:'-0.02em',color:c.cream}}>Kategoriler</h2>
      </div>
      <div style={{padding:'14px 16px 0',display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {cats.map(cat=>(
          <button key={cat.name} style={{
            background:c.ink800, border:`1px solid ${c.ink600}`, borderRadius:14,
            padding:'16px 16px 14px', display:'flex',alignItems:'center',gap:12,textAlign:'left',cursor:'pointer',
          }}>
            <div style={{width:40,height:40,borderRadius:12,background:cat.color,display:'flex',alignItems:'center',justifyContent:'center',color:'#241E18'}}>
              <cat.Icn size={20} color="#241E18"/>
            </div>
            <div>
              <div style={{fontFamily:__f().ui,fontSize:14,fontWeight:600,color:c.cream,letterSpacing:'-0.015em'}}>{cat.name}</div>
              <div style={{fontSize:11,color:c.ink300,marginTop:2}}>{Math.floor(20+Math.random()*60)} görev</div>
            </div>
          </button>
        ))}
      </div>

      {/* Trending */}
      <div style={{padding:'32px 20px 14px',display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
        <div>
          <div style={{...window.IYI.typo('eyebrow'),color:c.gold,fontFamily:__f().ui,marginBottom:3}}>Bu hafta</div>
          <h2 style={{margin:0,fontFamily:__f().display,fontSize:22,fontWeight:500,letterSpacing:'-0.02em',color:c.cream}}>Trend olanlar</h2>
        </div>
      </div>
      <div style={{padding:'0 16px',display:'flex',flexDirection:'column',gap:14}}>
        <MissionCard mission={missions[3]} ngo={window.IYI_V2.ngos[missions[3].ngoId]}/>
      </div>

      <BottomNav active="search"/>
    </div>
  );
}

// ═════════════════════════════════ REWARDS / MARKET ═════════════════════════════════
function Rewards() {
  const c = __C();
  const p = window.IYI_V2.profile;
  const [tab, setTab] = React.useState('Hepsi');
  const tabs = ['Hepsi','Kupon','Deneyim','Bağış','Kilitli'];

  const rewards = [
    { id:1, title:'Filtre kahve — ücretsiz', partner:'Starbucks', cost:500, image:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=700&q=80', logoLetter:'S', category:'Kupon' },
    { id:2, title:'50 TL alışveriş kuponu',   partner:'Trendyol',  cost:1200, image:'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=700&q=80', logo:'assets/logos/trendyol-logo.svg', category:'Kupon' },
    { id:3, title:'Senin adına bir fidan',    partner:'TEMA',      cost:3000, image:'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=700&q=80', logo:'assets/logos/tema-logo.png', category:'Bağış', locked:true },
    { id:4, title:'Sinema bileti',            partner:'Cinemaximum', cost:1800, image:'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=700&q=80', logoLetter:'C', category:'Deneyim', locked:true },
    { id:5, title:'Kızılay\'a 100 TL bağış',  partner:'Kızılay',   cost:2000, image:'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=700&q=80', logo:'assets/logos/kizilay-logo.png', category:'Bağış', locked:true },
    { id:6, title:'Kitap — %30 indirim',      partner:'Hepsiburada', cost:800, image:'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700&q=80', logoLetter:'H', category:'Kupon' },
  ];
  const filtered = tab==='Hepsi' ? rewards : tab==='Kilitli' ? rewards.filter(r=>r.locked) : rewards.filter(r=>r.category===tab);

  return (
    <div style={{background:c.ink900,color:c.cream,minHeight:'100%',paddingBottom:140}}>
      {/* Header with balance */}
      <div style={{padding:'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div>
          <div style={{...window.IYI.typo('eyebrow'),color:c.ink300,fontFamily:__f().ui}}>KARMA MARKETİ</div>
          <h1 style={{margin:'6px 0 0',fontFamily:__f().display,fontSize:28,fontWeight:500,letterSpacing:'-0.025em',color:c.cream,lineHeight:1.05}}>
            İyilik <span style={{fontStyle:'italic',color:c.gold}}>ödüllerle</span> döner
          </h1>
        </div>
      </div>

      {/* Balance card */}
      <div style={{padding:'22px 16px 0'}}>
        <div style={{
          background:`linear-gradient(135deg, ${c.ink800}, #36302A)`,
          border:`1px solid ${c.goldLine}`,borderRadius:18,padding:'18px 22px',
          display:'flex',justifyContent:'space-between',alignItems:'center',position:'relative',overflow:'hidden',
        }}>
          <svg width="140" height="140" viewBox="0 0 140 140" style={{position:'absolute',right:-30,top:-30,opacity:.12}}>
            {[60,45,30,15].map(r=>(<circle key={r} cx="70" cy="70" r={r} stroke={c.gold} strokeWidth=".8" fill="none"/>))}
          </svg>
          <div style={{position:'relative'}}>
            <div style={{...window.IYI.typo('eyebrow'),color:c.ink300,fontFamily:__f().ui}}>Bakiyen</div>
            <div style={{display:'flex',alignItems:'baseline',gap:6,marginTop:8}}>
              <KarmaDotToken size={14}/>
              <span style={{fontFamily:__f().ui,fontSize:36,fontWeight:700,color:c.gold,letterSpacing:'-0.03em',fontVariantNumeric:'tabular-nums'}}>{window.IYI_V2.fmt(p.karma)}</span>
            </div>
          </div>
          <button style={{background:'transparent',border:`1px solid ${c.ink600}`,color:c.cream,fontFamily:__f().ui,fontSize:11,fontWeight:600,padding:'7px 12px',borderRadius:999,cursor:'pointer',letterSpacing:'.04em'}}>
            GEÇMİŞ
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{padding:'22px 0 4px',display:'flex',gap:8,overflowX:'auto',scrollbarWidth:'none',paddingLeft:20,paddingRight:20}}>
        {tabs.map(t=>(<Chip key={t} active={tab===t} onClick={()=>setTab(t)}>{t}</Chip>))}
      </div>

      {/* Featured — wide editorial tile */}
      <div style={{padding:'20px 16px 0'}}>
        <div style={{position:'relative',borderRadius:16,overflow:'hidden',aspectRatio:'16/9',border:`1px solid ${c.ink600}`}}>
          <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&q=80" alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,rgba(26,22,18,.85) 20%, rgba(26,22,18,.15))'}}/>
          <div style={{position:'absolute',inset:0,padding:'18px 20px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
            <Badge variant="gold" style={{alignSelf:'flex-start'}}>ÖZEL İŞBİRLİĞİ</Badge>
            <div>
              <div style={{fontFamily:__f().display,fontSize:22,fontWeight:500,letterSpacing:'-0.02em',color:c.cream,lineHeight:1.15,fontStyle:'italic',maxWidth:220}}>
                Senin adına bir fidan
              </div>
              <div style={{display:'flex',alignItems:'center',gap:6,marginTop:10}}>
                <KarmaDotToken size={11}/>
                <span style={{fontFamily:__f().ui,fontWeight:700,color:c.gold,fontVariantNumeric:'tabular-nums',fontSize:14}}>3.000</span>
                <span style={{color:c.ink300,fontSize:12,marginLeft:4}}>· TEMA Vakfı</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{padding:'24px 20px 8px',display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
        <h2 style={{margin:0,fontFamily:__f().display,fontSize:20,fontWeight:500,letterSpacing:'-0.02em',color:c.cream}}>Hepsi</h2>
        <span style={{fontSize:11,color:c.ink300,fontFamily:__f().ui,letterSpacing:'.04em'}}>{filtered.length} ÖDÜL</span>
      </div>
      <div style={{padding:'8px 16px 0',display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {filtered.map(r=>(
          <RewardTileLite key={r.id} r={r} userKarma={p.karma}/>
        ))}
      </div>

      <BottomNav active="rewards"/>
    </div>
  );
}

function RewardTileLite({ r, userKarma }) {
  const c = __C();
  const insufficient = r.locked || userKarma < r.cost;
  return (
    <div style={{background:c.ink800,border:`1px solid ${c.ink600}`,borderRadius:14,overflow:'hidden',opacity:insufficient?.65:1}}>
      <div style={{position:'relative',aspectRatio:'4/3',overflow:'hidden'}}>
        <img src={r.image} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(26,22,18,0) 50%,rgba(26,22,18,.8))'}}/>
        {insufficient && (
          <div style={{position:'absolute',top:8,right:8,width:26,height:26,borderRadius:'50%',background:'rgba(26,22,18,.7)',backdropFilter:'blur(10px)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F4EEDF" strokeWidth="1.8" strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
          </div>
        )}
        <div style={{position:'absolute',left:8,bottom:8,display:'flex',alignItems:'center',gap:5}}>
          <div style={{width:18,height:18,borderRadius:'50%',background:'white',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',fontFamily:__f().display,fontWeight:600,color:'#241E18',fontSize:9}}>
            {r.logo ? <img src={r.logo} style={{width:'72%',height:'72%',objectFit:'contain'}} alt=""/> : r.logoLetter}
          </div>
          <span style={{fontSize:10,fontFamily:__f().ui,fontWeight:600,color:c.cream,textShadow:'0 1px 2px rgba(0,0,0,.4)'}}>{r.partner}</span>
        </div>
      </div>
      <div style={{padding:'11px 12px 12px'}}>
        <div style={{fontFamily:__f().ui,fontSize:12,fontWeight:600,color:c.cream,letterSpacing:'-0.01em',lineHeight:1.25,minHeight:30}}>{r.title}</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:8,paddingTop:8,borderTop:`1px solid ${c.ink600}`}}>
          <div style={{display:'flex',alignItems:'center',gap:4}}>
            <KarmaDotToken size={10}/>
            <span style={{fontFamily:__f().ui,fontSize:12,fontWeight:700,color:c.gold,fontVariantNumeric:'tabular-nums'}}>{window.IYI_V2.fmt(r.cost)}</span>
          </div>
          <span style={{fontSize:9,color:insufficient?c.ink400:c.ink300,fontWeight:600,letterSpacing:'.08em'}}>
            {insufficient?'KİLİTLİ':'TAKAS →'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════ PROFILE ═════════════════════════════════
function Profile() {
  const c = __C();
  const p = window.IYI_V2.profile;
  const missions = window.IYI_V2.missions;

  const stats = [
    { l:'GÖREV', v:p.completed, s:'tamamlandı' },
    { l:'SAAT', v:38, s:'gönüllü' },
    { l:'NGO', v:4, s:'destek' },
  ];

  const achievements = [
    { icon:'i',  name:'İlk Adım',      locked:false, sub:'İlk görevin' },
    { icon:'✿',  name:'Çevre Dostu',   locked:false, sub:'3 çevre görevi' },
    { icon:'♥',  name:'Kalp Kalbe',    locked:false, sub:'5 farklı NGO' },
    { icon:'⚡', name:'Yıldırım',      locked:true,  sub:'30 gün seri' },
    { icon:'◈',  name:'Elmas',        locked:true,  sub:'10.000 Karma' },
    { icon:'♛',  name:'Liderlik',     locked:true,  sub:'Top 10' },
  ];

  return (
    <div style={{background:c.ink900,color:c.cream,minHeight:'100%',paddingBottom:140}}>
      {/* Cover + avatar */}
      <div style={{position:'relative',height:180}}>
        <img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900&q=70" alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(26,22,18,.3),rgba(26,22,18,.85))'}}/>
        <div style={{position:'absolute',top:58,left:16,right:16,display:'flex',justifyContent:'space-between'}}>
          <IconButton icon={<Icon.settings size={16}/>}/>
          <IconButton icon={<Icon.share size={16}/>}/>
        </div>
      </div>

      <div style={{padding:'0 20px',marginTop:-42,position:'relative'}}>
        <div style={{width:84,height:84,borderRadius:'50%',background:`linear-gradient(135deg, ${c.gold}, ${c.goldDim})`,border:`3px solid ${c.ink900}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:__f().display,fontSize:36,fontWeight:500,color:'#241E18',letterSpacing:'-0.03em',boxShadow:'0 8px 20px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.3)'}}>A</div>
        <div style={{marginTop:12,display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:10}}>
          <div>
            <h1 style={{margin:0,fontFamily:__f().display,fontSize:26,fontWeight:500,letterSpacing:'-0.025em',color:c.cream,lineHeight:1.1}}>
              {p.name}
            </h1>
            <div style={{display:'flex',alignItems:'center',gap:8,marginTop:6,color:c.ink300,fontSize:12,fontFamily:__f().ui}}>
              <Icon.pin size={11} color={c.ink300}/> İstanbul · 2024'ten beri
            </div>
          </div>
          <TierBadge tier={p.tierName}/>
        </div>
      </div>

      {/* Karma + tier progress */}
      <div style={{padding:'20px 16px 0'}}>
        <div style={{background:c.ink800,border:`1px solid ${c.ink600}`,borderRadius:16,padding:'18px 20px'}}>
          <div style={{display:'flex',alignItems:'baseline',gap:6}}>
            <KarmaDotToken size={14}/>
            <span style={{fontFamily:__f().ui,fontSize:32,fontWeight:700,color:c.gold,letterSpacing:'-0.025em',fontVariantNumeric:'tabular-nums'}}>{window.IYI_V2.fmt(p.karma)}</span>
            <span style={{color:c.ink300,fontSize:13,marginLeft:4}}>Karma</span>
          </div>
          <div style={{marginTop:14}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:7}}>
              <span style={{color:c.ink300,fontFamily:__f().ui}}>
                <span style={{fontFamily:__f().display,fontStyle:'italic',color:c.cream}}>{p.nextTier}</span>'ye
              </span>
              <span style={{color:c.gold,fontWeight:700,fontFamily:__f().ui,fontVariantNumeric:'tabular-nums'}}>
                {window.IYI_V2.fmt(p.karmaToNext)} kaldı
              </span>
            </div>
            <div style={{height:5,background:'rgba(255,255,255,.05)',borderRadius:999,overflow:'hidden'}}>
              <div style={{height:'100%',width:'58%',background:`linear-gradient(90deg, ${c.goldDim}, ${c.gold})`}}/>
            </div>
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div style={{padding:'14px 16px 0',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
        {stats.map(s=>(
          <div key={s.l} style={{background:c.ink800,border:`1px solid ${c.ink600}`,borderRadius:12,padding:'14px 12px 12px',textAlign:'center'}}>
            <div style={{...window.IYI.typo('eyebrow'),color:c.ink300,fontFamily:__f().ui,fontSize:9}}>{s.l}</div>
            <div style={{fontFamily:__f().ui,fontSize:20,fontWeight:700,color:c.cream,letterSpacing:'-0.02em',marginTop:4,fontVariantNumeric:'tabular-nums'}}>{s.v}</div>
            <div style={{fontSize:10,color:c.ink300,marginTop:2}}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div style={{padding:'30px 20px 12px'}}>
        <h2 style={{margin:0,fontFamily:__f().display,fontSize:20,fontWeight:500,letterSpacing:'-0.02em',color:c.cream}}>Rozetler</h2>
      </div>
      <div style={{padding:'0 16px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
        {achievements.map(a=>(
          <div key={a.name} style={{background:c.ink800,border:`1px solid ${c.ink600}`,borderRadius:14,padding:'16px 10px 12px',textAlign:'center',opacity:a.locked?.5:1}}>
            <div style={{width:48,height:48,borderRadius:'50%',margin:'0 auto 8px',background:a.locked?c.ink700:`linear-gradient(135deg, ${c.gold}, ${c.goldDim})`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:__f().display,fontSize:22,fontStyle:'italic',fontWeight:500,color:a.locked?c.ink400:'#3E2F14',boxShadow:a.locked?'none':'inset 0 1px 0 rgba(255,255,255,.25), 0 2px 6px rgba(0,0,0,.2)'}}>
              {a.icon}
            </div>
            <div style={{fontFamily:__f().ui,fontSize:12,fontWeight:600,color:c.cream,letterSpacing:'-0.01em'}}>{a.name}</div>
            <div style={{fontSize:10,color:c.ink300,marginTop:2}}>{a.sub}</div>
          </div>
        ))}
      </div>

      {/* Activity timeline */}
      <div style={{padding:'30px 20px 12px'}}>
        <h2 style={{margin:0,fontFamily:__f().display,fontSize:20,fontWeight:500,letterSpacing:'-0.02em',color:c.cream}}>Son görevlerin</h2>
      </div>
      <div style={{padding:'0 20px'}}>
        {[
          {title:missions[0].title, ngo:'TEMA Vakfı', k:150, date:'3 gün önce'},
          {title:missions[3].title, ngo:'Kızılay', k:300, date:'1 hafta önce'},
          {title:missions[1].title, ngo:'ÇYDD', k:250, date:'2 hafta önce'},
        ].map((t,i,arr)=>(
          <div key={i} style={{display:'flex',gap:14,paddingBottom:i===arr.length-1?0:16,position:'relative'}}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
              <div style={{width:10,height:10,borderRadius:'50%',background:c.gold,marginTop:5,boxShadow:'0 0 0 3px rgba(232,194,104,.15)'}}/>
              {i!==arr.length-1 && <div style={{width:1,flex:1,background:c.ink600,marginTop:3}}/>}
            </div>
            <div style={{flex:1,paddingBottom:i===arr.length-1?0:4}}>
              <div style={{fontFamily:__f().ui,fontSize:14,fontWeight:600,color:c.cream,letterSpacing:'-0.015em'}}>{t.title}</div>
              <div style={{fontSize:12,color:c.ink300,marginTop:3,display:'flex',alignItems:'center',gap:8}}>
                <span>{t.ngo}</span>
                <span style={{color:c.ink600}}>·</span>
                <span>{t.date}</span>
                <span style={{color:c.ink600}}>·</span>
                <span style={{color:c.gold,fontWeight:600,display:'inline-flex',alignItems:'center',gap:3}}><KarmaDotToken size={9}/>+{t.k}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav active="profile"/>
    </div>
  );
}

// ═════════════════════════════════ ONBOARDING ═════════════════════════════════
function Onboarding({ step=1 }) {
  const c = __C();
  if (step === 1) return <OnboardingWelcome/>;
  if (step === 2) return <OnboardingCauses/>;
  if (step === 3) return <OnboardingLocation/>;
  if (step === 4) return <OnboardingReady/>;
}

function OnboardingWelcome() {
  const c = __C();
  return (
    <div style={{background:c.ink900,minHeight:'100%',display:'flex',flexDirection:'column',height:'844px'}}>
      <div style={{flex:'1 1 auto',position:'relative',overflow:'hidden',minHeight:380}}>
        <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 30% 20%, rgba(232,194,104,.25), transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(196,203,172,.15), transparent 60%), ${c.ink900}`}}/>
        {/* Floating coin */}
        <div style={{position:'absolute',top:'30%',left:'50%',transform:'translateX(-50%)',filter:'drop-shadow(0 20px 40px rgba(232,194,104,.3))'}}>
          <KarmaToken size={140}/>
        </div>
        {/* Small decorative ones */}
        <div style={{position:'absolute',top:'18%',left:'18%',opacity:.5}}><KarmaToken size={34}/></div>
        <div style={{position:'absolute',top:'22%',right:'14%',opacity:.35}}><KarmaToken size={26}/></div>
        <div style={{position:'absolute',bottom:'22%',left:'12%',opacity:.4}}><KarmaToken size={30}/></div>
      </div>
      <div style={{padding:'40px 28px 48px'}}>
        <h1 style={{margin:0,fontFamily:__f().display,fontSize:38,fontWeight:400,letterSpacing:'-0.03em',lineHeight:1.05,color:c.cream}}>
          <span style={{fontStyle:'italic',color:c.gold}}>İyi biri</span> olmak<br/>hesap ister.
        </h1>
        <p style={{margin:'16px 0 0',fontFamily:__f().ui,fontSize:15,lineHeight:1.55,color:c.ink200,maxWidth:320}}>
          Gönüllü ol, kazandığın Karma'yı anlamlı ödüllere dönüştür. Başlamak 30 saniye.
        </p>
        <div style={{marginTop:32,display:'flex',flexDirection:'column',gap:10}}>
          <Button variant="primary" size="lg" full iconRight={<Icon.arrow size={16}/>}>Başlayalım</Button>
          <Button variant="ghost" size="md" full>Zaten üyeyim</Button>
        </div>
        <div style={{marginTop:20,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
          <div style={{width:18,height:3,borderRadius:999,background:c.gold}}/>
          <div style={{width:6,height:3,borderRadius:999,background:c.ink600}}/>
          <div style={{width:6,height:3,borderRadius:999,background:c.ink600}}/>
          <div style={{width:6,height:3,borderRadius:999,background:c.ink600}}/>
        </div>
      </div>
    </div>
  );
}

function OnboardingCauses() {
  const c = __C();
  const [picked, setPicked] = React.useState(['Çevre','Hayvanlar']);
  const causes = [
    { name:'Çevre',      sub:'Ağaç, deniz, iklim' },
    { name:'Eğitim',     sub:'Çocuk, kitap, mentör' },
    { name:'Hayvanlar',  sub:'Barınak, sokak, yaban' },
    { name:'Sağlık',     sub:'Kan bağışı, yaşlı, bakım' },
    { name:'Afet',       sub:'Deprem, yangın, yardım' },
    { name:'Topluluk',   sub:'Yerel, kültür, sanat' },
  ];
  const toggle = n => setPicked(p => p.includes(n) ? p.filter(x=>x!==n) : [...p, n]);

  return (
    <div style={{background:c.ink900,color:c.cream,minHeight:'100%',display:'flex',flexDirection:'column',paddingBottom:24,height:'844px'}}>
      <div style={{padding:'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',display:'flex',alignItems:'center',gap:12}}>
        <IconButton icon={<Icon.chevron size={16} style={{transform:'rotate(180deg)'}}/>}/>
        <div style={{flex:1,display:'flex',gap:4}}>
          <div style={{flex:1,height:3,borderRadius:999,background:c.gold}}/>
          <div style={{flex:1,height:3,borderRadius:999,background:c.gold}}/>
          <div style={{flex:1,height:3,borderRadius:999,background:c.ink600}}/>
          <div style={{flex:1,height:3,borderRadius:999,background:c.ink600}}/>
        </div>
      </div>
      <div style={{padding:'32px 24px 0'}}>
        <div style={{...window.IYI.typo('eyebrow'),color:c.gold,fontFamily:__f().ui,marginBottom:6}}>ADIM 2 / 4</div>
        <h1 style={{margin:0,fontFamily:__f().display,fontSize:30,fontWeight:500,letterSpacing:'-0.025em',lineHeight:1.1,color:c.cream}}>
          Hangi konular <span style={{fontStyle:'italic'}}>seni çekiyor?</span>
        </h1>
        <p style={{margin:'10px 0 0',fontFamily:__f().ui,fontSize:14,color:c.ink300,lineHeight:1.55}}>Senin için görev önerelim. İstediğin kadar seç.</p>
      </div>

      <div style={{flex:'1 1 auto',padding:'24px 16px 16px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,alignContent:'start',minHeight:0,overflowY:'auto'}}>
        {causes.map(ca=>{
          const on = picked.includes(ca.name);
          return (
            <button key={ca.name} onClick={()=>toggle(ca.name)} style={{
              background: on ? 'rgba(232,194,104,.08)' : c.ink800,
              border:`1px solid ${on?c.gold:c.ink600}`, borderRadius:16,
              padding:'18px 16px 16px', textAlign:'left', cursor:'pointer',
              position:'relative', transition:`all ${window.IYI.motion.base}`,
            }}>
              {on && (
                <div style={{position:'absolute',top:10,right:10,width:22,height:22,borderRadius:'50%',background:c.gold,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#241E18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
              <div style={{fontFamily:__f().display,fontSize:18,fontWeight:500,fontStyle:'italic',color: on?c.gold:c.cream,letterSpacing:'-0.015em'}}>{ca.name}</div>
              <div style={{fontSize:11,color:c.ink300,marginTop:4,fontFamily:__f().ui}}>{ca.sub}</div>
            </button>
          );
        })}
      </div>

      <div style={{padding:'0 16px'}}>
        <Button variant="primary" size="lg" full iconRight={<Icon.arrow size={16}/>}>
          {picked.length>0 ? `${picked.length} alan seçildi — Devam` : 'Devam'}
        </Button>
      </div>
    </div>
  );
}

function OnboardingLocation() {
  const c = __C();
  const [city, setCity] = React.useState('İstanbul');
  const [radius, setRadius] = React.useState(15);
  return (
    <div style={{background:c.ink900,color:c.cream,minHeight:'100%',display:'flex',flexDirection:'column',paddingBottom:24,height:'844px'}}>
      <div style={{padding:'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',display:'flex',alignItems:'center',gap:12}}>
        <IconButton icon={<Icon.chevron size={16} style={{transform:'rotate(180deg)'}}/>}/>
        <div style={{flex:1,display:'flex',gap:4}}>
          {[1,1,1,0].map((x,i)=>(<div key={i} style={{flex:1,height:3,borderRadius:999,background:x?c.gold:c.ink600}}/>))}
        </div>
      </div>
      <div style={{padding:'32px 24px 0'}}>
        <div style={{...window.IYI.typo('eyebrow'),color:c.gold,fontFamily:__f().ui,marginBottom:6}}>ADIM 3 / 4</div>
        <h1 style={{margin:0,fontFamily:__f().display,fontSize:30,fontWeight:500,letterSpacing:'-0.025em',lineHeight:1.1,color:c.cream}}>
          Nerede <span style={{fontStyle:'italic'}}>iyi olmak</span> istersin?
        </h1>
      </div>

      <div style={{padding:'28px 20px 0',flex:'1 1 auto',minHeight:0}}>
        <div style={{marginBottom:20}}>
          <Input theme="dark" label="Şehir" value={city} icon={<Icon.pin size={16}/>} onChange={setCity}/>
        </div>

        <div style={{background:c.ink800,border:`1px solid ${c.ink600}`,borderRadius:16,padding:'22px 22px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
            <div style={{...window.IYI.typo('eyebrow'),color:c.ink300,fontFamily:__f().ui}}>Yarıçap</div>
            <div style={{fontFamily:__f().ui,fontWeight:700,color:c.gold,fontSize:18,fontVariantNumeric:'tabular-nums'}}>{radius} km</div>
          </div>
          <div style={{marginTop:18,position:'relative',height:6}}>
            <div style={{position:'absolute',inset:0,borderRadius:999,background:'rgba(255,255,255,.05)'}}/>
            <div style={{position:'absolute',left:0,top:0,bottom:0,width:`${(radius/50)*100}%`,borderRadius:999,background:`linear-gradient(90deg, ${c.goldDim}, ${c.gold})`}}/>
            <div style={{position:'absolute',left:`${(radius/50)*100}%`,top:'50%',transform:'translate(-50%,-50%)',width:20,height:20,borderRadius:'50%',background:c.gold,border:'3px solid #241E18',boxShadow:'0 2px 8px rgba(0,0,0,.4)'}}/>
          </div>
          <input type="range" min="1" max="50" value={radius} onChange={e=>setRadius(+e.target.value)} style={{position:'relative',width:'100%',opacity:0,marginTop:-14,height:20,cursor:'pointer'}}/>
          <div style={{marginTop:4,display:'flex',justifyContent:'space-between',fontSize:11,color:c.ink400,fontFamily:__f().ui}}>
            <span>1 km</span><span>50 km</span>
          </div>
        </div>

        <div style={{marginTop:14,display:'flex',gap:8,alignItems:'flex-start',padding:'12px 14px',borderRadius:12,background:'rgba(196,203,172,.06)',border:`1px solid ${c.ink600}`}}>
          <Icon.info size={14} color={c.ink200} style={{marginTop:2}}/>
          <span style={{fontFamily:__f().ui,fontSize:12,color:c.ink200,lineHeight:1.5}}>
            Online görevler her yerden erişilebilir. Konumunu sadece yakın görevleri bulmak için kullanırız.
          </span>
        </div>
      </div>

      <div style={{padding:'0 16px'}}>
        <Button variant="primary" size="lg" full iconRight={<Icon.arrow size={16}/>}>
          {radius} km içinde ara
        </Button>
      </div>
    </div>
  );
}

function OnboardingReady() {
  const c = __C();
  return (
    <div style={{background:c.ink900,color:c.cream,minHeight:'100%',display:'flex',flexDirection:'column',height:'844px'}}>
      <div style={{padding:'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',display:'flex',gap:4}}>
        {[1,1,1,1].map((_,i)=>(<div key={i} style={{flex:1,height:3,borderRadius:999,background:c.gold}}/>))}
      </div>

      <div style={{flex:'1 1 auto',padding:'48px 28px 0',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'flex-start',minHeight:0}}>
        <div style={{marginBottom:28,position:'relative'}}>
          <div style={{position:'absolute',inset:-24,background:'radial-gradient(circle, rgba(232,194,104,.2), transparent 70%)',filter:'blur(20px)'}}/>
          <div style={{position:'relative'}}><KarmaToken size={80}/></div>
        </div>
        <div style={{...window.IYI.typo('eyebrow'),color:c.gold,fontFamily:__f().ui,marginBottom:12}}>HOŞ GELDİN HEDİYESİ</div>
        <h1 style={{margin:0,fontFamily:__f().display,fontSize:44,fontWeight:400,letterSpacing:'-0.032em',lineHeight:1,color:c.cream}}>
          İlk <span style={{color:c.gold,fontStyle:'italic'}}>100 Karma</span> senden.
        </h1>
        <p style={{margin:'22px 0 0',fontFamily:__f().ui,fontSize:15,lineHeight:1.55,color:c.ink200,maxWidth:320}}>
          Hesabını açtığın için teşekkürler, Ayşe. İlk görevini tamamladığında 250 daha gelecek — ve "İyi Biri" seviyesine iki adım kaldı.
        </p>
      </div>

      <div style={{padding:'0 16px 32px'}}>
        <Button variant="primary" size="lg" full iconRight={<Icon.arrow size={16}/>}>İlk görevimi bul</Button>
      </div>
    </div>
  );
}

// ═════════════════════════════════ MISSION FLOW STATES ═════════════════════════════════
// 4 states of the same mission — overlays/changes on Mission Detail.

function MissionApplied() {
  return <MissionDetailWithState state="applied"/>;
}
function MissionCheckIn() {
  return <MissionDetailWithState state="checkin"/>;
}
function MissionCompleted() {
  return <MissionDetailWithState state="completed"/>;
}

function MissionDetailWithState({ state }) {
  const c = __C();
  const m = window.IYI_V2.missions[0];
  const ngo = window.IYI_V2.ngos[m.ngoId];

  const statusBar = {
    applied:   { tone:'sage',  title:'Başvurun alındı',      sub:'NGO 24 saat içinde yanıtlayacak.', icon:'hourglass' },
    checkin:   { tone:'gold',  title:'Görev günü — Check-in', sub:'Konuma vardığında kod ile katıl.', icon:'qr' },
    completed: { tone:'cream', title:'Tamamlandı',            sub:'Bu görevden +150 Karma kazandın.', icon:'check' },
  }[state];

  return (
    <div style={{background:c.ink900,color:c.cream,minHeight:'100%',paddingBottom:120}}>
      {/* Hero photo */}
      <div style={{position:'relative',aspectRatio:'4/3',overflow:'hidden'}}>
        <img src={m.photo} alt="" style={{width:'100%',height:'100%',objectFit:'cover',filter: state==='completed' ? 'saturate(.7) brightness(.7)' : 'none'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(26,22,18,.4) 0%,rgba(26,22,18,0) 30%,rgba(26,22,18,0) 70%,rgba(36,32,27,1) 100%)'}}/>
        <div style={{position:'absolute',top:58,left:16,right:16,display:'flex',justifyContent:'space-between'}}>
          <IconButton icon={<Icon.chevron size={18} style={{transform:'rotate(180deg)'}}/>}/>
          {state==='completed' && <IconButton icon={<Icon.share size={16}/>}/>}
        </div>
        <div style={{position:'absolute',bottom:24,left:20,right:20}}>
          <Badge variant="onImage" style={{marginBottom:10}}>{m.category}</Badge>
          <h1 style={{margin:0,fontFamily:__f().display,fontSize:30,fontWeight:500,letterSpacing:'-0.028em',lineHeight:1.05,color:c.cream}}>{m.title}</h1>
        </div>
      </div>

      {/* STATUS STRIP — dominant for each state */}
      <div style={{padding:'18px 16px 0'}}>
        <div style={{
          background: state==='completed' ? `linear-gradient(135deg, rgba(232,194,104,.15), rgba(232,194,104,.02))` : c.ink800,
          border:`1px solid ${state==='checkin'?c.gold:state==='completed'?c.goldLine:c.ink600}`,borderRadius:16,padding:'20px',
          display:'flex',gap:16,alignItems:'center',
        }}>
          <StatusIcon kind={statusBar.icon} color={statusBar.tone==='gold'?c.gold:statusBar.tone==='sage'?'#C4CBAC':c.cream}/>
          <div style={{flex:1}}>
            <div style={{fontFamily:__f().ui,fontSize:14,fontWeight:700,color:c.cream,letterSpacing:'-0.015em'}}>{statusBar.title}</div>
            <div style={{fontSize:12,color:c.ink300,marginTop:3,fontFamily:__f().ui,lineHeight:1.4}}>{statusBar.sub}</div>
          </div>
        </div>
      </div>

      {/* State-specific body */}
      {state==='applied' && <AppliedBody m={m} ngo={ngo}/>}
      {state==='checkin' && <CheckInBody m={m}/>}
      {state==='completed' && <CompletedBody m={m} ngo={ngo}/>}
    </div>
  );
}

function StatusIcon({ kind, color }) {
  if (kind==='hourglass') return (
    <div style={{width:44,height:44,borderRadius:12,background:'rgba(196,203,172,.15)',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h12M6 22h12M7 2v4a5 5 0 0 0 5 5 5 5 0 0 1 5 5v4"/><path d="M17 2v4a5 5 0 0 1-5 5 5 5 0 0 0-5 5v4"/></svg>
    </div>
  );
  if (kind==='qr') return (
    <div style={{width:44,height:44,borderRadius:12,background:'rgba(232,194,104,.15)',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v3M14 20h3M17 20h4"/></svg>
    </div>
  );
  return (
    <div style={{width:44,height:44,borderRadius:12,background:'rgba(232,194,104,.2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8C268" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
  );
}

function AppliedBody({ m, ngo }) {
  const c = __C();
  return (
    <>
      <div style={{padding:'24px 20px 0'}}>
        <div style={{...window.IYI.typo('eyebrow'),color:c.gold,fontFamily:__f().ui,marginBottom:8}}>Sırada ne var</div>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <Step n="1" title="NGO onayı" sub="TEMA 24 saat içinde katılımını onaylar" active/>
          <Step n="2" title="Hazırlık SMS'i" sub="Görev öncesi buluşma detayı SMS ile gelir"/>
          <Step n="3" title="Görev günü check-in" sub="Konuma vardığında QR ile giriş yap"/>
        </div>
      </div>
      <div style={{padding:'28px 16px 0'}}>
        <Button variant="ghost" size="lg" full>Katılımı iptal et</Button>
      </div>
    </>
  );
}

function CheckInBody({ m }) {
  const c = __C();
  return (
    <>
      <div style={{padding:'24px 16px 0'}}>
        <div style={{background:c.ink800,border:`1px dashed ${c.goldLine}`,borderRadius:16,padding:'28px 20px',textAlign:'center'}}>
          <div style={{...window.IYI.typo('eyebrow'),color:c.ink300,fontFamily:__f().ui,marginBottom:16}}>KATILIM KODU</div>
          <div style={{fontFamily:'"IBM Plex Mono",monospace',fontSize:44,fontWeight:700,color:c.gold,letterSpacing:'.08em',fontVariantNumeric:'tabular-nums'}}>
            K7-3921
          </div>
          <div style={{marginTop:12,fontFamily:__f().ui,fontSize:12,color:c.ink300}}>NGO sorumlusu bu kodu kontrol edecek.</div>
        </div>
      </div>
      <div style={{padding:'16px 16px 0'}}>
        <div style={{background:c.ink800,border:`1px solid ${c.ink600}`,borderRadius:14,padding:'14px 18px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{...window.IYI.typo('eyebrow'),color:c.ink300,fontFamily:__f().ui,fontSize:9}}>BULUŞMA</div>
            <div style={{fontFamily:__f().ui,fontSize:14,fontWeight:600,color:c.cream,marginTop:4,letterSpacing:'-0.015em'}}>Kilyos Sahili · 09:30</div>
          </div>
          <Button variant="secondary" size="sm" icon={<Icon.pin size={13}/>}>Harita</Button>
        </div>
      </div>
      <div style={{padding:'24px 16px 0'}}>
        <Button variant="primary" size="lg" full iconRight={<Icon.arrow size={16}/>}>QR ile check-in yap</Button>
      </div>
    </>
  );
}

function CompletedBody({ m, ngo }) {
  const c = __C();
  return (
    <>
      {/* Karma earned banner */}
      <div style={{padding:'20px 16px 0'}}>
        <div style={{background:c.ink800,border:`1px solid ${c.goldLine}`,borderRadius:18,padding:'22px 22px',position:'relative',overflow:'hidden'}}>
          <svg width="180" height="180" viewBox="0 0 180 180" style={{position:'absolute',right:-40,top:-40,opacity:.12}}>
            {[80,60,40,20].map(r=>(<circle key={r} cx="90" cy="90" r={r} stroke={c.gold} strokeWidth=".8" fill="none"/>))}
          </svg>
          <div style={{position:'relative'}}>
            <div style={{...window.IYI.typo('eyebrow'),color:c.ink300,fontFamily:__f().ui}}>KAZANDIN</div>
            <div style={{display:'flex',alignItems:'baseline',gap:8,marginTop:8}}>
              <KarmaDotToken size={18}/>
              <span style={{fontFamily:__f().ui,fontSize:48,fontWeight:700,color:c.gold,letterSpacing:'-0.035em',fontVariantNumeric:'tabular-nums'}}>+{m.karma}</span>
            </div>
            <div style={{fontSize:13,color:c.ink200,marginTop:6}}>Bakiye: <b style={{color:c.cream}}>2.490 Karma</b></div>
          </div>
        </div>
      </div>

      {/* Impact quote */}
      <div style={{padding:'22px 20px 0'}}>
        <div style={{...window.IYI.typo('eyebrow'),color:c.gold,fontFamily:__f().ui,marginBottom:10}}>BERABER NE YAPTIK</div>
        <p style={{margin:0,fontFamily:__f().display,fontSize:22,fontWeight:400,lineHeight:1.35,letterSpacing:'-0.015em',color:c.cream,fontStyle:'italic'}}>
          "2 saatte 17 gönüllü birlikte 42 kg atık topladık. Bu; yaklaşık 8 mavi balinanın günlük nefes suyunu temizledi."
        </p>
      </div>

      {/* Photos + rate NGO */}
      <div style={{padding:'26px 16px 0'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,borderRadius:14,overflow:'hidden'}}>
          {[m.photo, 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&q=70', 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=400&q=70'].map((src,i)=>(
            <div key={i} style={{aspectRatio:'1',overflow:'hidden'}}>
              <img src={src} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:'24px 16px 0'}}>
        <div style={{background:c.ink800,border:`1px solid ${c.ink600}`,borderRadius:14,padding:'16px 18px'}}>
          <div style={{fontFamily:__f().ui,fontSize:14,fontWeight:600,color:c.cream,letterSpacing:'-0.015em'}}>TEMA Vakfı'nı nasıl buldun?</div>
          <div style={{marginTop:12,display:'flex',gap:6}}>
            {[1,2,3,4,5].map(n=>(
              <svg key={n} width="28" height="28" viewBox="0 0 24 24" fill={n<=4?c.gold:'none'} stroke={c.gold} strokeWidth="1.3" style={{cursor:'pointer'}}><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/></svg>
            ))}
          </div>
        </div>
      </div>

      <div style={{padding:'24px 16px 0',display:'flex',gap:10}}>
        <Button variant="secondary" size="lg" full icon={<Icon.share size={14}/>}>Paylaş</Button>
        <Button variant="primary" size="lg" full iconRight={<Icon.arrow size={16}/>}>Yeni görev</Button>
      </div>
    </>
  );
}

function Step({ n, title, sub, active }) {
  const c = __C();
  return (
    <div style={{display:'flex',gap:14}}>
      <div style={{width:30,height:30,borderRadius:'50%',flexShrink:0,background: active ? c.gold : 'transparent',border:`1px solid ${active?c.gold:c.ink600}`,color:active?'#241E18':c.ink300,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:__f().ui,fontSize:13,fontWeight:700}}>
        {n}
      </div>
      <div style={{flex:1,paddingTop:3}}>
        <div style={{fontFamily:__f().ui,fontSize:14,fontWeight:600,color:c.cream,letterSpacing:'-0.015em'}}>{title}</div>
        <div style={{fontSize:12,color:c.ink300,marginTop:3,lineHeight:1.45}}>{sub}</div>
      </div>
    </div>
  );
}

// ═════════════════════════════════ NOTIFICATIONS ═════════════════════════════════
function Notifications() {
  const c = __C();
  const today = [
    { kind:'karma',  title:'+300 Karma kazandın', sub:'Kan Bağışı Kampanyası · Kızılay', time:'2 dk', fresh:true },
    { kind:'match',  title:'Sana uygun yeni görev', sub:'Kodluyoruz · Kodlama Mentorluğu', time:'3 saat', fresh:true },
  ];
  const earlier = [
    { kind:'tier',   title:'<i>Çok İyi Biri</i> oldun', sub:'Yeni tier açıldı — ödüller güncellendi', time:'Dün' },
    { kind:'streak', title:'7 günlük serin sürüyor',   sub:'Yarın da bir görev tamamla, kaybetme',  time:'Dün' },
    { kind:'reminder', title:'Sahil Temizliği yarın', sub:'Kilyos · 09:30 · 1 gün kaldı',            time:'2 gün' },
    { kind:'social', title:'Zeynep ekibine katıldı',   sub:'Barınakta Gönüllü Günü · Haytap',       time:'3 gün' },
  ];

  return (
    <div style={{background:c.ink900,color:c.cream,minHeight:'100%',paddingBottom:40}}>
      <div style={{padding:'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
        <div>
          <div style={{...window.IYI.typo('eyebrow'),color:c.ink300,fontFamily:__f().ui}}>BİLDİRİMLER</div>
          <h1 style={{margin:'4px 0 0',fontFamily:__f().display,fontSize:28,fontWeight:500,letterSpacing:'-0.025em',color:c.cream,lineHeight:1.05}}>
            Yeni <span style={{fontStyle:'italic',color:c.gold}}>iyilikler</span>
          </h1>
        </div>
        <button style={{background:'transparent',border:'none',color:c.gold,fontSize:11,fontFamily:__f().ui,fontWeight:700,letterSpacing:'.04em',cursor:'pointer'}}>
          TÜMÜNÜ OKU
        </button>
      </div>

      <div style={{padding:'24px 20px 8px'}}>
        <div style={{...window.IYI.typo('eyebrow'),color:c.gold,fontFamily:__f().ui,marginBottom:10}}>BUGÜN</div>
      </div>
      <div style={{padding:'0 16px',display:'flex',flexDirection:'column',gap:8}}>
        {today.map((n,i)=><NotifRow key={i} n={n}/>)}
      </div>

      <div style={{padding:'24px 20px 8px'}}>
        <div style={{...window.IYI.typo('eyebrow'),color:c.ink300,fontFamily:__f().ui,marginBottom:10}}>DAHA ÖNCE</div>
      </div>
      <div style={{padding:'0 16px',display:'flex',flexDirection:'column',gap:8}}>
        {earlier.map((n,i)=><NotifRow key={i} n={n}/>)}
      </div>
    </div>
  );
}

function NotifRow({ n }) {
  const c = __C();
  const iconDef = {
    karma:   { bg:'rgba(232,194,104,.15)',  fg:c.gold,        Icn: () => <KarmaDotToken size={18}/> },
    match:   { bg:'rgba(196,203,172,.15)',  fg:'#C4CBAC',     Icn: () => <Icon.spark size={18} color="#C4CBAC"/> },
    tier:    { bg:'rgba(232,194,104,.15)',  fg:c.gold,        Icn: () => <Icon.star size={18} color={c.gold}/> },
    streak:  { bg:'rgba(232,194,104,.15)',  fg:c.gold,        Icn: () => <Icon.flame size={18} color={c.gold}/> },
    reminder:{ bg:'rgba(233,207,194,.15)',  fg:'#E9CFC2',     Icn: () => <Icon.clock size={18} color="#E9CFC2"/> },
    social:  { bg:'rgba(244,238,223,.06)',  fg:c.cream,       Icn: () => <Icon.users size={18} color={c.cream}/> },
  }[n.kind];
  return (
    <div style={{background:n.fresh?'rgba(232,194,104,.04)':c.ink800,border:`1px solid ${n.fresh?c.goldLine:c.ink600}`,borderRadius:14,padding:'14px 16px',display:'flex',gap:12,alignItems:'flex-start',position:'relative'}}>
      <div style={{width:40,height:40,borderRadius:11,flexShrink:0,background:iconDef.bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <iconDef.Icn/>
      </div>
      <div style={{flex:1,paddingTop:2}}>
        <div style={{fontFamily:__f().ui,fontSize:14,fontWeight:600,color:c.cream,letterSpacing:'-0.01em'}} dangerouslySetInnerHTML={{__html:n.title}}/>
        <div style={{fontSize:12,color:c.ink300,marginTop:3,fontFamily:__f().ui}}>{n.sub}</div>
      </div>
      <div style={{fontSize:11,color:c.ink400,fontFamily:__f().ui,whiteSpace:'nowrap',paddingTop:3}}>{n.time}</div>
      {n.fresh && <div style={{position:'absolute',top:10,right:10,width:7,height:7,borderRadius:'50%',background:c.gold,boxShadow:'0 0 0 3px rgba(232,194,104,.2)'}}/>}
    </div>
  );
}

// ═════════════════════════════════ STREAK ═════════════════════════════════
function Streak() {
  const c = __C();
  const days = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
  // 7 filled, today is Cmt
  const filled = [1,1,1,1,1,1,1];

  return (
    <div style={{background:c.ink900,color:c.cream,minHeight:'100%',paddingBottom:40}}>
      <div style={{padding:'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <IconButton icon={<Icon.chevron size={18} style={{transform:'rotate(180deg)'}}/>}/>
        <div style={{...window.IYI.typo('eyebrow'),color:c.ink300,fontFamily:__f().ui}}>SERİ</div>
        <IconButton icon={<Icon.share size={14}/>}/>
      </div>

      <div style={{padding:'28px 28px 0',textAlign:'center'}}>
        <div style={{position:'relative',width:200,height:200,margin:'0 auto'}}>
          <div style={{position:'absolute',inset:-10,background:'radial-gradient(circle, rgba(232,194,104,.2),transparent 60%)',filter:'blur(16px)'}}/>
          <div style={{position:'relative',width:'100%',height:'100%',borderRadius:'50%',background:`linear-gradient(145deg, ${c.gold}, ${c.goldDim})`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 10px 30px rgba(26,22,18,.4), inset 0 2px 0 rgba(255,255,255,.3), inset 0 -2px 0 rgba(62,47,20,.3)'}}>
            <Icon.flame size={28} color="#3E2F14"/>
            <div style={{fontFamily:__f().ui,fontSize:72,fontWeight:700,color:'#3E2F14',letterSpacing:'-0.05em',lineHeight:1,marginTop:4,fontVariantNumeric:'tabular-nums'}}>7</div>
            <div style={{fontFamily:__f().ui,fontSize:12,fontWeight:700,color:'#3E2F14',letterSpacing:'.14em',marginTop:2}}>GÜN</div>
          </div>
        </div>

        <h1 style={{margin:'32px 0 0',fontFamily:__f().display,fontSize:28,fontWeight:500,letterSpacing:'-0.025em',lineHeight:1.1,color:c.cream}}>
          <span style={{fontStyle:'italic'}}>Yedi günlük</span> iyi hal.
        </h1>
        <p style={{margin:'12px 0 0',fontFamily:__f().ui,fontSize:14,color:c.ink200,lineHeight:1.55,maxWidth:300,marginLeft:'auto',marginRight:'auto'}}>
          Bir hafta her gün en az bir iyilik yaptın. Yarın da yap, serini koru.
        </p>
      </div>

      {/* Days row */}
      <div style={{padding:'36px 16px 0'}}>
        <div style={{background:c.ink800,border:`1px solid ${c.ink600}`,borderRadius:16,padding:'18px 14px',display:'flex',justifyContent:'space-between'}}>
          {days.map((d,i)=>(
            <div key={d} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
              <div style={{width:36,height:36,borderRadius:'50%',background:filled[i]?c.gold:c.ink700,border:filled[i]?`1px solid ${c.goldDim}`:`1px solid ${c.ink600}`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:filled[i]?'inset 0 1px 0 rgba(255,255,255,.25)':'none'}}>
                {filled[i] && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3E2F14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <div style={{fontFamily:__f().ui,fontSize:11,fontWeight:600,color: i===6?c.gold:c.ink300,letterSpacing:'.04em'}}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div style={{padding:'28px 20px 0'}}>
        <div style={{...window.IYI.typo('eyebrow'),color:c.ink300,fontFamily:__f().ui,marginBottom:14}}>SIRAKAKİ KİLOMETRE TAŞLARI</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {[
            { at:14, name:'İki hafta',  bonus:'+100 Karma',    reached:false, near:true },
            { at:30, name:'Bir ay',     bonus:'Yıldırım rozeti',reached:false },
            { at:100,name:'Yüz gün',    bonus:'+1.000 Karma',  reached:false },
          ].map(ms=>(
            <div key={ms.at} style={{background:c.ink800,border:`1px solid ${ms.near?c.goldLine:c.ink600}`,borderRadius:14,padding:'14px 18px',display:'flex',alignItems:'center',gap:14}}>
              <div style={{width:44,height:44,borderRadius:12,background:ms.near?'rgba(232,194,104,.12)':c.ink700,border:`1px solid ${ms.near?c.goldLine:c.ink600}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:__f().ui,fontSize:16,fontWeight:700,color:ms.near?c.gold:c.ink300,fontVariantNumeric:'tabular-nums',letterSpacing:'-0.02em'}}>{ms.at}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:__f().ui,fontSize:14,fontWeight:600,color:c.cream,letterSpacing:'-0.015em'}}>{ms.name}</div>
                <div style={{fontSize:11,color:c.ink300,marginTop:2}}>{ms.bonus}</div>
              </div>
              <div style={{fontFamily:__f().ui,fontSize:11,fontWeight:700,color:ms.near?c.gold:c.ink300,letterSpacing:'.04em'}}>
                {ms.at - 7} GÜN
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════ LEADERBOARD ═════════════════════════════════
function Leaderboard() {
  const c = __C();
  const [scope, setScope] = React.useState('İstanbul');
  const [period, setPeriod] = React.useState('Bu ay');
  const top = [
    { r:1, name:'Mert Aktaş',   k:12420, t:'Çoook İyi Biri', c:'#C4CBAC' },
    { r:2, name:'Ece Demir',    k:11100, t:'Çoook İyi Biri', c:'#E9CFC2' },
    { r:3, name:'Can Özkan',    k:9850,  t:'Çok İyi Biri',  c:'#EADDB8' },
  ];
  const rest = [
    { r:4, name:'Dilara Ş.',    k:8200,  c:'#B58F3D' },
    { r:5, name:'Berk Kaya',    k:7630,  c:'#574E42' },
    { r:6, name:'Selin Ç.',     k:6910,  c:'#C4CBAC' },
    { r:7, name:'Ömer Yıldız',  k:6480,  c:'#E9CFC2' },
    { r:142, name:'Ayşe Y. (sen)', k:2340, me:true, c:'#E8C268' },
  ];

  return (
    <div style={{background:c.ink900,color:c.cream,minHeight:'100%',paddingBottom:140}}>
      <div style={{padding:'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0'}}>
        <div style={{...window.IYI.typo('eyebrow'),color:c.gold,fontFamily:__f().ui,marginBottom:4}}>SIRALAMA</div>
        <h1 style={{margin:'4px 0 0',fontFamily:__f().display,fontSize:28,fontWeight:500,letterSpacing:'-0.025em',color:c.cream,lineHeight:1.1}}>
          Şehrin en <span style={{fontStyle:'italic',color:c.gold}}>iyileri</span>
        </h1>
      </div>

      {/* Scope chips */}
      <div style={{padding:'18px 20px 0',display:'flex',gap:8,flexWrap:'wrap'}}>
        {['Arkadaşlar','İstanbul','Türkiye'].map(s=>(
          <Chip key={s} active={scope===s} onClick={()=>setScope(s)}>{s}</Chip>
        ))}
      </div>
      {/* Period segmented control */}
      <div style={{padding:'12px 20px 0'}}>
        <div style={{display:'inline-flex',background:c.ink800,border:`1px solid ${c.ink600}`,borderRadius:10,padding:3}}>
          {['Bu hafta','Bu ay','Tüm zamanlar'].map(p=>{
            const on = period===p;
            return (
              <button key={p} onClick={()=>setPeriod(p)} style={{
                padding:'7px 12px',border:'none',borderRadius:8,
                background:on?c.gold:'transparent',
                color:on?'#241E18':c.ink300,
                fontFamily:__f().ui,fontSize:11,fontWeight:on?700:500,letterSpacing:'-0.005em',
                cursor:'pointer',whiteSpace:'nowrap',transition:'all .15s',
              }}>{p}</button>
            );
          })}
        </div>
      </div>

      {/* Podium */}
      <div style={{padding:'40px 20px 0',display:'flex',alignItems:'flex-end',justifyContent:'center',gap:14,height:320}}>
        <PodiumPlace u={top[1]} height={130}/>
        <PodiumPlace u={top[0]} height={170} gold/>
        <PodiumPlace u={top[2]} height={110}/>
      </div>

      {/* Ranked list */}
      <div style={{padding:'28px 16px 0',display:'flex',flexDirection:'column',gap:6}}>
        {rest.map(u=>(
          <div key={u.r} style={{background:u.me?'rgba(232,194,104,.08)':c.ink800,border:`1px solid ${u.me?c.goldLine:c.ink600}`,borderRadius:12,padding:'12px 14px',display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:32,fontFamily:__f().ui,fontSize:13,fontWeight:700,color:u.me?c.gold:c.ink300,fontVariantNumeric:'tabular-nums',textAlign:'center'}}>
              {u.r > 100 ? `#${u.r}` : u.r}
            </div>
            <div style={{width:36,height:36,borderRadius:'50%',background:u.c,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:__f().display,fontWeight:500,color:'#241E18',fontSize:14,letterSpacing:'-0.02em'}}>
              {u.name[0]}
            </div>
            <div style={{flex:1}}>
              <div style={{fontFamily:__f().ui,fontSize:14,fontWeight:u.me?700:600,color:c.cream,letterSpacing:'-0.015em'}}>{u.name}</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:4}}>
              <KarmaDotToken size={11}/>
              <span style={{fontFamily:__f().ui,fontSize:14,fontWeight:700,color:c.gold,fontVariantNumeric:'tabular-nums',letterSpacing:'-0.01em'}}>{window.IYI_V2.fmt(u.k)}</span>
            </div>
          </div>
        ))}
      </div>

      <BottomNav active="profile"/>
    </div>
  );
}

function PodiumPlace({ u, height, gold }) {
  const c = __C();
  return (
    <div style={{flex:'0 0 92px',display:'flex',flexDirection:'column',alignItems:'center'}}>
      <div style={{position:'relative',marginBottom:10}}>
        {gold && <div style={{position:'absolute',inset:-12,background:'radial-gradient(circle, rgba(232,194,104,.3),transparent 70%)',filter:'blur(12px)'}}/>}
        <div style={{position:'relative',width:gold?64:52,height:gold?64:52,borderRadius:'50%',background:u.c,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:__f().display,fontSize:gold?26:22,fontWeight:500,color:'#241E18',letterSpacing:'-0.02em',border:`3px solid ${gold?c.gold:c.ink600}`,boxShadow:gold?'0 8px 20px rgba(0,0,0,.3)':'none'}}>{u.name[0]}</div>
        {gold && <div style={{position:'absolute',bottom:-4,left:'50%',transform:'translateX(-50%)',width:26,height:26,borderRadius:'50%',background:c.gold,border:`2px solid ${c.ink900}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:__f().ui,fontSize:12,fontWeight:700,color:'#3E2F14',boxShadow:'0 4px 10px rgba(0,0,0,.3)'}}>1</div>}
      </div>
      <div style={{fontFamily:__f().ui,fontSize:12,fontWeight:600,color:c.cream,letterSpacing:'-0.01em',textAlign:'center',marginBottom:2,maxWidth:90,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{u.name.split(' ')[0]}</div>
      <div style={{display:'flex',alignItems:'center',gap:3,marginBottom:10}}>
        <KarmaDotToken size={9}/>
        <span style={{fontFamily:__f().ui,fontSize:11,fontWeight:700,color:c.gold,fontVariantNumeric:'tabular-nums'}}>{window.IYI_V2.fmt(u.k)}</span>
      </div>
      <div style={{width:'100%',height,borderRadius:'10px 10px 0 0',background:gold?`linear-gradient(180deg, ${c.gold}, ${c.goldDim})`:c.ink700,border:`1px solid ${gold?c.goldDim:c.ink600}`,borderBottom:'none',display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:14,fontFamily:__f().display,fontSize:gold?28:22,fontWeight:500,color:gold?'#3E2F14':c.ink300,letterSpacing:'-0.03em',boxShadow:gold?'inset 0 1px 0 rgba(255,255,255,.3)':'none'}}>
        {u.r}
      </div>
    </div>
  );
}

Object.assign(window, {
  Discover, Rewards, RewardTileLite, Profile,
  Onboarding, OnboardingWelcome, OnboardingCauses, OnboardingLocation, OnboardingReady,
  MissionApplied, MissionCheckIn, MissionCompleted, MissionDetailWithState,
  Notifications, NotifRow, Streak, Leaderboard, PodiumPlace, Step, StatusIcon,
});