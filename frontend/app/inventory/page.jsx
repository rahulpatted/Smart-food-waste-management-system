"use client";
import { useState, useEffect } from "react";
import InventoryTable from "@/components/Inventory/InventoryTable";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import API from "@/services/api";

export default function Inventory() {
  const [filter, setFilter] = useState("All");
  const [expiryAlerts, setExpiryAlerts] = useState([]);

  useEffect(() => {
    API.get("/inventory")
      .then((res) => {
        const items = res.data || [];
        const soon = items.filter((i) => {
          if (!i.expiryDate) return false;
          const diff = (new Date(i.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
          return diff <= 3 && diff >= 0;
        });
        setExpiryAlerts(soon);
      })
      .catch(() => {});
  }, []);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 transition-colors relative overflow-hidden mesh-gradient">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={glowVariants}
          animate="animate"
          className="absolute top-[-10%] left-[-5%] w-[35rem] h-[35rem] bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full mix-blend-soft-light dark:mix-blend-multiply filter blur-[80px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-teal-400/20 dark:bg-teal-500/10 rounded-full mix-blend-soft-light dark:mix-blend-multiply filter blur-[100px]"
        />
      </div>

      <Sidebar />

      <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)] px-6 lg:px-10 py-4 lg:py-6 relative z-10 transition-all duration-200">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto space-y-10"
        >
          <motion.header
            variants={itemVariants}
            className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <p className="text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-[0.3em] mb-2">
                Operations Center
              </p>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                Pantry & Inventory
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold text-sm leading-relaxed max-w-xl">
                Manage stock levels, track ingredient expiry dates, and optimize procurement.
              </p>
            </div>
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="hidden md:block text-right"
            >
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                Inventory Status
              </p>
              <div className="flex items-center justify-end gap-2 mt-1">
                {expiryAlerts.length > 0 ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
                    <p className="text-xs font-bold text-rose-600 uppercase tracking-widest">
                      Attention Required
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                      Optimal
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </motion.header>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {["All", "Dairy", "Vegetables", "Fruits", "Grains", "Daily"].map((cat) => (
              <div
                key={cat}
                onClick={() => setFilter(cat)}
                className={`spotlight-card cursor-pointer p-6 rounded-[2rem] border transition-all duration-300 ${filter === cat ? "bg-white dark:bg-slate-800 border-emerald-500 shadow-xl shadow-emerald-500/10" : "bg-white/40 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 hover:border-emerald-500/30 shadow-sm"}`}
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                  Category
                </p>
                <p
                  className={`text-xl font-black uppercase tracking-tighter ${filter === cat ? "text-emerald-500" : "text-slate-700 dark:text-slate-300"}`}
                >
                  {cat}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants}>
            <InventoryTable activeFilter={filter.toLowerCase()} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
