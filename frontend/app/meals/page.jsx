"use client";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TodaysMenu, BookingCard } from "@/components/Meal/MealBooking";
import MealCountdown from "@/components/Meal/MealCountdown";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";

export default function Meals() {
  const { user } = useAuth() || {};
  const router = useRouter();

  useEffect(() => {
    // Hard restrict to student role.
    if (user && user.role !== "student") {
      router.push("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 transition-colors relative overflow-hidden mesh-gradient">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-5%] left-[-10%] w-[45rem] h-[45rem] bg-orange-400/10 dark:bg-orange-500/5 rounded-full filter blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 100, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full filter blur-[120px]"
        />
      </div>

      <Sidebar />

      <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)] px-6 lg:px-10 py-4 lg:py-6 relative z-10 transition-all duration-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-10"
        >
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.3em] mb-2">
                Student Operations
              </p>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                Meal Booking Hub
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold text-sm leading-relaxed max-w-xl">
                Commit to zero-waste by pre-booking your next dining service.
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                Facility Uplink
              </p>
              <div className="flex items-center justify-end gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  Active
                </p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT STACK: Countdown + Booking */}
            <div className="lg:col-span-2 space-y-8">
              <MealCountdown />
              <div className="max-w-2xl mx-auto w-full">
                <BookingCard />
              </div>
            </div>

            {/* RIGHT: Today's Menu (Vertical Strip) */}
            <div className="lg:col-span-1">
              <TodaysMenu />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
