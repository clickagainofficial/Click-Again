import { site } from "@/site.config";

/**
 * JSON-LD for the public pages. Answer engines and crawlers read this rather
 * than the layout, so everything here is drawn from site.config — one set of
 * business facts, stated once, in a shape a machine can quote.
 *
 * The name they should learn is "Click Again", so it is the one that appears
 * here, written out rather than left to a pronoun wherever a model might
 * quote the line back.
 *
 * Nothing is invented: a field the config doesn't have (the phone, while it
 * is unset) is left out rather than filled with a placeholder, because a
 * wrong number in structured data is worse than a missing one.
 */

const abs = (path: string) => new URL(path, site.url).toString();

/** site.phone is typed as the literal "" while unset, so widen it. */
const phone: string = site.phone;

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: "3/508, Bharathi Street, Muneswaran Nagar, Iyer Bungalow",
  addressLocality: site.legal.city,
  addressRegion: site.legal.state,
  postalCode: "625014",
  addressCountry: "IN",
};

/**
 * The business itself. ProfessionalService is a LocalBusiness subtype, which
 * is what a marketing agency with a street address in Madurai actually is —
 * it earns the local treatment that a bare Organization does not.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": abs("/#organization"),
    // The brand is the entity as far as search and answer engines are
    // concerned. legalName is left off on purpose: naming the holding
    // company here teaches them the wrong name for us. It stays where it is
    // actually required, on /privacy and /terms.
    name: site.name,
    alternateName: "ClickAgain",
    identifier: site.legal.cin,
    url: site.url,
    email: site.email,
    ...(phone ? { telephone: phone } : {}),
    logo: abs("/logo/clickagain-logo.png"),
    image: abs("/opengraph-image"),
    description: `${site.name} is a marketing company in Madurai — strategy, creative, websites, social, ads and retention. We get you customers, and keep them coming back.`,
    address: postalAddress,
    areaServed: [
      { "@type": "City", name: site.legal.city },
      { "@type": "State", name: site.legal.state },
      { "@type": "Country", name: "India" },
    ],
    sameAs: site.socials.map((s) => s.href),
    knowsLanguage: ["en-IN", "ta-IN"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Solutions",
      itemListElement: site.services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.tagline,
          url: abs(`/solutions/${s.slug}`),
        },
      })),
    },
  };
}

/** Ties every page on the domain back to the one publisher. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": abs("/#website"),
    url: site.url,
    name: site.name,
    inLanguage: "en-IN",
    publisher: { "@id": abs("/#organization") },
  };
}

/** One solution page. The items under it become the service's catalogue. */
export function serviceSchema(slug: string) {
  const service = site.services.find((s) => s.slug === slug);
  if (!service) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": abs(`/solutions/${service.slug}#service`),
    name: service.title,
    description: service.intro,
    serviceType: service.title,
    url: abs(`/solutions/${service.slug}`),
    provider: { "@id": abs("/#organization") },
    areaServed: { "@type": "Country", name: "India" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} — what we do`,
      itemListElement: service.items.map((item) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: item.name,
          description: item.text,
        },
      })),
    },
  };
}

/** The trail shown in search results. Pass the path, not the domain. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: abs(step.path),
    })),
  };
}

/** A written post on /insights. */
export function articleSchema(post: {
  slug: string;
  title: string;
  summary: string;
  date: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": abs(`/insights/${post.slug}#article`),
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.date,
    url: abs(`/insights/${post.slug}`),
    inLanguage: "en-IN",
    author: { "@id": abs("/#organization") },
    publisher: { "@id": abs("/#organization") },
    mainEntityOfPage: abs(`/insights/${post.slug}`),
  };
}

/** Questions and their answers, in the shape answer engines quote directly. */
export function faqSchema(items: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
