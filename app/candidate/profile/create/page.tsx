"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, DollarSign, Clock, MapPin } from "lucide-react";
import { candidateAPI } from "@/lib/api/candidate";

const AVAILABILITY_OPTIONS = [
  { value: "OPEN_TO_OPPORTUNITIES", label: "Open to Opportunities" },
  { value: "ACTIVELY_LOOKING", label: "Actively Looking" },
  { value: "NOT_LOOKING", label: "Not Looking" },
] as const;

const WORK_TYPE_OPTIONS = [
  { value: "REMOTE", label: "Remote" },
  { value: "ONSITE", label: "Onsite" },
  { value: "HYBRID", label: "Hybrid" },
] as const;

export default function CreateCandidateProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    currentDesignation: "",
    totalExperienceYears: 0,
    expectedSalary: 0,
    availabilityStatus: "OPEN_TO_OPPORTUNITIES" as const,
    workTypePreference: "HYBRID" as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await candidateAPI.createProfile(formData);
      // Redirect to dashboard after successful profile creation
      router.push("/candidate/dashboard");
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
                <Briefcase className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Complete Your Candidate Profile
              </h1>
              <p className="text-slate-600">
                Tell us about your professional background
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
              {/* Current Designation */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Designation *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.currentDesignation}
                    onChange={(e) =>
                      setFormData({ ...formData, currentDesignation: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="e.g., Senior Software Developer"
                  />
                </div>
              </div>

              {/* Total Experience */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Total Experience (Years) *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    required
                    min="0"
                    max="50"
                    value={formData.totalExperienceYears}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalExperienceYears: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="e.g., 5"
                  />
                </div>
              </div>

              {/* Expected Salary */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Expected Annual Salary (₹) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    required
                    min="0"
                    step="1000"
                    value={formData.expectedSalary}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expectedSalary: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="e.g., 800000"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Enter amount in Indian Rupees (e.g., 800000 for 8 LPA)
                </p>
              </div>

              {/* Availability Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Availability Status *
                </label>
                <select
                  value={formData.availabilityStatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      availabilityStatus: e.target.value as any,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                >
                  {AVAILABILITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Work Type Preference */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Work Type Preference *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                  <select
                    value={formData.workTypePreference}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        workTypePreference: e.target.value as any,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all appearance-none"
                  >
                    {WORK_TYPE_OPTIONS.map((option) => (
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
