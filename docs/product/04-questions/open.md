# Açık Kararlar Kuyruğu — CANONICAL

> **Bu dosya canonical.** Tüm açık soruların tek kaynağıdır. Tartışmalı/geniş format için: [`docs/_decisions-queue.md`](../../_decisions-queue.md) (working doc, canonical değil).
>
> **Güncel:** 2026-04-24 — 8 ADR Accepted, 13 soru çözüldü → `resolved.md`. Aşağıda sadece hâlâ açık olanlar.
>
> **Protokol:** [`.claude/skills/agent-communication-protocol/SKILL.md`](../../../.claude/skills/agent-communication-protocol/SKILL.md) Katman E.

## ADR Accept workflow — 5-dosya atomic checklist

Bir ADR `Proposed` → `Accepted` transition'ında agent **5 adımı atomic yapar**. Eksik = drift.

1. **ADR dosyası** — `docs/product/03-decisions/NNN-slug.md` status `Proposed` → `Accepted` + tarih + onay notu.
2. **open.md (bu dosya)** — ilgili soruyu bul, satırı sil (veya strikethrough).
3. **resolved.md** — yeni satır: `✅ QN — [başlık] — ADR-NNN — [cevap özeti 1 satır]`.
4. **İlgili workstream** — `docs/product/01-workstreams/*.md` — ADR referansı ekle.
5. **Status board** — `docs/_status-board.md` — karar bekleyen iş uygun kolona taşı.

**Plus:** ADR dosyasının "Handoff log" bölümüne (Katman A) kim onayladı + hangi implementation tetiklediği eklenir.

---

## Seviyeler

- 🔴 **Critical** — cevap gelmeden adım atılamaz.
- 🟡 **Important** — scope'u etkiler, varsayımla devam edilebilir.
- 🟢 **Info** — iyi bilinse iyi, iş beklemiyor.

## Açık (14 soru)

### Hukuki / Dış iş (kullanıcı + avukat)

| # | Seviye | Konu | Durum |
|---|---|---|---|
| Q10 | 🔴 | Bağış aracılığı KDV/BDDK/KVKK çerçevesi | ADR-008 Marketplace mode için hukuki mütalaa. Aggregator muaf ama detay avukat kontrolü şart. |
| Q11 | 🔴 | Makbuz STK → İyiBiri veri akışı garantisi | Embedded modda STK processor kesiyor — API vs admin kuyruk karar. WS-03 kapsamı. |
| Q13 | 🟡 | Bağışta 14 gün cayma hakkı geçerli mi | Hukuki mütalaa — tüketici vs bağış kategorisi ayrımı. |
| Q37 | 🟡 | Fonzip User Agreement 3. taraf embed kısıtı | Yol D.2 (silent technical) için avukat okuması. |
| Q38 | 🟡 | Trademark "İyiBiri" başvurusu bu ay | Türk Patent. ₺3-5k, 3-6 ay süreç. |
| Q39 | 🟢 | Mutual NDA template hazırlığı | Avukat şablonu. Kullanılmazsa kullanılmaz. |

### Workstream içi kararlar (ürün + eng)

| # | Seviye | Konu | Workstream |
|---|---|---|---|
| Q6 | 🟡 | Domain enum migration detay | WS-05 (taxonomy schema) |
| Q7 | 🟡 | Karma Impact multiplier karar yetkisi | WS-05 |
| Q8 | 🟢 | SDG mapping zorunlu mu opsiyonel | WS-05 |
| Q9 | 🟢 | Geriye dönük Karma yeniden hesap | WS-05 |
| Q16 | 🟡 | Auto-renew default on/off | WS-03 |
| Q17 | 🟡 | STK admin UI min/orta/tam kapsam | WS-02 |
| Q20 | 🟡 | Vergi beyannamesi checkbox yeri | UX brief |
| Q26 | 🟢 | TEGV pre-screening ürün değişimi | WS-02 |

### İleri zaman / 2. dalga

| # | Seviye | Konu | Zaman |
|---|---|---|---|
| Q14 | 🟢 | Kurumsal bağışçı ayrı akış mi | Yıl 2+ |
| Q18 | 🟢 | Multi-NGO bundle ne zaman | Yıl 2 |
| Q19 | 🟢 | 3 katmanlı üyelik isimlendirme | UX brief |
| Q21 | 🟢 | Yıllık makbuz özeti format | V2 |
| Q22 | 🟢 | Muhasebeci entegrasyon | Yıl 3+ |
| Q24 | 🟡 | Kızılay gonulluol.org deeplink fizibilite | Yıl 1 sonu |
| Q29 | 🟡 | Pass-through SaaS fee tier yapısı | Pilot sonrası müzakere |
| Q30 | 🟡 | Pass-through attribution webhook vs CSV | WS-03 kapsamı |
| Q31 | 🔴 | STK processor API key paylaşımı güvenlik | WS-03 kapsamı + Supabase Vault |
| Q32 | 🟡 | Capacitor mobile iframe recurring test | Pilot 1 STK ile |
| Q34 | 🟡 | Faz 2 STK admin tool kapsam | Faz 1 pilot sonrası |
| Q35 | 🟢 | Fonzip migration tool Yıl 2 | Yıl 2 |

---

## Bloklayıcı durum

- **Ürün dev ilerleyebilir** — ADR-001, ADR-003, ADR-004, ADR-005, ADR-007, ADR-008 Accepted + migration + coming-soon banner + fonzip partnership stratejisi hazır.
- **Hukuki mütalaa yan iş** — Q10, Q11, Q13, Q37 (avukat); Q38 (Türk Patent başvuru) paralel ilerlerse dev hızını blocklemiyor.
- **Pilot STK temas** — TEMA pitch yazıldı, sen iletmeyi onayladığında başlıyor.

---

## Sonraki dalga ADR adayları

- **ADR-009 — KVKK çifte onay + 14 gün cayma hakkı uygulama çerçevesi** (Q10+Q11+Q13 hukuki mütalaa sonrası)
- **ADR-010 — STK admin UI V1 kapsam** (Q17+Q34+Q26 birleşik)
- **ADR-011 — Karma ekonomisi kalibrasyonu** (Q6+Q7+Q9 birleşik)

Bunlar Faz 2 agent'larının çıkardığı verilerle olgunlaşacak.
