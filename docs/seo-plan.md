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
  - [x] `telephone`: +91 95664 02201 (17 Oct 2026)
  - [x] `openingHoursSpecification`: Mon–Fri 09:30–19:30, from
        `site.hours` in `site.config.ts` (17 Oct 2026)
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
  - [x] DKIM status "Authenticating email with DKIM" confirmed in the Admin
        console (17 Oct 2026)
  - [x] Test mail to `hello@` received (17 Oct 2026)
  - [ ] Change the email on the Instagram and Facebook bios
  - [ ] Optional: the contact form's SMTP (admin → SMTP settings) still
        sends through Gmail. It can move to Workspace later.
- [ ] Business phone number for the site, schema and Business Profile
- [ ] Is the Madurai address a public office or a home? If it's a home, set
      the Business Profile up as a service-area business with the address
      hidden.
- [x] Office hours: Monday to Friday, 9:30 am – 7:30 pm (17 Oct 2026)
- [x] Address is an **office customers can visit** (17 Oct 2026), so the
      Business Profile shows the address with a Maps pin. It isn't set up
      as a service-area business.
- [x] Phone: company number **+91 95664 02201**, set in `site.phone`
      (17 Oct 2026). It now shows in the footer, on /contact, in the schema
      `telephone` and in llms.txt.
- [ ] Address will change in future (said 17 Oct 2026). Use the current
      Madurai address for now. When it moves, update it everywhere in one
      go: `site.config.ts` + `lib/schema.ts` postal address, Business
      Profile, every directory.
- [ ] Where the domain is registered (needed to add DNS records)
- [ ] Which Google account owns everything. Use one business account, not a
      personal one.

### B1. Google Search Console (week 1, do this first)

- [x] Add a **Domain** property for `clickagain.in` (17 Oct 2026)
- [x] Verified with a DNS TXT record (17 Oct 2026). It was verified from
      the **`clickagainofficial@gmail.com`** account, so the token
      `google-site-verification=Cuw-VlGem…` belongs to that account. Don't
      delete it, or that account loses ownership. Workspace's token
      (`cnFgXat…`) is separate; both stay as `TXT @` at Hostinger.
- [ ] **Decision (17 Oct 2026): move ownership to `kansha@clickagain.in`
      and remove the Gmail account.** Order matters:
  - [x] 1. Added the property from `kansha@` (17 Oct 2026). It was **auto
        verified** through the Workspace token `cnFgXat…`, so that record
        now keeps both Workspace and Search Console verified. Never delete it.
  - [x] 2. Deleted the Gmail token `Cuw-VlGem…` at Hostinger (17 Oct 2026).
        Checked afterwards: `cnFgXat…`, SPF, DKIM, MX and the A record are
        all intact.
  - [x] 3. Removed `clickagainofficial@gmail.com` in `kansha@` → Users and
        permissions (17 Oct 2026). `kansha@clickagain.in` is now the only owner.
- [x] Submitted `https://clickagain.in/sitemap.xml` (17 Oct 2026): status
      Success, 13 pages found. A Domain property needs the full URL, not
      just `sitemap.xml`.
- [x] Requested indexing for `/`, `/about`, `/solutions` and `/contact`
      (17 Oct 2026). Live test for `/`: "URL is available to Google".
      Expect them indexed in 2–7 days. Check by searching `site:clickagain.in`
      or with URL Inspection → Google Index.
- [ ] After a week, check the Pages report for anything excluded

### B2. Bing Webmaster Tools (week 1)

- [x] Signed in and imported the site from Search Console (17 Oct 2026,
      `kansha@clickagain.in`)
- [x] Sitemap imported (17 Oct 2026, status "Processing" at first; it
      clears within about 48 hours)
- [x] Submitted 11 URLs (17 Oct 2026): home, about, solutions, contact,
      insights, and the 6 solution pages. Privacy and Terms were left to the
      sitemap. Bing allows 100 URLs a day.
- [ ] Optional, 18 Oct 2026: in Google Search Console, request indexing for
      `/insights` and the 6 solution pages (Google allows about 10 a day).
      The sitemap covers them anyway.
- [ ] Bing's index feeds Copilot and ChatGPT search, so this matters for AI
      answers too

### B3. Google Business Profile (week 1, biggest single win for brand searches)

> **Deferred (17 Oct 2026).** The office has no outside name board yet, so
> video verification would likely fail. The address may also change. Pick
> it back up once there's a board (or the new office is ready), or set it
> up as a service-area business with the address hidden. Until then, brand
> searches lean on the site, schema, Search Console and social profiles.

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
Phone:    +91 95664 02201
Website:  https://clickagain.in
Email:    hello@clickagain.in
Hours:    Monday to Friday, 9:30 am – 7:30 pm
Category: Marketing agency
```

### Where NAP is listed

When the address, phone or email changes, update **every** row here on the
same day. Add a row whenever a new listing is created.

| Place | Name | Address | Phone | Email | Listed on |
| --- | --- | --- | --- | --- | --- |
| Website (`site.config.ts`, one place in code; footer, contact, schema, llms.txt, legal pages follow it) | ✓ | ✓ | ✓ | ✓ | 17 Oct 2026 |
| Google Business Profile | | | | | |
| Bing Places | | | | | |
| Apple Business Connect | | | | | |
| Instagram bio (name "Click Again · Marketing Agency", bio option A, category Marketing Agency, link clickagain.in) | ✓ | ✓ | ✓ | ✓ | 21 Oct 2026 |
| Facebook page (username `facebook.com/clickagainofficial`, set 21 Oct 2026; site footer + schema `sameAs` updated) | | | | | |
| LinkedIn company page | | | | | |
| YouTube "About" | | | | | |
| X profile | | | | | |
| WhatsApp Business profile | | | | | |
| Justdial | | | | | |
| Sulekha | | | | | |
| Clutch | | | | | |
| GoodFirms | | | | | |
| DesignRush | | | | | |
| Crunchbase | | | | | |

---

## 8. Log

Newest first. One line per change to the plan or step done.

- **21 Oct 2026**: Facebook username set to `clickagainofficial`. The site's
  Facebook link (footer, schema `sameAs`) now uses it instead of the
  `profile.php?id=` link.
- **21 Oct 2026**: Instagram profile updated. Name "Click Again · Marketing
  Agency", new bio, phone, email and website. Decision: social bios say
  "marketing agency" (broad, fits future services); only the site title
  carries "digital marketing" for search.
- **17 Oct 2026**: Phone +91 95664 02201 and office hours (Mon–Fri
  9:30–7:30) added to the site and schema. Bing Webmaster set up with 11
  URLs submitted. Business Profile deferred until there's an outside board.
- **17 Oct 2026**: Search Console done. Domain property owned only by
  `kansha@clickagain.in`, sitemap Success (13 pages), indexing requested
  for 4 key pages.
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
