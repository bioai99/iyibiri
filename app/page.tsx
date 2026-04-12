import Link from "next/link";
import WaitlistForm from "@/components/waitlist-form";
import Logo from "@/components/logo";

/* ─────────────────────────── DATA ─────────────────────────── */

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "🎯",
    title: "Görev Seç",
    desc: "İyilik Öncülerimizin oluşturduğu görevlerden sana özel önerilenlerden birini seç.",
  },
  {
    step: "02",
    icon: "✅",
    title: "Tamamla & Doğrula",
    desc: "Görevi gerçekleştir, fotoğraf veya katılım koduyla doğrula.",
  },
  {
    step: "03",
    icon: "⚡",
    title: "Karma Kazan",
    desc: "Her tamamlanan görev Karma getirir. Karma biriktikçe unvanın yükselir.",
  },
  {
    step: "04",
    icon: "🎁",
    title: "Ödül Al",
    desc: "Birikmiş Karmanla Sponsor Markalardan gerçek indirim ve hediye kodları kazan.",
  },
];

const DOMAINS = [
  {
    emoji: "🌿",
    title: "Doğa & Çevre",
    partner: "TEMA Vakfı",
    desc: "Ağaç dikimi, geri dönüşüm ve temizlik etkinlikleri.",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-600 text-white",
    logo: "https://www.tema.org.tr/Content/Icons/tema-logo.png",
  },
  {
    emoji: "📚",
    title: "Eğitim & Gençlik",
    partner: "TOG",
    desc: "Mentorluk, burs desteği ve toplum gönüllülüğü.",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-600 text-white",
    logo: "https://www.tog.org.tr/images/marka/tog-logo.svg",
  },
  {
    emoji: "❤️",
    title: "Finansal Destek",
    partner: "ÇYDD",
    desc: "Bağış kampanyaları, gıda bankası ve maddi destek.",
    color: "bg-rose-50 border-rose-200",
    badge: "bg-rose-600 text-white",
    logo: "https://www.cydd.org.tr/store/file/files/CYDD_Logo_Mavi_PNG.png",
  },
  {
    emoji: "🐾",
    title: "Hayvan Hakları",
    partner: "Haytap",
    desc: "Mama desteği, barınak gönüllülüğü ve sahiplendirme.",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-600 text-white",
    logo: "https://www.haytap.org/images/logo.png",
  },
];

const STATS = [
  { value: "40+",    label: "Aktif Görev"          },
  { value: "4",      label: "İyilik Öncüsü Ortak"  },
  { value: "1.200+", label: "Erken Kullanıcı"       },
];

interface LogoItem {
  name: string;
  img?: string;
  svg?: React.ReactNode;
  bg: string;
}

const NGO_LOGOS: LogoItem[] = [
  { name: "TEMA",   img: "https://www.tema.org.tr/Content/Icons/tema-logo.png",                bg: "bg-white" },
  { name: "TOG",    img: "https://www.tog.org.tr/images/marka/tog-logo.svg",                  bg: "bg-white" },
  { name: "ÇYDD",   img: "https://www.cydd.org.tr/store/file/files/CYDD_Logo_Mavi_PNG.png",   bg: "bg-white" },
  { name: "Haytap", img: "https://www.haytap.org/images/logo.png",                            bg: "bg-white" },
];

const BRAND_LOGOS: LogoItem[] = [
  { name: "Migros", img: "https://upload.wikimedia.org/wikipedia/commons/0/07/MiGROS_Logo.svg", bg: "bg-white" },
  {
    name: "Starbucks",
    img: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png",
    bg: "bg-white",
  },
  { name: "Trendyol",     img: "/trendyol-logo.svg",     bg: "bg-white" },
  {
    name: "Nike",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png",
    bg: "bg-white",
  },
  { name: "Garanti BBVA", img: "/garanti-bbva-logo.svg", bg: "bg-white" },
];

const KARMA_HOW = [
  { icon: "🎯", label: "Görev tamamla",       karma: "+50 – 500 Karma" },
  { icon: "🔥", label: "Günlük seri koru",    karma: "+10 Karma/gün"   },
  { icon: "👥", label: "Arkadaşını davet et", karma: "+100 Karma"      },
  { icon: "⭐", label: "İlk görevini yap",    karma: "+50 Karma bonus" },
];

const TIERS = [
  { name: "İyi Biri",             karma: "0+"      },
  { name: "Çok İyi Biri",         karma: "1.000+"  },
  { name: "Çoook İyi Biri",       karma: "5.000+"  },
  { name: "İyiliğin Öncüsü",      karma: "20.000+" },
];

const TESTIMONIALS = [
  {
    quote: "\"Hem iyilik yapıyorum hem Karma kazanıyorum — motivasyonum gerçekten ikiye katlandı. TEMA görevi çok keyifliydi!\"",
    name: "Zeynep A.",
    role: "Beta Kullanıcısı · İstanbul",
    emoji: "🌟",
  },
  {
    quote: "\"TOG mentorluk görevinden 250 Karma kazandım, Starbucks kodum geldi. Böyle bir döngüyü hayal bile etmezdim.\"",
    name: "Berk T.",
    role: "Beta Kullanıcısı · Ankara",
    emoji: "🎯",
  },
];

/* ─────────────────────── SUB-COMPONENTS ─────────────────────── */

function AppMockup() {
  return (
    <div className="relative w-full max-w-[380px] mx-auto select-none pointer-events-none">
      {/* Phone shell */}
      <div className="bg-[#F5F5F7] rounded-[2.5rem] p-3 shadow-2xl border border-gray-200">
        {/* Screen */}
        <div className="bg-white rounded-[2rem] overflow-hidden" style={{ minHeight: 520 }}>
          {/* Status bar */}
          <div className="bg-[#1B3A5C] px-5 pt-4 pb-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/60 text-[10px]">Hoş geldin</p>
                <p className="text-white font-bold text-sm">Ada ✦</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-400 rounded-xl px-3 py-1.5">
                <span className="text-amber-900 text-[10px] font-bold flex items-center gap-1"><KarmaToken size={12} /> 2.340 Karma</span>
              </div>
            </div>
            {/* Karma bar */}
            <div className="bg-white/10 rounded-2xl p-3">
              <div className="flex justify-between text-[10px] text-white/70 mb-1.5">
                <span className="font-bold text-white">Çok İyi Biri</span>
                <span>2.340 / 3.000</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-[78%] bg-amber-400 rounded-full" />
              </div>
              <p className="text-[9px] text-white/50 mt-1">660 Karma → Gerçekten İyi Biri</p>
            </div>
          </div>

          {/* Mission cards */}
          <div className="px-4 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-800">Öne Çıkan Görevler</p>
              <span className="text-[10px] text-amber-600 font-semibold">Tümü →</span>
            </div>

            {/* Mission card 1 */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">🌿 Doğa & Çevre</span>
                <span className="text-[10px] text-gray-400">TEMA</span>
              </div>
              <p className="text-xs font-bold text-gray-900 leading-snug">Sahil temizliği etkinliğine katıl</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-500">2 saat · 42 katılımcı</span>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">+150 Karma</span>
              </div>
            </div>

            {/* Mission card 2 */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">📚 Eğitim</span>
                <span className="text-[10px] text-gray-400">TOG</span>
              </div>
              <p className="text-xs font-bold text-gray-900 leading-snug">İlkokul öğrencisine okuma desteği</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-500">1 saat/hafta · Online</span>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">+250 Karma</span>
              </div>
            </div>

            {/* Reward teaser */}
            <div className="bg-[#1B3A5C]/5 border border-[#1B3A5C]/10 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-lg flex-shrink-0">☕</div>
              <div className="flex-1">
                <p className="text-[10px] text-gray-500">Bir sonraki ödülün</p>
                <p className="text-xs font-bold text-gray-900">Starbucks %20 indirim</p>
              </div>
              <div>
                <p className="text-[10px] text-amber-600 font-bold">660 Karma</p>
                <p className="text-[9px] text-gray-400">kaldı</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification */}
      <div className="absolute -top-3 -right-6 bg-amber-400 text-amber-900 rounded-2xl px-4 py-2.5 shadow-xl">
        <p className="text-[10px] font-semibold opacity-70">Az önce</p>
        <p className="text-sm font-bold leading-tight flex items-center gap-1">+150 Karma <KarmaToken size={14} /></p>
      </div>
    </div>
  );
}

function MarqueeRow({ items, label }: { items: LogoItem[]; label: string }) {
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div>
      <p className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">{label}</p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex animate-marquee gap-5 w-max">
          {doubled.map(({ name, img, svg, bg }, i) => (
            <div
              key={i}
              className={`flex items-center justify-center h-[68px] px-6 rounded-2xl border border-gray-100 shadow-sm grayscale hover:grayscale-0 transition-all duration-300 cursor-default flex-shrink-0 ${bg}`}
              style={{ minWidth: "130px" }}
              title={name}
            >
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt={name} className="max-h-10 max-w-[110px] object-contain" />
              ) : (
                <div className="flex items-center justify-center">{svg}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── CUSTOM ICONS & COMPONENTS ─────────────── */

function KarmaSymbol({ size = 48 }: { size?: number }) {
  // Konsept: Altın sikke (karma = değer) + kalp (iyilik) + küçük dönüş oku (geri gelir)
  // Witty mesaj: "Attığın iyilik geri döner" → boomerang/return metaforu
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <radialGradient id="karmaGrad" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#FDE68A"/>
          <stop offset="55%" stopColor="#F59E0B"/>
          <stop offset="100%" stopColor="#B45309"/>
        </radialGradient>
      </defs>
      {/* Altın sikke */}
      <circle cx="32" cy="32" r="30" fill="url(#karmaGrad)"/>
      <circle cx="32" cy="32" r="25" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none"/>
      {/* Kalp */}
      <path d="M 32 46 C 12 34 12 14 23 14 C 27 14 30 17 32 21 C 34 17 37 14 41 14 C 52 14 52 34 32 46 Z" fill="white"/>
      {/* Küçük dönüş oku — "iyilik geri döner" */}
      <path d="M 46 10 A 6.5 6.5 0 1 0 52.5 16.5" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M 49 10 L 53 15.5 L 47.5 17.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function KarmaHowIcon({ index }: { index: number }) {
  const wrap = "w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0";
  if (index === 0) return (
    <div className={wrap}>
      <svg viewBox="0 0 22 22" className="w-5 h-5" fill="none">
        <circle cx="11" cy="11" r="9" stroke="#F59E0B" strokeWidth="1.8"/>
        <path d="M 7 11 L 10 14 L 15 8" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
  if (index === 1) return (
    <div className={wrap}>
      <svg viewBox="0 0 22 22" className="w-5 h-5" fill="none">
        <path d="M 11 2 C 9 5 7 7.5 7 10.5 C 7 13.5 8.7 15.5 11 15.5 C 13.3 15.5 15 13.5 15 10.5 C 15 8.5 14 6.5 12.5 5 C 12.5 7.5 11.5 8.5 11 9.5 C 11 7 11.5 4.5 11 2 Z" fill="#F59E0B"/>
        <ellipse cx="11" cy="17" rx="4" ry="2" fill="#FDE68A"/>
      </svg>
    </div>
  );
  if (index === 2) return (
    <div className={wrap}>
      <svg viewBox="0 0 22 22" className="w-5 h-5" fill="none">
        <circle cx="8" cy="7" r="3.5" stroke="#F59E0B" strokeWidth="1.8"/>
        <path d="M 2 19 C 2 15.5 4.7 13 8 13" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M 15 13 V 19 M 12 16 H 18" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    </div>
  );
  return (
    <div className={wrap}>
      <svg viewBox="0 0 22 22" className="w-5 h-5" fill="#F59E0B">
        <path d="M 11 2 L 13.2 8.2 L 20 8.2 L 14.5 12.2 L 16.8 18.5 L 11 14.8 L 5.2 18.5 L 7.5 12.2 L 2 8.2 L 8.8 8.2 Z"/>
      </svg>
    </div>
  );
}

function StepIcon({ step }: { step: string }) {
  if (step === "01") return (
    <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <circle cx="20" cy="20" r="14" stroke="#F59E0B" strokeWidth="2.5"/>
        <circle cx="20" cy="20" r="8.5" stroke="#F59E0B" strokeWidth="2.5"/>
        <circle cx="20" cy="20" r="3" fill="#F59E0B"/>
        <line x1="27" y1="9" x2="22" y2="16" stroke="#1B3A5C" strokeWidth="2" strokeLinecap="round"/>
        <path d="M 24 7 L 29 10 L 26.5 15" stroke="#1B3A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    </div>
  );
  if (step === "02") return (
    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <path d="M 20 5 L 33 10 L 33 22 C 33 30 27 35 20 37 C 13 35 7 30 7 22 L 7 10 Z" fill="#DBEAFE" stroke="#1B3A5C" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M 13.5 21 L 18 25.5 L 26.5 15" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
  if (step === "03") return (
    <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <circle cx="20" cy="20" r="14" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
        <path d="M 20 8 A 12 12 0 1 1 32 20" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M 27 14 L 33 20 L 26.5 24" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M 23 13 L 17 23 H 21.5 L 18 28 L 25 18 H 20.5 Z" fill="#F59E0B"/>
      </svg>
    </div>
  );
  return (
    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <rect x="9" y="19" width="22" height="14" rx="2" fill="#D1FAE5" stroke="#059669" strokeWidth="2"/>
        <rect x="7" y="14" width="26" height="7" rx="2" fill="#D1FAE5" stroke="#059669" strokeWidth="2"/>
        <line x1="20" y1="14" x2="20" y2="33" stroke="#059669" strokeWidth="2"/>
        <path d="M 20 14 C 18 11 14 10 13 12.5 C 12 15 16 14 20 14" fill="#A7F3D0" stroke="#059669" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M 20 14 C 22 11 26 10 27 12.5 C 28 15 24 14 20 14" fill="#A7F3D0" stroke="#059669" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// Küçük inline kullanım için — metin içinde ⚡ yerine
function KarmaToken({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
    >
      <circle cx="8" cy="8" r="7.5" fill="#F59E0B"/>
      <path d="M 8 12 C 3 9 3 5 5.5 4 C 6.2 3.7 7 4.2 8 5.5 C 9 4.2 9.8 3.7 10.5 4 C 13 5 13 9 8 12 Z" fill="white"/>
    </svg>
  );
}

function TierTrack() {
  const tiers = [
    { name: "İyi Biri",        karma: "0+",      state: "done"   },
    { name: "Çok İyi Biri",    karma: "1.000+",  state: "active" },
    { name: "Çoook İyi Biri",  karma: "5.000+",  state: "next"   },
    { name: "İyiliğin Öncüsü", karma: "20.000+", state: "next"   },
  ];
  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Seviye Skalası</p>
      <div className="relative">
        <div className="hidden sm:block absolute top-[15px] left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-amber-300 via-amber-200 to-gray-200 rounded-full" />
        <div className="flex items-start">
          {tiers.map(({ name, karma, state }, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 border-2 transition-all ${
                state === "active"
                  ? "bg-amber-400 border-amber-400 text-white shadow-lg shadow-amber-200 ring-4 ring-amber-100"
                  : state === "done"
                    ? "bg-amber-100 border-amber-300 text-amber-600"
                    : "bg-white border-gray-200 text-gray-300"
              }`}>
                {i + 1}
              </div>
              <div className="text-center px-1">
                <p className={`text-[11px] font-bold leading-tight ${
                  state === "active" ? "text-amber-700" : state === "done" ? "text-gray-600" : "text-gray-400"
                }`}>{name}</p>
                <p className={`text-[10px] mt-0.5 font-medium ${
                  state === "active" ? "text-amber-500" : "text-gray-400"
                }`}>{karma} <KarmaToken size={10} /></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── PAGE ─────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">

      {/* ── Duyuru bandı (Yakında Geliyor) ── */}
      <div className="bg-[#1B3A5C] text-white py-2.5 px-6 text-center">
        <p className="text-xs font-medium">
          <span className="font-bold text-amber-400">İyiBiri erken erişime açılıyor.</span>
          {" "}Listeye katıl, ilk kullananlar arasında ol ve özel Karma bonusu kazan.{" "}
          <a href="#waitlist" className="underline text-amber-300 font-semibold hover:text-amber-200 transition-colors">
            Katıl →
          </a>
        </p>
      </div>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" variant="full" />
          <nav className="hidden md:flex items-center gap-8">
            <a href="#nasil-calisir" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Nasıl Çalışır?</a>
            <a href="#karma" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Karma</a>
            <a href="#iyilik-oncüleri" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">İyilik Öncüleri</a>
            <a href="#odüller" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Ödüller</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#erisim" className="text-sm font-bold bg-[#1B3A5C] text-white px-5 py-2.5 rounded-xl hover:bg-[#1B3A5C]/90 transition-colors">Erken Erişime Katıl</a>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section id="erisim" className="px-6 pt-16 pb-24 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Sol */}
            <div className="flex flex-col gap-7">
              <h1 className="text-5xl sm:text-6xl lg:text-[62px] font-bold text-[#1B3A5C] leading-[1.08] tracking-tight">
                İyilik yapmak<br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#F4B942 0%,#E8901A 100%)" }}>
                  hiç bu kadar
                </span><br />
                eğlenceli olmamıştı.
              </h1>

              <p className="text-lg text-gray-500 leading-relaxed max-w-md">
                İyilik Öncüleri'nin görevlerini tamamla, <strong className="text-[#1B3A5C]">Karma</strong> kazan,
                unvanını yükselt — her iyilik seni gerçek ödüllere bir adım daha yaklaştırır.
              </p>

              <div className="flex flex-col gap-3 max-w-md">
                <WaitlistForm />
                <p className="text-xs text-gray-400 pl-1">Spam yok. İstediğin zaman çıkabilirsin.</p>
              </div>

              {/* İyilik Öncüleri — gerçek logolar */}
              <div>
                <p className="text-xs text-gray-400 font-medium mb-3">İyilik Öncülerimiz:</p>
                <div className="flex flex-wrap gap-3">
                  {NGO_LOGOS.map(({ name, img }) => (
                    <div
                      key={name}
                      className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex items-center justify-center shadow-sm h-12 cursor-default transition-all duration-200 hover:scale-105 hover:shadow-md hover:border-amber-200 active:scale-95"
                      style={{ minWidth: 100 }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={name} className="max-h-6 max-w-[80px] object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sağ — büyük uygulama mockup */}
            <div className="flex items-center justify-center py-6 lg:py-0">
              <AppMockup />
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className="bg-[#1B3A5C] py-12 px-6">
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                <span className="text-3xl sm:text-4xl font-bold text-white">{value}</span>
                <span className="text-xs sm:text-sm text-white/60 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Partner marquees ── */}
        <section className="py-14 bg-gray-50 flex flex-col gap-10">
          <div className="max-w-6xl mx-auto w-full px-6 text-center">
            <h2 className="text-2xl font-bold text-[#1B3A5C] mb-1">Güvenilir ortaklarla büyüyoruz</h2>
            <p className="text-sm text-gray-400">İyilik Öncülerimiz görevleri oluşturur, Sponsor Markalarımız ödülleri sağlar.</p>
          </div>
          <div className="flex flex-col gap-6">
            <MarqueeRow items={NGO_LOGOS}   label="İyilik Öncüleri" />
            <MarqueeRow items={BRAND_LOGOS} label="Sponsor Markalar" />
          </div>
        </section>

        {/* ── Karma nedir? ── */}
        <section id="karma" className="px-6 py-24 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <KarmaSymbol size={28} />
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">Karma nedir?</p>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-[#1B3A5C] leading-tight mb-4">
                  İyiliğin sana<br />geri dönen hali.
                </h2>
                <p className="text-gray-500 leading-relaxed text-lg">
                  Karma, İyiBiri'de iyilik yaparak kazandığın puandır. Her tamamlanan görev, her
                  katkın hesabına Karma olarak yansır. Karma biriktikçe seviyeni yükseltir,
                  yeni görevler açılır ve Sponsor Markalardan gerçek ödüller kazanırsın.
                </p>
              </div>

              {/* Seviye Skalası */}
              <TierTrack />

              {/* Karma nasıl kazanılır — individual cards */}
              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Karma Nasıl Kazanılır?</p>
                {KARMA_HOW.map(({ label, karma }, i) => (
                  <div key={label} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                    <KarmaHowIcon index={i} />
                    <span className="text-sm text-gray-700 font-medium flex-1">{label}</span>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 whitespace-nowrap">
                      {karma}
                    </span>
                  </div>
                ))}
              </div>

              {/* Altruistik kullanıcı notu */}
              <div className="bg-[#1B3A5C]/5 border border-[#1B3A5C]/10 rounded-2xl p-4 flex gap-3 items-start">
                <span className="text-lg flex-shrink-0 mt-0.5">♾️</span>
                <div>
                  <p className="text-sm font-bold text-[#1B3A5C]">Karşılık beklemiyorsan?</p>
                  <p className="text-xs text-gray-500 leading-relaxed mt-1">
                    Sorun değil. Kazandığın Karma'yı seçtiğin İyilik Öncüsü'ne bağış olarak yönlendirebilirsin — sana değil, iyiliğe gitsin.
                  </p>
                </div>
              </div>
            </div>

            {/* Sağ: Karma dashboard görsel */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Toplam Karman</p>
                    <p className="text-3xl font-bold text-[#1B3A5C] flex items-center gap-2">2.340 <KarmaToken size={28} /></p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2 text-center">
                    <p className="text-xs text-amber-500 font-medium">Seviyen</p>
                    <p className="text-sm font-bold text-amber-700">Çok İyi Biri</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Çok İyi Biri</span>
                    <span>2.340 / 3.000 Karma</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[78%] bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">660 Karma → <span className="font-semibold text-gray-600">Gerçekten İyi Biri</span></p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Tamamlanan", value: "18 Görev" },
                    { label: "Seri",       value: "7 gün 🔥" },
                    { label: "Bu hafta",   value: "+350"    },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-2xl p-3 text-center">
                      <p className="text-sm font-bold text-[#1B3A5C]">{value}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1B3A5C] rounded-2xl px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center flex-shrink-0"><KarmaSymbol size={28} /></div>
                <div>
                  <p className="text-white font-bold text-sm">Sahil temizliği tamamlandı!</p>
                  <p className="text-white/60 text-xs">TEMA Vakfı · az önce</p>
                </div>
                <span className="ml-auto text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-xl flex items-center gap-1">+150 <KarmaToken size={12} /></span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Nasıl Çalışır ── */}
        <section id="nasil-calisir" className="px-6 py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3">Nasıl Çalışır?</p>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#1B3A5C] leading-tight">
                4 adımda iyilik yap,<br className="hidden sm:block" /> Karma kazan, ödül al.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
              {HOW_IT_WORKS.map(({ step, icon, title, desc }) => (
                <div key={step} className="relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow p-7 flex flex-col gap-4">
                  <div className="absolute -top-4 -left-4 w-9 h-9 rounded-full bg-amber-400 text-amber-900 font-bold text-sm flex items-center justify-center shadow-md">
                    {step}
                  </div>
                  <StepIcon step={step} />
                  <div>
                    <p className="text-base font-bold text-[#1B3A5C] mb-2">{title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── İyilik Öncüleri ── */}
        <section id="iyilik-oncüleri" className="px-6 py-24 max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3">İyilik Öncüleri</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1B3A5C] leading-tight">
              Arkamızda köklü kurumlar var.
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">
              İyilik Öncülerimiz; vakıflar, sivil toplum kuruluşları, dernekler ve belediyeler
              gibi topluma hizmet eden kurumlardan oluşur. Görevleri onlar oluşturur,
              güvenilirliği onlar sağlar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-12">
            {DOMAINS.map(({ emoji, title, partner, desc, color, logo }) => (
              <div key={title} className={`rounded-3xl border p-7 flex gap-5 hover:shadow-sm transition-shadow ${color}`}>
                {/* Logo yerine emoji + arka planda logo */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo} alt={partner} className="max-h-10 max-w-[52px] object-contain" />
                  </div>
                  <span className="text-xl">{emoji}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">{partner}</p>
                    <p className="font-bold text-[#1B3A5C] text-lg">{title}</p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Sponsor Markalar ── */}
        <section id="odüller" className="px-6 py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3">Sponsor Markalar</p>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#1B3A5C] leading-tight">
                İyiliğin karşılıksız<br className="hidden sm:block" /> kalmaz.
              </h2>
              <p className="text-gray-500 mt-4 max-w-md mx-auto text-lg">
                Sponsor Markalarımız birikmiş Karmanı gerçek ödüllere dönüştürür.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {BRAND_LOGOS.map(({ name, img, svg }) => (
                <div key={name} className="flex flex-col items-center gap-3 rounded-3xl border border-gray-100 bg-white p-6 hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={name} className="max-h-10 max-w-[52px] object-contain" />
                    ) : (
                      <div className="scale-75">{svg}</div>
                    )}
                  </div>
                  <p className="text-xs font-bold text-[#1B3A5C] text-center leading-tight">{name}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400 mt-8">ve daha fazla Sponsor Marka çok yakında...</p>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="px-6 py-24 bg-amber-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1B3A5C]">Beta kullanıcıları seviyor 💛</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {TESTIMONIALS.map(({ quote, name, role, emoji }, i) => (
                <div key={i} className="bg-white rounded-3xl border border-amber-100 p-7 flex flex-col gap-5 shadow-sm">
                  <div className="flex gap-0.5">{[...Array(5)].map((_, s) => <span key={s} className="text-amber-400 text-lg">★</span>)}</div>
                  <p className="text-gray-700 leading-relaxed text-sm flex-1">{quote}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-lg flex-shrink-0">{emoji}</div>
                    <div>
                      <p className="font-bold text-[#1B3A5C] text-sm">{name}</p>
                      <p className="text-xs text-gray-400">{role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="px-6 py-28 flex flex-col items-center text-center gap-7 max-w-2xl mx-auto">
          <Logo size="xl" variant="icon" />
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1B3A5C] leading-tight">
            Fark yaratmaya<br />hazır mısın?
          </h2>
          <p className="text-gray-500 max-w-sm text-lg">
            Erken erişim listesine katıl, İyiBiri'yi ilk kullananlardan biri ol
            ve özel Karma bonusuyla başla.
          </p>
          <div className="w-full max-w-md">
            <WaitlistForm />
          </div>
          <p className="text-xs text-gray-400">Spam yok. İstediğin zaman çıkabilirsin.</p>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <Logo size="sm" variant="full" />
          <p className="text-xs text-gray-400">© 2026 İyiBiri. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <a href="#karma" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Karma</a>
            <a href="#iyilik-oncüleri" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">İyilik Öncüleri</a>
            <a href="#erisim" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Erken Erişim</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
