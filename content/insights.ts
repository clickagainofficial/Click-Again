/**
 * Posts for /insights. The facts about each post live here; the article
 * itself is Markdown in content/insights/<slug>.md, so a post can carry
 * links, lists and tables without anyone touching code.
 *
 * `date` is the publish date. A post dated in the future stays hidden —
 * off the list, the sitemap and llms.txt, and a 404 at its URL — until that
 * day arrives in India, so posts can be written ahead and go out on a
 * schedule. Never back-date a post: search engines saw what was here when.
 */
export type Insight = {
  slug: string;
  title: string;
  /** The search-result title: about 50–60 characters, main keyword first. */
  seoTitle: string;
  /** One or two lines: the card, the lede under the title, and the meta description. */
  summary: string;
  /** Publish date, ISO "YYYY-MM-DD", India time. */
  date: string;
  /** Last meaningful edit, if any, ISO "YYYY-MM-DD". */
  updated?: string;
  /** Short topic label shown as a pill, and the filter tabs on /insights. */
  tag: string;
  /** Where the advice applies, shown as a chip on the card: "Madurai", "India"… */
  place: string;
  /**
   * The solution pages this guide belongs with, by service slug. Each of
   * those pages shows it as a "Related guide", so readers (and crawlers)
   * move from what we sell to proof that we know it.
   */
  services: string[];
  /** The "In short" box at the top: the answer before the detail. */
  takeaways: string[];
  /** Shown at the end of the post and published as FAQPage data. */
  faqs: { q: string; a: string }[];
  /** Official or primary sources the post relies on. */
  sources: { label: string; url: string }[];
};

export const insights: Insight[] = [
  {
    slug: "break-even-roas-india",
    seoTitle: "Break-Even ROAS for Indian Businesses: A Rupee Example",
    title:
      "Is Your ROAS Actually Profitable? How to Work Out Break-Even ROAS for an Indian Business",
    summary:
      "A 4x ROAS sounds healthy until GST, delivery, payment fees and COD returns come out of it. Here is how to work out the ROAS your business actually needs, with a full rupee example.",
    date: "2026-10-16",
    tag: "Performance marketing",
    place: "India",
    services: ["performance-marketing"],
    takeaways: [
      "Break-even ROAS = revenue the ad platform reports per order ÷ what you keep from that order before ad spend.",
      "Take GST out of revenue, and take product cost, packaging, delivery, payment fees and returns out of what you keep.",
      "The lower your margin, the higher the ROAS you need: at a 25% margin you need 4x just to break even.",
      "Set your target above break-even by the profit you want, and judge every campaign against that number, not against someone else's 'good ROAS'.",
      "For enquiry-led businesses, turn it into a maximum cost per lead using your close rate.",
    ],
    faqs: [
      {
        q: "What is a good ROAS in India?",
        a: "There is no single good number. A good ROAS is any ROAS above your own break-even, and break-even depends on your margin. A business keeping 50% of each sale breaks even at 2x; one keeping 20% needs 5x. Work out your break-even first, then judge campaigns against it.",
      },
      {
        q: "Should I include GST when I calculate ROAS?",
        a: "Take it out. GST collected on a sale goes to the government, not to you. If your website sends the GST-inclusive order total to Meta or Google, the platform's ROAS is inflated by that GST, so calculate your break-even against the same GST-inclusive figure, as this article shows.",
      },
      {
        q: "What is the difference between ROAS and ROI?",
        a: "ROAS divides revenue by ad spend. It ignores what the product, delivery and fees cost you. ROI (or profit) looks at what is left after all those costs. Break-even ROAS is the bridge between them: the ROAS at which ad-driven profit is exactly zero.",
      },
      {
        q: "Does break-even ROAS include rent and salaries?",
        a: "No. Break-even ROAS only covers the costs that come with each extra order. Rent, salaries and software are paid whether or not an ad runs, so they come out of the profit you make above break-even. That is why your target ROAS should sit above break-even, not at it.",
      },
      {
        q: "Why does my ROAS in Meta Ads not match my bank account?",
        a: "Meta credits a sale to an ad using your attribution setting, commonly within 7 days of a click or 1 day of a view, and counts it when the order is placed, before any cancellation or return. Your bank sees what was actually paid and kept. Compare like with like, and check platform numbers against your own order records every month.",
      },
    ],
    sources: [
      {
        label: "Meta Business Help Center: About Facebook's attribution system",
        url: "https://www.facebook.com/business/help/458681590974355",
      },
      {
        label: "Google Ads Help: About Target ROAS bidding",
        url: "https://support.google.com/google-ads/answer/6268637",
      },
    ],
  },
  {
    slug: "how-to-choose-a-marketing-agency-in-madurai",
    seoTitle: "How to Choose a Marketing Agency in Madurai: 12 Questions",
    title:
      "How to Choose a Marketing Agency in Madurai: 12 Questions to Ask Before You Sign",
    summary:
      "Twelve questions to put to any marketing agency before you sign, and what a good answer sounds like, from the first 90 days and reporting to who owns your ad accounts.",
    date: "2026-10-09",
    tag: "Hiring an agency",
    place: "Madurai",
    services: ["marketing-strategy"],
    takeaways: [
      "A good agency asks about your business before it shows you a package.",
      "Ask for a week-by-week plan for the first 90 days, and for the numbers they will report: customers and cost per customer, not just likes and reach.",
      "Your ad accounts, pages, website, domain and data should be in your name, with the agency added as a partner.",
      "Get the full cost in writing: fee, GST, ad spend, shoots, extra revisions, and how to end the contract.",
      "Be wary of guaranteed rankings or guaranteed sales. Google itself says no one can guarantee a #1 ranking.",
    ],
    faqs: [
      {
        q: "How much does a marketing agency in Madurai cost?",
        a: "It depends on the scope. Agencies usually charge a monthly retainer for ongoing work, a fixed price for a project such as a website, or occasionally a share of ad spend. Ad spend itself is a separate cost that goes to Meta or Google. Compare quotes by what is included, not by the headline fee.",
      },
      {
        q: "Should I hire a local agency or one from a bigger city?",
        a: "Choose the one that understands your customers. A local team can meet you in person, knows the festival calendar and writes naturally in Tamil, which matters for many Madurai businesses. Location matters less than the quality of the questions they ask and the plan they give you.",
      },
      {
        q: "How long does marketing take to show results?",
        a: "Paid ads produce data within days and a clearer picture within a few weeks of testing. Search engine optimisation is slower and is measured in months, not weeks. Ask the agency what you should expect to see at 30, 60 and 90 days.",
      },
      {
        q: "Is it safe to give an agency access to my Facebook page and ad account?",
        a: "Yes, if it is done as partner access. Keep ownership of the Business Manager, page and ad account yourself and add the agency as a partner with the permissions it needs. You can remove that access at any time without losing anything.",
      },
      {
        q: "What should be in a marketing agency contract?",
        a: "The scope of work, deliverables and timelines, the fee and what it includes, how ad spend is paid, who owns the accounts and creative, how results are reported, the notice period, and what the agency hands back when the contract ends.",
      },
    ],
    sources: [
      {
        label: "Google Search Central: Do you need an SEO?",
        url: "https://developers.google.com/search/docs/fundamentals/do-i-need-seo",
      },
      {
        label: "Meta Business Help Center: Give a partner access to business assets",
        url: "https://www.facebook.com/business/help/1717412048538897",
      },
    ],
  },
  {
    slug: "whatsapp-follow-up-plan-for-local-businesses",
    seoTitle: "WhatsApp Follow-Up Plan for Local Businesses in Tamil Nadu",
    title:
      "How to Bring Customers Back: A WhatsApp Follow-Up Plan for Local Businesses in Tamil Nadu",
    summary:
      "A step-by-step plan for shops, clinics, salons and restaurants to turn first-time customers into regulars on WhatsApp, with timings, sample messages in English and Tamil, and the rules that keep your number safe.",
    date: "2026-10-23",
    tag: "Retention",
    place: "Tamil Nadu",
    services: ["retention-automation"],
    takeaways: [
      "Ask permission first, at the counter, on the bill or on a form. WhatsApp's own policy requires opt-in before a business messages someone.",
      "Four messages do most of the work: a thank-you, a check-in, a reason to come back, and a win-back.",
      "Time them to how often your customers naturally return, not to a fixed calendar.",
      "The free WhatsApp Business app is enough to start; move to the WhatsApp Business Platform when you need approved templates, automation and several staff on one number.",
      "Judge it by repeat customers, not by how many people read the message.",
    ],
    faqs: [
      {
        q: "Is it legal to send WhatsApp marketing messages to customers in India?",
        a: "Yes, if the customer has agreed to hear from you and you follow WhatsApp's Business and Commerce policies. WhatsApp requires opt-in before you message someone, and India's Digital Personal Data Protection Act expects consent to be clear and easy to withdraw. Always give people a simple way to stop the messages.",
      },
      {
        q: "How often should a small business message its customers?",
        a: "Only when there is a reason that matters to the customer, such as a thank-you, a reminder when something is due, or a genuine offer around a festival. For most local businesses that works out to a few messages a month at most. If people start blocking you, you are sending too many.",
      },
      {
        q: "Do I need the WhatsApp Business API?",
        a: "Not to start. The free WhatsApp Business app handles a few hundred customers, quick replies, labels and broadcast lists. The WhatsApp Business Platform (the API) is worth it when you need automated reminders, approved message templates, several staff answering from one number, or a link to your billing software.",
      },
      {
        q: "Why don't my broadcast messages reach everyone?",
        a: "A broadcast from the WhatsApp Business app only reaches people who have saved your number in their phone. Ask customers to save your number when they opt in, or use the WhatsApp Business Platform, which sends approved templates to anyone who has opted in.",
      },
      {
        q: "Can I send WhatsApp messages in Tamil?",
        a: "Yes. The WhatsApp Business app sends whatever you type, and message templates on the WhatsApp Business Platform can be created in Tamil. Write the message in Tamil from the start rather than translating an English one word for word.",
      },
    ],
    sources: [
      {
        label: "WhatsApp Business Messaging Policy",
        url: "https://business.whatsapp.com/policy",
      },
      {
        label: "WhatsApp Business Platform: Getting opt-in",
        url: "https://developers.facebook.com/docs/whatsapp/overview/getting-opt-in",
      },
      {
        label: "WhatsApp Business Platform: Pricing",
        url: "https://developers.facebook.com/docs/whatsapp/pricing",
      },
      {
        label: "WhatsApp Business app",
        url: "https://business.whatsapp.com/products/business-app",
      },
    ],
  },
];
