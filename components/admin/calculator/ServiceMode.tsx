"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Wallet } from "lucide-react";

import {
  ContributionBar,
  CostRow,
  FatalNote,
  Field,
  NoteList,
  Row,
  VerdictBadge,
} from "./parts";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  calcService,
  count,
  money,
  multiple,
  netMarginAtRoas,
  percent,
  type CostUnit,
} from "@/lib/adMetrics";

type Fields = {
  dealValue: string;
  delivery: string;
  salesCost: string;
  gatewayPct: string;
  months: string;
  leadToQualified: string;
  qualifiedToMeeting: string;
  meetingToDeal: string;
  leadToCustomer: string;
  adSpend: string;
  leads: string;
  deals: string;
  closedRevenue: string;
  desiredMargin: string;
};

const initial: Fields = {
  dealValue: "",
  delivery: "",
  salesCost: "0",
  gatewayPct: "0",
  months: "1",
  leadToQualified: "40",
  qualifiedToMeeting: "50",
  meetingToDeal: "25",
  leadToCustomer: "5",
  adSpend: "",
  leads: "",
  deals: "",
  closedRevenue: "",
  desiredMargin: "30",
};

// a stray minus sign would inflate the margin, so costs floor at zero
const num = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
};
const maybe = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? Math.max(0, n) : null;
};

export default function ServiceMode() {
  const [f, setF] = useState<Fields>(initial);
  const [deliveryUnit, setDeliveryUnit] = useState<CostUnit>("rupees");
  const [recurring, setRecurring] = useState(false);
  const [funnelMode, setFunnelMode] = useState<"funnel" | "simple">("funnel");
  const [advanced, setAdvanced] = useState(false);

  const set = (key: keyof Fields) => (v: string) =>
    setF((prev) => ({ ...prev, [key]: v }));

  const r = useMemo(
    () =>
      calcService({
        dealValue: num(f.dealValue),
        delivery: num(f.delivery),
        deliveryUnit,
        salesCost: num(f.salesCost),
        gatewayPct: num(f.gatewayPct),
        months: num(f.months),
        recurring,
        funnelMode,
        leadToQualified: num(f.leadToQualified),
        qualifiedToMeeting: num(f.qualifiedToMeeting),
        meetingToDeal: num(f.meetingToDeal),
        leadToCustomer: num(f.leadToCustomer),
        adSpend: maybe(f.adSpend),
        leads: maybe(f.leads),
        deals: maybe(f.deals),
        closedRevenue: maybe(f.closedRevenue),
        desiredMargin: num(f.desiredMargin),
      }),
    [f, deliveryUnit, recurring, funnelMode]
  );

  const ready = num(f.dealValue) > 0 && f.delivery.trim() !== "";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* ------------------------------------------------------------ inputs */}
      <div className="grid gap-4 self-start">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Deal economics</CardTitle>
            <CardDescription>
              Oru client-la irundhu varra revenue-um, adha deliver panna aagra
              cost-um.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field
              id="s-deal"
              label={recurring ? "Deal value per month" : "Average deal value"}
              value={f.dealValue}
              onChange={set("dealValue")}
              suffix="₹"
              placeholder="25000"
            />
            <Field
              id="s-delivery"
              label={recurring ? "Delivery cost per month" : "Delivery cost"}
              value={f.delivery}
              onChange={set("delivery")}
              suffix={deliveryUnit === "rupees" ? "₹" : "%"}
              unit={deliveryUnit}
              onUnitChange={setDeliveryUnit}
              placeholder="10000"
              hint="Team hours, tools, subcontract"
            />

            <div className="border-input flex items-center justify-between rounded-md border px-3 py-2.5">
              <div>
                <Label htmlFor="s-recurring" className="text-xs font-medium">
                  Recurring / retainer?
                </Label>
                <p className="text-muted-foreground text-[11px]">
                  Contract full value-a kanakku pannum
                </p>
              </div>
              <Switch
                id="s-recurring"
                checked={recurring}
                onCheckedChange={setRecurring}
              />
            </div>

            {recurring ? (
              <Field
                id="s-months"
                label="Contract length"
                value={f.months}
                onChange={set("months")}
                suffix=""
                hint="Ethana maasam"
              />
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Funnel</CardTitle>
            <CardDescription>
              Lead-la irundhu deal varaikkum evlo per thaakku pidippaanga
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Tabs
              value={funnelMode}
              onValueChange={(v) => setFunnelMode(v as "funnel" | "simple")}
            >
              <TabsList className="w-full">
                <TabsTrigger value="funnel" className="flex-1">
                  Stage by stage
                </TabsTrigger>
                <TabsTrigger value="simple" className="flex-1">
                  Overall close rate
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {funnelMode === "funnel" ? (
              <>
                <Field
                  id="s-lq"
                  label="Lead → Qualified"
                  value={f.leadToQualified}
                  onChange={set("leadToQualified")}
                  suffix="%"
                  hint="Typical 25–50%"
                />
                <Field
                  id="s-qm"
                  label="Qualified → Meeting"
                  value={f.qualifiedToMeeting}
                  onChange={set("qualifiedToMeeting")}
                  suffix="%"
                  hint="Typical 40–60%"
                />
                <Field
                  id="s-md"
                  label="Meeting → Deal"
                  value={f.meetingToDeal}
                  onChange={set("meetingToDeal")}
                  suffix="%"
                  hint="Typical 20–35%"
                />
              </>
            ) : (
              <Field
                id="s-lc"
                label="Lead → Customer"
                value={f.leadToCustomer}
                onChange={set("leadToCustomer")}
                suffix="%"
                hint="Overall close rate. Typical 3–10%"
              />
            )}
          </CardContent>
        </Card>

        <Collapsible open={advanced} onOpenChange={setAdvanced}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="flex-row items-center justify-between">
                <div className="text-left">
                  <CardTitle className="text-base">Advanced</CardTitle>
                  <CardDescription>Sales cost, gateway, margin</CardDescription>
                </div>
                <ChevronDown
                  className={`size-4 shrink-0 transition-transform ${advanced ? "rotate-180" : ""}`}
                />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="grid gap-4">
                <Field
                  id="s-sales"
                  label="Sales cost per deal"
                  value={f.salesCost}
                  onChange={set("salesCost")}
                  suffix="₹"
                  hint="Commission, travel"
                />
                <Field
                  id="s-gateway"
                  label="Payment gateway"
                  value={f.gatewayPct}
                  onChange={set("gatewayPct")}
                  suffix="%"
                  hint="Bank transfer nnaa 0"
                />
                <Field
                  id="s-margin"
                  label="Desired profit margin"
                  value={f.desiredMargin}
                  onChange={set("desiredMargin")}
                  suffix="%"
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actual numbers</CardTitle>
            <CardDescription>
              Spend-um leads-um Meta-la irundhu, deals-um revenue-um CRM-la
              irundhu.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field
              id="s-spend"
              label="Ad spend"
              value={f.adSpend}
              onChange={set("adSpend")}
              suffix="₹"
              placeholder="60000"
            />
            <Field
              id="s-leads"
              label="Leads generated"
              value={f.leads}
              onChange={set("leads")}
              placeholder="95"
            />
            <Field
              id="s-deals"
              label="Deals closed"
              value={f.deals}
              onChange={set("deals")}
              placeholder="4"
            />
            <Field
              id="s-revenue"
              label="Revenue closed"
              value={f.closedRevenue}
              onChange={set("closedRevenue")}
              suffix="₹"
              placeholder="100000"
            />
          </CardContent>
        </Card>
      </div>

      {/* ----------------------------------------------------------- results */}
      <div className="grid gap-4 self-start lg:sticky lg:top-20">
        {!ready ? (
          <Card>
            <CardContent className="text-muted-foreground py-10 text-center text-sm">
              Deal value-um delivery cost-um podunga — kanakku udane varum.
            </CardContent>
          </Card>
        ) : r.fatal ? (
          <FatalNote message={r.fatal} />
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contribution per deal</CardTitle>
                <CardDescription>
                  {recurring
                    ? `Full contract (${num(f.months)} months) mothamaa`
                    : "Oru deal-la kidaikura pandam"}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                <p className="font-display text-3xl font-bold tabular-nums">
                  {money(r.contribution)}
                  <span className="text-muted-foreground ml-2 text-base font-medium">
                    {percent(r.contributionPct)}
                  </span>
                </p>

                <ContributionBar
                  total={r.effectiveDealValue}
                  costs={r.costLines}
                  contribution={r.contribution}
                />

                <Separator />

                <div>
                  <Row
                    label={recurring ? "Contract value (LTV)" : "Deal value"}
                    value={money(r.effectiveDealValue)}
                    strong
                  />
                  {r.costLines
                    .filter((l) => l.value > 0)
                    .map((l) => (
                      <CostRow key={l.label} label={l.label} value={l.value} />
                    ))}
                  <Separator className="my-2" />
                  <Row
                    label="Contribution"
                    value={money(r.contribution)}
                    strong
                    tone="primary"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Targets <span className="text-primary">⭐</span>
                </CardTitle>
                <CardDescription>
                  CPL dhaan daily paakra number — Ad Manager-ku deal value theriyaadhu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Row
                  label="Max CPL"
                  value={money(r.maxCpl)}
                  hint="idhukku mela nashtam"
                  formula={`${money(r.maxCac)} × ${percent(r.closeRate * 100, 2)}  (max CAC × close rate)`}
                  strong
                  tone="primary"
                />
                <Row
                  label="Target CPL"
                  value={money(r.targetCpl)}
                  hint="goal"
                  formula={`${money(r.targetCac)} × ${percent(r.closeRate * 100, 2)}`}
                  strong
                />
                <Separator className="my-2" />
                <Row
                  label="Max CAC"
                  value={money(r.maxCac)}
                  formula="= contribution per deal"
                />
                <Row
                  label="Target CAC"
                  value={money(r.targetCac)}
                  formula={`${money(r.maxCac)} × ${(1 - num(f.desiredMargin) / 100).toFixed(2)}`}
                />
                <Separator className="my-2" />
                <Row
                  label="Overall close rate"
                  value={percent(r.closeRate * 100, 2)}
                  formula={
                    funnelMode === "funnel"
                      ? `${num(f.leadToQualified)}% × ${num(f.qualifiedToMeeting)}% × ${num(f.meetingToDeal)}%`
                      : undefined
                  }
                />
                <Row
                  label="Leads per deal"
                  value={count(r.leadsPerDeal)}
                  formula={`1 ÷ ${percent(r.closeRate * 100, 2)}`}
                />
                <Row
                  label="Break-even ROAS"
                  value={multiple(r.breakevenRoas)}
                  hint="profit 0%"
                  formula={`${money(r.effectiveDealValue)} ÷ ${money(r.contribution)}`}
                />
                <Row
                  label="Target ROAS"
                  value={multiple(r.targetRoas)}
                  hint={`profit ${percent(netMarginAtRoas(r.contributionPct, r.targetRoas))} of revenue`}
                />

                {r.maxCpql !== null ? (
                  <>
                    <Separator className="my-2" />
                    <p className="text-muted-foreground mb-1 text-[11px] tracking-wide uppercase">
                      Stage costs — CRM tracking-ku
                    </p>
                    <Row label="Max cost per qualified lead" value={money(r.maxCpql)} />
                    <Row
                      label="Max cost per meeting"
                      value={money(r.maxCostPerMeeting ?? NaN)}
                    />
                  </>
                ) : null}
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
                    <Row label="CPL" value={money(r.actual.cpl)} strong />
                    <Row label="CAC" value={money(r.actual.cac)} />
                    <Row
                      label="Close rate"
                      value={percent(r.actual.closeRatePct, 2)}
                      hint={`assumed ${percent(r.closeRate * 100, 2)}`}
                    />
                    <Row label="ROAS" value={multiple(r.actual.roas)} />
                    <Row label="Actual deal value" value={money(r.actual.dealValue)} />
                    <Separator className="my-2" />
                    <Row
                      label="Net profit"
                      value={money(r.actual.netProfit)}
                      strong
                      tone={r.actual.netProfit < 0 ? "primary" : undefined}
                    />
                  </div>
                  {recurring ? (
                    <p className="text-muted-foreground text-[11px]">
                      Net profit oru period-oda delivery cost-a vechu — full
                      contract illa.
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            {r.cashFlow ? (
              <Alert className="border-amber-500/40 bg-amber-50/60">
                <Wallet className="size-4" />
                <AlertDescription className="text-[13px] leading-relaxed">
                  <span className="font-medium">Cash flow paarunga.</span>{" "}
                  LTV {money(r.cashFlow.ltv)} vechu kanakku panniruku, aana
                  mudhal maasam {money(r.cashFlow.monthOneRevenue)} mattum dhaan
                  varum. CAC recover aaga ~
                  {Number.isFinite(r.cashFlow.paybackMonths)
                    ? r.cashFlow.paybackMonths
                    : "—"}{" "}
                  maasam aagum — anda varaikkum cash irukkanum. Client
                  {" "}{num(f.months)} maasam thangalaina LTV nyayam illa, churn
                  track pannunga.
                </AlertDescription>
              </Alert>
            ) : null}
          </>
        )}

        <NoteList
          notes={r.notes}
          onFix={(fix) =>
            setF((prev) => ({ ...prev, [fix.field]: String(fix.value) }))
          }
        />
      </div>
    </div>
  );
}
