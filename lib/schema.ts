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
    // concerned. legalName and the CIN are left off on purpose: naming the
    // holding company here teaches them the wrong name for us, and an
    // identifier they can quote is the same disclosure by another route.
    // Both stay where they are actually required, on /privacy and /terms.
    name: site.name,
    // The ways people actually type the brand into a search box, so each
    // one resolves to this entity rather than to the everyday phrase.
    alternateName: [
      "ClickAgain",
      "Click Again Agency",
      "Click Again Marketing Agency",
    ],
    url: site.url,
    // "Click Again" is also an everyday phrase, a song title and other
    // pages' names, so say which Click Again this is. Every fact in it is
    // stated on the site itself (About, footer).
    disambiguatingDescription: `The ${site.name} marketing agency based in ${site.legal.city}, ${site.legal.state}, India, at ${site.domain} — founded in ${site.founded} by ${site.founder.name}.`,
    slogan: "One click is a sale. Click again is a business.",
    foundingDate: site.founded,
    foundingLocation: {
      "@type": "Place",
      name: `${site.legal.city}, ${site.legal.state}, India`,
    },
    founder: {
      "@type": "Person",
      "@id": abs("/about#founder"),
      name: site.founder.name,
      jobTitle: site.founder.role,
      worksFor: { "@id": abs("/#organization") },
    },
    // What the agency works on, taken from the services and their items,
    // so answer engines can tie topics to us without guessing.
    knowsAbout: [
      ...site.services.map((s) => s.title),
      ...site.services.flatMap((s) => s.items.map((i) => i.name)),
    ],
    email: site.email,
    ...(phone ? { telephone: phone } : {}),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: site.hours.days,
      opens: site.hours.opens,
      closes: site.hours.closes,
    },
    // square, because Google draws the logo in a square or round slot
    // (Knowledge Panel, beside results) and shrinks a wide wordmark to nothing
    logo: abs("/logo/clickagain-mark-512.png"),
    image: abs("/opengraph-image"),
    description: `${site.name} is a marketing agency in Madurai — strategy, creative, websites, social, ads and retention. We get you customers, and keep them coming back.`,
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
    // Google takes the site name shown above each result from here.
    name: site.name,
    alternateName: ["ClickAgain", site.domain],
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
/**
 * One post. The founder is the author, a named person with a role rather
 * than the company, because that is what experience signals (E-E-A-T)
 * look for; the company is the publisher.
 */
export function articleSchema(post: {
  slug: string;
  title: string;
  summary: string;
  date: string;
  updated?: string;
  tag: string;
  words: number;
}) {
  const url = abs(`/insights/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    url,
    image: `${url}/og`,
    inLanguage: "en-IN",
    articleSection: post.tag,
    wordCount: post.words,
    author: {
      "@type": "Person",
      "@id": abs("/about#founder"),
      name: site.founder.name,
      jobTitle: site.founder.role,
      url: abs("/about"),
      worksFor: { "@id": abs("/#organization") },
    },
    publisher: { "@id": abs("/#organization") },
    isPartOf: { "@id": abs("/#website") },
    mainEntityOfPage: url,
  };
}

/**
 * Marks /about and /contact as what they are, and points both at the one
 * organization, so an answer engine asked "who is Click Again" or "how do I
 * reach Click Again" knows which page answers it.
 */
export function aboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": abs("/about#page"),
    url: abs("/about"),
    name: `About ${site.name}`,
    isPartOf: { "@id": abs("/#website") },
    about: { "@id": abs("/#organization") },
    mainEntity: { "@id": abs("/#organization") },
  };
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": abs("/contact#page"),
    url: abs("/contact"),
    name: `Contact ${site.name}`,
    isPartOf: { "@id": abs("/#website") },
    about: { "@id": abs("/#organization") },
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
