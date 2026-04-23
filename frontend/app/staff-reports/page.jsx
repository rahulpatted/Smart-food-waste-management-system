"use client";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Download,
  TrendingDown,
  TrendingUp,
  Leaf,
  DollarSign,
  Users,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/components/ToastProvider";

const stats = [
  {
    label: "Total Waste This Week",
    value: "48 kg",
    change: "-12%",
    up: false,
    icon: TrendingDown,
    color: "emerald",
  },
  {
    label: "Est. Cost Saved",
    value: "₹5,760",
    change: "+8%",
    up: true,
    icon: DollarSign,
    color: "blue",
  },
  { label: "Meals Donated", value: "134", change: "+22%", up: true, icon: Leaf, color: "violet" },
  { label: "Active Students", value: "318", change: "+4%", up: true, icon: Users, color: "amber" },
];

const wasteTrend = [
  { day: "Mon", kg: 12 },
  { day: "Tue", kg: 8 },
  { day: "Wed", kg: 15 },
  { day: "Thu", kg: 6 },
  { day: "Fri", kg: 10 },
  { day: "Sat", kg: 4 },
];

const maxKg = Math.max(...wasteTrend.map((d) => d.kg));

const alerts = [
  { msg: "Milk batch #M502 expires tomorrow", level: "error" },
  { msg: "Dal quantity below threshold (8 units)", level: "warning" },
  { msg: "Friday dinner waste exceeds weekly average by 40%", level: "warning" },
];

export default function StaffReportsPage() {
  const { user } = useAuth() || {};
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (user && user.role === "student") router.push("/dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const downloadReport = () => {
    const csv = ["Day,Waste (kg)", ...wasteTrend.map((d) => `${d.day},${d.kg}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `waste_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast("📥 Weekly waste report downloaded!", "success");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BarChart3 size={100} />
        </div>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <BarChart3 size={22} />
              </div>
              <h1 className="text-2xl font-black">Staff Reports</h1>
            </div>
            <p className="text-blue-100 font-medium text-sm max-w-lg">
              Weekly analytics, waste trends, and operational alerts for canteen staff.
            </p>
          </div>
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 rounded-xl font-black text-xs uppercase tracking-wider hover:scale-105 transition-all shadow-xl mt-1"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </motion.div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-${s.color}-500/10 text-${s.color}-500 flex items-center justify-center mb-4`}
            >
              <s.icon size={20} />
            </div>
            <p className="text-2xl font-black text-slate-800 dark:text-white">{s.value}</p>
            <p className="text-xs font-medium text-slate-500 mt-1 leading-tight">{s.label}</p>
            <div
              className={`flex items-center gap-1 mt-2 text-xs font-black ${s.up ? "text-emerald-500" : "text-emerald-500"}`}
            >
              {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{s.change} vs last week</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Waste Trend Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <TrendingDown size={18} className="text-emerald-500" /> Daily Waste Trend (kg)
        </h3>
        <div className="flex items-end gap-4 h-40">
          {wasteTrend.map((d, i) => (
            <motion.div
              key={d.day}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              style={{ originY: 1 }}
              className="flex flex-col items-center gap-2 flex-1"
            >
              <span className="text-xs font-black text-slate-600 dark:text-slate-400">
                {d.kg}kg
              </span>
              <div
                className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-blue-400 shadow-lg shadow-blue-500/20"
                style={{ height: `${(d.kg / maxKg) * 100}%` }}
              />
              <span className="text-xs font-bold text-slate-500">{d.day}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-500" /> Active Alerts & Recommendations
        </h3>
        {alerts.map((a, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-3 rounded-xl border text-sm font-medium ${a.level === "error" ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400" : "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400"}`}
          >
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
            {a.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
