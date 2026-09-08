import Image from "next/image";
import { site } from "@/site.config";

/**
 * The hero lockup: the real logo artwork, with the brand name kept in the
 * markup as an h1 so search engines and screen readers still get it.
 */
export default function Wordmark() {
  return (
    <>
      <h1 className="sr-only">{site.name}</h1>
      <Image
        className="logo"
        src="/clickagain-logo.png"
        alt={`${site.name} logo`}
        width={1128}
        height={310}
        priority
        sizes="(max-width: 860px) 86vw, 760px"
      />
    </>
  );
}
