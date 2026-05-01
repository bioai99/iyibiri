// ─── NGO / STK Types ────────────────────────────────────────────────────────

export interface NGO {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  category: Exclude<Category, "Hepsi">;
  memberCount: number;
  volunteerCount: number;
  founded: number;
  website: string;
  colorAccent: string;
  logo?: string; // public/ path or URL
  missionIds: string[]; // Ordered: [0]=üye ol, [1]=bağış, [2+]=derinleşen
}

export const NGOS: NGO[] = [
  {
    id: "tema",
    name: "TEMA Vakfı",
    shortName: "TEMA",
    tagline: "Türkiye'nin doğasını koruyoruz",
    description: "Türkiye Erozyonla Mücadele, Ağaçlandırma ve Doğal Varlıkları Koruma Vakfı olarak 1992'den bu yana doğa koruma alanında çalışmaktadır.",
    category: "Çevre",
    memberCount: 800000,
    volunteerCount: 12400,
    founded: 1992,
    website: "tema.org.tr",
    colorAccent: "emerald",
    logo: "/tema-logo.png",
    missionIds: ["tema-uye", "tema-bagis", "1", "4"],
  },
  {
    id: "cydd",
    name: "ÇYDD",
    shortName: "ÇYDD",
    tagline: "Çağdaş, eğitimli nesiller yetiştirelim",
    description: "Çağdaş Yaşamı Destekleme Derneği, 1989'dan beri dezavantajlı gençlere burs ve eğitim desteği sağlamaktadır.",
    category: "Eğitim",
    memberCount: 150000,
    volunteerCount: 4200,
    founded: 1989,
    website: "cydd.org.tr",
    colorAccent: "blue",
    logo: "/cydd-logo.png",
    missionIds: ["cydd-uye", "cydd-bagis", "2"],
  },
  {
    id: "haytap",
    name: "Haytap",
    shortName: "Haytap",
    tagline: "Hayvanların sesi oluyoruz",
    description: "Hayvan Hakları Federasyonu, Türkiye'de hayvan hakları savunuculuğu ve barınak iyileştirme çalışmaları yürütmektedir.",
    category: "Hayvanlar",
    memberCount: 45000,
    volunteerCount: 2800,
    founded: 2006,
    website: "haytap.org",
    colorAccent: "orange",
    logo: "/haytap-logo.png",
    missionIds: ["haytap-uye", "haytap-bagis", "3"],
  },
  {
    id: "kodluyoruz",
    name: "Kodluyoruz",
    shortName: "Kodluyoruz",
    tagline: "Teknolojiyle geleceği inşa ediyoruz",
    description: "İstihdam edilebilirliği artırmak için dezavantajlı bireylere ücretsiz yazılım eğitimi veren sosyal girişim.",
    category: "Eğitim",
    memberCount: 22000,
    volunteerCount: 890,
    founded: 2019,
    website: "kodluyoruz.org",
    colorAccent: "blue",
    missionIds: ["kodluyoruz-uye", "kodluyoruz-bagis", "7"],
  },
  {
    id: "kizilay",
    name: "Türk Kızılay",
    shortName: "Kızılay",
    tagline: "İnsanlığa hizmet, her zaman yanında",
    description: "Türkiye'nin en köklü insani yardım kuruluşu. Afet müdahalesinden kan bağışına kadar her alanda toplumsal destek sağlar.",
    category: "Sağlık",
    memberCount: 2100000,
    volunteerCount: 78000,
    founded: 1868,
    website: "kizilay.org.tr",
    colorAccent: "rose",
    missionIds: ["kizilay-uye", "kizilay-bagis", "5"],
  },
];

// Sabit görevler: Üye ol + Bağış yap (her STK için)
export const NGO_BASE_MISSIONS: Mission[] = [
  // TEMA
  {
    id: "tema-uye", title: "TEMA'ya Üye Ol", description: "TEMA Vakfı'na resmi üye olarak doğa koruma hareketinin parçası ol.",
    longDescription: "TEMA Vakfı'na üye olmak, Türkiye'nin en büyük doğa koruma ağının bir parçası olmak demektir. Üyelik tamamen ücretsizdir.",
    ngo: "TEMA Vakfı", category: "Çevre", difficulty: "Kolay", karma: 200, duration: "5 dakika",
    participants: 800000, verifyMethod: "auto", verifyHint: "Üyelik tamamlandıktan sonra otomatik doğrulanır.",
    steps: ["TEMA websitesine git", "Üyelik formunu doldur", "E-postanı doğrula"], domain: "nature", style: "remote",
    impactStatement: "Üyeliğinle milyonluk TEMA ağının doğa koruma etkisi büyür.",
    impactResult: { value: "800.001.", label: "kişilik doğa ağına katıldın" },
  },
  {
    id: "tema-bagis", title: "TEMA'ya Bağış Yap", description: "Ağaçlandırma ve doğa koruma projelerine destek ol.",
    longDescription: "TEMA Vakfı'nın yürüttüğü ağaçlandırma ve erozyon önleme projelerine finansal destek sağla. Minimum 50₺ bağış.",
    ngo: "TEMA Vakfı", category: "Çevre", difficulty: "Kolay", karma: 150, duration: "5 dakika",
    participants: 45000, verifyMethod: "auto", verifyHint: "Bağış açıklamasına #iyibiri ekle — otomatik doğrulanır.",
    steps: ["TEMA bağış sayfasına git", "Miktar seç (min. 50₺)", "Açıklamaya #iyibiri yaz", "Bağışla"], domain: "nature", style: "remote",
    impactStatement: "Bağışınla yeni fidanlar toprakla buluşur, erozyon durur.",
  },
  // ÇYDD
  {
    id: "cydd-uye", title: "ÇYDD'ye Üye Ol", description: "Çağdaş Yaşamı Destekleme Derneği'ne üye ol.",
    longDescription: "ÇYDD'ye üye olarak eğitim burslarını ve çağdaş yaşam projelerini destekle.",
    ngo: "ÇYDD", category: "Eğitim", difficulty: "Kolay", karma: 200, duration: "5 dakika",
    participants: 150000, verifyMethod: "auto", verifyHint: "Üyelik tamamlandıktan sonra otomatik doğrulanır.",
    steps: ["ÇYDD websitesine git", "Üyelik formunu doldur", "E-postanı doğrula"], domain: "education", style: "remote",
    impactStatement: "Üyeliğinle eğitime erişemeyen gençlerin sesi güçlenir.",
  },
  {
    id: "cydd-bagis", title: "ÇYDD'ye Bağış Yap", description: "Gençlerin eğitim hayallerine katkı sağla.",
    longDescription: "ÇYDD burs fonuna bağış yaparak dezavantajlı gençlerin üniversite hayalini gerçekleştirmesine yardım et.",
    ngo: "ÇYDD", category: "Eğitim", difficulty: "Kolay", karma: 150, duration: "5 dakika",
    participants: 28000, verifyMethod: "auto", verifyHint: "Bağış açıklamasına #iyibiri ekle.",
    steps: ["ÇYDD bağış sayfasına git", "Miktar seç", "Açıklamaya #iyibiri yaz", "Bağışla"], domain: "education", style: "remote",
    impactStatement: "Bağışınla bir genç üniversite bursuna bir adım daha yaklaşır.",
    impactResult: { value: "1 genç", label: "burs için bir adım daha yaklaştı" },
  },
  // Haytap
  {
    id: "haytap-uye", title: "Haytap'a Üye Ol", description: "Hayvan hakları savunuculuğunun parçası ol.",
    longDescription: "Haytap'a üye olarak Türkiye'deki hayvan hakları mücadelesini destekle.",
    ngo: "Haytap", category: "Hayvanlar", difficulty: "Kolay", karma: 200, duration: "5 dakika",
    participants: 45000, verifyMethod: "auto", verifyHint: "Üyelik tamamlandıktan sonra otomatik doğrulanır.",
    steps: ["Haytap websitesine git", "Üyelik formunu doldur", "Doğrula"], domain: "social", style: "remote",
    impactStatement: "Üyeliğinle barınaklardaki canların sesi daha güçlü çıkar.",
  },
  {
    id: "haytap-bagis", title: "Haytap'a Bağış Yap", description: "Barınak hayvanlarına mama ve bakım desteği sağla.",
    longDescription: "Haytap'ın barınak iyileştirme ve mama temini projelerine destek ol.",
    ngo: "Haytap", category: "Hayvanlar", difficulty: "Kolay", karma: 150, duration: "5 dakika",
    participants: 12000, verifyMethod: "auto", verifyHint: "Bağış açıklamasına #iyibiri ekle.",
    steps: ["Haytap bağış sayfasına git", "Miktar seç", "Açıklamaya #iyibiri yaz", "Bağışla"], domain: "social", style: "remote",
    impactStatement: "Bağışınla barınaktaki bir can bugün aç kalmaz.",
  },
  // Kodluyoruz
  {
    id: "kodluyoruz-uye", title: "Kodluyoruz'a Üye Ol", description: "Teknoloji eğitimi ekosisteminin parçası ol.",
    longDescription: "Kodluyoruz platformuna üye olarak gönüllü mentor ve destekçi topluluğuna katıl.",
    ngo: "Kodluyoruz", category: "Eğitim", difficulty: "Kolay", karma: 200, duration: "5 dakika",
    participants: 22000, verifyMethod: "auto", verifyHint: "Üyelik tamamlandıktan sonra otomatik doğrulanır.",
    steps: ["Kodluyoruz websitesine git", "Gönüllü kaydı oluştur", "Profili tamamla"], domain: "education", style: "remote",
    impactStatement: "Üyeliğinle teknoloji eğitimi daha fazla kişiye ulaşır.",
  },
  {
    id: "kodluyoruz-bagis", title: "Kodluyoruz'a Bağış Yap", description: "Yazılım eğitimini daha fazla kişiye ulaştır.",
    longDescription: "Kodluyoruz'un ücretsiz bootcamp ve mentorluk programlarını finanse etmek için bağış yap.",
    ngo: "Kodluyoruz", category: "Eğitim", difficulty: "Kolay", karma: 150, duration: "5 dakika",
    participants: 5600, verifyMethod: "auto", verifyHint: "Bağış açıklamasına #iyibiri ekle.",
    steps: ["Kodluyoruz bağış sayfasına git", "Miktar seç", "Açıklamaya #iyibiri yaz", "Bağışla"], domain: "education", style: "remote",
    impactStatement: "Bağışınla bir kişi yazılım sertifikasına kavuşur.",
  },
  // Kızılay
  {
    id: "kizilay-uye", title: "Kızılay'a Üye Ol", description: "Türkiye'nin en büyük insani yardım ağına katıl.",
    longDescription: "Kızılay gönüllü olarak afet müdahalesi, kan bağışı ve sosyal yardım projelerinde yer al.",
    ngo: "Türk Kızılay", category: "Sağlık", difficulty: "Kolay", karma: 200, duration: "5 dakika",
    participants: 2100000, verifyMethod: "auto", verifyHint: "Üyelik tamamlandıktan sonra otomatik doğrulanır.",
    steps: ["Kızılay websitesine git", "Gönüllü kaydı oluştur", "Kimlik doğrula"], domain: "social", style: "remote",
    impactStatement: "Üyeliğinle Kızılay'ın afet anındaki müdahale gücü artar.",
  },
  {
    id: "kizilay-bagis", title: "Kızılay'a Bağış Yap", description: "Afet mağdurlarına ve ihtiyaç sahiplerine destek ol.",
    longDescription: "Kızılay'ın acil yardım fonuna bağış yaparak olası afet durumlarında hazır ol.",
    ngo: "Türk Kızılay", category: "Sağlık", difficulty: "Kolay", karma: 150, duration: "5 dakika",
    participants: 380000, verifyMethod: "auto", verifyHint: "Bağış açıklamasına #iyibiri ekle.",
    steps: ["Kızılay bağış sayfasına git", "Miktar seç", "Açıklamaya #iyibiri yaz", "Bağışla"], domain: "social", style: "remote",
    impactStatement: "Bağışınla bir afet anında bir ailenin yanında olursun.",
  },
];

export const ALL_MISSIONS_MAP: Record<string, Mission> = {};

// Kullanıcıya sistem tarafından atanmış görevler
export const ASSIGNED_MISSION_IDS = ["1", "2", "5", "tema-uye", "cydd-bagis"];

// ADR-014 Accepted (2026-04-26): TIERS canonical → `lib/tiers.ts`.
// Eski 6-tier "Oldukça İyi Biri" eklenmiş + level-tabanlı sistem drift'ti.
// Şimdi canonical 5-tier karma-tabanlı sistem `lib/tiers.ts`'ten gelir.
// Geriye dönük uyum için TIERS + getTierName re-export edilir.
export { TIERS, getTierName } from "./tiers";

export const MOCK_USER = {
  name: "Ada Yılmaz",
  level: 5,
  karma: 12340,
  karmaToNext: 15000,
  completedMissions: 18,
  streak: 3,
};

export type Category = "Hepsi" | "Çevre" | "Eğitim" | "Sağlık" | "Hayvanlar" | "Kültür" | "Finansal";
export type Difficulty = "Kolay" | "Orta" | "Zor";
export type VerifyMethod = "photo" | "code" | "qr" | "auto";

export interface Mission {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  ngo: string;
  category: Exclude<Category, "Hepsi">;
  difficulty: Difficulty;
  karma: number;
  duration: string;
  participants: number;
  featured?: boolean;
  verifyMethod: VerifyMethod;
  verifyHint: string;
  steps: string[];
  domain: "financial" | "education" | "nature" | "social";
  style: "remote" | "outside" | "both";
  impactStatement?: string;
  impactResult?: { value: string; label: string }; // tamamlanınca gösterilen somut etki
}

export const MISSIONS: Mission[] = [
  {
    id: "1",
    title: "Sahil Temizliği Gönüllüsü",
    description: "İzmir Kordon'da düzenlenen sahil temizliği etkinliğine katıl.",
    longDescription: "TEMA Vakfı koordinasyonunda her ay düzenlenen sahil temizliği etkinliğine katılarak hem doğaya katkı sağla hem de yeni insanlarla tanış. Eldiven ve atık torbası etkinlik alanında sağlanacak.",
    ngo: "TEMA Vakfı",
    category: "Çevre",
    difficulty: "Kolay",
    karma: 150,
    duration: "2 saat",
    participants: 42,
    featured: true,
    verifyMethod: "qr",
    verifyHint: "Etkinlik alanındaki QR kodu tara.",
    steps: ["Etkinlik yerine git", "Koordinatörden eldiven al", "Temizliğe katıl", "QR kodu tara"],
    domain: "nature",
    style: "outside",
    impactStatement: "Bu görevle bir kıyı şeridi temizlenir; deniz canlıları nefes alır.",
    impactResult: { value: "~15 kg", label: "atık doğadan toplandı" },
  },
  {
    id: "2",
    title: "İlkokul Öğrencisine Okuma Desteği",
    description: "Her hafta 1 saat Zoom üzerinden 2. sınıf öğrencisine okuma desteği ver.",
    longDescription: "ÇYDD'nin Oku Büyü programı kapsamında, dezavantajlı bölgelerdeki ilkokul öğrencilerine haftalık online okuma desteği sağla. Platform üzerinden öğrencin sana atanır, Zoom linki otomatik oluşturulur.",
    ngo: "ÇYDD",
    category: "Eğitim",
    difficulty: "Orta",
    karma: 250,
    duration: "4 saat/ay",
    participants: 15,
    featured: true,
    verifyMethod: "code",
    verifyHint: "Seans sonunda sana iletilen 6 haneli kodu gir.",
    steps: ["Profil oluştur", "Öğrenci eşleşmesini bekle", "Zoom seansını tamamla", "Seans kodunu gir"],
    domain: "education",
    style: "remote",
    impactStatement: "Bu görevle bir çocuğun okuma becerisi gelişir; geleceği şekillenir.",
    impactResult: { value: "4 saat", label: "birebir eğitim desteği verildi" },
  },
  {
    id: "3",
    title: "Barınağa Mama Bağışı",
    description: "En yakın barınağa mama bağışında bulun ve teslim et.",
    longDescription: "Haytap iş birliğiyle belirlenen barınaklara mama bağışı yap. Bağışını teslim ettikten sonra barınak görevlisi onay verir, puanın hesabına geçer.",
    ngo: "Haytap",
    category: "Hayvanlar",
    difficulty: "Kolay",
    karma: 100,
    duration: "30 dakika",
    participants: 128,
    verifyMethod: "photo",
    verifyHint: "Barınak görevlisiyle birlikte fotoğraf çek ve yükle.",
    steps: ["Yakın barınağı bul", "Mama satın al", "Barınağa teslim et", "Fotoğraf yükle"],
    domain: "social",
    style: "outside",
    impactStatement: "Bu görevle barınaktaki bir can bugün aç kalmaz.",
  },
  {
    id: "4",
    title: "Orman Yangını Farkındalığı",
    description: "Hazırlanmış içeriği sosyal medyanda paylaş, takipçilerine ulaştır.",
    longDescription: "TEMA Vakfı'nın hazırladığı orman yangınları farkındalık içeriğini kendi sosyal medya hesaplarında paylaş. Paylaşım linki veya ekran görüntüsü ile doğrula.",
    ngo: "TEMA Vakfı",
    category: "Çevre",
    difficulty: "Kolay",
    karma: 75,
    duration: "15 dakika",
    participants: 310,
    verifyMethod: "photo",
    verifyHint: "Paylaşımının ekran görüntüsünü yükle.",
    steps: ["İçeriği oku", "Paylaş", "Ekran görüntüsü al", "Yükle"],
    domain: "nature",
    style: "remote",
    impactStatement: "Bu içerikle yüzlerce kişi yangın tehlikeleri hakkında bilinçlenir.",
  },
  {
    id: "5",
    title: "Yaşlı Komşuna Yardım Et",
    description: "Mahallendeki yaşlı bir komşuna alışveriş veya ilaç temininde yardım et.",
    longDescription: "Kızılay'ın Komşu Dayanışması programı kapsamında, yakın çevrenizdeki yaşlı bireylere günlük hayatta destek olun. Yardım ettiğiniz kişiden alacağınız onay kodu ile görev tamamlanır.",
    ngo: "Kızılay",
    category: "Sağlık",
    difficulty: "Kolay",
    karma: 120,
    duration: "1 saat",
    participants: 87,
    featured: true,
    verifyMethod: "code",
    verifyHint: "Komşunun size vereceği 4 haneli kodu gir.",
    steps: ["Komşunla iletişime geç", "İhtiyacını öğren", "Yardımı gerçekleştir", "Onay kodunu al"],
    domain: "social",
    style: "outside",
    impactStatement: "Bu görevle yalnız bir yaşlının günü anlamlı geçer.",
    impactResult: { value: "1 kişi", label: "yalnız bırakılmadı" },
  },
  {
    id: "6",
    title: "Müze Rehber Gönüllüsü",
    description: "İstanbul Arkeoloji Müzesi'nde hafta sonu ziyaretçilere rehberlik yap.",
    longDescription: "İstanbul Kültür A.Ş. iş birliğiyle hafta sonları gönüllü rehber olarak müze ziyaretçilerine eşlik et. Katılım öncesi kısa bir online oryantasyon gereklidir.",
    ngo: "İstanbul Kültür A.Ş.",
    category: "Kültür",
    difficulty: "Zor",
    karma: 400,
    duration: "4 saat",
    participants: 8,
    verifyMethod: "qr",
    verifyHint: "Müze girişindeki QR kodu tara.",
    steps: ["Online oryantasyona katıl", "Müzeye git", "Rehberliği tamamla", "QR kodu tara"],
    domain: "social",
    style: "outside",
    impactStatement: "Bu görevle ziyaretçiler kültürel mirasa daha derin bağ kurar.",
  },
  {
    id: "7",
    title: "Kod Mentoru Ol",
    description: "Lise öğrencilerine haftada 1 kez online Python dersi ver.",
    longDescription: "Kodluyoruz platformundaki lise öğrencilerine Python programlama dersi ver. Haftada 1 kez 2 saatlik online seans. Teknik bilgini gençlerle paylaş, geleceğe yatırım yap.",
    ngo: "Kodluyoruz",
    category: "Eğitim",
    difficulty: "Zor",
    karma: 500,
    duration: "8 saat/ay",
    participants: 5,
    verifyMethod: "code",
    verifyHint: "Seans sonunda platform tarafından gönderilen kodu gir.",
    steps: ["Başvur ve eşleş", "İlk seansı planla", "Dersi ver", "Seans kodunu gir"],
    domain: "education",
    style: "remote",
    impactStatement: "Bu görevle bir gencin yazılım kariyerinin temelleri atılır.",
  },
  {
    id: "8",
    title: "Gıda Bankasına Bağış",
    description: "En yakın gıda bankası noktasına temel gıda ürünleri bağışla.",
    longDescription: "Gıda Bankası Derneği'nin belirlediği noktalara temel gıda ürünleri (pirinç, makarna, zeytinyağı vb.) bağışla. Açıklama alanına #iyibiri yazman yeterli, bağışın otomatik doğrulanır.",
    ngo: "Gıda Bankası Derneği",
    category: "Finansal",
    difficulty: "Kolay",
    karma: 80,
    duration: "20 dakika",
    participants: 203,
    verifyMethod: "auto",
    verifyHint: "Bağış açıklamasına #iyibiri yaz — otomatik doğrulanır.",
    steps: ["Gıda bankası noktasını bul", "Ürünleri satın al", "Açıklamaya #iyibiri yaz", "Bağışla"],
    domain: "financial",
    style: "outside",
    impactStatement: "Bu görevle bir aile bu hafta temel gıdaya erişir.",
  },
];

export const CATEGORY_COLORS: Record<Exclude<Category, "Hepsi">, string> = {
  Çevre:     "bg-emerald-100 text-emerald-700",
  Eğitim:    "bg-blue-100 text-blue-700",
  Sağlık:    "bg-rose-100 text-rose-700",
  Hayvanlar: "bg-orange-100 text-orange-700",
  Kültür:    "bg-purple-100 text-purple-700",
  Finansal:  "bg-yellow-100 text-yellow-700",
};

export const CATEGORY_PHOTOS: Record<Exclude<Category, "Hepsi">, string> = {
  Çevre:     "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80&auto=format&fit=crop",
  Eğitim:    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80&auto=format&fit=crop",
  Sağlık:    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80&auto=format&fit=crop",
  Hayvanlar: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&auto=format&fit=crop",
  Kültür:    "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80&auto=format&fit=crop",
  Finansal:  "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80&auto=format&fit=crop",
};

export const CATEGORY_GRADIENTS: Record<Exclude<Category, "Hepsi">, string> = {
  Çevre:     "from-emerald-100 to-teal-50",
  Eğitim:    "from-blue-100 to-indigo-50",
  Sağlık:    "from-rose-100 to-pink-50",
  Hayvanlar: "from-orange-100 to-amber-50",
  Kültür:    "from-purple-100 to-violet-50",
  Finansal:  "from-yellow-100 to-amber-50",
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Kolay: "bg-impact/10 text-impact",
  Orta:  "bg-primary/10 text-amber-700",
  Zor:   "bg-destructive/10 text-destructive",
};

export interface Reward {
  id: string;
  title: string;
  brand: string;
  brandLogo?: string; // URL or public/ path
  description: string;
  karmaRequired: number;
  category: "food" | "education" | "culture" | "shopping";
}

export const REWARDS: Reward[] = [
  {
    id: "r1", title: "%20 Kahve İndirimi", brand: "Starbucks",
    brandLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png",
    description: "Tüm içeceklerde geçerli tek kullanımlık indirim kodu.", karmaRequired: 300, category: "food",
  },
  {
    id: "r2", title: "%10 Market İndirimi", brand: "Migros",
    brandLogo: "https://upload.wikimedia.org/wikipedia/commons/0/07/MiGROS_Logo.svg",
    description: "Migros uygulamasında geçerli indirim kuponu.", karmaRequired: 500, category: "shopping",
  },
  {
    id: "r3", title: "İndirim Kuponu", brand: "Trendyol",
    brandLogo: "/trendyol-logo.svg",
    description: "Minimum 300₺ alışverişlerde geçerli kupon.", karmaRequired: 750, category: "shopping",
  },
  {
    id: "r4", title: "%15 Spor Ekipmanı İndirimi", brand: "Nike",
    brandLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png",
    description: "Seçili Nike ürünlerinde geçerli online indirim.", karmaRequired: 1200, category: "shopping",
  },
  {
    id: "r5", title: "Sinema Bileti", brand: "Cinemaximum",
    description: "Tüm salonlarda geçerli 1 ücretsiz sinema bileti.", karmaRequired: 600, category: "culture",
  },
  {
    id: "r6", title: "Hediye Çeki", brand: "Garanti BBVA",
    brandLogo: "/garanti-bbva-logo.svg",
    description: "Kampanyalı ürünlerde kullanılabilir dijital çek.", karmaRequired: 1500, category: "shopping",
  },
];
