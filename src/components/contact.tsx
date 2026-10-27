import { CopyEmail } from "@/components/copy-email";
import { site } from "@/content/site";

const steps = [
  {
    title: "Send the brief",
    body: "Tell me what you are building, what is not working, and when it needs to be live.",
  },
  {
    title: "Get a concrete plan",
    body: "Within one business day you get a scope, a timeline, and a price. No discovery theatre.",
  },
  {
    title: "Build in the open",
    body: "Short, visible increments with a working preview at every step, then a clean handover.",
  },
];

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
          className="pointer-events-none absolute -bottom-40 -left-24 size-[28rem] rounded-full bg-[#6d7cff]/30 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-on-brand-muted">
                Start a project
              </p>
              <h2
                id="contact-heading"
                className="mt-4 max-w-[12ch] font-display text-[clamp(2.6rem,5.5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.045em]"
              >
                Have something that needs building?
              </h2>
              <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-on-brand-muted">
                Tell me what you’re working on, what’s not working, and roughly
                when you need it live. I’ll reply within one business day with a
                plan, a timeline, and a price.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${site.email}`}
                  className="max-w-full break-words font-display text-[clamp(1.25rem,3vw,2.25rem)] font-medium tracking-[-0.02em] underline decoration-1 underline-offset-[6px] transition-colors hover:decoration-2"
                >
                  {site.email}
                </a>
                <CopyEmail email={site.email} />
              </div>

              <p className="mt-6 flex items-start gap-2 text-sm leading-relaxed text-on-brand-muted">
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-2 shrink-0 rounded-full bg-[#8fe0b0]"
                />
                <span>
                  {site.availability}. {site.availabilityNote}
                </span>
              </p>
            </div>

            <div className="rounded-3xl border border-on-brand/20 bg-on-brand/10 p-6 backdrop-blur-sm lg:p-8">
              <h3 className="text-sm font-medium uppercase tracking-[0.16em] text-on-brand-muted">
                How it starts
              </h3>
              <ol className="mt-5 space-y-5">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="tabular mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-on-brand/25 text-xs font-medium"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-medium">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-on-brand-muted">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
