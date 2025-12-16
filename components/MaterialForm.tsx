"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Hash,
  Tag,
  Layers,
  DollarSign,
  Calendar,
  Save,
  RotateCcw,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

import Input from "./ui/Input";
import Button from "./ui/Button";
import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/store/inventorySlice";

export default function MaterialForm({ onSaved }: { onSaved?: () => void }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const [form, setForm] = useState({
    category: "",
    type: "",
    size: "",
    code: "",
    name: "",
    quantity: "",
    price: "",
    expiry: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // Create item object
      const newItem = {
        code: form.code,
        name: form.name,
        category: form.category,
        size: form.size || "N/A",
        quantity: parseInt(form.quantity) || 1,
        price: parseFloat(form.price) || 0,
      };

      // Add item to Redux store (will automatically add to inventory and flow)
      dispatch(addItem(newItem));

      // Show success message
      setSuccess(true);
      
      // Reset form
      setForm({
        category: "",
        type: "",
        size: "",
        code: "",
        name: "",
        quantity: "",
        price: "",
        expiry: "",
      });

      // Call onSaved callback if provided
      onSaved?.();

      // Show success for 2 seconds then redirect
      setTimeout(() => {
        router.push("/inventory");
      }, 1500);
    } catch (error) {
      console.error("Error adding material:", error);
      alert("Failed to add material. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8 space-y-6"
    >
      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Material added successfully! Redirecting...</span>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Add New Material
          </h2>
          <p className="text-sm text-slate-500">
            Enter material details to update inventory
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          icon={<Layers className="w-4 h-4" />}
          placeholder="e.g., Tools, Fasteners, etc."
        />

        <Input
          label="Type"
          name="type"
          value={form.type}
          onChange={handleChange}
          icon={<Tag className="w-4 h-4" />}
          placeholder="e.g., Power Tool, Hand Tool, etc."
        />

        <Input
          label="Size"
          name="size"
          value={form.size}
          onChange={handleChange}
          icon={<Layers className="w-4 h-4" />}
          placeholder="e.g., 10mm, Large, 500W, etc."
        />

        <Input
          label="Code"
          name="code"
          value={form.code}
          onChange={handleChange}
          required
          icon={<Hash className="w-4 h-4" />}
          placeholder="e.g., HW001"
        />

        <Input
          label="Material Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="md:col-span-2"
          icon={<Package className="w-4 h-4" />}
          placeholder="e.g., Screwdriver Set"
        />

        <Input
          label="Quantity"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          type="number"
          required
          icon={<Plus className="w-4 h-4" />}
          placeholder="Enter quantity"
        />

        <Input
          label="Price ($)"
          name="price"
          value={form.price}
          onChange={handleChange}
          type="number"
          step="0.01"
          icon={<DollarSign className="w-4 h-4" />}
          placeholder="0.00"
        />

        <Input
          label="Expiry Date (Optional)"
          name="expiry"
          value={form.expiry}
          onChange={handleChange}
          type="date"
          icon={<Calendar className="w-4 h-4" />}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <motion.div whileTap={{ scale: 0.97 }} className="flex-1">
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Material"}
          </Button>
        </motion.div>

        <motion.div whileTap={{ scale: 0.97 }}>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setForm({
                category: "",
                type: "",
                size: "",
                code: "",
                name: "",
                quantity: "",
                price: "",
                expiry: "",
              })
            }
            className="w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </motion.div>
      </div>

      {/* Info Box */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Adding material will automatically update the inventory and create an IN entry in material flow.
        </p>
      </div>
    </motion.form>
  );
}
