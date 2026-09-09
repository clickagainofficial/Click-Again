# Admin dashboard

Private dashboard at **`/admin`** showing the waitlist: totals, signups per
day, a searchable table, and a CSV export.

Built with [shadcn/ui](https://ui.shadcn.com) components. Tailwind is imported
only by `app/admin/admin.css`, so the public pages keep their hand-written CSS
and never download a utility framework.

---

## Sign in

`/admin` redirects to `/admin/login` until you have a session. Credentials come
from environment variables — **never from the code**, because this repository is
public.

| Variable         | What it is                                          |
| ---------------- | --------------------------------------------------- |
| `ADMIN_EMAIL`    | the email you sign in with                          |
| `ADMIN_PASSWORD` | the password you sign in with                       |
| `AUTH_SECRET`    | long random string that signs the session cookie    |

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Set all three locally in `.env.local`, and in Vercel under
*Project → Settings → Environment Variables*. Changing `AUTH_SECRET` signs
everyone out.

### Changing the password

Edit `ADMIN_PASSWORD` in `.env.local` for local work, and in Vercel for the live
site — then redeploy, because Vercel bakes environment variables in at build
time. No code change needed.

## How the session works

`lib/session.ts` puts `{email, exp}` in a cookie signed with HMAC-SHA256. The
cookie is `httpOnly`, `sameSite=lax`, `secure` in production, and lasts a week.
`middleware.ts` verifies it on every `/admin` and `/api/admin/*` request, so a
page is never rendered before the check runs.

Protections in place:

- Six failed sign-ins from one IP locks that IP out for 15 minutes.
- Wrong email and wrong password give the *same* message, so neither can be
  probed separately.
- Credentials are compared in constant time.
- `/admin` is `noindex, nofollow` — it will not appear in search results.

## Reading the waitlist

The dashboard reads the sheet through the same Apps Script webhook that saves
signups, sending `{token, action: "list"}`. The script must be the current
version in [google-sheet-setup.md](google-sheet-setup.md) — the one containing
the `body.action === 'list'` block.

If it is not, the dashboard shows *"Can't read the waitlist"* with the reason.
**Signups keep saving normally either way** — only reading them back here is
affected.

After updating the script, remember: *Deploy → Manage deployments → ✏️ →
Version: **New version***. Saving alone does not change what `/exec` serves.

## Adding more shadcn components

`components.json` is set up, so the CLI works:

```bash
npx shadcn@latest add dialog dropdown-menu
```

Components land in `components/ui/` and pick up the theme from
`app/admin/admin.css`, where the tokens are defined (`--primary` is the logo
red, `#be0919`).

## A note on what is behind this login

The table holds real people's email addresses, given to you for one purpose.
Treat the password like the key to that data — it is the only thing between the
open internet and a list of personal data you are accountable for under the
DPDP Act.
