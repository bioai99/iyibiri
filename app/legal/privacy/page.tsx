export const metadata = {
  title: 'Gizlilik Politikası — İyiBiri',
}

export default function PrivacyPage() {
  return (
    <article style={{ lineHeight: 1.7, fontSize: 15 }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 500, letterSpacing: '-0.025em', margin: '0 0 16px' }}>
        Gizlilik Politikası
      </h1>
      <p style={{ opacity: 0.6, margin: '0 0 32px', fontSize: 13 }}>Son güncelleme: 26 Nisan 2026</p>

      <p>
        İyiBiri olarak gizliliğinize değer veriyoruz. Bu politika, kişisel verilerinizi nasıl
        topladığımızı, kullandığımızı ve koruduğumuzu açıklar.
      </p>

      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, marginTop: 32 }}>
        Topladığımız bilgiler
      </h2>
      <ul style={{ paddingLeft: 24 }}>
        <li><strong>Hesap bilgileri:</strong> ad, e-posta, şifre (hash&apos;lenmiş)</li>
        <li><strong>Profil bilgileri:</strong> şehir, yaş aralığı, ilgi alanları</li>
        <li><strong>Aktivite verisi:</strong> tamamlanan görevler, karma, seri</li>
        <li><strong>Teknik veriler:</strong> cihaz bilgisi, IP adresi (anonimize)</li>
      </ul>

      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, marginTop: 32 }}>
        Çerez kullanımı
      </h2>
      <p>
        Yalnızca işlevsellik için gereken çerezleri kullanırız (oturum, tercih). Üçüncü taraf
        izleme çerezi kullanmıyoruz.
      </p>

      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, marginTop: 32 }}>
        Veri saklama
      </h2>
      <p>
        Verilerinizi hesabınız aktif olduğu sürece saklarız. Hesabınızı sildiğinizde veriler
        30 gün içinde anonimleştirilir veya silinir.
      </p>

      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, marginTop: 32 }}>
        İletişim
      </h2>
      <p>
        Soru ve talepler için: <strong>privacy@iyibiri.app</strong>
      </p>

      <p style={{ marginTop: 48, opacity: 0.6, fontSize: 13 }}>
        Bu metin MVP versiyonudur.
      </p>
    </article>
  )
}
