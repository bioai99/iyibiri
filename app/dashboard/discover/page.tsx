// Vol-45 (2026-05-02): Discover route deprecated.
// Bottom nav'dan kaldırıldı; route hâlâ erişilebilirdi (eski link'ler,
// post detail back butonu, PostsRail "HEPSI →" link'i hep buraya
// düşüyordu). Tüm bu yollar artık dashboard'a redirect olur — discover
// sayfası tamamen ölü kod sayılır, ama tarihsel link'leri bozmamak için
// soft-redirect ediyoruz.

import { redirect } from 'next/navigation'

export default function DiscoverPage() {
  redirect('/dashboard')
}
