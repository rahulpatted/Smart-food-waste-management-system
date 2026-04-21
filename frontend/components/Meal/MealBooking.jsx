"use client";
import { useState, useEffect } from "react";
import API from "@/services/api";
import { useAuth } from "@/components/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, CheckCircle2, ChevronRight, Clock, Info, Calendar, Sparkles, Leaf } from "lucide-react";

export default function MealBooking() {
  return null; // This default export will be replaced in app/meals/page.jsx
}

export function TodaysMenu() {
  const [todayMenu, setTodayMenu] = useState({ Breakfast: "TBD", Lunch: "TBD", Dinner: "TBD" });
  const [loading, setLoading] = useState(true);

  const fetchTodayMenu = async () => {
    try {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = days[new Date().getDay()];
      const { data } = await API.get("/menu");
      const filtered = data.filter(m => m.day === today);
      const menuObj = { Breakfast: "TBD", Lunch: "TBD", Dinner: "TBD" };
      filtered.forEach(m => menuObj[m.mealType] = m.foodItem);
      setTodayMenu(menuObj);
    } catch (err) {
      console.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayMenu();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2.5rem] p-8 text-white border border-white/10 relative overflow-hidden group shadow-2xl h-full flex flex-col highlight-shadow"
    >
      <div className="absolute -right-20 -top-20 text-white/5 group-hover:scale-110 transition-transform duration-1000">
         <Calendar size={300} />
      </div>
      
      <div className="relative z-10 h-full flex flex-col">
         <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Live Pulse</h3>
              </div>
              <h2 className="text-3xl font-black tracking-tighter italic bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Today's Menu</h2>
            </div>
         </div>

         <div className="space-y-5 flex-grow">
            {Object.entries(todayMenu).map(([type, food], i) => (
              <motion.div 
                key={type} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group/item flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-500 cursor-default"
              >
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-xl border border-white/5 transition-all duration-500 ${type === 'Breakfast' ? 'bg-orange-500/20 group-hover/item:border-orange-500/50' : type === 'Lunch' ? 'bg-blue-500/20 group-hover/item:border-blue-500/50' : 'bg-indigo-500/20 group-hover/item:border-indigo-500/50'}`}>
                       {type === 'Breakfast' ? "🌅" : type === "Lunch" ? "🍱" : "🌙"}
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{type} Window</p>
                       <p className="text-sm font-black tracking-tight text-white group-hover/item:text-emerald-400 transition-colors uppercase">
                        {loading ? "Loading..." : food}
                       </p>
                    </div>
                 </div>
                 <div className="text-slate-600 group-hover/item:text-emerald-500 transition-colors transform group-hover/item:translate-x-1 duration-300">
                    <ChevronRight size={18} />
                 </div>
              </motion.div>
            ))}
         </div>

         <div className="mt-10 p-5 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 flex items-center gap-4 relative overflow-hidden group/tip">
            <div className="absolute inset-0 bg-emerald-500/5 translate-x-[-100%] group-hover/tip:translate-x-[100%] transition-transform duration-1000 linear"></div>
            <div className="shrinking-0 text-emerald-500 relative z-10"><Info size={24} /></div>
            <p className="text-[10px] font-medium text-emerald-100/70 leading-relaxed italic relative z-10">
               "Join 1,240 students today in precision cooking for a zero-waste campus."
            </p>
         </div>
      </div>
    </motion.div>
  );
}

export function BookingCard() {
  const { user, refreshUser } = useAuth() || {};
  const [mealType, setMealType] = useState("Lunch");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const bookMeal = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      await API.post("/meals/register", {
        mealId: mealType,
      });
      setSuccess(true);
      if (refreshUser) refreshUser(); // Update ecoScore immediately
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] p-10 shadow-2xl border border-white dark:border-white/5 relative group h-full flex flex-col">
      {/* Visual Accents Wrapper (keeps accents inside card bounds without clipping dropdowns) */}
      <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="absolute -right-20 -bottom-20 text-emerald-500/5 group-hover:scale-125 transition-transform duration-1000">
          <Utensils size={300} />
        </div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-[0_10px_25px_rgba(16,185,129,0.3)] border border-white/20">
            <Leaf size={28} className="drop-shadow-md" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none italic">
              Reserve Your Portion
            </h2>
            <p className="text-[9px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.4em] mt-1.5 opacity-80">Commit to Zero-Waste Service</p>
          </div>

        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-10 leading-relaxed max-w-sm italic">
          Commit to precision kitchen operations by securing your portion. Every reservation prevents surplus and saves resources.
        </p>

        <AnimatePresence mode="wait">
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="mb-8 bg-emerald-500 text-white p-6 rounded-[2rem] text-xs font-black uppercase tracking-widest border border-emerald-400/20 flex items-center gap-5 shadow-2xl shadow-emerald-500/40"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md"><CheckCircle2 size={24} /></div>
              <div>
                 <p className="text-sm font-black">Portion Secured!</p>
                 <p className="text-[10px] opacity-80 mt-0.5 tracking-tight">Your impact is being tracked live.</p>
              </div>
            </motion.div>
          )}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="mb-8 bg-rose-500/10 text-rose-600 dark:text-rose-400 p-6 rounded-[2rem] text-[11px] font-black uppercase tracking-widest border border-rose-500/20 flex items-center gap-5 backdrop-blur-sm shadow-xl shadow-rose-500/10"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20 text-lg">⚠️</div>
              <p className="flex-1">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={bookMeal} className="space-y-8 flex-grow flex flex-col justify-end">
          <div className="space-y-3">
            <label className="block text-[9px] font-black text-emerald-600/60 dark:text-emerald-400/60 uppercase tracking-[0.3em] ml-1">Choose Service Engagement</label>
            <div className="relative group/select">
              <div 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full pl-12 pr-6 py-6 rounded-3xl border-2 border-slate-100 dark:border-white/10 group-hover/select:border-emerald-500/40 bg-slate-50/50 dark:bg-slate-900/40 cursor-pointer flex items-center justify-between shadow-xl transition-all relative overflow-hidden group/box"
              >
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover/box:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <Clock size={18} className="text-emerald-500 absolute left-6" />
                  <span className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-[0.2em] italic drop-shadow-sm">{mealType} Service</span>
                </div>
                <motion.div animate={{ rotate: dropdownOpen ? -90 : 90 }} transition={{ duration: 0.3 }} className="text-slate-400 relative z-10">
                  <ChevronRight size={20} />
                </motion.div>
              </div>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-20 top-[calc(100%+0.5rem)] left-0 w-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl border border-slate-100 dark:border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden py-2"
                  >
                    {["Breakfast", "Lunch", "Dinner"].map((opt) => (
                      <div 
                        key={opt}
                        onClick={() => { setMealType(opt); setDropdownOpen(false); }}
                        className={`px-6 py-4 mx-2 rounded-2xl flex items-center gap-4 cursor-pointer transition-all duration-300 relative overflow-hidden border border-transparent ${mealType === opt ? 'bg-emerald-500/10 border-emerald-500/20' : 'hover:bg-slate-100 dark:hover:bg-slate-700/40 hover:border-slate-200 dark:hover:border-slate-600/30'}`}
                      >
                         {mealType === opt && <motion.div layoutId="activeMeal" className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-emerald-500 rounded-r-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></motion.div>}
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner transition-all duration-500 ${opt === "Breakfast" ? 'bg-orange-500/10 text-orange-500' : opt === "Lunch" ? 'bg-blue-500/10 text-blue-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                           {opt === "Breakfast" ? "🌅" : opt === "Lunch" ? "🍱" : "🌙"}
                         </div>
                         <span className={`font-black uppercase text-xs tracking-[0.2em] italic ${mealType === opt ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                            {opt} Service
                         </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || success}
            className="w-full py-6 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-700 hover:from-emerald-600 hover:to-teal-800 text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(16,185,129,0.4)] transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-4 relative overflow-hidden group/btn group-hover:scale-[1.02] duration-500"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
            <Sparkles size={18} className="animate-pulse" />
            {loading ? "Registering..." : "Secure My Meal Portion"}
            <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}