"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { site } from "@/site.config";

/**
 * The logo at the foot of the page. It is still the home link, but on the
 * home page itself a click has nowhere to go — so there it rides back up to
 * the top instead. From any other page it opens home, which lands at the top
 * anyway, so either way the click ends up where it looks like it should.
 */
export default function FooterLogo() {
  const pathname = usePathname();
  const atHome = pathname === "/";

  return (
    <Link
      href="/"
      className="footer-logo"
      aria-label={atHome ? "Back to top" : `${site.name} home`}
      onClick={(e) => {
        if (!atHome) return;
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <Image
        src="/logo/clickagain-logo-tagline.png"
        alt={`${site.name} — One click is a sale. Click again is a business.`}
        width={1826}
        height={446}
      />
    </Link>
  );
}
