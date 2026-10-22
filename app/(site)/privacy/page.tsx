import type { Metadata } from "next";
import LegalPage, { Clause, CompanyFacts } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  shareTitle: `Privacy Policy — ${site.name}`,
  description: `How ${site.name} collects, uses and protects the personal data you share on ${site.domain}.`,
  path: "/privacy",
});

export default function Privacy() {
  const { grievanceEmail, city, state } = site.legal;
  const place = [city, state].filter(Boolean).join(", ");

  return (
    <LegalPage
      title="Privacy Policy"
      intro={
        <p>
          This page explains what personal data {site.name} collects through{" "}
          <b>{site.domain}</b>, why we collect it, and what you can ask us to do
          with it. We have written it in plain language on purpose — if
          anything here is unclear, email us and we will explain it.
        </p>
      }
    >
      <Clause n="01" heading="Who we are">
        <CompanyFacts />
      </Clause>

      <Clause n="02" heading="What we collect">
        <p>
          There are no accounts, no logins and no payments on this site. The
          only way to send us information through it is the enquiry form on
          our Contact page, and only if you choose to.
        </p>
        <p>When you submit the <b>enquiry form</b> we record:</p>
        <ul>
          <li>
            <b>Your name, email address and business name</b> — exactly what
            you typed.
          </li>
          <li>
            <b>Your phone number</b> — stored as its 10 digits, without spaces
            or the +91 prefix.
          </li>
          <li>
            <b>The service you picked</b>, and anything you wrote in the
            optional description box.
          </li>
          <li>
            <b>The date and time</b> of the submission, and{" "}
            <b>your browser&apos;s user-agent string</b> (see below).
          </li>
        </ul>
        <p>
          <b>Your browser&apos;s user-agent string</b> is the browser and
          operating system your device reports. It helps us spot automated spam
          submissions.
        </p>
        <p>
          To stop the form being flooded, we look at your <b>IP address</b>{" "}
          when you submit it and count recent submissions from it. That count
          is held only in the server&apos;s memory for a few minutes and is
          never written to our database.
        </p>
        <p>
          If you joined our earlier <b>email updates list</b>, we also hold your
          email address, the date you joined, a label for the page you joined
          from, and your browser&apos;s user-agent string.
        </p>
        <p>
          We do not ask for your address or any financial information, and we
          do not collect anything else in the background.
        </p>
      </Clause>

      <Clause n="03" heading="Why we collect it">
        <p>
          <b>Enquiries:</b> to send you an email confirming we received your
          enquiry, and to call, WhatsApp or email you about your business and
          the service you asked about. <b>Email updates list:</b> to send you
          news from {site.name}. Those are the reasons you gave us the details,
          and we will not use them for anything else without asking you first.
        </p>
        <p>
          The legal basis is your <b>consent</b>, given when you submit the
          form. You can withdraw it at any time — see section 07.
        </p>
      </Clause>

      <Clause n="04" heading="Where it is stored, and who can see it">
        <p>
          Enquiries and email sign-ups are kept in a private, secured database.
          The website and the database run on established hosting providers
          that process this data on our behalf and only on our instructions.
        </p>
        <p>
          The confirmation email, and the alert that tells our team a new
          enquiry has arrived, are sent through our email service provider. If
          we reply to you on WhatsApp, that conversation also passes through
          WhatsApp (Meta Platforms, Inc.) under its own terms and privacy
          policy.
        </p>
        <p>
          Some of these providers operate servers outside India, so your data
          may be processed outside the country.
        </p>
        <p>
          <b>We do not sell, rent or trade your details.</b> We do not share
          them with advertisers, data brokers, or any other third party.
        </p>
      </Clause>

      <Clause n="05" heading="Cookies and tracking">
        <p>
          As of the date at the top of this page, this website sets{" "}
          <b>no cookies</b> and runs <b>no analytics, advertising or tracking
          scripts</b>. Nothing follows you around.
        </p>
        <p>
          The only thing the site keeps in your browser is a short note in{" "}
          <b>session storage</b> when you tap a menu link to a section of the
          home page from another page, so the home page knows where to scroll.
          It holds no personal data, is used once, and is cleared when you close
          the tab.
        </p>
        <p>
          We may add website analytics later to understand how many people visit
          the site. If we do, we will update this policy and the date above{" "}
          <b>before</b> those scripts go live, and this section will name each
          tool and what it collects.
        </p>
      </Clause>

      <Clause n="06" heading="How long we keep it">
        <p>
          We keep an enquiry for as long as we are talking to you about your
          business, and remove it once there is no longer a reason to hold it,
          or sooner if you ask us to. We keep an email address on the updates
          list until you ask us to remove it, or until we stop sending updates —
          whichever comes first.
        </p>
      </Clause>

      <Clause n="07" heading="Your rights">
        <p>
          Under India&apos;s Digital Personal Data Protection Act, 2023, you can
          ask us to:
        </p>
        <ul>
          <li>
            <b>Show you</b> the personal data we hold about you.
          </li>
          <li>
            <b>Correct</b> anything that is wrong or out of date.
          </li>
          <li>
            <b>Delete</b> your data — we will remove your enquiry, or your
            email address from the updates list.
          </li>
          <li>
            <b>Withdraw your consent</b>, which stops us from calling, messaging
            or emailing you at all.
          </li>
          <li>
            <b>Nominate</b> someone to exercise these rights on your behalf if
            you are unable to.
          </li>
        </ul>
        <p>
          Email <a href={`mailto:${grievanceEmail}`}>{grievanceEmail}</a> and
          tell us what you want done — from the address you signed up with, or
          with the name and phone number you gave us on the enquiry form. No
          forms, no conditions. We will act on it and confirm back to you.
        </p>
      </Clause>

      <Clause n="08" heading="Grievances">
        <p>
          If you are unhappy with how we have handled your data or your request,
          write to our grievance contact:
        </p>
        <p>
          <a href={`mailto:${grievanceEmail}`}>{grievanceEmail}</a>
        </p>
        <p>
          We aim to respond within a reasonable time. If you are still not
          satisfied, you may raise the matter with the Data Protection Board of
          India.
        </p>
      </Clause>

      <Clause n="09" heading="Security">
        <p>
          Access to the data is restricted to our own password-protected
          accounts, the connection between your browser and this site is
          encrypted (HTTPS), and the form is rate-limited so it cannot be
          flooded.
        </p>
        <p>
          No system is perfectly secure, and we will not pretend otherwise. If a
          breach ever affects your data, we will inform you and the Data
          Protection Board as required.
        </p>
      </Clause>

      <Clause n="10" heading="Children">
        <p>
          This site is meant for businesses and is not directed at children. We
          do not knowingly collect data from anyone under 18. If you believe a
          child has submitted their address, tell us and we will delete it.
        </p>
      </Clause>

      <Clause n="11" heading="Links to other sites">
        <p>
          We link to our Instagram and Facebook pages. Those platforms have
          their own privacy policies and we do not control what they collect
          once you leave this site.
        </p>
      </Clause>

      <Clause n="12" heading="Changes to this policy">
        <p>
          When we change this policy we will update the date at the top. If the
          change is significant — new tracking, a new purpose for your data — we
          will say so clearly rather than quietly editing the text.
        </p>
      </Clause>

      <Clause n="13" heading="Contact us">
        <p>
          {site.name}
          {place ? `, ${place}` : ""} — email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </Clause>
    </LegalPage>
  );
}
