import { ContactForm } from "@/components/contact-form";
import { CopyEmail } from "@/components/copy-email";
import { site } from "@/content/site";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="px-3 pb-3 sm:px-4 sm:pb-4 lg:px-6 lg:pb-6"
    >
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-primary grain-bg text-primary-foreground sm:rounded-[2.5rem]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 size-[30rem] rounded-full bg-signal/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-24 size-[28rem] rounded-full bg-brass/25 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 py-10 lg:px-12 lg:py-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-x-16">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-on-brand-muted">
                Start a project
              </p>
              <h2
                id="contact-heading"
                className="mt-4 max-w-[13ch] font-display text-[clamp(2.25rem,4.2vw,3.75rem)] font-semibold leading-[0.95] tracking-[-0.045em]"
              >
                Have something that needs building?
              </h2>
              <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-on-brand-muted">
                Tell me what you’re working on, what’s not working, and roughly
                when you need it live. I’ll reply within one business day with a
                plan, a timeline, and a price.
              </p>

              <p className="mt-8 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-on-brand-muted">
                Prefer email?
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${site.email}`}
                  className="max-w-full break-words font-display text-[clamp(1.1rem,2.5vw,1.8rem)] font-medium tracking-[-0.02em] underline decoration-1 underline-offset-[6px] transition-colors hover:decoration-2"
                >
                  {site.email}
                </a>
                <CopyEmail email={site.email} />
              </div>

              <p className="mt-4 text-sm leading-relaxed text-on-brand-muted">
                Or message me on{" "}
                <a
                  href={site.whatsapp.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-primary-foreground underline decoration-1 underline-offset-4 transition-colors hover:decoration-2"
                >
                  WhatsApp · {site.whatsapp.number}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                .
              </p>

              <p className="mt-6 flex items-start gap-2 text-sm leading-relaxed text-on-brand-muted">
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-2 shrink-0 rounded-full bg-sage"
                />
                <span>
                  {site.availability}. {site.availabilityNote}
                </span>
              </p>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
