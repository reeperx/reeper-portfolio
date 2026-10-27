import { Clock } from "@/components/clock";
import { CopyEmail } from "@/components/copy-email";
import { ArrowUpRight } from "@/components/icons";
import { site } from "@/content/site";

export function Contact() {
  const year = new Date().getFullYear();

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate overflow-hidden bg-blue grain-bg text-paper"
    >
      <div className="relative mx-auto w-full max-w-6xl px-6 py-24 lg:px-12 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20">
          <div>
            <h2
              id="contact-heading"
              className="max-w-[12ch] font-display text-[clamp(2.6rem,5.5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.045em]"
            >
              Have something that needs building?
            </h2>
            <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-paper/85">
              Tell me what you’re working on, what’s not working, and roughly
              when you need it live. I’ll reply within one business day with a
              plan, a timeline, and a price.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${site.email}`}
                className="font-display text-[clamp(1.35rem,3vw,2.25rem)] font-medium tracking-[-0.02em] underline decoration-1 underline-offset-[6px] transition-colors hover:decoration-2"
              >
                {site.email}
              </a>
              <CopyEmail email={site.email} />
            </div>

            <p className="mt-6 flex items-start gap-2 text-sm leading-relaxed text-paper/85">
              <span
                aria-hidden="true"
                className="mt-1.5 size-2 shrink-0 rounded-full bg-[#8fe0b0]"
              />
              <span>
                {site.availability}. {site.availabilityNote}
              </span>
            </p>
          </div>

          <div className="border-t border-paper/25 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <h3 className="text-sm font-medium text-paper/85">Elsewhere</h3>
            <ul className="mt-3 space-y-2 text-base">
              {site.socials.map((social) => {
                const external = social.href.startsWith("http");
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 underline decoration-1 underline-offset-4 transition-colors hover:decoration-2"
                    >
                      {social.label}
                      {external ? (
                        <>
                          <span className="sr-only"> (opens in a new tab)</span>
                          <ArrowUpRight className="size-3.5" />
                        </>
                      ) : null}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="mt-12 text-sm leading-relaxed text-paper/85">
              <p>{site.location}</p>
              <p>
                <span className="tabular">
                  <Clock />
                </span>{" "}
                local time
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-20 flex flex-col gap-3 border-t border-paper/25 pt-6 text-sm text-paper/85 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}
          </p>
          <p>Built with Next.js, hosted on Vercel.</p>
          <a
            href="#top"
            className="underline decoration-1 underline-offset-4 transition-colors hover:text-paper"
          >
            Back to top
          </a>
        </footer>
      </div>
    </section>
  );
}
