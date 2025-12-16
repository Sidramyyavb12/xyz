"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  LayoutDashboard, 
  Package, 
  Plus, 
  TrendingUp, 
  FileText,
  Layers,
  LogOut
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "/inventory", icon: Package },
  { label: "Add Material", href: "/inventory/add", icon: Plus },
  { label: "Material Flow", href: "/inventory/flow", icon: TrendingUp },
  { label: "Reports", href: "/inventory/reports", icon: FileText },
];

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  // Close sidebar on route change
  useEffect(() => {
    onClose();
  }, [pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleLogout = () => {
    dispatch(logout());
    onClose();
    router.push("/login");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 md:hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
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
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* User Info */}
            {user && (
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {user.name || user.email?.split("@")[0]}
                    </p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
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

            {/* Logout Button */}
            <div className="p-4 border-t border-slate-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-3 bg-black text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Version */}
            <div className="p-4 border-t border-slate-200">
              <div className="text-xs text-slate-400 text-center">
                Version 1.0.0
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
