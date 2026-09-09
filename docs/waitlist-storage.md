# Waitlist storage

Signups from the "Notify me" form go straight into **MongoDB Atlas**. The admin
dashboard reads the same collection — there is no intermediate service.

```
POST /api/notify  ->  lib/waitlist.ts addSignup()  ->  Atlas: <db>.waitlist
/admin/waitlist   ->  lib/waitlist.ts listSignups()
```

## Connection

One environment variable:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>
```

Set it in `.env.local` and in Vercel under *Settings → Environment Variables*.
The database name comes from the path at the end of the URI, so `getDb()` takes
no argument.

`lib/mongo.ts` caches the client on `globalThis`. Serverless functions reuse a
warm container and dev reloads modules on every edit — without the cache each
would open a new connection pool.

## The collection

`waitlist`, one document per address:

| Field       | Example                          |
| ----------- | -------------------------------- |
| `email`     | `someone@example.com` (lowercased) |
| `source`    | `coming-soon`                    |
| `userAgent` | the browser string, for spotting bots |
| `createdAt` | `Date`                           |

Two indexes are created on first use, both idempotent:

- `{ email: 1 }` **unique** — a second submission of the same address updates
  nothing rather than creating a duplicate row.
- `{ createdAt: -1 }` — the dashboard always sorts newest first.

Writes use `updateOne(..., { $setOnInsert }, { upsert: true })`, so a repeat
signup keeps the original timestamp instead of overwriting it.

## Atlas network access

Vercel functions do not have fixed IP addresses. In Atlas under
**Network Access**, the allowlist must contain `0.0.0.0/0` or production will
fail to connect while local development still works. The database password is
the thing protecting it, so treat that as the real credential — rotate it in
Atlas and update `MONGODB_URI` in both places if it ever leaks.

## Migrating from Google Sheets

The waitlist used to live in a Google Sheet written by an Apps Script webhook.
That integration is gone: no `SHEET_WEBHOOK_*` variables, no webhook call in
`/api/notify`. Existing rows were copied across before the switch.

The Apps Script deployment can be deleted whenever you like — nothing calls it.
The sheet itself is a fine cold backup if you want to keep it.
