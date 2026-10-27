# GitNexus Engineering Plan

> Task: Refresh the portfolio footer, adopt shadcn primitives, and add a persistent light/dark theme without changing the editorial design language.
> Evidence verified at commit 9791189e1378331767aedd6cdfe0102be31aec0f; GitNexus index refreshed this session with `analyze --index-only --pdg` (293 nodes, 418 edges, 7 flows).
> Evidence provenance schema 2; global dirty digest 0a9c85780067d9afcd0764f307b60891e3cee927ee11eaeb5ec7826d10fd82cd; cited-path manifest 23 sorted entries; exact generated plan path excluded.

## 1. Objective

Make the bottom of the portfolio feel deliberately finished rather than appended:

- Replace the plain footer row with a vibrant, rounded footer card in the same editorial language.
- Remove repeated social/contact links by making the footer the single canonical place for GitHub and LinkedIn, keeping the email CTA only in the contact panel.
- Introduce shadcn/ui as the component layer for buttons, badges, and the theme control while preserving the existing Bricolage/Instrument Sans, cream/ink/blue/signal identity.
- Add a persistent light/dark theme toggle with system-default behaviour and no hydration flash.
- Keep `main` protected and unreleased: branch, PR, green CI, review, merge; no deploy.

Acceptance criteria:

1. Footer is rounded, high-contrast, and visually richer than the current three-line row.
2. GitHub and LinkedIn each appear exactly once on the page; email appears once as the contact CTA; footer adds no repeated nav links.
3. Theme toggle is keyboard accessible, persists across reloads, and works on mobile and desktop.
4. Light and dark modes pass axe WCAG A/AA checks at desktop and mobile widths.
5. `pnpm lint`, `pnpm typecheck`, `pnpm build`, and the new e2e suite pass locally and in CI.
6. `main` remains protected; the work lands through a pull request with no deployment.

## 2. Current Behaviour

The page is composed in `Home` (`src/app/page.tsx`) as `Hero → Work → Services → About → TestimonialSection → Contact` [verified: src/app/page.tsx:8-20]. `RootLayout` renders `SiteSidebar`, `SiteHeader`, and the main content, and is the only layout entry point [verified: src/app/layout.tsx:60-78].

`Contact` is a full-bleed blue section. Its left column holds the email CTA and availability; its right column repeats the socials already rendered in `SiteSidebar`; its final `<footer>` is a thin copyright/stack/back-to-top row [verified: src/components/contact.tsx:51-100; src/components/site-sidebar.tsx:54-73]. This is the repetition the redesign removes.

The theme is fixed light: `viewport.colorScheme` is `"light"`, and `globals.css` defines only a light palette (`paper`, `ink`, `blue`, `ice`, `signal`) with no `.dark` variant [verified: src/app/layout.tsx:55-58; src/app/globals.css:3-14]. No theme provider or toggle exists.

`WorkGrid` is the only stateful list island: `page` state, derived `currentPage`, `useMemo` slicing, a `useEffect` that scrolls/focuses after page changes, and `goToPage` clamping [verified: src/components/work-grid.tsx:20-56]. `CopyEmail` owns clipboard state and a 2s reset timer [verified: src/components/copy-email.tsx:5-34]. `Clock` owns a 30s interval [verified: src/components/clock.tsx:16-27].

## 3. Relevant Architecture

- Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript strict [verified: package.json; tsconfig.json].
- Server components by default; `WorkGrid`, `CopyEmail`, `Clock` are the current client islands (`"use client"`). The new theme provider/toggle and the existing islands are the only client boundaries the change introduces.
- Tailwind v4 `@theme` tokens are the design system; shadcn will be layered on with `@theme inline` semantic variables and a class-based `.dark` variant [verified: src/app/globals.css:1-14; src/app/layout.tsx:60-78].
- Component graph: `RootLayout → SiteSidebar|SiteHeader`, `Home → Contact|Work|…`, `Contact → Clock|CopyEmail|ArrowUpRight`, `Work → WorkGrid`, `WorkGrid → ArrowLeft|ArrowRight|ArrowUpRight|goToPage` [graph: context() calls on Contact, WorkGrid, CopyEmail, SiteSidebar, SiteHeader, Home].
- No test framework, no Playwright config, and no shadcn configuration exists yet [verified: package.json scripts/dependencies; repository file listing].
- CI is a single `Verify` job running install, lint, typecheck, and build; branch protection on `main` requires `Verify`, a PR, linear history, and conversation resolution [verified: .github/workflows/ci.yml; GitHub branch-protection API response].

## 4. GitNexus Findings

Primary symbols and blast radius (all directions upstream, maxDepth 3, `summaryOnly`):

| Symbol | Direct dependents | Risk | Processes touched |
| --- | --- | --- | --- |
| `Contact` | `Home` (d=1) | LOW | Home (5 sections) |
| `SiteSidebar` | `RootLayout` (d=1) | LOW | RootLayout |
| `SiteHeader` | `RootLayout` (d=1) | LOW | RootLayout |
| `WorkGrid` | `Work` (d=1), `Home` (d=2) | LOW | Home → ArrowLeft/Right/UpRight/GoToPage |
| `CopyEmail` | `Contact` (d=1), `Home` (d=2) | LOW | Home, Contact → FormatTime |

`RootLayout` has no resolved upstream callers and is the framework entry point; its risk is reported `UNKNOWN` because there is nothing to walk, not because the change is unsafe [graph: impact(RootLayout); source confirms layout is the App Router root].

Call relationships confirmed by `context()`:

- `Contact` calls `Clock`, `CopyEmail`, and `ArrowUpRight` [graph: context(Contact)].
- `WorkGrid` calls `ArrowLeft`, `ArrowRight`, `ArrowUpRight`, and its inner `goToPage` [graph: context(WorkGrid)].
- `SiteSidebar` calls `Clock`; `SiteHeader` has no outgoing calls [graph: context(SiteSidebar, SiteHeader)].
- `Home` calls all six sections; `Contact` is the only caller of `CopyEmail` [graph: context(Home, CopyEmail)].

Execution traces:

- `Home → Work → WorkGrid → goToPage` [graph: process "Home → GoToPage"].
- `Contact → Clock → tick → formatTime` [graph: process "Contact → FormatTime"].
- `RootLayout → SiteSidebar → Clock → tick → formatTime` [graph: process "RootLayout → FormatTime"].

No test files are associated with these symbols; the repository has no test runner [verified: repository file listing; package.json]. This plan therefore adds browser-level regression coverage rather than claiming unit tests that do not exist.

## 5. Statement-Level PDG Findings

PDG layer was built this session with `analyze --index-only --pdg`.

**`WorkGrid` — pagination and focus** [graph: pdg_query(controls, WorkGrid); pdg_query(flows, currentPage)]

- Statements at lines 36-52 are gated by `currentPage === previousPage.current`: the true branch returns early; the false branch updates `previousPage.current`, reads `prefers-reduced-motion`, scrolls `listTopRef` into view, and focuses `firstProjectRef` [verified: src/components/work-grid.tsx:36-52].
- `currentPage` is derived from `page` and `totalPages`, and feeds `visibleProjects`, the numbering, the live-region copy, pagination labels, and `aria-current` [verified: src/components/work-grid.tsx:20-34, 58-63, 143-196].
- `goToPage` clamps `nextPage` into `[1, totalPages]` before `setPage` [verified: src/components/work-grid.tsx:54-56].
- Planning consequence: replacing native `<button>` elements with shadcn `Button` must not change `onClick`, `disabled`, `aria-controls`, `aria-current`, or the focus/scroll effect. The components are presentational; the state machine stays intact.

**`CopyEmail` — clipboard feedback** [graph: pdg_query(controls, CopyEmail)]

- The unmount effect clears the timer only when `timer.current` is truthy; `copy()` clears an existing timer, writes the clipboard, sets `copied`, and schedules a 2s reset; the `catch` deliberately leaves the mailto fallback intact [verified: src/components/copy-email.tsx:9-24].
- Planning consequence: use a shadcn `Button` for appearance only; preserve `aria-live="polite"` and the timer/error semantics.

**`Clock` — interval lifecycle** [graph: pdg_query(controls, Clock) returned no control-dependence edges]

- The component initialises to `null`, ticks immediately, refreshes every 30s, and clears the interval on unmount [verified: src/components/clock.tsx:16-27].
- Planning consequence: the theme provider must wrap, not remount, the clock. No state or timer changes are needed.

**`Contact` — composition only**

- No state or guards. `Clock` and `CopyEmail` are leaf client components; the contact redesign must keep them mounted in the same section [verified: src/components/contact.tsx:30-48, 77-85].

**New `ThemeToggle`**

- No existing symbol, so no PDG slice exists. The implementation is constrained by hydration safety: server markup must match the first client render, and the resolved theme is only trusted after mount.

## 6. Proposed Changes

### 6.1 Tooling and dependencies

- `package.json` / `pnpm-lock.yaml`: add `next-themes`, shadcn runtime dependencies resolved by the CLI (`class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `tw-animate-css`, `@radix-ui/react-slot` if the selected primitives need it), and dev dependencies `@playwright/test` + `@axe-core/playwright`. Add `test:e2e` and optionally `test:e2e:ui` scripts.
- `components.json` (new): shadcn configuration using the Radix base, CSS variables, Tailwind v4, `src/lib/utils` alias, and `src/components/ui` output.
- `src/lib/utils.ts` (new): the standard `cn()` helper.
- `src/components/ui/button.tsx`, `src/components/ui/badge.tsx` (new, generated by shadcn): the only primitives needed for this change. Keep generated code unmodified unless a variant genuinely needs a project-specific class.

### 6.2 Theme foundation

- `src/app/globals.css`: replace the flat brand-only theme with a two-layer token system:
  - fixed brand constants (`ink`, `paper`, `blue`, `signal`) for inverse surfaces and the wordmark;
  - semantic shadcn tokens (`background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `muted-foreground`, `accent`, `destructive`, `border`, `input`, `ring`, `link`, `on-brand`) in `:root` and `.dark`;
  - `@custom-variant dark (&:is(.dark *));`, `@theme inline`, radius scale, and the existing grain/rise/fade/reduced-motion utilities.
- Light palette keeps the current cream/ink/blue identity. Dark palette uses a warm near-black canvas, elevated card, cream foreground, brand blue primary, and a brighter `link` tone for text on dark. All contrast pairs are verified by axe in the e2e suite.
- `src/app/layout.tsx`: add `suppressHydrationWarning` to `<html>`, wrap the shell in `ThemeProvider` with `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`; set `colorScheme: "light dark"` and a media-aware `themeColor`.
- `src/components/theme-provider.tsx` (new): thin `"use client"` wrapper over `next-themes`.
- `src/components/theme-toggle.tsx` (new): shadcn `Button` (icon size, rounded-full), Sun/Moon from the existing icon module or lucide, mounted guard, `aria-pressed`, explicit `aria-label` for the next action, `title`, and a 40px hit target. Place it in the sidebar wordmark row and the mobile header.
- `src/components/icons.tsx`: add `Sun`, `Moon`, and `ArrowUp` (24×24, stroke 1.8, `aria-hidden`) so the icon language stays consistent and shadcn does not introduce a second visual system.

### 6.3 Footer and contact redesign

- `src/components/contact.tsx`: keep the blue panel but inset it with page padding, `rounded-[2rem]`/`rounded-[2.5rem]`, layered radial glows (signal top-right, blue/ice bottom-left), and grain. Keep the email CTA, copy button, availability, and local time. Replace the duplicate “Elsewhere” column with a non-link “How it starts” three-step panel (brief → reply in one business day → build in visible increments). Remove the old inline `<footer>`.
- `src/components/site-footer.tsx` (new): a page-level `<footer>` card rendered after `Contact`, with `rounded-[2rem]`, fixed ink background, paper foreground, a thin blue→signal gradient rule, and a subtle radial glow. Contents:
  - oversized `reeper.` wordmark (static, not a link);
  - availability badge with a green status dot;
  - the only GitHub and LinkedIn links on the page, as rounded outline pills with external-link affordance;
  - a rounded back-to-top `Button` linking to `#top`;
  - bottom row: copyright, Johannesburg location, local time via `Clock`, and a short “Next.js + shadcn/ui” colophon.
  - No nav list, no email link, no duplicate wordmark link.
- `src/app/page.tsx`: render `<SiteFooter />` after `<Contact />` so the footer is a true page landmark.
- `src/components/site-sidebar.tsx`: remove the social list (now canonical in the footer), add `ThemeToggle` beside the wordmark, and migrate all styles to semantic tokens. Keep availability, location, and time.
- `src/components/site-header.tsx`: add `ThemeToggle` to the mobile nav, migrate to semantic tokens, round the Contact CTA, and keep the same breakpoints.

### 6.4 shadcn and semantic-token migration

- `src/components/work-grid.tsx`: keep the state machine and accessibility contract exactly; replace pagination `<button>`s with shadcn `Button` (`variant="outline"`/`default`, `size="icon"`/`sm`), replace tag `<li>` styles with `Badge variant="outline"`, use `cn()` for active-page classes, round image frames and tags, and migrate all `ink/paper/blue` classes to semantic tokens plus `on-brand` for the hovered blue row.
- `src/components/copy-email.tsx`: shadcn `Button` with outline styling on the blue panel; preserve clipboard and live-region behaviour.
- `src/components/hero.tsx`, `about.tsx`, `services.tsx`, `section-heading.tsx`, `testimonial-section.tsx`, `not-found.tsx`, `layout.tsx` skip link: migrate to semantic tokens, round the primary CTAs and portrait frame, and keep the existing typography, spacing, and motion.
- `src/components/services.tsx` and `work-grid.tsx`: use `cn()` for conditional borders/active states instead of template strings.
- `README.md`: document the theme tokens, shadcn workflow (`pnpm dlx shadcn@latest add …`), e2e commands, and the branch/PR protection rules. Update the structure tree and launch checklist.

### 6.5 Regression tests

- `playwright.config.ts` (new): Chromium only; desktop-light, desktop-dark, and mobile-light projects; `webServer` runs the built app on `127.0.0.1:3100`; retries on CI; trace on first retry.
- `e2e/portfolio.spec.ts` (new):
  1. theme toggle changes the `html` class, updates the accessible label, and persists after reload;
  2. pagination shows four projects, advances to page 2, preserves `aria-current`, and moves focus to the first project;
  3. GitHub and LinkedIn each appear exactly once, email appears once, and the footer has no nav links;
  4. axe scan in light and dark, desktop and mobile, fails on serious/critical violations;
  5. no horizontal overflow at 320px and 390px.
- `.github/workflows/ci.yml`: add `pnpm exec playwright install --with-deps chromium` and `pnpm test:e2e` after build; keep the `Verify` job name so branch protection continues to match.

## 7. Implementation Sequence

1. **Install and configure shadcn.** Run `pnpm dlx shadcn@latest init` with the Radix base and existing aliases; add `button` and `badge`. Add `next-themes`. Review generated files; keep the existing fonts, grain, and motion. Run `pnpm lint`, `pnpm typecheck`, `pnpm build`.
2. **Build the token foundation.** Rewrite `globals.css` with fixed brand constants, semantic light/dark tokens, `@custom-variant dark`, and `@theme inline`. Do not yet change components. Verify the site still renders identically in light mode.
3. **Wire the theme provider.** Add `theme-provider.tsx`, wrap the layout, add `ThemeToggle`, and place it in the sidebar/header. Verify no hydration warning, no flash, system default, persistence, and keyboard operation.
4. **Migrate the component surface.** Convert one component group at a time to semantic tokens and shadcn primitives: work grid → copy email → hero/about/services/testimonial/heading/not-found/layout skip link. Keep each group compiling and visually checked before the next.
5. **Redesign the footer and contact.** Build `SiteFooter`, remove the duplicate social column and inline footer, update `page.tsx`, and confirm the footer is the only source of GitHub/LinkedIn links.
6. **Add regression tests.** Add Playwright config/specs and axe coverage. Update CI. Run the full suite at desktop and mobile, light and dark.
7. **Document and review.** Update README, run GitNexus `detect_changes` and `impact` on the final diff, run all checks, commit in logical commits, push, open a PR, and merge only after `Verify` is green.
8. **Verify remote state.** Confirm `main` is protected, the branch is deleted, local and remote are synced, and no deployment occurred.

## 8. Test Strategy

Automated:

- `pnpm lint` — existing ESLint config.
- `pnpm typecheck` — `next typegen && tsc --noEmit`.
- `pnpm build` — production build.
- `pnpm test:e2e` — new Playwright suite.
- CI runs the same commands in `.github/workflows/ci.yml`; branch protection requires the `Verify` check.

Scenarios:

| Scenario | Action | Expected |
| --- | --- | --- |
| Theme toggle, light start | Click “Switch to dark mode” | `html.dark`, label flips to “Switch to light mode”, cream-on-dark page |
| Theme persistence | Toggle dark, reload | Dark class survives via `localStorage`; no visible flash |
| System preference | Emulate dark color scheme before load | Dark theme on first paint; toggle label matches |
| Pagination | Click page 2 | Four projects from page 2, `aria-current="page"` on 2, focus on first project link, live region announces page 2 |
| Pagination bounds | Previous on page 1 / Next on last page | Buttons disabled; page count unchanged |
| Link dedupe | Count GitHub/LinkedIn/email links | Exactly one each; footer has no nav links |
| Footer semantics | Inspect landmarks | One page-level `<footer>`; contact remains a labelled section |
| Accessibility, light | axe on desktop and mobile | No serious/critical WCAG A/AA violations |
| Accessibility, dark | axe on desktop and mobile | No serious/critical violations; focus ring visible |
| Small viewport | 320px and 390px | No horizontal overflow; footer stacks without clipping |
| Reduced motion | Emulate `prefers-reduced-motion: reduce` | Pagination scroll uses `auto`, animations effectively disabled |

Manual checks:

- Keyboard-only pass through header, sidebar, work rows, pagination, copy email, footer socials, back-to-top, and theme toggle.
- VoiceOver/NVDA spot check of the theme label, live region, and footer landmark.
- Visual diff at 320, 768, 1024, 1440, and 1920px in both themes.

No deployment is part of this plan.

## 9. Risk and Impact Analysis

- **Direct dependents are accounted for.** `Home` (Contact, WorkGrid via Work), `RootLayout` (Sidebar/Header), `Work` (WorkGrid), and `Contact` (CopyEmail) are the only d=1 dependents. The changes are presentational or additive; public props stay unchanged. `RootLayout` has no resolved callers and is the framework entry. No API routes, data models, or network calls are touched.
- **Hydration/theme flash.** `next-themes` needs `suppressHydrationWarning` and a mounted guard. The toggle must render a stable placeholder before `resolvedTheme` is known. Risk: a brief icon mismatch; mitigated by mounting state and a non-interactive pre-mount button.
- **Token migration regressions.** 73 legacy `paper/ink/blue` references exist. A complete grep after migration must show only fixed-brand uses (`bg-ink`, `bg-primary`, `text-paper` on ink/blue) and no theme-dependent leftovers. Risk: dark-mode contrast; mitigated by axe and manual checks.
- **shadcn overwrites.** `shadcn init` may append or replace theme variables. Review `globals.css` after init and keep the project palette. Risk: generated components import dependencies not installed; the CLI resolves them, and CI catches drift.
- **Link dedupe loses mobile access.** If socials are removed from both sidebar and contact without adding them to the footer, mobile users lose them. The plan makes the footer canonical for GitHub/LinkedIn and keeps email in the contact CTA; the e2e link-count test protects this.
- **CI time.** Playwright + Chromium adds ~1–2 minutes. The `Verify` job remains the single required check. Risk: flaky browser tests; mitigated by retries on CI, a single browser, and deterministic assertions.
- **Performance.** `next-themes` and two shadcn primitives add a small client bundle. No images, fonts, or runtime APIs are added. The footer remains a server component except for the existing `Clock` island.
- **Accessibility.** Footer contrast is cream on ink (high), social pills have visible focus rings, and the theme toggle has an explicit accessible name. Risk: `aria-pressed` plus changing labels can be noisy; the label describes the next action and the pressed state describes the current mode. Verify with axe and a screen-reader spot check.

## 10. Files Expected to Change

| File | Symbols | Reason |
| --- | --- | --- |
| `package.json`, `pnpm-lock.yaml` | scripts, dependencies | shadcn, next-themes, Playwright, axe |
| `components.json` | — | shadcn configuration |
| `src/lib/utils.ts` | `cn` | shared class composition |
| `src/components/ui/button.tsx` | `Button`, `buttonVariants` | shadcn primitive |
| `src/components/ui/badge.tsx` | `Badge`, `badgeVariants` | shadcn primitive |
| `src/app/globals.css` | theme tokens/utilities | semantic light/dark system |
| `src/app/layout.tsx` | `RootLayout`, `viewport` | provider, hydration, color scheme |
| `src/app/page.tsx` | `Home` | page footer placement |
| `src/app/not-found.tsx` | `NotFound` | semantic tokens + rounded CTAs |
| `src/components/theme-provider.tsx` | `ThemeProvider` (new) | next-themes boundary |
| `src/components/theme-toggle.tsx` | `ThemeToggle` (new) | accessible theme control |
| `src/components/site-footer.tsx` | `SiteFooter` (new) | rounded vibrant footer, canonical socials |
| `src/components/site-sidebar.tsx` | `SiteSidebar` | remove socials, add toggle, semantic tokens |
| `src/components/site-header.tsx` | `SiteHeader` | add toggle, semantic tokens |
| `src/components/contact.tsx` | `Contact` | rounded blue panel, remove duplicate links, how-it-starts |
| `src/components/work-grid.tsx` | `WorkGrid`, `goToPage` | Button/Badge/cn, semantic tokens, preserve behavior |
| `src/components/copy-email.tsx` | `CopyEmail` | shadcn Button, on-brand styling |
| `src/components/hero.tsx` | `Hero` | semantic tokens, rounded CTAs |
| `src/components/about.tsx` | `About` | semantic tokens, rounded portrait |
| `src/components/services.tsx` | `Services` | semantic tokens, cn |
| `src/components/section-heading.tsx` | `SectionHeading` | semantic tokens |
| `src/components/testimonial-section.tsx` | `TestimonialSection` | semantic tokens |
| `src/components/icons.tsx` | `Sun`, `Moon`, `ArrowUp` | theme/footer icons |
| `playwright.config.ts` | config (new) | browser test harness |
| `e2e/portfolio.spec.ts` | tests (new) | theme, pagination, dedupe, axe, overflow |
| `.github/workflows/ci.yml` | `Verify` | install browser + run e2e |
| `README.md` | docs | theme, shadcn, tests, workflow |

## 11. Reusable Implementation Context

```yaml
implementation_context:
  task_summary: "Redesign the footer as a vibrant rounded card, make it the canonical home for GitHub/LinkedIn links, adopt shadcn Button/Badge, add a persistent light/dark theme, and protect the work with Playwright + axe tests behind the existing PR/CI pipeline."
  acceptance_criteria:
    - "Footer rounded, high-contrast, vibrant, and free of repeated nav/social links."
    - "GitHub and LinkedIn appear exactly once; email appears once as the contact CTA."
    - "Theme toggle persists, follows system preference initially, and is hydration-safe."
    - "Light and dark modes pass axe WCAG A/AA at desktop and mobile."
    - "lint, typecheck, build, and e2e pass locally and in CI."
    - "main stays protected; no deployment."

  evidence_provenance:
    {
      "schema_version": 2,
      "head_commit": "9791189e1378331767aedd6cdfe0102be31aec0f",
      "generated_plan_path": "docs/plans/2026-10-27-gitnexus-plan-footer-theme-refresh.md",
      "global_dirty_digest": {
        "algorithm": "sha256",
        "canonicalization": "gitnexus-evidence-provenance-v2 NUL-framed UTF-8 records",
        "value": "0a9c85780067d9afcd0764f307b60891e3cee927ee11eaeb5ec7826d10fd82cd"
      },
      "cited_path_manifest": [
        {
          "path": ".github/workflows/ci.yml",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:d5df9c5dec9d90e28c111c2edccfd9017221365a4bbb12ca217cc2bdef0a6e2a",
          "index_digest": "sha256:d5df9c5dec9d90e28c111c2edccfd9017221365a4bbb12ca217cc2bdef0a6e2a",
          "worktree_digest": "sha256:d5df9c5dec9d90e28c111c2edccfd9017221365a4bbb12ca217cc2bdef0a6e2a",
          "untracked_digest": "absent"
        },
        {
          "path": "README.md",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:d66c3dfdaecd2dbfda41cb807cf3979e8c71ed39a79e26708e0cbeeb5b9ef8f6",
          "index_digest": "sha256:d66c3dfdaecd2dbfda41cb807cf3979e8c71ed39a79e26708e0cbeeb5b9ef8f6",
          "worktree_digest": "sha256:d66c3dfdaecd2dbfda41cb807cf3979e8c71ed39a79e26708e0cbeeb5b9ef8f6",
          "untracked_digest": "absent"
        },
        {
          "path": "package.json",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:3d20408ec07962dc73b100c915c8f67cf4e795e561316671cc99340018179ac8",
          "index_digest": "sha256:3d20408ec07962dc73b100c915c8f67cf4e795e561316671cc99340018179ac8",
          "worktree_digest": "sha256:3d20408ec07962dc73b100c915c8f67cf4e795e561316671cc99340018179ac8",
          "untracked_digest": "absent"
        },
        {
          "path": "src/app/globals.css",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:d474e6d519e524bf0acc535d0ad8f9683ca5d9ed773a79903659ebaf9286eb7a",
          "index_digest": "sha256:d474e6d519e524bf0acc535d0ad8f9683ca5d9ed773a79903659ebaf9286eb7a",
          "worktree_digest": "sha256:d474e6d519e524bf0acc535d0ad8f9683ca5d9ed773a79903659ebaf9286eb7a",
          "untracked_digest": "absent"
        },
        {
          "path": "src/app/layout.tsx",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:d939d8b251e939d48e8f3edbeb4f2b1feff3c2313f6281d2022f4a5fcec08564",
          "index_digest": "sha256:d939d8b251e939d48e8f3edbeb4f2b1feff3c2313f6281d2022f4a5fcec08564",
          "worktree_digest": "sha256:d939d8b251e939d48e8f3edbeb4f2b1feff3c2313f6281d2022f4a5fcec08564",
          "untracked_digest": "absent"
        },
        {
          "path": "src/app/not-found.tsx",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:7ed8055f585779b2f7892e98a897e1b20d4f8f346a728ff7bb6af7d0970b5b1e",
          "index_digest": "sha256:7ed8055f585779b2f7892e98a897e1b20d4f8f346a728ff7bb6af7d0970b5b1e",
          "worktree_digest": "sha256:7ed8055f585779b2f7892e98a897e1b20d4f8f346a728ff7bb6af7d0970b5b1e",
          "untracked_digest": "absent"
        },
        {
          "path": "src/app/page.tsx",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:448e8f1c7db97965227f86640ee4c0b4f69a77d48d20e5c2297cc30f583450f8",
          "index_digest": "sha256:448e8f1c7db97965227f86640ee4c0b4f69a77d48d20e5c2297cc30f583450f8",
          "worktree_digest": "sha256:448e8f1c7db97965227f86640ee4c0b4f69a77d48d20e5c2297cc30f583450f8",
          "untracked_digest": "absent"
        },
        {
          "path": "src/components/about.tsx",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:979aeed265e7558f74c0e1465581f939b52a572a6e78ee98e35ba930ce18be9d",
          "index_digest": "sha256:979aeed265e7558f74c0e1465581f939b52a572a6e78ee98e35ba930ce18be9d",
          "worktree_digest": "sha256:979aeed265e7558f74c0e1465581f939b52a572a6e78ee98e35ba930ce18be9d",
          "untracked_digest": "absent"
        },
        {
          "path": "src/components/clock.tsx",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:c05827069ed10c90d1d8b0b3ee80f48891c3ff2794bbf8634460fc825c451064",
          "index_digest": "sha256:c05827069ed10c90d1d8b0b3ee80f48891c3ff2794bbf8634460fc825c451064",
          "worktree_digest": "sha256:c05827069ed10c90d1d8b0b3ee80f48891c3ff2794bbf8634460fc825c451064",
          "untracked_digest": "absent"
        },
        {
          "path": "src/components/contact.tsx",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:7748262cb5e44661514485903c5389223d4b2aeec26f97c948c1b59225b51530",
          "index_digest": "sha256:7748262cb5e44661514485903c5389223d4b2aeec26f97c948c1b59225b51530",
          "worktree_digest": "sha256:7748262cb5e44661514485903c5389223d4b2aeec26f97c948c1b59225b51530",
          "untracked_digest": "absent"
        },
        {
          "path": "src/components/copy-email.tsx",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:feb38c326f5e7f492d218ac84952c05f9f3b8b3f78677aa2ab35cee559cfca1e",
          "index_digest": "sha256:feb38c326f5e7f492d218ac84952c05f9f3b8b3f78677aa2ab35cee559cfca1e",
          "worktree_digest": "sha256:feb38c326f5e7f492d218ac84952c05f9f3b8b3f78677aa2ab35cee559cfca1e",
          "untracked_digest": "absent"
        },
        {
          "path": "src/components/hero.tsx",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:3e9522210fb7ebc47b54b79d8a2118ed2e629ec44aa1d7688a468456020bb048",
          "index_digest": "sha256:3e9522210fb7ebc47b54b79d8a2118ed2e629ec44aa1d7688a468456020bb048",
          "worktree_digest": "sha256:3e9522210fb7ebc47b54b79d8a2118ed2e629ec44aa1d7688a468456020bb048",
          "untracked_digest": "absent"
        },
        {
          "path": "src/components/icons.tsx",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:2d573f0bba02eec270c9e9017489a969ecd28d8b3141fa6b3d72509c4cd9d811",
          "index_digest": "sha256:2d573f0bba02eec270c9e9017489a969ecd28d8b3141fa6b3d72509c4cd9d811",
          "worktree_digest": "sha256:2d573f0bba02eec270c9e9017489a969ecd28d8b3141fa6b3d72509c4cd9d811",
          "untracked_digest": "absent"
        },
        {
          "path": "src/components/section-heading.tsx",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:d776ebfad8cdeb6d4f7f957a3eb6a4d1cdfee04f9a40b76d339600930f318ea2",
          "index_digest": "sha256:d776ebfad8cdeb6d4f7f957a3eb6a4d1cdfee04f9a40b76d339600930f318ea2",
          "worktree_digest": "sha256:d776ebfad8cdeb6d4f7f957a3eb6a4d1cdfee04f9a40b76d339600930f318ea2",
          "untracked_digest": "absent"
        },
        {
          "path": "src/components/services.tsx",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:4167223177bdedb0426ef949001ce3a360928a0edc3eeb15325313e80e3b3c7f",
          "index_digest": "sha256:4167223177bdedb0426ef949001ce3a360928a0edc3eeb15325313e80e3b3c7f",
          "worktree_digest": "sha256:4167223177bdedb0426ef949001ce3a360928a0edc3eeb15325313e80e3b3c7f",
          "untracked_digest": "absent"
        },
        {
          "path": "src/components/site-header.tsx",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:ee3cfed6ece0c66905357050894ac2529d718d01f286385945ba1839c3732495",
          "index_digest": "sha256:ee3cfed6ece0c66905357050894ac2529d718d01f286385945ba1839c3732495",
          "worktree_digest": "sha256:ee3cfed6ece0c66905357050894ac2529d718d01f286385945ba1839c3732495",
          "untracked_digest": "absent"
        },
        {
          "path": "src/components/site-sidebar.tsx",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:0538106c335e2dd1725b3e6c09355bad6d15e6a542767c760de57b83700a5955",
          "index_digest": "sha256:0538106c335e2dd1725b3e6c09355bad6d15e6a542767c760de57b83700a5955",
          "worktree_digest": "sha256:0538106c335e2dd1725b3e6c09355bad6d15e6a542767c760de57b83700a5955",
          "untracked_digest": "absent"
        },
        {
          "path": "src/components/testimonial-section.tsx",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:1fbf5907a45a47c366bc77a2c3356e68b6719a40b4e9015ace5f1e3367b71024",
          "index_digest": "sha256:1fbf5907a45a47c366bc77a2c3356e68b6719a40b4e9015ace5f1e3367b71024",
          "worktree_digest": "sha256:1fbf5907a45a47c366bc77a2c3356e68b6719a40b4e9015ace5f1e3367b71024",
          "untracked_digest": "absent"
        },
        {
          "path": "src/components/work-grid.tsx",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:09cee51078688cc7447aff86dc86cce35e13c42640a314aa558eaaeb508771fd",
          "index_digest": "sha256:09cee51078688cc7447aff86dc86cce35e13c42640a314aa558eaaeb508771fd",
          "worktree_digest": "sha256:09cee51078688cc7447aff86dc86cce35e13c42640a314aa558eaaeb508771fd",
          "untracked_digest": "absent"
        },
        {
          "path": "src/components/work.tsx",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:068d442ecc7d1e14f455dca90de88f9a6b3a1b66a58d4c7ffb1c829b12b71f37",
          "index_digest": "sha256:068d442ecc7d1e14f455dca90de88f9a6b3a1b66a58d4c7ffb1c829b12b71f37",
          "worktree_digest": "sha256:068d442ecc7d1e14f455dca90de88f9a6b3a1b66a58d4c7ffb1c829b12b71f37",
          "untracked_digest": "absent"
        },
        {
          "path": "src/content/projects.ts",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:0b28e13cb1ad5752da66b14f9c3ed482f4d410e99e0c3a71f0a73cff3fe259bc",
          "index_digest": "sha256:0b28e13cb1ad5752da66b14f9c3ed482f4d410e99e0c3a71f0a73cff3fe259bc",
          "worktree_digest": "sha256:0b28e13cb1ad5752da66b14f9c3ed482f4d410e99e0c3a71f0a73cff3fe259bc",
          "untracked_digest": "absent"
        },
        {
          "path": "src/content/site.ts",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:9a0a87db04fa087ae116d9c6aa2dd57ee9ce542842d3fead2a116a1b988ae120",
          "index_digest": "sha256:9a0a87db04fa087ae116d9c6aa2dd57ee9ce542842d3fead2a116a1b988ae120",
          "worktree_digest": "sha256:9a0a87db04fa087ae116d9c6aa2dd57ee9ce542842d3fead2a116a1b988ae120",
          "untracked_digest": "absent"
        },
        {
          "path": "tsconfig.json",
          "object_kind": {
            "head": "regular",
            "index": "regular",
            "worktree": "regular",
            "untracked": "absent"
          },
          "state": "clean",
          "rename_from": null,
          "rename_to": null,
          "head_digest": "sha256:5c51df4c59f4510d8c7dadf07a5c32132228826a3b331da5e286207b4df7ef9c",
          "index_digest": "sha256:5c51df4c59f4510d8c7dadf07a5c32132228826a3b331da5e286207b4df7ef9c",
          "worktree_digest": "sha256:5c51df4c59f4510d8c7dadf07a5c32132228826a3b331da5e286207b4df7ef9c",
          "untracked_digest": "absent"
        }
      ]
    }

  primary_symbols:
    - symbol: Contact
      file: src/components/contact.tsx
      lines: "6-104"
      role: "Contact section and current inline footer; hosts the email CTA, Clock, and CopyEmail."
    - symbol: WorkGrid
      file: src/components/work-grid.tsx
      lines: "11-217"
      role: "Paginated work list; owns page state, focus/scroll effect, and pagination controls."
    - symbol: CopyEmail
      file: src/components/copy-email.tsx
      lines: "5-35"
      role: "Clipboard button with 2s feedback and timer cleanup."
    - symbol: SiteSidebar
      file: src/components/site-sidebar.tsx
      lines: "4-77"
      role: "Desktop rail; currently duplicates socials and will host the theme toggle."
    - symbol: SiteHeader
      file: src/components/site-header.tsx
      lines: "3-54"
      role: "Mobile header; will host the theme toggle."

  related_symbols:
    - symbol: Home
      file: src/app/page.tsx
      relationship: CALLS
      relevance: "Composes Contact and every section; add SiteFooter here."
    - symbol: RootLayout
      file: src/app/layout.tsx
      relationship: RENDERS
      relevance: "Theme provider, hydration flag, viewport, sidebar/header."
    - symbol: Work
      file: src/components/work.tsx
      relationship: CALLS
      relevance: "Only upstream caller of WorkGrid."
    - symbol: Clock
      file: src/components/clock.tsx
      relationship: CALLS
      relevance: "Used by Contact and SiteSidebar; must not be remounted by theming."
    - symbol: ArrowLeft, ArrowRight, ArrowUpRight
      file: src/components/icons.tsx
      relationship: CALLS
      relevance: "Pagination and external-link affordances."
    - symbol: FormatTime
      file: src/components/clock.tsx
      relationship: CALLS
      relevance: "Clock execution path; unchanged."

  execution_path:
    - "Request → RootLayout → ThemeProvider → SiteSidebar/SiteHeader → Home."
    - "Home → Contact → CopyEmail/Clock → footer CTA and local time."
    - "Home → Work → WorkGrid → goToPage → setPage → currentPage → visibleProjects + live region + focus/scroll effect."
    - "ThemeToggle → useTheme().setTheme → html.dark → semantic tokens."

  pdg_constraints:
    - description: "Pagination focus/scroll runs only when currentPage differs from the previous page."
      affected_statements:
        - "src/components/work-grid.tsx:36"
        - "src/components/work-grid.tsx:37"
        - "src/components/work-grid.tsx:41-51"
      implementation_consequence: "Keep the effect and refs intact; shadcn Buttons may only replace the control markup."
    - description: "goToPage clamps before setPage."
      affected_statements:
        - "src/components/work-grid.tsx:54-56"
      implementation_consequence: "Do not move clamping into render or remove disabled bounds."
    - description: "CopyEmail clears an existing timer before scheduling the reset and swallows clipboard denial."
      affected_statements:
        - "src/components/copy-email.tsx:17-23"
      implementation_consequence: "Preserve timer cleanup, 2s reset, and the mailto fallback; swap only the button primitive."
    - description: "Clock initialises null, ticks immediately, and clears its 30s interval on unmount."
      affected_statements:
        - "src/components/clock.tsx:17-24"
      implementation_consequence: "Do not key or remount Clock from the theme provider."

  architectural_patterns:
    - pattern: "Server component shell with small client islands"
      example_location: "src/app/layout.tsx:RootLayout; src/components/work-grid.tsx:WorkGrid"
      usage_guidance: "Keep SiteFooter a server component; only ThemeToggle and the existing islands use 'use client'."
    - pattern: "Tailwind v4 @theme tokens + utility classes"
      example_location: "src/app/globals.css:3-14"
      usage_guidance: "Add semantic tokens and @theme inline mappings; do not introduce a second CSS-in-JS system."
    - pattern: "Accessible pagination with aria-controls, aria-current, and a polite live region"
      example_location: "src/components/work-grid.tsx:60-63,143-196"
      usage_guidance: "Preserve every attribute when switching to shadcn Button."

  files_to_modify:
    - file: package.json
      symbols: [scripts, dependencies]
      intended_change: "Add next-themes, shadcn deps, Playwright/axe; add test:e2e."
    - file: components.json
      symbols: []
      intended_change: "Create shadcn Radix/Tailwind v4 config."
    - file: src/lib/utils.ts
      symbols: [cn]
      intended_change: "Create standard class merge helper."
    - file: src/components/ui/button.tsx
      symbols: [Button, buttonVariants]
      intended_change: "Add generated shadcn Button."
    - file: src/components/ui/badge.tsx
      symbols: [Badge, badgeVariants]
      intended_change: "Add generated shadcn Badge."
    - file: src/app/globals.css
      symbols: [theme tokens]
      intended_change: "Semantic light/dark palette, radius, dark variant, utilities."
    - file: src/app/layout.tsx
      symbols: [RootLayout, viewport]
      intended_change: "ThemeProvider, suppressHydrationWarning, color scheme."
    - file: src/app/page.tsx
      symbols: [Home]
      intended_change: "Render SiteFooter after Contact."
    - file: src/app/not-found.tsx
      symbols: [NotFound]
      intended_change: "Semantic tokens and rounded CTAs."
    - file: src/components/theme-provider.tsx
      symbols: [ThemeProvider]
      intended_change: "New next-themes client wrapper."
    - file: src/components/theme-toggle.tsx
      symbols: [ThemeToggle]
      intended_change: "New accessible theme button with mounted guard."
    - file: src/components/site-footer.tsx
      symbols: [SiteFooter]
      intended_change: "New rounded ink footer card; canonical GitHub/LinkedIn links."
    - file: src/components/site-sidebar.tsx
      symbols: [SiteSidebar]
      intended_change: "Remove socials, add ThemeToggle, semantic tokens."
    - file: src/components/site-header.tsx
      symbols: [SiteHeader]
      intended_change: "Add ThemeToggle, semantic tokens."
    - file: src/components/contact.tsx
      symbols: [Contact]
      intended_change: "Rounded blue panel, remove duplicate socials, add how-it-starts."
    - file: src/components/work-grid.tsx
      symbols: [WorkGrid, goToPage]
      intended_change: "shadcn Button/Badge/cn, semantic tokens; behavior unchanged."
    - file: src/components/copy-email.tsx
      symbols: [CopyEmail]
      intended_change: "shadcn Button, on-brand styling; behavior unchanged."
    - file: src/components/hero.tsx
      symbols: [Hero]
      intended_change: "Semantic tokens, rounded CTAs."
    - file: src/components/about.tsx
      symbols: [About]
      intended_change: "Semantic tokens, rounded portrait."
    - file: src/components/services.tsx
      symbols: [Services]
      intended_change: "Semantic tokens, cn."
    - file: src/components/section-heading.tsx
      symbols: [SectionHeading]
      intended_change: "Semantic tokens."
    - file: src/components/testimonial-section.tsx
      symbols: [TestimonialSection]
      intended_change: "Semantic tokens."
    - file: src/components/icons.tsx
      symbols: [Sun, Moon, ArrowUp]
      intended_change: "Add theme/footer icons in the existing style."
    - file: playwright.config.ts
      symbols: []
      intended_change: "New Playwright config."
    - file: e2e/portfolio.spec.ts
      symbols: []
      intended_change: "New browser/a11y regression suite."
    - file: .github/workflows/ci.yml
      symbols: [Verify]
      intended_change: "Install Chromium and run test:e2e."
    - file: README.md
      symbols: []
      intended_change: "Document theme, shadcn, tests, and branch protection."

  tests:
    - file: e2e/portfolio.spec.ts
      scenarios:
        - "Light start → click theme toggle → html.dark and label flips → reload → dark persists."
        - "System dark → first paint dark → toggle label correct."
        - "Page 1 → click page 2 → four page-2 projects, aria-current=page, first project focused, live region updated."
        - "Page 1 previous disabled; last page next disabled."
        - "Count GitHub/LinkedIn/email links → exactly one each; footer has no nav links."
        - "axe light/dark desktop/mobile → no serious or critical violations."
        - "320px and 390px viewports → scrollWidth <= clientWidth."

  verification_commands:
    - "pnpm lint"
    - "pnpm typecheck"
    - "pnpm build"
    - "pnpm test:e2e"

  risks:
    - "Theme flash/hydration mismatch if the toggle reads resolvedTheme before mount."
    - "Generated shadcn theme variables overwriting the brand palette; review globals.css after init."
    - "Legacy paper/ink/blue classes left in a component causing low contrast in dark mode."
    - "Removing socials from both sidebar and contact without adding them to the footer."
    - "Playwright CI time and flakiness; single browser, retries, deterministic selectors."

  assumptions:
    - what: "shadcn CLI 4.22 supports this Next 16/Tailwind 4/React 19 project with the Radix base."
      how_to_check: "Run init/add, then pnpm build and inspect generated imports."
    - what: "next-themes 0.4.x supports React 19 and class-based dark mode."
      how_to_check: "Check installed peer dependencies and run the e2e persistence test."
    - what: "The proposed dark palette meets WCAG AA for body and muted text."
      how_to_check: "Run axe in dark mode and verify contrast pairs."
    - what: "GitHub and LinkedIn are the only external socials that should be repeated; email remains the contact CTA."
      how_to_check: "Filter site.socials to http(s) in SiteFooter and assert link counts in Playwright."

  open_questions:
    - "Should the footer include a compact ‘Work / Services / About’ nav? Deferred: it would duplicate the sidebar/header and conflict with the no-repetition requirement."
    - "Should the theme toggle offer an explicit System option? Deferred: the toggle is two-state, but the initial default follows the system preference."
    - "Should we add a real Open Graph image and replace the placeholder email/testimonial? Deferred; unrelated to this UI change."

  avoid:
    - "Do not repeat full repository discovery; this pack is the starting context."
    - "Do not replace the established editorial typography/spacing with generic shadcn defaults."
    - "Do not change WorkGrid state, CopyEmail timer semantics, or Clock lifecycle."
    - "Do not commit .next, .gitnexus, Playwright reports, or any secret."
    - "Do not deploy or push directly to main."
    - "Do not add a database or runtime Vercel API."
```

## 12. Assumptions and Open Questions

Assumptions:

- Public GitHub remote `reeperx/reeper-portfolio`; `main` is protected with the `Verify` check, PR requirement, linear history, and conversation resolution. No deploy.
- shadcn CLI 4.22.1 (verified installed via `pnpm dlx shadcn@latest init --help`) supports the Radix base and Tailwind v4; the generated `button`/`badge` components are sufficient.
- `next-themes` is the right provider; the toggle is two-state, while the first visit follows the OS preference.
- The dark palette values are proposals until axe contrast checks pass. If a pair fails, adjust the semantic token, not the component.
- GitHub/LinkedIn are the only links that should appear in the footer; email stays in the contact CTA. The sidebar loses its social list so mobile users still get socials from the footer.
- Playwright + axe is worth the CI time for a UI-heavy change; one Chromium project per viewport/theme is enough.
- The existing placeholders (`hello@example.com`, `https://example.com`, the fabricated testimonial, the monogram portrait, the missing OG image) remain out of scope.

Open questions / deferred:

- Add a compact footer nav? No — it would duplicate the sidebar/header and violate the no-repetition goal.
- Add a three-way theme menu with an explicit System option? Deferred; system is the default until the user chooses.
- Replace the placeholder content, add an OG image, or deploy? Deferred; requires explicit approval.
- Add unit tests for `goToPage`? The function is local to the component; browser-level pagination coverage is the higher-value test for this change.

## 13. Definition of Done

1. `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm test:e2e` pass locally.
2. CI `Verify` is green on the feature branch and the PR is merged with a linear history.
3. `main` is protected and the feature branch is deleted; local `main` matches `origin/main`.
4. The footer is a rounded, vibrant ink card; GitHub and LinkedIn each appear once; email appears once; the footer has no repeated nav links.
5. The theme toggle works with mouse, keyboard, and screen reader, persists across reloads, and causes no hydration warning or visible flash.
6. Light and dark modes pass axe A/AA at desktop and mobile; no horizontal overflow at 320px.
7. All components use semantic tokens; the only fixed-brand uses are intentional inverse surfaces (`bg-ink`, `bg-primary`, `text-paper`, `text-primary-foreground`).
8. README documents the theme, shadcn workflow, e2e commands, and branch protection.
9. GitNexus `detect_changes` reports the expected symbols and no unexpected high-risk impact.
10. No deployment has been performed.
