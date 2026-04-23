"use client";
import { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import API from "@/services/api";
import Skeleton from "@/components/Skeleton";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function WasteAnalytics() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/waste")
      .then((r) => setLogs(r.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );

  // --- Type breakdown (doughnut) ---
  const typeCounts = logs.reduce((acc, w) => {
    acc[w.type] = (acc[w.type] || 0) + (w.weight || 0);
    return acc;
  }, {});
  const typeLabels = Object.keys(typeCounts);
  const typeValues = Object.values(typeCounts);

  // --- Weekly totals (last 7 days bar) ---
  const dayMap = {};
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
    dayMap[key] = 0;
  }
  logs.forEach((w) => {
    const d = new Date(w.createdAt || w.date);
    const key = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
    if (key in dayMap) dayMap[key] += w.weight || 0;
  });

  const totalThisWeek = Object.values(dayMap).reduce((a, b) => a + b, 0);
  const avgPerDay = logs.length
    ? (logs.reduce((a, w) => a + (w.weight || 0), 0) / logs.length).toFixed(1)
    : 0;

  const donutData = {
    labels: typeLabels.length ? typeLabels : ["No data"],
    datasets: [
      {
        data: typeValues.length ? typeValues : [1],
        backgroundColor: ["#10b981", "#f43f5e", "#f59e0b", "#6366f1"],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: Object.keys(dayMap),
    datasets: [
      {
        label: "Waste (kg)",
        data: Object.values(dayMap),
        backgroundColor: "rgba(244, 63, 94, 0.75)",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Logs",
            value: logs.length,
            icon: "📋",
            color: "text-slate-700 dark:text-slate-200",
          },
          {
            label: "This Week (kg)",
            value: totalThisWeek.toFixed(1),
            icon: "📅",
            color: "text-rose-600",
          },
          { label: "Avg per Log (kg)", value: avgPerDay, icon: "⚖️", color: "text-amber-600" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-center shadow-sm"
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">Waste by Type</h3>
          <div className="max-w-[250px] mx-auto">
            <Doughnut
              data={donutData}
              options={{ plugins: { legend: { position: "bottom" } }, cutout: "65%" }}
            />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">Last 7 Days</h3>
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>
      </div>
    </div>
  );
}
