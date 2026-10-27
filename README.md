# Reeper — freelance portfolio

A one-page portfolio for an independent web developer. The work is presented as
an editorial index, every project row links straight to its live Vercel deploy,
and the editable content lives in a small set of files so the site is quick to
make yours.

## Stack

- Next.js 16 (App Router) with React 19
- Tailwind CSS v4
- TypeScript
- shadcn/ui primitives (Radix UI) on semantic design tokens
- next-themes for a system-first light/dark mode
- Playwright + axe-core for browser and accessibility checks
- Fonts: Bricolage Grotesque (display) and Instrument Sans (text), both via
  `next/font/google`

## Run it

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Then open http://localhost:3000. Fill in the Resend values in `.env.local` if
you want the contact form to send mail; the rest of the site runs without them.

Useful checks:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm exec playwright install chromium # first run only
pnpm test:e2e
```

`pnpm test:e2e` starts a production server on port 3100 from the latest build.
Run `pnpm build` first if the build output is stale, and stop a dev server on
port 3100 if you want the test to own the port.

## Contact form

The contact panel posts to [`src/app/api/contact/route.ts`](src/app/api/contact/route.ts).
The route validates the payload with zod, rejects a hidden honeypot field, and
sends a table-based HTML notification plus a plain-text fallback through
Resend. The visitor’s email is set as `replyTo`, so replying from your inbox
goes straight back to them.

Copy [`.env.example`](.env.example) to `.env.local` and set:

```bash
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=you@gmail.com
RESEND_FROM_EMAIL="Reeper <hello@yourdomain.com>"
```

- `RESEND_API_KEY` comes from [resend.com/api-keys](https://resend.com/api-keys).
- `CONTACT_TO_EMAIL` is the inbox that receives inquiries.
- `RESEND_FROM_EMAIL` must use a domain verified in Resend. The test sender
  `onboarding@resend.dev` can only deliver to the address that owns the Resend
  account, so it is useful for a first local test but not for production.

The form’s success and validation states are client-side; the API validates
again on the server. The notification email uses the fixed paper, ink, blue, and
signal palette because email clients do not support the site’s CSS variables.
The public address in `src/content/site.ts` is separate from the form
destination and can be changed independently.

If you use the Resend CLI, `resend doctor` checks authentication and domain
status, and `resend domains list` shows verified sending domains. For
production, add the same variables in Vercel and redeploy.

## Make it yours

Core data lives in [`src/content/site.ts`](src/content/site.ts); the longer
prose lives with its section.

1. **Identity** — change `name`, `wordmark`, `role`, `email`, `url`, `location`,
   social links, and availability.
2. **Work** — edit [`src/content/projects.ts`](src/content/projects.ts). It
   contains all 37 projects pulled from Vercel: 19 published rows and 18
   skipped records. Add a project by moving it into `publishedProjects`, adding
   a screenshot in `public/projects/`, and filling in its summary, tags, and
   year. The grid shows four rows per page.
3. **Services** — edit `services` with your actual offers and timelines.
4. **Testimonial** — replace it with a real quote, or delete the
   `<TestimonialSection />` line from `src/app/page.tsx`.
5. **Hero and about prose** — the headline and intro are in
   [`src/components/hero.tsx`](src/components/hero.tsx); the bio is in
   [`src/components/about.tsx`](src/components/about.tsx); the contact copy is
   in [`src/components/contact.tsx`](src/components/contact.tsx).
6. **Portrait** — the blue monogram block in
   [`src/components/about.tsx`](src/components/about.tsx) is a designed
   placeholder. Swap it for a photo with `next/image`, and give the image
   meaningful alt text.
7. **Metadata** — update `site.url` (used for canonical links, the sitemap, and
   Open Graph metadata) and the title/description in
   [`src/app/layout.tsx`](src/app/layout.tsx).

### Work index

The work section is a static snapshot of the `reeperxs-projects` Vercel scope,
synced 2026-10-27. It contains:

- `publishedProjects` — 19 public, visually complete production sites. Each has
  a real production link and a 1280×800 screenshot committed in
  `public/projects/`.
- `skippedProjects` — 18 private, API-only, empty, incomplete, duplicate, or
  offline deployments. They are kept in the data so the source stays complete,
  but they are not rendered.
- `vercelProjectCount` — the total, currently 37.

Links use only the production aliases returned by the Vercel API. Do not add
short `${project}.vercel.app` aliases by hand: some are owned by unrelated
projects. Screenshots were captured from the production URLs with Playwright,
not composed mockups. The index is static: no database or runtime Vercel API
call is needed.

### Design system and themes

The tokens in [`src/app/globals.css`](src/app/globals.css) are layered:

- **Brand constants** in `@theme`: paper, ink, blue, ice, signal. These are fixed
  reference colors.
- **Semantic tokens** in `:root` and `.dark`: background, foreground, card,
  secondary, muted, primary, border, link, on-brand.
- **Component tokens** from shadcn/ui: radius, input, ring, etc.

Build with semantic utilities (`bg-background`, `text-foreground`, `bg-card`,
`text-muted-foreground`, `bg-primary`, `text-primary-foreground`,
`border-border`). Reserve fixed `bg-ink` / `text-paper` for deliberate inverse
surfaces. The footer uses `bg-secondary`, so it is a light card in light mode
and a dark card in dark mode.

The theme is system-first on first visit and persists to localStorage after the
first toggle. `ThemeToggle` lives in the desktop sidebar's Studio card and in
the mobile header; both labels are hydration-safe. Change the semantic values
in `:root` / `.dark` to re-skin the site without touching components.

shadcn/ui components live in `src/components/ui` and are configured by
[`components.json`](components.json). Add more with:

```bash
pnpm dlx shadcn@latest add <component>
```

App-specific components use the small `cn` helper in
[`src/lib/utils.ts`](src/lib/utils.ts).

Display type is Bricolage Grotesque; text type is Instrument Sans.

### Navigation and page controls

- The desktop sidebar has icon navigation and a Studio card with availability,
  local time, and the theme toggle.
- The mobile header keeps the compact nav and the theme toggle.
- The footer is a theme-aware rounded card with the wordmark, a unique tagline,
  the canonical GitHub/LinkedIn links, copyright, and the colophon. It
  deliberately does not repeat the availability, location, or local-time copy
  from the rest of the page.
- The floating back-to-top button is global. It appears after 600px of scroll,
  uses reduced-motion-aware scrolling, and is hidden at the top of the page.

### Accessibility and browser tests

`pnpm test:e2e` runs four Playwright projects: desktop light, desktop dark,
mobile light, and mobile dark. The suite covers theme persistence, pagination
focus and announcements, the floating top button, social/contact link dedupe,
the sidebar Studio card, contact-form labels and validation, a mocked successful
submission, API validation/honeypot/cross-origin handling, a 320px
no-horizontal-overflow check, and axe scans for serious or critical WCAG A/AA
violations. On failure, CI uploads the Playwright report as an artifact.

### Git workflow

`main` is protected: pull requests are required, the `Verify` check is strict,
history is linear, conversations must resolve, admins are included, and force
pushes/deletions are blocked. Work on a feature branch and merge with rebase:

```bash
git switch -c feat/your-change
# ...
pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e
git push -u origin feat/your-change
gh pr create --fill
# wait for Verify, then:
gh pr merge --rebase --delete-branch
```

CI only verifies the build and browser suite. Deployment is a separate,
explicitly approved step.

## Before you launch

- [ ] Replace the placeholder testimonial (or remove it)
- [ ] Replace `hello@example.com` with an address you actually read
- [ ] Verify a sending domain in Resend and replace `onboarding@resend.dev`
      with that address before relying on the contact form in production
- [ ] Send one test inquiry through the form and confirm it reaches
      `CONTACT_TO_EMAIL`
- [ ] Replace the monogram with a real portrait
- [ ] Update `site.url` to the production domain
- [ ] Add a real Open Graph image (`public/og.jpg`) and reference it in
      `layout.tsx` if you want rich link previews
- [ ] Re-check the Vercel work index and refresh any screenshots that have gone
      stale
- [ ] Run `pnpm test:e2e` and confirm light/dark, desktop/mobile, and 320px
- [ ] Keep new components on semantic tokens; fixed ink/paper only for
      intentional inverse surfaces

## Deploy to Vercel

The site itself needs no environment variables. The contact form needs
`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `RESEND_FROM_EMAIL` in the Vercel
project’s Environment Variables settings. Import the repository at
[vercel.com/new](https://vercel.com/new) or run:

```bash
npx vercel
```

Vercel detects Next.js automatically. After the first deploy, add your domain in
Project Settings → Domains, then update `site.url` in `site.ts` and redeploy.
This repository does not deploy from CI; deploying is a manual, approved step.

## Structure

```
src/
  app/
    api/contact/route.ts  validated Resend contact endpoint
    layout.tsx        fonts, metadata, providers, shell
    page.tsx          section order, main landmark, footer
    globals.css       semantic tokens, base styles, grain, motion
    not-found.tsx     404
    robots.ts         robots.txt
    sitemap.ts        sitemap.xml
  components/
    site-sidebar.tsx  fixed desktop rail, icon nav, Studio card
    site-header.tsx   mobile header and theme toggle
    site-footer.tsx   theme-aware footer card
    scroll-to-top.tsx floating back-to-top control (client)
    theme-provider.tsx / theme-toggle.tsx
    hero.tsx
    work.tsx          work section wrapper and counts
    work-grid.tsx     paginated project rows (client)
    services.tsx
    about.tsx
    testimonial-section.tsx
    contact.tsx       contact section
    contact-form.tsx  validated brief form (client)
    clock.tsx         live Johannesburg time (client)
    copy-email.tsx    copy-to-clipboard button (client)
    ui/               shadcn/ui primitives
  lib/
    contact-schema.ts shared zod schema and field errors
    email/contact-inquiry.ts  table-based HTML and text email
    utils.ts          app-level cn helper
  content/
    site.ts           identity, navigation, services, tools
    projects.ts       Vercel snapshot, published rows, skipped records
e2e/
  portfolio.spec.ts   browser, theme, and axe coverage
playwright.config.ts  four desktop/mobile light/dark projects
public/
  projects/           committed project screenshots
```
