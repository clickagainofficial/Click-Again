import Image from "next/image";
import Link from "next/link";

/**
 * The name, explaining itself. The brand line is set round a circle and turns
 * slowly in the corner of the banner, with Clicky's face in the middle of it —
 * the line is about coming back round, so the stamp does too.
 *
 * It goes to /about, where the story behind the name is written out.
 *
 * The text is laid on a circle of radius 68 in a 200-unit box, and textLength
 * is that circle's circumference (2πr ≈ 427). Pinning it means the sentence
 * wraps the ring exactly once however the font happens to measure, instead of
 * overlapping itself or leaving a gap.
 */
export default function BrandStamp() {
  return (
    <Link
      className="stamp"
      href="/about"
      aria-label="One click is a sale. Click again is a business — read our story"
    >
      <svg className="stamp-ring" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <path
            id="stamp-path"
            d="M100,100 m-68,0 a68,68 0 1,1 136,0 a68,68 0 1,1 -136,0"
          />
        </defs>
        <text>
          <textPath href="#stamp-path" textLength="427" lengthAdjust="spacing">
            ONE CLICK IS A SALE · CLICK AGAIN IS A BUSINESS ·
          </textPath>
        </text>
      </svg>

      <span className="stamp-core" aria-hidden="true">
        <Image
          src="/How-we-work/web/clicky-face.webp"
          alt="Clicky, the Click Again mascot"
          width={160}
          height={160}
          draggable={false}
        />
      </span>
    </Link>
  );
}
