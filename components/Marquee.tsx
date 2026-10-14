import { site } from "@/site.config";

function Star() {
  return (
    <svg className="marquee-star" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M10 1.2 11.9 8.1 18.8 10 11.9 11.9 10 18.8 8.1 11.9 1.2 10 8.1 8.1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * An endless strip. The track holds the list twice and slides exactly one
 * copy's width, so the loop meets itself with no visible seam. The second
 * copy is hidden from assistive tech — it is the same sentences again.
 */
export default function Marquee() {
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[0, 1].map((pass) => (
          <div className="marquee-group" key={pass} aria-hidden={pass === 1}>
            {site.marquee.map((line) => (
              <span className="marquee-item" key={line}>
                {line}
                <Star />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
