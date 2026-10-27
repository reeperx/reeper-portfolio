import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <a
          href="#top"
          className="inline-flex items-baseline font-display text-2xl font-semibold tracking-[-0.045em]"
        >
          {site.wordmark}
          <span className="text-link">.</span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-2 text-sm sm:gap-4">
              <li>
                <a
                  href="#work"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Work
                </a>
              </li>
              <li className="hidden sm:block">
                <a
                  href="#services"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Services
                </a>
              </li>
              <li className="hidden sm:block">
                <a
                  href="#about"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="inline-flex h-9 items-center rounded-full bg-foreground px-3.5 font-medium text-background transition-colors hover:bg-primary hover:text-primary-foreground sm:h-10 sm:px-4"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
          <ThemeToggle className="size-9 sm:size-10" />
        </div>
      </div>
    </header>
  );
}
