export const metadata = {
  title: 'KVKK Aydınlatma Metni — İyiBiri',
}

export default function KvkkPage() {
  return (
    <article style={{ lineHeight: 1.7, fontSize: 15 }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 500, letterSpacing: '-0.025em', margin: '0 0 16px' }}>
        KVKK Aydınlatma Metni
      </h1>
      <p style={{ opacity: 0.6, margin: '0 0 32px', fontSize: 13 }}>Son güncelleme: 26 Nisan 2026</p>

      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, marginTop: 32 }}>
        1. Veri Sorumlusu
      </h2>
      <p>
        İyiBiri (&ldquo;Platform&rdquo;), 6698 Sayılı Kişisel Verilerin Korunması Kanunu
        (&ldquo;KVKK&rdquo;) kapsamında veri sorumlusu sıfatıyla hareket eder. İletişim: <strong>info@iyibiri.app</strong>
      </p>

      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, marginTop: 32 }}>
        2. İşlenen Kişisel Veriler
      </h2>
      <p>Hesap oluşturma ve gönüllülük faaliyetleri kapsamında şu veriler işlenir:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>Ad, soyad, e-posta adresi</li>
        <li>Şehir, yaş aralığı (opsiyonel)</li>
        <li>İlgi alanları (gönüllülük kategorileri)</li>
        <li>Görev katılım geçmişi, karma puanı</li>
      </ul>

      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, marginTop: 32 }}>
        3. İşleme Amaçları
      </h2>
      <ul style={{ paddingLeft: 24 }}>
        <li>Üyelik hesabınızın oluşturulması ve yönetimi</li>
        <li>Görev önerileri sunulması</li>
        <li>Sivil toplum kuruluşları (STK) ile gönüllü eşleştirilmesi</li>
        <li>Karma & ödül programının yürütülmesi</li>
      </ul>

      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, marginTop: 32 }}>
        4. Üçüncü Taraflarla Paylaşım
      </h2>
      <p>
        Bir göreve katıldığınızda, görevi yayınlayan STK ile yalnızca <strong>açık rızanız</strong>{' '}
        kapsamında ad, e-posta ve şehir bilgileriniz paylaşılır. Bu paylaşımı görev başlangıcında
        verdiğiniz veri paylaşım onayı ile gerçekleştiririz.
      </p>

      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, marginTop: 32 }}>
        5. Haklarınız
      </h2>
      <p>KVKK Madde 11 uyarınca:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>Verilerinize erişme</li>
        <li>Düzeltme talep etme</li>
        <li>Silme veya anonimleştirme talep etme</li>
        <li>İşlemeye itiraz etme</li>
      </ul>
      <p>
        Bu hakları kullanmak için <strong>privacy@iyibiri.app</strong> adresine yazabilirsiniz.
      </p>

      <p style={{ marginTop: 48, opacity: 0.6, fontSize: 13 }}>
        Bu metin MVP versiyonudur. Yasal danışmanlık alındığında genişletilecektir.
      </p>
    </article>
  )
}
