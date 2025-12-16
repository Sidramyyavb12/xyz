"use client";

import { motion } from "framer-motion";
import StockTable from "@/components/StockTable";
import Link from "next/link";
import { Plus, Package } from "lucide-react";

export default function InventoryPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Package className="w-8 h-8" />
            Inventory
          </h1>
          <p className="text-slate-600 mt-1">Manage your hardware stock</p>
        </div>
        <Link href="/inventory/add">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Material
          </motion.button>
        </Link>
      </div>

      <StockTable />
    </motion.div>
  );
}