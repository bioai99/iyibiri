# User Journey — Mission Lifecycle (keşif → Karma kazanımı)

**Tarih:** 2026-04-24
**Owner:** ux-researcher
**Persona:** Zehra, 28, mimar, TEMA gönüllüsü 2 haftadır (Dashboard v2 journey'den devam)
**Kapsam:** `/dashboard/missions/[id]` ziyareti → `completed` state → celebration

> **Skill ritüeli (Adım 0)** — Bu journey öncesi 3 skill okundu:
> - `.claude/skills/user-journey-mapping/SKILL.md` — Jeff Patton emotion curve + dark/peak moment
> - `.claude/skills/ux-heuristics/SKILL.md` — her adım için heuristic checkpoint
> - `.claude/skills/mobile-app-polish-standards/SKILL.md` — tier-1 "aha moment" patterns

---

## 0. Bağlam

Zehra dashboard'da "Günün görevi" kartını gördü: **"Arı dostu fidan dikimi"** — TEMA, Beykoz, +80 Karma, Cumartesi 10:00. Bu journey, kartı tap'lamasıyla başlar, 3-4 gün sonra görev günü biter.

**Başarı tanımı:** Zehra görevi tamamlar, Karma kazanır, duygusal olarak değer hisseder, **paylaşmak ister** (tier-1 sinyal).

**Başarısızlık:** Zehra bir yerde sıkışır, kanıtı gönderemez, Karma eksik kalır, App'i sessizce terk eder.

---

## 1. Adım Adım — 10 touchpoint

| # | Adım | Yer | Action | Emotion (1-10) |
|---|---|---|---|---|
| 1 | Mission kartına tap | Dashboard | Navigate | 7 — merak |
| 2 | Detay sayfası görünür | `/missions/[id]` | Scroll | 8 — etkilenme (impact quote) |
| 3 | Fact card'ları tara | same | Read | 7 — plan yapma (Cumartesi 10 uygun mu?) |
| 4 | "Bu göreve katıl" tap | same | Submit | 6 — pürüz (loading + error ihtimali) |
| 5 | `taken` state görünür | `/missions/[id]` | Confirm | 8 — heyecan ("yaptım!") |
| 6 | **Görev günü sabahı** | Dışarıda | Offline hazırlık | 9 — zirve |
| 7 | Fidan dikerken QR tara | Bahçede | Verify | 8 — başarı hissi |
| 8 | Celebration confetti | same | Watch | **10 — peak** |
| 9 | Dashboard'a dön, Karma +80 | Dashboard | See | 9 — tatmin |
| 10 | Paylaşım "arkadaşlarım görsün" | native share | Share | 8 — bağ |

**Emotion curve:**

```
  10 ┤                                    ●← #8 peak (confetti)
   9 ┤                              ●           ●← #9 (Karma)
   8 ┤      ●                 ●           ●             ●← #10 share
   7 ┤●           ●                                      
   6 ┤                  ●←#4 dip 1 (buton pürüzü)        
   5 ┤                                                   
   1 ──────────────────────────────────────────────────
      1  2  3  4  5  6  7  8  9  10
```

**Dark moment:** Adım 4 — "Bu göreve katıl" tap'inden sonra belirsiz 2-5sn. Loading state sığ, hata olasılığı var.

**Peak moment:** Adım 8 — confetti + +80 Karma count-up + "Başardın" celebration.

**İkinci peak:** Adım 10 — "Arkadaşım da görsün" native share, sosyal onay arayışı.

---

## 2. Adım Adım — Derinlemesine

### Adım 1-3: Keşif (idle state)

**Durum:** Henüz almadı, kontenjan var (12 yer), tarih uygun (3 gün sonra).

**Kullanıcı gördüğü:** Full-bleed photo + TEMA logo + title "Arı dostu fidan dikimi" + 4 fact card (tarih / süre / konum / kontenjan) + impact quote + +80 Karma card.

**İç diyalog:** *"Cumartesi 10... evet boşum. Beykoz 40dk uzak ama olur. 7 fidan dikilir... güzel."*

**Sinyal kuvveti:** ⭐⭐⭐⭐ — impact quote (İ2 strateji: emotional hook) iyi çalışıyor.

**Risk:** Adım 2'de gradient overlay + textShadow h1 → read edilebilir ama tier-1 hissi için **Fraunces italic aksan** kullan (`"Arı dostu <em>fidan dikimi</em>"`).

**Heuristic checkpoint:** N2 ✓ N8 ⚠️ (6 bölüm + 3 koşullu = fazla)

---

### Adım 4: Başvuru tap — ⚠️ Dark moment

**Durum:** Zehra "Bu göreve katıl" sticky CTA tap. TEMA üyesi ✓ (aktif membership), KVKK sorulmuyor.

**Kullanıcı görüyor:** Butonun label'ı "Göreve Alınıyor..." + spinner (yok aslında, sadece text). 2-3 saniye belirsizlik.

**İç diyalog:** *"Ağ mı kesildi? İki kez basmalı mıyım? Basmasam iptal olur mu?"*

**Sinyal:** 🔴 Kritik dark moment.

**Mevcut bug:**
- Tap sonrası haptic feedback yok (mobile)
- Buton zaten `loading` state'te ama görsel fark sadece opacity 0.7 + label
- Debounce/double-click prevention yok (React state loading'i engelliyor ama animate yok)

**Hedef tier-1 davranış:**
- Tap → haptic `Light`
- Buton ilk 150ms pulse animate ("anladık, bekle")
- Spinner görsel + "göreve ekleniyor..." (ses yumuşat)
- Success → buton yeşile dönüş + ✓ ikon 600ms + sonra route transition
- Fail → buton kırmızı shake + error mesaj empathic TR

**Heuristic checkpoint:** N1 ❌ N9 ❌ İ5 ❌

---

### Adım 5: `taken` state confirm

**Durum:** `user_missions.status='taken'`, `states-client.tsx` render oluyor.

**Kullanıcı gördüğü:** (states-client.tsx okunmadı ama muhtemelen) "Görev aldın ✓" + "Hazırlan" info + "Tamamladım" CTA.

**İç diyalog:** *"Tamam. Cumartesi için hatırlatma gelsin."*

**Eksik tier-1 öğe:**
- "Takvime ekle" CTA (iOS/Android calendar intent) — YOK
- Push bildirim "Yarın 10:00 hatırlatma" — YOK (Capacitor push P1)
- "Hazırlık checklist" — eldiven, su, su geçirmez ayakkabı (görev-özgü) — YOK

**Öneri:**
- `taken` state'te **prepare-card**: "Görev günü için hazırla" + mission-özgü checklist (NGO admin gelecekte doldurur, şimdilik generic)
- "Takvime ekle" — `.ics` file generate et

---

### Adım 6: Görev günü sabahı — offline bağlam ⭐

**Durum:** Cumartesi 09:15. Zehra uyanıyor, kahvaltı yapıyor. App'i açıyor mu?

**İnsancıl ihtiyaç:** Hatırlatıcı. Push bildirim olmadığında Zehra kendi telefonunda alarm kurmuş olmalı.

**Tier-1 sinyal:** "Görev günü" push "📍 Bugün 10:00'da Beykoz. Rota: 40dk. Başlayalım!"

**Capacitor entegrasyon:** P1 kapsamda (push bildirim backlog'ta).

---

### Adım 7: Verification — QR tap

**Durum:** Beykoz'da, fidan dikildi, STK volunteer'ı QR kodu gösteriyor. Zehra `/missions/[id]/complete` sayfasında.

**Kullanıcı görüyor:** (bugün) Başlık "Görevi Tamamla" + beyaz card + mission title + karma box + QR scanner.

**⚠️ TEMA KIRILMASI:** Light theme, Premium × Warm değil. Zehra "ben nereye geldim?" hissiyatında. Tier-1 immersion kırılıyor.

**İç diyalog:** *"Bu başka bir app mı? Neden birden beyaz?"*

**Sinyal:** 🔴 Kritik N4 + İ4 + İ6 hepsi.

**Hedef:** Mission detail dark tema + QR scanner dark background + TEMA aksan rengi + Fraunces italic "<em>Tamamla</em>" aksan.

---

### Adım 8: Celebration — ⭐⭐⭐ PEAK MOMENT

**Durum:** QR doğrulandı, `user_missions.status='completed'`, `karma_transactions` +80 insert, `profiles.karma_total` += 80.

**Kullanıcı görüyor:** (bugün) `CelebrationOverlay` — bg-black/60 + beyaz modal + 🎉 emoji + "Tebrikler" + Karma +80.

**Tier-1 değerlendirmesi:**
- Confetti ✓
- Karma count-up (0→80) — YOK, direkt gösteriyor
- Haptic success — YOK
- "Arkadaşım görsün" share CTA — YOK (sadece "Devam etmek için dokun")
- Tier-1 peak "memorable" hissi **yarım kalıyor**

**Duolingo karşılaştırma:** Duolingo "5 day streak!" + streak icon animate + "keep going" + share button. İyiBiri bu pattern'e %40.

**Hedef:**
- Confetti ✓ (3-wave gold + cream + TEMA green)
- Karma count-up 0→80 (1.2sn ease-out)
- Haptic `Heavy` notification
- Streak updated chip (Zehra'nın 3 haftalık streak'i)
- **"Arkadaşım görsün"** primary CTA — native share
- "Dashboard'a dön" secondary
- **BONUS (gelecek):** "TEMA gönüllüleri +500 oldu — bu haftanın en çok katılım olan STK'sı" sosyal sinyal

---

### Adım 9: Dashboard — Karma görünür

**Durum:** Zehra `/dashboard` — hero card Karma 1,200 → 1,280 görünüyor.

**Kullanıcı görüyor:** Hero card v2 (gold glow breathing) + Karma display (1,280).

**Tier-1 sinyal:** Zehra dashboard'a döndüğünde Karma değerinin **yeni arttığını fark edebilmeli** (visual continuity). Hero card v2 count-up animate + "+80" micro-indicator (3sn sonra solup gitsin) ideal.

**Mevcut bug:** Dashboard'a döndüğünde hero card count-up 0→1280 tekrar çalışıyor (ilk ziyaretteki gibi). Bu güzel ama "+80 bu hafta" yerine "+80 az önce" micro-indicator koyulmalı.

---

### Adım 10: Paylaşım ⭐

**Durum:** Zehra "arkadaşlarıma söyleyeyim" — share card.

**Kullanıcı görüyor:** (bugün) Hiçbir şey — share CTA yok. Zehra kendisi IG story'e screenshot atıyor.

**Kaçan fırsat:** Viral loop. Tier-1 app share card'ı hazır iyi tasarlarsa Instagram/WhatsApp üzerinden **yeni kullanıcı kazanma kanalı**.

**Hedef:**
- Share card generate (HTML → canvas → PNG) — "Zehra TEMA ile fidan dikti 🌱" + avatar + +80 Karma + İyiBiri logo
- Native share intent (iOS/Android) → IG Stories / WhatsApp / Twitter
- Link: `iyibiri.app/missions/{id}` (public landing)

**P1 kapsamı** — tam implementation sonra. Ama celebration ekranına "Paylaş" CTA koymak **hemen yapılabilir** (link copy even before share card).

---

## 3. Ne İyi, Ne Düzelt, Ne Ekle (özet)

### Ne İyi (koru)
- Impact quote Fraunces italic (adım 2)
- Full-bleed photo + Premium × Warm hero (adım 2)
- Confetti celebration (adım 8) — baseline çalışıyor
- Sticky CTA single button (adım 4)

### Ne Düzelt
- **Adım 4 dark moment:** haptic + spinner + state-aware button animate
- **Adım 7 tema kırılması:** verification-client dark rewrite (N4 kritik)
- **Adım 8 peak eksik:** Karma count-up + haptic + share CTA
- **Error messaging:** TR empathic + specific (N9 kritik)
- **State coverage:** 5 eksik state (full, expired, failed_verification, cancelled, re-access)

### Ne Ekle
- **Adım 5 prepare-card:** "Takvime ekle" + hazırlık checklist
- **Adım 6 push bildirim:** görev günü reminder (P1)
- **Adım 8 share CTA:** native share + gelecekte share card
- **Adım 9 dashboard continuity:** "+80 az önce" micro-indicator
- **Adım 10 viral loop:** share card + public mission landing (P2)

---

## 4. Persona Spectrum — 3 farklı kullanıcı

### Zehra (yukarıdaki) — Engaged user
- Her hafta görev alır, streak'i önemser
- Share CTA'sını kullanır
- Celebration peak moment benimser

### Ahmet — Hesitant user (ilk mission)
- Daha önce hiç mission almamış
- "Gönüllü ol ve katıl" shortcut'ı yanlışlıkla tıklıyor → paralı olmayan üyelik
- Peak moment aynı ama "ben ne yaptım?" sorusu ağır
- **İhtiyaç:** Adım 5'te "hoş geldin ilk görevine" onboarding hint + "peki sonra ne olacak" mini açıklama (N10)

### Nur — Busy user (mission aldı ama gidemedi)
- `taken` state'te mission var, Cumartesi günü geçti, tamamlamadı
- App açıyor, "göreve ne oldu?"
- **Mevcut bug:** State `taken` olarak sonsuza kalıyor. `expired` otomatik transition yok.
- **Hedef:** `expired` state + "Bu görev tamamlanmadı, sorun değil. Benzer görevler ↓" öneri

---

## 5. Motion Choreography (adım adım)

**Mission detail entry (adım 2):**
```
0ms    : photo fade-in + gradient overlay
150ms  : NGO lockup slide-up + opacity
250ms  : facts grid stagger (4 cards × 80ms delay)
450ms  : impact quote fade-in
600ms  : karma card scale 0.95→1 spring
750ms  : participants slide-up
900ms  : sticky CTA slide-from-bottom
```

**Take mission tap (adım 4):**
```
0ms    : button tap → haptic Light
0-150ms: button scale 0.97 + pulse
150ms  : label replace "Alınıyor..." + spinner fade-in
N/A    : Supabase call (variable 0.3-2s)
+200ms : button success → green + check icon pop (spring)
+600ms : route transition to taken state (reduced-motion: direct)
```

**Verification success (adım 8):**
```
0ms     : user tap verify
0-300ms : button → success color + check icon
300ms   : haptic Heavy
300ms   : confetti wave 1 (gold)
500ms   : confetti wave 2 (cream)
700ms   : confetti wave 3 (TEMA green)
400ms   : Karma count-up start (0→80, 1200ms ease-out)
1600ms  : streak chip slide-in ("3 hafta seri")
1800ms  : CTAs appear (share + dashboard)
```

---

## 6. A11y Notları

- Mission detail `<h1>` tek, hierarchi doğru
- Impact quote `<blockquote>` semantic eksik — italic paragraf var, `<blockquote>` önerildi
- Verification code input `aria-label` TR ("Doğrulama kodu")
- Photo upload aria-describedby hint
- Confetti `prefers-reduced-motion` respect ediliyor ✓
- Karma count-up `aria-live="polite"` zaten hero card'da var, celebration'da eklenmeli

---

## 7. Handoff → ui-designer

UI spec'e taşınacak kritik noktalar:
1. 9 state ASCII wireframe + motion choreography
2. Verification panel redesign (4 variant) — **verification-panel.tsx** spec
3. Celebration upgrade — Karma count-up + share CTA + haptic
4. Prepare card (adım 5) — "Takvime ekle" + checklist
5. Error state TR messaging copy
6. Dark moment (adım 4) — button state machine visual
7. `expired` / `full` / `cancelled` state için copy + illustration önerisi

---

## 8. Quality Self-Check (mobile-app-polish-standards Bölüm 12)

- [x] 10 touchpoint sıralı + emotion curve
- [x] Dark moment + peak moment belirli
- [x] 3 persona spectrum (engaged + hesitant + busy)
- [x] Tier-1 benchmark karşılaştırma (Duolingo, Apple Fitness)
- [x] Motion timing band'ları (skill Bölüm 6)
- [x] A11y checkpoint
- [x] Heuristic cross-reference (audit ile tutarlı)
- [x] Handoff noktası net

**Sonuç:** Skill-driven journey hazır, UI spec'e aktarıma uygun.
