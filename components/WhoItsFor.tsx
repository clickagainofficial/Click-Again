import { site } from "@/site.config";

/**
 * The sectors we work with, as a strip that drifts sideways on its own,
 * each with its illustration. Like the hero marquee, the track holds the
 * list twice and slides exactly one copy's width, so the loop never shows a
 * seam; the second copy is hidden from assistive tech.
 */
export default function WhoItsFor() {
  return (
    <>
      <div className="shell">
        <h2 className="sec-title">Who it&apos;s for</h2>
        <p className="hw-head">
          Whatever you run, <span className="hw-red">we start there.</span>
        </p>
        <p className="svc-intro">
          A single shop and a brand shipping across India need different work,
          not different levels of attention.
        </p>
      </div>

      <div className="wf-strip">
        <div className="wf-track">
          {[0, 1].map((pass) => (
            <ul className="wf-group" key={pass} aria-hidden={pass === 1}>
              {site.sectors.map((s) => (
                <li className="wf-pill" key={s.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="wf-pill-art"
                    src={s.art}
                    alt=""
                    width={160}
                    height={160}
                    loading="lazy"
                    draggable={false}
                  />
                  {s.name}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </>
  );
}
