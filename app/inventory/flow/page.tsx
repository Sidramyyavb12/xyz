"use client";

import FlowTable from "@/components/FlowTable";

export default function FlowPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Material Flow</h1>
      <p className="text-sm text-slate-600 mb-4">Track IN / OUT of materials</p>
      <FlowTable />
    </div>
  );
}
