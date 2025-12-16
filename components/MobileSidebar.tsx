"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  TrendingUp, 
  FileText,
  X,
  Layers
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "/inventory", icon: Package },
  { label: "Add Material", href: "/inventory/add", icon: Plus },
  { label: "Material Flow", href: "/inventory/flow", icon: TrendingUp },
  { label: "Reports", href: "/inventory/reports", icon: FileText },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ open, onClose }: Props) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">KrixFlow</h2>
                  <p className="text-xs text-slate-500">Inventory System</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
              {navItems.map((item, index) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
                
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? "bg-black text-white shadow-md"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t">
              <div className="text-xs text-slate-400 text-center">
                Version 1.0.0
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}