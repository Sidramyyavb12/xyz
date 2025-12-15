"use client";
import { useEffect } from "react";
import { useInventoryStore } from "@/store/useInventoryStore";
import Card from "./ui/Card";

export default function StockTable() {
  const { stock, fetchStock } = useInventoryStore();

  useEffect(() => void fetchStock(), [fetchStock]);

  return (
    <Card className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3 text-left">Code</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Size</th>
            <th className="p-3 text-right">Qty</th>
            <th className="p-3 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {stock?.length === 0 && (
            <tr><td colSpan={6} className="p-4 text-center text-slate-500">No stock</td></tr>
          )}
          {stock?.map((s: any) => (
            <tr key={s.code} className="border-t">
              <td className="p-3">{s.code}</td>
              <td className="p-3">{s.name}</td>
              <td className="p-3">{s.category}</td>
              <td className="p-3">{s.size}</td>
              <td className="p-3 text-right">{s.quantity ?? 0}</td>
              <td className="p-3 text-right">₹{s.price ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
