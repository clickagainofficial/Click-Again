import { calcEcommerce, calcService, netMarginAtRoas } from "../lib/adMetrics.ts";

let failures = 0;
const near = (label: string, got: number, want: number, tol = 0.02) => {
  const ok = Math.abs(got - want) <= Math.abs(want) * tol + 0.01;
  if (!ok) failures++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${label.padEnd(22)} ${got.toFixed(2)} / ${want}`);
};
const is = (label: string, got: unknown, want: unknown) => {
  const ok = got === want;
  if (!ok) failures++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${label.padEnd(22)} ${String(got)} / ${String(want)}`);
};

const ecom = (o: Partial<Parameters<typeof calcEcommerce>[0]>) =>
  calcEcommerce({
    aov: 0, cogs: 0, cogsUnit: "rupees", shipping: 0, gatewayPct: 0, codFee: 0,
    packing: 0, rtoRate: 0, rtoCost: 0, otherCost: 0, desiredMargin: 30,
    adSpend: null, revenue: null, orders: null, ...o,
  });

const svc = (o: Partial<Parameters<typeof calcService>[0]>) =>
  calcService({
    dealValue: 0, delivery: 0, deliveryUnit: "rupees", salesCost: 0, gatewayPct: 0,
    months: 1, recurring: false, funnelMode: "funnel", leadToQualified: 40,
    qualifiedToMeeting: 50, meetingToDeal: 25, leadToCustomer: 5, adSpend: null,
    leads: null, deals: null, closedRevenue: null, desiredMargin: 30, ...o,
  });

console.log("\nspec 4.1 — ecommerce healthy");
{
  const r = ecom({ aov: 2499, cogs: 40, cogsUnit: "percent", shipping: 80, gatewayPct: 2,
    packing: 25, rtoRate: 12, rtoCost: 180, adSpend: 45000, revenue: 187000, orders: 75 });
  near("contribution", r.contribution, 1322.82);
  near("breakeven", r.breakevenRoas, 1.89);
  near("target ROAS", r.targetRoas, 2.70);
  near("net profit", r.actual!.netProfit, 53786.5);
  is("verdict", r.actual!.verdict, "healthy");
}

console.log("\nspec 4.2 — thin margin trap");
{
  const r = ecom({ aov: 4000, cogs: 70, cogsUnit: "percent", shipping: 300, gatewayPct: 2,
    packing: 50, rtoRate: 25, rtoCost: 800, adSpend: 10000, revenue: 40000, orders: 10 });
  near("contribution", r.contribution, 570);
  near("breakeven", r.breakevenRoas, 7.02);
  near("net profit", r.actual!.netProfit, -4300);
  is("verdict", r.actual!.verdict, "loss");
}

console.log("\nspec 4.3 — agency retainer");
{
  const r = svc({ dealValue: 25000, delivery: 10000, salesCost: 5000, months: 12,
    recurring: true, leadToQualified: 35, qualifiedToMeeting: 45, meetingToDeal: 30,
    adSpend: 60000, leads: 95, deals: 4, closedRevenue: 100000 });
  near("contribution", r.contribution, 175000);
  near("close rate %", r.closeRate * 100, 4.725);
  near("max CPL", r.maxCpl, 8268.75);
  near("payback months", r.cashFlow!.paybackMonths, 1);
  is("verdict", r.actual!.verdict, "healthy");
}

console.log("\nspec 4.4 — cheap CPL, junk leads");
{
  const r = svc({ dealValue: 80000, delivery: 45000, salesCost: 3000, funnelMode: "simple",
    leadToCustomer: 8, adSpend: 40000, leads: 160, deals: 3, closedRevenue: 240000 });
  near("max CPL", r.maxCpl, 2560);
  near("net profit", r.actual!.netProfit, 56000);
  is("close-rate warning", r.notes.some((n) => n.text.includes("Close rate assume")), true);
}

console.log("\nROAS → profit ladder");
{
  const r = ecom({ aov: 500, cogs: 280, shipping: 40, gatewayPct: 2 });
  near("contribution %", r.contributionPct, 34);
  near("margin at breakeven", netMarginAtRoas(r.contributionPct, r.breakevenRoas), 0);
  near("margin at target", netMarginAtRoas(r.contributionPct, r.targetRoas), 10.2);
  near("margin at 5x", netMarginAtRoas(r.contributionPct, 5), 14);
}

console.log("\nfix: zero-cost product (digital) still calculates");
{
  const r = ecom({ aov: 2000, cogs: 0, gatewayPct: 2 });
  is("no fatal", r.fatal, null);
  near("contribution", r.contribution, 1960);
  near("breakeven", r.breakevenRoas, 1.02);
}

console.log("\nfix: percentage over 100 is rejected");
{
  const a = ecom({ aov: 1000, cogs: 20, gatewayPct: 120 });
  is("ecom gateway 120%", a.fatal !== null, true);
  const b = ecom({ aov: 1000, cogs: 150, cogsUnit: "percent" });
  is("ecom COGS 150%", b.fatal !== null, true);
  const c = svc({ dealValue: 50000, delivery: 20000, meetingToDeal: 130 });
  is("service stage 130%", c.fatal !== null, true);
  const d = ecom({ aov: 1000, cogs: 300, rtoRate: 40 });
  is("rto 40% is fine", d.fatal, null);
}

console.log("\nfix: blank deals does not trigger the close-rate warning");
{
  const blank = svc({ dealValue: 80000, delivery: 45000, funnelMode: "simple",
    leadToCustomer: 8, adSpend: 40000, leads: 160, deals: null });
  is("blank -> no warning", blank.notes.some((n) => n.text.includes("Close rate assume")), false);

  const zero = svc({ dealValue: 80000, delivery: 45000, funnelMode: "simple",
    leadToCustomer: 8, adSpend: 40000, leads: 160, deals: 0 });
  is("zero -> warns", zero.notes.some((n) => n.text.includes("Close rate assume")), true);
}

console.log("\nguards: nothing throws on empty or silly input");
{
  const empty = ecom({});
  is("empty ecom has fatal", empty.fatal !== null, true);
  const emptySvc = svc({});
  is("empty service has fatal", emptySvc.fatal !== null, true);
  const zeroClose = svc({ dealValue: 50000, delivery: 10000, funnelMode: "simple", leadToCustomer: 0 });
  is("close rate 0 has fatal", zeroClose.fatal !== null, true);
  const fullMargin = ecom({ aov: 1000, cogs: 400, desiredMargin: 100 });
  is("100% desired margin safe", Number.isFinite(fullMargin.targetRoas), false);
}

console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : failures + " CHECK(S) FAILED"}`);
process.exit(failures === 0 ? 0 : 1);
