export const metadata = {
  title: 'Kullanım Koşulları — İyiBiri',
}

export default function TermsPage() {
  return (
    <article style={{ lineHeight: 1.7, fontSize: 15 }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 500, letterSpacing: '-0.025em', margin: '0 0 16px' }}>
        Kullanım Koşulları
      </h1>
      <p style={{ opacity: 0.6, margin: '0 0 32px', fontSize: 13 }}>Son güncelleme: 26 Nisan 2026</p>

      <p>
        İyiBiri&apos;ye hoş geldin. Platformu kullanarak aşağıdaki koşulları kabul etmiş olursun.
      </p>

      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, marginTop: 32 }}>
        1. Hesap sorumluluğu
      </h2>
      <p>
        Hesabının güvenliğinden sen sorumlusun. Şifreni paylaşmamalı, hesabını başkalarına
        kullandırmamalısın.
      </p>

      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, marginTop: 32 }}>
        2. İçerik kuralları
      </h2>
      <p>Aşağıdaki içeriklere izin verilmez:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>Yanıltıcı, sahtekarlık içeren içerikler</li>
        <li>Nefret söylemi, ayrımcılık</li>
        <li>Spam, ticari reklam</li>
        <li>Yasaya aykırı her tür içerik</li>
      </ul>

      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, marginTop: 32 }}>
        3. Görev katılımı
      </h2>
      <p>
        Bir göreve katıldığında, görevi yayınlayan STK ile aranızdaki ilişki doğrudandır.
        İyiBiri yalnızca aracı platform olarak hareket eder; STK&apos;nın yükümlülüklerinden
        sorumlu değildir.
      </p>

      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, marginTop: 32 }}>
        4. Karma & ödüller
      </h2>
      <p>
        Karma puanları platform içi takdir aracıdır; nakit değeri yoktur. Ödüller bağışçı
        markaların sponsorluğu ile sunulur ve mevcudiyetine bağlıdır.
      </p>

      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, marginTop: 32 }}>
        5. Değişiklikler
      </h2>
      <p>
        Bu koşullar zaman zaman güncellenebilir. Önemli değişikliklerde e-posta ile bilgilendirme
        yapılır.
      </p>

      <p style={{ marginTop: 48, opacity: 0.6, fontSize: 13 }}>
        Bu metin MVP versiyonudur.
      </p>
    </article>
  )
}
