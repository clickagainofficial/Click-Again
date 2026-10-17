# SEO plan

The goal: when somebody searches **"click again"** or **"click again agency"**,
clickagain.in is the first result.

This is a living file. Whenever the plan changes, or a step gets done, update
it here: tick the box, write the date, and add a line to the log at the bottom.

**Status key:** `[ ]` not started · `[~]` in progress · `[x]` done

---

## 1. Where we stand (17 Oct 2026)

**Live:** https://clickagain.in is live. `www.clickagain.in` redirects to it
with a 308.

**On Google today:** a search for `"click again" agency` does not show us. The
results are other agencies with "Click" in their name, such as Click Consult,
Clickr and Klick. Google hasn't learned the brand yet.

**What we can realistically aim for:**

| Search | How hard | Realistic timeline |
| --- | --- | --- |
| `click again agency` | Easy once indexed | 2–4 weeks after Search Console + Business Profile |
| `click again madurai` | Easy once the Business Profile is verified | 2–4 weeks |
| `clickagain` / `clickagain.in` | Easy | As soon as the site is indexed |
| `click again` (just the two words) | Hard. It's an everyday English phrase ("please click again"), so help pages and forums compete for it | 1–3 months, and not guaranteed. Needs Google to treat "Click Again" as a known entity: Knowledge Panel, Business Profile, consistent profiles, backlinks |

**Already in the site code:**

- [x] Title template, meta description, Open Graph and Twitter cards (`app/layout.tsx`)
- [x] `sitemap.xml` built from `site.config.ts` (`app/sitemap.ts`)
- [x] `robots.txt` with admin and api blocked (`app/robots.ts`)
- [x] Organization schema as `ProfessionalService` with address, services and
      socials, plus WebSite schema (`lib/schema.ts`)
- [x] FAQPage schema on /contact, Service schema on solution pages,
      BlogPosting on insights, breadcrumbs
- [x] `/llms.txt` for AI assistants
- [x] OG image (`app/opengraph-image.tsx`)
- [x] The registered company name is kept off the pages that search engines
      and AI assistants read

---

## 2. Rules we don't break

- **No made-up proof.** No invented stats, reviews, client logos or case
  studies. Reviews only come from real clients.
- **No comparing ourselves with other agencies** in any copy, including blog
  posts and directory bios.
- **The Business Profile name is exactly "Click Again".** Adding keywords like
  "Click Again – Digital Marketing Agency Madurai" breaks Google's rules and
  can get the listing suspended.
- **Name, address and phone (NAP) are the same everywhere:** site, Business
  Profile, every social profile, every directory. Copy them from one place
  (section 7).
- **The brand is "Click Again".** The legal entity name only goes where the
  law requires it (/privacy and /terms).

---

## 3. Part A: changes in the site code

These are done in this repo.

- [x] **A1. Put "agency" in the home page title and description.** (17 Oct 2026)
      Title is now `Click Again — Digital Marketing Agency in Madurai` (home,
      Open Graph, Twitter, OG image alt). Description now starts "Click
      Again is a digital marketing agency in Madurai…". "Digital marketing"
      is what we sell today; when services widen, change the descriptor
      after the dash and keep "Click Again" first and "Agency" in it.
      Files: `app/layout.tsx`, `app/opengraph-image.tsx`.
  - [x] Follow-up (17 Oct 2026): schema description and `/llms.txt` now
        say "digital marketing agency". **Decision:** the About page and
        the FAQ answer keep "marketing company" on purpose. They're written
        for people, "company" is broader for future services, and the title,
        description and schema already carry "agency".
- [ ] **A2. Brand name in visible text near the top of the home page.**
      The H1 ("WE GET YOU CUSTOMERS…") doesn't say "Click Again". Add a
      visible line near the hero, such as "Click Again is a digital
      marketing agency in Madurai", without changing the design.
- [x] **A3. Site name in search results.** (17 Oct 2026, alternateName
      "ClickAgain" and "clickagain.in") Add `alternateName` to the
      WebSite schema so Google shows "Click Again" as the site name.
      File: `lib/schema.ts`.
- [~] **A4. Stronger Organization schema.** File: `lib/schema.ts`.
  - [x] `alternateName`: "ClickAgain", "Click Again Agency",
        "Click Again Digital Marketing Agency" (17 Oct 2026)
  - [x] `founder` (Kansha M) and `foundingDate` (2026) (17 Oct 2026)
  - [ ] `telephone` (waiting on phone number, B0)
  - [ ] `openingHoursSpecification` (waiting on hours, B0)
  - [ ] `geo` co-ordinates for the office
  - [ ] Add each new profile to `sameAs` as it's created (B5, B6)
- [ ] **A5. IndexNow.** Add a key file and ping Bing and Yandex when pages
      change, so Bing, Copilot and ChatGPT search pick up changes quickly.
- [ ] **A6. NAP in the footer and on About**, matching the Business Profile
      word for word.
- [~] **A7. Logo for schema.** Checked 17 Oct 2026: `logo/clickagain-logo.png`
      exists, but it's a wide 1826×338 wordmark. Google shows the logo in a
      square or round space (Knowledge Panel, the icon beside results), so a
      wide image gets shrunk or cropped. **Needed:** a square PNG of the mark,
      at least 512×512, on a white or solid background. Then point `logo` at it.
- [ ] **A8. Validate** every page type with Google's Rich Results Test and
      the Schema.org validator after the changes go live.

---

## 4. Part B: setup outside the code

### B0. Details we need first

- [x] **Domain email** (17 Oct 2026): **`hello@clickagain.in`**, the public
      address for NAP everywhere.
  - Google Workspace Business Base: one paid user `kansha@clickagain.in`,
    with `hello@` as a free alias. This Workspace account also owns Search
    Console, the Business Profile and GA4.
  - DNS at **Hostinger** (`athena`/`apollo.dns-parking.com`). Records added:
    Google verification TXT, MX `smtp.google.com` (priority 1), SPF
    `v=spf1 include:_spf.google.com ~all`, DKIM `google._domainkey` (2048-bit),
    DMARC `_dmarc` `p=none`. Don't touch `A @ 216.198.79.1` or
    `CNAME www`; those point the site at Vercel.
  - Site updated: `site.email` and `legal.grievanceEmail` are now
    `hello@clickagain.in`, and `legal.updated` was bumped to 17 October 2026.
  - [ ] Confirm DKIM shows "Authenticating" in Admin console → Gmail →
        Authenticate email
  - [ ] Change the email on the Instagram and Facebook bios
  - [ ] Optional: the contact form's SMTP (admin → SMTP settings) still
        sends through Gmail. It can move to Workspace later.
- [ ] Business phone number for the site, schema and Business Profile
- [ ] Is the Madurai address a public office or a home? If it's a home, set
      the Business Profile up as a service-area business with the address
      hidden.
- [ ] Office hours
- [ ] Where the domain is registered (needed to add DNS records)
- [ ] Which Google account owns everything. Use one business account, not a
      personal one.

### B1. Google Search Console (week 1, do this first)

- [ ] Add a **Domain** property for `clickagain.in`
- [ ] Verify with the DNS TXT record at the domain registrar
- [ ] Submit `https://clickagain.in/sitemap.xml`
- [ ] Run URL Inspection on the home page, then **Request indexing**. Do the
      same for /about, /solutions and /contact.
- [ ] After a week, check the Pages report for anything excluded

### B2. Bing Webmaster Tools (week 1)

- [ ] Sign in and import the site from Search Console
- [ ] Confirm the sitemap is there
- [ ] Bing's index feeds Copilot and ChatGPT search, so this matters for AI
      answers too

### B3. Google Business Profile (week 1, biggest single win for brand searches)

- [ ] Name: **Click Again** (exactly)
- [ ] Primary category: **Marketing agency**. Possible extra categories:
      Internet marketing service, Advertising agency, Website designer,
      Social media agency.
- [ ] Address (or service area), phone, website `https://clickagain.in`, hours
- [ ] Description: the same wording as the site's meta description
- [ ] Logo, cover photo, office and team photos
- [ ] List the six services from `site.config.ts`
- [ ] Verify (postcard, phone or video)
- [ ] After verification: one post a week, and answer every review
- [ ] Add the Maps URL to `sameAs` (A4)

### B4. Google Analytics 4 (week 1)

- [ ] Create a GA4 property, then add the tag to the site (code step)
- [ ] Link it to Search Console

### B5. Social profiles (week 2)

Every profile uses the same name, logo, one-line bio, and links to
`https://clickagain.in`.

- [x] Instagram: instagram.com/clickagainofficial
- [x] Facebook
- [ ] LinkedIn company page
- [ ] Kansha's LinkedIn: current role at Click Again, linked to the company page
- [ ] YouTube channel
- [ ] X (Twitter)
- [ ] Update the bio and link on Instagram and Facebook to match
- [ ] Add every new profile to `site.socials` so it lands in `sameAs`

### B6. Directories and citations (week 2)

The same NAP everywhere, copied from section 7.

- [ ] Bing Places (can be imported from the Business Profile)
- [ ] Apple Business Connect
- [ ] Justdial
- [ ] Sulekha
- [ ] Clutch
- [ ] GoodFirms
- [ ] DesignRush
- [ ] Crunchbase

### B7. Backlinks and mentions (week 3 onwards, ongoing)

- [ ] Kansha's LinkedIn posts that mention and link Click Again
- [ ] Madurai business associations and chambers that list members
- [ ] Local news or business press about the launch
- [ ] Guest posts and podcasts on marketing topics
- [ ] Client websites crediting "Website by Click Again" (with permission,
      once there are clients)

### B8. Content (ongoing)

- [ ] Publish 2–4 posts a month on `/insights`
- [ ] Each post answers a real question a business owner in Tamil Nadu asks
- [ ] Each post links to the matching solution page
- [ ] Bump `site.updated` in `site.config.ts` when page copy changes

### B9. Reviews (once there are clients)

- [ ] Ask every real client for a Google review
- [ ] Reply to every review
- [ ] Never write, buy or swap reviews

---

## 5. Order of work

| Week | Work |
| --- | --- |
| 1 | B0 details → Part A code changes → B1 Search Console → B2 Bing → B3 Business Profile → B4 GA4 |
| 2 | B5 social profiles → B6 directories → update `sameAs` |
| 3+ | B7 backlinks, B8 content, B9 reviews: ongoing |
| Monthly | Check rankings (section 6) and update this file |

---

## 6. How we measure

Check these once a month, in a private/incognito window and in Search Console:

| Search | Target | Position now | Last checked |
| --- | --- | --- | --- |
| click again agency | #1 | not ranking | 17 Oct 2026 |
| click again madurai | #1 | not ranking | 17 Oct 2026 |
| clickagain | #1 | — | — |
| click again | #1 | not ranking | 17 Oct 2026 |
| digital marketing agency madurai | top 10 | — | — |

Also check whether a Knowledge Panel shows up for "Click Again", and whether
ChatGPT, Gemini and Perplexity know who Click Again is.

---

## 7. NAP: copy from here

Fill this in once, then copy it everywhere.

```
Name:     Click Again
Address:  3/508, Bharathi Street, Muneswaran Nagar, Iyer Bungalow,
          Madurai, Tamil Nadu 625014, India
Phone:    (pending)
Website:  https://clickagain.in
Email:    hello@clickagain.in
Hours:    (pending)
Category: Marketing agency
```

---

## 8. Log

Newest first. One line per change to the plan or step done.

- **17 Oct 2026**: Domain email done. Google Workspace, `hello@clickagain.in`
  alias, MX/SPF/DKIM/DMARC live. Site email switched to `hello@`.
- **17 Oct 2026**: A3 done. A4 partly done (alternateName, founder,
  foundingDate). A7 found the schema logo is a wide wordmark, so a square
  version is needed. Domain email decision added to B0.
- **17 Oct 2026**: Schema description and llms.txt changed to "digital
  marketing agency". About and FAQ keep "marketing company" (decision).
- **17 Oct 2026**: A1 done. Home title changed to "Click Again — Digital
  Marketing Agency in Madurai", and the description now says "digital
  marketing agency". Not deployed yet.

- **17 Oct 2026**: Plan written. Site already has metadata, sitemap, robots,
  schema and llms.txt. Not ranking for brand searches yet.
