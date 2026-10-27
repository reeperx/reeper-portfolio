# Reeper — freelance portfolio

A one-page portfolio for an independent web developer. The work is presented as
an editorial index, every project row links straight to its live Vercel deploy,
and the editable content lives in a small set of files so the site is quick to
make yours.

## Stack

- Next.js 16 (App Router) with React 19
- Tailwind CSS v4
- TypeScript
- Fonts: Bricolage Grotesque (display) and Instrument Sans (text), both via
  `next/font/google`

## Run it

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

Useful checks:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

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

### Colours and type

The design tokens are at the top of
[`src/app/globals.css`](src/app/globals.css):

- paper `#f3f1ea`, ink `#17140f`, blue `#2338e8`, signal `#ff5c2b`
- display type: Bricolage Grotesque
- text type: Instrument Sans

Change the token values to re-skin the whole site; keep the ink-on-paper and
paper-on-blue contrast intact.

## Before you launch

- [ ] Replace the placeholder testimonial (or remove it)
- [ ] Replace `hello@example.com` with an address you actually read
- [ ] Replace the monogram with a real portrait
- [ ] Update `site.url` to the production domain
- [ ] Add a real Open Graph image (`public/og.jpg`) and reference it in
      `layout.tsx` if you want rich link previews
- [ ] Re-check the Vercel work index and refresh any screenshots that have gone
      stale
- [ ] Run `pnpm build` and check the site at mobile and desktop widths

## Deploy to Vercel

The project has no environment variables and no external services. Import the
repository at [vercel.com/new](https://vercel.com/new) or run:

```bash
npx vercel
```

Vercel detects Next.js automatically. After the first deploy, add your domain in
Project Settings → Domains, then update `site.url` in `site.ts` and redeploy.

## Structure

```
src/
  app/
    layout.tsx        fonts, metadata, shell
    page.tsx          section order
    globals.css       tokens, base styles, grain, load animation
    not-found.tsx     404
    robots.ts         robots.txt
    sitemap.ts        sitemap.xml
  components/
    site-sidebar.tsx  fixed desktop rail
    site-header.tsx   mobile header
    hero.tsx
    work.tsx          work section wrapper and counts
    work-grid.tsx     paginated project rows (client)
    services.tsx
    about.tsx
    testimonial-section.tsx
    contact.tsx       contact + footer
    clock.tsx         live Johannesburg time (client)
    copy-email.tsx    copy-to-clipboard button (client)
  content/
    site.ts           identity, navigation, services, tools
    projects.ts       Vercel snapshot, published rows, skipped records
public/
  projects/           committed project screenshots
```
