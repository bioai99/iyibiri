const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://oskenoydnhscegrnrqca.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9za2Vub3lkbmhzY2Vncm5ycWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM4NTEwMSwiZXhwIjoyMDg5OTYxMTAxfQ.jfpniKRt7igJ9a_QVb2wAEYNHafR7Sl7BuE0eMWXuwg'
);

const posts = [
  {
    ngo_id: 'tema',
    title: 'Kilyos Sahili Temizliği: 340 kg Atık Toplandı',
    summary: 'Geçen hafta sonu 28 gönüllümüzle birlikte Kilyos sahilinde 340 kg atık topladık. İşte o günden kareler.',
    content: 'Geçen cumartesi sabah 09:00\'da Kilyos sahilinde buluştuk. 28 gönüllümüz, 3 saatte 340 kg atık topladı. En çok bulunan atıklar: plastik şişe, sigara izmariti ve poşet. Sahil şimdi yeniden yüzülebilir durumda.',
    cover_image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
    category: 'story',
    read_time: 3,
    published: true,
  },
  {
    ngo_id: 'kizilay',
    title: 'Kan Bağışı Haftası Başladı',
    summary: 'Bu hafta tüm Türkiye\'de kan bağışı seferberliği. En yakın Kızılay merkezine gel, hayat kurtar.',
    cover_image_url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
    category: 'update',
    read_time: 2,
    published: true,
  },
  {
    ngo_id: 'haytap',
    title: 'Kışa Hazırlık: Sokak Hayvanları İçin Yapabilecekleriniz',
    summary: '5 basit adımda sokak hayvanlarının kışı daha rahat geçirmesine yardımcı olabilirsiniz.',
    content: '1. Mama ve su kapları bırakın. 2. Kullanılmayan battaniyeleri barınaklara bağışlayın. 3. Yaralı hayvan görürseniz Haytap hattını arayın. 4. Komşularınızı da bilinçlendirin. 5. Barınak gönüllüsü olun.',
    cover_image_url: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=800&q=80',
    category: 'tip',
    read_time: 4,
    published: true,
  },
  {
    ngo_id: 'cydd',
    title: 'Eğitimde Fırsat Eşitliği: 2026 Burs Başvuruları Açıldı',
    summary: 'ÇYDD olarak bu yıl 5.000 öğrenciye burs vermeyi hedefliyoruz. Gönüllü mentör olmak ister misiniz?',
    cover_image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    category: 'update',
    read_time: 3,
    published: true,
  },
  {
    ngo_id: 'kodluyoruz',
    title: 'Mezunlarımızdan: "Kodlama Hayatımı Değiştirdi"',
    summary: 'Kodluyoruz bootcamp mezunu Elif, şimdi bir teknoloji şirketinde yazılım geliştirici olarak çalışıyor.',
    cover_image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    category: 'story',
    read_time: 5,
    published: true,
  },
  {
    ngo_id: 'ibb',
    title: 'İstanbul Parkları Çiçek Açıyor',
    summary: 'İBB Gönüllüleri ile birlikte 42 parkta 15.000 çiçek dikildi. İşte en güzel kareler.',
    cover_image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80',
    category: 'story',
    read_time: 3,
    published: true,
  },
  {
    ngo_id: 'tema',
    title: 'Ağaç Dikmenin 7 Faydası',
    summary: 'Bir ağaç yılda 22 kg CO2 emer, 100 litre su filtreler. İşte ağaç dikmenin bilmediğiniz faydaları.',
    cover_image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
    category: 'article',
    read_time: 4,
    published: true,
  },
  {
    ngo_id: 'kizilay',
    title: 'Gönüllü Olmak Neden İyi Hissettirir?',
    summary: 'Bilimsel araştırmalar, gönüllülük yapan insanların daha mutlu ve sağlıklı olduğunu gösteriyor.',
    cover_image_url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
    category: 'article',
    read_time: 6,
    published: true,
  },
];

async function main() {
  // First check if posts already exist to avoid duplicates
  const { data: existing } = await supabase
    .from('posts')
    .select('title')
    .limit(1);

  if (existing && existing.length > 0) {
    console.log('Posts already exist, clearing first...');
    await supabase.from('posts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  }

  console.log('Inserting blog posts...');
  const { data, error } = await supabase
    .from('posts')
    .insert(posts)
    .select();

  if (error) {
    console.error('Post insert error:', error);
    process.exit(1);
  }
  console.log(`${data.length} posts inserted successfully!`);
  data.forEach(p => console.log(`  - ${p.title}`));
  console.log('Done!');
}

main();
