"use client";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function InventoryChart() {
  const [data] = useState({
    labels: ["Grains", "Staples", "Dairy", "Fruits"],
    datasets: [{
      label: "Stock Level",
      data: [45, 25, 15, 15],
      backgroundColor: [
        "rgba(245, 158, 11, 0.8)",
        "rgba(59, 130, 246, 0.8)",
        "rgba(16, 185, 129, 0.8)",
        "rgba(139, 92, 246, 0.8)"
      ],
      borderWidth: 0,
      hoverOffset: 20
    }]
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { weight: "600", size: 11 }
        }
      },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 12,
        callbacks: {
          label: (context) => ` 📦 ${context.label}: ${context.raw}% available`
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 hover:border-amber-500/30 transition-all group">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600 transition-transform group-hover:scale-110">
          📦
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Inventory Status</h2>
      </div>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6 opacity-70">Stock Availability</p>
      
      <div className="h-[250px] w-full relative">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
          <span className="text-2xl font-black text-slate-800 dark:text-white">82%</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Healthy</span>
        </div>
      </div>
    </div>
  );
}
