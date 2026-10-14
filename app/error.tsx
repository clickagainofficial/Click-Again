"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Something threw while rendering a page. The header and footer are still
 * there — this replaces only the page body — so it stays on the site rather
 * than dropping the visitor onto Next's default screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // the digest is what ties this to the server log on Vercel
    console.error(error);
  }, [error]);

  return (
    <div className="shell">
      <section className="page-head">
        <p className="eyebrow">Something broke</p>
        <h1>
          That didn&apos;t load <span className="nf-red">properly.</span>
        </h1>
        <p className="page-lede">
          Our end, not yours. Try again — and if it keeps happening, tell us
          what you were doing and we&apos;ll fix it.
        </p>
        <div className="nf-actions">
          <button className="btn" type="button" onClick={reset}>
            Try again
          </button>
          <Link className="btn-ghost" href="/">
            Back home
          </Link>
        </div>
        {error.digest ? (
          <p className="err-digest">Reference: {error.digest}</p>
        ) : null}
      </section>
    </div>
  );
}
