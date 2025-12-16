"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setStock, setLoading } from "@/store/inventorySlice";
import { dummyStock } from "@/lib/dummyData";
import { getStock } from "@/app/api/inventory";
import Card from "./ui/Card";
import { AlertCircle } from "lucide-react";

export default function StockTable() {
  const dispatch = useAppDispatch();
  const { stock, loading } = useAppSelector(
  (state) => state.inventory ?? { stock: [], loading: false }
);


  useEffect(() => {
    loadStock();
  }, []);

  async function loadStock() {
    dispatch(setLoading(true));
    try {
      const res = await getStock();
      const items = res?.data ?? [];
      
      // Use API data if available, otherwise use dummy data
      if (items.length > 0) {
        dispatch(setStock(items));
      } else {
        dispatch(setStock(dummyStock));
      }
    } catch (error) {
      console.log("Using dummy data due to API error");
      dispatch(setStock(dummyStock));
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 border-b-2 border-slate-200">
            <tr>
              <th className="p-4 text-left font-semibold text-slate-700">Code</th>
              <th className="p-4 text-left font-semibold text-slate-700">Name</th>
              <th className="p-4 text-left font-semibold text-slate-700">Category</th>
              <th className="p-4 text-left font-semibold text-slate-700">Size</th>
              <th className="p-4 text-right font-semibold text-slate-700">Quantity</th>
              <th className="p-4 text-right font-semibold text-slate-700">Price</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="p-8 text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-500">
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                    Loading inventory...
                  </div>
                </td>
              </tr>
            )}
            
            {!loading && stock?.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="w-8 h-8 text-slate-400" />
                    <p>No stock items found</p>
                  </div>
                </td>
              </tr>
            )}
            
            {!loading && stock?.map((item, index) => {
              const isLowStock = (item.quantity ?? 0) < 5;
              
              return (
                <motion.tr
                  key={item.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`border-t border-slate-100 hover:bg-slate-50 transition-colors ${
                    isLowStock ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="p-4 font-mono text-slate-900">{item.code}</td>
                  <td className="p-4 font-medium text-slate-900">{item.name}</td>
                  <td className="p-4 text-slate-600">{item.category}</td>
                  <td className="p-4 text-slate-600">{item.size || '-'}</td>
                  <td className={`p-4 text-right font-semibold ${
                    isLowStock ? 'text-red-600' : 'text-slate-900'
                  }`}>
                    {item.quantity ?? 0}
                    {isLowStock && (
                      <span className="ml-2 text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">Low</span>
                    )}
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">
                    ${(item.price ?? 0).toFixed(2)}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}