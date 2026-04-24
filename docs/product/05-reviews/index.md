# 05 — Self-Audit Raporları

Agent her tamamladığı deliverable'ı (workstream, brief, ADR) kendi checklist'inden geçirir. Bulgular ve sonuç bu klasörde.

**Dosya:** `YYYY-MM-DD-review-slug.md`

**Şablon:**

```markdown
# Review — [review edilen dosya]

**Tarih:** YYYY-MM-DD
**Reviewer:** product-analyst (self)
**Review edilen:** `docs/product/.../dosya.md`
**Sonuç:** ✅ Pass | ⚠️ Partial | ❌ Fail

## Checklist
- [x] Kapsam (in/out) MECE.
- [x] Fonksiyonlar kullanıcı değerine bağlı (JTBD).
- [ ] Başarı kriteri ölçülebilir. — "Kullanıcı memnun olur" yeterli değil.
- [x] Bağımlılıklar listelendi.
- ...

## Bulgular
1. [bulgu 1]
2. [bulgu 2]

## Aksiyon
- [ ] Self: [ne düzelticeğim]
- [ ] Kullanıcı: [hangi karar bekleniyor]
- [ ] Başka agent: [kime, ne için]

## İmza
Review pass eden deliverable şu etiketi alır: `✅ Reviewed YYYY-MM-DD`.
Fail eden deliverable `draft` etiketinde kalır, düzeltme sonrası yeniden review.
```

**Kural:** Review olmadan hiçbir deliverable "hazır" değildir.

---

## Peer review protokolü — self-audit'e ek

[agent-communication-protocol SKILL](../../../.claude/skills/agent-communication-protocol/SKILL.md) Katman D.

Self-audit (bu klasörün default kullanımı) yetmediğinde **peer review** tetiklenir — başka bir agent'in gözüyle.

**Zorunlu tetikleyiciler (3 durumda):**

1. **Kritik deliverable** — P0 master plan item + ADR Accepted + production etkisi.
2. **Handoff reddedildi** — downstream agent ⚠️/❌ işaretledi (brief yetersiz).
3. **Scope ≥20% değişim** — ADR Accepted sonrası workstream/brief revize edildi.

**Default peer reviewer rolleri:**

| Hedef | Primary reviewer |
|---|---|
| UX brief (product-analyst) | ux-researcher (okuyucu olduğundan ideal) |
| Eng brief (product-analyst) | en yakın fe/be agent (implementability) |
| Workstream | strategy-consultant (vizyon-sadakat) |
| ADR Proposed | product-analyst + strategy-consultant (iki perspektif) |

**Peer review template:**

```markdown
# Review — [hedef deliverable başlığı]

**Tarih:** YYYY-MM-DD
**Reviewer:** [agent-adı]
**Review tipi:** peer-review (self-audit'ten ayrı)
**Hedef dosya:** `[tam yol]`
**Tetikleyici:** critical | handoff-rejected | scope-change | optional
**Karar:** ✅ Pass | ⚠️ Pass with notes | ❌ Fail

## 1. Kapsam kontrolü
- [ ] MECE kapsam
- [ ] Upstream brief'e/vizyona sadık
- [ ] Out-of-scope maddeleri açık yazılmış

## 2. İçerik kontrolü (craft-specific)
[reviewer craft'ına göre — UX için heuristik, eng için feasibility, vb]

## 3. Bulgular
| # | Severity | Bulgu | Öneri |
|---|---|---|---|

## 4. Karar
✅ Pass | ⚠️ Pass with notes | ❌ Fail

## 5. Handoff back-annotation
(Hedef dosyanın Handoff log bölümüne eklenecek satır — Katman A)
- YYYY-MM-DD HH:MM — **[reviewer]** ✅|⚠️|❌ — **peer-review**: `docs/product/05-reviews/YYYY-MM-DD-*.md`. [özet].
```
