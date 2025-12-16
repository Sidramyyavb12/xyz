"use client";

import PieChartContainer from "@/components/PieChartContainer";
import BarChartContainer from "@/components/BarChartContainer";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      <PieChartContainer />
      <BarChartContainer />
    </div>
  );
}
