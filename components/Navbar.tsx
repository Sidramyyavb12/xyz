"use client";

import { useState } from "react";
import MobileSidebar from "./MobileHeader";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b">
        <div className="p-3 flex items-center justify-between">
          {/* Mobile menu */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setOpen(true)}
              className="p-2 border rounded-md"
            >
              ☰
            </button>
            <h1 className="font-semibold text-lg">KrixFlow</h1>
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-slate-600">Admin</span>
            <button className="px-3 py-1 bg-black text-white rounded">
              Logout
            </button>
          </div>
        </div>
      </header>

      <MobileSidebar open={open} onClose={() => setOpen(false)} />
    </>
  );
}
