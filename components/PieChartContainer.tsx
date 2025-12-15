"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import Card from "./ui/Card";
import { getReport } from "@/app/api/reports";

const COLORS = ["#0ea5e9", "#22c55e", "#ef4444", "#f59e0b", "#3b82f6", "#6366f1"];

export default function PieChartContainer() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => { (async () => {
    const res = await getReport();
    setData(res?.data ?? []);
  })(); }, []);

  return (
    <Card className="p-4" >
      <h3 className="font-semibold mb-2">Stock Distribution</h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} label>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
