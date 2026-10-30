import { publishedProjects } from "@/content/projects";
import { faqs, services, site, tools } from "@/content/site";
import type {
  BlogPost,
  BlogPostSummary,
  PublicReview,
} from "@/lib/community-data";
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

export function buildSiteGraph(reviews: PublicReview[] = []) {
  const reviewNodes = reviews.map((review) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.name,
    },
    ...(typeof review.rating === "number"
      ? {
          reviewRating: {
            "@type": "Rating",
            ratingValue: review.rating,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    reviewBody: review.quote,
    datePublished: review.approvedAt ?? review.createdAt,
    itemReviewed: { "@id": serviceId },
  }));

  const ratedReviews = reviews.filter(
    (review) => typeof review.rating === "number",
  );

  const averageRating =
    ratedReviews.length > 0
      ? Number(
          (
            ratedReviews.reduce(
              (total, review) => total + (review.rating ?? 0),
              0,
            ) / ratedReviews.length
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
    ...(reviewNodes.length > 0 ? { review: reviewNodes } : {}),
    ...(averageRating !== null
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating,
            reviewCount: ratedReviews.length,
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

export function buildBlogIndexSchema(posts: BlogPostSummary[]) {
  const blogUrl = absoluteUrl("/blog");

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${blogUrl}#blog`,
    url: blogUrl,
    name: `Blog — ${site.name}`,
    description:
      "Notes on building fast, considered websites and web apps for small teams.",
    inLanguage: "en-ZA",
    isPartOf: { "@id": websiteId },
    publisher: { "@id": personId },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": absoluteUrl(`/blog/${post.slug}`),
      headline: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
      description: post.excerpt,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      image: post.coverImageUrl
        ? absoluteUrl(post.coverImageUrl)
        : socialImageUrl,
      keywords: post.tags.join(", "),
      author: { "@id": personId },
      publisher: { "@id": personId },
    })),
  };
}

export function buildBlogPostSchema(post: BlogPost) {
  const postUrl = absoluteUrl(`/blog/${post.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    url: postUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    image: post.coverImageUrl
      ? [absoluteUrl(post.coverImageUrl)]
      : [socialImageUrl],
    author: { "@id": personId },
    publisher: { "@id": personId },
    isPartOf: { "@id": `${absoluteUrl("/blog")}#blog` },
    inLanguage: "en-ZA",
    keywords: post.tags.join(", "),
    articleSection: post.tags,
  };
}

export function buildReviewsPageSchema(reviews: PublicReview[]) {
  const reviewsUrl = absoluteUrl("/reviews");

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${reviewsUrl}#webpage`,
    url: reviewsUrl,
    name: `Client reviews — ${site.name}`,
    description:
      "Reviews from clients who have worked with TOGB, published only with permission.",
    inLanguage: "en-ZA",
    isPartOf: { "@id": websiteId },
    about: { "@id": serviceId },
    ...(reviews.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: reviews.length,
            itemListElement: reviews.map((review, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Review",
                author: {
                  "@type": "Person",
                  name: review.name,
                },
                reviewBody: review.quote,
                datePublished: review.approvedAt ?? review.createdAt,
                ...(typeof review.rating === "number"
                  ? {
                      reviewRating: {
                        "@type": "Rating",
                        ratingValue: review.rating,
                        bestRating: 5,
                        worstRating: 1,
                      },
                    }
                  : {}),
                itemReviewed: { "@id": serviceId },
              },
            })),
          },
        }
      : {}),
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
