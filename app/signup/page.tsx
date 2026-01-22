"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Lock, Mail, User, Briefcase } from "lucide-react";
import { authAPI } from "@/lib/api/auth";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, updateUser } from "@/store/authSlice";
import { storeAuthData, handlePostAuthRouting } from "@/lib/authUtils";
import Navbar from "@/components/Navbar";

const ROLES = [
  { value: "LEARNER", label: "Learner" },
  { value: "INSTRUCTOR", label: "Instructor" },
  { value: "CANDIDATE", label: "Candidate" },
  { value: "RECRUITER", label: "Recruiter" },
] as const;

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"LEARNER" | "INSTRUCTOR" | "CANDIDATE" | "RECRUITER">("LEARNER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Register user
      const registerResponse = await authAPI.register({
        name,
        email,
        password,
        role,
      });

      // Step 2: Store tokens
      const { token, refreshToken, user } = registerResponse;
      storeAuthData(token, refreshToken, user);
      dispatch(
        setCredentials({
          accessToken: token,
          refreshToken: refreshToken,
          user: user,
        })
      );

      // Step 3: Call /api/users/me to get complete user details
      const userMe = await authAPI.getUserMe();
      
      // Update user in store with complete details
      dispatch(updateUser(userMe));
      storeAuthData(token, refreshToken, userMe);

      // Step 4: Handle routing based on role and profile status
      const redirectPath = await handlePostAuthRouting(userMe);
      router.push(redirectPath);
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
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
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="bg-white shadow-2xl rounded-2xl p-8 border border-slate-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-black text-white rounded-2xl">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Create Account
              </h2>
              <p className="text-slate-600">Join us and get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
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

              {/* Role Dropdown */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Role
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                  <select
                    value={role}
                    onChange={(e) =>
                      setRole(
                        e.target.value as
                          | "LEARNER"
                          | "INSTRUCTOR"
                          | "CANDIDATE"
                          | "RECRUITER"
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
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

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "Creating Account..." : "Sign Up"}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-black hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
