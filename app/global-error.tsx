"use client";

import { useEffect } from "react";

/**
 * The last resort: the root layout itself failed, so there is no header,
 * no footer and no globals.css to lean on. It has to render its own <html>
 * and carry its own styles.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          background: "#fff6f0",
          color: "#1e1411",
          fontFamily: '"Segoe UI", system-ui, sans-serif',
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <h1
            style={{
              margin: "0 0 14px",
              fontSize: "1.9rem",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Something went wrong.
          </h1>
          <p
            style={{
              margin: "0 0 26px",
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "#866a5c",
            }}
          >
            The page couldn&apos;t load. Try again, or come back in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "13px 30px",
              border: 0,
              borderRadius: 999,
              background: "#be0919",
              color: "#fff",
              font: "inherit",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest ? (
            <p style={{ marginTop: 22, fontSize: 12, color: "#b69d8f" }}>
              Reference: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
