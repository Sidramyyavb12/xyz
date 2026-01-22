"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  Briefcase,
  User,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
} from "lucide-react";
import { recruiterAPI, RecruiterProfile } from "@/lib/api/recruiter";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";

export default function RecruiterDashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        router.push("/login");
        return;
      }

      try {
        const profileData = await recruiterAPI.getProfileByUserId(user.id);
        setProfile(profileData);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        if (err?.response?.status === 404) {
          // Profile not found, redirect to create
          router.push("/recruiter/profile/create");
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

  const getVerificationStatus = () => {
    if (profile?.isVerified) {
      return {
        label: "Verified",
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-4 h-4" />,
      };
    }
    
    if (profile?.verificationStatus === "REJECTED") {
      return {
        label: "Rejected",
        color: "bg-red-100 text-red-800",
        icon: <XCircle className="w-4 h-4" />,
      };
    }
    
    return {
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
      icon: <Clock className="w-4 h-4" />,
    };
  };

  const getRecruiterTypeLabel = (type: string) => {
    return type.split("_").join(" ");
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
            onClick={() => router.push("/recruiter/profile/create")}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  const verificationStatus = getVerificationStatus();

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
                  {user?.name || "Recruiter"}
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
              Recruiter Dashboard
            </h2>
            <p className="text-slate-600">
              Manage your recruiting profile and company information
            </p>
          </div>

          {/* Profile Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Company Name Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-slate-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">
                Company Name
              </h3>
              <p className="text-2xl font-bold text-slate-900">
                {profile.companyName}
              </p>
            </motion.div>

            {/* Designation Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-slate-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">
                Your Designation
              </h3>
              <p className="text-2xl font-bold text-slate-900">
                {profile.designation}
              </p>
            </motion.div>

            {/* Recruiter Type Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-slate-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">
                Recruiter Type
              </h3>
              <p className="text-xl font-bold text-slate-900">
                {getRecruiterTypeLabel(profile.recruiterType)}
              </p>
            </motion.div>
          </div>

          {/* Verification Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-slate-200 p-6"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Account Status
            </h3>

            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${verificationStatus.color}`}>
                {verificationStatus.icon}
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-600 mb-1">
                  Verification Status
                </h4>
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${verificationStatus.color}`}
                >
                  {verificationStatus.icon}
                  {verificationStatus.label}
                </span>
              </div>
            </div>

            {!profile.isVerified && profile.verificationStatus !== "REJECTED" && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Your account is pending verification. You will be notified once the verification is complete.
                </p>
              </div>
            )}

            {profile.verificationStatus === "REJECTED" && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  Your verification request was rejected. Please contact support for more information.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
