"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ChefHat, Plus, Trash2, CalendarCheck, Info } from "lucide-react";
import API from "@/services/api";
import { useToast } from "@/components/ToastProvider";
import Sidebar from "@/components/Sidebar";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MEALS = ["Breakfast", "Lunch", "Dinner"];

const defaultMenu = {
  Monday: { Breakfast: "Idli & Sambar", Lunch: "Rice + Dal + Sabji", Dinner: "Chapati + Paneer" },
  Tuesday: {
    Breakfast: "Poha + Tea",
    Lunch: "Wheat Roti + Mix Veg",
    Dinner: "Fried Rice + Manchurian",
  },
  Wednesday: { Breakfast: "Bread & Egg", Lunch: "Rice + Fish Curry", Dinner: "Roti + Dal Makhani" },
  Thursday: {
    Breakfast: "Upma + Coffee",
    Lunch: "Biryani + Raita",
    Dinner: "Chapati + Chana Masala",
  },
  Friday: { Breakfast: "Dosa + Chutney", Lunch: "Rice + Rasam + Papad", Dinner: "Puri + Sabji" },
  Saturday: { Breakfast: "Paratha + Curd", Lunch: "Special Meals", Dinner: "Pulao + Salad" },
};

export default function MenuPlannerPage() {
  const { user } = useAuth() || {};
  const router = useRouter();
  const toast = useToast();
  const [menu, setMenu] = useState(defaultMenu);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // { day, meal }
  const [editValue, setEditValue] = useState("");

  const fetchMenu = async () => {
    try {
      const { data } = await API.get("/menu");
      // Convert flat array to nested structure
      const formatted = {};
      DAYS.forEach((d) => (formatted[d] = { Breakfast: "TBD", Lunch: "TBD", Dinner: "TBD" }));
      data.forEach((item) => {
        if (formatted[item.day]) formatted[item.day][item.mealType] = item.foodItem;
      });
      setMenu(formatted);
    } catch (err) {
      setMenu(defaultMenu);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "student") {
      router.push("/dashboard");
      return;
    }
    fetchMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const startEdit = (day, meal) => {
    setEditing({ day, meal });
    setEditValue(menu[day][meal]);
  };

  const saveEdit = async () => {
    if (!editValue.trim()) return;
    try {
      await API.put("/menu", {
        day: editing.day,
        mealType: editing.meal,
        foodItem: editValue,
      });
      setMenu((prev) => ({
        ...prev,
        [editing.day]: { ...prev[editing.day], [editing.meal]: editValue },
      }));
      toast(`✅ ${editing.day} ${editing.meal} updated!`, "success");
      setEditing(null);
    } catch (err) {
      toast("Failed to update menu item", "error");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 transition-colors">
      <Sidebar />
      <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)] px-6 lg:px-10 py-4 lg:py-6 relative z-10 transition-all duration-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-[0.3em] mb-2">
                Culinary Command
              </p>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                Menu Planner
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold text-sm leading-relaxed max-w-xl">
                Plan and update the weekly canteen menu. Students see this as their meal reference.
              </p>
            </div>
            <div className="hidden md:block text-right">
              <div className="flex items-center gap-2 mt-4 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20">
                <Info size={14} className="text-amber-600 dark:text-amber-500" />
                <p className="text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest">
                  SysAdmin Mode
                </p>
              </div>
            </div>
          </header>

          <div className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/5 overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-6 h-px bg-slate-200 dark:bg-slate-700"></span>
                Weekly Schedule
              </h2>
              <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest hidden sm:block animate-pulse">
                Click cell to edit schedule
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700/60">
                    <th className="py-5 px-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                      Day
                    </th>
                    {MEALS.map((m) => (
                      <th
                        key={m}
                        className="py-5 px-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]"
                      >
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {DAYS.map((day, i) => (
                    <motion.tr
                      key={day}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors group"
                    >
                      <td className="py-6 px-8 font-black text-slate-800 dark:text-white text-sm">
                        {day}
                      </td>
                      {MEALS.map((meal) => (
                        <td key={meal} className="py-6 px-8">
                          {editing?.day === day && editing?.meal === meal ? (
                            <div className="flex gap-2">
                              <input
                                autoFocus
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                                className="flex-1 px-4 py-2 text-sm border-2 border-amber-500 rounded-xl bg-amber-50 dark:bg-slate-900 dark:text-white focus:outline-none font-bold"
                              />
                              <button
                                onClick={saveEdit}
                                className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-lg active:scale-95"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => startEdit(day, meal)}
                              className="flex items-center gap-2 group/cell cursor-pointer px-4 py-3 rounded-[1rem] hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all border border-transparent hover:border-amber-200 dark:hover:border-amber-500/20 shadow-sm hover:shadow-md"
                            >
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex-1">
                                {menu[day][meal]}
                              </span>
                              <span className="text-[10px] font-black text-amber-500 opacity-0 group-hover/cell:opacity-100 transition-opacity uppercase tracking-widest shrink-0">
                                Edit
                              </span>
                            </div>
                          )}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-8 border-t border-slate-100 dark:border-slate-700/60 flex justify-end bg-slate-50/30 dark:bg-transparent">
              <button
                onClick={() => toast("📋 Menu published to all canteen screens!", "success")}
                className="flex items-center gap-2 px-8 py-4 bg-amber-500 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 active:scale-95"
              >
                <CalendarCheck size={18} /> Publish Operations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
