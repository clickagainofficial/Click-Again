/**
 * Single place to edit the things that change often.
 */
export const site = {
  name: "Click Again",
  domain: "clickagain.in",
  url: "https://clickagain.in",


  email: "clickagainofficial@gmail.com",
  phone: "",

  /**
   * Company details used on the Privacy Policy and Terms pages.
   * "Click Again" is the brand; the company behind it is the legal entity.
   */
  legal: {
    entity: "Magizh Digital Marketing Solutions Private Limited",
    cin: "U63999TN2024PTC172597",
    address: "3/508, Bharathi Street, Muneswaran Nagar, Iyer Bungalow, Madurai, Tamil Nadu 625014",
    city: "Madurai",
    state: "Tamil Nadu",
    grievanceEmail: "clickagainofficial@gmail.com",
    // Shown as "Last updated" on both pages. Bump it whenever the text changes.
    updated: "14 October 2026",
  },

  socials: [
    { label: "Instagram", href: "https://www.instagram.com/clickagainofficial/" },
    {
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61594184312265",
    },
  ],

  journey: ["Connect", "Click", "Trust", "Return", "Refer"],

  /**
   * The strip under the banner. Each line is something a client actually
   * says, with our answer in the brackets — it states the whole positioning
   * faster than a paragraph would.
   */
  marquee: [
    "Just run some ads (let's check the maths first).",
    "We need more reach (you need more customers).",
    "Our ROAS is 4x (is that above your break-even?).",
    "Send me your packages (let's see what you actually need).",
    "We need more leads (you need leads that close).",
    "Make it go viral (let's make it sell).",
    "The sale is done (the business starts when they come back).",
  ],

  /**
   * The section right after the banner. The headline is the brand line; the
   * paragraph says why the company carries that name. *word* is drawn red.
   */
  manifesto: {
    lead: ["One click is a sale.", "*Click again* is a business."],
    body: "Anyone can buy attention. Ads, reach, a spike in traffic — money gets you all of that. What money can't buy is the reason someone comes back. That's the part we build, and it's why we're called *Click Again.*",
  },

  /**
   * How a job actually runs, so a first-time client knows what happens.
   * Step 04 leads back into 01 — the section draws that as a loop. `get` is
   * what the client has in hand at the end of each step; `pose` is the
   * mascot as he appears at that step, `face` the same cropped for the avatar.
   */
  process: [
    {
      no: "01",
      title: "Understand",
      text: "We start with your business, not your marketing. What you sell, who buys it, what a customer is worth to you, and why they'd choose you.",
      get: "A clear picture of where you stand",
      pose: "/How-we-work/web/detective.webp",
      face: "/How-we-work/web/detective-face.webp",
      poseAlt: "Our guy peering through a magnifying glass",
    },
    {
      no: "02",
      title: "Plan",
      text: "We map out the way forward: who to reach, what to say to them, where to show up, and in what order. Every piece is there for a reason.",
      get: "A clear plan of what happens, and when",
      pose: "/How-we-work/web/thinky.webp",
      face: "/How-we-work/web/thinky-face.webp",
      poseAlt: "Our guy thinking, clipboard in hand",
    },
    {
      no: "03",
      title: "Make & run",
      text: "We do the work and keep it moving, week after week, without you having to chase us for it.",
      get: "The work done, and regular word on how it's going",
      pose: "/How-we-work/web/racer.webp",
      face: "/How-we-work/web/racer-face.webp",
      poseAlt: "Our guy running with a toolbox",
    },
    {
      no: "04",
      title: "Measure & repeat",
      text: "We look at what worked and what came back. Keep what's working, fix what isn't, and go again.",
      get: "Honest results, and a sharper next round",
      pose: "/How-we-work/web/growy.webp",
      face: "/How-we-work/web/growy-face.webp",
      poseAlt: "Our guy giving a thumbs up inside a repeat arrow",
    },
  ],

  /**
   * Who this is for — shown on the home page as a strip that scrolls on its
   * own. `art` is the sector's illustration (sources in /public/weworkfor).
   */
  sectors: [
    {
      name: "Retail & showrooms",
      art: "/weworkfor/web/retail.webp",
    },
    {
      name: "D2C & ecommerce",
      art: "/weworkfor/web/d2c.webp",
    },
    {
      name: "SaaS & software",
      art: "/weworkfor/web/saas.webp",
    },
    {
      name: "Clinics & healthcare",
      art: "/weworkfor/web/clinic.webp",
    },
    {
      name: "Schools & coaching",
      art: "/weworkfor/web/school.webp",
    },
    {
      name: "Manufacturing & B2B",
      art: "/weworkfor/web/factory.webp",
    },
    {
      name: "Restaurants & cafés",
      art: "/weworkfor/web/food.webp",
    },
    {
      name: "Real estate",
      art: "/weworkfor/web/realestate.webp",
    },
    {
      name: "Local services",
      art: "/weworkfor/web/services.webp",
    },
  ],



  principles: [
    {
      no: "01",
      key: "What we do",
      text: "We find what your business **actually needs**, and build the work around it.",
    },
    {
      no: "02",
      key: "How we work",
      text: "We understand your **business, goal and audience** first — then choose the right way to grow.",
    },
    {
      no: "03",
      key: "What we mean",
      text: "One click is a sale. **Click again is a business.**",
    },
    {
      no: "04",
      key: "What we believe",
      text: "Getting noticed is the start. We build the reason people **come back**.",
    },
    {
      no: "05",
      key: "Where it leads",
      text: "Connect → Click → Trust → Return → **Refer**.",
    },
  ],

  /**
   * What we sell. Order here is the order in the nav and on the page, and
   * each one gets its own page at /solutions/<slug>.
   *
   * Only what we are ready to deliver goes on the site. Anything we are
   * not saying out loud yet simply is not listed.
   */
  services: [
    {
      slug: "marketing-strategy",
      title: "Marketing Strategy",
      tagline: "Decide what to do, before you spend on doing it.",
      intro:
        "Strategy is the work that happens before any money goes out: who is actually going to buy, why they would choose you, where they already spend their attention, and what that is worth spending to reach.",
      outcomes: [
        "Who you are selling to, written down — not assumed",
        "A channel plan with a budget against it, not a wish list",
        "A launch sequence you can actually run next month",
      ],
      items: [
        "Market research",
        "Customer & competitor analysis",
        "Marketing planning",
        "Campaign strategy",
        "Go-to-market planning",
      ],
    },
    {
      slug: "content-creative",
      title: "Content & Creative",
      tagline: "The part people actually see.",
      intro:
        "An ad is only as good as what sits inside it. We make the pictures, the words and the video that carry your offer — in Tamil and in English — for an audience that scrolls past almost everything it is shown.",
      outcomes: [
        "Creative built for the platform it runs on, not a poster resized",
        "Copy in the language your customer thinks in",
        "Enough variations to keep testing instead of guessing",
      ],
      items: [
        "Graphic design",
        "Copywriting",
        "Photography",
        "Video shoot & editing",
        "Animation",
        "Tamil / regional creative",
      ],
    },
    {
      slug: "website-digital-presence",
      title: "Website & Digital Presence",
      tagline: "Where the click lands.",
      intro:
        "Perfect ads can run into a page that loses the customer anyway. The site, the landing page, and how you turn up in search and in AI answers are one job: make it easy for somebody who is already interested to go ahead.",
      outcomes: [
        "A site built to convert, not only to look good",
        "Found on Google — and quoted by AI assistants when people ask",
        "A Google Business Profile that brings in local calls",
      ],
      items: [
        "Website design & development",
        "Landing pages",
        "SEO",
        "AI search optimisation (AEO / GEO)",
        "Google Business Profile",
      ],
    },
    {
      slug: "social-media-management",
      title: "Social Media Management",
      tagline: "Showing up like a business people trust.",
      intro:
        "A page that posted once, four months ago, tells a buyer more than you would like it to. Social is where people check whether you are real before they call. We run it as a habit — planned, posted, replied to — not as something remembered on a Friday.",
      outcomes: [
        "A page that looks alive when a prospect checks you out",
        "DMs and comments answered, not left sitting",
        "Content planned ahead instead of made in a panic",
      ],
      items: [
        "Instagram",
        "Facebook",
        "LinkedIn",
        "YouTube",
        "Page management",
        "Community management",
        "Social listening",
        "Social campaigns",
      ],
    },
    {
      slug: "performance-marketing",
      title: "Performance Marketing & Analytics",
      tagline: "Spend where it pays, and know that it paid.",
      intro:
        "Paid ads are the fastest way to find out whether an offer works, and the fastest way to lose money when nobody is checking the arithmetic. We run the campaigns and we track what comes back — down to what a single customer is allowed to cost before the spend stops making sense.",
      outcomes: [
        "A cost per customer you can defend to your accountant",
        "Tracking that actually fires, so the numbers mean something",
        "Budget moved towards what works, every week",
      ],
      items: [
        "Google Ads",
        "Meta Ads",
        "YouTube Ads",
        "Marketplace ads (Amazon, Flipkart, quick-commerce)",
        "Retargeting",
        "Lead generation",
        "Tracking setup (GA4 / GTM / Pixel)",
      ],
    },
    {
      slug: "retention-automation",
      title: "Retention & Automation",
      tagline: "One click is a sale. Click again is a business.",
      intro:
        "Winning a new customer costs several times more than keeping one you already have. This is the part that brings them back: the email, the WhatsApp message, the reminder that arrives at the right moment and brings somebody back — without you paying for that click a second time.",
      outcomes: [
        "Buyers who return without a second round of ad spend",
        "Follow-up that runs on its own, at the right time",
        "Fewer leads going cold in somebody's inbox",
      ],
      items: [
        "Email",
        "WhatsApp marketing",
        "Chatbots",
        "AI automations",
      ],
    },
  ],
} as const;
