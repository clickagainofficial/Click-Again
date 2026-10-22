import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Clause, CompanyFacts } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions",
  shareTitle: `Terms & Conditions — ${site.name}`,
  description: `The terms that apply when you use ${site.domain}, the website of ${site.name}, a marketing agency in Madurai — and send us an enquiry.`,
  path: "/terms",
});

export default function Terms() {
  const { city, state } = site.legal;
  const place = [city, state].filter(Boolean).join(", ");

  return (
    <LegalPage
      title="Terms & Conditions"
      intro={
        <p>
          These terms apply when you use <b>{site.domain}</b>, the website of{" "}
          <b>{site.name}</b>. By using the site you accept these terms. If you
          do not, please do not use it.
        </p>
      }
    >
      <Clause n="01" heading="Who you are dealing with">
        <CompanyFacts />
      </Clause>

      <Clause n="02" heading="What this site is">
        <p>
          {site.domain} explains the services {site.name} offers, how we work
          and who we are, and lets you send us an enquiry from the{" "}
          <Link href="/contact">Contact</Link> page.
        </p>
        <p>
          Nothing on the site is a quotation, an offer or a contract, and using
          it does not by itself create a client relationship between us. When
          we take on work for you, it is governed by a separate written
          agreement covering scope, fees and timelines. These terms only cover
          your use of this website.
        </p>
      </Clause>

      <Clause n="03" heading="Enquiries and how we reply">
        <p>
          Sending an enquiry means you are asking us to contact you about your
          business. It does not reserve anything, fix a price, or oblige either
          of us to anything further.
        </p>
        <ul>
          <li>
            Please only give a name, email address, phone number and business
            details that are yours or that you are allowed to use.
          </li>
          <li>
            We send an email to confirm we have your enquiry, then reply by
            phone call, WhatsApp or email. We aim to get back to you within a
            working day, but we cannot promise it every time.
          </li>
          <li>
            We may decide not to take on a piece of work — for example if we
            are not the right fit for what you need — and will tell you so.
          </li>
          <li>
            You can ask us to remove your details at any time — see our{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </li>
        </ul>
      </Clause>

      <Clause n="04" heading="General information, not advice">
        <p>
          Our service pages, the steps in &ldquo;How we work&rdquo; and anything
          else we write here describe how we usually approach things. They are
          general information, not professional advice for your particular
          business, and results always depend on the business, its market and
          many things outside anyone&apos;s control. Please don&apos;t rely on
          them alone to make decisions — talk to us, and we&apos;ll look at your
          situation properly.
        </p>
      </Clause>

      <Clause n="05" heading="Our content and brand">
        <p>
          The {site.name} name and logo, our mascot Clicky, the illustrations,
          the copy on this site and its design are owned by {site.name}. You may
          read the site, share its pages and link to them freely.
        </p>
        <p>You may not, without our written permission:</p>
        <ul>
          <li>
            use our name, logo or mascot as your own, or in a way that suggests
            we endorse you;
          </li>
          <li>
            copy the site&apos;s text, illustrations or design to present them
            as yours;
          </li>
          <li>
            register a domain, business name or social handle that is
            confusingly similar to ours.
          </li>
        </ul>
      </Clause>

      <Clause n="06" heading="How you may use the site">
        <p>Use it normally. Please do not:</p>
        <ul>
          <li>submit automated, fake or bulk entries to the enquiry form;</li>
          <li>
            attempt to break, overload, probe or gain unauthorised access to
            the site or the systems behind it, including its admin area;
          </li>
          <li>scrape the site at a scale that affects its availability;</li>
          <li>use it for anything unlawful.</li>
        </ul>
        <p>
          We rate-limit the form and may block requests that look automated. If
          your genuine enquiry is blocked, just email us instead.
        </p>
      </Clause>

      <Clause n="07" heading="Links to other services">
        <p>
          The site links to our Instagram and Facebook pages and to Google Maps,
          and we may reply to you on WhatsApp or by email. We do not control those services
          and are not responsible for their content, terms or privacy practices.
        </p>
      </Clause>

      <Clause n="08" heading="Your personal data">
        <p>
          What we collect through the enquiry form, why, and what you can ask us
          to do with it is explained in our{" "}
          <Link href="/privacy">Privacy Policy</Link>, which forms part of these
          terms.
        </p>
      </Clause>

      <Clause n="09" heading="No warranty">
        <p>
          The site is provided as it is. We work to keep it accurate and
          available, but we do not promise it will be uninterrupted or
          error-free, and we may change, add or remove pages and services
          described on it at any time.
        </p>
      </Clause>

      <Clause n="10" heading="Limitation of liability">
        <p>
          To the extent permitted by law, {site.name} is not liable for any
          indirect or consequential loss arising from your use of this website,
          including lost profits or lost business opportunity. Nothing in these
          terms limits liability that cannot be limited under Indian law.
        </p>
      </Clause>

      <Clause n="11" heading="Changes">
        <p>
          We may update these terms from time to time. The date at the top
          shows when they last changed. Continuing to use the site after a
          change means you accept the updated terms.
        </p>
      </Clause>

      <Clause n="12" heading="Governing law">
        <p>
          These terms are governed by the laws of India
          {place ? (
            <>
              , and the courts at <b>{place}</b> have exclusive jurisdiction
              over any dispute arising from them
            </>
          ) : null}
          .
        </p>
      </Clause>

      <Clause n="13" heading="Contact">
        <p>
          Questions about these terms? Email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>, or use the{" "}
          <Link href="/contact">Contact</Link> page.
        </p>
      </Clause>
    </LegalPage>
  );
}
