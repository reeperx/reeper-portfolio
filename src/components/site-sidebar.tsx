import { Clock } from "@/components/clock";
import { site } from "@/content/site";

export function SiteSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[17rem] flex-col border-r border-ink/15 bg-paper px-7 py-8 lg:flex">
      <a
        href="#top"
        className="inline-flex w-fit items-baseline font-display text-3xl font-semibold tracking-[-0.045em]"
      >
        {site.wordmark}
        <span className="text-blue">.</span>
      </a>
      <p className="mt-2 text-sm text-ink/65">{site.role}</p>

      <nav aria-label="Primary" className="mt-14">
        <ul className="space-y-2.5">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="group inline-flex items-center gap-2 text-[0.95rem] text-ink/75 transition-colors hover:text-ink"
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className="h-px w-0 bg-blue transition-all duration-300 group-hover:w-4"
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto space-y-7">
        <p className="flex items-start gap-2.5 text-sm leading-snug text-ink/70">
          <span
            aria-hidden="true"
            className="mt-1.5 size-2 shrink-0 rounded-full bg-[#2f8a5b]"
          />
          {site.availability}
        </p>

        <div className="text-sm leading-relaxed text-ink/65">
          <p>{site.shortLocation}</p>
          <p>
            <span className="tabular">
              <Clock />
            </span>{" "}
            local time
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {site.socials.map((social) => {
            const external = social.href.startsWith("http");
            return (
              <li key={social.label}>
                <a
                  href={social.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="text-ink/65 underline decoration-1 underline-offset-4 transition-colors hover:text-blue"
                >
                  {social.label}
                  {external ? (
                    <span className="sr-only"> (opens in a new tab)</span>
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
