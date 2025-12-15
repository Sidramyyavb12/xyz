"use client";

import MaterialForm from "@/components/MaterialForm";
import { useState } from "react";

export default function AddMaterialPage() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-xl font-semibold">Add New Material</h1>
      {saved && <div className="text-sm text-green-700">Material saved</div>}
      <MaterialForm onSaved={() => setSaved(true)} />
    </div>
  );
}
