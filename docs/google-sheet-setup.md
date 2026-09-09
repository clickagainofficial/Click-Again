# Waitlist → Google Sheet setup

Every "Notify me" signup gets appended as a row in this sheet:

https://docs.google.com/spreadsheets/d/PASTE_YOUR_SHEET_ID_HERE/edit

Takes about five minutes. You have to do steps 1–4 yourself — they run inside
your Google account.

---

## 1. Open the Apps Script editor

In the sheet: **Extensions → Apps Script**. Delete whatever code is in
`Code.gs` and paste this in:

```javascript
/**
 * Click Again — waitlist collector.
 * Deploy as a Web app (Execute as: Me, Access: Anyone).
 *
 * Everything lives inside doPost on purpose: a half-finished paste then fails
 * to save with a syntax error instead of deploying and breaking at runtime.
 */

function doPost(e) {
  var SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';
  var SHEET_NAME = 'Waitlist';
  var TOKEN = 'PASTE_YOUR_TOKEN_HERE';

  var reply = function (obj) {
    return ContentService
      .createTextOutput(JSON.stringify(obj))
      .setMimeType(ContentService.MimeType.JSON);
  };

  try {
    var body = JSON.parse(e.postData.contents);

    if (body.token !== TOKEN) {
      return reply({ error: 'unauthorized' });
    }

    var email = String(body.email || '').trim().toLowerCase();
    if (!email || email.indexOf('@') === -1) {
      return reply({ error: 'invalid email' });
    }

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Email', 'Source', 'User agent']);
      sheet.getRange('A1:D1').setFontWeight('bold');
      sheet.setFrozenRows(1);
      sheet.setColumnWidth(1, 170);
      sheet.setColumnWidth(2, 260);
    }

    // the admin dashboard reads the list back through this same endpoint
    if (body.action === 'list') {
      var rows = [];
      if (sheet.getLastRow() > 1) {
        var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
        for (var i = 0; i < values.length; i++) {
          var when = values[i][0];
          rows.push({
            timestamp: when instanceof Date ? when.toISOString() : String(when),
            email: String(values[i][1] || ''),
            source: String(values[i][2] || ''),
            userAgent: String(values[i][3] || ''),
          });
        }
      }
      return reply({ ok: true, rows: rows });
    }

    // skip duplicates so one person cannot fill the sheet
    if (sheet.getLastRow() > 1) {
      var existing = sheet
        .getRange(2, 2, sheet.getLastRow() - 1, 1)
        .getValues()
        .map(function (r) { return String(r[0]).trim().toLowerCase(); });

      if (existing.indexOf(email) !== -1) {
        return reply({ ok: true, duplicate: true });
      }
    }

    sheet.appendRow([
      new Date(),
      email,
      body.source || '',
      body.userAgent || '',
    ]);

    return reply({ ok: true });
  } catch (err) {
    return reply({ error: String(err) });
  }
}
```

Save it (Ctrl+S). The last line of the file must be the closing `}` of
`doPost` — if the paste got cut short, the save fails with a syntax error.

## 2. Deploy it as a web app

**Deploy → New deployment → ⚙️ → Web app**, then:

| Field           | Value                       |
| --------------- | --------------------------- |
| Description     | `waitlist`                  |
| Execute as      | **Me (your@gmail.com)**     |
| Who has access  | **Anyone**                  |

Click **Deploy**. Google will ask you to authorise — click through
*Advanced → Go to project (unsafe)* → *Allow*. That warning is normal for your
own scripts.

> "Anyone" means anyone who knows the URL can POST to it, which is why the
> `TOKEN` check is there. Keep both the URL and the token private.

## 3. Copy the web app URL

You get a URL like:

```
https://script.google.com/macros/s/AKfycb..................../exec
```

## 4. Put it in the site's environment

Create `.env.local` in the project root (it is git-ignored):

```
SHEET_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb.../exec
SHEET_WEBHOOK_TOKEN=PASTE_YOUR_TOKEN_HERE
```

Restart the dev server. Submit a test email on the page — it should land in the
sheet within a second or two.

On **Vercel**, add the same two variables under
*Project → Settings → Environment Variables*, then redeploy.

---

## Notes

- Without `SHEET_WEBHOOK_URL`, the API only logs the address and returns
  success, so local dev works without secrets. Nothing is stored in that mode.
- If the sheet write fails, the visitor sees an error instead of a false
  "you're on the list" — the failure is also logged server-side.
- Duplicate emails are ignored by the script, so a double-click won't create two
  rows.
- **Changing the script later:** saving in the editor is not enough. The `/exec`
  URL serves a frozen snapshot, so you must go *Deploy → Manage deployments →
  ✏️ → Version: **New version** → Deploy*. The URL stays the same.
- Apps Script answers with HTTP 200 even when the script throws, so the API
  route checks the response body for `{"ok":true}` rather than trusting the
  status code. A script error therefore shows the visitor a real error instead
  of a false "you're on the list".
- Script errors are visible in the Apps Script editor under **Executions**.
- If you rotate `TOKEN`, change it in both the Apps Script and `.env.local`.
