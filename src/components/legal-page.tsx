import Link from "next/link";
import type { ReactNode } from "react";

import { site } from "@/content/site";

const linkClass =
  "font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground";

type LegalLinkProps = {
  href: string;
  children: ReactNode;
  external?: boolean;
};

export function LegalLink({
  href,
  children,
  external = false,
}: LegalLinkProps) {
  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={linkClass}>
        {children}
      </a>
    );
  }

  if (external || href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={linkClass}
      >
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={linkClass}>
      {children}
    </Link>
  );
}

type LegalPageProps = {
  title: string;
  intro: string;
  children: ReactNode;
};

export function LegalPage({ title, intro, children }: LegalPageProps) {
  return (
    <article className="mx-auto w-full max-w-3xl px-6 pb-24 pt-14 lg:px-12 lg:pb-32 lg:pt-20">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Legal
      </p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
        {title}
      </h1>
      <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted-foreground">
        {intro}
      </p>
      <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        Last updated {site.legalUpdated}
      </p>

      <div className="mt-12 space-y-9">{children}</div>

      <div className="mt-14 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          Questions about this page?{" "}
          <LegalLink href="/#contact">Use the contact form</LegalLink> or email{" "}
          <LegalLink href={`mailto:${site.email}`}>{site.email}</LegalLink>.
        </p>
      </div>
    </article>
  );
}

type LegalSectionProps = {
  title: string;
  id?: string;
  children: ReactNode;
};

export function LegalSection({ title, id, children }: LegalSectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-t border-border pt-6"
    >
      <h2 className="font-display text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
        {children}
      </div>
    </section>
  );
}
