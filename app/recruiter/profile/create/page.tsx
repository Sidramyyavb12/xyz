"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, Briefcase, User } from "lucide-react";
import { recruiterAPI } from "@/lib/api/recruiter";

const RECRUITER_TYPE_OPTIONS = [
  { value: "INTERNAL", label: "Internal Recruiter" },
  { value: "EXTERNAL", label: "External Recruiter" },
  { value: "AGENCY", label: "Agency Recruiter" },
] as const;

export default function CreateRecruiterProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    recruiterType: "INTERNAL" as const,
    designation: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await recruiterAPI.createProfile(formData);
      // Redirect to dashboard after successful profile creation
      router.push("/recruiter/dashboard");
    } catch (err: any) {
      console.error("Profile creation error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-50 p-4">
      <div className="max-w-3xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white shadow-2xl rounded-2xl p-8 border border-slate-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-black text-white rounded-2xl">
                <Building2 className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Complete Your Recruiter Profile
              </h1>
              <p className="text-slate-600">
                Tell us about your company and role
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="e.g., Tech Corp"
                  />
                </div>
              </div>

              {/* Recruiter Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Recruiter Type *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                  <select
                    value={formData.recruiterType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recruiterType: e.target.value as any,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all appearance-none"
                  >
                    {RECRUITER_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
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

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Designation *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="e.g., HR Manager"
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
                {loading ? "Creating Profile..." : "Create Profile"}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
