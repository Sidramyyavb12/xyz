"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setStock, setLoading, removeItem } from "@/store/inventorySlice";
import { dummyStock } from "@/lib/dummyData";
import { getStock } from "@/app/api/inventory";
import Card from "./ui/Card";
import { AlertCircle, MinusCircle, X } from "lucide-react";

export default function StockTable() {
  const dispatch = useAppDispatch();
  const { stock, loading } = useAppSelector(
    (state) => state.inventory ?? { stock: [], loading: false }
  );
  
  const [outModal, setOutModal] = useState<{
    code: string;
    name: string;
    currentQty: number;
  } | null>(null);
  const [outQuantity, setOutQuantity] = useState("");
  const [outNote, setOutNote] = useState("");

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

  const handleOutClick = (item: any) => {
    setOutModal({
      code: item.code,
      name: item.name,
      currentQty: item.quantity || 0,
    });
    setOutQuantity("");
    setOutNote("");
  };

  const handleOutSubmit = () => {
    if (!outModal || !outQuantity) return;
    
    const qty = parseInt(outQuantity);
    if (isNaN(qty) || qty <= 0) {
      alert("Please enter a valid quantity");
      return;
    }
    
    if (qty > outModal.currentQty) {
      alert("Quantity cannot exceed current stock");
      return;
    }
    
    dispatch(removeItem({
      code: outModal.code,
      quantity: qty,
      note: outNote || "Material removed from inventory",
    }));
    
    setOutModal(null);
    setOutQuantity("");
    setOutNote("");
  };

  return (
    <>
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
                <th className="p-4 text-center font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                      <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                      Loading inventory...
                    </div>
                  </td>
                </tr>
              )}
              
              {!loading && stock?.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
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
                    exit={{ opacity: 0, x: -100 }}
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
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleOutClick(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                      >
                        <MinusCircle className="w-3.5 h-3.5" />
                        OUT
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* OUT Modal */}
      <AnimatePresence>
        {outModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOutModal(null)}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              {/* Modal Content */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Remove Stock</h3>
                  <button
                    onClick={() => setOutModal(null)}
                    className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600">Material:</p>
                    <p className="font-semibold text-slate-900">{outModal.name}</p>
                    <p className="text-xs text-slate-500 font-mono">{outModal.code}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 mb-1">
                      Available Quantity: <span className="font-semibold text-slate-900">{outModal.currentQty}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Quantity to Remove <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={outModal.currentQty}
                      value={outQuantity}
                      onChange={(e) => setOutQuantity(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter quantity"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Note (Optional)
                    </label>
                    <textarea
                      value={outNote}
                      onChange={(e) => setOutNote(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                      placeholder="Add a note (e.g., Customer order, Damaged goods, etc.)"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleOutSubmit}
                      className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors shadow-md"
                    >
                      Confirm Removal
                    </button>
                    <button
                      onClick={() => setOutModal(null)}
                      className="px-4 py-2.5 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
