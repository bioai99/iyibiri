const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://oskenoydnhscegrnrqca.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9za2Vub3lkbmhzY2Vncm5ycWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM4NTEwMSwiZXhwIjoyMDg5OTYxMTAxfQ.jfpniKRt7igJ9a_QVb2wAEYNHafR7Sl7BuE0eMWXuwg'
);

async function main() {
  // Add IBB
  const ibb = {
    id: 'ibb',
    name: 'İstanbul Büyükşehir Belediyesi',
    short_name: 'İBB',
    tagline: 'İstanbul için gönüllü ol',
    description: 'İBB Gönüllüleri programı — İstanbul için sosyal sorumluluk projeleri',
    category: 'social',
    color_accent: '#1B3A5C',
    logo_url: null,
    website: 'https://gonullu.ibb.istanbul',
    member_count: 2500000,
    volunteer_count: 85000,
    founded: 1930
  };

  console.log('Inserting IBB NGO...');
  const { data: ngoData, error: ngoError } = await supabase
    .from('ngos')
    .upsert(ibb, { onConflict: 'id' })
    .select();

  if (ngoError) {
    console.error('NGO insert error:', ngoError);
    process.exit(1);
  }
  console.log('IBB NGO inserted:', ngoData);

  // Add IBB missions
  const ibbMissions = [
    {
      id: 'ibb-park-cleanup',
      title: 'İstanbul Park Bakımı',
      description: 'İBB parkları için çiçek dikimi ve bakım çalışması',
      long_description: 'İBB Park ve Bahçeler Müdürlüğü koordinasyonunda İstanbul parklarında çiçek dikimi, çim bakımı ve peyzaj düzenleme.',
      ngo_id: 'ibb',
      category: 'Çevre',
      difficulty: 'easy',
      karma: 180,
      duration: '3 saat',
      domain: 'nature',
      style: 'outside',
      verify_method: 'qr',
      verify_code: 'IBB-PARK-26',
      featured: true,
      steps: JSON.stringify(['Parka gel', 'Malzemeleri al', 'Dikimi yap', 'QR tara']),
      impact_statement: 'Her çiçek şehri güzelleştirir, her park nefes aldırır',
      participants: 1240,
      photo_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80',
      location: 'Emirgan, İstanbul',
      date_label: 'Her hafta sonu',
      spots_left: 30
    },
    {
      id: 'ibb-elderly-care',
      title: 'Komşuma Yardım',
      description: 'Yaşlı komşuna market alışverişi yap',
      long_description: 'İBB Sosyal Hizmetler koordinasyonunda yaşlı veya engelli komşulara market alışverişi, ilaç temini gibi günlük ihtiyaçlarda destek.',
      ngo_id: 'ibb',
      category: 'Topluluk',
      difficulty: 'easy',
      karma: 150,
      duration: '1 saat',
      domain: 'social',
      style: 'outside',
      verify_method: 'photo',
      featured: true,
      steps: JSON.stringify(['İhtiyaç listesini al', 'Alışverişi yap', 'Teslim et', 'Fotoğraf çek']),
      impact_statement: 'Bir alışveriş bir yaşlının bağımsızlığını korur',
      participants: 890,
      photo_url: 'https://images.unsplash.com/photo-1516733968668-dbdce39c0651?w=800&q=80',
      location: 'İstanbul geneli',
      date_label: 'Her gün',
      spots_left: 50
    },
    {
      id: 'ibb-library',
      title: 'Kütüphane Gönüllüsü',
      description: 'İBB kütüphanesinde çocuklara okuma saati yap',
      long_description: 'İBB kütüphanelerinde çocuklara hikaye okuma, kitap tanıtma ve okuma alışkanlığı kazandırma etkinliği.',
      ngo_id: 'ibb',
      category: 'Eğitim',
      difficulty: 'medium',
      karma: 200,
      duration: '1.5 saat',
      domain: 'education',
      style: 'outside',
      verify_method: 'code',
      verify_code: 'IBB-KTP-26',
      featured: false,
      steps: JSON.stringify(['Kütüphaneye git', 'Kitap seç', 'Okuma saati yap', 'Kod al']),
      impact_statement: 'Erken okuma alışkanlığı hayat boyu öğrenmeyi başlatır',
      participants: 234,
      photo_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
      location: 'Beyoğlu, İstanbul',
      date_label: 'Çarşamba 15:00',
      spots_left: 8
    }
  ];

  console.log('Inserting IBB missions...');
  const { data: missionData, error: missionError } = await supabase
    .from('missions')
    .upsert(ibbMissions, { onConflict: 'id' })
    .select();

  if (missionError) {
    console.error('Mission insert error:', missionError);
    process.exit(1);
  }
  console.log('IBB missions inserted:', missionData);
  console.log('Done!');
}

main();
