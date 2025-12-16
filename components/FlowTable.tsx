"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFlow, setLoading } from "@/store/inventorySlice";
import { dummyFlow } from "@/lib/dummyData";
import { getFlow } from "@/app/api/inventory";
import Card from "./ui/Card";
import { ArrowDownCircle, ArrowUpCircle, AlertCircle } from "lucide-react";

export default function FlowTable() {
  const dispatch = useAppDispatch();
 const { stock, flow, loading } = useAppSelector(
  (state) => state.inventory ?? { stock: [], flow: [], loading: false }
);



  useEffect(() => {
    loadFlow();
  }, []);

  async function loadFlow() {
    dispatch(setLoading(true));
    try {
      const res = await getFlow();
      const items = res?.data ?? [];
      
      // Use API data if available, otherwise use dummy data
      if (items.length > 0) {
        dispatch(setFlow(items));
      } else {
        dispatch(setFlow(dummyFlow));
      }
    } catch (error) {
      console.log("Using dummy data due to API error");
      dispatch(setFlow(dummyFlow));
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 border-b-2 border-slate-200">
            <tr>
              <th className="p-4 text-left font-semibold text-slate-700">Date & Time</th>
              <th className="p-4 text-left font-semibold text-slate-700">Code</th>
              <th className="p-4 text-left font-semibold text-slate-700">Material Name</th>
              <th className="p-4 text-left font-semibold text-slate-700">Action</th>
              <th className="p-4 text-right font-semibold text-slate-700">Quantity</th>
              <th className="p-4 text-left font-semibold text-slate-700">Note</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="p-8 text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-500">
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                    Loading flow records...
                  </div>
                </td>
              </tr>
            )}
            
            {!loading && flow?.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="w-8 h-8 text-slate-400" />
                    <p>No flow records found</p>
                  </div>
                </td>
              </tr>
            )}
            
            {!loading && flow?.map((record, index) => (
              <motion.tr
                key={record._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="p-4 text-slate-600">
                  {dayjs(record.date).format("MMM DD, YYYY HH:mm")}
                </td>
                <td className="p-4 font-mono text-slate-900">{record.code}</td>
                <td className="p-4 font-medium text-slate-900">{record.name}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    record.action === "IN" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {record.action === "IN" ? (
                      <ArrowDownCircle className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowUpCircle className="w-3.5 h-3.5" />
                    )}
                    {record.action}
                  </span>
                </td>
                <td className="p-4 text-right font-semibold text-slate-900">{record.qty}</td>
                <td className="p-4 text-slate-600 text-xs">{record.note || "-"}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}