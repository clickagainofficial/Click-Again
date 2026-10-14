# Click Again

Next.js 15 (App Router, TypeScript) site for **clickagain.in** — the public
pages plus a private admin dashboard at `/admin`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Stop the dev server before running a build: both write to `.next`, and running
them together corrupts it.

## Brand colours

Sampled from the logo, defined once in [app/globals.css](app/globals.css):

| Token          | Value     | Used for                          |
| -------------- | --------- | --------------------------------- |
| `--ink`        | `#1e1411` | body text (warm ink, not black)   |
| `--red-bright` | `#d40a1d` | top of the red gradient           |
| `--red`        | `#be0919` | core brand red                    |
| `--red-deep`   | `#a20617` | bottom of the red gradient        |
| `--peach`      | `#fff6f0` | page background                   |
| `--white`      | `#ffffff` | cards on the peach ground         |
| `--line`       | `#f7e0d1` | hairline rules                    |

The button and the "click again" underline use `--grad-a`, the same red gradient
as the `A` in the logo.

## Machine-readable layer

Everything below is generated from [site.config.ts](site.config.ts), so there
is no second copy of the business facts to keep in step:

| Route            | Source                                      |
| ---------------- | ------------------------------------------- |
| `/robots.txt`    | [app/robots.ts](app/robots.ts)              |
| `/sitemap.xml`   | [app/sitemap.ts](app/sitemap.ts)            |
| `/llms.txt`      | [app/llms.txt/route.ts](app/llms.txt/route.ts) |
| `/opengraph-image` | [app/opengraph-image.tsx](app/opengraph-image.tsx) |

JSON-LD is built in [lib/schema.ts](lib/schema.ts) and rendered by
[components/JsonLd.tsx](components/JsonLd.tsx): Organization and WebSite on
every page, Service and BreadcrumbList on each solution, BlogPosting on each
insight.

## Logo asset

`public/Logo/ClickAgain.png` is the untouched master (6628×2208, artwork on a
white plate, wide empty margin). `public/clickagain-logo.png` is the web asset
used in the hero.

```bash
npm run logo    # master -> web asset
```

[scripts/build-logo.js](scripts/build-logo.js) crops the empty margin,
downsamples to 1128×310 (124 KB), and lifts the white plate out into a real
alpha channel — anti-aliased edges keep their true colour at partial alpha, so
there is no white fringe on the paper background. Re-run it if the master
changes.

## What to edit

- **[site.config.ts](site.config.ts)** — launch date for the countdown, contact
  email, social links, and the five brand principles.
- **[app/api/notify/route.ts](app/api/notify/route.ts)** — the waitlist endpoint.
  Signups go straight into MongoDB; see
  [docs/waitlist-storage.md](docs/waitlist-storage.md).
- **[components/Wordmark.tsx](components/Wordmark.tsx)** — the hero logo lockup.

## Admin

A private dashboard lives at `/admin` — sign-in, an overview, and the waitlist
module. Setup and the security model are in [docs/admin.md](docs/admin.md).

## Environment

Copy `.env.example` to `.env.local` and fill in `MONGODB_URI`, `ADMIN_EMAIL`,
`ADMIN_PASSWORD` and `AUTH_SECRET`. The same four go in the Vercel project
settings.

## Deploy

Zero-config on Vercel; `clickagain.in` is pointed at the project under
Vercel → Domains.
