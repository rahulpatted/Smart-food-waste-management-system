"use client";
import { motion } from "framer-motion";
import { Flame, Medal, TrendingUp, User } from "lucide-react";

const leaders = [
  { name: "Rahul P", pts: 2450, rank: 1, streak: 12 },
  { name: "Sneha M", pts: 2100, rank: 2, streak: 8 },
  { name: "Arjun K", pts: 1850, rank: 3, streak: 5 },
  { name: "Ananya S", pts: 1400, rank: 4, streak: 3 },
  { name: "Vikram R", pts: 950, rank: 5, streak: 2 },
];

export default function CampusLeaderboard() {
  return (
    <div className="bg-white/90 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-white dark:border-white/5 p-8 shadow-2xl h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div>
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 mb-1">
            <Medal size={14} className="text-indigo-500" /> Community Standings
          </h3>
          <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Elite Waste-Zero Heroes</p>
        </div>
        <div className="flex items-center gap-2 text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20">
           <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
           <span className="text-[9px] font-black uppercase tracking-widest">Live Uplink</span>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {leaders.map((leader, i) => (
          <motion.div 
            key={leader.name}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 group/row ${i === 0 ? "bg-gradient-to-r from-indigo-600 to-indigo-800 text-white border-indigo-400 shadow-[0_15px_30px_-5px_rgba(79,70,229,0.4)]" : "bg-white/50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-700 dark:text-white hover:border-indigo-500/40"}`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shadow-inner transition-transform group-hover/row:scale-105 ${i === 0 ? "bg-white text-indigo-600" : "bg-slate-100 dark:bg-slate-800/80 text-slate-500"}`}>
              {leader.rank}
            </div>
            <div className="flex-1 min-w-0">
               <p className={`text-xs font-black uppercase tracking-[0.1em] italic truncate ${i === 0 ? "text-white" : "text-slate-900 dark:text-white"}`}>{leader.name}</p>
               <div className="flex items-center gap-2 mt-1 opacity-80">
                  <Flame size={12} className={i === 0 ? "text-white" : "text-orange-500"} />
                  <span className="text-[9px] font-black uppercase tracking-[0.1em]">{leader.streak} Day Heat</span>
               </div>
            </div>
            <div className="text-right">
               <p className={`text-sm font-black tracking-tighter ${i === 0 ? "text-white" : "text-indigo-600 dark:text-indigo-400"}`}>{leader.pts.toLocaleString()}</p>
               <p className="text-[9px] font-black uppercase opacity-60 tracking-widest">Eco_Pts</p>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-10 py-5 bg-slate-50 dark:bg-white/5 hover:bg-indigo-500 hover:text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5 transition-all flex items-center justify-center gap-3 active:scale-95 group/btn">
        <TrendingUp size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" /> 
        Access Detailed Data
      </button>
    </div>
  );
}
