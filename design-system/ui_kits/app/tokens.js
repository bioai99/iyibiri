// Shared tokens and constants for the UI kit
window.IYI = {
  domains: {
    nature:     { label: 'DOĞA',      gradient: 'linear-gradient(135deg,#10B981,#14B8A6)', icon: '🌿' },
    education:  { label: 'EĞİTİM',    gradient: 'linear-gradient(135deg,#3B82F6,#6366F1)', icon: '📖' },
    social:     { label: 'SOSYAL',    gradient: 'linear-gradient(135deg,#F43F5E,#EC4899)', icon: '❤️' },
    financial:  { label: 'FİNANSAL',  gradient: 'linear-gradient(135deg,#F59E0B,#F97316)', icon: '🪙' },
    animals:    { label: 'HAYVANLAR', gradient: 'linear-gradient(135deg,#F97316,#F59E0B)', icon: '🐾' },
    culture:    { label: 'KÜLTÜR',    gradient: 'linear-gradient(135deg,#A855F7,#D946EF)', icon: '🎭' },
  },
  tiers: [
    { min: 0,     name: 'İyi Biri',            emoji: '🌱', bg: 'linear-gradient(90deg,#DCFCE7,#BBF7D0)', fg: '#166534' },
    { min: 500,   name: 'Çok İyi Biri',        emoji: '⭐', bg: 'linear-gradient(90deg,#FEF3C7,#FDE68A)', fg: '#92400E' },
    { min: 2000,  name: 'Çoook İyi Biri',      emoji: '🌟', bg: 'linear-gradient(90deg,#FED7AA,#FDBA74)', fg: '#9A3412' },
    { min: 5000,  name: 'Gerçekten İyi Biri',  emoji: '🏆', bg: 'linear-gradient(90deg,#DDD6FE,#C4B5FD)', fg: '#5B21B6' },
    { min: 10000, name: 'İyiliğin Öncüsü',     emoji: '👑', bg: 'linear-gradient(90deg,#FECACA,#FCA5A5)', fg: '#991B1B' },
  ],
  tierFor(karma){ return [...this.tiers].reverse().find(t=>karma>=t.min) || this.tiers[0]; },
  nextTier(karma){ return this.tiers.find(t=>karma<t.min); },
  fmt(n){ return n.toLocaleString('tr-TR'); },
  difficulty: {
    easy:   { label:'Kolay', bg:'#D1FAE5', fg:'#065F46' },
    medium: { label:'Orta',  bg:'#FEF3C7', fg:'#92400E' },
    hard:   { label:'Zor',   bg:'#FEE2E2', fg:'#991B1B' },
  }
};

window.IYI_DATA = {
  profile: {
    name: 'Ayşe Yılmaz', firstName: 'Ayşe',
    karma: 2340, streak: 7, completed: 12, avatar: '🦊',
  },
  ngos: [
    { id:'tema',      name:'TEMA Vakfı',    short:'TEMA',      logo:'../../assets/logos/tema-logo.png',       color:'#2D9E5A' },
    { id:'cydd',      name:'ÇYDD',          short:'ÇYDD',      logo:'../../assets/logos/cydd-logo.png',       color:'#1B3A5C' },
    { id:'haytap',    name:'Haytap',        short:'Haytap',    logo:'../../assets/logos/haytap-logo.png',     color:'#F97316' },
    { id:'kizilay',   name:'Türk Kızılay',  short:'Kızılay',   logo:'../../assets/logos/kizilay-logo.png',    color:'#DC2626' },
    { id:'kodluyoruz',name:'Kodluyoruz',    short:'Kodluyoruz',logo:'../../assets/logos/kodluyoruz-logo.png', color:'#3B82F6' },
    { id:'tog',       name:'TOG',           short:'TOG',       logo:'../../assets/logos/tog-logo.svg',        color:'#F59E0B' },
  ],
  missions: [
    { id:'m1', title:'Sahil Temizliği Gönüllüsü', ngoId:'tema', domain:'nature',    karma:150, duration:'2 saat', difficulty:'easy',   featured:true,  description:'Kıyıdaki plastikleri topla; deniz canlıları için küçük ama somut bir fark yarat.', impact:'Bu görevle bir kıyı şeridi temizlenir; deniz canlıları nefes alır.' },
    { id:'m2', title:'Çocuklara Kitap Oku',       ngoId:'cydd', domain:'education', karma:250, duration:'1 saat', difficulty:'easy',   featured:true,  description:'Online oturumda bir çocuğa yüksek sesle kitap oku.', impact:'Bu görevle bir çocuğun okuma becerisi gelişir; geleceği şekillenir.' },
    { id:'m3', title:'Barınakta Gönüllü Günü',    ngoId:'haytap',domain:'animals',  karma:200, duration:'3 saat', difficulty:'medium', featured:true,  description:'Bir barınakta patileri mama ile buluştur, onlarla vakit geçir.', impact:'Bu görevle barınaktaki bir can bugün aç kalmaz.' },
    { id:'m4', title:'Kan Bağışı Kampanyası',     ngoId:'kizilay',domain:'social',  karma:300, duration:'45 dk',  difficulty:'easy',   featured:false, description:'En yakın kan bağışı noktasında randevunu al.', impact:'Bu görevle üç kişinin hayatı kurtulabilir.' },
    { id:'m5', title:'Kodlama Mentorluğu',        ngoId:'kodluyoruz',domain:'education',karma:350,duration:'1 saat',difficulty:'medium',featured:false,description:'Yeni başlayan bir geliştiriciye rehberlik et.', impact:'Bu görevle bir geliştiricinin yolu açılır; sektöre bir el daha uzanır.' },
    { id:'m6', title:'Tohum Ek, Nefes Al',        ngoId:'tema', domain:'nature',    karma:180, duration:'3 saat', difficulty:'medium', featured:false, description:'Ağaçlandırma etkinliğine katıl.', impact:'Bu görevle on fidan toprakla tanışır; hava temizlenir.' },
  ],
  rewards: [
    { id:'r1', brand:'Starbucks',  title:'Bir Türk Kahvesi',    desc:'Tüm mağazalarda geçerli kupon kodu.',          cost:500,  gradient:'linear-gradient(180deg,#065F46,#0D9488)', icon:'☕' },
    { id:'r2', brand:'Trendyol',   title:'50₺ İndirim',          desc:'150₺ üzeri alışverişte tek kullanımlık.',       cost:1200, gradient:'linear-gradient(180deg,#F97316,#F59E0B)', icon:'🛍' },
    { id:'r3', brand:'Migros',     title:'Migros Hediye Çeki',   desc:'Marketten alışverişte indirim.',                cost:800,  gradient:'linear-gradient(180deg,#F97316,#EF4444)', icon:'🛒' },
    { id:'r4', brand:'Nike',       title:'%15 İndirim',          desc:'Nike.com üzerinden geçerli.',                   cost:2500, gradient:'linear-gradient(180deg,#1C1917,#44403C)', icon:'👟' },
    { id:'r5', brand:'Garanti BBVA',title:'Bonus Puan',          desc:'Hesabına 200 Bonus yüklenir.',                  cost:1500, gradient:'linear-gradient(180deg,#065F46,#047857)', icon:'💳' },
    { id:'r6', brand:'Starbucks',  title:'Frappuccino Hediyesi', desc:'Tall boy, istediğin aroma.',                   cost:900,  gradient:'linear-gradient(180deg,#065F46,#0D9488)', icon:'🥤' },
  ]
};
