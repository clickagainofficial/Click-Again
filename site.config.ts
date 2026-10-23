/**
 * Single place to edit the things that change often.
 */
export const site = {
  name: "Click Again",
  domain: "clickagain.in",
  url: "https://clickagain.in",


  email: "hello@clickagain.in",
  phone: "+91 95664 02201",

  /** Office hours, the same as on the Google Business Profile. Days are
   *  schema.org day names; times are 24-hour, India time. */
  hours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:30",
    closes: "19:30",
    label: "Monday to Friday, 9:30 am – 7:30 pm",
  },

  /**
   * When the public pages last changed, as an ISO date. It becomes <lastmod>
   * in the sitemap, which is how crawlers and AI agents decide what to
   * re-read — so bump it when page copy changes, and leave it alone for
   * style-only tweaks. The legal pages use legal.updated instead.
   */
  updated: "2026-10-23",

  /** The year the company started, and who runs it. Used on the About page
   *  and in /llms.txt, so both say the same thing. */
  founded: "2026",
  founder: { name: "Kansha M", first: "Kansha", role: "Founder & CEO" },
  /** The disciplines the team is drawn from — said on the About page. */
  disciplines: ["marketing", "design", "technology", "business"],

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
    grievanceEmail: "hello@clickagain.in",
    // Shown as "Last updated" on both pages. Bump it whenever the text changes.
    updated: "17 October 2026",
  },

  socials: [
    { label: "Instagram", href: "https://www.instagram.com/clickagainofficial/" },
    { label: "Facebook", href: "https://www.facebook.com/clickagainofficial" },
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
    "Just make us a website (let's make it bring in enquiries).",
    "We need more leads (you need leads that close).",
    "Make it go viral (let's make it sell).",
    "The sale is done (the business starts when they come back).",
  ],

  /**
   * The section right after the banner. The headline is the brand line; the
   * paragraph says why the company carries that name. *word* is drawn red.
   *
   * Written to stand above the channels rather than inside them: a reader
   * running a showroom or a clinic should recognise their own business here,
   * not assume this is an agency that only buys ads.
   */
  manifesto: {
    lead: ["One click is a sale.", "*Click again* is a business."],
    body: "Attention can be bought. Advertising, visibility, a busy season — money arranges all of it, and all of it passes. What money cannot buy is the reason a customer returns: the brand, the offer, the way a business treats the people it serves. That is the part we build, and it is why we are called *Click Again.*",
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



  /**
   * Questions on the home page, also published as FAQPage data. Same rules
   * as the /contact list below: every answer restates what the site already
   * says, and none repeats a /contact question, so the two pages don't
   * compete for the same answer.
   */
  homeFaqs: [
    {
      q: "Is Click Again a marketing agency in Madurai?",
      a: "Yes. Click Again is a marketing agency based in Madurai, Tamil Nadu, working with businesses across Tamil Nadu. Our work covers marketing strategy, content and creative, websites and digital presence, social media management, performance marketing and analytics, and retention and automation.",
    },
    {
      q: "Does Click Again only run ads?",
      a: "No. Ads are one part of the work. We start with your business — what you sell, who buys it and why they would choose you — and then decide what to do. That can be strategy, creative, a website, social media or ads, and it always includes the part that brings customers back: follow-ups by email and WhatsApp, and automation.",
    },
    {
      q: "Do you work with businesses outside Madurai?",
      a: "Yes. We're based in Madurai and work with businesses across Tamil Nadu, from a single store to a brand selling across India. We create content in both Tamil and English.",
    },
    {
      q: "How do I get started?",
      a: "Tell us about your business on our contact page, or give us a call. A member of our team will call you within one working day to understand what you sell and what you want more of, then tell you honestly where we can help.",
    },
    {
      q: "How soon will I see results?",
      a: "It depends on the work. Ads start producing data within weeks; search, content and brand work build over months. Before anything starts, the plan sets out what happens and when, and you get regular word on how it's going.",
    },
  ],

  /** Questions on /about, published as FAQPage data. Same rules as homeFaqs. */
  aboutFaqs: [
    {
      q: "Who founded Click Again?",
      a: "Click Again was founded in Madurai, Tamil Nadu, in 2026 by Kansha M, who leads it as Founder & CEO.",
    },
    {
      q: "Why was Click Again started?",
      a: "Because many good businesses were hard to find, hard to trust or hard to reach, not because the business was weak, but because of how it showed up to the people looking for it. Click Again exists so that every business can be seen, trusted and chosen.",
    },
    {
      q: "Who works at Click Again?",
      a: "A team drawn from marketing, design, technology and business, not media buyers alone. The work is produced in English and in Tamil.",
    },
    {
      q: "What does Click Again believe?",
      a: "That a business should be made strong first and then sent customers; that the business, the goal and the audience come before choosing any work; and that getting noticed is only the start. The journey we work towards is Connect, Click, Trust, Return and Refer.",
    },
  ],

  /** Questions on /solutions, published as FAQPage data. Same rules as homeFaqs. */
  solutionsFaqs: [
    {
      q: "What marketing services does Click Again offer?",
      a: "Six areas of work: Marketing Strategy, Content & Creative, Website & Digital Presence, Social Media Management, Performance Marketing & Analytics, and Retention & Automation. Each has its own page with everything it includes.",
    },
    {
      q: "How do you decide which services my business needs?",
      a: "We look at your business, your goal and your audience first, then pick the work that moves the number you actually care about, whether that is enquiries, sales or customers coming back.",
    },
    {
      q: "How do the six services work together?",
      a: "Strategy decides what to do before money is spent. Content and creative is the part people see. The website is where the click lands. Social media is where people check you are real. Performance marketing brings customers in, and retention brings them back.",
    },
    {
      q: "Do you offer SEO and AI search optimisation?",
      a: "Yes, as part of Website & Digital Presence: technical fixes, page structure and content for search, AI search optimisation so assistants like ChatGPT and Gemini can quote you, and Google Business Profile setup for local search and Maps.",
    },
    {
      q: "What happens once we start working together?",
      a: "Four steps that repeat: we understand your business, plan what happens and when, make and run the work week after week, then measure what came back, keep what works and go again.",
    },
  ],

  /**
   * Questions on /contact, also published as FAQPage structured data. Every
   * answer restates something the site already says — no new promises, no
   * comparisons, nothing a first call couldn't stand behind.
   */
  faqs: [
    {
      q: "What does Click Again do?",
      a: "Click Again is a marketing company based in Madurai, Tamil Nadu. We help businesses get found, earn trust and win customers — and then give those customers a reason to come back. Our work covers marketing strategy, content and creative, websites and digital presence, social media management, performance marketing and analytics, and retention and automation.",
    },
    {
      q: "What does the name “Click Again” mean?",
      a: "It comes from a simple belief: one click is a sale, but click again is a business. Getting noticed is only the start. What builds a business is the customer who returns, and then recommends you to others. That second click is what we work towards.",
    },
    {
      q: "How do you begin working with a new business?",
      a: "We start with your business, not your marketing. Before we suggest anything, we take time to understand what you sell, who buys it, what a customer is worth to you and why they would choose you. From there we build a clear plan: who to reach, what to say, where to show up and in what order.",
    },
    {
      q: "What happens after I send an enquiry?",
      a: "A member of our team will call you within one working day. On that first conversation we'll learn about your business, your customers and what you want more of. Then we'll tell you honestly where we think we can help.",
    },
    {
      q: "What kinds of businesses do you work with?",
      a: "We work with businesses of every size, from a single store to a brand selling across India. That includes retail and showrooms, D2C and ecommerce brands, SaaS and software companies, and more. Every business gets the same care and attention. Only the work changes, depending on what the business needs.",
    },
    {
      q: "Can I work with you on just one service?",
      a: "Yes. Some businesses need a complete approach, from strategy through to retention. Others need one specific thing done well, such as a website, social media or advertising. We'll recommend what fits your goals, and you choose what to begin with.",
    },
    {
      q: "Do you create content in Tamil?",
      a: "Yes. We write copy and create content in both Tamil and English, so your message reaches customers in the language they're most comfortable with.",
    },
    {
      q: "How will I know the work is delivering results?",
      a: "We report on what matters to your business: how many customers came in, what each one took to win, and how many came back. You'll get regular updates as the work runs, so you always know where things stand. Then we review what worked, refine what didn't, and plan the next round.",
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
      /** Questions on this solution page, published as FAQPage data. */
      faqs: [
        {
          q: "What does a marketing strategy from Click Again include?",
          a: "Market research, customer and competitor analysis, a marketing plan and campaign strategy. Together they answer who will buy, why they would choose you, where they spend their attention and what that is worth spending to reach.",
        },
        {
          q: "What do I have at the end of the strategy work?",
          a: "Who you are selling to, written down rather than assumed; a channel plan with a budget against every line; and a launch sequence you can actually run next month.",
        },
        {
          q: "Should I work out a strategy before running ads?",
          a: "Strategy is the work that happens before money goes out. Deciding the audience, the offer and the message first means the ads have something clear to say, and you know in advance what counts as them working.",
        },
        {
          q: "Do you study my competitors?",
          a: "Yes. We look at who your best customers are weighing you against: their offers, their pricing, the words they use and the gap they leave open. That gap is often where your message should sit.",
        },
        {
          q: "Can you plan the launch of a new product, branch or city?",
          a: "Yes. We work out the order of the launch: what goes out first, what follows it, and what has to be ready before day one, so the launch has a plan rather than a hope.",
        },
      ],
      items: [
        {
          name: "Market research",
          text: "We size the demand that already exists — what people search for, what they pay today, which parts of the market are crowded and which are being ignored.",
        },
        {
          name: "Customer & competitor analysis",
          text: "We work out who your best customer actually is, and what they are weighing you against: the offers, the pricing, the words your competitors use, and the gap they leave open.",
        },
        {
          name: "Marketing planning",
          text: "Which channels, how much goes on each, and in what order — written down as a plan with a number against every line, so you can hold us to it.",
        },
        {
          name: "Campaign strategy",
          text: "The offer, the audience and the message for a specific push, decided before anything gets made — including what counts as it having worked.",
        },
        {
          name: "Go-to-market planning",
          text: "For a new product, branch or city: the order of the launch. What goes out first, what follows it, and what has to be ready before day one.",
        },
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
      /** Questions on this solution page, published as FAQPage data. */
      faqs: [
        {
          q: "What kind of content do you create?",
          a: "Graphic design for ads, posts, menus, brochures and packaging; copywriting; product, food, interior and team photography; video shoots and editing for reels, ads and brand films; animation; and Tamil creative.",
        },
        {
          q: "Is your Tamil content written in Tamil or translated?",
          a: "Written in Tamil, not translated into it. The same goes for voiceovers and on-screen text, so it sounds like a local said it.",
        },
        {
          q: "Do you shoot photos and videos on location?",
          a: "Yes. Shoots are done on location with the end use in mind, so a frame works as an ad and not only as a nice photo, and videos are cut into the lengths each platform needs.",
        },
        {
          q: "Do you write the captions and ad copy too?",
          a: "Yes. Ad lines, captions, website copy and video scripts, written to be read in a hurry and to make the offer plain.",
        },
        {
          q: "Do you make animated videos?",
          a: "Yes. Motion graphics and animated explainers for when a still frame can't carry the point, such as product demos, offer films and logo animations.",
        },
      ],
      items: [
        {
          name: "Graphic design",
          text: "Ad creative, posts, menus, brochures, packaging — drawn from your brand and sized properly for every place it has to run.",
        },
        {
          name: "Copywriting",
          text: "The words. Ad lines, captions, website copy, scripts — written to be read in a hurry and to make the offer plain.",
        },
        {
          name: "Photography",
          text: "Product, food, interior and team shoots, done on location with the end use in mind — so a frame works as an ad, not only as a nice photo.",
        },
        {
          name: "Video shoot & editing",
          text: "Reels, ads, testimonials and brand films. We plan the shot list, shoot it, and cut it into the lengths each platform needs.",
        },
        {
          name: "Animation",
          text: "Motion graphics and animated explainers for the times a still frame cannot carry the point — product demos, offer films, logo stings.",
        },
        {
          name: "Tamil / regional creative",
          text: "Work written in Tamil, not translated into it. Same for the voiceover and the on-screen text, so it sounds like a local said it.",
        },
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
      /** Questions on this solution page, published as FAQPage data. */
      faqs: [
        {
          q: "Do you design and build websites?",
          a: "Yes. We design and build the site, keep it simple for you to update, and make sure the enquiry forms actually reach you.",
        },
        {
          q: "Will my website work well on phones?",
          a: "Yes. Sites are built for the phone first, where most of your customers will see them, and made quick to load.",
        },
        {
          q: "Do you build landing pages for ads?",
          a: "Yes. One page, one campaign, one action, so people clicking an ad land somewhere built to convert instead of on your home page.",
        },
        {
          q: "What is AI search optimisation (AEO or GEO)?",
          a: "Structuring your business information so that AI assistants such as ChatGPT, Gemini and Google's AI answers quote you when someone asks about what you sell. It sits alongside regular SEO, which gets your pages ranking for what customers type.",
        },
        {
          q: "Do you set up Google Business Profiles?",
          a: "Yes. We set up the listing properly, with categories, photos, services, hours and reviews, so you turn up in local search and on Google Maps and the calls come in.",
        },
      ],
      items: [
        {
          name: "Website design & development",
          text: "We design and build the site — quick to load, built for the phone first, simple for you to update, with enquiry forms that actually reach you.",
        },
        {
          name: "Landing pages",
          text: "One page, one campaign, one action — so paid traffic lands somewhere built to convert instead of on your homepage.",
        },
        {
          name: "SEO",
          text: "The technical fixes, the page structure and the content that get the pages you care about ranking for what your customers really type.",
        },
        {
          name: "AI search optimisation (AEO / GEO)",
          text: "Your information structured so ChatGPT, Gemini and Google's AI answers quote you when somebody asks about what you sell.",
        },
        {
          name: "Google Business Profile",
          text: "The listing done properly — categories, photos, services, hours, reviews — so you turn up in local search and on Maps, and the calls come in.",
        },
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
      /** Questions on this solution page, published as FAQPage data. */
      faqs: [
        {
          q: "Which social media platforms do you manage?",
          a: "Instagram, Facebook, LinkedIn and YouTube: posts, reels, stories and the page itself on Instagram and Facebook, company and founder posts on LinkedIn, and channel setup, thumbnails and titles on YouTube.",
        },
        {
          q: "Do I approve posts before they go out?",
          a: "Yes. Someone owns the content calendar, deciding what goes out and when, and it is approved by you ahead of time.",
        },
        {
          q: "Do you reply to comments and messages?",
          a: "Yes. DMs, comments and reviews are answered quickly and in your voice, and real enquiries are passed on to you instead of being lost in the inbox.",
        },
        {
          q: "Do you run campaigns for festivals and launches?",
          a: "Yes. A push built for a moment, such as a launch, a festival offer or a collaboration, run across your pages with one aim behind it.",
        },
        {
          q: "Do you keep track of what people say about my business?",
          a: "Yes. We watch what is said about you and your category online, so you hear about a complaint or an opening early.",
        },
      ],
      items: [
        {
          name: "Instagram",
          text: "Posts, reels, stories and the page itself — going out on a schedule, not whenever somebody remembers.",
        },
        {
          name: "Facebook",
          text: "The page, the posts and the local reach that still works there — particularly outside the metros.",
        },
        {
          name: "LinkedIn",
          text: "For B2B: the company page and founder posts, the sort of thing a buying committee reads before they take your call.",
        },
        {
          name: "YouTube",
          text: "Channel setup, thumbnails, titles and descriptions, and a posting rhythm that gets your videos shown.",
        },
        {
          name: "Page management",
          text: "Somebody owning the calendar — what goes out and when, approved by you ahead of time.",
        },
        {
          name: "Community management",
          text: "DMs, comments and reviews answered quickly and in your voice, with real enquiries passed to you instead of lost in the inbox.",
        },
        {
          name: "Social listening",
          text: "We watch what is being said about you and your category, so you hear about a complaint or an opening early.",
        },
        {
          name: "Social campaigns",
          text: "A push built for a moment — a launch, a festival offer, a collaboration — run across the pages with one aim behind it.",
        },
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
      /** Questions on this solution page, published as FAQPage data. */
      faqs: [
        {
          q: "Which advertising platforms do you run?",
          a: "Google Ads (search, Performance Max and shopping), Meta Ads on Instagram and Facebook, YouTube Ads, and marketplace ads on Amazon, Flipkart and quick-commerce apps.",
        },
        {
          q: "How do you know whether the ads are working?",
          a: "We track what each customer costs and what comes back, not just clicks and views. Analytics, tag manager and platform pixels are installed and tested so conversions fire properly, and budget is moved every week towards what is bringing in sales.",
        },
        {
          q: "Can you bring in leads, not just online sales?",
          a: "Yes. Form, call and WhatsApp campaigns are set up so you get leads who answer the phone, with junk enquiries filtered out before they reach your team.",
        },
        {
          q: "Do you work on Amazon and Flipkart listings as well as ads?",
          a: "Yes. Sponsored listings on the marketplaces come with work on the listing itself, the title, images and keywords, because that decides whether the click turns into a sale.",
        },
        {
          q: "What is retargeting?",
          a: "Follow-up ads shown to people who already visited your site, viewed a product or left something in their cart. They already know you, which makes them the cheapest sale available.",
        },
      ],
      items: [
        {
          name: "Google Ads",
          text: "Search, Performance Max and shopping campaigns aimed at people already looking for what you sell — built on the keywords worth paying for and the ones worth blocking.",
        },
        {
          name: "Meta Ads",
          text: "Instagram and Facebook campaigns: the audiences, the creative testing, and the budget moved every week towards whatever is bringing in sales.",
        },
        {
          name: "YouTube Ads",
          text: "Video campaigns for reach and for chasing people who already visited — judged on what comes back, not on the view count.",
        },
        {
          name: "Marketplace ads (Amazon, Flipkart, quick-commerce)",
          text: "Sponsored listings on the marketplaces, plus the listing work behind them — title, images, keywords — because that decides whether the click converts.",
        },
        {
          name: "Retargeting",
          text: "Follow-up ads for people who already visited, viewed or left a cart. It is the cheapest sale available to you.",
        },
        {
          name: "Lead generation",
          text: "Form, call and WhatsApp campaigns set up so you get leads that answer the phone — with the junk filtered before it reaches your team.",
        },
        {
          name: "Tracking setup (GA4 / GTM / Pixel)",
          text: "Analytics, tag manager and the platform pixels installed and tested, conversions firing properly, so the numbers you are deciding on are real.",
        },
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
      /** Questions on this solution page, published as FAQPage data. */
      faqs: [
        {
          q: "How do you bring customers back?",
          a: "With messages that arrive at the right moment: welcome flows, offers and win-backs by email, and WhatsApp broadcasts, order updates and reminders, so you don't pay for that customer's click a second time.",
        },
        {
          q: "Why build a customer list of my own?",
          a: "Because a list you own can be reached at almost nothing per message, whenever you need it, instead of paying for ads every time you want to talk to people who have already bought from you.",
        },
        {
          q: "Do you use the official WhatsApp Business API?",
          a: "Yes. Broadcasts and message templates run on the official API, so order updates, offers and reminders land where your customers actually read.",
        },
        {
          q: "Can you set up chatbots for WhatsApp, Instagram and my website?",
          a: "Yes. Chatbots answer the common questions at any hour and hand over to a person when it matters.",
        },
        {
          q: "Can automation connect the tools I already use?",
          a: "Yes. Repeated jobs such as routing leads, follow-up reminders, building reports and moving data between your tools can run on their own. For bigger needs we build custom workflows and AI agents around how your business runs.",
        },
      ],
      items: [
        {
          name: "Email",
          text: "Welcome flows, offers and win-backs — written, scheduled and sent to a list you own, at almost nothing per message.",
        },
        {
          name: "WhatsApp marketing",
          text: "Broadcasts and templates on the official API: order updates, offers and reminders landing where your customer actually reads.",
        },
        {
          name: "Chatbots",
          text: "Automated replies on WhatsApp, Instagram and the site that handle the common questions at any hour, and hand over to a person when it matters.",
        },
        {
          name: "AI automations",
          text: "The small repeated jobs running on their own — leads routed, follow-ups reminded, reports built, data moved between the tools you already pay for. And if what you need is bigger than that, we build that too: custom workflows and AI agents put together around the way your business actually runs.",
        },
      ],
    },
  ],
} as const;
