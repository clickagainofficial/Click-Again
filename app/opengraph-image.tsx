import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/site.config";

/**
 * The card that shows up when the site is pasted into WhatsApp, LinkedIn or
 * an AI answer. The layout declares twitter:card as summary_large_image, so
 * something has to fill it — this is that something.
 *
 * Drawn rather than shipped as a flat file so the wording follows the config.
 */

export const alt = `${site.name} — Marketing that makes them come back`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(
    path.join(process.cwd(), "public/logo/clickagain-logo.png")
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

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
          padding: "72px 80px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={300} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#1e1411",
            }}
          >
            One click is a sale.
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#be0919",
            }}
          >
            Click again is a business.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 26,
            color: "#866a5c",
          }}
        >
          <span>Marketing company in {site.legal.city}</span>
          <span style={{ color: "#f0cdb5" }}>|</span>
          <span>{site.domain}</span>
        </div>
      </div>
    ),
    size
  );
}
