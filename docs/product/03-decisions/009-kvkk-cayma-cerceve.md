# 009. KVKK + 14 Gün Cayma Hakkı Uygulama Çerçevesi

**Tarih:** 2026-04-24
**Durum:** **Proposed** ⏳ — Hukuki mütalaa (avukat paketi, `docs/strategy/06-memos/2026-04-24-hukuki-mutalaa-brief.md`) cevabı sonrası Accepted'a dönüştürülecek.
**Önerici:** product-analyst + strategy-consultant (Q10 + Q11 + Q13 + Q37 birleşik)

## Bağlam

V1'de iki ayrı kullanıcı-veri paylaşım senaryosu var:

- **A) Paralı üyelik** (TEMA yıllık ₺256, HAYTAP aylık ₺50 gibi) — sürekli ilişki, finansal taahhüt, Tüketici Kanunu 6502 mesafeli sözleşme alanına düşebilir.
- **B) Public mission katılımı** (sahil temizliği, kan bağışı vb., Yol D `access_level='public'`) — tek seferlik, finansal yok, sadece kişisel veri paylaşımı (ad, e-posta, şehir).

Her iki senaryo farklı KVKK + sözleşme rejimine ihtiyaç duyuyor. Mevcut bileşenler (`components/membership/kvkk-checkbox.tsx`, `CaymaBanner`) **A** senaryosu için hazır; **B** için inline hafif onay pattern'ı lazım.

**Hukuki ön soru (avukat paketi):**
- BDDK 6493 bağış aracılığı muafiyeti kapsamı (embedded/passthrough/marketplace modlara göre)
- KVKK veri sorumluluğu kim — İyiBiri, STK, yoksa ortak sorumlu
- Bağış 14 gün cayma hakkı kapsamında mı — paralı üyelik VS salt bağış farkı

## Karar

### A) Paralı üyelik için **tam KVKK + sözleşme + cayma çerçevesi**

NGO membership parametric flow (mevcut hazır):
1. **Çifte KVKK onayı** — (a) veri paylaşım rızası + (b) üyelik sözleşmesi onayı. İki ayrı checkbox.
2. **14 gün cayma hakkı** — `CaymaBanner` component'i göster. Üyelik tamamlanınca kullanıcı profilinde "cayma hakkı kalan: X gün" görünür.
3. **STK'nın yasal dokümanları**:
   - KVKK Aydınlatma Metni (PDF upload, `ngos.kvkk_document_url`, migration 016)
   - Üyelik Sözleşmesi (PDF upload, `ngos.membership_contract_url`)
   - Bunlar yüklenmemişse pilot başlayamaz — hard gate
4. **Server action** `initiateMembership` — consent'leri kaydetmeden önce her iki checkbox `true` değilse `code='CONSENT_REQUIRED'` döner.

### B) Public mission katılımı için **hafif inline KVKK onayı**

`access_level='public'` görevlerinde:
1. **Tek satır inline metin:**
   > "Bu göreve katıldığında ad, e-posta ve şehir bilgin **[STK adı]** ile paylaşılacak. [Detaylı metin ↗]"
2. **Tek checkbox** — sözleşme yok, cayma yok (finansal yok).
3. **"Detaylı metin" linki** — STK'nın `ngos.volunteer_consent_url` PDF'ini açar (yoksa platformun standart hafif-KVKK metnini).
4. Mission detail idle state'te, "Göreve katıl" butonundan önce gösterilir.

### Veri sorumluluğu (avukat onayı sonrası netleşir)

**Önerilen pozisyon (mütalaa onayı bekliyor):** **Ortak veri sorumlusu** — İyiBiri kullanıcıdan veriyi toplar, STK'ya aktarır; her iki tarafın KVKK m.11 hak taleplerine ayrı ayrı cevap vermesi gerekir.

**STK ile Veri Paylaşım Sözleşmesi şablonu** — Her pilot STK ile imzalanacak standart şablon (avukat hazırlayacak).

### Cayma hakkı uygulama

**Paralı üyelik:**
- Cayma süresi 14 gün, `ngos.membership_fee_config.cooling_off_days` konfigüre edilebilir
- `cancelMembership(referralId, reason?)` server action 14 gün penceresinde çalışır, sonrasında "STK ile iletişime geç" hata döner
- Refund platform üzerinden değil, STK tarafında (passthrough/embedded modlar) — ADR-008 gereği
- Marketplace modunda platform refund API çağırır (iyzico cancel endpoint)

**Salt bağış (donation_based mode):**
- Cayma hakkı **yok** (avukat onayı bekliyor) — bağış iade geleneksel olarak yapılmaz
- Ancak KVKK rıza geri alınabilir → kullanıcı "veri sil" talep ettiğinde STK'ya forward

## Sonuçlar

**Pozitif:**
- İki farklı kullanıcı senaryosuna uygun UX — friction minimized
- Yasal korumanın minimum + yeterlik dengesi
- STK'nın yasal doküman yüklemesi zorunlu → pilot başlamadan uyumluluk sağlanır
- KVKK hakları için net süreç (hem İyiBiri hem STK)

**Negatif:**
- STK dokümanlarını yüklemezse onboarding gecikir (biz yardım ederiz ama ayrı iş)
- "Ortak veri sorumlusu" rejimi iki taraflı hak talep süreci → karmaşık implementation (V2 otomatik, V1 manuel)
- Avukat onayı beklenirken 2-3 hafta belirsizlik (pilot Mayıs ortasına yetişir hedefi)

**Riskler:**
- Avukat "tam KVKK + cayma bağışta da gerek" derse UI revizesi (CaymaBanner donation-based'te de göster) — küçük değişiklik
- "Ortak veri sorumlusu" kabul edilmezse, İyiBiri veri işleyici (processor) rolüne düşer — sözleşme şablonu basitleşir

## Referanslar

- Hukuki mütalaa brief: `docs/strategy/06-memos/2026-04-24-hukuki-mutalaa-brief.md`
- Karar kuyruğu Q10, Q11, Q13, Q37: `docs/_decisions-queue.md`
- Migration 016 doküman kolonları: `supabase/migrations/016_ngo_documents_verify_simplify.sql`
- NGO membership parametric UI spec: `docs/ui/01-specs/2026-04-24-ngo-uyelik-parametric-ui-spec.md`
- ADR-007 (parametric fee), ADR-008 (payment routing)

## Sonraki adım

Avukat mütalaa görüşmesi sonrası:
1. Hukuki pozisyon doğrulanır → bu ADR Accepted'a dönüşür
2. Mission detail idle state'te public KVKK hafif onay UI yazılır (`components/mission/public-kvkk-consent.tsx` yeni)
3. STK Veri Paylaşım Sözleşmesi şablonu hazırlanır — onboarding'de her pilot STK ile imzalanır
4. Donation-based için cayma hakkı karar netleşir → `CaymaBanner` parametric rendering
