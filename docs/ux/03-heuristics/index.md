# 03 — Heuristik Audit Raporları

Nielsen 10 + İyiBiri özel heuristikleri ile sayfa bazlı audit. Her audit 1 sayfalık odaklı rapor.

**Dosya:** `YYYY-MM-DD-sayfa-slug.md`

**Şablon:** `.claude/skills/ux-heuristics/SKILL.md`.

**Rapor iskeleti:**
```
# [Sayfa] — Heuristik Audit

**Tarih / Sayfa URL / Kod path (`app/...`)**

## Tespit edilen ihlaller
| # | Heuristik | Şiddet 1–4 | Kanıt | Öneri |

## En kritik 3
(en yüksek şiddet × en düşük effort = hızlı kazanımlar)

## Aksiyon planı
- [ ] [fix] ...
- [ ] [test] ...
```

**Öncelik sırasıyla incelenecekler:**
1. `/dashboard` (ana ekran)
2. `/dashboard/missions/[id]` (state machine 4 durum)
3. `/dashboard/missions/[id]/complete` (verification akışı)
4. `/dashboard/ngos/[id]/membership` (form + KVKK)
5. `/onboarding/causes` + `/onboarding/city` (localStorage sync)
