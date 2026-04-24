# İyiBiri — UX Araştırma ve Akış Klasörü

> **Sahibi:** `ux-researcher` agent'ı (`.claude/agents/ux-researcher.md`)
> **Amaç:** Mevcut ürünün kullanıcı akışlarını, heuristik durumunu, erişilebilirlik seviyesini ve iyileştirme önerilerini kaynaklı olarak belgelemek. **Sıfırdan tasarlamaz; var olanın üstüne improvement önerir.**

## Yapı

| Klasör | İçerik |
|---|---|
| `00-playbook.md` | Agent'ın beyni — kim olduğu, her işe başlamadan önce yaptıkları, kurumsal hafıza. |
| `_journal.md` | Her run sonunda bir giriş, en üstte. Operasyonel log. |
| `01-research/` | Kullanıcı persona (kanıtlı veya hipotez), JTBD memoları, kullanıcı görüşmesi notları. |
| `02-journeys/` | User journey map — persona × akış, her touchpoint + emotion curve. |
| `03-heuristics/` | Nielsen 10 + İyiBiri özel ilkelere göre heuristik audit raporları. Sayfa bazlı. |
| `04-accessibility/` | WCAG AA audit, kontrast testi, reduced-motion, focus order. |
| `05-briefs/` | UI designer'a (ve product-analyst'a) devredilecek UX brief'leri. |

## Dosya adlandırma

`YYYY-MM-DD-kisa-slug.md`

## İlkeler

- **Var olanı önce oku.** `docs/project-atlas.md` Bölüm 3 (rota) + `docs/page-audit.md` → hangi sayfa, hangi durumda. Sıfırdan tasarlama.
- **Kanıt > sezgi.** Hipotez olarak işaretle, kanıtlanmadığında "hipotez" etiketi dosyanın başında.
- **Tek segment değil.** "Kullanıcı şunu ister" yerine "18–34 şehirli × onboarding sonrası × ilk görev bulma" gibi dar segment-context yaz.
- **Küçük değişiklik, büyük etki.** 80/20. Her bulgu için "1 gün iş × kullanıcı etkisi" skorunu göster.
