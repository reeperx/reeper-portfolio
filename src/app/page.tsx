import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { TestimonialSection } from "@/components/testimonial-section";
import { Work } from "@/components/work";

export default function Home() {
  return (
    <>
      <span id="top" />
      <Hero />
      <Work />
      <Services />
      <About />
      <TestimonialSection />
      <Contact />
    </>
  );
}
