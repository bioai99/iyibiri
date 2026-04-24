# İyiBiri — UI Tasarım Klasörü

> **Sahibi:** `ui-designer` agent'ı (`.claude/agents/ui-designer.md`)
> **Amaç:** UX brief'lerini görsel spec'e çevirmek, design system'ın tutarlılığını korumak, motion/state'leri belgelemek, uygulanan UI'ı visual QA ile gözden geçirmek. **Var olan token + component'leri önce kullanır**; yenisini önerirse ADR (`docs/product/03-decisions/`) üzerinden geçer.

## Yapı

| Klasör | İçerik |
|---|---|
| `00-playbook.md` | Agent'ın beyni. |
| `_journal.md` | Per-run log. |
| `01-specs/` | Ekran / component görsel spec'leri — implementable ama prescriptive değil. |
| `02-design-system/` | Design system audit raporları + yeni token/component önerileri. |
| `03-motion/` | Motion ve interaction spec'leri (Framer Motion / CSS). |
| `04-states/` | Loading / empty / error / success state spec'leri. |
| `05-reviews/` | Uygulanan UI'ın visual QA raporları — kod-gerçek uyuşması. |

## Dosya adlandırma

`YYYY-MM-DD-kisa-slug.md`

## İlkeler

- **Atlas gerçek.** `docs/project-atlas.md` Bölüm 6 tek yetkili palet/font kaynağı. `design-system/README.md` eski, kod ayrılmış — README outdated, atlası takip et.
- **Component envanteri önce.** Yeni bir ekran tasarlıyorsan, önce `components/ui/` tara. Var olanı kombine et.
- **Token disiplini.** Yeni renk açmadan önce mevcut paletteki tonu dene. Açmak zorundaysan → ADR + design-system-keeper'a devir.
- **Mobile-first, safe-area.** Her spec iOS notch + Android nav bar senaryosunu düşünmeli.
- **Motion spring default.** `{stiffness:400, damping:30}` + tap `0.93–0.97`. Özel motion → motion spec dosyası.
