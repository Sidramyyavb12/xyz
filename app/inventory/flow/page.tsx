"use client";

import { motion } from "framer-motion";
import FlowTable from "@/components/FlowTable";
import { TrendingUp } from "lucide-react";

export default function FlowPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <TrendingUp className="w-8 h-8" />
          Material Flow
        </h1>
        <p className="text-slate-600 mt-1">Track incoming and outgoing materials</p>
      </div>
      <FlowTable />
    </motion.div>
  );
}