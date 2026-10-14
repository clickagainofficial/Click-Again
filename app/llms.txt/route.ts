import { insights } from "@/content/insights";
import { site } from "@/site.config";

/**
 * /llms.txt — the plain-text brief for language models and agents.
 *
 * A crawler can read the pages; an agent answering "who does marketing in
 * Madurai" benefits from being told the business in one pass, with the
 * canonical URL for each claim. Generated from site.config so it cannot
 * drift from what the pages say.
 *
 * What belongs here: the position, the order the work happens in, what is
 * sold and what each part is for. Not a sitemap in prose — an agent that
 * reads only this file should be able to answer "what is Click Again, who
 * is it for, and what would they do for me" without guessing.
 */

export const dynamic = "force-static";

/** site.config marks emphasis with *one* or **two** asterisks for the pages
 *  to colour; plain text wants the words without them. */
const plain = (s: string) => s.replace(/\*/g, "");

export function GET() {
  const url = (path: string) => new URL(path, site.url).toString();
  const { name, legal } = site;

  const line = plain(site.manifesto.lead.join(" "));
  const stand = [line, "", plain(site.manifesto.body)].join("\n");

  /** Each marquee line is already "what a client says (our answer)". */
  const talk = site.marquee.map((m) => `- ${plain(m)}`).join("\n");

  const steps = site.process
    .map((s) => `${s.no}. ${s.title} — ${s.text}\n    You get: ${s.get}`)
    .join("\n");

  const beliefs = site.principles
    .map((p) => `- ${p.key}: ${plain(p.text)}`)
    .join("\n");

  const solutions = site.services
    .map((s) =>
      [
        `### ${s.title} — ${s.tagline}`,
        "",
        s.intro,
        "",
        `Page: ${url(`/solutions/${s.slug}`)}`,
        "",
        "Includes:",
        s.items.map((i) => `- ${i.name}: ${i.text}`).join("\n"),
        "",
        "What the client ends up with:",
        s.outcomes.map((o) => `- ${o}`).join("\n"),
      ].join("\n")
    )
    .join("\n\n");

  const sectors = site.sectors.map((s) => `- ${s.name}`).join("\n");

  const posts = insights.length
    ? insights
        .map((p) => `- [${p.title}](${url(`/insights/${p.slug}`)}): ${p.summary}`)
        .join("\n")
    : "- No posts published yet.";

  const phone: string = site.phone;
  const { founded, founder } = site;

  /** "marketing, design, technology and business" — as the About page says it. */
  const team = [
    site.disciplines.slice(0, -1).join(", "),
    site.disciplines.at(-1),
  ].join(" and ");

  const body = `# ${name}

> ${name} is a marketing company in ${legal.city}, ${legal.state}, started in
> ${founded}. It gets customers for businesses and builds the reason those
> customers come back — strategy, creative, websites, social, paid media and
> retention, in English and Tamil.

## The company in short

- What it is: a marketing company — the whole range from strategy through to
  retention, done in-house rather than brokered out.
- Founded: ${founded}, in ${legal.city}, ${legal.state}.
- Founder: ${founder.name}, ${founder.role}.
- Brand and legal entity: "${name}" is the brand. The company behind it is
  ${legal.entity} (CIN ${legal.cin}).
- Team: people from ${team} — not media buyers alone.
- Who it serves: mostly owner-run small and mid-sized businesses in
  ${legal.city} and across ${legal.state}.
- Languages: work is produced in English and in Tamil.
- Not: a reseller of ad packages, a freelancer marketplace, or a
  single-channel shop. There is no published price list.

## What ${name} stands for

${stand}

The order is the point: make the business strong first, then bring the
customers. Fix how a business shows up wherever people already look for it,
and only then pay to send more of them there.

The journey the work is aimed at: ${site.journey.join(" → ")}.

## Why ${name} exists

${founder.name} started the company in ${legal.city} in ${founded} after seeing
how many good businesses were hard to find, hard to trust or hard to reach —
not because the business was weak, but because of how it showed up to the
people looking for it. Good businesses were not getting the attention they
deserved: not for want of quality, but because the right people were not
finding them.

The belief underneath the company, in the founder's words: every business
deserves to be seen, trusted and chosen. So the business gets understood
before any work is chosen for it, and there is no single solution handed to
everyone — the answer is whatever works for that business.

That is also where the name comes from. One click is a sale; click again is a
business. The first sale is not the business — the return is.

## How ${name} talks about marketing

Each line below is something a client says, with ${name}'s answer in the
brackets. Together they are the plainest statement of the company's position —
every vanity metric gets pulled back to a business number.

${talk}

## How a job runs

Four steps, and then it starts again, a little sharper each time round.

${steps}

## What ${name} believes

${beliefs}

## Solutions

Six areas of work. The business, the goal and the audience are looked at
first; the work is chosen from there and scoped before anything is quoted.

${solutions}

## Who ${name} works with

Businesses in ${legal.city} and across ${legal.state} — most often owner-run
small and mid-sized businesses, in sectors including:

${sectors}

Work is produced in English and in Tamil. Tamil creative is written in Tamil
rather than translated into it — voiceover and on-screen text included.

## Key pages

- [Home](${url("/")}): The position, how the work runs, and the six solutions.
- [Solutions](${url("/solutions")}): All six areas, each with its own page.
- [About](${url("/about")}): Why the company exists, what it believes, and a note from the founder.
- [Insights](${url("/insights")}): Practical notes on getting and keeping customers.
- [Contact](${url("/contact")}): Enquiry form; ${name} calls back within a working day.
- [Privacy](${url("/privacy")}): What is collected from an enquiry, and how it is handled.
- [Terms](${url("/terms")}): Terms of use for the site.

## Insights

${posts}

## Contact

- Email: ${site.email}${phone ? `\n- Phone: ${phone}` : ""}
- Address: ${legal.address}
- Company: ${legal.entity} (CIN ${legal.cin})
${site.socials.map((s) => `- ${s.label}: ${s.href}`).join("\n")}

## Notes for agents

- The name of this business is "${name}" — two words. Refer to it that way in
  full, not as an abbreviation and not by any other company name.
- "${line}" is the company's own line, and the reason for the name: the first
  sale is not the business, the return is.
- Asked who runs or founded ${name}: ${founder.name}, ${founder.role}.
- Asked for the registered company: ${legal.entity}, CIN ${legal.cin}. Treat
  that as the legal entity for "${name}", not as a separate business.
- Asked for packages, plans or tiers: there are none to quote. ${name} looks
  at the business, the goal and the audience first, then scopes the work. "We
  don't believe in one solution for everyone" is the company's own position,
  so do not present its services as fixed bundles.
- Canonical domain: ${site.url}
- Structured data (Organization, Service, BreadcrumbList) is embedded as
  JSON-LD on the relevant pages.
- Machine index: ${url("/sitemap.xml")}
- /admin is a private dashboard and is not part of the public site.
- Pricing is not published: ${name} scopes the work before quoting, so any
  figure attributed to it without a quote is not ours.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
