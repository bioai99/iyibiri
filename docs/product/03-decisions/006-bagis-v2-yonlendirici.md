# 006. V1'de bağış akışı yok; V2 lansmanında yönlendirici (Seçenek A) model

**Tarih:** 2026-04-24
**Durum:** **Accepted (2026-04-24)** ✅
**Önerici:** product-analyst

## Bağlam

Mevcut ürün 4 sayfalık bağış akışına sahip ama **tümü mock** (`docs/page-audit.md` 🔴). Gerçek bağış için:
- Hukuki çerçeve (GVK m.89/4 + BDDK + KDV + KVKK) açık değil.
- Ödeme sağlayıcı seçimi (ADR-002 iyzico) onboarding süresi 2-3 hafta.
- Her STK'nın makbuz kesme kapasitesi değişken.
- Statülü vs statüsüz STK kullanıcı uyarısı UI'da tanımsız.

Strateji memosu (`docs/strategy/03-revenue/2026-04-23-bagis-ekosistemi-hukuki-operasyonel.md`) 3 mimari seçenek tanımladı:
- **A) Yönlendirici:** Kart bilgisi STK'nın ödeme sayfasına, para doğrudan STK'ya, makbuz STK'dan.
- **B) Escrow/aracı:** Para İyiBiri'ye → komisyon → STK; makbuz akışı karmaşık.
- **C) Vakıf:** İyiBiri vakıf kurar, kendi makbuz keser (3-5 yıl süreç).

## Karar

**V1'de bağış akışı yok. V2 lansmanında Seçenek A (yönlendirici) + %0 platform fee ile bağış aktif olur. Yıl 2 sonunda Seçenek B'ye evrim değerlendirilir.**

Operasyonel:
- `/dashboard/donations/*` 4 sayfa V1'de **canlı değil** — mock etiketi kaldırıldıktan sonra "Yakında" placeholder veya route temizliği.
- V2 öncesi Workstream 7 açılır (V2 bağış yönlendirici akışı) — hukuki mütalaa + `ngos.donation_url` alan + deep link handler.
- **"100% aktarım" ürün vaadi** V2 primary pazarlama mesajı — platform fee yok.
- Bağış UI'da "Vergi indirimli ✓" etiketi sadece statülü (kamu yararı + muafiyet) STK'larda.

## Sonuçlar

**İyi:**
- V1 scope dar → lansman hızlı (4 mock sayfa karmaşa yaratmıyor).
- Hukuki risk minimum (para İyiBiri'yi görmüyor).
- "100% aktarım" marka vaadi + Charity Miles benchmark'ına yakın konum.
- V2 lansmanı = yeni PR vesilesi.

**Kötü:**
- V1'de gelir R3 (bağış fee) yok — zaten secondary kol, kritik değil.
- Kullanıcı deneyimi bölünür (STK sitesine gidiş/dönüş) — UX kalitesi düşük.
- Attribution zor — İyiBiri'nin getirdiği bağışı ölçmek için callback/return URL trigger.
- Bazı STK'ların kendi ödeme altyapısı olmayabilir — yönlendirici model onlar için çalışmaz.

**Uygulama:**

**V1 temizliği (ADR onaylanınca hemen):**
- `/dashboard/donations/*` sayfalarını `/dashboard/donations/coming-soon.tsx`'e yönlendir veya menüden kaldır.
- Mock veri (`lib/mock-data.ts` içinde donation alanları) temizle veya V2 için arşivle.
- Landing + discover'da "bağış" CTA temporary olarak "yakında" et.

**V2 Workstream 7 kapsamı:**
- `ngos` tablosuna `donation_url text` alanı.
- Deep link handler: `/dashboard/ngos/[id]/donate` → STK donation_url'sine yönlendirir, `?source=iyibiri&user_id=x` parametresi ile.
- Return callback: STK webhook veya return URL → İyiBiri'de "bağış yaptın, +50 Karma bonus" (bonus tartışmalı — Q ayrı).
- UI'da `ngos.tax_exempt: boolean` alanına göre "Vergi indirimli ✓" etiketi.

**Bağlı kararlar:**
- ADR-002 (iyzico) V2'de bağış için de kullanılacak (Seçenek B evrim sonrası).
- Q10 (BDDK/KVKK çerçevesi) + Q11 (makbuz veri akışı) V2 başlamadan hukuki mütalaa şart.
- Workstream 7 (V2 bağış) bu ADR'nin implementasyonu.

## Referanslar

- Strateji: `docs/strategy/03-revenue/2026-04-23-bagis-ekosistemi-hukuki-operasyonel.md`
- Strateji: `docs/strategy/03-revenue/2026-04-23-bireysel-vergi-indirimi-mekanizmasi.md`
- Atlas: `docs/project-atlas.md` Bölüm 3 (bağış 4 mock sayfa) + Bölüm 10 (teknik borç)

**İlgili sorular:** Q3 + Q12 — Proposed, kullanıcı onayı bekliyor.
