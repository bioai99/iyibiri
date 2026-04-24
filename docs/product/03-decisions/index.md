# 03 — Kararlar (ADR — Architecture/Product Decision Records)

Michael Nygard formatı (Title, Status, Context, Decision, Consequences). Kısa, tek sayfa. Her önemli teknik veya ürün kararı burada kalıcı iz bırakır.

**Dosya:** `NNN-kisa-slug.md` — sıralı numara. Örn. `001-payment-provider.md`, `002-north-star-metric.md`.

**Şablon:** `.claude/skills/decision-docs/SKILL.md` içindeki Nygard şablonu.

**Status değerleri:**
- `Proposed` — agent önerdi, kullanıcı onayı bekliyor.
- `Accepted` — onaylandı, yürürlükte.
- `Deprecated` — yenisiyle değiştirildi (üstüne ADR yazılır, yeni ADR referans verir).
- `Superseded by NNN` — başka bir ADR bunu geçersiz kıldı.

**Kural:** Proposed bir karar aynı zamanda `04-questions/open.md`'de bir satıra sahip olmalı — ikisi eşgüdümlü.
