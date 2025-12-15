"use client";

import { useEffect, useState } from "react";
import PieChartContainer from "@/components/PieChartContainer";
import InventoryCard from "@/components/InventoryCard";
import { getStock } from "@/app/api/inventory";

export default function DashboardPage() {
  const [total, setTotal] = useState<number>(0);
  const [low, setLow] = useState<number>(0);

  useEffect(() => { load(); }, []);

  async function load() {
    const res = await getStock();
    const items = res?.data ?? [];
    setTotal(items.length);
    setLow(items.filter((i: any) => (i.quantity ?? 0) < 5).length);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InventoryCard label="Total Materials" value={total} />
        <InventoryCard label="Low Stock" value={low} highlight />
        <InventoryCard label="Reports" value="View" link="/inventory/reports" />
      </div>

      <PieChartContainer />
    </div>
  );
}
