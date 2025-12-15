"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Inventory", href: "/inventory" },
  { label: "Add Material", href: "/inventory/add" },
  { label: "Material Flow", href: "/inventory/flow" },
  { label: "Reports", href: "/inventory/reports" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white border-r p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">KrixFlow</h2>
        <p className="text-sm text-slate-500">Inventory System</p>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`p-2 rounded-md text-sm transition ${
                active
                  ? "bg-black text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto text-xs text-slate-400">v1.0</div>
    </aside>
  );
}
