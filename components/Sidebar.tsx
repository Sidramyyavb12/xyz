"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  TrendingUp, 
  FileText,
  Layers
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "/inventory", icon: Package },
  { label: "Add Material", href: "/inventory/add", icon: Plus },
  { label: "Material Flow", href: "/inventory/flow", icon: TrendingUp },
  { label: "Reports", href: "/inventory/reports", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white border-r shadow-sm">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">KrixFlow</h2>
            <p className="text-xs text-slate-500">Inventory System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
          
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-black text-white shadow-md"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="text-xs text-slate-400 text-center">
          Version 1.0.0
        </div>
      </div>
    </aside>
  );
}