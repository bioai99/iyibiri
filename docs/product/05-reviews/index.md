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
