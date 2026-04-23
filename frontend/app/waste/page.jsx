"use client";
import WasteUpload from "@/components/Waste/WasteUpload";
import WasteAnalytics from "@/components/Charts/WasteAnalytics";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";

export default function Waste() {
  const { user } = useAuth() || {};
  const isStudent = user?.role === "student";

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
          className="absolute top-[-10%] right-[-5%] w-[35rem] h-[35rem] bg-rose-400/10 dark:bg-rose-500/5 rounded-full mix-blend-soft-light dark:mix-blend-multiply filter blur-[80px]"
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -60, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-emerald-400/15 dark:bg-emerald-500/10 rounded-full mix-blend-soft-light dark:mix-blend-multiply filter blur-[100px]"
        />
      </div>

      <Sidebar />
      <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)] px-6 lg:px-10 py-4 lg:py-6 relative z-10 transition-all duration-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.3em] mb-2">
                Operations Center
              </p>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                Waste Intelligence
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold text-sm leading-relaxed max-w-xl">
                Log and continuously monitor daily surplus across all dining operations to achieve
                net-zero targets.
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                Analytics Core
              </p>
              <div className="flex items-center justify-end gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  Active Sync
                </p>
              </div>
            </div>
          </header>

          <WasteAnalytics />

          {["staff", "admin"].includes(user?.role) ? (
            <div className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/5 p-8 relative overflow-hidden group">
              <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-slate-200 dark:bg-slate-700"></span> LOG NEW WASTE
                ENTRY
              </h2>
              <WasteUpload />
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-white/5 px-8 flex flex-col items-center justify-center py-16 rounded-[2rem] text-center shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-rose-500/5 to-transparent"></div>
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform bg-rose-50 dark:bg-rose-500/10 w-24 h-24 rounded-full flex items-center justify-center shadow-inner relative z-10 text-rose-500">
                🛡️
              </div>
              <p className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white relative z-10">
                Authorized Clearance Required
              </p>
              <p className="text-sm font-bold opacity-70 mt-3 uppercase tracking-widest text-slate-500 max-w-md relative z-10">
                Only Kitchen Staff and System Administrators have clearance to modify and
                authenticate daily waste logs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
