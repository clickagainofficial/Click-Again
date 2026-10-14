/**
 * Posts for /insights, newest first. Empty for now — the page shows an
 * "on the way" note until the first one is added here.
 */
export type Insight = {
  slug: string;
  title: string;
  /** One or two lines shown on the card. */
  summary: string;
  /** ISO date, e.g. "2026-10-20". */
  date: string;
  /** Short topic label, e.g. "Google", "WhatsApp", "Websites". */
  tag: string;
};

export const insights: Insight[] = [];
