# TOGB rebrand — implementation brief

## Scope

Rebrand the existing Reeper portfolio to **TOGB (The Original Brand)** on `feat/togb-rebrand`, replace the blue hero with a generated immersive image, replace the abstract About panel with an anime-style portrait, and ship a custom T monogram. Preserve SEO, analytics, the contact form, legal pages, accessibility, and the GitHub `Verify` workflow.

## Direction

**THESIS** — The portfolio is an original artifact, not a template: a carved T monolith in a quiet brutalist gallery, with the developer's portrait treated like a framed original. It refuses the blue-gradient developer-portfolio default.

**OWN-WORLD** — Warm paper, near-black ink, bottle-green shadow, brass light, and a burnt-vermilion signal. Bricolage Grotesque display type; Instrument Sans body type. The T monogram is a solid carved form in a forest tile, with one signal square. Corners are soft but not bubbly; lines are thin and intentional.

**STORY** — A visitor sees a real person, a real body of work, and a direct offer. They understand the studio is independent, senior, and accountable, then start a project.

**FIRST VIEWPORT** — Full-bleed monolith photograph, dark enough on the left for paper-coloured type. Top row: `TOGB / The Original Brand` and Gauteng. Centre-left: the existing promise, “Your next website should earn its keep.” Bottom row: a short first-person introduction and two actions. A slow image drift is the only ambient motion.

**FORM** — Pinned by the user's brief and the generated hero, so no direction roll was run. The first surface is the existing single-page portfolio.

**SIGNATURE PORTRAIT** — The About portrait is a still anime-style illustration of the developer, framed like an original artifact. It needs no video, autoplay, or motion controls.

**FINISH** — Unreviewed and undocumented is unfinished; this build ends with the visual QA pass, the accessibility/e2e pass, and a recorded design system.

## Assets

- `public/images/togb-hero.webp` — Higgsfield FLUX 3, 2400×1347, 301 KB.
- `public/images/togb-portrait-anime.webp` — FLUX 3 image-to-image, 912×1152, 62 KB.
- Logo and favicon are hand-authored SVG so they stay sharp and editable.

## Verification

- `pnpm lint`, `pnpm typecheck`, `pnpm build`.
- Full Playwright suite, including desktop/mobile light/dark, 320 px overflow, axe, reduced motion, contact form, analytics, and metadata.
- Manual visual pass at desktop and mobile, light and dark, including the hero crop, portrait framing, and focus states.
- Open a PR; merge only after `Verify` and GitGuardian pass; deploy to Vercel only after merge.

## Post-rebrand additions

- Replaced the footer LinkedIn link with WhatsApp (`071 788 4230`, `https://wa.me/27717884230`) and added the number to the contact panel, `ProfessionalService`, `Person`, and `ContactPoint` schema.
- Removed the three sample testimonials, their fabricated ratings, the carousel JavaScript, and the placeholder portraits. The testimonial section is now server-rendered and hidden until a real, permissioned client entry is added.
- Added a visible seven-question FAQ and matching `FAQPage` schema, plus a dated SEO audit and content roadmap in `docs/seo/2026-10-29-seo-audit.md`.
- Improved the homepage title/description and added logo, founding date, language, and contact data to structured data.
- Verification after the SEO pass: `pnpm lint`, `pnpm typecheck`, `pnpm build`, and the full Playwright suite pass (114 passed, 2 expected desktop-only skips). Local mobile Lighthouse moved from 51 to 73 Performance, with SEO 100 and Accessibility 100.
- Still blocked before merge/deploy: real testimonial content, final TOGB domain/Vercel project, and explicit approval.
