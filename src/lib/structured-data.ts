import { publishedProjects } from "@/content/projects";
import { services, site, testimonials, tools } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";

const rootUrl = absoluteUrl("/");
const websiteId = `${rootUrl}#website`;
const personId = `${rootUrl}#person`;
const serviceId = `${rootUrl}#professional-service`;
const homePageId = `${rootUrl}#webpage`;

const socialUrls = site.socials
  .filter((social) => social.href.startsWith("http"))
  .map((social) => social.href);

const postalAddress = {
  "@type": "PostalAddress",
  addressLocality: site.shortLocation,
  addressRegion: "Gauteng",
  addressCountry: "ZA",
} as const;

const areaServed = [
  { "@type": "City", name: site.shortLocation },
  { "@type": "AdministrativeArea", name: "Gauteng" },
  { "@type": "Country", name: "South Africa" },
] as const;

const hasPlaceholderEmail = site.email.endsWith("@example.com");

export function buildSiteGraph() {
  const genuineTestimonials = testimonials.filter(
    (testimonial) => !testimonial.placeholder,
  );

  const reviews = genuineTestimonials.map((testimonial) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: testimonial.name,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: testimonial.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: testimonial.quote,
    itemReviewed: { "@id": serviceId },
  }));

  const averageRating =
    genuineTestimonials.length > 0
      ? Number(
          (
            genuineTestimonials.reduce(
              (total, testimonial) => total + testimonial.rating,
              0,
            ) / genuineTestimonials.length
          ).toFixed(1),
        )
      : null;

  const professionalService: Record<string, unknown> = {
    "@type": "ProfessionalService",
    "@id": serviceId,
    name: `${site.name} — ${site.role}`,
    alternateName: site.wordmark,
    url: rootUrl,
    slogan: site.tagline,
    description: site.description,
    address: postalAddress,
    areaServed,
    founder: { "@id": personId },
    sameAs: socialUrls,
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
    ...(reviews.length > 0
      ? {
          review: reviews,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating,
            reviewCount: reviews.length,
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
        description: site.description,
        inLanguage: "en-ZA",
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        url: rootUrl,
        jobTitle: site.role,
        description: site.description,
        address: postalAddress,
        sameAs: socialUrls,
        knowsAbout: tools,
        worksFor: { "@id": serviceId },
        ...(hasPlaceholderEmail ? {} : { email: site.email }),
      },
      professionalService,
      {
        "@type": "WebPage",
        "@id": homePageId,
        url: rootUrl,
        name: `${site.name} — ${site.role} in ${site.shortLocation}`,
        description: site.description,
        inLanguage: "en-ZA",
        isPartOf: { "@id": websiteId },
        about: { "@id": serviceId },
        dateModified: site.contentUpdated,
      },
    ],
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
      "A complete index of websites and web apps built by Reeper, an independent web developer in Johannesburg.",
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
