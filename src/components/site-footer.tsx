import { ArrowUpRight } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const externalSocials = site.socials.filter((social) =>
    social.href.startsWith("http"),
  );

  return (
    <footer
      aria-labelledby="footer-heading"
      className="px-3 pb-3 sm:px-4 sm:pb-4 lg:px-6 lg:pb-6"
    >
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-secondary text-secondary-foreground ring-1 ring-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary via-signal to-primary"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/15 blur-3xl dark:bg-primary/25"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full bg-signal/15 blur-3xl dark:bg-signal/10"
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 pt-10 pb-24 lg:px-12 lg:py-12">
          <h2 id="footer-heading" className="sr-only">
            Site footer
          </h2>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-display text-[clamp(3rem,9vw,6.5rem)] font-semibold leading-[0.82] tracking-[-0.06em]">
                {site.wordmark}
                <span className="text-link">.</span>
              </p>
              <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
                Websites and web apps, built end to end for small teams.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {externalSocials.map((social) => (
                <Button
                  key={social.label}
                  asChild
                  variant="outline"
                  className="h-10 rounded-full border-border bg-transparent px-4 text-secondary-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground dark:border-border dark:bg-transparent dark:hover:border-primary dark:hover:bg-primary dark:hover:text-primary-foreground"
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
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {site.name}. All rights reserved.
            </p>
            <p>Built with Next.js, shadcn/ui, and Tailwind CSS.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
