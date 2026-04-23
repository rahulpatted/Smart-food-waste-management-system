"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import API from "@/services/api";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ExpiryChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/waste")
      .then(({ data }) => {
        if (!data || data.length === 0) {
          setChartData(null);
          return;
        }

        // ONLY get items tagged with [AUTO-EXPIRED]
        const expiryLogs = data.filter((w) => w.type?.includes("[AUTO-EXPIRED]"));

        if (expiryLogs.length === 0) {
          setChartData({
            labels: ["Optimal Storage"],
            datasets: [
              {
                label: "Expiry Loss (kg)",
                data: [0],
                backgroundColor: "rgba(16, 185, 129, 0.4)",
                borderRadius: 6,
              },
            ],
          });
          return;
        }

        const recent = expiryLogs.slice(0, 7).reverse();
        const labels = recent.map((w) => {
          const d = new Date(w.createdAt || Date.now());
          return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        });
        const weights = recent.map((w) => w.weight || 0);

        setChartData({
          labels,
          datasets: [
            {
              label: "Expiry Loss (kg)",
              data: weights,
              backgroundColor: "rgba(245, 158, 11, 0.8)", // Amber/Orange for expiry
              borderRadius: 6,
            },
          ],
        });
      })
      .catch(() => setChartData(null))
      .finally(() => setLoading(false));
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => ` ⚠️ Expiry: ${context.parsed.y} kg`,
        },
      },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 hover:border-amber-500/30 transition-all group">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600 transition-transform group-hover:rotate-12">
          ⏳
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Expiry Impact</h2>
      </div>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-6 opacity-70">
        Loss due to shelf-life expiry
      </p>

      <div className="h-[350px] w-full">
        {loading ? (
          <div className="h-full w-full bg-slate-50 dark:bg-slate-900 rounded-2xl animate-pulse flex items-center justify-center">
            <span className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">
              Analyzing Storage...
            </span>
          </div>
        ) : chartData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className="h-full w-full flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              No Expiry Data Found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
