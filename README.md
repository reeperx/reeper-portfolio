# TOGB — The Original Brand

The portfolio for TOGB, an independent web studio in Gauteng. The homepage is
a focused introduction; [`/work`](src/app/work/page.tsx) is the complete, server-rendered
index of public projects. Every project row links straight to its live Vercel
deploy, and the editable content lives in a small set of files so the site is
quick to make yours.

## Stack

- Next.js 16 (App Router) with React 19
- Tailwind CSS v4
- TypeScript
- shadcn/ui primitives (Radix UI) on semantic design tokens
- next-themes for a system-first light/dark mode
- Vercel Web Analytics for cookieless, aggregate page views
- Playwright + axe-core for browser and accessibility checks
- Fonts: Bricolage Grotesque (display) and Instrument Sans (text), both via
  `next/font/google`

## Run it

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Then open http://localhost:3000. Set the two public values in `.env.local`
before production:

```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_CONTACT_EMAIL=hello@yourdomain.com
```

`NEXT_PUBLIC_SITE_URL` must be an absolute origin with no trailing slash. It
drives canonical URLs, the sitemap, robots, Open Graph/Twitter metadata, and
JSON-LD. Until it is set, the build uses `https://example.com` as an obvious
placeholder. `NEXT_PUBLIC_CONTACT_EMAIL` controls the public address in the
contact panel and structured data. The WhatsApp number is in
`site.whatsapp` in `src/content/site.ts`.

Fill in the Resend values too if you want the contact form to send mail; the
rest of the site runs without them.

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
The route validates the payload with zod, silently accepts submissions with a
populated honeypot field without sending mail, and sends a table-based HTML
notification plus a plain-text fallback through Resend. The visitor’s email is
set as `replyTo`, so replying from your inbox goes straight back to them.

Copy [`.env.example`](.env.example) to `.env.local` and set:

```bash
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=you@gmail.com
RESEND_FROM_EMAIL="TOGB <hello@yourdomain.com>"
```

- `RESEND_API_KEY` comes from [resend.com/api-keys](https://resend.com/api-keys).
- `CONTACT_TO_EMAIL` is the inbox that receives inquiries.
- `RESEND_FROM_EMAIL` must use a domain verified in Resend. The test sender
  `onboarding@resend.dev` can only deliver to the address that owns the Resend
  account, so it is useful for a first local test but not for production.

The form’s success and validation states are client-side; the API validates
again on the server and caps request bodies at 20 KB. The notification email
uses the fixed paper, ink, forest, bone, and signal palette because email clients do not
support the site’s CSS variables. The public address comes from
`NEXT_PUBLIC_CONTACT_EMAIL` and is separate from the form destination, so it can
be changed independently.

The honeypot and same-origin check discourage casual abuse but are not a
substitute for an edge rate limit or CAPTCHA. Add one in Vercel Firewall, or use
a shared limiter such as Upstash, before promoting the form more widely.

If you use the Resend CLI, `resend doctor` checks authentication and domain
status, and `resend domains list` shows verified sending domains. For
production, add the same variables in Vercel and redeploy.

## Legal pages

`/privacy` and `/terms` live in the `(legal)` route group. They share the site
shell, footer, and typography through
[`src/components/legal-page.tsx`](src/components/legal-page.tsx), and both are
listed in `sitemap.xml`.

The privacy policy describes the current data flow: inquiry details go to the
configured inbox through Resend, WhatsApp messages go through Meta’s WhatsApp
service, the site is hosted on Vercel, Vercel Web Analytics collects cookieless
aggregate page views, there is no advertising tracking, and the theme preference
stays in browser local storage. It covers POPIA, the Information Regulator,
retention, cross-border processing, and visitor rights. The terms cover
acceptable use, intellectual property, inquiries, warranties, liability, and
South African governing law.

These are plain-language starting points, not legal advice. Review both pages
with a South African lawyer before launch, and update them if the data flow
changes (for example, changing analytics, a CMS, or a different email provider).
The contact email on both pages comes from `NEXT_PUBLIC_CONTACT_EMAIL`; set it
to an address you actually read before launch. The WhatsApp number comes from
`site.whatsapp`.

## Make it yours

Core data lives in [`src/content/site.ts`](src/content/site.ts); the longer
prose lives with its section.

1. **Identity** — change `name`, `wordmark`, `brandLine`, `legalName`, `role`,
   `tagline`, `location`, social links, the WhatsApp number, and availability in
   `site.ts`. The public email and site origin are environment-driven; see
   [SEO and metadata](#seo-and-metadata). The forest, bone, and signal sidebar
   mark lives in [`src/components/logo.tsx`](src/components/logo.tsx).
2. **Work** — edit [`src/content/projects.ts`](src/content/projects.ts). It
   contains all 37 projects pulled from Vercel: 19 published rows and 18
   skipped records. Add a project by moving it into `publishedProjects`, adding
   a screenshot in `public/projects/`, and filling in its summary, tags, and
   year. The homepage grid shows four rows per page and links to `/work`, which
   server-renders the full published index.
3. **Services** — edit `services` with your actual offers and timelines.
4. **Testimonials** — edit the `testimonials` array in
   [`src/content/site.ts`](src/content/site.ts). It is empty by default, so the
   section stays hidden until you add real client material you have permission
   to publish. Add the exact quote, name, and role; `image`, `rating`, and
   `source` are optional, and you should omit any rating the client did not give.
   The section is server-rendered, so the quote is crawlable and needs no
   carousel JavaScript. Review structured data is emitted only for the entries
   you add; there are no sample reviews in the codebase.
5. **Hero and about prose** — the headline and intro are in
   [`src/components/hero.tsx`](src/components/hero.tsx); the bio is in
   [`src/components/about.tsx`](src/components/about.tsx); the contact copy is
   in [`src/components/contact.tsx`](src/components/contact.tsx).
6. **Portrait** — the anime-style portrait in
   [`src/components/about.tsx`](src/components/about.tsx) uses
   `public/images/togb-portrait-anime.webp`. Replace it when the portrait changes
   and update the alt text in `site.portrait.alt`.
7. **Metadata and SEO** — set `NEXT_PUBLIC_SITE_URL` and
   `NEXT_PUBLIC_CONTACT_EMAIL`, then adjust the title, description, and social
   copy in [`src/app/layout.tsx`](src/app/layout.tsx) and
   [`src/app/opengraph-image.tsx`](src/app/opengraph-image.tsx). See
   [SEO and metadata](#seo-and-metadata).
8. **Legal pages** — update `site.legalUpdated` and
   `site.legalUpdatedIso`, review `/privacy` and `/terms`, and keep the
   data-flow descriptions accurate. See the legal-pages section above.

### SEO and metadata

The public SEO surface is environment-driven and covered by Playwright:

- `NEXT_PUBLIC_SITE_URL` becomes `metadataBase` and the origin for canonical
  links, `sitemap.xml`, `robots.txt`, Open Graph/Twitter images, and JSON-LD.
- `NEXT_PUBLIC_CONTACT_EMAIL` is the public email in the contact panel and
  `Person`/`ProfessionalService` schema. Vercel production builds fail fast if
  either public value is missing.
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and
  `NEXT_PUBLIC_BING_SITE_VERIFICATION` are optional. When set, they emit the
  matching verification meta tags; when empty, no tag is emitted.
- `src/app/opengraph-image.tsx` and `src/app/twitter-image.tsx` generate a
  1200×630 social card from the site tagline at build time. There is no static
  `public/og.jpg` to keep in sync.
- [`src/lib/structured-data.ts`](src/lib/structured-data.ts) emits shared
  `WebSite`, `Person`, and `ProfessionalService` nodes in the layout. The home
  page adds its own `WebPage` and `FAQPage` nodes; `/work` adds a
  `CollectionPage` with an `ItemList` of every published project, and legal
  pages add `BreadcrumbList` schema. The service node includes the WhatsApp
  telephone number, a `ContactPoint`, the logo, and the founding date.
- Review and `AggregateRating` schema is emitted only for real testimonials in
  `site.ts`. The array ships empty, so no fabricated review markup can ship.
- The visible FAQ is sourced from `faqs` in `site.ts`; the same content feeds
  the `FAQPage` schema. Keep the two in sync.
- A dated SEO audit and content roadmap live in
  [`docs/seo/2026-10-29-seo-audit.md`](docs/seo/2026-10-29-seo-audit.md).
- `/work` is a server-rendered, canonical page listing every published project;
  the homepage links to it. `sitemap.xml` includes home, work, legal pages, and
  project images, with the legal pages using `site.legalUpdatedIso` rather than
  the work-content date. `robots.txt` disallows `/api/`, and the web manifest
  plus security headers are generated by `manifest.ts` and `next.config.ts`.
- `site.contentUpdated` is the stable ISO date used for sitemap `lastmod` and
  schema `dateModified`; bump it when the content changes.

After setting the public variables, check the generated `<head>`, `/work`,
`/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, and the social image
routes on a production build. The e2e suite covers canonical/social metadata,
JSON-LD (including the no-fake-reviews guard), sitemap/robots/manifest, security
headers, `/work` server rendering, and its accessibility scan.

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

- **Brand constants** in `@theme`: paper, ink, forest, brass, bone, signal,
  sage. These are fixed reference colors.
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
  GitHub and WhatsApp links, copyright, and Privacy Policy/Terms of Use links.
  It deliberately does not repeat the availability, location, or local-time
  copy from the rest of the page.
- The floating back-to-top button is global. It appears after 600px of scroll,
  uses reduced-motion-aware scrolling, and is hidden at the top of the page.

### Accessibility and browser tests

`pnpm test:e2e` runs four Playwright projects: desktop light, desktop dark,
mobile light, and mobile dark. The suite covers theme persistence, pagination
focus and announcements, the floating top button, social/contact link dedupe,
static testimonial rendering, FAQ content, the sidebar Studio card, contact-form
labels and validation, a mocked successful submission, API
validation/honeypot/cross-origin handling, legal-page content and footer links,
canonical/social metadata, JSON-LD for approved reviews only, sitemap/robots/
manifest output, security headers, the server-rendered `/work` index, a 320px
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

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production origin and
      `NEXT_PUBLIC_CONTACT_EMAIL` to a mailbox you actually read
- [ ] Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and/or
      `NEXT_PUBLIC_BING_SITE_VERIFICATION`, verify the domain in Google Search
      Console and Bing Webmaster Tools, and submit `sitemap.xml`
- [ ] Add at least one real client testimonial (with permission) to
      `testimonials`; the section stays hidden while the array is empty
- [ ] Claim or create a Google Business Profile, keep the name, Gauteng service
      area, email, and WhatsApp number consistent, and ask real clients for
      reviews there
- [ ] Publish a detailed services page or case studies for the work you want to
      rank for; the homepage alone cannot compete for broad local keywords
- [ ] Review [`docs/seo/2026-10-29-seo-audit.md`](docs/seo/2026-10-29-seo-audit.md)
      and work through the content and off-page roadmap
- [ ] Verify a sending domain in Resend and replace `onboarding@resend.dev`
      with that address before relying on the contact form in production
- [ ] Send one test inquiry through the form and confirm it reaches
      `CONTACT_TO_EMAIL`
- [ ] Add an edge rate limit or CAPTCHA to `/api/contact`
- [ ] Review the privacy policy and terms with a South African lawyer
- [x] Replace the monogram with the anime-style portrait
- [ ] Review the generated Open Graph/Twitter card and update the copy in
      `src/app/opengraph-image.tsx` if needed
- [ ] Bump `site.contentUpdated` when the work or copy changes
- [ ] Re-check the Vercel work index and refresh any screenshots that have gone
      stale
- [ ] Run `pnpm test:e2e` and confirm light/dark, desktop/mobile, and 320px
- [ ] Keep new components on semantic tokens; fixed ink/paper only for
      intentional inverse surfaces

## Deploy to Vercel

Set these in the Vercel project’s Environment Variables settings before the
production build:

- `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CONTACT_EMAIL` for the public site.
- `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `RESEND_FROM_EMAIL` for the contact
  form.
- Optional: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and
  `NEXT_PUBLIC_BING_SITE_VERIFICATION`.

The root layout mounts `@vercel/analytics`. Enable Web Analytics for the project
in the Vercel dashboard or with:

```bash
vercel project web-analytics enable <project>
```

Import the repository at [vercel.com/new](https://vercel.com/new) or run:

```bash
npx vercel
```

Vercel detects Next.js automatically. After the first deploy, add your domain in
Project Settings → Domains, set `NEXT_PUBLIC_SITE_URL` to that origin, and
redeploy so canonical URLs, the sitemap, and social metadata use the real
domain. This repository does not deploy from CI; deploying is a manual,
approved step.

## Structure

```
src/
  app/
    (legal)/layout.tsx  policy-page shell with main landmark and footer
    (legal)/privacy/page.tsx  privacy policy
    (legal)/terms/page.tsx    terms of use
    api/contact/route.ts  validated Resend contact endpoint
    layout.tsx        fonts, metadata, providers, shell
    page.tsx          section order, main landmark, footer
    work/page.tsx     server-rendered full project index
    globals.css       semantic tokens, base styles, grain, motion
    not-found.tsx     404
    manifest.ts       web manifest
    opengraph-image.tsx / twitter-image.tsx  generated social cards
    robots.ts         robots.txt
    sitemap.ts        sitemap.xml with project images
  components/
    legal-page.tsx    shared legal page, section, and link primitives
    json-ld.tsx       safe JSON-LD script renderer
    site-sidebar.tsx  fixed desktop rail, icon nav, Studio card
    site-header.tsx   mobile header and theme toggle
    site-footer.tsx   theme-aware footer card
    scroll-to-top.tsx floating back-to-top control (client)
    theme-provider.tsx / theme-toggle.tsx
    hero.tsx           generated monolith hero
    work.tsx          work section wrapper, counts, all-work link
    work-grid.tsx     paginated project rows (client)
    services.tsx
    about.tsx
    testimonial-section.tsx  static, permissioned client quotes
    faq.tsx           visible FAQ sourced from site.ts
    contact.tsx       contact section
    contact-form.tsx  validated brief form (client)
    clock.tsx         live South Africa time (client)
    copy-email.tsx    copy-to-clipboard button (client)
    ui/               shadcn/ui primitives
  lib/
    contact-schema.ts shared zod schema and field errors
    email/contact-inquiry.ts  table-based HTML and text email
    seo.ts            absolute URL, host, and social image helpers
    structured-data.ts  site, work, FAQ, and breadcrumb JSON-LD
    utils.ts          app-level cn helper
  content/
    site.ts           identity, navigation, services, tools, FAQ, testimonials
    projects.ts       Vercel snapshot, published rows, skipped records
e2e/
  portfolio.spec.ts   browser, theme, and axe coverage
playwright.config.ts  four desktop/mobile light/dark projects
public/
  images/             generated hero and anime portrait artwork
  projects/           committed project screenshots
```
