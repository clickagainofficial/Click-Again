"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  ContributionBar,
  CostRow,
  FatalNote,
  Field,
  NoteList,
  RoasLadder,
  Row,
  VerdictBadge,
} from "./parts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  calcEcommerce,
  count,
  money,
  multiple,
  netMarginAtRoas,
  percent,
  roasLadder,
  type CostUnit,
} from "@/lib/adMetrics";

type Fields = {
  aov: string;
  cogs: string;
  shipping: string;
  gatewayPct: string;
  codFee: string;
  packing: string;
  rtoRate: string;
  rtoCost: string;
  otherCost: string;
  desiredMargin: string;
  adSpend: string;
  revenue: string;
  orders: string;
};

const initial: Fields = {
  aov: "",
  cogs: "",
  shipping: "0",
  gatewayPct: "2",
  codFee: "0",
  packing: "0",
  rtoRate: "0",
  rtoCost: "0",
  otherCost: "0",
  desiredMargin: "30",
  adSpend: "",
  revenue: "",
  orders: "",
};

const num = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const maybe = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : null;
};

export default function EcommerceMode() {
  const [f, setF] = useState<Fields>(initial);
  const [cogsUnit, setCogsUnit] = useState<CostUnit>("percent");
  const [advanced, setAdvanced] = useState(false);

  const set = (key: keyof Fields) => (v: string) =>
    setF((prev) => ({ ...prev, [key]: v }));

  const r = useMemo(
    () =>
      calcEcommerce({
        aov: num(f.aov),
        cogs: num(f.cogs),
        cogsUnit,
        shipping: num(f.shipping),
        gatewayPct: num(f.gatewayPct),
        codFee: num(f.codFee),
        packing: num(f.packing),
        rtoRate: num(f.rtoRate),
        rtoCost: num(f.rtoCost),
        otherCost: num(f.otherCost),
        desiredMargin: num(f.desiredMargin),
        adSpend: maybe(f.adSpend),
        revenue: maybe(f.revenue),
        orders: maybe(f.orders),
      }),
    [f, cogsUnit]
  );

  const ready = num(f.aov) > 0 && num(f.cogs) > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* ------------------------------------------------------------ inputs */}
      <div className="grid gap-4 self-start">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order economics</CardTitle>
            <CardDescription>
              Per-order variable costs only. Rent, salaries and subscriptions
              are fixed costs — they belong in the monthly P&amp;L, not here.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field
              id="e-aov"
              label="Average Order Value (AOV)"
              value={f.aov}
              onChange={set("aov")}
              suffix="₹"
              placeholder="2499"
              hint="GST illama, sarasari order value"
            />
            <Field
              id="e-cogs"
              label="Product cost (COGS)"
              value={f.cogs}
              onChange={set("cogs")}
              suffix={cogsUnit === "rupees" ? "₹" : "%"}
              unit={cogsUnit}
              onUnitChange={setCogsUnit}
              placeholder={cogsUnit === "percent" ? "40" : "1000"}
              hint="Per order. ₹ illa % of AOV"
            />
            <Field
              id="e-shipping"
              label="Shipping cost"
              value={f.shipping}
              onChange={set("shipping")}
              suffix="₹"
              hint="Business kattraa podunga. Customer kattraa 0"
            />
            <Field
              id="e-gateway"
              label="Payment gateway"
              value={f.gatewayPct}
              onChange={set("gatewayPct")}
              suffix="%"
              hint="Razorpay / PayU ~2%. COD nnaa 0"
            />
          </CardContent>
        </Card>

        <Collapsible open={advanced} onOpenChange={setAdvanced}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="flex-row items-center justify-between">
                <div className="text-left">
                  <CardTitle className="text-base">Advanced costs</CardTitle>
                  <CardDescription>
                    RTO, COD, packing — India-la idhu dhaan margin-a saapdum
                  </CardDescription>
                </div>
                <ChevronDown
                  className={`size-4 shrink-0 transition-transform ${advanced ? "rotate-180" : ""}`}
                />
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="grid gap-4">
                <Field
                  id="e-cod"
                  label="COD handling fee"
                  value={f.codFee}
                  onChange={set("codFee")}
                  suffix="₹"
                  hint="COD orders-ku courier charge"
                />
                <Field
                  id="e-packing"
                  label="Packing material"
                  value={f.packing}
                  onChange={set("packing")}
                  suffix="₹"
                  hint="Box, tape, filler, label"
                />
                <Field
                  id="e-rto-rate"
                  label="RTO / Return rate"
                  value={f.rtoRate}
                  onChange={set("rtoRate")}
                  suffix="%"
                  hint="Prepaid 2–5% · COD 20–35%"
                />
                <Field
                  id="e-rto-cost"
                  label="Loss per return"
                  value={f.rtoCost}
                  onChange={set("rtoCost")}
                  suffix="₹"
                  hint="Forward + reverse shipping loss"
                />
                <Field
                  id="e-other"
                  label="Other per-order cost"
                  value={f.otherCost}
                  onChange={set("otherCost")}
                  suffix="₹"
                  hint="Insert card, gift wrap, etc"
                />
                <Field
                  id="e-margin"
                  label="Desired profit margin"
                  value={f.desiredMargin}
                  onChange={set("desiredMargin")}
                  suffix="%"
                  hint="Target ROAS kanakku-ku. Default 30%"
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actual numbers</CardTitle>
            <CardDescription>
              Meta dashboard-la irundhu. Optional — targets mattum venum-naa
              vittudunga.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <Field
              id="e-spend"
              label="Ad spend"
              value={f.adSpend}
              onChange={set("adSpend")}
              suffix="₹"
              placeholder="45000"
            />
            <Field
              id="e-revenue"
              label="Revenue from ads"
              value={f.revenue}
              onChange={set("revenue")}
              suffix="₹"
              placeholder="187000"
            />
            <Field
              id="e-orders"
              label="Orders"
              value={f.orders}
              onChange={set("orders")}
              placeholder="75"
            />
          </CardContent>
        </Card>
      </div>

      {/* ----------------------------------------------------------- results */}
      <div className="grid gap-4 self-start lg:sticky lg:top-20">
        {!ready ? (
          <Card>
            <CardContent className="text-muted-foreground py-10 text-center text-sm">
              AOV-um product cost-um podunga — kanakku udane varum.
            </CardContent>
          </Card>
        ) : r.fatal ? (
          <FatalNote message={r.fatal} />
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contribution margin</CardTitle>
                <CardDescription>
                  Oru order-la ad-ku kharchu panna kidaikura pandam
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div>
                  <p className="font-display text-3xl font-bold tabular-nums">
                    {money(r.contribution, true)}
                    <span className="text-muted-foreground ml-2 text-base font-medium">
                      {percent(r.contributionPct)}
                    </span>
                  </p>
                </div>

                <ContributionBar
                  total={num(f.aov)}
                  costs={r.costLines}
                  contribution={r.contribution}
                />

                <Separator />

                <div>
                  <Row label="Order value" value={money(num(f.aov), true)} strong />
                  {r.costLines
                    .filter((l) => l.value > 0)
                    .map((l) => (
                      <CostRow key={l.label} label={l.label} value={l.value} />
                    ))}
                  <Separator className="my-2" />
                  <Row
                    label="Contribution"
                    value={money(r.contribution, true)}
                    strong
                    tone="primary"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Targets</CardTitle>
                <CardDescription>
                  Indha numbers-a dhaan Ad Manager-la paakanum
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <Row
                    label="Break-even ROAS"
                    value={multiple(r.breakevenRoas)}
                    hint="profit 0% — sari-samam"
                    strong
                    tone="primary"
                  />
                  <Row
                    label="Target ROAS"
                    value={multiple(r.targetRoas)}
                    hint={`profit ${percent(netMarginAtRoas(r.contributionPct, r.targetRoas))} of revenue`}
                    strong
                  />
                  <Separator className="my-2" />
                  <Row
                    label="Max CPA"
                    value={money(r.maxCpa, true)}
                    hint="idhukku mela nashtam"
                  />
                  <Row label="Target CPA" value={money(r.targetCpa, true)} />
                </div>

                <Separator />

                <RoasLadder
                  rows={roasLadder(r.contributionPct, r.breakevenRoas)}
                  breakeven={r.breakevenRoas}
                  target={r.targetRoas}
                />
              </CardContent>
            </Card>

            {r.actual ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Actual performance</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <VerdictBadge verdict={r.actual.verdict} />

                  <div>
                    <Row label="ROAS" value={multiple(r.actual.roas)} strong />
                    <Row label="CPA" value={money(r.actual.cpa)} />
                    <Row label="Actual AOV" value={money(r.actual.aov)} />
                    <Separator className="my-2" />
                    <Row label="Gross profit" value={money(r.actual.grossProfit)} />
                    <Row
                      label="Net profit"
                      value={money(r.actual.netProfit)}
                      strong
                      tone={r.actual.netProfit < 0 ? "primary" : undefined}
                    />
                    <Row
                      label="Profit margin"
                      value={percent(r.actual.profitMarginPct)}
                      tone="muted"
                    />
                  </div>

                  {r.actual.gap ? (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="mb-2 text-sm font-medium">Gap analysis</p>
                      <Row
                        label="ROAS short by"
                        value={multiple(r.actual.gap.roasGap)}
                      />
                      <Row
                        label="Revenue needed"
                        value={money(r.actual.gap.revenueNeeded)}
                      />
                      <Row
                        label="Revenue short by"
                        value={money(r.actual.gap.revenueShort)}
                      />
                      <Row
                        label="Orders needed"
                        value={count(r.actual.gap.ordersNeeded)}
                      />
                      <Row
                        label="Max spend that was OK"
                        value={money(r.actual.gap.maxSpendOk)}
                      />
                      <Row
                        label="Overspent by"
                        value={money(r.actual.gap.overspentBy)}
                        strong
                        tone="primary"
                      />
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}
          </>
        )}

        <NoteList notes={r.notes} />
      </div>
    </div>
  );
}
