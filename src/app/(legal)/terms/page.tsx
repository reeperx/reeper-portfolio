import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { LegalLink, LegalPage, LegalSection } from "@/components/legal-page";
import { site } from "@/content/site";
import { openGraphImage, twitterImage } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

const description =
  "The terms that apply when you use TOGB’s portfolio, blog comments, client reviews, and project inquiry form.";

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
        intro="These terms govern your use of this portfolio website, including the blog, comments, and client reviews. By using the site, you agree to them. If you do not agree, please do not use the site."
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

        <LegalSection id="comments-and-reviews" title="Comments and reviews">
          <p>
            The blog allows readers to leave comments and replies. Client
            reviews are published separately on the reviews page. Both are
            moderated, and neither is a private support channel. Do not include
            confidential information, passwords, identity numbers, payment
            details, or anything you would not want a stranger to read. Your
            email address is collected for moderation and verification but is
            never shown publicly.
          </p>
          <p>
            <strong className="text-foreground">Comments.</strong> You may
            comment using your name and email address; no account is required.
            By submitting a comment, you confirm that it is your own words, that
            it is accurate to the best of your knowledge, and that you have the
            right to post it. You may not post content that is unlawful,
            defamatory, harassing, hateful, threatening, spam, advertising,
            impersonating, invasive of another person’s privacy, or otherwise
            unrelated to the post. Criticism of the work is allowed. I moderate
            comments before they appear and may approve, reject, edit for
            clarity or length, or remove any comment. I am not obliged to
            publish a comment, and approval does not mean I endorse it.
          </p>
          <p>
            <strong className="text-foreground">Reviews.</strong> Reviews are
            for current or past clients only. By submitting a review, you
            confirm that you have worked with TOGB, that the review describes
            your own honest experience, and that you consent to TOGB publishing
            your name, optional role and company, optional rating, and review on
            this website and in related marketing for as long as the review
            remains published. Reviews are voluntary. I do not offer payment,
            discounts, or other incentives for a review, and I do not ask
            clients to leave a particular rating. I check the email address
            against client records before publishing and may add a “Verified
            client” label when I have done so. That label means I checked the
            client relationship; it is not a guarantee that every statement in
            the review is objectively correct.
          </p>
          <p>
            I may fix a typo, trim a review for length, or remove information
            that would expose a third party, but I will not change the meaning
            of a review. If a substantive change is needed, I will ask you
            first. I may decline or remove a review that appears fake, is
            written by someone who is not a client, contains unlawful or
            abusive content, includes another person’s private information, or
            is spam. I do not remove a review merely because it is critical or
            negative. If you want a published review corrected or removed,
            contact me and I will act within a reasonable time. Withdrawing
            consent ends the permission to publish the review, but does not
            affect any use made before withdrawal or copies retained in backups
            or caches for a reasonable period.
          </p>
          <p>
            <strong className="text-foreground">Your content.</strong> You
            retain ownership of the text you submit. By submitting a comment or
            review, you grant TOGB a non-exclusive, worldwide, royalty-free
            licence to host, display, reproduce, format, and share that content
            on this website and TOGB’s related channels for as long as it is
            published. The licence ends when the content is removed, except for
            reasonable backup, cache, and archival copies. You are responsible
            for the content you submit and for any claim arising from it.
          </p>
          <p>
            <strong className="text-foreground">Likes and reporting.</strong>{" "}
            Comment likes are anonymous and use a first-party visitor cookie to
            stop the same browser counting the same like twice. Do not use
            automated tools or multiple identities to manipulate likes. If you
            believe content is unlawful, abusive, or infringes your rights,
            contact me with the page address and enough detail to identify it.
            I may remove content while I investigate. Moderation decisions are
            made in good faith, but you are welcome to ask me to reconsider.
          </p>
          <p>
            These rules sit alongside the{" "}
            <LegalLink href="/privacy">privacy policy</LegalLink>, which
            explains what is collected, why, and how long it is kept.
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
