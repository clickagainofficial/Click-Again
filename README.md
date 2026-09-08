# Click Again — coming soon page

Next.js 15 (App Router, TypeScript) landing page for **clickagain.in**.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Brand colours

Sampled from the logo, defined once in [app/globals.css](app/globals.css):

| Token          | Value     | Used for                          |
| -------------- | --------- | --------------------------------- |
| `--ink`        | `#000000` | "Click" / "gain" wordmark, text   |
| `--red-bright` | `#d40a1d` | top of the red gradient           |
| `--red`        | `#be0919` | core brand red                    |
| `--red-deep`   | `#a20617` | bottom of the red gradient        |
| `--red-shadow` | `#8b0815` | deepest shade                     |
| `--paper`      | `#f2f1ec` | page background (brand sheet)     |
| `--line`       | `#d7d4cc` | hairline rules                    |

The button and the "click again" underline use `--grad-a`, the same red gradient
as the `A` in the logo.

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
  It posts each signup to a Google Sheet via an Apps Script webhook. Follow
  [docs/google-sheet-setup.md](docs/google-sheet-setup.md) once, then fill in
  `SHEET_WEBHOOK_URL` and `SHEET_WEBHOOK_TOKEN` (see `.env.example`). Until that
  URL is set the endpoint only logs and **nothing is stored**.
- **[components/Wordmark.tsx](components/Wordmark.tsx)** — the hero logo lockup.

## Deploy

Zero-config on Vercel. Point `clickagain.in` at the project in Vercel → Domains.
