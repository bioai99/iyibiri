import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const ngos = [
  { id: 'tema', name: 'TEMA Vakfı', short_name: 'TEMA', tagline: 'Doğayı ve toprağı koruyoruz', description: 'Türkiye Erozyonla Mücadele, Ağaçlandırma ve Doğal Kaynakları Koruma Vakfı', category: 'nature', color_accent: '#10B981', logo_url: 'https://logo.clearbit.com/tema.org.tr', website: 'https://tema.org.tr', member_count: 800000, volunteer_count: 12000, founded: 1992 },
  { id: 'cydd', name: 'ÇYDD', short_name: 'ÇYDD', tagline: 'Eğitimde fırsat eşitliği için', description: 'Çağdaş Yaşamı Destekleme Derneği — eğitim bursları ve kadın hakları', category: 'education', color_accent: '#3B82F6', logo_url: 'https://logo.clearbit.com/cydd.org.tr', website: 'https://cydd.org.tr', member_count: 120000, volunteer_count: 8000, founded: 1989 },
  { id: 'haytap', name: 'Haytap', short_name: 'Haytap', tagline: 'Hayvan hakları için mücadele', description: 'Hayvan Hakları Federasyonu — sokak hayvanlarının korunması', category: 'animals', color_accent: '#F59E0B', logo_url: 'https://logo.clearbit.com/haytap.org', website: 'https://haytap.org', member_count: 45000, volunteer_count: 3500, founded: 2006 },
  { id: 'kodluyoruz', name: 'Kodluyoruz', short_name: 'Kodluyoruz', tagline: 'Teknolojiyle geleceği kodluyoruz', description: 'Dezavantajlı bireylere ücretsiz yazılım eğitimi', category: 'education', color_accent: '#8B5CF6', logo_url: 'https://logo.clearbit.com/kodluyoruz.org', website: 'https://kodluyoruz.org', member_count: 25000, volunteer_count: 2000, founded: 2019 },
  { id: 'kizilay', name: 'Kızılay', short_name: 'Kızılay', tagline: 'İnsanlık adına', description: 'Türk Kızılay — insani yardım ve kan bağışı', category: 'health', color_accent: '#EF4444', logo_url: 'https://logo.clearbit.com/kizilay.org.tr', website: 'https://kizilay.org.tr', member_count: 1200000, volunteer_count: 45000, founded: 1868 },
]

const missions = [
  { id: 'beach-cleanup', title: 'Sahil Temizliği', description: 'En yakın sahilde 2 saatlik temizlik etkinliğine katıl', long_description: 'TEMA gönüllüleriyle birlikte sahil temizliği yaparak deniz ekosistemini koru.', ngo_id: 'tema', category: 'nature', difficulty: 'medium', karma: 200, duration: '2 saat', domain: 'nature', style: 'outside', verify_method: 'qr', verify_code: 'TEMA2026', verify_hint: 'Etkinlik alanındaki TEMA standında QR kodu tara', featured: true, steps: JSON.stringify(['Etkinlik alanına git', 'TEMA standından materyal al', 'Temizlik yap', 'QR kodu tara']), impact_statement: 'Her 1 kg atık denizden 100 deniz canlısını kurtarır', participants: 342 },
  { id: 'reading-support', title: 'Okuma Desteği', description: 'İlkokul öğrencisine online okuma desteği ver', long_description: 'ÇYDD platformu üzerinden bir ilkokul öğrencisiyle haftalık 1 saatlik online okuma seansı yap.', ngo_id: 'cydd', category: 'education', difficulty: 'medium', karma: 250, duration: '1 saat/hafta', domain: 'education', style: 'remote', verify_method: 'code', verify_code: 'CYDD-READ-2026', verify_hint: 'ÇYDD platformundan aldığın seans tamamlama kodunu gir', featured: true, steps: JSON.stringify(['ÇYDD platformuna kayıt ol', 'Öğrenci eşleşmesini bekle', 'Seansı tamamla', 'Kod al ve gir']), impact_statement: "Okuma desteği alan öğrencilerin %78'i okul başarısını artırıyor", participants: 128 },
  { id: 'shelter-donation', title: 'Barınak Bağışı', description: 'Hayvan barınağına mama veya malzeme bağışı yap', long_description: 'En yakın Haytap destekli barınağa mama, oyuncak veya temizlik malzemesi götür.', ngo_id: 'haytap', category: 'animals', difficulty: 'easy', karma: 100, duration: '30 dakika', domain: 'social', style: 'outside', verify_method: 'photo', verify_hint: 'Barınakta bağışını teslim ederken fotoğraf çek', featured: false, steps: JSON.stringify(['Barınak adresini bul', 'Bağışını hazırla', 'Barınağa götür', 'Fotoğraf çek ve yükle']), impact_statement: 'Her bağış bir hayvanın 1 haftalık beslenmesini karşılıyor', participants: 89 },
  { id: 'code-mentoring', title: 'Kod Mentorluğu', description: 'Kodluyoruz öğrencisine 1 saatlik online mentorluk yap', long_description: 'Kodluyoruz bootcamp öğrencisine yazılım geliştirme konusunda birebir mentorluk ver.', ngo_id: 'kodluyoruz', category: 'education', difficulty: 'hard', karma: 400, duration: '1 saat', domain: 'education', style: 'remote', verify_method: 'code', verify_code: 'KODL-MENTOR-26', verify_hint: 'Mentorluk platformundan tamamlama kodunu al', featured: true, steps: JSON.stringify(['Kodluyoruz mentor platformuna başvur', 'Öğrenci eşleşmesini al', 'Seansı tamamla', 'Kod gir']), impact_statement: "Mentorluk alan öğrencilerin %85'i işe yerleşiyor", participants: 67 },
  { id: 'blood-donation', title: 'Kan Bağışı', description: 'En yakın Kızılay merkezinde kan bağışı yap', long_description: 'Kızılay kan bağışı merkezine giderek kan ver. Her bağış 3 kişinin hayatını kurtarabilir.', ngo_id: 'kizilay', category: 'health', difficulty: 'easy', karma: 300, duration: '45 dakika', domain: 'social', style: 'outside', verify_method: 'qr', verify_code: 'KIZL-KAN-2026', verify_hint: "Kan bağışı sonrası verilen sertifikadaki QR kodu tara", featured: true, steps: JSON.stringify(['Kızılay merkezine git', 'Kayıt ol', 'Kan ver', "Sertifikadaki QR'ı tara"]), impact_statement: 'Bir ünite kan 3 kişinin hayatını kurtarır', participants: 521 },
  { id: 'tree-planting', title: 'Fidan Dikimi', description: 'TEMA fidan dikimi etkinliğine katıl', long_description: "TEMA'nın düzenlediği toplu fidan dikimi etkinliğine katılarak ormansızlaşmaya karşı dur.", ngo_id: 'tema', category: 'nature', difficulty: 'easy', karma: 150, duration: '3 saat', domain: 'nature', style: 'outside', verify_method: 'auto', verify_hint: 'Etkinliğe katılımın otomatik olarak doğrulanır', featured: false, steps: JSON.stringify(['Etkinliğe kayıt ol', 'Etkinlik alanına git', 'Fidan dik']), impact_statement: 'Her fidan 20 yılda 1 ton CO2 emer', participants: 203 },
]

const rewards = [
  { id: 'starbucks-coffee', title: 'Ücretsiz Kahve', brand: 'Starbucks', brand_logo: 'https://logo.clearbit.com/starbucks.com', description: "Herhangi bir Starbucks'ta grande boy içecek", karma_required: 500, category: 'food' },
  { id: 'migros-voucher', title: '50 TL Alışveriş Kuponu', brand: 'Migros', brand_logo: 'https://logo.clearbit.com/migros.com.tr', description: 'Migros mağazalarında geçerli 50 TL indirim kuponu', karma_required: 750, category: 'shopping' },
  { id: 'trendyol-discount', title: '%20 İndirim Kodu', brand: 'Trendyol', brand_logo: 'https://logo.clearbit.com/trendyol.com', description: "Trendyol'da tüm alışverişte %20 indirim", karma_required: 600, category: 'shopping' },
  { id: 'cinema-ticket', title: 'Film Bileti', brand: 'Cinemaximum', brand_logo: 'https://logo.clearbit.com/cinemaximum.com', description: 'Herhangi bir Cinemaximum sinemasında 1 film bileti', karma_required: 400, category: 'culture' },
  { id: 'nike-discount', title: '%15 İndirim', brand: 'Nike', brand_logo: 'https://logo.clearbit.com/nike.com', description: "Nike.com'da geçerli %15 indirim kodu", karma_required: 1000, category: 'shopping' },
  { id: 'garanti-cashback', title: '25 TL Cashback', brand: 'Garanti BBVA', brand_logo: 'https://logo.clearbit.com/garantibbva.com.tr', description: 'Garanti BBVA kartına 25 TL para iadesi', karma_required: 800, category: 'financial' },
]

async function seed() {
  console.log('🌱 Seeding NGOs...')
  const { error: ngoError } = await supabase.from('ngos').upsert(ngos)
  if (ngoError) { console.error('NGO error:', ngoError); throw ngoError }
  console.log(`✅ ${ngos.length} NGOs seeded`)

  console.log('🌱 Seeding missions...')
  const { error: missionError } = await supabase.from('missions').upsert(missions)
  if (missionError) { console.error('Mission error:', missionError); throw missionError }
  console.log(`✅ ${missions.length} missions seeded`)

  console.log('🌱 Seeding rewards...')
  const { error: rewardError } = await supabase.from('rewards').upsert(rewards)
  if (rewardError) { console.error('Reward error:', rewardError); throw rewardError }
  console.log(`✅ ${rewards.length} rewards seeded`)

  console.log('🎉 Seed complete!')
}

seed().catch(console.error)
