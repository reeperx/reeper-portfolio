import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { LegalLink, LegalPage, LegalSection } from "@/components/legal-page";
import { site } from "@/content/site";
import { openGraphImage, twitterImage } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

const description =
  "How Reeper collects, uses, and protects personal information submitted through this portfolio.";

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
        intro="This policy explains what personal information this portfolio collects, why I collect it, and the choices you have. It applies to this website and the project inquiry form."
      >
        <LegalSection title="Who is responsible">
          <p>
            This site is run by {site.name}, an independent web developer based
            in {site.location}. {site.name} is the responsible party for the
            personal information described in this policy.
          </p>
          <p>
            For privacy questions or requests, use the{" "}
            <LegalLink href="/#contact">contact form</LegalLink> or email{" "}
            <LegalLink href={`mailto:${site.email}`}>{site.email}</LegalLink>.
          </p>
        </LegalSection>

        <LegalSection title="What I collect">
          <p>
            When you submit a project inquiry, I collect the name, email
            address, company name (if you provide it), project type, budget
            range, timeline, and project brief you enter.
          </p>
          <p>
            The hosting provider may process technical information such as your
            IP address, browser type, the pages you request, and timestamps in
            server logs. This is used to keep the site secure and working. I do
            not run advertising or analytics tracking on this site.
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
            problems.
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
        </LegalSection>

        <LegalSection title="Who receives it">
          <p>
            I use service providers to host the site and deliver email: Vercel
            for hosting, Resend for email delivery, and Google for the inbox
            that receives inquiries. Those providers process information on my
            behalf and under their own privacy terms. I do not sell or rent
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
            <LegalLink external href="https://resend.com/legal/privacy-policy">
              Resend
            </LegalLink>
            , and{" "}
            <LegalLink external href="https://policies.google.com/privacy">
              Google
            </LegalLink>
            .
          </p>
        </LegalSection>

        <LegalSection title="How long I keep it">
          <p>
            I keep inquiry emails and project details while I assess or work on
            the project, and for up to 12 months after our last contact. I may
            keep information longer if a contract, tax rule, or legal obligation
            requires it, or if I need it to establish or defend a legal claim.
          </p>
          <p>
            Server logs are kept for the period set by the hosting provider.
            Theme preferences remain in your browser until you clear your site
            data.
          </p>
        </LegalSection>

        <LegalSection title="How I protect it">
          <p>
            I use reasonable technical and organisational measures to protect
            personal information, including HTTPS, access controls, and a
            validated contact form. No internet transmission or storage is
            completely secure.
          </p>
          <p>
            Please do not send identity numbers, passwords, payment card
            details, or other sensitive information through the inquiry form.
          </p>
        </LegalSection>

        <LegalSection title="Your rights">
          <p>
            Under POPIA, you may ask to access, correct, delete, or receive a
            copy of your personal information; object to processing; ask me to
            restrict processing; or withdraw consent where I rely on it. To make
            a request, use the contact form or email me. I may need to verify
            your identity before acting.
          </p>
          <p>
            You can also complain to the Information Regulator (South Africa),
            Woodmead North Office Park, 54 Maxwell Drive, Woodmead,
            Johannesburg, 2191; email{" "}
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
            I do not use advertising cookies, analytics, or cross-site trackers.
            The site uses browser local storage for the theme preference. The
            hosting provider may use essential cookies or similar technology for
            security and performance.
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
