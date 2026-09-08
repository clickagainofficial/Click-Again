import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Clause, CompanyFacts } from "@/components/LegalPage";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms that apply when you use ${site.domain}.`,
  robots: { index: true, follow: true },
};

export default function Terms() {
  const { entity, city, state } = site.legal;
  const place = [city, state].filter(Boolean).join(", ");

  return (
    <LegalPage
      title="Terms & Conditions"
      intro={
        <p>
          These terms apply when you use <b>{site.domain}</b>. The site is
          operated by <b>{entity}</b>, which trades under the brand{" "}
          <b>{site.name}</b>. By using the site you accept these terms. If you
          do not, please do not use it.
        </p>
      }
    >
      <Clause n="01" heading="Who you are dealing with">
        <CompanyFacts />
      </Clause>

      <Clause n="02" heading="What this site currently is">
        <p>
          Right now {site.domain} is a pre-launch page. It describes what{" "}
          {site.name} intends to offer and lets you join a waitlist. It is{" "}
          <b>not</b> an offer to sell services, a quotation, or a contract, and
          nothing on it creates a client relationship between us.
        </p>
        <p>
          When we start taking on work, engagements will be governed by a
          separate written agreement covering scope, fees and timelines. These
          terms only cover your use of this website.
        </p>
      </Clause>

      <Clause n="03" heading="The waitlist">
        <p>
          Submitting your email address means you are asking us to tell you when
          we launch. It does not reserve anything, guarantee pricing, or oblige
          either of us to anything further.
        </p>
        <p>
          Please only submit an address that is yours or that you are allowed to
          use. You can ask us to remove it at any time — see our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </Clause>

      <Clause n="04" heading="Our content and brand">
        <p>
          The {site.name} name, the logo, the wordmark, the copy on this site
          and its design are owned by {entity}. You may read and share the page,
          and link to it freely.
        </p>
        <p>You may not, without our written permission:</p>
        <ul>
          <li>use our name or logo as your own, or in a way that suggests we
            endorse you;</li>
          <li>copy the site&apos;s content or design to present it as yours;</li>
          <li>register a domain, business name or social handle that is
            confusingly similar to ours.</li>
        </ul>
      </Clause>

      <Clause n="05" heading="How you may use the site">
        <p>Use it normally. Please do not:</p>
        <ul>
          <li>submit automated, fake or bulk entries to the waitlist form;</li>
          <li>attempt to break, overload, probe or gain unauthorised access to
            the site or the systems behind it;</li>
          <li>scrape the site at a scale that affects its availability;</li>
          <li>use it for anything unlawful.</li>
        </ul>
        <p>
          We rate-limit the form and may block requests that look automated. If
          your genuine submission is blocked, just email us instead.
        </p>
      </Clause>

      <Clause n="06" heading="Links to other sites">
        <p>
          We link to our Instagram and Facebook pages. We do not control those
          platforms and are not responsible for their content, terms or privacy
          practices.
        </p>
      </Clause>

      <Clause n="07" heading="No warranty">
        <p>
          The site is provided as it is. We work to keep it accurate and
          available, but we do not promise it will be uninterrupted, error-free,
          or that the launch date shown will not change. Anything described here
          about our future services is a statement of intent, not a guarantee.
        </p>
      </Clause>

      <Clause n="08" heading="Limitation of liability">
        <p>
          To the extent permitted by law, {entity} is not liable for any
          indirect or consequential loss arising from your use of this website,
          including lost profits or lost business opportunity. Nothing in these
          terms limits liability that cannot be limited under Indian law.
        </p>
      </Clause>

      <Clause n="09" heading="Changes">
        <p>
          We may update these terms as the site grows into the full {site.name}{" "}
          website. The date at the top shows when they last changed. Continuing
          to use the site after a change means you accept the updated terms.
        </p>
      </Clause>

      <Clause n="10" heading="Governing law">
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

      <Clause n="11" heading="Contact">
        <p>
          Questions about these terms? Email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </Clause>
    </LegalPage>
  );
}
