import type { Metadata } from "next";

import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Faq } from "@/components/faq";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { Services } from "@/components/services";
import { SiteFooter } from "@/components/site-footer";
import { TestimonialSection } from "@/components/testimonial-section";
import { Work } from "@/components/work";
import { absoluteUrl } from "@/lib/seo";
import { buildFaqSchema, buildHomePageSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export const revalidate = 300;

export default function Home() {
  return (
    <>
      <JsonLd data={[buildHomePageSchema(), buildFaqSchema()]} />
      <main id="main" tabIndex={-1}>
        <span id="top" />
        <Hero />
        <Work />
        <Services />
        <About />
        <TestimonialSection />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
