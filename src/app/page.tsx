import type { Metadata } from "next";

import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { SiteFooter } from "@/components/site-footer";
import { TestimonialSection } from "@/components/testimonial-section";
import { Work } from "@/components/work";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export default function Home() {
  return (
    <>
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
