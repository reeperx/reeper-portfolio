import Link from "next/link";

import { Wordmark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <Link
          href="/#top"
          aria-label="TOGB — home"
          className="inline-flex items-baseline"
        >
          <Wordmark className="text-2xl" />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-2 text-sm sm:gap-4">
              <li>
                <Link
                  href="/#work"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Work
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
              <li className="hidden sm:block">
                <Link
                  href="/#services"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Services
                </Link>
              </li>
              <li className="hidden sm:block">
                <Link
                  href="/#about"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="inline-flex h-9 items-center rounded-full bg-foreground px-3.5 font-medium text-background transition-colors hover:bg-primary hover:text-primary-foreground sm:h-10 sm:px-4"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
          <ThemeToggle className="size-9 sm:size-10" />
        </div>
      </div>
    </header>
  );
}
