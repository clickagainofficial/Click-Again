"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, Package, Users } from "lucide-react";

import EcommerceMode from "./EcommerceMode";
import ServiceMode from "./ServiceMode";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  categoryBenchmarks,
  funnelBenchmarks,
  metaBenchmarks,
  rtoBenchmarks,
} from "@/lib/adMetrics";

export default function Calculator() {
  const [benchmarks, setBenchmarks] = useState(false);

  return (
    <div className="grid gap-6">
      <Tabs defaultValue="ecommerce">
        <TabsList>
          <TabsTrigger value="ecommerce">
            <Package className="mr-1.5 size-4" />
            Ecommerce
          </TabsTrigger>
          <TabsTrigger value="service">
            <Users className="mr-1.5 size-4" />
            Service
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ecommerce" className="mt-6">
          <EcommerceMode />
        </TabsContent>

        <TabsContent value="service" className="mt-6">
          <ServiceMode />
        </TabsContent>
      </Tabs>

      <Collapsible open={benchmarks} onOpenChange={setBenchmarks}>
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="flex-row items-center justify-between">
              <div className="text-left">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="size-4" />
                  Reference benchmarks
                </CardTitle>
                <CardDescription>
                  India Meta Ads — client kitta pesumbodhu use pannunga
                </CardDescription>
              </div>
              <ChevronDown
                className={`size-4 shrink-0 transition-transform ${benchmarks ? "rotate-180" : ""}`}
              />
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-medium">Category margins</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Margin</TableHead>
                      <TableHead>Break-even ROAS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryBenchmarks.map((b) => (
                      <TableRow key={b.category}>
                        <TableCell>{b.category}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {b.margin}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {b.roas}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="grid gap-8 self-start">
                <div>
                  <h3 className="mb-2 text-sm font-medium">Meta Ads ranges</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Range</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metaBenchmarks.map((b) => (
                        <TableRow key={b.metric}>
                          <TableCell>
                            {b.metric}
                            {b.note ? (
                              <span className="text-muted-foreground block text-[11px]">
                                {b.note}
                              </span>
                            ) : null}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {b.range}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-medium">Service funnel</h3>
                  <Table>
                    <TableBody>
                      {funnelBenchmarks.map((b) => (
                        <TableRow key={b.stage}>
                          <TableCell>{b.stage}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {b.range}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <p className="text-muted-foreground mt-2 text-[11px]">
                    High-ticket (₹1L+) nnaa close rate kammiya irukkum.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-medium">RTO rates (India)</h3>
                  <Table>
                    <TableBody>
                      {rtoBenchmarks.map((b) => (
                        <TableRow key={b.payment}>
                          <TableCell>{b.payment}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {b.rate}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
