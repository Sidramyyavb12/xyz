"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import Card from "./ui/Card";
import { getReport } from "@/app/api/reports";

const COLORS = ["#0ea5e9", "#22c55e", "#ef4444", "#f59e0b", "#6366f1"];

export default function PieChartContainer() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getReport();
      setData(res?.data ?? []);
    })();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-900">
          Stock Distribution
        </h3>

        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-500">
            No data available
          </div>
        ) : (
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
