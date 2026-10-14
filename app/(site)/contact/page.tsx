import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import ContactForm from "@/components/ContactForm";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Tell ${site.name} about your business. Leave your number and we'll call you back within a working day.`,
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  // site.phone is typed as the literal "" while it is unset, so widen it.
  const phone: string = site.phone;
  const { address } = site.legal;
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="shell">
      <section className="page-head">
        <p className="eyebrow">Contact</p>
        <h1>Tell us about your business</h1>
        <p className="page-lede">
          Leave your number and we&apos;ll call you back. We&apos;ll ask what
          you sell, who buys it, and what you want more of.
        </p>
      </section>

      <div className="cp-grid">
        <section className="cp-form" aria-label="Enquiry form">
          <ContactForm />
        </section>

        <aside className="cp-info" aria-label="Contact details">
          <div className="cp-item">
            <span className="cp-icon" aria-hidden="true">
              <Mail />
            </span>
            <div>
              <p className="cp-label">Email</p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
          </div>

          {phone ? (
            <div className="cp-item">
              <span className="cp-icon" aria-hidden="true">
                <Phone />
              </span>
              <div>
                <p className="cp-label">Phone</p>
                <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
              </div>
            </div>
          ) : null}

          <div className="cp-item">
            <span className="cp-icon" aria-hidden="true">
              <MapPin />
            </span>
            <div>
              <p className="cp-label">Office</p>
              <address>{address}</address>
              <a className="cp-map" href={mapHref} target="_blank" rel="noreferrer">
                Open in Google Maps →
              </a>
            </div>
          </div>

          <div className="cp-item cp-follow">
            <p className="cp-label">Follow</p>
            <div className="cp-socials">
              {site.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
