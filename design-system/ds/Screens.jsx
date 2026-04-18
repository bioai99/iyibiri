/* global React */
// İyiBiri — App Screens v2
// Dashboard, Mission Detail. Premium × Warm theme.

const _Cs = () => window.IYI.color;
const _fs = () => window.IYI.font;

// ═════════════════════════════════ DASHBOARD ═════════════════════════════════
function Dashboard() {
  const c = _Cs();
  const p = window.IYI_V2.profile;
  const ngosArr = Object.values(window.IYI_V2.ngos);
  const missions = window.IYI_V2.missions;
  const [filter, setFilter] = React.useState('Tümü');
  const filters = ['Tümü', 'Yakınımda', 'Bu hafta sonu', 'Online', 'Kısa', 'Uzun'];

  return (
    <div style={{background: c.ink900, color: c.cream, minHeight:'100%', paddingBottom: 100}}>
      {/* Header */}
      <div style={{padding:'58px 20px 0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{...window.IYI.typo('eyebrow'), color: c.ink300, fontFamily:_fs().ui}}>18 NİSAN · CUMARTESİ</div>
          <div style={{
            fontFamily:_fs().display, fontSize:22, fontWeight:500,
            letterSpacing:'-0.02em', marginTop:4, color: c.cream,
          }}>
            Günaydın, <span style={{fontStyle:'italic'}}>{p.firstName}</span>
          </div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <IconButton icon={<Icon.bell size={18}/>} size={38}/>
          <div style={{
            width:38,height:38,borderRadius:'50%',
            background:`linear-gradient(135deg, ${c.gold}, ${c.goldDim})`,
            display:'flex',alignItems:'center',justifyContent:'center',
            fontFamily:_fs().display,fontSize:16,fontWeight:600,color:'#241E18',
            letterSpacing:'-0.02em',
            boxShadow:'0 2px 8px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.25)',
          }}>A</div>
        </div>
      </div>

      {/* Hero */}
      <div style={{padding:'20px 16px 0'}}>
        <HeroCard profile={p}/>
      </div>

      {/* Quick actions — 2x2 compact row */}
      <div style={{padding:'16px 16px 0',display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        <QuickAction icon={<Icon.calendar size={18} color={c.gold}/>} title="Bu hafta sonu" sub="12 görev yakında"/>
        <QuickAction icon={<Icon.spark size={18} color={c.gold}/>} title="Önerilenler" sub="Senin için 6 yeni"/>
      </div>

      {/* Filters */}
      <div style={{padding:'24px 0 4px',display:'flex',gap:8,overflowX:'auto',scrollbarWidth:'none',paddingLeft:20,paddingRight:20}}>
        {filters.map(f => (
          <Chip key={f} active={filter===f} onClick={()=>setFilter(f)}>{f}</Chip>
        ))}
      </div>

      {/* Mission section */}
      <div style={{padding:'24px 20px 12px',display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
        <h2 style={{margin:0, fontFamily:_fs().display, fontSize:24, fontWeight:500, letterSpacing:'-0.02em', color:c.cream}}>
          Senin için seçtik
        </h2>
        <span style={{fontSize:11,color:c.gold,letterSpacing:'.06em',fontWeight:700,fontFamily:_fs().ui}}>TÜMÜ →</span>
      </div>

      {/* Mission list */}
      <div style={{padding:'0 16px',display:'flex',flexDirection:'column',gap:16}}>
        {missions.slice(0, 3).map(m => (
          <MissionCard key={m.id} mission={m} ngo={window.IYI_V2.ngos[m.ngoId]}/>
        ))}
      </div>

      {/* NGO rail */}
      <div style={{padding:'32px 0 0'}}>
        <div style={{padding:'0 20px 14px',display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
          <div>
            <div style={{...window.IYI.typo('eyebrow'), color: c.gold, fontFamily:_fs().ui, marginBottom:3}}>Ortaklar</div>
            <h2 style={{margin:0, fontFamily:_fs().display, fontSize:22, fontWeight:500, letterSpacing:'-0.02em', color:c.cream}}>
              İyiliğin öncüleri
            </h2>
          </div>
          <span style={{fontSize:11,color:c.gold,fontWeight:700,letterSpacing:'.06em',fontFamily:_fs().ui}}>TÜMÜ →</span>
        </div>
        <div style={{display:'flex',gap:12,overflowX:'auto',padding:'0 20px 20px',scrollbarWidth:'none'}}>
          {ngosArr.map(n => <NGOCard key={n.short} ngo={n}/>)}
        </div>
      </div>

      {/* Impact mini — pastel accent card */}
      <div style={{padding:'8px 16px 20px'}}>
        <ImpactSummary completed={p.completed} karma={p.karma}/>
      </div>

      <BottomNav active="home"/>
    </div>
  );
}

function QuickAction({ icon, title, sub }) {
  const c = _Cs();
  return (
    <button style={{
      background: c.ink800, border:`1px solid ${c.ink600}`, borderRadius: 14,
      padding:'14px 14px 12px', display:'flex',gap:10,alignItems:'flex-start',
      textAlign:'left',cursor:'pointer',
      transition:`all ${window.IYI.motion.base}`,
    }}>
      <div style={{
        width:34,height:34,borderRadius:10,flexShrink:0,
        background:'rgba(232,194,104,.12)',border:`1px solid ${c.goldLine}`,
        display:'flex',alignItems:'center',justifyContent:'center',
      }}>{icon}</div>
      <div style={{minWidth:0,flex:1}}>
        <div style={{fontFamily:_fs().ui,fontSize:13,fontWeight:600,color:c.cream,letterSpacing:'-0.015em',lineHeight:1.25}}>{title}</div>
        <div style={{fontSize:11,color:c.ink300,marginTop:3,lineHeight:1.35}}>{sub}</div>
      </div>
    </button>
  );
}

function ImpactSummary({ completed, karma }) {
  const c = _Cs();
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(233,207,194,.12), rgba(196,203,172,.08))',
      border:`1px solid ${c.ink600}`, borderRadius: 18, padding: '22px 22px',
      position:'relative', overflow:'hidden',
    }}>
      <div style={{...window.IYI.typo('eyebrow'), color: c.ink300, fontFamily:_fs().ui}}>Birlikte bugüne kadar</div>
      <div style={{fontFamily:_fs().display,fontSize:26,fontWeight:500,letterSpacing:'-0.02em',color:c.cream,marginTop:8,lineHeight:1.2}}>
        <span style={{color:c.gold}}>{window.IYI_V2.fmt(48620)}</span> gönüllü ·
        <span style={{color:c.gold}}> {window.IYI_V2.fmt(3421000)}</span> Karma
      </div>
      <div style={{fontSize:13,color:c.ink300,marginTop:6,fontFamily:_fs().ui,maxWidth:280,lineHeight:1.5}}>
        Sen de bu topluluğun <span style={{fontFamily:_fs().display,fontStyle:'italic',color:c.cream}}>#142</span>'nci sırasındasın.
      </div>
    </div>
  );
}

// ═════════════════════════════════ MISSION DETAIL ═════════════════════════════════
function MissionDetail() {
  const c = _Cs();
  const m = window.IYI_V2.missions[0];
  const ngo = window.IYI_V2.ngos[m.ngoId];

  return (
    <div style={{background: c.ink900, color: c.cream, minHeight:'100%', paddingBottom:120}}>
      {/* Full-bleed hero photo with back + heart */}
      <div style={{position:'relative',aspectRatio:'4/3',overflow:'hidden'}}>
        <img src={m.photo} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(26,22,18,.3) 0%,rgba(26,22,18,0) 30%, rgba(26,22,18,0) 70%, rgba(36,32,27,1) 100%)'}}/>
        <div style={{position:'absolute',top:58,left:16,right:16,display:'flex',justifyContent:'space-between'}}>
          <IconButton icon={<Icon.chevron size={18} style={{transform:'rotate(180deg)'}}/>}/>
          <div style={{display:'flex',gap:8}}>
            <IconButton icon={<Icon.share size={16}/>}/>
            <IconButton icon={<Icon.heart size={16}/>}/>
          </div>
        </div>
        <div style={{position:'absolute',bottom:24,left:20,right:20}}>
          <Badge variant="onImage" style={{marginBottom:10}}>{m.category}</Badge>
          <h1 style={{
            margin:0, fontFamily:_fs().display, fontSize:34, fontWeight:500,
            letterSpacing:'-0.028em', lineHeight:1.05, color:c.cream,
          }}>{m.title}</h1>
        </div>
      </div>

      {/* NGO lockup */}
      <div style={{padding:'18px 20px 6px',display:'flex',alignItems:'center',gap:10,borderBottom:`1px solid ${c.ink600}`,paddingBottom:18}}>
        <div style={{width:40,height:40,borderRadius:'50%',background:'white',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,.3)'}}>
          <img src={ngo.logo} alt="" style={{width:'70%',height:'70%',objectFit:'contain'}}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontFamily:_fs().ui,fontSize:15,fontWeight:600,color:c.cream,letterSpacing:'-0.015em'}}>{ngo.name}</div>
          <div style={{fontSize:11,color:c.ink300,marginTop:2}}>27 yıldır · 12.4K gönüllü</div>
        </div>
        <button style={{padding:'7px 14px',borderRadius:999,background:'transparent',border:`1px solid ${c.ink600}`,color:c.cream,fontFamily:_fs().ui,fontSize:12,fontWeight:600,cursor:'pointer'}}>
          Takip et
        </button>
      </div>

      {/* Key facts grid */}
      <div style={{padding:'20px 16px 0',display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <FactCard label="TARİH" value={m.date} icon={<Icon.calendar size={16} color={c.gold}/>}/>
        <FactCard label="SÜRE" value={m.duration} icon={<Icon.clock size={16} color={c.gold}/>}/>
        <FactCard label="KONUM" value={m.location} icon={<Icon.pin size={16} color={c.gold}/>}/>
        <FactCard label="KONTENJAN" value={`${m.spotsLeft} yer`} icon={<Icon.users size={16} color={c.gold}/>} urgent={m.spotsLeft <= 5}/>
      </div>

      {/* Impact / description */}
      <div style={{padding:'24px 20px 0'}}>
        <div style={{...window.IYI.typo('eyebrow'), color: c.gold, fontFamily:_fs().ui, marginBottom:8}}>Bu Görevin Etkisi</div>
        <p style={{margin:0, fontFamily:_fs().display, fontSize:22, fontWeight:400, lineHeight:1.3, letterSpacing:'-0.015em', color:c.cream, fontStyle:'italic'}}>
          "{m.impact}"
        </p>
        <p style={{marginTop:16,fontSize:14,lineHeight:1.6,color:c.ink200,fontFamily:_fs().ui}}>
          Sahile vardığında TEMA Vakfı gönüllüleriyle buluşacaksın. Eldiven, çuval ve su ikram edilecek. Topladığın atıklar geri dönüşüme gidecek, bulduğun mikroplastikler TEMA'nın araştırma veritabanına eklenecek. Hava durumu kötü olursa SMS ile haber vereceğiz.
        </p>
      </div>

      {/* Reward summary */}
      <div style={{padding:'24px 16px 0'}}>
        <div style={{
          background:c.ink800,border:`1px solid ${c.goldLine}`,borderRadius:16,padding:'18px 20px',
          display:'flex',justifyContent:'space-between',alignItems:'center',
        }}>
          <div>
            <div style={{...window.IYI.typo('eyebrow'), color: c.ink300, fontFamily:_fs().ui}}>Kazanacağın</div>
            <div style={{display:'flex',alignItems:'baseline',gap:6,marginTop:6}}>
              <KarmaDotToken size={14}/>
              <span style={{fontFamily:_fs().ui,fontSize:32,fontWeight:700,color:c.gold,letterSpacing:'-0.025em',fontVariantNumeric:'tabular-nums',marginLeft:2}}>+{m.karma}</span>
              <span style={{fontSize:13,color:c.ink300,marginLeft:4}}>Karma</span>
            </div>
          </div>
          <KarmaToken size={56}/>
        </div>
      </div>

      {/* Others joined */}
      <div style={{padding:'24px 20px 24px'}}>
        <div style={{...window.IYI.typo('eyebrow'), color: c.ink300, fontFamily:_fs().ui}}>Katılanlar</div>
        <div style={{display:'flex',alignItems:'center',marginTop:10}}>
          {['#B58F3D','#C4CBAC','#E9CFC2','#574E42'].map((bg,i) => (
            <div key={i} style={{width:34,height:34,borderRadius:'50%',background:bg,border:`2px solid ${c.ink900}`,marginLeft: i===0?0:-10,fontFamily:_fs().display,fontWeight:500,color:c.cream,fontSize:13,display:'flex',alignItems:'center',justifyContent:'center',letterSpacing:'-0.02em'}}>{['E','M','D','B'][i]}</div>
          ))}
          <div style={{marginLeft:10,fontSize:13,color:c.ink200,fontFamily:_fs().ui}}>
            <b style={{color:c.cream}}>17 kişi</b> katıldı · <span style={{color:c.ink300}}>senin ağından 3'ü</span>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'16px 16px 28px',background:'linear-gradient(180deg,rgba(36,32,27,0),rgba(36,32,27,.95) 30%)',backdropFilter:'blur(12px)',zIndex:90}}>
        <Button variant="primary" size="lg" full iconRight={<Icon.arrow size={16}/>}>
          Bu göreve katıl
        </Button>
      </div>
    </div>
  );
}

function FactCard({ label, value, icon, urgent }) {
  const c = _Cs();
  return (
    <div style={{
      background: c.ink800, border:`1px solid ${urgent ? c.goldLine : c.ink600}`, borderRadius: 14,
      padding:'14px 14px 12px',
    }}>
      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
        {icon}
        <span style={{...window.IYI.typo('eyebrow'), color: c.ink300, fontFamily:_fs().ui, fontSize:9}}>{label}</span>
      </div>
      <div style={{fontFamily:_fs().ui,fontSize:15,fontWeight:600,color: urgent ? c.gold : c.cream,letterSpacing:'-0.015em'}}>{value}</div>
    </div>
  );
}

Object.assign(window, { Dashboard, MissionDetail, QuickAction, ImpactSummary, FactCard });
