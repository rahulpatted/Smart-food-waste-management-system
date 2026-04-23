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
import { useState } from "react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function LogisticsChart() {
  const [data] = useState({
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Rescue Efficiency",
        data: [65, 78, 82, 94],
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderRadius: 8,
        barThickness: 30,
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 12,
        callbacks: {
          label: (context) => ` 🚚 Success: ${context.raw}% recovered`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: (v) => `${v}%` },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 hover:border-indigo-500/30 transition-all group">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 transition-transform group-hover:scale-110">
          🚚
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            Logistics Efficiency
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 opacity-70">
            Redistribution Success Rate
          </p>
        </div>
      </div>

      <div className="h-[200px] w-full mt-6">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
