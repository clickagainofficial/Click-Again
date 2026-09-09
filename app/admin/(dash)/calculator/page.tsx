import Calculator from "@/components/admin/calculator/Calculator";

export const metadata = { title: "Ad metrics calculator" };

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Ad metrics calculator</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
          ROAS, break-even ROAS, CPL and CAC — for a shop where the money lands
          on the website, or a service where the lead lands first and the deal
          closes later. Variable costs only; rent and salaries belong in the
          monthly P&amp;L.
        </p>
      </div>

      <Calculator />
    </div>
  );
}
