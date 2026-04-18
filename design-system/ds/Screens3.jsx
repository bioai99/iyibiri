/* global React */
// İyiBiri — NGO Membership & Donation Flows
// 3 NGO ekran + 4 bağış ekran = 7 akış ekranı. Premium × Warm sistem.

const _Cf = () => window.IYI.color;
const _ff = () => window.IYI.font;

// ═════════════════════════════════ NGO PROFILE ════════════════════════════════
// Ayrıntılı NGO sayfası — kapak, istatistik, aktif görevler, üye ol CTA.
function NGOProfile() {
  const c = _Cf();
  const ngo = {
    name: 'TEMA Vakfı',
    tagline: 'Türkiye\'nin Erozyonla Mücadele',
    cover: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&q=80',
    logo: 'assets/logos/tema-logo.png',
    members: '12.4K',
    years: 27,
    trees: '485M',
    about: '1992\'den bu yana Türkiye\'nin toprağını, ormanını ve doğal varlıklarını koruyoruz. Gönüllülerimizle 485 milyon fidan diktik.',
    activeMissions: 8,
  };

  return (
    <div style={{background:c.ink900,color:c.cream,minHeight:'100%',paddingBottom:140}}>
      {/* Cover */}
      <div style={{position:'relative',height:280}}>
        <img src={ngo.cover} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
        <div style={{position:'absolute',inset:0,background:`linear-gradient(180deg,rgba(26,22,18,.45) 0%,rgba(26,22,18,0) 30%,rgba(26,22,18,0) 60%,${c.ink900} 100%)`}}/>
        <div style={{position:'absolute',top:58,left:16,right:16,display:'flex',justifyContent:'space-between'}}>
          <IconButton icon={<Icon.chevron size={16} style={{transform:'rotate(180deg)'}}/>} onDark/>
          <div style={{display:'flex',gap:8}}>
            <IconButton icon={<Icon.share size={16}/>} onDark/>
            <IconButton icon={<Icon.heart size={16}/>} onDark/>
          </div>
        </div>
      </div>

      {/* Lockup */}
      <div style={{padding:'0 20px',marginTop:-44,position:'relative',display:'flex',alignItems:'flex-end',gap:14}}>
        <div style={{width:88,height:88,borderRadius:20,background:'#fff',border:`3px solid ${c.ink900}`,display:'flex',alignItems:'center',justifyContent:'center',padding:8,flexShrink:0,boxShadow:'0 8px 24px rgba(0,0,0,.3)'}}>
          <img src={ngo.logo} style={{width:'100%',height:'100%',objectFit:'contain'}}/>
        </div>
        <div style={{flex:1,paddingBottom:6,minWidth:0}}>
          <h1 style={{margin:0,fontFamily:_ff().display,fontSize:22,fontWeight:500,letterSpacing:'-0.022em',lineHeight:1.1,color:c.cream}}>{ngo.name}</h1>
          <p style={{margin:'4px 0 0',fontFamily:_ff().ui,fontSize:12,color:c.ink300,lineHeight:1.4}}>{ngo.tagline}</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{padding:'20px 20px 0',display:'flex',gap:8}}>
        {[['YIL',ngo.years],['ÜYE',ngo.members],['FİDAN',ngo.trees]].map(([k,v])=>(
          <div key={k} style={{flex:1,background:c.ink800,border:`1px solid ${c.ink600}`,borderRadius:12,padding:'12px 10px',textAlign:'center'}}>
            <div style={{...window.IYI.typo('eyebrow'),color:c.ink300,fontFamily:_ff().ui}}>{k}</div>
            <div style={{fontFamily:_ff().ui,fontSize:17,fontWeight:700,color:c.cream,letterSpacing:'-0.02em',marginTop:4,fontVariantNumeric:'tabular-nums'}}>{v}</div>
          </div>
        ))}
      </div>

      {/* About */}
      <div style={{padding:'24px 20px 0'}}>
        <h3 style={{margin:0,fontFamily:_ff().display,fontSize:16,fontWeight:500,color:c.cream,fontStyle:'italic'}}>Biz kimiz?</h3>
        <p style={{margin:'8px 0 0',fontFamily:_ff().ui,fontSize:13,color:c.ink200,lineHeight:1.6}}>{ngo.about}</p>
      </div>

      {/* Section — Membership teaser */}
      <div style={{padding:'24px 20px 0'}}>
        <div style={{background:c.ink800,border:`1px solid ${c.goldLine}`,borderRadius:16,padding:18,position:'relative',overflow:'hidden'}}>
          <svg width="180" height="180" viewBox="0 0 180 180" style={{position:'absolute',right:-60,top:-60,opacity:.1}}>
            {[80,60,40,20].map(r=>(<circle key={r} cx="90" cy="90" r={r} stroke={c.gold} strokeWidth=".7" fill="none"/>))}
          </svg>
          <div style={{...window.IYI.typo('eyebrow'),color:c.gold,fontFamily:_ff().ui,marginBottom:6}}>TEMA ÜYESİ OL</div>
          <h3 style={{margin:0,fontFamily:_ff().display,fontSize:22,fontWeight:500,letterSpacing:'-0.025em',color:c.cream,lineHeight:1.15}}>
            Aylık destek, <span style={{fontStyle:'italic',color:c.gold}}>her ay Karma</span>.
          </h3>
          <p style={{margin:'8px 0 14px',fontFamily:_ff().ui,fontSize:13,color:c.ink300,lineHeight:1.55}}>TEMA üyeliğinle her ay otomatik katkı yap. Her ay için ekstra Karma kazan.</p>
          <button style={{background:c.gold,border:'none',color:'#241E18',padding:'12px 18px',borderRadius:12,fontFamily:_ff().ui,fontSize:14,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
            Planları gör <Icon.chevron size={14} color="#241E18"/>
          </button>
        </div>
      </div>

      {/* Active missions */}
      <div style={{padding:'28px 16px 0'}}>
        <div style={{padding:'0 4px 14px',display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
          <h3 style={{margin:0,fontFamily:_ff().display,fontSize:20,fontWeight:500,letterSpacing:'-0.02em',color:c.cream}}>
            Açık <span style={{fontStyle:'italic',color:c.gold}}>görevler</span>
          </h3>
          <span style={{...window.IYI.typo('eyebrow'),color:c.gold,fontFamily:_ff().ui,fontSize:10}}>{ngo.activeMissions} GÖREV</span>
        </div>
        {Object.values(window.IYI_V2.missions).filter(m=>m.ngoKey==='tema').slice(0,2).map(m=>(
          <div key={m.id} style={{marginBottom:10}}><MissionCard mission={m}/></div>
        ))}
      </div>

      <BottomNav active="search"/>
    </div>
  );
}

// ═════════════════════════════════ MEMBERSHIP PLANS ═══════════════════════════
function MembershipPlans() {
  const c = _Cf();
  const [plan, setPlan] = React.useState('orta');
  const plans = [
    { k:'temel', name:'Fidan', tl:30,  karmaPm:50,  desc:'Her ay 1 fidan dikilir', color:c.wheat },
    { k:'orta',  name:'Koruyucu', tl:75, karmaPm:120, desc:'Aylık gönüllü ağı erişimi + 3 fidan', color:c.gold, hot:true },
    { k:'üst',   name:'Elçi', tl:150, karmaPm:250, desc:'Özel etkinlik daveti + 6 fidan', color:c.blush },
  ];
  const sel = plans.find(p=>p.k===plan);

  return (
    <div style={{background:c.ink900,color:c.cream,minHeight:'100%',paddingBottom:40,height:'844px',display:'flex',flexDirection:'column'}}>
      {/* Header */}
      <div style={{padding:'58px 20px 0',display:'flex',alignItems:'center',gap:10}}>
        <IconButton icon={<Icon.chevron size={16} style={{transform:'rotate(180deg)'}}/>}/>
        <div style={{flex:1}}>
          <div style={{...window.IYI.typo('eyebrow'),color:c.gold,fontFamily:_ff().ui}}>TEMA VAKFI · ÜYELİK</div>
        </div>
        <IconButton icon={<Icon.info size={16}/>}/>
      </div>

      {/* Hero */}
      <div style={{padding:'24px 20px 0'}}>
        <h1 style={{margin:0,fontFamily:_ff().display,fontSize:30,fontWeight:500,letterSpacing:'-0.025em',color:c.cream,lineHeight:1.1}}>
          <span style={{fontStyle:'italic'}}>Aylık</span> destek planı seç
        </h1>
        <p style={{margin:'10px 0 0',fontFamily:_ff().ui,fontSize:14,color:c.ink300,lineHeight:1.55}}>Her planın her ay otomatik Karma ödülü var. İstediğin zaman iptal edebilirsin.</p>
      </div>

      {/* Plans */}
      <div style={{padding:'20px 16px 0',display:'flex',flexDirection:'column',gap:10,flex:'1 1 auto',minHeight:0,overflowY:'auto'}}>
        {plans.map(p => {
          const active = p.k === plan;
          return (
            <button key={p.k} onClick={()=>setPlan(p.k)} style={{
              background:active?'rgba(232,194,104,.06)':c.ink800,
              border:`1.5px solid ${active?c.gold:c.ink600}`,
              borderRadius:16,padding:'16px 18px',
              cursor:'pointer',textAlign:'left',position:'relative',transition:'all .2s',
              display:'flex',alignItems:'center',gap:14,
            }}>
              {p.hot && <span style={{position:'absolute',top:-8,right:14,background:c.gold,color:'#241E18',fontFamily:_ff().ui,fontSize:9,fontWeight:700,letterSpacing:'.14em',padding:'3px 8px',borderRadius:999,textTransform:'uppercase'}}>Popüler</span>}
              <div style={{width:42,height:42,borderRadius:12,background:`${p.color}22`,border:`1px solid ${p.color}55`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Icon.leaf size={20} color={p.color}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:_ff().display,fontSize:17,fontWeight:500,color:c.cream,letterSpacing:'-0.015em'}}>{p.name}</div>
                <div style={{fontFamily:_ff().ui,fontSize:12,color:c.ink300,marginTop:2,lineHeight:1.4}}>{p.desc}</div>
                <div style={{display:'flex',alignItems:'center',gap:6,marginTop:8}}>
                  <KarmaDotToken size={10}/>
                  <span style={{fontFamily:_ff().ui,fontSize:11,fontWeight:700,color:c.gold,fontVariantNumeric:'tabular-nums'}}>+{p.karmaPm} Karma / ay</span>
                </div>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <div style={{fontFamily:_ff().ui,fontSize:20,fontWeight:700,color:c.cream,letterSpacing:'-0.02em',fontVariantNumeric:'tabular-nums'}}>₺{p.tl}</div>
                <div style={{fontFamily:_ff().ui,fontSize:10,color:c.ink300,marginTop:1,textTransform:'uppercase',letterSpacing:'.1em'}}>/ AY</div>
              </div>
            </button>
          );
        })}

        <p style={{margin:'6px 4px 0',fontFamily:_ff().ui,fontSize:11,color:c.ink400,lineHeight:1.5}}>Üyelik bedelinin %100\'ü TEMA Vakfı\'na aktarılır. İyiBiri komisyon almaz.</p>
      </div>

      {/* Sticky CTA */}
      <div style={{padding:'14px 16px 24px',borderTop:`1px solid ${c.ink700}`,background:c.ink900}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10,fontFamily:_ff().ui}}>
          <span style={{fontSize:12,color:c.ink300}}>{sel.name} planı seçildi</span>
          <span style={{fontSize:14,fontWeight:700,color:c.cream,fontVariantNumeric:'tabular-nums'}}>₺{sel.tl} <span style={{color:c.ink300,fontWeight:400}}>/ay</span></span>
        </div>
        <button style={{width:'100%',background:c.gold,border:'none',color:'#241E18',padding:'14px 20px',borderRadius:14,fontFamily:_ff().ui,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
          Üye ol · ₺{sel.tl}/ay →
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════ MEMBERSHIP SUCCESS ═════════════════════════
function MembershipSuccess() {
  const c = _Cf();
  return (
    <div style={{background:c.ink900,color:c.cream,minHeight:'100%',display:'flex',flexDirection:'column',height:'844px'}}>
      {/* Hero */}
      <div style={{flex:'1 1 auto',position:'relative',overflow:'hidden',minHeight:0,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',padding:'40px 28px 0'}}>
        {/* Rings */}
        <svg width="440" height="440" viewBox="0 0 440 440" style={{position:'absolute',top:-40,left:'50%',transform:'translateX(-50%)',opacity:.12,pointerEvents:'none'}}>
          {[200,160,120,80,40].map(r=>(<circle key={r} cx="220" cy="220" r={r} stroke={c.gold} strokeWidth=".8" fill="none"/>))}
        </svg>

        {/* NGO logo medallion */}
        <div style={{position:'relative',marginBottom:24}}>
          <div style={{position:'absolute',inset:-20,background:'radial-gradient(circle, rgba(232,194,104,.4),transparent 70%)',filter:'blur(20px)'}}/>
          <div style={{position:'relative',width:120,height:120,borderRadius:'50%',background:'linear-gradient(135deg,#F4D98A,#B58F3D)',padding:8,boxShadow:'0 16px 40px rgba(0,0,0,.4), inset 0 2px 0 rgba(255,255,255,.3)'}}>
            <div style={{width:'100%',height:'100%',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',padding:14}}>
              <img src="assets/logos/tema-logo.png" style={{width:'100%',height:'100%',objectFit:'contain'}}/>
            </div>
          </div>
          {/* Check badge */}
          <div style={{position:'absolute',bottom:-4,right:-4,width:40,height:40,borderRadius:'50%',background:c.sage,border:`3px solid ${c.ink900}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Icon.check size={20} color="#241E18"/>
          </div>
        </div>

        <div style={{position:'relative',textAlign:'center'}}>
          <div style={{...window.IYI.typo('eyebrow'),color:c.gold,fontFamily:_ff().ui,marginBottom:10}}>ÜYELİĞİN BAŞLADI</div>
          <h1 style={{margin:0,fontFamily:_ff().display,fontSize:34,fontWeight:500,letterSpacing:'-0.025em',lineHeight:1.05,color:c.cream}}>
            TEMA ailesine <span style={{fontStyle:'italic'}}>hoş geldin,</span><br/>
            <span style={{color:c.gold,fontStyle:'italic'}}>Ayşe</span>.
          </h1>
          <p style={{margin:'16px auto 0',fontFamily:_ff().ui,fontSize:14,color:c.ink200,lineHeight:1.55,maxWidth:300}}>Koruyucu planına katıldın. Her ay ₺75 otomatik, her ay +120 Karma.</p>
        </div>
      </div>

      {/* Karma reward card */}
      <div style={{padding:'0 20px 20px'}}>
        <div style={{background:c.ink800,border:`1px solid ${c.goldLine}`,borderRadius:16,padding:'16px 18px',display:'flex',alignItems:'center',gap:14}}>
          <div style={{width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,#F4D98A,#B58F3D)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'inset 0 1px 0 rgba(255,255,255,.3)'}}>
            <span style={{fontFamily:_ff().display,fontStyle:'italic',fontWeight:600,fontSize:22,color:'#3E2F14'}}>i</span>
          </div>
          <div style={{flex:1}}>
            <div style={{...window.IYI.typo('eyebrow'),color:c.ink300,fontFamily:_ff().ui}}>HOŞ GELDİN BONUSU</div>
            <div style={{display:'flex',alignItems:'baseline',gap:4,marginTop:4}}>
              <span style={{fontFamily:_ff().ui,fontSize:26,fontWeight:700,color:c.gold,letterSpacing:'-0.025em',fontVariantNumeric:'tabular-nums'}}>+300</span>
              <span style={{fontFamily:_ff().ui,fontSize:13,color:c.cream}}>Karma</span>
            </div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontFamily:_ff().ui,fontSize:11,color:c.ink300}}>Yeni bakiye</div>
            <div style={{fontFamily:_ff().ui,fontSize:15,fontWeight:700,color:c.cream,marginTop:2,fontVariantNumeric:'tabular-nums'}}>2.640</div>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div style={{padding:'0 20px 28px',display:'flex',flexDirection:'column',gap:10}}>
        <button style={{background:c.gold,border:'none',color:'#241E18',padding:'14px 20px',borderRadius:14,fontFamily:_ff().ui,fontSize:15,fontWeight:700,cursor:'pointer'}}>
          TEMA profilime git →
        </button>
        <button style={{background:'transparent',border:`1px solid ${c.ink600}`,color:c.cream,padding:'12px 20px',borderRadius:14,fontFamily:_ff().ui,fontSize:14,fontWeight:500,cursor:'pointer'}}>
          Ana sayfa
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════ DONATION — CAMPAIGN ═══════════════════════
function DonationCampaign() {
  const c = _Cf();
  const camp = {
    title: 'Deprem bölgesine kış yardımı',
    ngo: 'Türk Kızılay',
    ngoLogo: 'assets/logos/kizilay-logo.png',
    cover: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=900&q=80',
    goal: 2000000,
    raised: 1347000,
    donors: 8420,
    daysLeft: 23,
    desc: 'Hatay, Adıyaman ve Kahramanmaraş\'taki konteyner kentlerdeki ailelere mont, battaniye ve gıda kolisi ulaştırıyoruz. Her ₺100 bir aileye bir haftalık ısınma sağlar.',
  };
  const pct = Math.round(camp.raised / camp.goal * 100);

  return (
    <div style={{background:c.ink900,color:c.cream,minHeight:'100%',paddingBottom:110}}>
      {/* Cover */}
      <div style={{position:'relative',aspectRatio:'4/3'}}>
        <img src={camp.cover} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
        <div style={{position:'absolute',inset:0,background:`linear-gradient(180deg,rgba(26,22,18,.5) 0%,rgba(26,22,18,0) 25%,rgba(26,22,18,0) 60%,${c.ink900} 100%)`}}/>
        <div style={{position:'absolute',top:58,left:16,right:16,display:'flex',justifyContent:'space-between'}}>
          <IconButton icon={<Icon.chevron size={16} style={{transform:'rotate(180deg)'}}/>} onDark/>
          <IconButton icon={<Icon.share size={16}/>} onDark/>
        </div>
        {/* Urgency pill */}
        <div style={{position:'absolute',top:110,left:16,display:'inline-flex',alignItems:'center',gap:6,padding:'6px 12px',borderRadius:999,background:'rgba(200,85,61,.25)',border:'1px solid rgba(200,85,61,.5)',backdropFilter:'blur(10px)'}}>
          <Icon.flame size={12} color={c.clay}/>
          <span style={{fontFamily:_ff().ui,fontSize:11,fontWeight:600,color:'#F4A593',letterSpacing:'.04em'}}>ACİL · {camp.daysLeft} gün kaldı</span>
        </div>
      </div>

      {/* NGO lockup + title */}
      <div style={{padding:'0 20px',marginTop:-24,position:'relative'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
          <div style={{width:40,height:40,borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',padding:6,border:`3px solid ${c.ink900}`,flexShrink:0}}>
            <img src={camp.ngoLogo} style={{width:'100%',height:'100%',objectFit:'contain'}}/>
          </div>
          <div style={{fontFamily:_ff().ui,fontSize:13,fontWeight:600,color:c.cream}}>{camp.ngo}</div>
        </div>
        <h1 style={{margin:0,fontFamily:_ff().display,fontSize:28,fontWeight:500,letterSpacing:'-0.025em',color:c.cream,lineHeight:1.15}}>{camp.title}</h1>
      </div>

      {/* Progress */}
      <div style={{padding:'20px 20px 0'}}>
        <div style={{background:c.ink800,border:`1px solid ${c.ink600}`,borderRadius:16,padding:16}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
            <div>
              <div style={{fontFamily:_ff().ui,fontSize:24,fontWeight:700,color:c.gold,letterSpacing:'-0.022em',fontVariantNumeric:'tabular-nums'}}>
                ₺{window.IYI_V2.fmt(Math.round(camp.raised/1000))}K
              </div>
              <div style={{fontFamily:_ff().ui,fontSize:11,color:c.ink300,marginTop:3}}>
                ₺{window.IYI_V2.fmt(Math.round(camp.goal/1000))}K hedefin <span style={{color:c.cream,fontWeight:600}}>%{pct}</span>'i
              </div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontFamily:_ff().ui,fontSize:18,fontWeight:700,color:c.cream,letterSpacing:'-0.02em',fontVariantNumeric:'tabular-nums'}}>{window.IYI_V2.fmt(camp.donors)}</div>
              <div style={{fontFamily:_ff().ui,fontSize:11,color:c.ink300,marginTop:3}}>bağışçı</div>
            </div>
          </div>
          <div style={{height:8,background:'rgba(255,255,255,.05)',borderRadius:999,overflow:'hidden',marginTop:12}}>
            <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${c.goldDim},${c.gold})`,borderRadius:999}}/>
          </div>
        </div>
      </div>

      {/* Impact ladder */}
      <div style={{padding:'24px 20px 0'}}>
        <div style={{...window.IYI.typo('eyebrow'),color:c.gold,fontFamily:_ff().ui,marginBottom:10}}>BAĞIŞIN NE ETKİ YAPAR</div>
        {[
          { tl:100, impact:'Bir aileye 1 haftalık ısınma' },
          { tl:250, impact:'Bir çocuğa kış seti (mont + çizme)' },
          { tl:500, impact:'İki aileye 1 aylık gıda kolisi' },
        ].map((row,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 0',borderBottom:i<2?`1px solid ${c.ink700}`:'none'}}>
            <div style={{width:58,fontFamily:_ff().ui,fontSize:15,fontWeight:700,color:c.gold,letterSpacing:'-0.015em',fontVariantNumeric:'tabular-nums'}}>₺{row.tl}</div>
            <div style={{flex:1,fontFamily:_ff().ui,fontSize:13,color:c.cream,lineHeight:1.4}}>{row.impact}</div>
            <Icon.arrow size={14} color={c.ink400}/>
          </div>
        ))}
      </div>

      {/* About */}
      <div style={{padding:'24px 20px 0'}}>
        <p style={{margin:0,fontFamily:_ff().ui,fontSize:13,color:c.ink200,lineHeight:1.6}}>{camp.desc}</p>
      </div>

      {/* Sticky CTA */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,padding:'14px 16px 28px',background:'rgba(26,22,18,.9)',backdropFilter:'blur(14px)',borderTop:`1px solid ${c.ink700}`}}>
        <button style={{width:'100%',background:c.gold,border:'none',color:'#241E18',padding:'14px 20px',borderRadius:14,fontFamily:_ff().ui,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
          Bağış yap →
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════ DONATION — AMOUNT ═════════════════════════
function DonationAmount() {
  const c = _Cf();
  const [amount, setAmount] = React.useState(250);
  const [custom, setCustom] = React.useState('');
  const quick = [100, 250, 500, 1000];
  const karmaPer10 = 5; // her ₺10 için +5 Karma (demo oran)
  const karmaReward = Math.floor(amount / 10) * karmaPer10;

  const selectQuick = (v) => { setAmount(v); setCustom(''); };

  return (
    <div style={{background:c.ink900,color:c.cream,minHeight:'100%',height:'844px',display:'flex',flexDirection:'column'}}>
      {/* Header */}
      <div style={{padding:'58px 20px 0',display:'flex',alignItems:'center',gap:10}}>
        <IconButton icon={<Icon.chevron size={16} style={{transform:'rotate(180deg)'}}/>}/>
        <div style={{flex:1}}>
          <div style={{...window.IYI.typo('eyebrow'),color:c.gold,fontFamily:_ff().ui}}>KIZILAY · KIŞ YARDIMI</div>
        </div>
      </div>

      <div style={{padding:'28px 20px 0'}}>
        <h1 style={{margin:0,fontFamily:_ff().display,fontSize:30,fontWeight:500,letterSpacing:'-0.025em',color:c.cream,lineHeight:1.1}}>
          <span style={{fontStyle:'italic'}}>Ne kadar</span> bağışlamak istersin?
        </h1>
      </div>

      {/* Big amount */}
      <div style={{padding:'32px 20px 0',textAlign:'center'}}>
        <div style={{fontFamily:_ff().ui,fontSize:13,color:c.ink300,letterSpacing:'.02em'}}>Bağış tutarı</div>
        <div style={{display:'flex',alignItems:'baseline',justifyContent:'center',gap:4,marginTop:6}}>
          <span style={{fontFamily:_ff().display,fontSize:28,fontWeight:500,color:c.ink300,letterSpacing:'-0.02em'}}>₺</span>
          <span style={{fontFamily:_ff().ui,fontSize:64,fontWeight:700,color:c.gold,letterSpacing:'-0.035em',lineHeight:1,fontVariantNumeric:'tabular-nums'}}>
            {amount}
          </span>
        </div>
        {/* Karma preview */}
        <div style={{marginTop:12,display:'inline-flex',alignItems:'center',gap:6,padding:'6px 12px',borderRadius:999,background:'rgba(232,194,104,.1)',border:`1px solid ${c.goldLine}`}}>
          <KarmaDotToken size={10}/>
          <span style={{fontFamily:_ff().ui,fontSize:12,fontWeight:700,color:c.gold,fontVariantNumeric:'tabular-nums'}}>+{karmaReward} Karma kazanacaksın</span>
        </div>
      </div>

      {/* Quick amounts */}
      <div style={{padding:'32px 16px 0',display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        {quick.map(v=>{
          const active = amount===v && !custom;
          return (
            <button key={v} onClick={()=>selectQuick(v)} style={{
              background:active?'rgba(232,194,104,.12)':c.ink800,
              border:`1.5px solid ${active?c.gold:c.ink600}`,
              borderRadius:14,padding:'16px 20px',cursor:'pointer',
              fontFamily:_ff().ui,fontSize:18,fontWeight:700,color:active?c.gold:c.cream,
              letterSpacing:'-0.02em',fontVariantNumeric:'tabular-nums',transition:'all .15s',
            }}>₺{v}</button>
          );
        })}
      </div>

      {/* Custom amount */}
      <div style={{padding:'14px 16px 0'}}>
        <div style={{background:c.ink800,border:`1.5px solid ${custom?c.gold:c.ink600}`,borderRadius:14,padding:'14px 18px',display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontFamily:_ff().ui,fontSize:16,color:c.ink300,flexShrink:0}}>₺</span>
          <input
            value={custom}
            onChange={e=>{ const v=e.target.value.replace(/\D/g,''); setCustom(v); if(v) setAmount(+v); }}
            placeholder="Kendi tutarını yaz"
            style={{flex:1,background:'transparent',border:'none',outline:'none',color:c.cream,fontFamily:_ff().ui,fontSize:16,fontWeight:500,padding:0}}
          />
        </div>
      </div>

      <div style={{flex:1}}/>

      {/* Sticky CTA */}
      <div style={{padding:'14px 16px 24px',borderTop:`1px solid ${c.ink700}`,background:c.ink900}}>
        <button style={{width:'100%',background:c.gold,border:'none',color:'#241E18',padding:'14px 20px',borderRadius:14,fontFamily:_ff().ui,fontSize:15,fontWeight:700,cursor:'pointer'}}>
          Devam et · ₺{amount}
        </button>
        <p style={{margin:'10px 0 0',fontFamily:_ff().ui,fontSize:10,color:c.ink400,lineHeight:1.5,textAlign:'center',letterSpacing:'.02em'}}>
          Tutarın %100'ü Kızılay'a aktarılır · Komisyon yok
        </p>
      </div>
    </div>
  );
}

// ═════════════════════════════════ DONATION — REVIEW ═════════════════════════
function DonationReview() {
  const c = _Cf();
  return (
    <div style={{background:c.ink900,color:c.cream,minHeight:'100%',height:'844px',display:'flex',flexDirection:'column'}}>
      <div style={{padding:'58px 20px 0',display:'flex',alignItems:'center',gap:10}}>
        <IconButton icon={<Icon.chevron size={16} style={{transform:'rotate(180deg)'}}/>}/>
        <div style={{flex:1}}>
          <div style={{...window.IYI.typo('eyebrow'),color:c.gold,fontFamily:_ff().ui}}>BAĞIŞ ÖZETİ</div>
        </div>
      </div>

      <div style={{padding:'28px 20px 0'}}>
        <h1 style={{margin:0,fontFamily:_ff().display,fontSize:28,fontWeight:500,letterSpacing:'-0.025em',color:c.cream,lineHeight:1.1}}>
          Son bir <span style={{fontStyle:'italic'}}>onay</span>
        </h1>
      </div>

      <div style={{padding:'24px 16px 0',flex:'1 1 auto',overflowY:'auto',minHeight:0}}>
        {/* Summary card */}
        <div style={{background:c.ink800,border:`1px solid ${c.ink600}`,borderRadius:16,overflow:'hidden'}}>
          {[
            { k:'Kampanya', v:'Deprem bölgesine kış yardımı', sub:'Türk Kızılay' },
            { k:'Tutar', v:'₺250', gold:true },
            { k:'Ödeme', v:'•••• 4827', sub:'Garanti BBVA · Mastercard' },
          ].map((r,i)=>(
            <div key={r.k} style={{padding:'16px 18px',borderBottom:i<2?`1px solid ${c.ink700}`:'none',display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:16}}>
              <div style={{fontFamily:_ff().ui,fontSize:12,color:c.ink300,letterSpacing:'.02em',textTransform:'uppercase',fontWeight:600,minWidth:80}}>{r.k}</div>
              <div style={{textAlign:'right',flex:1,minWidth:0}}>
                <div style={{fontFamily:_ff().ui,fontSize:15,fontWeight:700,color:r.gold?c.gold:c.cream,letterSpacing:'-0.015em'}}>{r.v}</div>
                {r.sub && <div style={{fontFamily:_ff().ui,fontSize:11,color:c.ink300,marginTop:3}}>{r.sub}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Karma line */}
        <div style={{marginTop:16,background:'rgba(232,194,104,.06)',border:`1px solid ${c.goldLine}`,borderRadius:14,padding:'14px 16px',display:'flex',alignItems:'center',gap:12}}>
          <KarmaDotToken size={22}/>
          <div style={{flex:1}}>
            <div style={{fontFamily:_ff().ui,fontSize:13,fontWeight:600,color:c.cream}}>Karma ödülün</div>
            <div style={{fontFamily:_ff().ui,fontSize:11,color:c.ink300,marginTop:2}}>Bağışın onaylandığında hemen hesabına geçer</div>
          </div>
          <div style={{fontFamily:_ff().ui,fontSize:18,fontWeight:700,color:c.gold,letterSpacing:'-0.02em',fontVariantNumeric:'tabular-nums'}}>+125</div>
        </div>

        {/* Checkbox row */}
        <label style={{display:'flex',alignItems:'flex-start',gap:10,marginTop:20,cursor:'pointer'}}>
          <div style={{width:20,height:20,borderRadius:5,background:c.gold,border:`1px solid ${c.gold}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2}}>
            <Icon.check size={14} color="#241E18"/>
          </div>
          <span style={{fontFamily:_ff().ui,fontSize:12,color:c.ink200,lineHeight:1.5}}>
            Bağış tutarının %100\'ü Türk Kızılay\'a aktarılacağını ve bu bağışın bağış makbuzu olarak e-postama gönderileceğini okudum.
          </span>
        </label>
      </div>

      {/* Sticky CTA */}
      <div style={{padding:'14px 16px 24px',borderTop:`1px solid ${c.ink700}`,background:c.ink900}}>
        <button style={{width:'100%',background:c.gold,border:'none',color:'#241E18',padding:'14px 20px',borderRadius:14,fontFamily:_ff().ui,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
          Bağışı onayla · ₺250
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════ DONATION — THANKS ═════════════════════════
function DonationThanks() {
  const c = _Cf();
  return (
    <div style={{background:c.ink900,color:c.cream,minHeight:'100%',display:'flex',flexDirection:'column',height:'844px'}}>
      <div style={{flex:'1 1 auto',position:'relative',overflow:'hidden',minHeight:0,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',padding:'40px 28px 0'}}>
        {/* Background rings */}
        <svg width="500" height="500" viewBox="0 0 500 500" style={{position:'absolute',top:-60,left:'50%',transform:'translateX(-50%)',opacity:.1,pointerEvents:'none'}}>
          {[230,190,150,110,70].map(r=>(<circle key={r} cx="250" cy="250" r={r} stroke={c.gold} strokeWidth=".7" fill="none"/>))}
        </svg>

        {/* Big coin */}
        <div style={{position:'relative',marginBottom:28}}>
          <div style={{position:'absolute',inset:-24,background:'radial-gradient(circle, rgba(232,194,104,.45),transparent 70%)',filter:'blur(24px)'}}/>
          <div style={{position:'relative',width:130,height:130,borderRadius:'50%',background:'linear-gradient(135deg,#F4D98A,#B58F3D)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 18px 44px rgba(0,0,0,.4), inset 0 2px 0 rgba(255,255,255,.3)'}}>
            <div style={{position:'absolute',inset:14,borderRadius:'50%',border:'1px solid rgba(62,47,20,.4)'}}/>
            <span style={{position:'relative',fontFamily:_ff().display,fontStyle:'italic',fontWeight:600,fontSize:56,color:'#3E2F14',letterSpacing:'-0.04em'}}>i</span>
          </div>
          {/* Floating mini coins */}
          <div style={{position:'absolute',top:-10,left:-36,width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#F4D98A,#B58F3D)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 6px 14px rgba(0,0,0,.3)'}}>
            <span style={{fontFamily:_ff().display,fontStyle:'italic',fontSize:14,fontWeight:600,color:'#3E2F14'}}>i</span>
          </div>
          <div style={{position:'absolute',top:20,right:-44,width:22,height:22,borderRadius:'50%',background:'linear-gradient(135deg,#F4D98A,#B58F3D)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 10px rgba(0,0,0,.3)'}}>
            <span style={{fontFamily:_ff().display,fontStyle:'italic',fontSize:11,fontWeight:600,color:'#3E2F14'}}>i</span>
          </div>
          <div style={{position:'absolute',bottom:0,right:-30,width:18,height:18,borderRadius:'50%',background:'linear-gradient(135deg,#F4D98A,#B58F3D)',boxShadow:'0 4px 8px rgba(0,0,0,.3)'}}/>
        </div>

        <div style={{position:'relative',textAlign:'center'}}>
          <div style={{...window.IYI.typo('eyebrow'),color:c.gold,fontFamily:_ff().ui,marginBottom:10}}>BAĞIŞIN ULAŞTI</div>
          <h1 style={{margin:0,fontFamily:_ff().display,fontSize:38,fontWeight:500,letterSpacing:'-0.03em',lineHeight:1,color:c.cream}}>
            <span style={{fontStyle:'italic'}}>Teşekkürler</span>, <span style={{color:c.gold,fontStyle:'italic'}}>Ayşe</span>.
          </h1>
          <p style={{margin:'20px auto 0',fontFamily:_ff().display,fontSize:17,fontWeight:400,fontStyle:'italic',color:c.ink200,lineHeight:1.45,maxWidth:320}}>
            Bir ailenin bu kışı biraz daha sıcak geçecek — senin sayende.
          </p>
        </div>
      </div>

      {/* Karma earned card */}
      <div style={{padding:'0 20px 16px'}}>
        <div style={{background:c.ink800,border:`1px solid ${c.goldLine}`,borderRadius:16,padding:'16px 18px',display:'flex',alignItems:'center',gap:14}}>
          <KarmaDotToken size={34}/>
          <div style={{flex:1}}>
            <div style={{...window.IYI.typo('eyebrow'),color:c.ink300,fontFamily:_ff().ui}}>KARMA KAZANDIN</div>
            <div style={{display:'flex',alignItems:'baseline',gap:5,marginTop:4}}>
              <span style={{fontFamily:_ff().ui,fontSize:26,fontWeight:700,color:c.gold,letterSpacing:'-0.025em',fontVariantNumeric:'tabular-nums'}}>+125</span>
              <span style={{fontFamily:_ff().ui,fontSize:13,color:c.cream}}>Karma</span>
            </div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontFamily:_ff().ui,fontSize:11,color:c.ink300}}>Bakiye</div>
            <div style={{fontFamily:_ff().ui,fontSize:16,fontWeight:700,color:c.cream,marginTop:2,fontVariantNumeric:'tabular-nums'}}>2.465</div>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div style={{padding:'0 20px 28px',display:'flex',gap:8}}>
        <button style={{flex:1,background:'transparent',border:`1px solid ${c.ink600}`,color:c.cream,padding:'13px 16px',borderRadius:14,fontFamily:_ff().ui,fontSize:13,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
          <Icon.share size={14}/> Paylaş
        </button>
        <button style={{flex:1.6,background:c.gold,border:'none',color:'#241E18',padding:'13px 20px',borderRadius:14,fontFamily:_ff().ui,fontSize:14,fontWeight:700,cursor:'pointer'}}>
          Ana sayfa
        </button>
      </div>
    </div>
  );
}

Object.assign(window, {
  NGOProfile, MembershipPlans, MembershipSuccess,
  DonationCampaign, DonationAmount, DonationReview, DonationThanks,
});
