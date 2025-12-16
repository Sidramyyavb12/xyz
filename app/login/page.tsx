"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { login as apiLogin } from "@/app/api/auth";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/authSlice";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null);
  //   setLoading(true);
  //   try {
  //     const res = await apiLogin({ email, password });
  //     // expected response shape: { success: boolean, token?: string, message?: string }
  //     if (res?.success && res.token) {
  //       dispatch(setCredentials({ token: res.token, user: { email } }));
  //       // redirect to dashboard
  //       router.push("/dashboard");
  //     } else {
  //       setError(res?.message || "Invalid credentials");
  //     }
  //   } catch (err: any) {
  //     setError(err?.message || "Login failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    // ✅ DEMO LOGIN CHECK
    if (email === "admin@demo.com" && password === "password") {
      dispatch(
        setCredentials({
          token: "demo-token",
          user: { email },
        })
      );

      router.push("/dashboard");
      return;
    }

    // ❌ INVALID DEMO CREDENTIALS
    setError("Invalid demo credentials");
  } catch (err: any) {
    setError("Login failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <> <Navbar/>
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 to-slate-50">
     
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-40"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="bg-white shadow-2xl rounded-2xl p-8 border border-slate-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-black text-white rounded-2xl">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-600">Sign in to manage your inventory</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? "Signing in..." : "Sign in"}
            </motion.button>
          </form>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-600 text-center mb-2">Demo Credentials:</p>
            <p className="text-sm font-mono text-center text-slate-900">
              admin@demo.com / password
            </p>
          </div>
        </div>
      </motion.div>
    </div>
       <footer/>
    </>
  );
}