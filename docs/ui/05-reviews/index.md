# 05 — Visual QA Review

Frontend-engineer bir feature yayınladıktan sonra UI designer kodu tarar, spec ile gerçeği karşılaştırır. Fark varsa `draft` → fix → yeniden review.

**Dosya:** `YYYY-MM-DD-feature-review.md`

**Rapor iskeleti:**
```markdown
# Review — [feature / PR referansı]

**Tarih / Reviewer: ui-designer (self)**
**Spec dosya:** `docs/ui/01-specs/[...].md`
**Sonuç:** ✅ Pass | ⚠️ Partial | ❌ Fail

## Token uyumu
- [✅] Renk Tailwind token'ından
- [❌] "mission-card" içinde `#E8C268` hardcoded — `gold` token olmalı

## Spacing / radius
- [✅] Mobil container max-w-lg
- [⚠️] Card radius 2xl (24px) olması gerekirken xl (20px) kullanılmış

## Motion
- [ ] Entry animation spec uyumlu
- [ ] Tap feedback var
- [ ] Reduced-motion fallback çalışıyor

## State coverage
- [✅] Default
- [❌] Loading skeleton eksik
- [⚠️] Empty state placeholder ama spec edilen illustration eksik

## Aksiyon
- [ ] Frontend: `#E8C268` → `text-gold`
- [ ] Frontend: radius-xl → radius-2xl
- [ ] Frontend: Loading skeleton ekle
- [ ] UI designer: empty state illustration oluşturup brief olarak ekle

## İmza
Pass eden feature'a `✅ Visually Reviewed YYYY-MM-DD` etiketi eklenir (journal'da).
```

**Kural:** Review yapılmayan feature "görsel olarak hazır" değildir.

---

## Protokol — ne zaman tetiklenir?

[agent-communication-protocol SKILL](../../../.claude/skills/agent-communication-protocol/SKILL.md) Katman D.

**Zorunlu tetikleyiciler (3 durumda review yazılır):**

1. **Kritik deliverable** — P0 master plan item + production etkisi olan UI spec.
2. **Handoff reddedildi** — frontend-engineer ⚠️/❌ handoff yazdı (spec implementability eksik).
3. **Scope ≥20% değişim** — ADR Accepted sonrası UI spec revize edildi.

**Default reviewer rolleri:**

| Hedef | Primary reviewer | Secondary |
|---|---|---|
| UI spec (ui-designer) | design-system-keeper (token ihlali) | frontend-engineer (implementability) |
| Frontend component | ui-designer (visual QA) | design-system-keeper (token + canonical) |

**Handoff back-annotation:**
Review yazıldıktan sonra, **hedef dosyanın Handoff log bölümüne** 1 satır eklenir (Katman A):

```
- YYYY-MM-DD HH:MM — **[reviewer]** ✅|⚠️|❌ — **review**: `docs/ui/05-reviews/YYYY-MM-DD-*.md`. [özet].
```
