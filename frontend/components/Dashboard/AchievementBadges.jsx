"use client";
import { motion } from "framer-motion";
import { Trophy, Star, Zap, Heart, Award } from "lucide-react";

const badges = [
  { id: "saver_initiate", title: "Saver Initiate", icon: Star, color: "bg-amber-400", desc: "First pre-booked meal", pts: 50 },
  { id: "green_streak", title: "Green Streak", icon: Zap, color: "bg-emerald-400", desc: "3 days in a row", pts: 150 },
  { id: "community_hero", title: "Community Hero", icon: Heart, color: "bg-rose-400", desc: "Volunteer assist", pts: 300 },
  { id: "waste_zero", title: "Waste Zero", icon: Award, color: "bg-indigo-400", desc: "10+ meals saved", pts: 500 },
];

export default function AchievementBadges({ userAchievements = [] }) {
  return (
    <div className="bg-white/90 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-white dark:border-white/5 p-8 shadow-2xl relative overflow-hidden group/card">
      <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -ml-16 -mt-16"></div>
      
      <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-10 flex items-center gap-2 relative z-10">
        <Trophy size={14} className="text-amber-500" /> Operational Merits
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 relative z-10">
        {badges.map((badge) => {
          const isUnlocked = userAchievements.includes(badge.id);
          const Icon = badge.icon;
          
          return (
            <motion.div 
              key={badge.id}
              whileHover={{ y: -8, scale: 1.05 }}
              className={`flex flex-col items-center text-center group transition-all duration-500 ${isUnlocked ? "opacity-100" : "opacity-30"}`}
            >
              <div className={`relative w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-4 transition-all duration-700 shadow-2xl ${isUnlocked ? badge.color + " rotate-3 border-2 border-white/20 shadow-" + badge.color.split('-')[1] + "-500/30" : "bg-slate-100/50 dark:bg-slate-800/80 border-2 border-dashed border-slate-300 dark:border-slate-700"}`}>
                <Icon size={32} className={isUnlocked ? "text-white drop-shadow-lg" : "text-slate-400"} />
                
                {isUnlocked && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border-2 border-emerald-500 shadow-xl">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
                  </div>
                )}

                {/* Cyber Scanner Effect */}
                {isUnlocked && (
                  <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 ease-in-out pointer-events-none rounded-[1.5rem]"></div>
                )}
              </div>
              
              <p className={`text-[10px] font-black uppercase tracking-[0.1em] italic leading-tight ${isUnlocked ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                {badge.title}
              </p>
              <div className={`mt-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${isUnlocked ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-slate-100/50 dark:bg-slate-800/50 text-slate-400"}`}>
                {isUnlocked ? "Verified" : `${badge.pts} Pts`}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
