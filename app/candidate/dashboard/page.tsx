"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Briefcase,
  DollarSign,
  Clock,
  MapPin,
  User,
  CheckCircle,
  LogOut,
} from "lucide-react";
import { candidateAPI, CandidateProfile } from "@/lib/api/candidate";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";

export default function CandidateDashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        router.push("/login");
        return;
      }

      try {
        const profileData = await candidateAPI.getProfileByUserId(user.id);
        setProfile(profileData);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        if (err?.response?.status === 404) {
          // Profile not found, redirect to create
          router.push("/candidate/profile/create");
        } else {
          setError("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const formatSalary = (salary: number) => {
    if (salary >= 100000) {
      return `₹${(salary / 100000).toFixed(2)} LPA`;
    }
    return `₹${salary.toLocaleString("en-IN")}`;
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "ACTIVELY_LOOKING":
        return "bg-green-100 text-green-800";
      case "OPEN_TO_OPPORTUNITIES":
        return "bg-blue-100 text-blue-800";
      case "NOT_LOOKING":
        return "bg-slate-100 text-slate-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getAvailabilityLabel = (status: string) => {
    return status.split("_").join(" ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-slate-600 mb-4">{error || "Something went wrong"}</p>
          <button
            onClick={() => router.push("/candidate/profile/create")}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

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
                  {user?.name || "Candidate"}
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
              Candidate Dashboard
            </h2>
            <p className="text-slate-600">
              Manage your professional profile and job preferences
            </p>
          </div>

          {/* Profile Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Current Designation Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-slate-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">
                Current Designation
              </h3>
              <p className="text-2xl font-bold text-slate-900">
                {profile.currentDesignation}
              </p>
            </motion.div>

            {/* Experience Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-slate-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">
                Total Experience
              </h3>
              <p className="text-2xl font-bold text-slate-900">
                {profile.totalExperienceYears} {profile.totalExperienceYears === 1 ? 'Year' : 'Years'}
              </p>
            </motion.div>

            {/* Expected Salary Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-slate-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">
                Expected Salary
              </h3>
              <p className="text-2xl font-bold text-slate-900">
                {formatSalary(profile.expectedSalary)}
              </p>
            </motion.div>
          </div>

          {/* Additional Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-slate-200 p-6"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Profile Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Availability Status */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-slate-400" />
                  <h4 className="text-sm font-medium text-slate-600">
                    Availability Status
                  </h4>
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(
                    profile.availabilityStatus
                  )}`}
                >
                  {getAvailabilityLabel(profile.availabilityStatus)}
                </span>
              </div>

              {/* Work Type Preference */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <h4 className="text-sm font-medium text-slate-600">
                    Work Type Preference
                  </h4>
                </div>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800">
                  {profile.workTypePreference}
                </span>
              </div>

              {/* Profile Completion */}
              {profile.profileCompletion !== undefined && (
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-slate-400" />
                    <h4 className="text-sm font-medium text-slate-600">
                      Profile Completion
                    </h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${profile.profileCompletion}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {profile.profileCompletion}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
