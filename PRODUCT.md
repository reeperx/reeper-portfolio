# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Neon Postgres, Resend, and Vercel. This is an existing codebase; the rebrand extends it rather than starting over.

## Users

Small teams of one to twenty people who need a launch site, a focused web app, or a rescue. They value a direct relationship with the person doing the work, clear scope, and a site that is fast, accessible, and easy to keep running.

## Product Purpose

TOGB is the public portfolio and inquiry surface for an independent web developer in Gauteng. It exists to show selected work, explain the services, establish trust, and turn a qualified visitor into a project inquiry. Success is a clear understanding of the offer and a real inquiry, not raw traffic.

## Positioning

One senior developer owns the whole job: design, build, deploy, and handover. No agency layers, no hand-offs, no account manager. The work is judged by whether the finished site earns its keep.

## Operating Context

Visitors arrive from referrals, social profiles, search, and shared blog posts. They scan work, services, writing, and proof, then use the contact form, email, or WhatsApp. The site is maintained as a single Next.js app on Vercel, with Neon Postgres for the journal, comments, likes, and reviews, Resend for email, and Vercel Web Analytics for aggregate usage.

## Capabilities and Constraints

- Single-page portfolio with work, services, about, FAQ, approved client reviews, and contact sections. The review section only renders when approved, permissioned reviews exist.
- Full work index at `/work`; legal pages at `/privacy` and `/terms`.
- Contact form posts to `/api/contact`, is validated server-side, and is delivered by Resend.
- Public journal at `/blog`, Markdown post pages, RSS at `/blog/rss.xml`, social sharing, and a Postgres-backed admin CMS at `/admin`.
- Threaded reader comments with replies, moderation, and anonymous toggleable likes. Comments require a name and email; email stays private; depth is capped at 3. Comment and reply forms open in accessible dialogs.
- Client reviews are submitted at `/reviews` in an accessible dialog, stored as `pending`, and published only after admin approval and verification against client records. The homepage section and review schema use approved reviews only.
- Vercel Web Analytics is cookieless; there is no advertising tracking. The only community cookie is the HttpOnly `togb_visitor` identifier used to deduplicate comment likes.
- No sample reviews ship. Review and `AggregateRating` schema are emitted only for real, permissioned client reviews. The review section stays hidden while there are none.
- Keep the GitHub `Verify` workflow green: PR required, linear history, resolved conversations.
- The final custom domain and Vercel project name are not confirmed. `togb-portfolio` is the current brand-consistent deployment target.

## Brand Commitments

- Public name: TOGB. Full name: The Original Brand. The name Reeper must not appear in public UI, metadata, legal copy, structured data, or generated social cards.
- Voice: direct, grounded, confident, unsentimental; no hype or agency jargon.
- GitHub remains linked in the footer. WhatsApp is the public messaging channel; LinkedIn is removed from the footer and public social links. The public brand changes, not the GitHub handle.
- Portrait asset: `/public/images/togb-portrait-anime.webp`, an anime-style illustration generated from the supplied portrait.
- Hero asset: `/public/images/togb-hero.webp`, a monolithic T-shaped stone artifact in a brutalist gallery.
- Preserve SEO, analytics, contact form, legal pages, accessibility, and the green Verify workflow.

## Evidence on Hand

- Real public project deployments are listed in `src/content/projects.ts`; the work index is a snapshot of public Vercel projects.
- Real portrait supplied at `/home/reeper/Pictures/WhatsApp Image 2026-10-29 at 09.59.51.jpeg`; the anime-style version was generated with Higgsfield.
- Hero image generated with Higgsfield.
- No permissioned client reviews, logos, ratings, press, or case-study metrics are on hand yet. The review section is hidden until a real client submits a review and it is approved; do not scrape, invent, or reuse reviews from dead sites.
- The public review and comment system is the only legitimate route for collecting new proof. It requires client confirmation and publication consent before a review can be approved.
- WhatsApp is linked as `https://wa.me/27717884230` and exposed as `+27717884230` in structured data. The number is not rendered as visible text anywhere in the interface.

## Product Principles

1. Show the work before asking for trust.
2. Make the offer legible in one scan: who, what, where, and how to start.
3. Keep the path from interest to inquiry short and human.
4. Build for speed, accessibility, and maintainability; the site is the proof.
5. Never invent proof. Publish only what is real, permissioned, and checked; the review section stays hidden until an approved review exists.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Keyboard access for every control, visible focus, semantic headings and landmarks, readable contrast in light and dark themes, reduced-motion support for the hero, and no autoplaying audio.
