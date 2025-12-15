import React from "react";
import Card from "./ui/Card";
import Link from "next/link";

export default function InventoryCard({ label, value, highlight, link } : { label: string; value: string | number; highlight?: boolean; link?: string; }) {
  const body = (
    <Card className={`${highlight ? "bg-red-50 border-red-200" : ""}`}>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </Card>
  );

  if (link) return <Link href={link}>{body}</Link>;
  return body;
}
