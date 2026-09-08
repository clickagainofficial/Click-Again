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
