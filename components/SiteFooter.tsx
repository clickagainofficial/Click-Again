import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/site.config";

// lucide dropped brand marks in v1, so these two are drawn here.
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const socialIcons: Record<string, () => React.JSX.Element> = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
};

const companyLinks = [
  { text: "Home", href: "/" },
  { text: "About", href: "/about" },
  { text: "Insights", href: "/insights" },
  { text: "All solutions", href: "/solutions" },
  { text: "Contact", href: "/contact" },
];

const legalLinks = [
  { text: "Privacy Policy", href: "/privacy" },
  { text: "Terms & Conditions", href: "/terms" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  // site.phone is typed as the literal "" while it is unset, so widen it.
  const phone = site.phone as string;
  const contact = [
    { icon: Mail, text: site.email, href: `mailto:${site.email}` },
    ...(phone
      ? [{ icon: Phone, text: phone, href: `tel:${phone.replace(/\s/g, "")}` }]
      : []),
    { icon: MapPin, text: `${site.legal.city}, ${site.legal.state}`, isAddress: true },
  ];

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="footer-logo" aria-label={`${site.name} home`}>
              <Image
                src="/logo/clickagain-logo-tagline.png"
                alt={`${site.name} — One click is a sale. Click again is a business.`}
                width={1826}
                height={446}
              />
            </Link>

            <ul className="footer-socials">
              {site.socials.map(({ label, href }) => {
                const Icon = socialIcons[label];
                return (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
                      {Icon ? <Icon /> : label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <nav className="footer-cols" aria-label="Footer">
            <div>
              <p className="footer-head">Solutions</p>
              <ul>
                {site.services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/solutions/${s.slug}`}>{s.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="footer-head">Company</p>
              <ul>
                {companyLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link href={href}>{text}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="footer-head">Legal</p>
              <ul>
                {legalLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link href={href}>{text}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="footer-head">Contact</p>
              <ul className="footer-contact">
                {contact.map(({ icon: Icon, text, href, isAddress }) => (
                  <li key={text}>
                    <Icon className="footer-contact-icon" aria-hidden="true" />
                    {isAddress ? (
                      <address>{text}</address>
                    ) : (
                      <a href={href}>
                        {text.split("@").flatMap((part, i) =>
                          i ? [<wbr key={i} />, `@${part}`] : [part]
                        )}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="footer-bottom">
          <span>
            © {year} {site.name}. All rights reserved.
          </span>
          <span>{site.domain}</span>
        </div>
      </div>
    </footer>
  );
}
