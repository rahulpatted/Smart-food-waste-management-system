"use client";
import { useState, useEffect } from "react";

export default function MealCountdown() {
  const [timeLeft, setTimeLeft] = useState({ hours: "00", minutes: "00", seconds: "00" });
  const [nextMeal, setNextMeal] = useState("");

  useEffect(() => {
    const calculateNextMeal = () => {
      const now = new Date();

      const breakfast = new Date(now);
      breakfast.setHours(8, 0, 0, 0);
      const lunch = new Date(now);
      lunch.setHours(13, 0, 0, 0);
      const dinner = new Date(now);
      dinner.setHours(19, 0, 0, 0);
      const nextBreakfast = new Date(breakfast);
      nextBreakfast.setDate(nextBreakfast.getDate() + 1);

      let targetTime;
      let mealName = "";

      if (now < breakfast) {
        targetTime = breakfast;
        mealName = "Breakfast (8:00 AM)";
      } else if (now < lunch) {
        targetTime = lunch;
        mealName = "Lunch (1:00 PM)";
      } else if (now < dinner) {
        targetTime = dinner;
        mealName = "Dinner (7:00 PM)";
      } else {
        targetTime = nextBreakfast;
        mealName = "Tomorrow's Breakfast (8:00 AM)";
      }

      setNextMeal(mealName);

      const diff = targetTime - now;
      if (diff > 0) {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
          .toString()
          .padStart(2, "0");
        const minutes = Math.floor((diff / 1000 / 60) % 60)
          .toString()
          .padStart(2, "0");
        const seconds = Math.floor((diff / 1000) % 60)
          .toString()
          .padStart(2, "0");
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateNextMeal();
    const interval = setInterval(calculateNextMeal, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl shadow-lg p-8 text-white mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 text-white/10 text-9xl">⏰</div>
      <div className="relative z-10">
        <h2 className="text-xl font-bold mb-1 text-emerald-100 uppercase tracking-widest text-sm">
          Next Upcoming Meal
        </h2>
        <p className="text-2xl font-bold mb-6">{nextMeal}</p>

        <div className="flex gap-4 items-center">
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 min-w-[80px] text-center border border-white/10">
            <span className="block text-4xl font-black mb-1">{timeLeft.hours}</span>
            <span className="text-xs uppercase font-bold text-emerald-200 tracking-wider">
              Hours
            </span>
          </div>
          <span className="text-3xl font-bold text-emerald-300">:</span>
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 min-w-[80px] text-center border border-white/10">
            <span className="block text-4xl font-black mb-1">{timeLeft.minutes}</span>
            <span className="text-xs uppercase font-bold text-emerald-200 tracking-wider">
              Mins
            </span>
          </div>
          <span className="text-3xl font-bold text-emerald-300">:</span>
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 min-w-[80px] text-center border border-white/10">
            <span className="block text-4xl font-black mb-1">{timeLeft.seconds}</span>
            <span className="text-xs uppercase font-bold text-emerald-200 tracking-wider">
              Secs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
