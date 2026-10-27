import { site } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/15 bg-paper/95 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <a
          href="#top"
          className="inline-flex items-baseline font-display text-2xl font-semibold tracking-[-0.045em]"
        >
          {site.wordmark}
          <span className="text-blue">.</span>
        </a>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-4 text-sm">
            <li>
              <a
                href="#work"
                className="text-ink/70 transition-colors hover:text-ink"
              >
                Work
              </a>
            </li>
            <li className="hidden sm:block">
              <a
                href="#services"
                className="text-ink/70 transition-colors hover:text-ink"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="text-ink/70 transition-colors hover:text-ink"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="bg-ink px-3 py-1.5 text-paper transition-colors hover:bg-blue"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
