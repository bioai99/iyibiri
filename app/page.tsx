import Link from "next/link";

/* eslint-disable @next/next/no-img-element */

export default function LandingPage() {
  return (
    <>
      <style>{`
        .landing *{box-sizing:border-box}
        .landing a{color:inherit;text-decoration:none}
        .landing button{cursor:pointer;font-family:inherit}
        .wrap{max-width:1240px;margin:0 auto;padding:0 32px}

        /* NAV */
        nav.top{position:sticky;top:0;z-index:50;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);background:rgba(26,22,18,.72);border-bottom:1px solid rgba(232,194,104,.12)}
        nav.top .inner{display:flex;align-items:center;justify-content:space-between;height:68px}
        nav.top .links{display:flex;gap:28px;font-size:14px;color:#CEC5B2}
        nav.top .links a:hover{color:#E8C268}
        .btn-primary{background:#E8C268;color:#1A1612;border:none;height:42px;padding:0 18px;border-radius:999px;font-weight:700;font-size:14px;letter-spacing:-.01em;display:inline-flex;align-items:center;gap:8px}
        .btn-primary:hover{background:#F4D98A}
        .btn-ghost{background:transparent;color:#F4EEDF;border:1px solid rgba(232,194,104,.32);height:42px;padding:0 18px;border-radius:999px;font-weight:600;font-size:14px;display:inline-flex;align-items:center}
        .btn-ghost:hover{border-color:rgba(232,194,104,.6)}

        /* HERO */
        .hero{position:relative;padding:88px 0 120px;overflow:hidden}
        .hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 20% 20%,rgba(232,194,104,.18),transparent 55%),radial-gradient(ellipse at 85% 80%,rgba(233,207,194,.08),transparent 50%);pointer-events:none}
        .hero .grid{position:relative;display:grid;grid-template-columns:1.1fr .9fr;gap:72px;align-items:center}
        .eyebrow{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#A89E8A;font-weight:700;display:inline-flex;align-items:center;gap:10px;margin-bottom:22px}
        .eyebrow .dot{width:6px;height:6px;border-radius:999px;background:#E8C268}
        h1.display{font-family:var(--font-display),serif;font-weight:400;font-size:88px;line-height:1;letter-spacing:-.04em;margin:0 0 24px}
        h1.display em{font-style:italic;color:#E8C268}
        .lead{font-size:19px;line-height:1.55;color:#CEC5B2;max-width:520px;margin:0 0 36px}
        .cta-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
        .store-btn{display:inline-flex;align-items:center;gap:12px;background:#24201B;border:1px solid rgba(232,194,104,.2);color:#F4EEDF;height:56px;padding:0 22px;border-radius:14px;text-align:left}
        .store-btn:hover{border-color:rgba(232,194,104,.45)}
        .store-btn .sm{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#A89E8A;font-weight:600}
        .store-btn .lg{font-family:var(--font-display),serif;font-size:18px;font-weight:500;letter-spacing:-.01em;margin-top:1px}
        .hero-meta{display:flex;gap:28px;margin-top:38px;padding-top:26px;border-top:1px solid rgba(232,194,104,.14)}
        .hero-meta .m{font-size:13px;color:#A89E8A}
        .hero-meta .m b{display:block;font-family:var(--font-display),serif;font-weight:500;font-size:26px;color:#F4EEDF;letter-spacing:-.02em;margin-bottom:2px}

        /* Phone mockup */
        .phone-wrap{position:relative;display:flex;justify-content:center;align-items:center}
        .phone{width:340px;height:692px;border-radius:42px;background:#24201B;box-shadow:0 40px 80px rgba(0,0,0,.5),0 0 0 1px rgba(232,194,104,.14),inset 0 0 0 1px rgba(232,194,104,.04);padding:14px;position:relative}
        .phone::before{content:"";position:absolute;top:14px;left:50%;transform:translateX(-50%);width:96px;height:28px;border-radius:20px;background:#000;z-index:10}
        .phone-inner{width:100%;height:100%;border-radius:30px;overflow:hidden;background:#1A1612;position:relative}
        .float-token{position:absolute;filter:drop-shadow(0 12px 30px rgba(232,194,104,.3))}
        .float-token.a{top:-30px;right:-10px}
        .float-token.b{bottom:40px;left:-40px}

        /* SECTIONS */
        section.s{padding:120px 0;position:relative}
        section.s.alt{background:#24201B}
        .sec-eyebrow{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#A89E8A;font-weight:700;margin-bottom:14px}
        .sec-title{font-family:var(--font-display),serif;font-weight:400;font-size:56px;line-height:1.05;letter-spacing:-.03em;margin:0 0 18px;max-width:720px}
        .sec-title em{font-style:italic;color:#E8C268}
        .sec-lead{font-size:17px;line-height:1.55;color:#CEC5B2;max-width:600px}

        /* 3 column features */
        .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:64px}
        .feat{background:#2E2923;border:1px solid rgba(232,194,104,.1);border-radius:20px;padding:32px 28px;position:relative;overflow:hidden}
        .feat:hover{border-color:rgba(232,194,104,.25)}
        .feat .num{font-family:var(--font-display),serif;font-style:italic;font-size:13px;color:#E8C268;letter-spacing:.12em;margin-bottom:28px}
        .feat h3{font-family:var(--font-display),serif;font-weight:500;font-size:26px;line-height:1.15;letter-spacing:-.02em;margin:0 0 10px;color:#F4EEDF}
        .feat p{font-size:14px;line-height:1.6;color:#A89E8A;margin:0}

        /* How it works */
        .steps{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:64px;position:relative}
        .steps::before{content:"";position:absolute;top:28px;left:5%;right:5%;height:1px;background:linear-gradient(to right,transparent,rgba(232,194,104,.3),transparent)}
        .step{position:relative;padding:0 12px}
        .step .circle{width:56px;height:56px;border-radius:50%;background:#1A1612;border:1px solid rgba(232,194,104,.3);display:flex;align-items:center;justify-content:center;font-family:var(--font-display),serif;font-size:22px;color:#E8C268;font-weight:500;margin-bottom:20px}
        .step h4{font-family:var(--font-display),serif;font-weight:500;font-size:20px;letter-spacing:-.02em;margin:0 0 8px}
        .step p{font-size:13px;line-height:1.55;color:#A89E8A;margin:0}

        /* Stats bar */
        .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin:0;border-top:1px solid rgba(232,194,104,.14);border-bottom:1px solid rgba(232,194,104,.14);padding:40px 0}
        .stat{padding:0 24px;border-right:1px solid rgba(232,194,104,.1)}
        .stat:last-child{border-right:none}
        .stat .num{font-family:var(--font-display),serif;font-weight:500;font-size:48px;letter-spacing:-.025em;color:#F4EEDF;line-height:1}
        .stat .num em{font-style:italic;color:#E8C268;font-size:32px;margin-right:2px}
        .stat .lbl{font-size:12px;color:#A89E8A;margin-top:6px;letter-spacing:.04em}

        /* CTA final */
        .cta-final{text-align:center;padding:120px 0;background:radial-gradient(ellipse at 50% 50%,rgba(232,194,104,.14),transparent 70%)}
        .cta-final h2{font-family:var(--font-display),serif;font-weight:400;font-size:72px;line-height:1;letter-spacing:-.035em;margin:0 0 24px}
        .cta-final h2 em{font-style:italic;color:#E8C268}
        .cta-final .p{font-size:18px;color:#CEC5B2;margin:0 auto 40px;max-width:520px;line-height:1.55}
        .qr-box{display:inline-flex;align-items:center;gap:20px;background:#2E2923;border:1px solid rgba(232,194,104,.16);border-radius:20px;padding:18px 22px;margin-top:32px}
        .qr-box .qr{width:84px;height:84px;background:#F4EEDF;border-radius:10px;display:flex;align-items:center;justify-content:center;padding:8px}
        .qr-box .txt{text-align:left;max-width:200px}
        .qr-box .txt .h{font-family:var(--font-display),serif;font-size:16px;margin-bottom:2px}
        .qr-box .txt .s-txt{font-size:12px;color:#A89E8A;line-height:1.4}

        /* Footer */
        footer.landing-footer{padding:60px 0 40px;border-top:1px solid rgba(232,194,104,.1);background:#1A1612}
        footer.landing-footer .g{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:40px}
        footer.landing-footer h5{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#A89E8A;margin:0 0 16px;font-weight:700}
        footer.landing-footer ul{list-style:none;padding:0;margin:0}
        footer.landing-footer li{font-size:14px;color:#CEC5B2;margin-bottom:10px}
        footer.landing-footer li a:hover{color:#E8C268}
        .copy{margin-top:48px;padding-top:24px;border-top:1px solid rgba(232,194,104,.08);display:flex;justify-content:space-between;font-size:12px;color:#7A6F5E}

        @media (max-width:960px){
          .hero .grid{grid-template-columns:1fr;gap:48px}
          h1.display{font-size:58px}
          .feat-grid{grid-template-columns:1fr}
          .steps{grid-template-columns:1fr 1fr;gap:32px 8px}
          .stats{grid-template-columns:1fr 1fr}
          footer.landing-footer .g{grid-template-columns:1fr 1fr}
          .cta-final h2{font-size:48px}
          .hero-meta{flex-wrap:wrap}
          .copy{flex-direction:column;gap:8px;align-items:center;text-align:center}
        }

        @media (max-width:600px){
          h1.display{font-size:44px}
          .sec-title{font-size:38px}
          .cta-final h2{font-size:38px}
          .steps{grid-template-columns:1fr}
          .stats{grid-template-columns:1fr}
          .stat{padding:12px 0;border-right:none;border-bottom:1px solid rgba(232,194,104,.1)}
          .stat:last-child{border-bottom:none}
          nav.top .links{display:none}
          .phone{width:280px;height:572px;border-radius:36px}
          .phone::before{width:76px;height:22px}
          footer.landing-footer .g{grid-template-columns:1fr}
        }
      `}</style>

      <div className="landing" style={{ margin: 0, padding: 0, background: "#1A1612", color: "#F4EEDF", fontFamily: "var(--font-sans), system-ui, sans-serif", WebkitFontSmoothing: "antialiased" }}>

        {/* ── NAV ── */}
        <nav className="top">
          <div className="wrap inner">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="32" height="32" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="32" fill="#24201B" />
                <circle cx="32" cy="32" r="28.5" fill="none" stroke="#E8C268" strokeWidth="1.2" strokeOpacity=".7" />
                <g transform="translate(32,32)">
                  <rect x="-3" y="-4" width="6" height="18" rx="1" fill="#F4EEDF" />
                  <rect x="-7" y="13" width="14" height="2.4" rx="1" fill="#F4EEDF" />
                  <circle cx="0" cy="-11" r="4.2" fill="#E8C268" />
                </g>
              </svg>
              <span style={{ fontFamily: "var(--font-display), serif", fontSize: 22, fontWeight: 500, letterSpacing: "-.02em" }}>
                İyi<em style={{ fontStyle: "italic", color: "#E8C268" }}>Biri</em>
              </span>
            </div>
            <div className="links">
              <a href="#ne-yapiyoruz">Ne yapıyoruz</a>
              <a href="#nasil">Nasıl çalışır</a>
              <a href="#stklar">STK&apos;lar</a>
              <a href="#manifesto">Manifesto</a>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Link href="/auth/login" className="btn-ghost">Giriş</Link>
              <Link href="/auth/signup" className="btn-primary">
                Uygulamayı İndir
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="wrap grid">
            <div>
              <div className="eyebrow"><span className="dot" />{" "}Türkiye&apos;nin iyilik platformu &middot; Yeni</div>
              <h1 className="display">
                <em>İyilik</em><br />
                biriktirilir.
              </h1>
              <p className="lead">
                Mahallendeki STK&apos;lara gönüllü ol, adım adım gerçek görevler tamamla, Karma biriktir. Kampanyalara bağış yerine zaman ver — ödülünü gerçek ortaklarda kullan.
              </p>
              <div className="cta-row">
                <Link className="store-btn" href="/auth/login">
                  <svg width="22" height="26" viewBox="0 0 24 28" fill="#F4EEDF">
                    <path d="M17.05 20.28c-.98.95-2.05.86-3.08.4-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25" />
                  </svg>
                  <div><div className="sm">Edin</div><div className="lg">App Store</div></div>
                </Link>
                <Link className="store-btn" href="/auth/login">
                  <svg width="22" height="24" viewBox="0 0 24 26" fill="#F4EEDF">
                    <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893 2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198 2.807 1.626c.615.354.615 1.235 0 1.59l-2.808 1.626L15.212 12l2.486-2.491zM5.864 2.658 16.802 8.99l-2.302 2.302-8.636-8.635z" />
                  </svg>
                  <div><div className="sm">Edin</div><div className="lg">Google Play</div></div>
                </Link>
              </div>
              <div className="hero-meta">
                <div className="m"><b>240+</b> partner STK</div>
                <div className="m"><b>18K</b> aktif gönüllü</div>
                <div className="m"><b>4.9★</b> kullanıcı puanı</div>
              </div>
            </div>

            <div className="phone-wrap">
              <svg className="float-token a" width="72" height="72" viewBox="0 0 64 64">
                <defs>
                  <radialGradient id="ft1" cx="40%" cy="36%" r="70%">
                    <stop offset="0%" stopColor="#F4D98A" />
                    <stop offset="55%" stopColor="#E8C268" />
                    <stop offset="100%" stopColor="#B58F3D" />
                  </radialGradient>
                </defs>
                <circle cx="32" cy="32" r="30" fill="url(#ft1)" />
                <circle cx="32" cy="32" r="22" fill="none" stroke="#8A6A2C" strokeOpacity=".4" strokeWidth="0.6" />
                <g transform="translate(32,32)">
                  <circle cx="0" cy="-9" r="2.4" fill="#3E2F14" />
                  <path d="M-3 -3 L-3 12 L3 12 L3 -3 Z" fill="#3E2F14" />
                  <path d="M-6 12 L6 12 L6 10 L-6 10 Z" fill="#3E2F14" />
                </g>
              </svg>

              <div className="phone">
                <div className="phone-inner">
                  {/* Simplified hi-fi screenshot of home */}
                  <div style={{ padding: "50px 18px 0" }}>
                    <div style={{ fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "#7A6F5E", fontWeight: 700 }}>Cumartesi &middot; 18 Nisan</div>
                    <div style={{ fontFamily: "var(--font-display), serif", fontSize: 22, marginTop: 4, color: "#F4EEDF" }}>
                      Günaydın, <em style={{ color: "#E8C268", fontStyle: "italic" }}>Deniz</em>.
                    </div>
                  </div>
                  {/* Karma card */}
                  <div style={{ margin: "18px 16px 0", background: "#2E2923", border: "1px solid rgba(232,194,104,.14)", borderRadius: 20, padding: 18 }}>
                    <div style={{ fontSize: 9, letterSpacing: ".2em", color: "#A89E8A", fontWeight: 700, textTransform: "uppercase" }}>Biriktirdiğin</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                      <div style={{ fontFamily: "var(--font-display), serif", fontWeight: 500, fontSize: 52, color: "#F4EEDF", letterSpacing: "-.035em", lineHeight: ".95" }}>1.284</div>
                      <svg width="22" height="22" viewBox="0 0 64 64">
                        <defs>
                          <radialGradient id="ftx" cx="40%" cy="36%" r="70%">
                            <stop offset="0%" stopColor="#F4D98A" />
                            <stop offset="100%" stopColor="#B58F3D" />
                          </radialGradient>
                        </defs>
                        <circle cx="32" cy="32" r="30" fill="url(#ftx)" />
                      </svg>
                    </div>
                    <div style={{ fontSize: 11, color: "#A89E8A", marginTop: 6, lineHeight: "1.45" }}>
                      <em style={{ fontFamily: "var(--font-display), serif", color: "#E8C268", fontStyle: "italic" }}>Çok İyi Biri</em> seviyesindesin.
                    </div>
                    <div style={{ height: 3, background: "rgba(232,194,104,.14)", borderRadius: 999, marginTop: 14, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: "58%", background: "#E8C268", borderRadius: 999 }} />
                    </div>
                  </div>
                  {/* Mission card */}
                  <div style={{ margin: "12px 16px", background: "#2E2923", border: "1px solid rgba(232,194,104,.1)", borderRadius: 18, overflow: "hidden" }}>
                    <div style={{ height: 92, background: "linear-gradient(135deg,#C8553D,#8a3a27)", display: "flex", alignItems: "flex-end", padding: "10px 12px", color: "#F4EEDF", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700 }}>Bu hafta</div>
                    <div style={{ padding: "14px 14px 16px" }}>
                      <div style={{ fontFamily: "var(--font-display), serif", fontSize: 16, color: "#F4EEDF", lineHeight: "1.25" }}>Kadıköy&apos;de kitap toplama ve paketleme</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        <div style={{ fontSize: 11, color: "#A89E8A" }}>Cts &middot; 10:00 &middot; 3s</div>
                        <div style={{ background: "rgba(232,194,104,.14)", color: "#E8C268", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999 }}>+150</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ margin: "0 16px 16px", background: "#2E2923", border: "1px solid rgba(232,194,104,.08)", borderRadius: 18, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: "#A89E8A" }}>Yakınında yeni</div>
                    <div style={{ fontFamily: "var(--font-display), serif", fontSize: 14, color: "#F4EEDF", marginTop: 2 }}>Sahipsiz hayvan mama dağıtımı</div>
                  </div>
                </div>
              </div>

              <svg className="float-token b" width="56" height="56" viewBox="0 0 64 64">
                <defs>
                  <radialGradient id="ft2" cx="40%" cy="36%" r="70%">
                    <stop offset="0%" stopColor="#F4D98A" />
                    <stop offset="55%" stopColor="#E8C268" />
                    <stop offset="100%" stopColor="#B58F3D" />
                  </radialGradient>
                </defs>
                <circle cx="32" cy="32" r="30" fill="url(#ft2)" />
              </svg>
            </div>
          </div>
        </section>

        {/* ── WHAT IS IT (Features) ── */}
        <section className="s" id="ne-yapiyoruz">
          <div className="wrap">
            <div className="sec-eyebrow">Ne yapıyoruz</div>
            <h2 className="sec-title">İyilik <em>soyut</em> bir şey değil. Bir görev. Bir saat. Bir adım.</h2>
            <p className="sec-lead">Gönüllülük dijitalleşiyor ama dağınık. STK&apos;lar e-posta atıyor, insanlar Instagram story&apos;de kayboluyor. İyiBiri, bu ikisini tek bir yerde, ölçülebilir ve ödüllendirilebilir bir sistemde buluşturuyor.</p>

            <div className="feat-grid">
              <div className="feat">
                <div className="num">I.</div>
                <h3>Yakınında gerçek görevler</h3>
                <p>Mesafe, tarih, süre ve STK filtresiyle sana uygun olanı bul. Kitap paketle, fidan dik, çocuklarla okuma atölyesi yap.</p>
              </div>
              <div className="feat">
                <div className="num">II.</div>
                <h3>Karma biriktir</h3>
                <p>Her tamamlanan görev somut Karma kazandırır. STK&apos;nın doğruladığı ve blockchain&apos;de kayıtlı, manipüle edilemez bir itibar puanı.</p>
              </div>
              <div className="feat">
                <div className="num">III.</div>
                <h3>Gerçek ödüller</h3>
                <p>Karma&apos;nı partner kafelerde, kitapçılarda, etkinliklerde kullan. İyilik cüzdanı — indirim değil, teşekkür.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="s alt" id="nasil">
          <div className="wrap">
            <div className="sec-eyebrow">Nasıl çalışır</div>
            <h2 className="sec-title">Dört adım. <em>Birkaç dakika.</em></h2>

            <div className="steps">
              <div className="step">
                <div className="circle">01</div>
                <h4>Hesap aç</h4>
                <p>Apple, Google veya e-posta ile 30 saniyede. İlgilendiğin 3 alanı seç.</p>
              </div>
              <div className="step">
                <div className="circle">02</div>
                <h4>Görev bul</h4>
                <p>Haritada yakınını, listede bu haftayı gör. Tek dokunuşla başvur.</p>
              </div>
              <div className="step">
                <div className="circle">03</div>
                <h4>Gerçekleştir</h4>
                <p>STK koordinatörü check-in yapar. Sen sadece gelip yapıyorsun.</p>
              </div>
              <div className="step">
                <div className="circle">04</div>
                <h4>Karma al</h4>
                <p>Görev bitince itibarın büyür. Ödüller cüzdanına düşer.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="s" style={{ padding: "60px 0" }}>
          <div className="wrap">
            <div className="stats">
              <div className="stat">
                <div className="num"><em>+</em>18K</div>
                <div className="lbl">Aktif gönüllü</div>
              </div>
              <div className="stat">
                <div className="num"><em>+</em>240</div>
                <div className="lbl">Partner STK</div>
              </div>
              <div className="stat">
                <div className="num">62K</div>
                <div className="lbl">Tamamlanan görev</div>
              </div>
              <div className="stat">
                <div className="num">81</div>
                <div className="lbl">Şehir</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="cta-final">
          <div className="wrap">
            <h2><em>İyilik</em> biriktirmeye<br />başla.</h2>
            <p className="p">Uygulamayı indir, 30 saniyede hesap aç — mahallendeki ilk görevini bu hafta seç.</p>
            <div className="cta-row" style={{ justifyContent: "center" }}>
              <Link className="store-btn" href="/auth/login">
                <svg width="22" height="26" viewBox="0 0 24 28" fill="#F4EEDF">
                  <path d="M17.05 20.28c-.98.95-2.05.86-3.08.4-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25" />
                </svg>
                <div><div className="sm">Edin</div><div className="lg">App Store</div></div>
              </Link>
              <Link className="store-btn" href="/auth/login">
                <svg width="22" height="24" viewBox="0 0 24 26" fill="#F4EEDF">
                  <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893 2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198 2.807 1.626c.615.354.615 1.235 0 1.59l-2.808 1.626L15.212 12l2.486-2.491zM5.864 2.658 16.802 8.99l-2.302 2.302-8.636-8.635z" />
                </svg>
                <div><div className="sm">Edin</div><div className="lg">Google Play</div></div>
              </Link>
            </div>
            <div className="qr-box">
              <div className="qr">
                <svg viewBox="0 0 68 68" width="68" height="68">
                  <rect x="0" y="0" width="68" height="68" fill="#F4EEDF" />
                  <g fill="#1A1612">
                    <rect x="4" y="4" width="16" height="16" /><rect x="8" y="8" width="8" height="8" fill="#F4EEDF" />
                    <rect x="48" y="4" width="16" height="16" /><rect x="52" y="8" width="8" height="8" fill="#F4EEDF" />
                    <rect x="4" y="48" width="16" height="16" /><rect x="8" y="52" width="8" height="8" fill="#F4EEDF" />
                    <rect x="26" y="6" width="4" height="4" /><rect x="34" y="6" width="4" height="4" /><rect x="28" y="14" width="4" height="4" /><rect x="36" y="14" width="4" height="4" /><rect x="44" y="24" width="4" height="4" />
                    <rect x="26" y="22" width="4" height="4" /><rect x="34" y="22" width="4" height="4" /><rect x="42" y="30" width="4" height="4" /><rect x="50" y="30" width="4" height="4" />
                    <rect x="26" y="30" width="4" height="4" /><rect x="34" y="38" width="4" height="4" /><rect x="42" y="46" width="4" height="4" /><rect x="26" y="46" width="4" height="4" />
                    <rect x="34" y="54" width="4" height="4" /><rect x="42" y="54" width="4" height="4" /><rect x="50" y="46" width="4" height="4" /><rect x="50" y="54" width="4" height="4" />
                    <rect x="58" y="28" width="4" height="4" /><rect x="58" y="36" width="4" height="4" /><rect x="58" y="44" width="4" height="4" />
                  </g>
                </svg>
              </div>
              <div className="txt">
                <div className="h">Telefonla okut</div>
                <div className="s-txt">QR&apos;ı telefon kameranla tara — mağazaya git.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="landing-footer">
          <div className="wrap">
            <div className="g">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <svg width="28" height="28" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="32" fill="#24201B" />
                    <circle cx="32" cy="32" r="28.5" fill="none" stroke="#E8C268" strokeWidth="1.2" strokeOpacity=".7" />
                    <g transform="translate(32,32)">
                      <rect x="-3" y="-4" width="6" height="18" rx="1" fill="#F4EEDF" />
                      <rect x="-7" y="13" width="14" height="2.4" rx="1" fill="#F4EEDF" />
                      <circle cx="0" cy="-11" r="4.2" fill="#E8C268" />
                    </g>
                  </svg>
                  <span style={{ fontFamily: "var(--font-display), serif", fontSize: 20 }}>
                    İyi<em style={{ fontStyle: "italic", color: "#E8C268" }}>Biri</em>
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#A89E8A", lineHeight: "1.6", maxWidth: 280 }}>Türkiye&apos;nin iyilik cüzdanı. Zaman ver, Karma biriktir.</p>
              </div>
              <div>
                <h5>Ürün</h5>
                <ul>
                  <li><a href="#">Uygulamayı indir</a></li>
                  <li><a href="#nasil">Nasıl çalışır</a></li>
                  <li><a href="#stklar">STK&apos;lar</a></li>
                  <li><a href="#">Ödüller</a></li>
                </ul>
              </div>
              <div>
                <h5>Kurum</h5>
                <ul>
                  <li><a href="#">Hakkımızda</a></li>
                  <li><a href="#manifesto">Manifesto</a></li>
                  <li><a href="#">Basın</a></li>
                  <li><a href="#">İletişim</a></li>
                </ul>
              </div>
              <div>
                <h5>STK&apos;lar için</h5>
                <ul>
                  <li><a href="#">Partner ol</a></li>
                  <li><a href="#">Panel</a></li>
                  <li><a href="#">Dokümanlar</a></li>
                  <li><a href="#">SSS</a></li>
                </ul>
              </div>
            </div>
            <div className="copy">
              <div>&copy; 2026 İyiBiri &middot; Karma Teknoloji A.Ş.</div>
              <div>KVKK &middot; Kullanım &middot; Çerezler</div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
