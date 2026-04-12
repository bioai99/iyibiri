export const TIERS = [
  { minLevel: 1,  maxLevel: 2,  name: "İyi Biri"                },
  { minLevel: 3,  maxLevel: 4,  name: "Oldukça İyi Biri"        },
  { minLevel: 5,  maxLevel: 7,  name: "Çok İyi Biri"            },
  { minLevel: 8,  maxLevel: 10, name: "Gerçekten İyi Biri"      },
  { minLevel: 11, maxLevel: 15, name: "Çoook İyi Biri"          },
  { minLevel: 16, maxLevel: 99, name: "İyiliğin Öncüsü"         },
];

export function getTierName(level: number): string {
  return TIERS.find((t) => level >= t.minLevel && level <= t.maxLevel)?.name ?? "İyi Biri";
}

export const MOCK_USER = {
  name: "Ada Yılmaz",
  level: 5,
  karma: 2340,
  karmaToNext: 3000,
  completedMissions: 18,
  streak: 3,
  totalKarma: 12340,
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

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Kolay: "bg-impact/10 text-impact",
  Orta:  "bg-primary/10 text-amber-700",
  Zor:   "bg-destructive/10 text-destructive",
};

export interface Reward {
  id: string;
  title: string;
  brand: string;
  description: string;
  karmaRequired: number;
  category: "food" | "education" | "culture" | "shopping";
  emoji: string;
}

export const REWARDS: Reward[] = [
  { id: "r1", title: "%15 Kahve İndirimi",    brand: "Kahve Dünyası", description: "Tüm içeceklerde geçerli tek kullanımlık indirim kodu.",       karmaRequired: 300,  category: "food",      emoji: "☕" },
  { id: "r2", title: "Ücretsiz Online Kurs",  brand: "Udemy",         description: "Seçili kurslardan birini ücretsiz al.",                       karmaRequired: 750,  category: "education", emoji: "🎓" },
  { id: "r3", title: "Müze Giriş Bileti",     brand: "İstanbul Kültür", description: "Tüm İstanbul müzelerine 1 ücretsiz giriş.",                 karmaRequired: 1500, category: "culture",   emoji: "🏛️" },
  { id: "r4", title: "%10 Market İndirimi",   brand: "Migros",        description: "Migros uygulama üzerinden geçerli indirim kuponu.",            karmaRequired: 500,  category: "shopping",  emoji: "🛒" },
  { id: "r5", title: "Sinema Bileti",         brand: "Cinemaximum",   description: "Tüm salonlarda geçerli 1 ücretsiz sinema bileti.",            karmaRequired: 600,  category: "culture",   emoji: "🎬" },
  { id: "r6", title: "Yemek Sepeti Kuponu",   brand: "Yemeksepeti",   description: "Minimum 150₺ siparişlerde 50₺ indirim.",                     karmaRequired: 400,  category: "food",      emoji: "🍔" },
];
