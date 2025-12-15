"use client";

import StockTable from "@/components/StockTable";
import Link from "next/link";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Inventory</h1>
        <Link href="/inventory/add" className="px-4 py-2 bg-black text-white rounded">+ Add Material</Link>
      </div>

      <StockTable />
    </div>
  );
}
