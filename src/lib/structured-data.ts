import { publishedProjects } from "@/content/projects";
import { faqs, services, site, testimonials, tools } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";

const rootUrl = absoluteUrl("/");
const websiteId = `${rootUrl}#website`;
const personId = `${rootUrl}#person`;
const serviceId = `${rootUrl}#professional-service`;
const homePageId = `${rootUrl}#webpage`;
const logoUrl = absoluteUrl("/icon.svg");
const socialImageUrl = absoluteUrl("/opengraph-image");

const socialUrls = site.socials
  .filter((social) => social.href.startsWith("http"))
  .map((social) => social.href);

const postalAddress = {
  "@type": "PostalAddress",
  addressRegion: "Gauteng",
  addressCountry: "ZA",
} as const;

const areaServed = [
  { "@type": "AdministrativeArea", name: "Gauteng" },
  { "@type": "Country", name: "South Africa" },
] as const;

const hasPlaceholderEmail = site.email.endsWith("@example.com");

export function buildSiteGraph() {
  const reviews = testimonials.map((testimonial) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: testimonial.name,
    },
    ...(typeof testimonial.rating === "number"
      ? {
          reviewRating: {
            "@type": "Rating",
            ratingValue: testimonial.rating,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    reviewBody: testimonial.quote,
    ...(testimonial.source?.href ? { url: testimonial.source.href } : {}),
    itemReviewed: { "@id": serviceId },
  }));

  const ratedTestimonials = testimonials.filter(
    (testimonial) => typeof testimonial.rating === "number",
  );

  const averageRating =
    ratedTestimonials.length > 0
      ? Number(
          (
            ratedTestimonials.reduce(
              (total, testimonial) => total + (testimonial.rating ?? 0),
              0,
            ) / ratedTestimonials.length
          ).toFixed(1),
        )
      : null;

  const professionalService: Record<string, unknown> = {
    "@type": "ProfessionalService",
    "@id": serviceId,
    name: `${site.name} — ${site.role}`,
    alternateName: site.brandLine,
    url: rootUrl,
    slogan: site.tagline,
    description: site.description,
    brand: {
      "@type": "Brand",
      name: site.name,
      slogan: site.brandLine,
    },
    logo: logoUrl,
    image: socialImageUrl,
    telephone: site.whatsapp.e164,
    foundingDate: site.established,
    address: postalAddress,
    areaServed,
    founder: { "@id": personId },
    sameAs: socialUrls,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.whatsapp.e164,
      contactType: "sales",
      areaServed: "ZA",
      availableLanguage: ["English"],
      ...(hasPlaceholderEmail ? {} : { email: site.email }),
    },
    ...(hasPlaceholderEmail ? {} : { email: site.email }),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Web development services",
      itemListElement: services.map((service, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
          serviceType: service.title,
          provider: { "@id": serviceId },
          areaServed,
        },
      })),
    },
    ...(reviews.length > 0 ? { review: reviews } : {}),
    ...(averageRating !== null
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating,
            reviewCount: ratedTestimonials.length,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: rootUrl,
        name: site.name,
        alternateName: site.brandLine,
        description: site.description,
        inLanguage: "en-ZA",
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        alternateName: site.brandLine,
        url: rootUrl,
        image: absoluteUrl(site.portrait.image),
        jobTitle: site.role,
        description: site.description,
        telephone: site.whatsapp.e164,
        address: postalAddress,
        sameAs: socialUrls,
        knowsAbout: tools,
        knowsLanguage: ["English"],
        worksFor: { "@id": serviceId },
        ...(hasPlaceholderEmail ? {} : { email: site.email }),
      },
      professionalService,
    ],
  };
}

export function buildHomePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": homePageId,
    url: rootUrl,
    name: `${site.name} — ${site.role} in ${site.shortLocation}`,
    description: site.description,
    inLanguage: "en-ZA",
    isPartOf: { "@id": websiteId },
    about: { "@id": serviceId },
    dateModified: site.contentUpdated,
  };
}

export function buildWorkCollectionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/work")}#webpage`,
    url: absoluteUrl("/work"),
    name: `Selected work — ${site.name}`,
    description:
      "A complete index of websites and web apps built by TOGB, an independent web developer in Gauteng.",
    inLanguage: "en-ZA",
    isPartOf: { "@id": websiteId },
    about: { "@id": serviceId },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: publishedProjects.length,
      itemListElement: publishedProjects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: project.name,
          url: project.href,
          image: absoluteUrl(project.image),
          description: project.summary,
          creator: { "@id": personId },
          dateCreated: project.createdAt,
          keywords: project.tags.join(", "),
        },
      })),
    },
  };
}

export function buildFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${rootUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
