"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, User, LogOut } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";

export default function LearnerDashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {user?.name || "Learner"}
                </h1>
                <p className="text-sm text-slate-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Learner Dashboard
            </h2>
            <p className="text-slate-600">
              Welcome to your learning portal
            </p>
          </div>

          {/* Welcome Card */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Welcome, {user?.name}!
            </h3>
            <p className="text-slate-600 mb-6">
              Your learner dashboard is ready. Start exploring courses and materials.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg">
              <BookOpen className="w-4 h-4" />
              <span>Browse Courses</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
