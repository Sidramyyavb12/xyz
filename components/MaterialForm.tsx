"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Hash,
  Tag,
  Layers,
  IndianRupee,
  Calendar,
  Save,
  RotateCcw,
} from "lucide-react";

import Input from "./ui/Input";
import Button from "./ui/Button";
import { addMaterial } from "@/app/api/material";

export default function MaterialForm({ onSaved }: { onSaved?: () => void }) {
  const [form, setForm] = useState({
    category: "",
    type: "",
    size: "",
    code: "",
    name: "",
    price: "",
    expiry: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...form, price: parseFloat(form.price || "0") };
    const res = await addMaterial(payload);

    if (res?.success) {
      onSaved?.();
      setForm({
        category: "",
        type: "",
        size: "",
        code: "",
        name: "",
        price: "",
        expiry: "",
      });
    }
    setLoading(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8 space-y-6"
    >
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
        />

        <Input
          label="Type"
          name="type"
          value={form.type}
          onChange={handleChange}
          required
          icon={<Tag className="w-4 h-4" />}
        />

        <Input
          label="Size"
          name="size"
          value={form.size}
          onChange={handleChange}
          required
          icon={<Layers className="w-4 h-4" />}
        />

        <Input
          label="Code"
          name="code"
          value={form.code}
          onChange={handleChange}
          required
          icon={<Hash className="w-4 h-4" />}
        />

        <Input
          label="Material Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="md:col-span-2"
          icon={<Package className="w-4 h-4" />}
        />

        <Input
          label="Price"
          name="price"
          value={form.price}
          onChange={handleChange}
          type="number"
          icon={<IndianRupee className="w-4 h-4" />}
        />

        <Input
          label="Expiry Date"
          name="expiry"
          value={form.expiry}
          onChange={handleChange}
          type="date"
          icon={<Calendar className="w-4 h-4" />}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <motion.div whileTap={{ scale: 0.97 }}>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
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
    </motion.form>
  );
}
