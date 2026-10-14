"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { site } from "@/site.config";

/** Anchors point at home-page sections; real routes point at pages. */
const tabs = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "How we work", href: "/#how" },
  { label: "Insights", href: "/insights" },
];

/** "Talk to us" goes to the contact page and its form. */
const contactHref = "/contact";

/** How long the page has to sit still before a hidden nav comes back. */
const IDLE_SHOW_MS = 5000;

/** Set before leaving another page for a home-page section, read on arrival. */
const PENDING_KEY = "ca-scroll-to";

/**
 * Lands the section's own top edge on the top of the screen. scrollIntoView
 * would honour the page's scroll-padding and leave a strip of the previous
 * section showing; the nav tucks away on the way down and every band has its
 * own top padding, so no offset is needed.
 */
function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
}

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  /**
   * Out of the way while reading: scrolling down tucks the nav up, and it
   * comes back as soon as the visitor scrolls up, stops scrolling for a few
   * seconds, or is back near the top.
   */
  useEffect(() => {
    let lastY = window.scrollY;
    let idle = 0;

    function onScroll() {
      const y = window.scrollY;
      if (y < 120) setHidden(false);
      else if (y > lastY + 4) setHidden(true);
      else if (y < lastY - 4) setHidden(false);
      lastY = y;

      window.clearTimeout(idle);
      idle = window.setTimeout(() => setHidden(false), IDLE_SHOW_MS);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idle);
    };
  }, []);

  /**
   * Links to a home-page section (/#how) always arrive by scrolling down to
   * it. On the home page that is a smooth scroll from wherever you are; from
   * any other page the home page opens at the top first, then glides down.
   */
  const goToSection = useCallback(
    (e: React.MouseEvent, href: string) => {
      const id = href.split("#")[1];
      if (!id) return;
      e.preventDefault();
      setMenuOpen(false);
      if (pathname === "/") {
        scrollToId(id);
      } else {
        sessionStorage.setItem(PENDING_KEY, id);
        router.push("/");
      }
    },
    [pathname, router]
  );

  useEffect(() => {
    if (pathname !== "/") return;
    const id = sessionStorage.getItem(PENDING_KEY);
    if (!id) return;
    sessionStorage.removeItem(PENDING_KEY);
    // let the page paint at the top for a beat, so the scroll is seen
    const t = window.setTimeout(() => scrollToId(id), 350);
    return () => window.clearTimeout(t);
  }, [pathname]);

  /**
   * The highlight is one element that slides to whichever item is hovered,
   * which is what makes crossing the nav feel continuous instead of a row of
   * separate buttons lighting up. Doing it by hand rather than reaching for a
   * layout-animation library keeps ~50 KB off a marketing site's critical
   * path for what is, in the end, a moving rounded rectangle.
   */
  const navRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  const moveTo = useCallback((el: HTMLElement | null) => {
    const nav = navRef.current;
    if (!el || !nav) return;
    // Measured against the nav rather than read off offsetLeft: the Solutions
    // trigger sits inside a positioned wrapper, so offsetLeft is relative to
    // that wrapper and reports 0 — which parked the highlight on the first
    // item no matter which one you were pointing at.
    const item = el.getBoundingClientRect();
    const bounds = nav.getBoundingClientRect();
    setPill({ x: item.left - bounds.left, w: item.width });
  }, []);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  // Hover opens it, but closing waits a moment — otherwise cutting the corner
  // between the trigger and the panel shuts it in your face.
  const openSolutions = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setSolutionsOpen(true);
  }, []);

  const closeSolutions = useCallback((delay = 140) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setSolutionsOpen(false), delay);
  }, []);

  useEffect(() => {
    setSolutionsOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Escape and click-away, so a pointer that never leaves cleanly still exits
  useEffect(() => {
    if (!solutionsOpen) return;

    function onPointerDown(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setSolutionsOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSolutionsOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [solutionsOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    },
    []
  );

  const onSolutions = pathname.startsWith("/solutions");

  return (
    <header
      className={`site-header${hidden && !menuOpen && !solutionsOpen ? " is-hidden" : ""}`}
    >
      <div className="header-rail">
        {/* one oval holds the logo and the nav together */}
        <div className="nav-pill">
          <Link
            href="/"
            className="header-logo"
            aria-label={`${site.name} home`}
          >
            <Image
              src="/logo/clickagain-logo.png"
              alt={site.name}
              width={1826}
              height={338}
              priority
            />
          </Link>

          <nav
            className="nav-links"
            aria-label="Main"
            ref={navRef}
            onMouseLeave={() => setPill(null)}
          >
            <span
              className={pill ? "nav-pointer is-on" : "nav-pointer"}
              aria-hidden="true"
              style={
                pill
                  ? { transform: `translateX(${pill.x}px)`, width: pill.w }
                  : undefined
              }
            />

            <Link
              href="/"
              className={`nav-link${pathname === "/" ? " is-active" : ""}`}
              onMouseEnter={(e) => moveTo(e.currentTarget)}
            >
              Home
            </Link>

            <Link
              href="/about"
              className={`nav-link${pathname === "/about" ? " is-active" : ""}`}
              onMouseEnter={(e) => moveTo(e.currentTarget)}
            >
              About
            </Link>

            <div
              className="nav-dropdown"
              ref={dropdownRef}
              onMouseEnter={openSolutions}
              onMouseLeave={() => closeSolutions()}
            >
              <button
                type="button"
                className={`nav-link nav-trigger${onSolutions ? " is-active" : ""}`}
                aria-expanded={solutionsOpen}
                aria-haspopup="true"
                onMouseEnter={(e) => moveTo(e.currentTarget)}
                onFocus={(e) => {
                  moveTo(e.currentTarget);
                  openSolutions();
                }}
                onClick={() =>
                  solutionsOpen ? closeSolutions(0) : openSolutions()
                }
              >
                Solutions
                <svg
                  viewBox="0 0 10 6"
                  aria-hidden="true"
                  className={solutionsOpen ? "caret is-open" : "caret"}
                >
                  <path
                    d="M1 1l4 4 4-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {solutionsOpen ? (
                // the wrapper's top padding bridges the gap to the panel, so
                // the pointer never crosses dead space on the way down
                <div className="dropdown-wrap">
                  <div className="dropdown" role="menu">
                    {site.services.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/solutions/${s.slug}`}
                        className="dropdown-item"
                        role="menuitem"
                      >
                        {s.title}
                      </Link>
                    ))}
                    <Link
                      href="/solutions"
                      className="dropdown-all"
                      role="menuitem"
                    >
                      All solutions →
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            {tabs.slice(2).map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`nav-link${pathname === t.href ? " is-active" : ""}`}
                onMouseEnter={(e) => moveTo(e.currentTarget)}
                onClick={t.href.includes("#") ? (e) => goToSection(e, t.href) : undefined}
              >
                {t.label}
              </Link>
            ))}
          </nav>

          <Link href={contactHref} className="nav-cta">
            Talk to us
          </Link>

          <button
            type="button"
            className="header-burger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={menuOpen ? "burger is-open" : "burger"} />
          </button>
        </div>

        {menuOpen ? (
          <div className="mobile-sheet">
            <div className="shell">
              <p className="mobile-label">Solutions</p>
              {site.services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/solutions/${s.slug}`}
                  className="mobile-item"
                >
                  {s.title}
                </Link>
              ))}
              <Link href="/solutions" className="mobile-item is-all">
                All solutions →
              </Link>

              <p className="mobile-label">Pages</p>
              {tabs.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="mobile-item"
                  onClick={t.href.includes("#") ? (e) => goToSection(e, t.href) : undefined}
                >
                  {t.label}
                </Link>
              ))}

              <Link href={contactHref} className="mobile-cta">
                Talk to us
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
