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
        className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            
            {/* ================= LEFT: LOGO + NAME ================= */}
            <div className="flex items-center gap-3">
              {/* Hamburger Menu for Mobile (Only when logged in) */}
              {user && (
                <button
                  onClick={() => setOpen(true)}
                  className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6 text-slate-700" />
                </button>
              )}

              {/* Company Logo and Name - Always visible */}
              <Link href="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg text-slate-900">KrixFlow</span>
              </Link>
            </div>

            {/* ================= CENTER: PUBLIC LINKS (Only when not logged in) ================= */}
            {!user && (
              <nav className="hidden md:flex items-center gap-8">
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "text-black"
                        : "text-slate-600 hover:text-black"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}

            {/* ================= RIGHT: USER INFO or LOGIN ================= */}
            <div className="flex items-center gap-3">
              {!user ? (
                // Login Button (Public)
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-xl bg-black text-white text-sm font-semibold hover:bg-slate-800 transition-colors shadow-md"
                >
                  Login
                </Link>
              ) : (
                // Logged In User Section
                <>
                  {/* User Info with Avatar */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl">
                    <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold">
                      {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {user.name || user.email?.split("@")[0] || "User"}
                    </span>
                  </div>

                  {/* Mobile User Avatar (visible on mobile) */}
                  <div className="sm:hidden w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-md"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                  
                  {/* Mobile Logout Icon Only */}
                  <button
                    onClick={handleLogout}
                    className="md:hidden p-2 bg-black text-white rounded-lg hover:bg-slate-800 transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* ================= MOBILE SIDEBAR ================= */}
      {user && <MobileSidebar open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
