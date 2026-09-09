/**
 * Ad metrics calculator — the maths only, no React.
 *
 * Two modes answer the same question from different data:
 *   Ecommerce — money lands on the website, so ROAS is measurable.
 *   Service   — a lead lands, the deal closes later, so the funnel decides
 *               what a lead is allowed to cost.
 *
 * Only VARIABLE costs belong here. Rent, salaries and subscriptions are fixed
 * costs; folding them in would make break-even ROAS — a per-order number —
 * wrong. Those belong in a monthly P&L instead.
 */

export type CostUnit = "rupees" | "percent";

export type Severity = "info" | "warning" | "error";
export type Note = { severity: Severity; text: string };

export type Verdict = "healthy" | "thin" | "loss";

/* ------------------------------------------------------------------ format */

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrPrecise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function money(value: number, precise = false) {
  if (!Number.isFinite(value)) return "—";
  return precise ? inrPrecise.format(value) : inr.format(value);
}

export function multiple(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "—";
  return `${value.toFixed(2)}x`;
}

export function percent(value: number, digits = 1) {
  if (!Number.isFinite(value)) return "—";
  return `${value.toFixed(digits)}%`;
}

export function count(value: number) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(value);
}

/* --------------------------------------------------------------- ecommerce */

export type EcomInput = {
  aov: number; // E1
  cogs: number; // E2
  cogsUnit: CostUnit;
  shipping: number; // E3
  gatewayPct: number; // E4
  codFee: number; // E5
  packing: number; // E6
  rtoRate: number; // E7  %
  rtoCost: number; // E8  ₹ per return
  otherCost: number; // E9
  desiredMargin: number; // E10 %
  adSpend: number | null; // E11
  revenue: number | null; // E12
  orders: number | null; // E13
};

export type CostLine = { label: string; value: number };

export type EcomResult = {
  costLines: CostLine[];
  totalVariableCost: number;
  contribution: number;
  contributionPct: number;
  breakevenRoas: number;
  targetRoas: number;
  maxCpa: number;
  targetCpa: number;
  actual: null | {
    roas: number;
    cpa: number;
    aov: number;
    grossProfit: number;
    netProfit: number;
    profitMarginPct: number;
    verdict: Verdict;
    gap: null | {
      roasGap: number;
      revenueNeeded: number;
      revenueShort: number;
      ordersNeeded: number;
      ordersShort: number;
      maxSpendOk: number;
      overspentBy: number;
    };
  };
  notes: Note[];
  fatal: string | null;
};

export function calcEcommerce(input: EcomInput): EcomResult {
  const notes: Note[] = [];

  const aov = input.aov;

  // Step 1 — a percentage COGS is a share of AOV
  const cogs =
    input.cogsUnit === "percent" ? aov * (input.cogs / 100) : input.cogs;

  // Step 2
  const gateway = aov * (input.gatewayPct / 100);

  // Step 3 — spread the cost of returns across every order, not just the
  // ones that come back
  const rtoLoss = (input.rtoRate / 100) * input.rtoCost;

  const costLines: CostLine[] = [
    { label: "Product cost", value: cogs },
    { label: "Shipping", value: input.shipping },
    { label: "Payment gateway", value: gateway },
    { label: "COD handling", value: input.codFee },
    { label: "Packing", value: input.packing },
    { label: "RTO loss", value: rtoLoss },
    { label: "Other", value: input.otherCost },
  ];

  // Step 4
  const totalVariableCost = costLines.reduce((sum, l) => sum + l.value, 0);

  // Step 5
  const contribution = aov - totalVariableCost;
  const contributionPct = aov > 0 ? (contribution / aov) * 100 : 0;

  /* validation (§5) */
  let fatal: string | null = null;

  if (!(aov > 0)) {
    fatal = "Order value 0-ku mela irukkanum.";
  } else if (cogs >= aov) {
    fatal = "Product cost, selling price-a vida adhigam. Check pannunga.";
  } else if (contribution <= 0) {
    fatal = "Ad illamale nashtam. Pricing / cost correct pannunga.";
  }

  if (!fatal && contributionPct < 10) {
    notes.push({
      severity: "warning",
      text: "Margin romba thin (10%-ku keezha). Chinna miss-um nashtam aakidum.",
    });
  }
  if (input.rtoRate > 50) {
    notes.push({
      severity: "warning",
      text: "RTO rate 50%-ku mela irukku. Confirm pannunga.",
    });
  }

  // Steps 6-8 — writing break-even as AOV ÷ contribution instead of
  // 1 ÷ margin% keeps it safe when the margin rounds to zero
  const breakevenRoas = contribution > 0 ? aov / contribution : Infinity;
  const marginShare = 1 - input.desiredMargin / 100;
  const targetRoas = marginShare > 0 ? breakevenRoas / marginShare : Infinity;
  const maxCpa = contribution;
  const targetCpa = contribution * marginShare;

  if (Number.isFinite(breakevenRoas) && breakevenRoas > 10) {
    notes.push({
      severity: "warning",
      text: "Break-even 10x-ku mela. Indha business paid ads-ku suit aagumaa nu yosinga.",
    });
  }

  /* Step 9-11 — actuals */
  let actual: EcomResult["actual"] = null;

  const spend = input.adSpend ?? 0;
  const revenue = input.revenue ?? 0;
  const orders = input.orders ?? 0;

  if (spend > 0 && revenue > 0 && orders > 0 && !fatal) {
    const roas = revenue / spend;
    const cpa = spend / orders;
    const grossProfit = revenue - totalVariableCost * orders;
    const netProfit = grossProfit - spend;

    const verdict: Verdict =
      roas >= targetRoas ? "healthy" : roas >= breakevenRoas ? "thin" : "loss";

    const gap =
      verdict === "loss"
        ? {
            roasGap: breakevenRoas - roas,
            revenueNeeded: spend * breakevenRoas,
            revenueShort: spend * breakevenRoas - revenue,
            ordersNeeded: (spend * breakevenRoas) / aov,
            ordersShort: (spend * breakevenRoas) / aov - orders,
            maxSpendOk: revenue / breakevenRoas,
            overspentBy: spend - revenue / breakevenRoas,
          }
        : null;

    actual = {
      roas,
      cpa,
      aov: revenue / orders,
      grossProfit,
      netProfit,
      profitMarginPct: (netProfit / revenue) * 100,
      verdict,
      gap,
    };
  }

  return {
    costLines,
    totalVariableCost,
    contribution,
    contributionPct,
    breakevenRoas,
    targetRoas,
    maxCpa,
    targetCpa,
    actual,
    notes,
    fatal,
  };
}

/* ----------------------------------------------------------------- service */

export type ServiceInput = {
  dealValue: number; // S1
  delivery: number; // S2
  deliveryUnit: CostUnit;
  salesCost: number; // S3
  gatewayPct: number; // S4
  months: number; // S5
  recurring: boolean; // S6

  funnelMode: "funnel" | "simple";
  leadToQualified: number; // S7 %
  qualifiedToMeeting: number; // S8 %
  meetingToDeal: number; // S9 %
  leadToCustomer: number; // S10 %

  adSpend: number | null; // S11
  leads: number | null; // S12
  deals: number | null; // S13
  closedRevenue: number | null; // S14
  desiredMargin: number; // S15 %
};

export type ServiceResult = {
  effectiveDealValue: number;
  deliveryPerPeriod: number;
  totalDeliveryCost: number;
  gatewayFee: number;
  costLines: CostLine[];
  contribution: number;
  contributionPct: number;
  closeRate: number; // 0-1
  leadsPerDeal: number;
  maxCac: number;
  targetCac: number;
  maxCpl: number;
  targetCpl: number;
  maxCpql: number | null;
  maxCostPerMeeting: number | null;
  breakevenRoas: number;
  targetRoas: number;
  actual: null | {
    cpl: number;
    cac: number;
    closeRatePct: number;
    roas: number;
    dealValue: number;
    netProfit: number;
    verdict: Verdict;
  };
  cashFlow: null | {
    monthOneRevenue: number;
    paybackMonths: number;
    ltv: number;
  };
  notes: Note[];
  fatal: string | null;
};

export function calcService(input: ServiceInput): ServiceResult {
  const notes: Note[] = [];

  const months = input.recurring ? Math.max(1, input.months) : 1;

  // Step 1 — a percentage delivery cost is a share of one period's deal value
  const deliveryPerPeriod =
    input.deliveryUnit === "percent"
      ? input.dealValue * (input.delivery / 100)
      : input.delivery;

  // Step 2 — a retainer is worth the whole contract, not one month
  const effectiveDealValue = input.dealValue * months;

  // Step 3
  const gatewayFee = effectiveDealValue * (input.gatewayPct / 100);
  const totalDeliveryCost = deliveryPerPeriod * months;

  const costLines: CostLine[] = [
    { label: "Delivery cost", value: totalDeliveryCost },
    { label: "Sales cost", value: input.salesCost },
    { label: "Payment gateway", value: gatewayFee },
  ];

  const contribution = effectiveDealValue - costLines.reduce((s, l) => s + l.value, 0);
  const contributionPct =
    effectiveDealValue > 0 ? (contribution / effectiveDealValue) * 100 : 0;

  // Step 4 — the funnel multiplies out to one number
  const closeRate =
    input.funnelMode === "simple"
      ? input.leadToCustomer / 100
      : (input.leadToQualified / 100) *
        (input.qualifiedToMeeting / 100) *
        (input.meetingToDeal / 100);

  /* validation (§5) */
  let fatal: string | null = null;

  if (!(input.dealValue > 0)) {
    fatal = "Deal value 0-ku mela irukkanum.";
  } else if (deliveryPerPeriod >= input.dealValue && !input.recurring) {
    fatal = "Delivery cost, deal value-a vida adhigam. Check pannunga.";
  } else if (contribution <= 0) {
    fatal = "Ad illamale nashtam. Pricing / delivery cost correct pannunga.";
  } else if (!(closeRate > 0)) {
    fatal = "Close rate 0 vechaa infinite leads venum. Value kudunga.";
  }

  if (!fatal && contributionPct < 10) {
    notes.push({
      severity: "warning",
      text: "Margin romba thin (10%-ku keezha). Chinna miss-um nashtam aakidum.",
    });
  }
  if (closeRate > 0.5) {
    notes.push({
      severity: "warning",
      text: "Close rate 50%-ku mela — romba adhigam. Realistic-aa nu paarunga.",
    });
  }

  const marginShare = 1 - input.desiredMargin / 100;

  // Steps 5-6 — CPL is the number the Ad Manager can actually see
  const maxCac = contribution;
  const targetCac = contribution * marginShare;
  const maxCpl = maxCac * closeRate;
  const targetCpl = targetCac * closeRate;

  // Step 7 — stage costs, for CRM tracking
  const maxCpql =
    input.funnelMode === "funnel"
      ? maxCac * (input.qualifiedToMeeting / 100) * (input.meetingToDeal / 100)
      : null;
  const maxCostPerMeeting =
    input.funnelMode === "funnel" ? maxCac * (input.meetingToDeal / 100) : null;

  // Step 8
  const breakevenRoas =
    contribution > 0 ? effectiveDealValue / contribution : Infinity;
  const targetRoas = marginShare > 0 ? breakevenRoas / marginShare : Infinity;

  if (Number.isFinite(breakevenRoas) && breakevenRoas > 10) {
    notes.push({
      severity: "warning",
      text: "Break-even 10x-ku mela. Indha business paid ads-ku suit aagumaa nu yosinga.",
    });
  }

  // Step 9
  const leadsPerDeal = closeRate > 0 ? 1 / closeRate : Infinity;

  /* Step 10-11 — actuals */
  let actual: ServiceResult["actual"] = null;

  const spend = input.adSpend ?? 0;
  const leads = input.leads ?? 0;
  const deals = input.deals ?? 0;
  const closedRevenue = input.closedRevenue ?? 0;

  if (spend > 0 && leads > 0 && !fatal) {
    const cpl = spend / leads;
    const cac = deals > 0 ? spend / deals : Infinity;
    const closeRatePct = (deals / leads) * 100;

    // one period's delivery, because closed revenue is for one period too
    const deliveryTotal = deliveryPerPeriod * deals;
    const netProfit =
      closedRevenue - deliveryTotal - input.salesCost * deals - spend;

    const verdict: Verdict =
      cpl <= targetCpl ? "healthy" : cpl <= maxCpl ? "thin" : "loss";

    actual = {
      cpl,
      cac,
      closeRatePct,
      roas: closedRevenue > 0 ? closedRevenue / spend : NaN,
      dealValue: deals > 0 ? closedRevenue / deals : NaN,
      netProfit,
      verdict,
    };

    // the trap this calculator exists to catch: cheap leads that never close
    const assumedPct = closeRate * 100;
    if (deals >= 0 && closeRatePct < assumedPct * 0.7) {
      const shortfall = ((assumedPct - closeRatePct) / assumedPct) * 100;
      notes.push({
        severity: "warning",
        text:
          `Close rate assume pannadha vida ${shortfall.toFixed(0)}% kammi ` +
          `(${closeRatePct.toFixed(2)}% vs ${assumedPct.toFixed(2)}%). ` +
          "Lead quality illa sales process problem — CPL nallaa irundhaalum deal varaadhu. " +
          "Fix: qualifying questions serunga, instant form-ku badhila landing page, " +
          "Conversion Leads objective try pannunga.",
      });
    }
  }

  /* Step 12 — a retainer's LTV is not cash in hand */
  let cashFlow: ServiceResult["cashFlow"] = null;

  if (input.recurring && months > 1 && !fatal) {
    const perPeriodContribution = input.dealValue - deliveryPerPeriod;
    const cac = actual && Number.isFinite(actual.cac) ? actual.cac : maxCac;
    cashFlow = {
      monthOneRevenue: input.dealValue,
      ltv: effectiveDealValue,
      paybackMonths:
        perPeriodContribution > 0 ? Math.ceil(cac / perPeriodContribution) : Infinity,
    };
  }

  return {
    effectiveDealValue,
    deliveryPerPeriod,
    totalDeliveryCost,
    gatewayFee,
    costLines,
    contribution,
    contributionPct,
    closeRate,
    leadsPerDeal,
    maxCac,
    targetCac,
    maxCpl,
    targetCpl,
    maxCpql,
    maxCostPerMeeting,
    breakevenRoas,
    targetRoas,
    actual,
    cashFlow,
    notes,
    fatal,
  };
}

/* -------------------------------------------------------------- benchmarks */

export const categoryBenchmarks = [
  { category: "Fashion / apparel", margin: "55–65%", roas: "1.6–1.8x" },
  { category: "Beauty / skincare", margin: "60–70%", roas: "1.5–1.7x" },
  { category: "Electronics", margin: "12–20%", roas: "5–8x" },
  { category: "Imitation jewellery", margin: "50–60%", roas: "1.7–2x" },
  { category: "FMCG / grocery", margin: "15–25%", roas: "4–6x" },
  { category: "Handmade / D2C", margin: "65–75%", roas: "1.3–1.5x" },
  { category: "Digital course", margin: "90–95%", roas: "1.05–1.1x" },
  { category: "Agency / services", margin: "40–60%", roas: "1.7–2.5x" },
  { category: "Consulting", margin: "60–80%", roas: "1.25–1.7x" },
];

export const metaBenchmarks = [
  { metric: "CPM", range: "₹40 – ₹200", note: "Niche, season, audience paatthu" },
  { metric: "CTR (link)", range: "0.8% – 2.5%", note: "1%+ decent" },
  { metric: "CPC", range: "₹3 – ₹25", note: "" },
  { metric: "Landing page load", range: "70% – 85%", note: "Idhukku keezha = site slow" },
];

export const funnelBenchmarks = [
  { stage: "Lead → Qualified", range: "25–50%" },
  { stage: "Qualified → Meeting", range: "40–60%" },
  { stage: "Meeting → Deal", range: "20–35%" },
  { stage: "Overall lead → customer", range: "3–10%" },
];

export const rtoBenchmarks = [
  { payment: "Prepaid", rate: "2–5%" },
  { payment: "COD", rate: "20–35%" },
];
