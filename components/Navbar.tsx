"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, LogOut, User, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import MobileSidebar from "./MobileSidebar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const publicLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 w-full bg-white border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            
            {/* ================= LEFT ================= */}
            <div className="flex items-center gap-3">
              
              {/* ✅ MOBILE: HAMBURGER */}
              {user && (
                <button
                  onClick={() => setOpen(true)}
                  className="md:hidden p-2 rounded-lg border border-slate-300 hover:bg-slate-100"
                  aria-label="Open menu"
                >siddu
                  {/* <Menu className="w-6 h-6" /> */}
                </button>
              )}

              {/* ✅ DESKTOP: LOGO + NAME */}
              <Link
                href="/"
                className="hidden md:flex items-center gap-2"
              >
                <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg">KrixFlow</span>
              </Link>
            </div>

            {/* ================= CENTER (PUBLIC) ================= */}
            {!user && (
              <div className="hidden md:flex items-center gap-8">
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium ${
                      pathname === link.href
                        ? "text-black"
                        : "text-slate-600 hover:text-black"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {/* ================= RIGHT ================= */}
            <div className="flex items-center gap-3">
              {!user ? (
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-xl bg-black text-white text-sm font-semibold hover:bg-slate-800"
                >
                  Login
                </Link>
              ) : (
                <>
                  {/* USER INFO (hidden on small mobile) */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl">
                    <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {user.email?.split("@")[0] || "Admin"}
                    </span>
                  </div>

                  {/* LOGOUT */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-semibold hover:bg-slate-800"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* ================= MOBILE SIDEBAR ================= */}
      {user && (
        <MobileSidebar
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
