---
name: decision-docs
description: Karar dokümantasyonu için kılavuz. Michael Nygard formatında ADR (Architecture Decision Record) — Title, Status, Context, Decision, Consequences. RAPID (Bain) — kim hangi rolde (Recommend, Agree, Perform, Input, Decide). "Nasıl karar verilir" disiplin notları. Bir ürün / teknik / organizasyonel karar alındığında, karar kuyruğundan çıkıp onaylandığında, veya önerilecek bir karar belgelensin istendiğinde bu skill'i kullan. ADR numaralama, status transition, supersede ilişkisi, consequences yazma kuralı burada.
---

# Karar Dokümantasyonu — ADR ve RAPID

Bir kararın doğruluğu çoğu zaman karar anında değil, 6 ay sonra ortaya çıkar. O an "biz niye böyle yaptık?" dendiğinde cevap varsa takım hızlı, yoksa her karar sıfırdan tartışılır. Karar dokümanı disiplini bu maliyeti ödetmez.

## 1. ADR — Architecture (veya Product) Decision Record

Michael Nygard 2011'de önerdi. **Dört alan, kısa, markdown dosyası.** Kod repo'suyla birlikte versiyonlanır.

### Nygard şablonu

```markdown
# NNN. [Karar başlığı — emir kipi]

**Tarih:** YYYY-MM-DD
**Durum:** Proposed | Accepted | Deprecated | Superseded by NNN

## Bağlam (Context)
[Bu kararı gerektiren koşullar. Mimari, ürün, takım, dış etkenler. 1–3 paragraf.]

## Karar (Decision)
[Ne yapmaya karar verdik? Emir kipi — "[X]'i [Y] yapacağız." 1–2 paragraf.]

## Sonuçlar (Consequences)
[Bu kararın etkileri — iyi ve kötü. "[Sonuç 1]. [Sonuç 2]. ..." Tarafsız yazım.]
```

### Alan alan incelik

**Başlık — emir kipi.**
- ✅ "iyzico'yu ödeme sağlayıcı olarak kullan"
- ❌ "iyzico vs PayTR"
- ❌ "Ödeme sağlayıcısı seçimi"

Başlık kararı kendisini söyler; içerik neden + sonuç.

**Numaralama.** Sıralı tamsayı, prefix NNN. Örn. `001-iyzico-odeme.md`, `002-auth-supabase-ssr.md`. Boşluk bırakma, silinmiş ADR'yi "Superseded" et — numara yerinde kalsın.

**Status transition.**
```
Proposed → Accepted → Deprecated
              ↓
        Superseded by NNN
```
- **Proposed:** karar önerildi, onay bekliyor. `04-questions/open.md`'de aynı zamanda bir kayıt var.
- **Accepted:** onaylandı, ürün bu yoldan gidiyor.
- **Deprecated:** eskidi ama yerini alan yok. Dikkat — sadece bağlam değiştiyse.
- **Superseded by NNN:** başka ADR bunu değiştirdi. Yeni ADR'den de bu ADR'ye "Supersedes NNN" satırı düşer.

**Context.**
- "Şu anki durum" + "neden karar gerekiyor."
- Hangi seçenekler elendi? Kısa.
- Hangi kısıt karar masasında vardı? (zaman, maliyet, yasal, takım bilgisi).

**Decision.**
- Emir kipi. Geçmiş zaman değil — "karar verildi" değil, "[şunu] yapacağız."
- Seçilen yolu **bir paragraf**ta tarif et. Detaylar Tech Spec'e bırak.

**Consequences.**
- **İyi ve kötü** sonuçlar. Savunma yapma — tarafsız.
- Operasyonel: takım ne yapmak zorunda kalacak?
- Yeni öğrenme eğrisi?
- Terk edilen opsiyonların kaybı?
- Migrasyon maliyeti?

### İyiBiri ADR örneği

```markdown
# 001. iyzico'yu ödeme sağlayıcı olarak kullan

**Tarih:** 2026-04-23
**Durum:** Proposed

## Bağlam
İyiBiri bağış ve STK üyelik akışları için ödeme entegrasyonuna ihtiyaç duyuyor. Dört aday incelendi: iyzico, PayTR, Craftgate, Stripe (Stripe TR kart kabul kısıtı nedeniyle elendi). Strategy-consultant'ın `docs/strategy/03-revenue/` altındaki memoları göz önünde alındı. Birincil kriterler: MCC 8398 (charity) desteği, recurring subscription desteği, dokümantasyon kalitesi, onboarding hızı.

## Karar
iyzico'yu birincil ödeme sağlayıcı olarak kullanacağız. Bağış akışı (tek seferlik) + NGO üyelik (recurring) iyzico üzerinden yapılacak. Entegrasyon Next.js API route + Supabase Edge Function hibridi olacak.

## Sonuçlar
- Komisyon oranı ~%1.4 + 0.25 TL (ortalama) — revenue model sensitivity'ye giriyor.
- iyzico'nun recurring subscription API'si bazı TR banka kartlarında sorunlu — ilk ayda test edilmeli.
- MCC 8398 onayı için TÜSEV referansı veya benzer ihtiyaç doğabilir — onboarding'de 2–3 hafta rezerv.
- Gelecekte ikinci sağlayıcı (PayTR) fallback olarak açılabilir — ayrı ADR.
- Ekibin iyzico SDK'sı öğrenmesi gerekiyor (~1 gün).
- PayTR + Craftgate detaylı karşılaştırması `docs/strategy/03-revenue/2026-04-XX-odeme-saglayicilari.md`'ye bırakıldı.
```

## 2. Ne zaman ADR yazılır?

**Zorunlu:**
- Bir **teknoloji seçimi** yapıldığında (ödeme sağlayıcı, auth, DB, state management).
- Bir **mimari desen** kabul edildiğinde (SSR vs CSR, microservice vs monolit).
- Bir **ürün prensibi** onaylandığında (örn. "V1'de bağış yok").
- Bir **yasal çerçeve kararı** alındığında (KVKK uygulama yolu, KVKK onay çerçevesi).
- Bir **ölçümleme kararı** onaylandığında (north-star metrik tanımı).

**Yazılmaz:**
- Küçük taktik kararlar (copy değişikliği, buton rengi).
- Henüz tartışılmamış bir şey — önce RFC (öneri).
- Geri alınabilen deneysel tercihler (A/B test değişkenleri).

## 3. RAPID (Bain)

"Kim karar veriyor?" sorusunun cevabı net değilse kararlar ya verilmiyor ya da geri alınıyor. RAPID beş rolün atanmasını zorlar:

| Harf | Rol | Kim |
|---|---|---|
| **R** — Recommend | Önerir, alternatifleri analiz eder, bir önerge verir. | Genelde analist / uzman / PM |
| **A** — Agree | Öneriyi onaylar veya veto eder (hukuki, güvenlik gibi zorunlu görüşler). | İlgili alanın resmi sorumlusu |
| **P** — Perform | Kararı uygular. | Operasyon / mühendislik ekibi |
| **I** — Input | Görüş verir ama karar hakkı yok. | Etkilenen paydaşlar |
| **D** — Decide | Kararı veren tek kişi. | Yetki sahibi (bazen kurucu) |

**Anti-pattern:** "D" olmayan bir karar masası. Herkes görüş verir, kimse karar vermez, "konsensüs" aranır, karar 3 ay bekler.

**İyiBiri için pratik:** Çoğu kararın D'si kullanıcı (proje sahibi). A agent'lar "onay vermeye değil, rapor etmeye" gelir. P ise kodlayan agent.

## 4. "Nasıl karar verilir" — 5 soruluk çerçeve

Bir karar önerisi yazmadan önce:

1. **Tersine çevrilebilir mi?** Ucuz, değiştirilebilir karar → hızlı ver, küçük ADR. Geri alınamaz → uzun analiz, detaylı Consequences.
2. **Tek yönlü kapı mı, iki yönlü kapı mı?** (Amazon) — İki yönlüyse dene, yanlışsa geri al. Tek yönlüyse 5x daha fazla düşün.
3. **Zaman pahalı mı, yanlış pahalı mı?** Pazar fırsatı kısıtlıysa hızlı karar, kaliteden taviz ver. Güvenlik / yasal / ekonomik büyük sonuç ise kalite, zaman beklesin.
4. **Hangi veri / insight bu kararı değiştirir?** Yoksa yazıya dök. O veri gelmeden karar ertelenemezse, hangi varsayımı dondurduğunu açıkça yaz.
5. **Kim hesap verecek?** Karar başarısız olursa kimin defterinde görünecek? RAPID'de D'yi o belirler.

## 5. Bir kararın yaşam döngüsü

```
1. Soru doğuyor → 04-questions/open.md'ye 🔴/🟡/🟢 ile
2. Analiz gerekli mi? → strategy-consultant veya ürün-analisti araştırıyor
3. Öneri yazılıyor → ADR draft, Status: Proposed
4. Kullanıcı onayı → Status: Accepted
5. Question resolved.md'ye → workstream güncelleniyor
6. Uygulama başlıyor → eng brief / kodlama
7. Geriye dönük öğrenme → playbook'a not (ADR doğru muydu, hangi consequence gerçekleşti)
8. Gerekirse supersede → yeni ADR + eski Status: Superseded
```

Bu döngü eksiksiz çalıştığı sürece takım kararların nereden geldiğini, neden değiştiğini, sonuçların ne olduğunu izler.

## 6. Kontrol listesi — ADR bırakmadan önce

- [ ] Başlık emir kipinde mi?
- [ ] Status net mi?
- [ ] Bağlam 3 paragrafı geçmedi mi?
- [ ] Karar tek paragraflık emir kipi cümle mi?
- [ ] Sonuçlar hem iyi hem kötü listeli mi?
- [ ] Elenen alternatifler kısaca bağlamda geçti mi?
- [ ] Eğer Proposed ise, `04-questions/open.md`'de aynı zamanda kayıt var mı?
- [ ] Numara sıralı mı, boşluk bırakılmadı mı?
- [ ] Önceki ADR'yi değiştiriyorsa, Supersedes NNN notu düşüldü mü?

Checklist tam değilse ADR hazır değil.

## 7. Anti-pattern listesi

- **Novel olan her şey ADR değil.** Sık bir desene nötr bir karar alıp ADR açmak spam.
- **Bağlamsız karar.** "A'yı seçtik" diye yazmak, **niye seçildiği** olmadan, 6 ay sonra boş kalır.
- **Consequences sadece pozitif.** Satış broşürü değil, mühendislik dokümanı. Kötü sonuçları yaz.
- **ADR status'ü güncellenmiyor.** Kabul edildi ama hâlâ `Proposed`. Diskusionda kopukluk yaratır.
- **Aşırı uzun ADR.** 5 sayfa geçtiyse Tech Spec'ten kopma oluyor demektir — ADR sadece karardır, detay değil.
- **ADR içinde kod.** Kod Tech Spec'in alanı. ADR "niye" sorusunun cevabı.
