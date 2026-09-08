import Link from "next/link";
import Countdown from "@/components/Countdown";
import NotifyForm from "@/components/NotifyForm";
import Wordmark from "@/components/Wordmark";
import { site } from "@/site.config";

/** Renders **bold** segments from the config copy. */
function rich(text: string) {
  return text.split("**").map((chunk, i) =>
    i % 2 ? <b key={i}>{chunk}</b> : <span key={i}>{chunk}</span>
  );
}

const marqueeWords = [
  "Connect",
  "Click",
  "Trust",
  "Return",
  "Refer",
  "No fixed packages",
  "Online + Offline",
  "Built for repeat business",
];

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <main>
      <div className="shell">
        <nav className="nav rise">
          <span className="badge">
            <span className="dot" />
            Coming soon
          </span>
          <span className="nav-domain">{site.domain}</span>
        </nav>

        <section className="hero">
          <Wordmark />

          <div className="journey rise d1">
            <span className="rule" />
            {site.journey.map((word, i) => (
              <span key={word} style={{ display: "contents" }}>
                {i > 0 && <span className="sep">•</span>}
                <span>{word}</span>
              </span>
            ))}
            <span className="rule" />
          </div>

          <p className="hero-line rise d2">
            We create marketing that makes people <b>connect</b> with your
            brand — and <b>come back</b> to it.
          </p>

          <p className="hero-kicker rise d2">
            The site is being built. The thinking is already done.
          </p>

          <Countdown launchDate={site.launchDate} />
          <NotifyForm />
        </section>
      </div>

      <div className="marquee">
        <div className="marquee-track">
          {[0, 1].map((pass) =>
            marqueeWords.map((w) => (
              <span key={`${pass}-${w}`} className={w === "Refer" ? "hot" : undefined}>
                {w}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="shell">
        <section className="principles">
          <h2 className="sec-title">What we stand on</h2>
          {site.principles.map((p) => (
            <div className="p-row" key={p.no}>
              <div className="p-num">{p.no}</div>
              <div className="p-key">{p.key}</div>
              <div className="p-text">{rich(p.text)}</div>
            </div>
          ))}
        </section>

        <section className="closer">
          <p className="small">Don&apos;t just make them buy once.</p>
          <p className="big">
            Make them <span className="mark">click again</span>.
          </p>
        </section>

        <footer className="footer">
          <span>
            © {year} {site.name} — a brand of {site.legal.entity}.
          </span>
          <span className="links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            {site.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </span>
        </footer>
      </div>
    </main>
  );
}
