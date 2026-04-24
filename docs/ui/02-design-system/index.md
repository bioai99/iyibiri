# 02 — Design System Audit + Öneri

Token envanteri, component inventory, tutarlılık ihlalleri, yeni token/component önerileri. Atlas Bölüm 6 ile senkron; atlas gerçek, bu klasör **değişiklik önerileri**.

**Dosya:** `YYYY-MM-DD-konu-slug.md`

**Şablon:** `.claude/skills/design-system-audit/SKILL.md`

**Acil aday konular:**
- `design-system-readme-reconciliation.md` — `design-system/README.md` güncel mi, retire mi? (D1)
- `theme-mode-audit-dark-light.md` — ThemeProvider initial="light" vs CSS dark tokens (D2)
- `hero-glow-tokenization.md` — imza turuncu gölge tokenize edilsin mi (D3)
- `mission-card-canonical.md` — `components/ui/mission-card.tsx` vs `components/mission-card.tsx` (D4)
- `radius-system-cleanup.md` — sm/md/lg/xl/2xl/3xl kullanım envanteri

**Öneri formatı:**
- Önce "mevcut durum" (gerçek kod).
- Sonra "tespit edilen tutarsızlık" (kanıt).
- Sonra "öneri" (değişiklik).
- Sonra "etki analizi" (hangi dosya/component etkilenir).
- Son olarak "ADR gerekiyor mu?" — proje-seviyesi kararsa evet.
