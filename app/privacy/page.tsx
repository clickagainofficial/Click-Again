import type { Metadata } from "next";
import LegalPage, { Clause, CompanyFacts } from "@/components/LegalPage";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects the personal data you share on ${site.domain}.`,
  robots: { index: true, follow: true },
};

export default function Privacy() {
  const { entity, grievanceEmail, city, state } = site.legal;
  const place = [city, state].filter(Boolean).join(", ");

  return (
    <LegalPage
      title="Privacy Policy"
      intro={
        <p>
          {site.name} is a brand of <b>{entity}</b>. This page explains what
          personal data we collect through <b>{site.domain}</b>, why we collect
          it, and what you can ask us to do with it. We have written it in plain
          language on purpose — if anything here is unclear, email us and we
          will explain it.
        </p>
      }
    >
      <Clause n="01" heading="Who we are">
        <CompanyFacts />
      </Clause>

      <Clause n="02" heading="What we collect">
        <p>
          This site is a pre-launch page. There are no accounts, no logins and
          no payments. The only thing you can submit is your email address, and
          only if you choose to.
        </p>
        <p>When you submit the waitlist form we record:</p>
        <ul>
          <li>
            <b>Your email address</b> — exactly what you typed.
          </li>
          <li>
            <b>The date and time</b> of the submission.
          </li>
          <li>
            <b>A source label</b> telling us which page the signup came from.
          </li>
          <li>
            <b>Your browser&apos;s user-agent string</b> — the browser and
            operating system your device reports. It helps us spot automated
            spam submissions.
          </li>
        </ul>
        <p>
          We do not ask for your name, phone number, address, or any financial
          information, and we do not collect anything else in the background.
        </p>
      </Clause>

      <Clause n="03" heading="Why we collect it">
        <p>
          For one purpose: to email you when {site.name} launches. That is the
          reason you gave us the address, and we will not use it for anything
          else without asking you first.
        </p>
        <p>
          The legal basis is your <b>consent</b>, given when you submit the
          form. You can withdraw it at any time — see section 07.
        </p>
      </Clause>

      <Clause n="04" heading="Where it is stored, and who can see it">
        <p>
          Signups are written to a private Google Sheet in our company Google
          Workspace account. The website itself runs on Vercel. That means two
          service providers process data on our behalf:
        </p>
        <ul>
          <li>
            <b>Google LLC</b> — stores the waitlist sheet and runs the script
            that writes to it.
          </li>
          <li>
            <b>Vercel Inc.</b> — hosts the website and handles the request when
            you submit the form.
          </li>
        </ul>
        <p>
          Both are established providers with their own security and privacy
          commitments, and both operate servers outside India, so your data may
          be processed outside the country. They act only on our instructions.
        </p>
        <p>
          <b>We do not sell, rent or trade your email address.</b> We do not
          share it with advertisers, data brokers, or any other third party.
        </p>
      </Clause>

      <Clause n="05" heading="Cookies and tracking">
        <p>
          As of the date at the top of this page, this website sets{" "}
          <b>no cookies</b> and runs <b>no analytics, advertising or tracking
          scripts</b>. Nothing follows you around, and nothing is stored in your
          browser.
        </p>
        <p>
          We may add website analytics later to understand how many people visit
          the page. If we do, we will update this policy and the date above{" "}
          <b>before</b> those scripts go live, and this section will name each
          tool and what it collects.
        </p>
      </Clause>

      <Clause n="06" heading="How long we keep it">
        <p>
          We keep your email address until {site.name} has launched and the
          launch announcement has been sent, or until you ask us to delete it —
          whichever comes first. After that we remove addresses we no longer
          have a reason to hold.
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
            <b>Delete</b> your data — we will remove your row from the waitlist.
          </li>
          <li>
            <b>Withdraw your consent</b>, which stops us from emailing you at
            all.
          </li>
          <li>
            <b>Nominate</b> someone to exercise these rights on your behalf if
            you are unable to.
          </li>
        </ul>
        <p>
          Email <a href={`mailto:${grievanceEmail}`}>{grievanceEmail}</a> from
          the address you signed up with and tell us what you want done. No
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
          Access to the waitlist is restricted to our own accounts, the
          connection between your browser and this site is encrypted (HTTPS),
          and the endpoint that saves your address is protected by a secret key
          and rate limiting so it cannot be flooded.
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
          {entity}
          {place ? `, ${place}` : ""} — email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </Clause>
    </LegalPage>
  );
}
