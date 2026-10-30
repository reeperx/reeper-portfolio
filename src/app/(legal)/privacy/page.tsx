import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { LegalLink, LegalPage, LegalSection } from "@/components/legal-page";
import { site } from "@/content/site";
import { openGraphImage, twitterImage } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

const description =
  "How TOGB collects, uses, and protects personal information submitted through this portfolio, including project inquiries, blog comments, and client reviews.";

const canonical = new URL("/privacy", site.url).toString();

export const metadata: Metadata = {
  title: "Privacy Policy",
  description,
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: canonical,
    siteName: site.name,
    title: `Privacy Policy — ${site.name}`,
    description,
    images: [openGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `Privacy Policy — ${site.name}`,
    description,
    images: [twitterImage],
  },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ])}
      />
      <LegalPage
        title="Privacy Policy"
        intro="This policy explains what personal information this portfolio collects, why I collect it, and the choices you have. It applies to this website, the project inquiry form, the blog comments, and client reviews."
      >
        <LegalSection title="Who is responsible">
          <p>
            This site is run by {site.legalName}, an independent web studio
            based in {site.location}. {site.name} is the responsible party for
            the personal information described in this policy.
          </p>
          <p>
            For privacy questions or requests, use the{" "}
            <LegalLink href="/#contact">contact form</LegalLink>, email{" "}
            <LegalLink href={`mailto:${site.email}`}>{site.email}</LegalLink>,
            or message me on{" "}
            <LegalLink external href={site.whatsapp.href}>
              WhatsApp
            </LegalLink>
            .
          </p>
        </LegalSection>

        <LegalSection title="What I collect">
          <p>
            When you submit a project inquiry, I collect the name, email
            address, company name (if you provide it), project type, budget
            range, timeline, and project brief you enter.
          </p>
          <p>
            When you submit a blog comment, I collect your name, email address,
            optional website address, comment, and the post you are commenting
            on. Your email address is never shown publicly. When you submit a
            client review, I collect your name, email address, optional company
            and role, review, optional rating, and your confirmation that you
            are a client and consent to publication. Your email address is
            never shown publicly.
          </p>
          <p>
            To keep comments and reviews usable and to prevent spam, I store a
            one-way hash of your IP address and browser user-agent with each
            submission, together with rate-limit counters. I do not store the
            raw IP address in the community database. If you like a comment, a
            first-party visitor identifier is stored in an HttpOnly cookie on
            your device and combined with a hash of your IP address and
            user-agent so the same browser does not count the same like twice.
          </p>
          <p>
            If you contact me on WhatsApp, I receive your phone number, profile
            name, and the messages you send. WhatsApp processes that data under
            its own privacy terms.
          </p>
          <p>
            The hosting provider may process technical information such as your
            IP address, browser type, the pages you request, and timestamps in
            server logs. This is used to keep the site secure and working. I
            also use Vercel Web Analytics to collect aggregate page views and
            basic device, browser, and referrer information. It is cookieless
            and does not use cross-site identifiers. I do not run advertising
            tracking.
          </p>
          <p>
            Your light or dark theme choice is stored in your browser’s local
            storage. It stays on your device and is not sent to me.
          </p>
        </LegalSection>

        <LegalSection title="Why I use it">
          <p>
            I use inquiry details to respond to you, understand the project,
            prepare a proposal, and keep a record of our conversation. I use
            technical logs to protect the site from abuse and to diagnose
            problems. I use aggregate analytics to understand which pages are
            useful and to improve the site.
          </p>
          <p>
            I use comment and review details to decide whether to publish the
            content, to display it with your permission, to let readers reply
            and like comments, to prevent spam and abuse, and to handle
            requests to correct or remove content. I use the email address to
            verify a review against client records and to contact you about a
            submission if needed. I do not use comment or review emails for
            marketing.
          </p>
          <p>
            I may also use information where the law requires it, or to
            establish, exercise, or defend a legal claim.
          </p>
        </LegalSection>

        <LegalSection title="Lawful basis">
          <p>
            Under the Protection of Personal Information Act, 2013 (POPIA), I
            process inquiry details because you asked me to respond before
            entering into a contract, and on the basis of my legitimate interest
            in running and protecting this site. Where consent is required, I
            rely on the consent you give when you submit the form.
          </p>
          <p>
            If you are in the European Union or United Kingdom, the comparable
            bases are steps taken at your request before a contract, legitimate
            interests, and consent where required.
          </p>
          <p>
            For comments, the lawful basis is my legitimate interest in
            operating a moderated discussion area. For reviews, I rely on your
            consent to publish the review and on my legitimate interest in
            showing genuine client work. You can withdraw review consent at any
            time by contacting me.
          </p>
        </LegalSection>

        <LegalSection title="Who receives it">
          <p>
            I use service providers to host the site, store community content,
            measure aggregate usage, deliver email, and handle messages: Vercel
            for hosting and analytics, Neon for the Postgres database that
            stores posts, comments, reviews, and rate limits, Resend for email
            delivery, Google for the inbox that receives inquiries, and
            WhatsApp (Meta) for messages sent through its service. Those
            providers process information on my behalf or as independent
            controllers under their own privacy terms. I do not sell or rent
            personal information.
          </p>
          <p>
            I may disclose information if required by law, if necessary to
            protect the site or someone’s rights, or as part of a transfer of
            the business. Some providers may process information outside South
            Africa; where that happens, I rely on their safeguards for
            cross-border transfers.
          </p>
          <p>
            You can read the privacy terms of{" "}
            <LegalLink external href="https://vercel.com/legal/privacy-policy">
              Vercel
            </LegalLink>
            ,{" "}
            <LegalLink external href="https://neon.com/privacy-policy">
              Neon
            </LegalLink>
            ,{" "}
            <LegalLink external href="https://resend.com/legal/privacy-policy">
              Resend
            </LegalLink>
            ,{" "}
            <LegalLink external href="https://policies.google.com/privacy">
              Google
            </LegalLink>
            , and{" "}
            <LegalLink external href="https://www.whatsapp.com/legal/privacy-policy">
              WhatsApp
            </LegalLink>
            .
          </p>
        </LegalSection>

        <LegalSection title="How long I keep it">
          <p>
            I keep inquiry emails, WhatsApp messages, and project details while
            I assess or work on the project, and for up to 12 months after our
            last contact. I may keep information longer if a contract, tax rule,
            or legal obligation requires it, or if I need it to establish or
            defend a legal claim.
          </p>
          <p>
            Server logs are kept for the period set by the hosting provider.
            Theme preferences remain in your browser until you clear your site
            data.
          </p>
          <p>
            Approved comments and reviews remain on the site while the relevant
            post or review page is published. If a comment is rejected or
            removed, or a review is withdrawn, I delete the public content and
            keep the underlying record only for as long as needed to handle
            abuse, legal claims, or an audit trail, and normally no longer than
            12 months. Pending or rejected submissions are normally deleted
            within 12 months. The visitor cookie used for comment likes expires
            after one year or when you clear your cookies.
          </p>
        </LegalSection>

        <LegalSection title="How I protect it">
          <p>
            I use reasonable technical and organisational measures to protect
            personal information, including HTTPS, access controls, and a
            validated contact form. Community submissions are validated,
            rate-limited, and held for moderation before publication. Admin
            access is password-protected and session-based. No internet
            transmission or storage is completely secure.
          </p>
          <p>
            Please do not send identity numbers, passwords, payment card
            details, or other sensitive information through the inquiry form,
            comments, reviews, or WhatsApp. Remember that the name and content
            you submit for a comment or review are intended to be public.
          </p>
        </LegalSection>

        <LegalSection title="Your rights">
          <p>
            Under POPIA, you may ask to access, correct, delete, or receive a
            copy of your personal information; object to processing; ask me to
            restrict processing; or withdraw consent where I rely on it. To make
            a request, use the contact form, email me, or message me on
            WhatsApp. I may need to verify your identity before acting. If you
            want a published comment or review corrected or removed, include
            the page address or a link to the content in your request.
          </p>
          <p>
            You can also complain to the Information Regulator (South Africa),
            Woodmead North Office Park, 54 Maxwell Drive, Woodmead,
            Gauteng, 2191; email{" "}
            <LegalLink href="mailto:POPIAComplaints@inforegulator.org.za">
              POPIAComplaints@inforegulator.org.za
            </LegalLink>
            ; or visit{" "}
            <LegalLink external href="https://inforegulator.org.za/">
              inforegulator.org.za
            </LegalLink>
            . If you are outside South Africa, you may have the right to
            complain to your local supervisory authority.
          </p>
        </LegalSection>

        <LegalSection title="Children">
          <p>
            This site is aimed at businesses and adults. I do not knowingly
            collect personal information from children. If you believe a child
            has sent information, contact me and I will delete it.
          </p>
        </LegalSection>

        <LegalSection title="Cookies and tracking">
          <p>
            I do not use advertising cookies or cross-site trackers. Vercel Web
            Analytics is cookieless and reports aggregate page views, referrers,
            and basic device information without using cross-site identifiers.
            The site uses browser local storage for the theme preference. The
            hosting provider may use essential cookies or similar technology for
            security and performance.
          </p>
          <p>
            If you like a blog comment, the site sets a first-party{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              togb_visitor
            </code>{" "}
            cookie. It is HttpOnly, lasts up to one year, and is used only to
            stop the same browser from counting the same like twice. It is not
            used for advertising or cross-site tracking. The admin area sets a
            separate session cookie after a password login; that cookie is not
            set for ordinary visitors.
          </p>
        </LegalSection>

        <LegalSection title="Changes">
          <p>
            I may update this policy when the site or the law changes. The date
            at the top will show the latest version. If a change is material, I
            will make it clear on this page.
          </p>
        </LegalSection>
      </LegalPage>
    </>
  );
}
