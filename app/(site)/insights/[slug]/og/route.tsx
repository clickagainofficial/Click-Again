import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { insights } from "@/content/insights";
import { isPublished } from "@/lib/insights";
import { site } from "@/site.config";

/**
 * Each post's own share card at /insights/<slug>/og, so a link pasted into
 * WhatsApp or LinkedIn shows the post's title rather than the site-wide
 * card. A plain route rather than opengraph-image.tsx because Next adds a
 * hash to that file's URL in dynamic segments, and the article schema
 * needs an address that stays put.
 */
const size = { width: 1200, height: 630 };

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = insights.find((p) => p.slug === slug);
  // a scheduled post's card shouldn't give its title away before its date
  if (!post || !isPublished(post)) return new Response("Not found", { status: 404 });
  const mark = await readFile(path.join(process.cwd(), "public/logo/clickagain-mark-512.png"));
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;
  const title = post?.title ?? `${site.name} Insights`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fff6f0",
          padding: "64px 76px",
          borderTop: "14px solid #be0919",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markSrc} alt="" width={64} height={64} />
          <span style={{ fontSize: 28, fontWeight: 700, color: "#1e1411" }}>{site.name}</span>
          <span style={{ fontSize: 28, color: "#f0cdb5" }}>|</span>
          <span style={{ fontSize: 26, color: "#866a5c" }}>Insights</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {post ? (
            <div style={{ display: "flex" }}>
              <span
                style={{
                  padding: "8px 18px",
                  borderRadius: 999,
                  background: "rgba(190, 9, 25, 0.1)",
                  color: "#be0919",
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {post.tag}
              </span>
            </div>
          ) : null}
          <div
            style={{
              fontSize: title.length > 85 ? 52 : 60,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: "-0.025em",
              color: "#1e1411",
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "#866a5c",
          }}
        >
          <span>
            {site.founder.name}, {site.founder.role}
          </span>
          <span style={{ color: "#be0919", fontWeight: 700 }}>{site.domain}</span>
        </div>
      </div>
    ),
    {
      ...size,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" },
    }
  );
}
