import type { Metadata } from "next";

import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { Services } from "@/components/services";
import { SiteFooter } from "@/components/site-footer";
import { TestimonialSection } from "@/components/testimonial-section";
import { Work } from "@/components/work";
import { absoluteUrl } from "@/lib/seo";
import { buildHomePageSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={buildHomePageSchema()} />
      <main id="main" tabIndex={-1}>
        <span id="top" />
        <Hero />
        <Work />
        <Services />
        <About />
        <TestimonialSection />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
