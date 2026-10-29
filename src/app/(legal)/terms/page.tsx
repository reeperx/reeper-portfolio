import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { LegalLink, LegalPage, LegalSection } from "@/components/legal-page";
import { site } from "@/content/site";
import { openGraphImage, twitterImage } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

const description =
  "The terms that apply when you use TOGB’s portfolio and project inquiry form.";

const canonical = new URL("/terms", site.url).toString();

export const metadata: Metadata = {
  title: "Terms of Use",
  description,
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: canonical,
    siteName: site.name,
    title: `Terms of Use — ${site.name}`,
    description,
    images: [openGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `Terms of Use — ${site.name}`,
    description,
    images: [twitterImage],
  },
};

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Terms of Use", path: "/terms" },
        ])}
      />
      <LegalPage
        title="Terms of Use"
        intro="These terms govern your use of this portfolio website. By using the site, you agree to them. If you do not agree, please do not use the site."
      >
        <LegalSection title="About this site">
          <p>
            This is the portfolio and information site of {site.legalName}, an
            independent web studio based in {site.location}. It is not an online
            store. Nothing on the site is an offer capable of acceptance.
          </p>
        </LegalSection>

        <LegalSection title="Project inquiries">
          <p>
            Sending the inquiry form or a WhatsApp message starts a
            conversation; it does not create a contract. Any project is governed
            by a separate written proposal or agreement accepted by both sides.
            Prices, timelines, and availability shown on the site are indicative
            and may change.
          </p>
        </LegalSection>

        <LegalSection title="Intellectual property">
          <p>
            The site’s text, design, code, images, and branding are owned by{" "}
            {site.name} or used with permission. You may view the site and share
            links to it for personal, non-commercial use. You may not copy,
            republish, systematically scrape, or use the content for commercial
            purposes without written permission, except as the law allows.
          </p>
          <p>
            Client project work is subject to the separate project agreement.
          </p>
        </LegalSection>

        <LegalSection title="Acceptable use">
          <p>
            You agree not to use the site unlawfully; interfere with its
            operation or security; attempt to access non-public parts of it;
            send spam or misleading inquiries; impersonate another person; or
            use automated tools in a way that burdens the site.
          </p>
        </LegalSection>

        <LegalSection title="Third-party links">
          <p>
            The site links to services such as GitHub, WhatsApp, Vercel, and
            Resend. I do not control those sites and am not responsible for
            their content, availability, or privacy practices. Their terms apply
            when you use them.
          </p>
        </LegalSection>

        <LegalSection title="No warranties">
          <p>
            The site is provided “as is” and “as available.” I try to keep it
            accurate and online, but I do not guarantee that it will be
            error-free, uninterrupted, current, or free of harmful code. To the
            extent permitted by law, I disclaim implied warranties.
          </p>
        </LegalSection>

        <LegalSection title="Limitation of liability">
          <p>
            To the maximum extent permitted by law, I am not liable for
            indirect, incidental, special, or consequential loss, or for loss of
            profits, data, or goodwill, arising from your use of the site.
            Nothing in these terms limits liability that cannot be limited by
            law, including rights under the Consumer Protection Act, 2008.
          </p>
        </LegalSection>

        <LegalSection title="Privacy">
          <p>
            The <LegalLink href="/privacy">Privacy Policy</LegalLink> explains
            how personal information is handled. It forms part of these terms.
          </p>
        </LegalSection>

        <LegalSection title="Governing law">
          <p>
            These terms are governed by the laws of the Republic of South
            Africa. The courts of South Africa have jurisdiction, without
            affecting any mandatory consumer protection or other rights you may
            have.
          </p>
        </LegalSection>

        <LegalSection title="Changes">
          <p>
            I may update these terms when the site or the law changes. The date
            at the top will show the latest version. Continuing to use the site
            after a change means you accept the updated terms.
          </p>
        </LegalSection>
      </LegalPage>
    </>
  );
}
