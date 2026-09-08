/**
 * Single place to edit the things that change often.
 */
export const site = {
  name: "Click Again",
  domain: "clickagain.in",
  url: "https://clickagain.in",

  // Launch target for the countdown. ISO string, IST offset.
  launchDate: "2026-10-15T10:00:00+05:30",

  email: "clickagainofficial@gmail.com",
  phone: "",

  /**
   * Company details used on the Privacy Policy and Terms pages.
   * "Click Again" is the brand; the company behind it is the legal entity.
   */
  legal: {
    entity: "Magizh Digital Marketing Solutions Private Limited",
    cin: "", // TODO: Corporate Identity Number from the incorporation certificate
    address: "3/508, Bharathi Street, Muneswaran Nagar, Iyer Bungalow, Madurai, Tamil Nadu 625014",
    city: "Madurai",
    state: "Tamil Nadu",
    grievanceEmail: "clickagainofficial@gmail.com",
    // Shown as "Last updated" on both pages. Bump it whenever the text changes.
    updated: "8 September 2026",
  },

  socials: [
    { label: "Instagram", href: "https://www.instagram.com/clickagainofficial/" },
    {
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61594184312265",
    },
  ],

  journey: ["Connect", "Click", "Trust", "Return", "Refer"],

  principles: [
    {
      no: "01",
      key: "What we do",
      text: "We don't sell fixed marketing packages. We find what your business **actually needs**.",
    },
    {
      no: "02",
      key: "How we work",
      text: "We understand your **business, goal and audience** first — then choose the right marketing approach, online or offline.",
    },
    {
      no: "03",
      key: "What we mean",
      text: "One click is a sale. **Click again is a business.**",
    },
    {
      no: "04",
      key: "What we believe",
      text: "Anyone can buy attention. We build the reason people **come back**.",
    },
    {
      no: "05",
      key: "Where it leads",
      text: "Connect → Click → Trust → Return → **Refer**.",
    },
  ],
} as const;
