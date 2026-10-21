/**
 * Tells Bing (and the other IndexNow engines: Yandex, Seznam, Naver…) that
 * pages changed, so they re-crawl now instead of on their own schedule.
 * Bing's index is what ChatGPT search and Copilot answer from.
 *
 *   npm run indexnow                 every URL in the live sitemap
 *   npm run indexnow -- /about /     just these paths
 *
 * Run it after a deploy has gone live, not before: the engines fetch the
 * pages straight away, and should see the new version.
 *
 * The key proves we own the domain. It is public by design — it is served
 * as a file at the site root — so it is fine in this repository.
 */
const HOST = "clickagain.in";
const KEY = "ca0796395e472e1bc053c71223ead237";
const SITE = `https://${HOST}`;

async function sitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml: HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const paths = process.argv.slice(2);
const urlList = paths.length
  ? paths.map((p) => new URL(p, SITE).toString())
  : await sitemapUrls();

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList,
  }),
});

// 200 = accepted, 202 = accepted but the key is still being checked.
// Anything else is a real problem worth reading.
console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URL(s)`);
if (res.status !== 200 && res.status !== 202) {
  console.log(await res.text());
  process.exitCode = 1;
}
