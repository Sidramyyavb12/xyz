"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PieChartContainer from "@/components/PieChartContainer";
import InventoryCard from "@/components/InventoryCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setStock, setLoading } from "@/store/inventorySlice";
import { dummyStock } from "@/lib/dummyData";
import { getStock } from "@/app/api/inventory";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { stock, loading } = useAppSelector(
  (state) => state.inventory ?? { stock: [], loading: false }
);

  const [total, setTotal] = useState<number>(0);
  const [low, setLow] = useState<number>(0);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setTotal(stock.length);
    setLow(stock.filter((i) => (i.quantity ?? 0) < 5).length);
  }, [stock]);

  async function load() {
    dispatch(setLoading(true));
    try {
      const res = await getStock();
      const items = res?.data ?? [];
      
      // Use API data if available, otherwise use dummy data
      if (items.length > 0) {
        dispatch(setStock(items));
      } else {
        // Fallback to dummy data if API returns no data
        dispatch(setStock(dummyStock));
      }
    } catch (error) {
      // On error, use dummy data
      console.log("Using dummy data due to API error");
      dispatch(setStock(dummyStock));
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Dashboard</h1>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
            Loading...
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InventoryCard label="Total Materials" value={total} />
        <InventoryCard label="Low Stock" value={low} highlight />
        <InventoryCard label="Reports" value="View" link="/inventory/reports" />
      </div>

      <PieChartContainer />
    </motion.div>
  );
}