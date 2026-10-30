import Link from "next/link";

import { ArrowUpRight } from "@/components/icons";
import { Wordmark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const connectLinks = [
    ...site.socials.filter((social) => social.href.startsWith("http")),
    site.whatsapp,
  ];

  return (
    <footer
      aria-labelledby="footer-heading"
      className="px-3 pb-3 sm:px-4 sm:pb-4 lg:px-6 lg:pb-6"
    >
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-card text-card-foreground ring-1 ring-border/80">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 left-1/4 size-72 rounded-full bg-signal/10 blur-3xl dark:bg-signal/10"
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 pt-10 pb-8 lg:px-12 lg:py-12">
          <h2 id="footer-heading" className="sr-only">
            Site footer
          </h2>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.55fr)] lg:items-start">
            <div>
              <p className="flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                <span aria-hidden="true" className="h-px w-8 bg-signal" />
                Independent web developer
              </p>
              <p className="mt-5">
                <Wordmark className="text-[clamp(3.5rem,10vw,7rem)] leading-[0.8] tracking-[-0.065em]" />
              </p>
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {site.brandLine} · Est. {site.established}
              </p>
              <p className="mt-5 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
                Websites and web apps, built end to end for small teams.
              </p>
            </div>

            <div className="lg:justify-self-end lg:text-right">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Connect
              </p>
              <nav
                aria-label="Connect links"
                className="mt-4 flex flex-wrap items-center gap-2 lg:justify-end"
              >
                {connectLinks.map((social) => (
                  <Button
                    key={social.label}
                    asChild
                    variant="outline"
                    className="h-10 rounded-full border-border bg-background/70 px-4 text-card-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground dark:border-border dark:bg-background/40 dark:hover:border-primary dark:hover:bg-primary dark:hover:text-primary-foreground"
                  >
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5"
                    >
                      {social.label}
                      <ArrowUpRight className="size-3.5" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </Button>
                ))}
              </nav>

              <nav
                aria-label="Journal and reviews"
                className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm lg:justify-end"
              >
                <Link
                  href="/blog"
                  className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                >
                  Blog
                </Link>
                <Link
                  href="/reviews"
                  className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                >
                  Client reviews
                </Link>
                <a
                  href="/blog/rss.xml"
                  className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
                >
                  RSS
                </a>
              </nav>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-border/80 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {site.name}. All rights reserved.
            </p>
            <nav
              aria-label="Legal"
              className="flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              <Link
                href="/privacy"
                className="transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
              >
                Terms of Use
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
