"use client";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useInventoryStore } from "@/store/useInventoryStore";
import Card from "./ui/Card";

export default function FlowTable() {
  const { flow, fetchFlow } = useInventoryStore();
  useEffect(() => void fetchFlow(), [fetchFlow]);

  return (
    <Card className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Code</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Action</th>
            <th className="p-3 text-right">Qty</th>
            <th className="p-3 text-left">Note</th>
          </tr>
        </thead>
        <tbody>
          {flow?.length === 0 && (
            <tr><td colSpan={6} className="p-4 text-center text-slate-500">No flow logs</td></tr>
          )}
          {flow?.map((f: any) => (
            <tr key={f._id} className="border-t">
              <td className="p-3">{dayjs(f.date).format("YYYY-MM-DD HH:mm")}</td>
              <td className="p-3">{f.code}</td>
              <td className="p-3">{f.name}</td>
              <td className={`p-3 ${f.action === "IN" ? "text-green-600" : "text-red-600"}`}>{f.action}</td>
              <td className="p-3 text-right">{f.qty}</td>
              <td className="p-3">{f.note || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
