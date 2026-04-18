/* global React */
// Shared data for the 3 direction explorations.
window.IYI_V2 = {
  profile: { name: 'Ayşe Yılmaz', firstName: 'Ayşe', karma: 2340, streak: 7, completed: 12, nextTier: 'Çoook İyi Biri', karmaToNext: 1660, tierName: 'Çok İyi Biri' },
  ngos: {
    tema:       { name:'TEMA Vakfı',   short:'TEMA',       logo:'assets/logos/tema-logo.png',       cover:'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80&auto=format&fit=crop' },
    cydd:       { name:'ÇYDD',         short:'ÇYDD',       logo:'assets/logos/cydd-logo.png',       cover:'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80&auto=format&fit=crop' },
    haytap:     { name:'Haytap',       short:'Haytap',     logo:'assets/logos/haytap-logo.png',     cover:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&auto=format&fit=crop' },
    kizilay:    { name:'Türk Kızılay', short:'Kızılay',    logo:'assets/logos/kizilay-logo.png',    cover:'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80&auto=format&fit=crop' },
    kodluyoruz: { name:'Kodluyoruz',   short:'Kodluyoruz', logo:'assets/logos/kodluyoruz-logo.png', cover:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop' },
    tog:        { name:'TOG',          short:'TOG',        logo:'assets/logos/tog-logo.svg',        cover:'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80&auto=format&fit=crop' },
  },
  missions: [
    { id:'m1', ngoId:'tema',       title:'Sahil Temizliği Gönüllüsü', category:'Çevre',     karma:150, duration:'2 saat', difficulty:'Kolay', location:'İstanbul, Kilyos', date:'Bu Cumartesi',  impact:'Bu görevle bir kıyı şeridi temizlenir; deniz canlıları nefes alır.', photo:'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&q=80&auto=format&fit=crop', spotsLeft:8 },
    { id:'m2', ngoId:'cydd',       title:'Çocuklara Kitap Oku',       category:'Eğitim',    karma:250, duration:'1 saat', difficulty:'Kolay', location:'Online',          date:'Pazartesi 19:00', impact:'Bu görevle bir çocuğun okuma becerisi gelişir; geleceği şekillenir.',   photo:'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80&auto=format&fit=crop', spotsLeft:22 },
    { id:'m3', ngoId:'haytap',     title:'Barınakta Gönüllü Günü',    category:'Hayvanlar', karma:200, duration:'3 saat', difficulty:'Orta',  location:'Ankara',          date:'Hafta sonu',      impact:'Bu görevle barınaktaki bir can bugün aç kalmaz.',                        photo:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&q=80&auto=format&fit=crop', spotsLeft:3 },
    { id:'m4', ngoId:'kizilay',    title:'Kan Bağışı Kampanyası',     category:'Sağlık',    karma:300, duration:'45 dk',  difficulty:'Kolay', location:'Kadıköy',         date:'Her gün',         impact:'Bu görevle üç kişinin hayatı kurtulabilir.',                             photo:'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=900&q=80&auto=format&fit=crop', spotsLeft:15 },
    { id:'m5', ngoId:'kodluyoruz', title:'Kodlama Mentorluğu',        category:'Eğitim',    karma:350, duration:'1 saat', difficulty:'Orta',  location:'Online',          date:'Esnek',            impact:'Bu görevle bir geliştiricinin yolu açılır; sektöre bir el daha uzanır.', photo:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80&auto=format&fit=crop', spotsLeft:11 },
  ],
  fmt: (n) => n.toLocaleString('tr-TR'),
};
