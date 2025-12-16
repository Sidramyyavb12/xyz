"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "./ui/Card";
import { useMemo } from "react";
import { dummyStock } from "@/lib/dummyData";

export default function BarChartContainer() {
  // Example aggregation
  const data = useMemo(
    () =>
      dummyStock.map((item) => ({
        name: item.name,
        qty: item.quantity,
      })),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-900">
          Stock Quantity Overview
        </h3>

        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="qty"
                radius={[6, 6, 0, 0]}
                fill="#0ea5e9"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}
