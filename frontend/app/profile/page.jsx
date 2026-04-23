"use client";
import { useAuth } from "@/components/AuthProvider";
import { useDarkMode } from "@/components/DarkModeProvider";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ToastProvider";
import API from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Moon, Sun, Smartphone, Mail, Key } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth() || {};
  const darkMode = useDarkMode();
  const router = useRouter();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", location: "" });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [activeTab, setActiveTab] = useState("identity");

  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    smsAlerts: false,
  });

  const togglePref = (key) => {
    setPreferences((prev) => {
      const newState = { ...prev, [key]: !prev[key] };
      toast(`Preference updated`, "success");
      return newState;
    });
  };

  useEffect(() => {
    if (!user) router.push("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchData = async () => {
    console.log("🚀 [UPLINK DIAGNOSTIC] Initiating Profile Data Fetch...");
    const startTime = performance.now();
    try {
      const [profileRes, statsRes] = await Promise.all([
        API.get("/user/profile").then((res) => {
          console.log(
            `✅ [UPLINK] /user/profile received in ${Math.round(performance.now() - startTime)}ms`
          );
          return res;
        }),
        API.get("/user/stats").then((res) => {
          console.log(
            `✅ [UPLINK] /user/stats received in ${Math.round(performance.now() - startTime)}ms`
          );
          return res;
        }),
      ]);
      setProfile(profileRes.data);
      setStats(statsRes.data);
      setEditForm({
        name: profileRes.data.name || "",
        email: profileRes.data.email || "",
        phone: profileRes.data.phone || "",
        location: profileRes.data.location || "",
      });
      console.log(
        `🏁 [UPLINK] Profile Ready. Total Latency: ${Math.round(performance.now() - startTime)}ms`
      );
    } catch (err) {
      console.error("❌ [UPLINK ERROR]", err);
      toast("Error fetching user data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put("/user/profile", editForm);
      setProfile(data);
      setIsEditing(false);
      toast("Profile updated successfully ♻️", "success");
    } catch (err) {
      toast(err.response?.data?.message || "Failed to update profile", "error");
    }
  };

  const roleColor = {
    admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
    staff: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    student: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    donor: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    ngo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
  };

  const rolePerms = {
    admin: [
      { p: "View all data", s: "allowed" },
      { p: "Manage users", s: "allowed" },
      { p: "Delete records", s: "allowed" },
      { p: "Access all routes", s: "allowed" },
    ],
    staff: [
      { p: "Log waste", s: "allowed" },
      { p: "Manage inventory", s: "allowed" },
      { p: "Create meals", s: "allowed" },
      { p: "Delete records", s: "restricted" },
    ],
    student: [
      { p: "Book Meals", s: "allowed" },
      { p: "View Waste Reports", s: "allowed" },
      { p: "Add Food Donation", s: "restricted" },
      { p: "Access Live Map", s: "restricted" },
    ],
    donor: [
      { p: "Add Food Donation", s: "allowed" },
      { p: "Accept Donations", s: "restricted" },
      { p: "View Waste Reports", s: "allowed" },
      { p: "Access Live Map", s: "allowed" },
    ],
    ngo: [
      { p: "Accept Donations", s: "allowed" },
      { p: "Access Live Map", s: "allowed" },
      { p: "Add Food Donation", s: "pending" },
      { p: "View Waste Reports", s: "allowed" },
    ],
  };
  let perms = rolePerms[user?.role] || [];

  const glowVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 transition-colors relative overflow-hidden mesh-gradient">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={glowVariants}
          animate="animate"
          className="absolute top-[-10%] right-[-5%] w-[35rem] h-[35rem] bg-emerald-400/15 dark:bg-emerald-500/10 rounded-full mix-blend-soft-light dark:mix-blend-multiply filter blur-[80px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-indigo-400/15 dark:bg-indigo-500/10 rounded-full mix-blend-soft-light dark:mix-blend-multiply filter blur-[100px]"
        />
      </div>

      <Sidebar />
      <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)] px-6 lg:px-10 py-4 lg:py-6 relative z-10 transition-all duration-200">
        {!user || loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin text-4xl text-emerald-500">♻️</div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.3em] mb-2">
                  Authenticated Identity: {user.role}
                </p>
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                  Profile Command
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold text-sm leading-relaxed max-w-xl">
                  Manage your identity credentials, system preferences, and track your individual
                  contribution to the global ecosystem.
                </p>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                  Account Status
                </p>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    Verified
                  </p>
                </div>
              </div>
            </header>

            {/* Tab Navigation */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => setActiveTab("identity")}
                className={`px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all whitespace-nowrap ${activeTab === "identity" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-white dark:bg-slate-800/60 text-slate-500 hover:bg-emerald-50 dark:hover:bg-slate-700"}`}
              >
                Identity & Stats
              </button>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all whitespace-nowrap ${activeTab === "preferences" ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "bg-white dark:bg-slate-800/60 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
              >
                Preferences
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all whitespace-nowrap ${activeTab === "security" ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "bg-white dark:bg-slate-800/60 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
              >
                Security Engine
              </button>
            </div>

            <AnimatePresence>
              {activeTab === "identity" && (
                <motion.div
                  key="identity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 xl:grid-cols-3 gap-8"
                >
                  {/* Left Column: Profile Card & Settings */}
                  <div className="space-y-8 xl:col-span-1">
                    {/* Avatar card */}
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/5 p-8 flex flex-col items-center text-center relative overflow-hidden group"
                    >
                      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-emerald-500/20 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/5 -z-10"></div>
                      <div className="relative cursor-pointer mb-6 transform group-hover:scale-105 transition-transform duration-500 z-10">
                        <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <label
                          htmlFor="avatar-upload"
                          className="w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-5xl font-black text-white shadow-2xl relative overflow-hidden ring-4 ring-white dark:ring-slate-800"
                        >
                          {profile?.name?.[0]?.toUpperCase() ||
                            user.role?.[0]?.toUpperCase() ||
                            "U"}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-black uppercase tracking-widest leading-tight">
                              Update
                              <br />
                              Photo
                            </span>
                          </div>
                        </label>
                        <input
                          type="file"
                          id="avatar-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            toast("Profile picture updated (mock) 📸", "success");
                          }}
                        />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800">
                          <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                        </div>
                      </div>

                      <h2 className="text-2xl font-black text-slate-900 dark:text-white truncate w-full tracking-tight">
                        {profile?.name || "User"}
                      </h2>
                      <div className="mt-2 text-sm text-slate-500 dark:text-slate-400 flex flex-col gap-1 items-center">
                        <span
                          className={`inline-block font-black px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-[0.2em] shadow-sm ${roleColor[user.role] || "bg-slate-100 text-slate-700"}`}
                        >
                          {user.role === "student" ? "BENEFICIARY" : user.role?.toUpperCase()}
                        </span>
                      </div>

                      <div className="w-full mt-8 flex flex-col gap-3">
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="w-full py-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black uppercase tracking-widest text-xs hover:bg-emerald-500 dark:hover:bg-emerald-400 hover:text-white transition-all shadow-xl hover:shadow-emerald-500/20 active:scale-95"
                        >
                          {isEditing ? "Discard Changes" : "Edit Profile"}
                        </button>
                        <button
                          onClick={logout}
                          className="w-full py-4 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 font-black uppercase tracking-widest text-xs hover:bg-rose-500 hover:text-white transition-all border border-rose-100 dark:border-rose-500/20 shadow-sm active:scale-95"
                        >
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Column: Details, Stats, Permissions */}
                  <div className="space-y-8 xl:col-span-2">
                    {isEditing ? (
                      <motion.form
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleUpdate}
                        className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/5 p-8 outline outline-4 outline-emerald-500/10"
                      >
                        <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                          <span className="w-8 h-px bg-slate-200 dark:bg-slate-700"></span>{" "}
                          CREDENTIAL UPDATE
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              required
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full px-5 py-4 rounded-xl border dark:border-white/10 dark:bg-slate-900/50 text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              required
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              className="w-full px-5 py-4 rounded-xl border dark:border-white/10 dark:bg-slate-900/50 text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white transition-all opacity-80 cursor-not-allowed"
                              disabled
                              title="Email change requires administrative approval"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="text"
                              value={editForm.phone}
                              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                              className="w-full px-5 py-4 rounded-xl border dark:border-white/10 dark:bg-slate-900/50 text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white transition-all"
                              placeholder="Optional"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                              Primary Location
                            </label>
                            <input
                              type="text"
                              value={editForm.location}
                              onChange={(e) =>
                                setEditForm({ ...editForm, location: e.target.value })
                              }
                              className="w-full px-5 py-4 rounded-xl border dark:border-white/10 dark:bg-slate-900/50 text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white transition-all"
                              placeholder="City or area"
                            />
                          </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 font-black text-xs uppercase tracking-widest transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                          >
                            Commit Changes
                          </button>
                        </div>
                      </motion.form>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/5 p-8"
                      >
                        <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                          <span className="w-8 h-px bg-slate-200 dark:bg-slate-700"></span> IDENTITY
                          LEDGER
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                          <div className="group">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-emerald-500 transition-colors">
                              Registered Email
                            </p>
                            <p className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                              {profile?.email}
                            </p>
                          </div>
                          <div className="group">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-emerald-500 transition-colors">
                              Contact Number
                            </p>
                            <p className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                              {profile?.phone || (
                                <span className="opacity-50 italic">Not initialized</span>
                              )}
                            </p>
                          </div>
                          <div className="group sm:col-span-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-emerald-500 transition-colors">
                              Operational Sector / Location
                            </p>
                            <p className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                              {profile?.location || (
                                <span className="opacity-50 italic">Global System default</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Stats Section */}
                    {stats && (
                      <div>
                        <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4 mt-8 flex items-center gap-3">
                          <span className="w-8 h-px bg-slate-200 dark:bg-slate-700"></span> IMPACT
                          TELEMETRY
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {/* Students exclusively see Meals */}
                          {user.role === "student" && (
                            <div className="bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-white/5 p-6 text-center shadow-xl hover:scale-105 hover:border-emerald-500/30 transition-all duration-300 group">
                              <div className="text-4xl mb-4 group-hover:-translate-y-2 transition-transform">
                                🍱
                              </div>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                                Meals Booked
                              </p>
                              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                                {stats.mealsBooked}
                              </p>
                            </div>
                          )}

                          {/* Donors and NGOs interact with donations */}
                          {["donor", "ngo"].includes(user.role) && (
                            <div className="bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-white/5 p-6 text-center shadow-xl hover:scale-105 hover:border-emerald-500/30 transition-all duration-300 group">
                              <div className="text-4xl mb-4 group-hover:-translate-y-2 transition-transform">
                                🤝
                              </div>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                                {user.role === "donor" ? "Donations Made" : "Donations Handled"}
                              </p>
                              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                                {stats.donationsMade}
                              </p>
                            </div>
                          )}

                          {/* Everyone except students track food saved */}
                          {user.role !== "student" && (
                            <div className="bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-white/5 p-6 text-center shadow-xl hover:scale-105 hover:border-emerald-500/30 transition-all duration-300 group">
                              <div className="text-4xl mb-4 group-hover:-translate-y-2 transition-transform">
                                ⚖️
                              </div>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                                Food Saved
                              </p>
                              <p className="text-3xl font-black text-emerald-500 tracking-tighter">
                                {stats.foodSaved} <span className="text-lg">kg</span>
                              </p>
                            </div>
                          )}

                          {/* Staff, Admins, and NGOs care about macro waste reduction */}
                          {["admin", "staff", "ngo"].includes(user.role) && (
                            <div className="bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-white/5 p-6 text-center shadow-xl hover:scale-105 hover:border-emerald-500/30 transition-all duration-300 group">
                              <div className="text-4xl mb-4 group-hover:-translate-y-2 transition-transform">
                                📉
                              </div>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                                Waste Reduced
                              </p>
                              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                                14%
                              </p>
                            </div>
                          )}

                          {/* Logic for tracking session */}
                          <div className="bg-slate-900 dark:bg-white/5 rounded-3xl border border-slate-800 dark:border-white/5 p-6 text-center shadow-xl hover:scale-105 transition-all duration-300 group col-span-2 sm:col-span-1 flex flex-col justify-center items-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <div className="text-3xl mb-3 relative z-10 text-emerald-400">⏱️</div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 relative z-10">
                              Last Uplink
                            </p>
                            <p className="text-sm font-black text-white relative z-10">
                              {new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Advanced UI Requirements Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Smart Features / Analytics */}
                      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[2rem] shadow-xl border border-emerald-500/20 p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700"></div>
                        <h2 className="text-xs font-black text-emerald-200 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                          <span className="text-xl">✨</span> SYSTEM INTEL
                        </h2>
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">
                              Global Impact Score
                            </p>
                            <p className="text-5xl font-black tracking-tighter">
                              94<span className="text-2xl opacity-60 ml-1">/100</span>
                            </p>
                          </div>
                          <div className="text-6xl opacity-80 group-hover:scale-110 transition-transform">
                            🏆
                          </div>
                        </div>
                        <div className="bg-black/20 rounded-xl p-4 backdrop-blur-md border border-white/10">
                          <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest mb-3">
                            Priority Directives:
                          </p>
                          <ul className="space-y-3 text-sm font-bold opacity-90">
                            <li className="flex items-start gap-3 leading-snug">
                              <span className="text-emerald-300">→</span> Target high-waste areas
                              near Downtown campus sectors.
                            </li>
                            <li className="flex items-start gap-3 leading-snug">
                              <span className="text-emerald-300">→</span> Recommended meal size
                              reduction module: 10%
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "preferences" && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {/* Notifications */}
                  <div className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/5 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-700/60">
                      <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                        <span className="w-6 h-px bg-slate-200 dark:bg-slate-700"></span>
                        Alert Configurations
                      </h2>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                            <Mail size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-white">
                              Email Communications
                            </p>
                            <p className="text-xs text-slate-500 font-medium mt-1">
                              Receive daily digests and major system alerts.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => togglePref("emailAlerts")}
                          className={`w-12 h-6 rounded-full transition-colors relative ${preferences.emailAlerts ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"}`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${preferences.emailAlerts ? "left-7" : "left-1"}`}
                          ></div>
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                            <Smartphone size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-white">
                              SMS Push Alerts
                            </p>
                            <p className="text-xs text-slate-500 font-medium mt-1">
                              Urgent donation pickups and critical warnings.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => togglePref("smsAlerts")}
                          className={`w-12 h-6 rounded-full transition-colors relative ${preferences.smsAlerts ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"}`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${preferences.smsAlerts ? "left-7" : "left-1"}`}
                          ></div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Appearance */}
                  <div className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/5 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-700/60">
                      <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                        <span className="w-6 h-px bg-slate-200 dark:bg-slate-700"></span>
                        Appearance
                      </h2>
                    </div>
                    <div className="p-8 text-center space-y-4">
                      <div className="flex items-center justify-center gap-4 bg-slate-50 dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => !darkMode.dark && darkMode.toggle()}
                          className={`flex-1 py-3 flex justify-center items-center gap-2 rounded-xl text-sm font-bold transition-all ${!darkMode.dark ? "bg-white shadow-md text-slate-900 border border-slate-200" : "text-slate-500 hover:bg-slate-800"}`}
                        >
                          <Sun size={16} /> Light
                        </button>
                        <button
                          onClick={() => darkMode.dark && darkMode.toggle()}
                          className={`flex-1 py-3 flex justify-center items-center gap-2 rounded-xl text-sm font-bold transition-all ${darkMode.dark ? "bg-slate-800 shadow-xl border border-slate-700 text-white" : "text-slate-500 hover:bg-white"}`}
                        >
                          <Moon size={16} /> Dark
                        </button>
                      </div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-4">
                        Overrides operating system color scheme.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {/* Security Features */}
                  <div className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] shadow-xl border border-rose-500/10 p-8">
                    <h2 className="text-xs font-black text-rose-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                      <span className="w-6 h-px bg-rose-500/30"></span> SECURITY PROTOCOLS
                    </h2>

                    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-white/5 group mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
                          <Shield size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">
                            Two-Factor Auth
                          </p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                            Biometric / OTP
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setTwoFactorEnabled(!twoFactorEnabled);
                          if (!twoFactorEnabled)
                            toast("OTP verification setup requested.", "success");
                        }}
                        className={`flex flex-shrink-0 items-center px-1 w-12 h-6 rounded-full transition-colors shadow-inner ${twoFactorEnabled ? "bg-rose-500" : "bg-slate-300 dark:bg-slate-600"}`}
                      >
                        <span
                          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${twoFactorEnabled ? "translate-x-6" : "translate-x-0"}`}
                        />
                      </button>
                    </div>

                    <div className="bg-rose-50 dark:bg-rose-900/10 p-4 rounded-xl border border-rose-100 dark:border-rose-900/20 mb-6">
                      <div className="flex gap-3">
                        <Key size={16} className="text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white text-sm">
                            Active Session
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            You signed in from Chrome on Windows 10 today.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="w-full text-left text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex justify-between items-center group"
                      >
                        Update Access Key
                        <span
                          className={`transform transition-transform text-slate-400 ${showPasswordForm ? "rotate-180" : ""}`}
                        >
                          ▼
                        </span>
                      </button>
                      <AnimatePresence>
                        {showPasswordForm && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="grid space-y-3 overflow-hidden"
                          >
                            <input
                              type="password"
                              placeholder="Current Key"
                              className="w-full mt-4 px-4 py-3 text-sm font-bold rounded-xl border dark:border-white/10 dark:bg-slate-900/50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                            <input
                              type="password"
                              placeholder="New Key Sequence"
                              className="w-full px-4 py-3 text-sm font-bold rounded-xl border dark:border-white/10 dark:bg-slate-900/50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                            <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest mt-2 hover:bg-emerald-500 dark:hover:bg-emerald-400 hover:text-white transition-all">
                              Execute Key Change
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/5 p-8">
                    <h2 className="text-xs font-black text-rose-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                      <span className="w-6 h-px bg-rose-500/30"></span> ACCOUNT DANGER ZONE
                    </h2>
                    <div className="space-y-4">
                      <button className="w-full py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 font-bold text-sm tracking-wide transition-all text-center">
                        Download Personal Vault Data
                      </button>
                      <button className="w-full py-4 rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 font-bold text-sm tracking-wide transition-all text-center border border-rose-100 dark:border-rose-900/30">
                        Request Account Deletion
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center mt-6 uppercase tracking-widest leading-relaxed">
                      Account deletion is permanent and wipes all Eco-Warrior logs from the global
                      ledger.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
