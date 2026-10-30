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
- Neon Postgres for blog posts, comments, likes, reviews, and rate limits
- shadcn/ui primitives (Radix UI) on semantic design tokens
- next-themes for a system-first light/dark mode
- Vercel Web Analytics for cookieless, aggregate page views
- Resend for contact-form and review-notification email
- Markdown rendering with `react-markdown`, `remark-gfm`, and `rehype-slug`
- Playwright + axe-core for browser and accessibility checks
- Fonts: Bricolage Grotesque (display) and Instrument Sans (text), both via
  `next/font/google`

## Run it

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Then open http://localhost:3000. Set the public values in `.env.local`
before production:

```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_CONTACT_EMAIL=hello@yourdomain.com
```

`NEXT_PUBLIC_SITE_URL` must be an absolute origin with no trailing slash. It
drives canonical URLs, the sitemap, robots, Open Graph/Twitter metadata, and
JSON-LD. Until it is set, the build uses `https://example.com` as an obvious
placeholder. `NEXT_PUBLIC_CONTACT_EMAIL` controls the public address in the
contact panel and structured data. The WhatsApp link and E.164 value live in
`site.whatsapp` in `src/content/site.ts`; the number is linked, not rendered as
visible text.

The blog, comments, and reviews need a Postgres database. Create a free Neon
project, copy the pooled connection string into `DATABASE_URL`, then apply the
schema once:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

The schema creates `blog_posts`, `comments`, `comment_likes`, `reviews`, and
`rate_limits`. It is safe to run again because every statement uses
`IF NOT EXISTS` or a guarded constraint. The site still builds without a
database, but the blog and review pages show their empty states and
submissions return a clear configuration error.

Set the admin and hashing secrets before using `/admin`:

```bash
ADMIN_PASSWORD=use-a-long-random-password
ADMIN_SESSION_SECRET=$(openssl rand -hex 32)
IP_HASH_SALT=$(openssl rand -hex 32)
```

Fill in the Resend values too if you want the contact form and review
notifications to send mail; the rest of the site runs without them.

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

## Blog, comments, reviews, and admin

The public journal lives at `/blog`, with a post page at `/blog/[slug]`, an
RSS feed at `/blog/rss.xml`, and a linked share row on every post. Posts are
stored in Postgres and rendered from Markdown. The sitemap includes the index,
published posts, and their cover images; the blog index and RSS feed revalidate
on a short cache.

### Admin

Go to `/admin/login` and sign in with `ADMIN_PASSWORD`. The session is signed
with `ADMIN_SESSION_SECRET` and stored in an HttpOnly, same-site cookie. Admin
routes are dynamic, excluded from the public navigation, and disallowed in
`robots.txt`.

- **Posts** — create a post with a slug, title, excerpt, Markdown body, optional
  tags and cover image, and a draft or published state. Publishing sets
  `published_at` if it is empty. Edits revalidate the affected public pages.
- **Comments** — approve, reject, mark as spam, or delete. Only approved
  comments and their approved parents are public. Replies are capped at depth 3.
- **Reviews** — approve, reject, delete, and toggle the “Verified client” badge.
  Approving sets `approved_at`; rejecting or deleting removes the review from
  public pages. Only approved reviews feed the homepage section, `/reviews`, and
  structured data.

### Reader submissions

Comments require a name, email, and comment; the email is stored privately.
The form includes a honeypot and same-origin/body-size checks, and the API
validates again with zod. New comments start as `pending`. Approved comments
render as a threaded tree, with a reply form on each comment until depth 3.

Comment likes are anonymous and toggleable. The API combines a first-party
HttpOnly `togb_visitor` cookie with a salted hash of the request IP and
user-agent, so the same browser cannot count the same like twice. Likes use the
same moderation boundary as comments: only approved comments can be liked.

Reviews require the client’s name, email, review text, a confirmation that they
worked with TOGB, and consent to publication. Company, role, and rating are
optional. New reviews start as `pending` and trigger a Resend notification when
email is configured. The admin must check the email against client records
before approving. No review is invented, scraped, or published without consent.
If there are no approved reviews, the homepage section stays hidden and
`/reviews` shows an honest empty state.

### Rate limits and retention

Submission and like endpoints use a Postgres-backed fixed-window limiter keyed
by a salted request fingerprint. The tables and limits are in
[`db/schema.sql`](db/schema.sql). The privacy policy describes the retention
window: approved content stays while published; removed or rejected content is
kept only for a limited moderation/audit period and normally deleted within
12 months. Pending submissions are normally deleted within 12 months.

The admin password, session secret, and IP hash salt are server-only. Never
prefix them with `NEXT_PUBLIC_`, and never commit `.env.local`.

## Legal pages

`/privacy` and `/terms` live in the `(legal)` route group. They share the site
shell, footer, and typography through
[`src/components/legal-page.tsx`](src/components/legal-page.tsx), and both are
listed in `sitemap.xml`.

The privacy policy describes the current data flow: inquiry details go to the
configured inbox through Resend, WhatsApp messages go through Meta’s WhatsApp
service, the site is hosted on Vercel, Vercel Web Analytics collects cookieless
aggregate page views, there is no advertising tracking, and the theme preference
stays in browser local storage. It also covers the Neon database that stores
blog posts, comments, reviews, likes, and rate limits; the `togb_visitor`
cookie used for comment likes; moderation; retention; and the admin session.
The terms cover acceptable use, intellectual property, inquiries, warranties,
liability, South African governing law, and the comment and review rules
(moderation, consent, the user-content licence, verification, and removal).

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
4. **Reviews** — do not edit a hard-coded testimonial array. Reviews are
   submitted through `/reviews`, stored in Postgres, and published only after
   admin approval. Use `/admin/reviews` to approve a real client review and,
   when you have checked the client relationship, add the “Verified client”
   badge. The homepage section stays hidden until at least one review is
   approved. Omit a rating if the client did not give one; never invent or
   scrape a review. See [Blog, comments, reviews, and admin](#blog-comments-reviews-and-admin).
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
  `CollectionPage` with an `ItemList` of every published project; `/blog` adds a
  `Blog` and `CollectionPage`; post pages add `BlogPosting`; `/reviews` adds a
  `CollectionPage` and `ItemList`; and legal pages add `BreadcrumbList` schema.
  The service node includes the WhatsApp telephone number, a `ContactPoint`,
  the logo, and the founding date.
- Review and `AggregateRating` schema is emitted only for approved database
  reviews. Pending, rejected, and deleted reviews never appear in schema. When
  there are no approved reviews, no review markup is emitted and the homepage
  section is hidden.
- The visible FAQ is sourced from `faqs` in `site.ts`; the same content feeds
  the `FAQPage` schema. Keep the two in sync.
- A dated SEO audit and content roadmap live in
  [`docs/seo/2026-10-29-seo-audit.md`](docs/seo/2026-10-29-seo-audit.md).
- `/work` is a server-rendered, canonical page listing every published project;
  the homepage links to it. `sitemap.xml` includes home, work, blog, published
  posts, reviews, legal pages, and project/cover images, with the legal pages
  using `site.legalUpdatedIso` rather than the work-content date. `robots.txt`
  disallows `/api/` and `/admin`, and the web manifest plus security headers are
  generated by `manifest.ts` and `next.config.ts`.
- `site.contentUpdated` is the stable ISO date used for sitemap `lastmod` and
  schema `dateModified`; bump it when the content changes.

After setting the public variables, check the generated `<head>`, `/work`,
`/blog`, a published post, `/reviews`, `/sitemap.xml`, `/robots.txt`,
`/manifest.webmanifest`, and the social image routes on a production build.
The e2e suite covers canonical/social metadata, JSON-LD (including the
no-fake-reviews guard), sitemap/robots/manifest, security headers, `/work`
server rendering, blog/review routes, admin login, and accessibility scans.

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
- [ ] Add at least one real client review through `/reviews` and approve it in
      `/admin/reviews`; the homepage section stays hidden until a review is
      approved
- [ ] Publish the first real blog post in `/admin/posts` and confirm it appears
      in `/blog`, the RSS feed, and `sitemap.xml`
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
  form and review notifications.
- `DATABASE_URL` for the Neon Postgres database.
- `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, and `IP_HASH_SALT` for the admin
  login and hashed request fingerprints.
- Optional: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and
  `NEXT_PUBLIC_BING_SITE_VERIFICATION`.

Apply the schema to the production database once before the first deploy:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

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
    (legal)/terms/page.tsx    terms of use, including comment/review rules
    admin/             password-protected dashboard, post editor, moderation
    api/blog/comments/ validated comment submission and like toggle
    api/contact/route.ts  validated Resend contact endpoint
    api/reviews/route.ts  validated review submission and notification
    blog/page.tsx      published post index and empty state
    blog/[slug]/page.tsx  Markdown post, share controls, comments, schema
    blog/rss.xml/route.ts  RSS 2.0 feed
    reviews/page.tsx   approved reviews and review popup
    layout.tsx        fonts, metadata, providers, shell
    page.tsx          section order, main landmark, footer
    work/page.tsx     server-rendered full project index
    globals.css       semantic tokens, base styles, article prose, grain
    not-found.tsx     404
    manifest.ts       web manifest
    opengraph-image.tsx / twitter-image.tsx  generated social cards
    robots.ts         robots.txt
    sitemap.ts        sitemap.xml with projects, posts, and reviews
  components/
    comment-dialog.tsx accessible comment/reply popup (client)
    comment-form.tsx  validated reader comment/reply form (client)
    comment-like-button.tsx  toggleable like control (client)
    comment-section.tsx  threaded comments and reply popups
    review-dialog.tsx  accessible review form popup (client)
    review-form.tsx   consent-based client review form (client)
    ui/dialog.tsx     shared accessible dialog primitive (client)
    blog-share.tsx    WhatsApp, X, Facebook, LinkedIn, copy, native share
    markdown.tsx      safe Markdown renderer with heading ids
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
    testimonial-section.tsx  approved database reviews; hidden when empty
    faq.tsx           visible FAQ sourced from site.ts
    contact.tsx       contact section
    contact-form.tsx  validated brief form (client)
    clock.tsx         live South Africa time (client)
    copy-email.tsx    copy-to-clipboard button (client)
    ui/               shadcn/ui primitives
  lib/
    admin-data.ts     admin queries and dashboard counts
    admin-session.ts  signed HttpOnly admin session
    community-data.ts public posts, reviews, comments, likes, caches
    community-schema.ts  zod schemas for posts, comments, reviews, login
    contact-schema.ts shared zod schema and field errors
    database.ts       Neon client and configuration check
    email/contact-inquiry.ts  table-based HTML and text email
    rate-limit.ts     Postgres fixed-window limiter
    request-security.ts  origin, body-size, and request checks
    seo.ts            absolute URL, host, and social image helpers
    structured-data.ts  site, work, blog, review, FAQ, and breadcrumb JSON-LD
    utils.ts          app-level cn helper
    validation.ts     shared validation helpers
    visitor.ts        visitor cookie and hashed request fingerprint
  content/
    site.ts           identity, navigation, services, tools, FAQ
    projects.ts       Vercel snapshot, published rows, skipped records
db/
  schema.sql          Neon tables, indexes, constraints, updated-at trigger
e2e/
  portfolio.spec.ts   browser, theme, blog/review/admin, and axe coverage
playwright.config.ts  four desktop/mobile light/dark projects
public/
  images/             generated hero and anime portrait artwork
  projects/           committed project screenshots
```
