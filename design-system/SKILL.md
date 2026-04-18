---
name: iyibiri-design
description: Use this skill to generate well-branded interfaces and assets for İyiBiri (Turkish civic-tech PWA — volunteer missions + Karma rewards + NGO partners), either for production or throwaway prototypes/mocks/slides. Contains essential design guidelines, colors, type, fonts, assets, and a React UI kit for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill for the full brand, content, visual, and iconography guidelines. Explore the other available files:

- `colors_and_type.css` — Drop-in token file with CSS vars for all colors, type, radii, shadows, spacing.
- `assets/logos/` — İyiBiri logo (SVG), NGO partner logos (TEMA, ÇYDD, Haytap, Kızılay, Kodluyoruz, TOG), sponsor brand logos (Trendyol, Garanti BBVA).
- `assets/icons/` — Karma token SVG and custom brand marks.
- `ui_kits/app/` — Ready-to-reuse React UI kit for the dashboard/PWA. `Components.jsx` (HeroCard, MissionCard, RewardCard, NGOCard, BottomNav, Header, Icon) + `Screens.jsx` (Home, Missions, MissionDetail, NGOs, Rewards, Profile) + `tokens.js` (domain colors, tier table, mock data).
- `preview/` — Small single-concept demo HTMLs useful as visual references.

## What to do when invoked

**If creating visual artifacts** (slides, mocks, throwaway prototypes, landing pages, etc.):
Copy the assets you need out of `assets/` into the new artifact's folder and create static HTML files. Load fonts via Google Fonts (Plus Jakarta Sans display + Inter body). Reuse the colors & patterns from `colors_and_type.css`. If a mobile mockup is needed, copy `ui_kits/app/Components.jsx` + `Screens.jsx` as a starting point.

**If working on production code** (the actual `iyibiri/` Next.js codebase or a new project using İyiBiri brand):
Read the rules in `README.md` (especially CONTENT FUNDAMENTALS and VISUAL FOUNDATIONS) and become an expert in designing with this brand. The codebase uses Tailwind + `lucide-react` + Framer Motion; the CSS vars here map to the Tailwind theme.

## Core rules to internalize

- **Language:** Turkish, 2nd-person singular ("sen"), warm and encouraging tone. Never "siz".
- **Karma** is always capitalized. Every mission has a 2-part impact statement: "Bu görevle [etki]; [duygusal sonuç]."
- **Primary color:** `#F4B942` amber. **Trust:** `#1B3A5C` navy. **Impact:** `#2D9E5A` green. **BG:** `#FAFAF5` cream.
- **Signature gradient:** `linear-gradient(135deg, #F4B942, #F97316)` with `0 8px 32px rgba(251,146,60,0.35)` hero glow.
- **Icons:** Lucide React (stroke 2). No emoji in UI chrome; emoji OK for tier badges and avatar options only.
- **Shape language:** Cards 24px radius, buttons 12px, pill filters full. Warm shadows (brown-tinted, never pure black).
- **Motion:** Framer Motion springs (`stiffness: 400, damping: 30`), `whileTap scale: 0.93–0.97`.

## If invoked with no other guidance

Ask the user:
1. What are they trying to build — a mobile screen, landing page, slide, email, illustration?
2. Audience (user-facing or internal pitch)?
3. Tone emphasis — playful, earnest, impact-forward?
4. Do they need new content/copy written in İyiBiri voice, or just visuals?

Then act as an expert designer who outputs HTML artifacts *or* production code depending on the need. Default to HTML artifacts unless explicitly asked for production code.
