import { publishedInsights } from "@/lib/insights";
import { site } from "@/site.config";

/**
 * /llms.txt — the short brief for language models and agents, in the
 * llmstxt.org shape: a name, a one-paragraph summary, the facts most often
 * asked for, then links to the pages that hold the detail.
 *
 * The long version, with every service item, the FAQ and the full text of
 * each guide, is /llms-full.txt. Both are generated from site.config, so
 * neither can drift from what the pages say.
 */

// rebuilt hourly so a newly published guide is listed on its date
export const revalidate = 3600;

export function GET() {
  const url = (path: string) => new URL(path, site.url).toString();
  const { name, legal, founder } = site;
  const phone: string = site.phone;

  const solutions = site.services
    .map((s) => `- [${s.title}](${url(`/solutions/${s.slug}`)}): ${s.tagline}`)
    .join("\n");

  const guides = publishedInsights()
    .map((p) => `- [${p.title}](${url(`/insights/${p.slug}`)}): ${p.summary}`)
    .join("\n");

  const body = `# ${name}

> ${name} is a marketing agency in ${legal.city}, ${legal.state}, India
> (${site.domain}), founded in ${site.founded} by ${founder.name}. It gets
> customers for businesses and builds the reason they come back: strategy,
> creative, websites, social media, performance marketing and retention, in
> English and Tamil.

"Click Again" is also an everyday phrase, and other businesses, pages and
songs have used the name. This file is about the marketing agency in
${legal.city} at ${site.url}, which isn't connected to anything else that
uses the name.

- Founder: ${founder.name}, ${founder.role}
- Based in: ${legal.address}
- Email: ${site.email}${phone ? `\n- Phone: ${phone}` : ""}
- Hours: ${site.hours.label}
- Serves: owner-run small and mid-sized businesses in ${legal.city} and across ${legal.state}
- Brand line: "One click is a sale. Click again is a business."

## Pages

- [Home](${url("/")}): what ${name} does and how a job runs
- [About](${url("/about")}): why the company exists, its beliefs, and a note from the founder
- [Solutions](${url("/solutions")}): the six areas of work
- [Contact](${url("/contact")}): enquiry form, phone, address and common questions

## Solutions

${solutions}

## Guides

${guides || "- No guides published yet."}

## Optional

- [Full version of this file](${url("/llms-full.txt")}): every service item, the FAQ and the full text of each guide
- [Privacy Policy](${url("/privacy")})
- [Terms & Conditions](${url("/terms")})
- [Sitemap](${url("/sitemap.xml")})
${site.socials.map((s) => `- [${s.label}](${s.href})`).join("\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
