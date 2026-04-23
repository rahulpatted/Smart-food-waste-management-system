"use client";
import { DollarSign, TrendingUp, Trophy, ChefHat, Users, ListChecks } from "lucide-react";
import { motion } from "framer-motion";

export default function CanteenInsights({ stats = {}, userRole = "staff" }) {
  const savings = stats.totalWaste * 10 || 0;
  const totalBookings = stats.totalBookings || 0;
  const prepTarget = (totalBookings * 0.4).toFixed(1);

  const leaderboard = [
    { rank: 1, name: "Anita S.", points: 1240, badge: "Master Chef" },
    { rank: 2, name: "Rajesh K.", points: 1150, badge: "Waste Warrior" },
    { rank: 3, name: "Prathap V.", points: 980, badge: "Eco Guard" },
  ];

  const ngoLeaderboard = [
    { rank: 1, name: "Feeding India", points: 4500, badge: "Elite Partner" },
    { rank: 2, name: "Robin Hood Army", points: 3800, badge: "Top Distributor" },
    { rank: 3, name: "Rise NGO", points: 2900, badge: "Rapid Responder" },
  ];

  const isNGO = userRole === "ngo";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 relative z-10">
      {/* Financial & Demand Row / Logistics Row */}
      <div className="flex flex-col gap-8">
        {!isNGO ? (
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 italic">
                <TrendingUp size={16} className="text-emerald-400" />
                Demand Analytics
              </h3>
              <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
                  Live Uplink
                </span>
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4 bg-black/20 p-5 rounded-3xl border border-white/5 shadow-inner">
                {["Breakfast", "Lunch", "Dinner"].map((type) => (
                  <div key={type} className="text-center group/stat">
                    <p className="text-[9px] uppercase font-black text-indigo-300/60 mb-2 tracking-[0.2em]">
                      {type}
                    </p>
                    <p className="text-2xl font-black tracking-tighter text-white">
                      {(stats.mealSummary && stats.mealSummary[type]) || 0}
                    </p>
                    <div className="w-8 h-0.5 bg-indigo-500/40 mx-auto my-2 rounded-full group-hover/stat:w-12 transition-all"></div>
                    <p className="text-[8px] font-black text-indigo-200/40 uppercase tracking-widest mb-1 italic">
                      Prep
                    </p>
                    <p className="text-xs font-black text-emerald-400 underline decoration-indigo-500/50 underline-offset-4">
                      {(((stats.mealSummary && stats.mealSummary[type]) || 0) * 0.4).toFixed(1)}kg
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                  <p className="text-[10px] text-white font-black uppercase tracking-[0.1em] italic">
                    Current Cycle: {totalBookings} Total
                  </p>
                </div>
                <p className="text-[9px] text-indigo-200/60 font-black uppercase tracking-[0.2em] italic">
                  Sys. Suggestion: -12% OPTIMIZED
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl border border-white/10 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 italic">
                <Users size={16} className="text-purple-400" />
                Logistics Pulse
              </h3>
              <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-purple-400">
                  Global Scan
                </span>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-black/20 p-6 rounded-3xl border border-white/5 shadow-inner">
                <div className="text-center flex-1">
                  <p className="text-[9px] uppercase font-black text-purple-300/60 mb-2 tracking-[0.2em] italic">
                    Pickup Latency
                  </p>
                  <p className="text-4xl font-black tracking-tighter">24m</p>
                </div>
                <div className="w-px h-12 bg-white/10 mx-6"></div>
                <div className="text-center flex-1">
                  <p className="text-[9px] uppercase font-black text-purple-300/60 mb-2 tracking-[0.2em] italic">
                    Dispatch Rate
                  </p>
                  <p className="text-4xl font-black tracking-tighter text-emerald-400">98%</p>
                </div>
              </div>
              <p className="text-[9px] text-indigo-200/60 font-black uppercase tracking-[0.2em] italic text-center">
                Intel: 3 New Partners detected in local sector
              </p>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[2.5rem] p-8 text-white shadow-2xl border border-white/10 flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute -right-6 -bottom-6 text-white/5 group-hover:scale-125 transition-transform duration-700">
            <DollarSign size={150} />
          </div>
          <div className="flex items-center justify-between mb-10 relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 italic">
              <DollarSign size={16} />
              {isNGO ? "Impact Valuation" : "Operational Savings"}
            </h3>
            <span className="bg-white/20 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10">
              Projected
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-5xl font-black tracking-[0.05em] mb-3 italic">
              ₹{savings || "370.50"}
            </p>
            <p className="text-[9px] font-black text-emerald-100/60 uppercase tracking-[0.2em] leading-relaxed italic">
              {isNGO
                ? "Social value redistributed this cycle"
                : "Capital recovered via efficiency protocol"}
            </p>
          </div>
        </div>

        {!isNGO && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white shadow-2xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="flex items-center justify-between mb-10 relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 italic text-indigo-400">
                <Users size={16} />
                Collaborator Network
              </h3>
              <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">
                Verified
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-5xl font-black tracking-tighter mb-3">{stats.partnerCount || 0}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed italic">
                Active NGOs and Community Partners Linked
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard section */}
      <div className="bg-white/90 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] p-8 shadow-2xl border border-white dark:border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Trophy
            size={120}
            className="transform rotate-12 group-hover:scale-110 transition-transform text-amber-500"
          />
        </div>
        <div className="flex items-center justify-between mb-10 relative z-10">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 mb-1">
              <Trophy size={14} className="text-amber-500" /> Executive Pulse
            </h3>
            <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
              {isNGO ? "Top Distribution Partners" : "Elite Kitchen Operators"}
            </p>
          </div>
          <button className="text-[9px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest hover:underline px-4 py-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/10 transition-all">
            View All
          </button>
        </div>

        <div className="space-y-4 relative z-10">
          {(isNGO ? ngoLeaderboard : leaderboard).map((entity, i) => (
            <motion.div
              key={entity.name}
              initial={{ x: -15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 cursor-default group/item ${i === 0 ? "bg-slate-50 dark:bg-white/5 border-emerald-500/30" : "bg-slate-50/50 dark:bg-white/5 border-slate-100 dark:border-white/5 hover:border-emerald-500/20"}`}
            >
              <div className="flex items-center gap-5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-inner transition-transform group-hover/item:scale-110 ${
                    i === 0
                      ? "bg-emerald-500 text-white shadow-[0_5px_15px_rgba(16,185,129,0.4)]"
                      : "bg-white dark:bg-slate-800 text-slate-500 border border-slate-100 dark:border-white/5"
                  }`}
                >
                  {entity.rank}
                </div>
                <div>
                  <p
                    className={`text-xs font-black uppercase tracking-wider leading-none italic ${i === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}
                  >
                    {entity.name}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">
                      {entity.badge}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-black tracking-tighter ${i === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`}
                >
                  {entity.points.toLocaleString()}{" "}
                  <span className="text-[8px] opacity-60">PTS</span>
                </p>
                <div className="w-20 h-1.5 bg-slate-200 dark:bg-white/5 rounded-full mt-2.5 overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${i === 0 ? "bg-emerald-500" : "bg-indigo-500"}`}
                    style={{ width: `${(entity.points / 4500) * 100}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* RESTORED: Incoming Surplus Hub for Staff/Admin */}
      {["staff", "admin"].includes(userRole) && (
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] p-8 text-white shadow-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 italic">
              <ChefHat size={16} className="text-emerald-400" />
              Canteen Hub: Incoming
            </h3>
            <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
              Surplus Protocol
            </div>
          </div>
          <div className="space-y-4 relative z-10">
            {stats.donationsList &&
            stats.donationsList.filter((d) => d.status === "Claimed & Collected").length > 0 ? (
              stats.donationsList
                .filter((d) => d.status === "Claimed & Collected")
                .map((d, i) => (
                  <div
                    key={d._id}
                    className="p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl drop-shadow-lg">📦</div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest italic">
                          {d.ngoName || "Assigned Entity"}
                        </p>
                        <p className="text-[10px] text-slate-400 font-black mt-1 uppercase opacity-60 tracking-tight">
                          {d.foodAmount}kg Surplus • {d.location}
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                      ✓
                    </div>
                  </div>
                ))
            ) : (
              <div className="p-10 text-center bg-black/20 rounded-[2rem] border border-dashed border-white/5">
                <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] italic">
                  No active incoming deliveries
                </p>
              </div>
            )}

            {stats.donationsList &&
              stats.donationsList.filter((d) => d.status === "Claimed & Collected").length > 0 && (
                <button className="w-full py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)] mt-6 active:scale-95">
                  Acknowledge & Sync Inventory
                </button>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
