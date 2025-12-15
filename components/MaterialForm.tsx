"use client";
import { useState } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { addMaterial } from "@/app/api/material";

export default function MaterialForm({ onSaved }: { onSaved?: () => void; }) {
  const [form, setForm] = useState({ category: "", type: "", size: "", code: "", name: "", price: "", expiry: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, price: parseFloat(form.price || "0") };
    const res = await addMaterial(payload);
    if (res?.success) {
      onSaved?.();
      setForm({ category: "", type: "", size: "", code: "", name: "", price: "", expiry: "" });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Category" name="category" value={form.category} onChange={handleChange} required />
        <Input label="Type" name="type" value={form.type} onChange={handleChange} required />
        <Input label="Size" name="size" value={form.size} onChange={handleChange} required />
        <Input label="Code" name="code" value={form.code} onChange={handleChange} required />
        <Input label="Name" name="name" value={form.name} onChange={handleChange} className="md:col-span-2" required />
        <Input label="Price" name="price" value={form.price} onChange={handleChange} type="number" />
        <Input label="Expiry" name="expiry" value={form.expiry} onChange={handleChange} type="date" />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Material"}</Button>
        <Button type="button" variant="outline" onClick={() => setForm({ category: "", type: "", size: "", code: "", name: "", price: "", expiry: "" })}>Reset</Button>
      </div>
    </form>
  );
}
