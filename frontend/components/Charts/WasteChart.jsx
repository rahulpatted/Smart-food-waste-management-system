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

export default function WasteChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/waste")
      .then(({ data }) => {
        const ctx = document.createElement("canvas").getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, "rgba(244, 63, 94, 0.9)");
        gradient.addColorStop(1, "rgba(244, 63, 94, 0.2)");

        if (!data || data.length === 0) {
          setChartData({
            labels: ["No data yet"],
            datasets: [
              {
                label: "Food Waste (kg)",
                data: [0],
                backgroundColor: gradient,
                borderRadius: 12,
              },
            ],
          });
          return;
        }

        const operationalWaste = data.filter((w) => !w.type?.includes("[AUTO-EXPIRED]"));
        const recent = operationalWaste.slice(0, 7).reverse();
        const labels = recent.map((w) => {
          const d = new Date(w.createdAt || Date.now());
          return d.toLocaleDateString("en-IN", { weekday: "short" });
        });
        const weights = recent.map((w) => w.weight || 0);

        setChartData({
          labels,
          datasets: [
            {
              label: "Food Waste (kg)",
              data: weights,
              backgroundColor: gradient,
              hoverBackgroundColor: "rgba(244, 63, 94, 1)",
              borderRadius: 12,
              borderSkipped: false,
              barThickness: 30,
            },
          ],
        });
      })
      .catch(() => {
        setChartData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 12,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => ` 🗑️ Waste: ${context.parsed.y} kg`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 hover:border-rose-500/30 transition-all group">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 bg-rose-50 dark:bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-600 transition-transform group-hover:scale-110">
          🗑️
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Waste Analytics</h2>
      </div>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-6 opacity-70">
        Weekly Disposal Trends
      </p>

      <div className="h-[350px] w-full">
        {loading && (
          <div className="h-full w-full bg-slate-50 dark:bg-slate-900 rounded-2xl animate-pulse flex items-center justify-center">
            <span className="text-slate-400 font-bold text-xs tracking-widest uppercase">
              Fetching Logs...
            </span>
          </div>
        )}
        {!loading && !chartData && (
          <p className="text-red-400 text-sm">Failed to load data. Check backend.</p>
        )}
        {!loading && chartData && <Bar data={chartData} options={options} />}
      </div>
    </div>
  );
}
