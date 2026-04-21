"use client";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import WasteChart from "@/components/Charts/WasteChart";
import DemandChart from "@/components/Charts/DemandChart";
import InventoryChart from "@/components/Charts/InventoryChart";
import LogisticsChart from "@/components/Charts/LogisticsChart";
import ExpiryChart from "@/components/Charts/ExpiryChart";
import { useEffect, useState } from "react";
import socket from "@/services/socket";
import API from "@/services/api";
import { useToast } from "@/components/ToastProvider";
import { useAuth } from "@/components/AuthProvider";
import CanteenInsights from "@/components/Dashboard/CanteenInsights";
import AchievementBadges from "@/components/Dashboard/AchievementBadges";
import CampusLeaderboard from "@/components/Dashboard/CampusLeaderboard";
import OnboardingWizard from "@/components/OnboardingWizard";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function Dashboard() {
  const { user, refreshUser } = useAuth() || {};
  const role = user?.role || 'student';
  const [stats, setStats] = useState({ totalWaste: 0, totalLogs: 0, users: 0, donations: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [prevLevel, setPrevLevel] = useState(null);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const handleAlert = (msg) => {
      console.log("Socket Alert:", msg);
      toast(msg, "error"); 
    };
    
    socket.on("alert", handleAlert);
    
    if (user?.role) {
      socket.emit("join", user.role);
    }

    const fetchStats = () => {
      setLoadingStats(true);
      Promise.all([
        API.get("/waste").catch(() => ({ data: [] })),
        API.get("/donation").catch(() => ({ data: [] })),
        API.get("/meals/summary").catch(() => ({ data: { Lunch: 0, Breakfast: 0, Dinner: 0 } })),
        API.get("/user/all-partners").catch(() => ({ data: [] })),
        role === 'student' ? API.get("/meals/my-bookings").catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
      ]).then(([wasteRes, donationRes, mealRes, partnerRes, myMealsRes]) => {
        const wasteLogs = wasteRes.data || [];
        const donationLogs = donationRes.data || [];
        const mealSummary = mealRes.data || {};
        const partnersList = partnerRes.data || [];
        const totalWaste = wasteLogs.reduce((sum, w) => sum + (w.weight || 0), 0);
        
        setStats({
          totalWaste: totalWaste.toFixed(1),
          totalLogs: wasteLogs.length,
          donations: donationLogs.length,
          rawDonations: donationLogs,
          mealSummary,
          myMeals: myMealsRes.data || [],
          totalBookings: Object.values(mealSummary).reduce((a, b) => a + b, 0),
          partnerCount: partnersList.filter(u => ["donor", "ngo"].includes(u.role)).length
        });
      }).catch(() => toast("Failed to sync live data", "error"))
        .finally(() => setLoadingStats(false));
    };

    fetchStats();
    window._fetchDashboardStats = fetchStats;

    return () => socket.off("alert");
  }, [role]);

  useEffect(() => {
    if (role === 'student' && user?.ecoScore !== undefined) {
      const currentLevel = Math.floor((user.ecoScore || 0) / 500) + 1;
      
      if (prevLevel !== null && currentLevel > prevLevel) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b']
        });
        toast(`🏆 Level Up! You've reached Level ${currentLevel}!`, "success");
      }
      setPrevLevel(currentLevel);
    }
  }, [user?.ecoScore, role, prevLevel]);

  const headers = {
    admin: { title: "Executive Command", desc: "Global system performance and resource efficiency" },
    staff: { title: "Kitchen Control", desc: "Live canteen waste analytics and demand forecasting" },
    ngo: { title: "Distribution Hub", desc: "Logistics tracking and community impact dashboard" },
    student: { title: "Community Support Hub", desc: "Access daily meal resources and track your ecological impact" },
    donor: { title: "Donor Portal", desc: "Track your contributions and community impact" }
  };

  const currentHeader = headers[role] || headers.student;

  const allStatCards = {
    admin: [
      { label: "Total Waste", value: `${stats.totalWaste}kg`, icon: "🗑️", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20", border: "border-rose-100 dark:border-rose-900/30" },
      { label: "Active Logs", value: stats.totalLogs, icon: "📋", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20", border: "border-orange-100 dark:border-orange-900/30" },
      { label: "Total Donations", value: stats.donations, icon: "🤝", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-100 dark:border-emerald-900/30" },
      { label: "System Status", value: "Optimal", icon: "✅", color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-900/20", border: "border-teal-100 dark:border-teal-900/30" },
    ],
    staff: [
      { label: "Today's Waste", value: `${stats.totalWaste}kg`, icon: "🗑️", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20", border: "border-rose-100 dark:border-rose-900/30" },
      { label: "Waste Logs", value: stats.totalLogs, icon: "📋", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20", border: "border-orange-100 dark:border-orange-900/30" },
      { label: "Inventory Health", value: "92%", icon: "📦", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-100 dark:border-emerald-900/30" },
      { label: "Kitchen Power", value: "High", icon: "⚡", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-100 dark:border-amber-900/30" },
    ],
    ngo: [
      { label: "Managed Donations", value: stats.donations, icon: "🤝", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-100 dark:border-emerald-900/30" },
      { label: "Impact Score", value: "880", icon: "🌏", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20", border: "border-indigo-100 dark:border-indigo-900/30" },
      { label: "Pending Pickups", value: "4", icon: "🚚", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-100 dark:border-amber-900/30" },
      { label: "Eco Saved", value: "140kg", icon: "🌱", color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-900/20", border: "border-teal-100 dark:border-teal-900/30" },
    ],
    student: [
      { label: "Eco Points", value: user?.ecoScore || 0, icon: "💎", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20", border: "border-indigo-100 dark:border-indigo-900/30" },
      { label: "Campus Rank", value: stats.rank || "1/1", icon: "🏆", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-100 dark:border-amber-900/30" },
      { label: "Meals Saved", value: stats.mealsBooked || 0, icon: "🍱", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-100 dark:border-emerald-900/30" },
      { label: "Karma Points", value: (stats.volunteerCount || 0) * 100, icon: "🙏", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20", border: "border-rose-100 dark:border-rose-900/30" },
    ]
  };

  const statCards = allStatCards[role] || allStatCards.staff;

  const quickAccessLinks = {
    student: [
      { href: "/meals", icon: "🍱", text: "Book Meals" },
      { href: "/profile", icon: "👤", text: "My Profile" }
    ],
    donor: [
      { href: "/donations", icon: "🤝", text: "Make Donation" },
      { href: "/map", icon: "🗺️", text: "Impact Map" },
      { href: "/profile", icon: "👤", text: "My Settings" }
    ],
    ngo: [
       { href: "/donations", icon: "🤝", text: "Redistribution Board" },
       { href: "/map", icon: "🗺️", text: "Live Route Map" },
       { href: "/partners", icon: "🏢", text: "Collaborators" },
    ],
    staff: [
      { href: "/donations", icon: "🤝", text: "Make Donation" },
      { href: "/map", icon: "🗺️", text: "Impact Map" },
      { href: "/partners", icon: "🏢", text: "Donor Network" },
      { href: "/inventory", icon: "📦", text: "Manage Stock" },
      { href: "/waste", icon: "🗑️", text: "Log Waste" },
    ],
    admin: [
      { href: "/admin", icon: "🛡️", text: "Admin Panel" },
      { href: "/map", icon: "🗺️", text: "System Map" },
      { href: "/donations", icon: "🤝", text: "Global Board" },
    ]
  };

  const activeQuickLinks = quickAccessLinks[role] || quickAccessLinks.student;

  const renderGoalBanner = () => {
    let goalParams = null;
    if (['staff', 'admin'].includes(role)) {
      const wasteVal = parseFloat(stats.totalWaste) || 0;
      const cycleProgress = wasteVal % 50;
      const cycleCount = Math.floor(wasteVal / 50) + 1;
      goalParams = { 
        title: `Kitchen Efficiency: Goal #${cycleCount} (50kg Milestone)`, 
        progress: (cycleProgress / 50) * 100, 
        label: `${cycleProgress.toFixed(1)} / 50 kg tracked` 
      };
    } else if (role === 'donor') {
      goalParams = { title: "Community Impact: Reach 5 Donations", progress: 20, label: "1 / 5 contributions" };
    } else if (role === 'ngo') {
      goalParams = { title: "Route Efficiency Target: 95%", progress: 80, label: "Current: 82%" };
    } else if (role === 'student') {
      const level = Math.floor((user?.ecoScore || 0) / 500) + 1;
      const progressToNext = ((user?.ecoScore || 0) % 500) / 5;
      goalParams = { title: `Eco-Warrior Level ${level}`, progress: progressToNext, label: `${500 - ((user?.ecoScore || 0) % 500)} pts to Level ${level + 1}` };
    }
    if (!goalParams) return null;

    return (
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 sm:p-8 mb-10 text-white shadow-xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl transform group-hover:scale-110 transition-transform">🏆</div>
         <h3 className="text-xl font-black mb-2 uppercase tracking-tight">{goalParams.title}</h3>
         <p className="text-emerald-100 text-sm mb-5 font-bold opacity-80 uppercase tracking-widest">Global impact tracking in progress</p>
         <div className="w-full bg-black/20 rounded-full h-4 mb-2 overflow-hidden shadow-inner">
           <div className="bg-white rounded-full h-4 transition-all duration-1000 ease-out shadow-sm" style={{ width: `${Math.min(goalParams.progress, 100)}%` }}></div>
         </div>
         <p className="text-[10px] font-black text-right uppercase tracking-widest">{goalParams.label}</p>
      </div>
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 transition-colors relative overflow-hidden mesh-gradient">
      <OnboardingWizard />
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ x: [0, 60, 0], y: [0, 30, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-emerald-400/15 dark:bg-emerald-500/10 rounded-full mix-blend-soft-light dark:mix-blend-multiply filter blur-[100px]" />
        <motion.div animate={{ x: [0, -50, 0], y: [0, 80, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[-15%] right-[-5%] w-[45rem] h-[45rem] bg-teal-400/15 dark:bg-teal-500/10 rounded-full mix-blend-soft-light dark:mix-blend-multiply filter blur-[120px]" />
      </div>

      <Sidebar />

      <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)] px-6 lg:px-10 py-4 lg:py-6 relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-7xl mx-auto space-y-8">
          
          <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
             <div>
                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.3em] mb-2">Authenticated Identity: {role}</p>
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{currentHeader.title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold text-sm leading-relaxed max-w-xl">{currentHeader.desc}</p>
             </div>
             <div className="hidden md:block text-right">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest print:hidden">System Uplink</p>
                <div className="flex items-center justify-end gap-2 mt-1 print:hidden">
                   <button onClick={() => window.print()} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-900/50 shadow-sm">📊 Export Report</button>
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Active Hub</p>
                </div>
             </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {role === 'student' && stats.myMeals?.length > 0 && (
              <div className="md:col-span-2 lg:col-span-4">
                 <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3"><span className="w-8 h-px bg-slate-200 dark:bg-slate-700"></span> MY ACTIVE BOOKINGS</h2>
                 <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                   {stats.myMeals.map(m => (
                     <div key={m._id} className="min-w-[280px] bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 shadow-xl flex items-center justify-between group">
                       <div>
                         <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{m.mealType}</p>
                         <p className="text-sm font-black text-slate-900 dark:text-white mt-1 uppercase tracking-tight">{new Date(m.date).toLocaleDateString()}</p>
                       </div>
                       <button onClick={async () => {
                           try {
                                 await API.post("/meals/gift", { mealId: m._id });
                                 toast("Meal gifted! +50 EcoPoints earned", "success");
                                 if (refreshUser) refreshUser();
                                 if (window._fetchDashboardStats) window._fetchDashboardStats();
                               } catch (err) { toast("Gifting failed", "error"); }
                         }} className="px-5 py-2.5 bg-indigo-500 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/20 group-hover:scale-105">Gift Meal</button>
                     </div>
                   ))}
                 </div>
              </div>
            )}
            
            {role === 'student' && stats.rawDonations?.some(d => d.status === 'Assigned') && (
              <div className="md:col-span-2 lg:col-span-4 mb-4">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[3rem] p-8 sm:p-10 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-10 text-9xl transform group-hover:rotate-12 transition-transform">🚚</div>
                  <div className="relative z-10 max-w-xl">
                      <span className="bg-white/20 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-6 inline-block">Flash Opportunity</span>
                      <h2 className="text-3xl font-black mb-3 tracking-tighter uppercase">Volunteers Needed Nearby!</h2>
                      <p className="text-indigo-100 text-sm font-bold opacity-80 mb-8 leading-relaxed uppercase tracking-tight">An NGO partner is arriving to collect a surplus donation. Help with the hand-off to earn 100 Karma Points!</p>
                      <button onClick={() => toast("You've been added to the volunteer list!", "success")} className="px-10 py-4 bg-white text-indigo-600 text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-400 hover:text-white transition-all shadow-2xl active:scale-95">Accept Call to Action</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {renderGoalBanner()}

          <div className={`grid grid-cols-2 md:grid-cols-${activeQuickLinks.length} gap-6 mb-12 print:hidden`}>
            {activeQuickLinks.map((link) => (
               <button key={link.href} onClick={() => router.push(link.href)} className="spotlight-card py-6 px-4 bg-white dark:bg-slate-800/60 backdrop-blur-sm hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-[2rem] text-xs font-black uppercase text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all border border-slate-200 dark:border-white/5 hover:border-emerald-500/20 shadow-xl flex flex-col md:flex-row items-center justify-center gap-3 snap-start group tracking-widest shrink-0 active:scale-95">
                 <span className="text-2xl group-hover:scale-125 group-hover:rotate-6 transition-transform relative z-10">{link.icon}</span> 
                 <span className="relative z-10">{link.text}</span>
               </button>
            ))}
          </div>

          {['admin', 'staff', 'ngo'].includes(role) && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
                {statCards.map((card) => (
                  <div key={card.label} className="spotlight-card bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] border border-slate-200 dark:border-white/5 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:border-emerald-500/30 transition-all shadow-xl group cursor-default">
                    <div className={`${card.bg} border ${card.border} rounded-2xl p-4 text-3xl group-hover:rotate-12 transition-transform shadow-inner`}>{card.icon}</div>
                    <div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black tracking-widest uppercase mb-1">{card.label}</p>
                      <p className={`text-3xl font-black tracking-tighter ${card.color}`}>{loadingStats ? "..." : card.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['admin', 'staff'].includes(role) && (
                      <>
                        <div className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 shadow-xl overflow-hidden group hover:border-emerald-500/30 transition-all"><WasteChart /></div>
                        <div className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 shadow-xl overflow-hidden group hover:border-emerald-500/30 transition-all"><ExpiryChart /></div>
                        <div className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 shadow-xl overflow-hidden group hover:border-emerald-500/30 transition-all"><DemandChart /></div>
                      </>
                    )}
                    {['admin', 'ngo'].includes(role) && (
                      <div className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 shadow-xl overflow-hidden group hover:border-emerald-500/30 transition-all"><LogisticsChart /></div>
                    )}
                    {['admin', 'staff'].includes(role) && (
                      <div className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 shadow-xl overflow-hidden group hover:border-emerald-500/30 transition-all"><InventoryChart /></div>
                    )}
                    {role === 'student' && (
                      <div className="md:col-span-2"><AchievementBadges userAchievements={stats.achievements} /></div>
                    )}
                  </div>
                </div>
                <div className="xl:col-span-1">
                    {role === 'student' ? <CampusLeaderboard /> : <CanteenInsights stats={{ ...stats, donationsList: stats.rawDonations || [] }} userRole={role} />}
                </div>
              </div>
            </div>
          )}

          <div className="mt-14">
             <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3"><span className="w-8 h-px bg-slate-200 dark:bg-slate-700"></span> SYSTEM INTEL</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {role === 'student' ? (
                  <>
                    <div className="bg-amber-500/5 backdrop-blur-sm border border-amber-500/10 p-8 rounded-[2rem] hover:border-amber-500/40 transition-all group">
                      <p className="text-3xl mb-6 shadow-inner">⚡</p>
                      <p className="font-black text-amber-900 dark:text-white uppercase text-xs tracking-widest">Peak Detection</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-bold leading-relaxed tracking-tight">Canteen rush expected at 12:45 PM. Plan your visit accordingly.</p>
                    </div>
                    <div className="bg-emerald-500/5 backdrop-blur-sm border border-emerald-500/10 p-8 rounded-[2rem] hover:border-emerald-500/40 transition-all group">
                      <p className="text-3xl mb-6 shadow-inner">🍱</p>
                      <p className="font-black text-emerald-900 dark:text-white uppercase text-xs tracking-widest">Surplus Save</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-bold leading-relaxed tracking-tight">Lunch has low bookings today! High chance of surplus redistribution.</p>
                    </div>
                    <div className="bg-indigo-500/5 backdrop-blur-sm border border-indigo-500/10 p-8 rounded-[2rem] hover:border-indigo-500/40 transition-all group">
                      <p className="text-3xl mb-6 shadow-inner">🌱</p>
                      <p className="font-black text-indigo-900 dark:text-white uppercase text-xs tracking-widest">Eco Impact</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-bold leading-relaxed tracking-tight">Your meal choices saved 4.2kg of CO2 this week. Keep it up!</p>
                    </div>
                  </>
                ) : role === 'ngo' ? (
                  <>
                    <div className="bg-indigo-500/5 backdrop-blur-sm border border-indigo-500/20 p-8 rounded-[2rem] hover:border-indigo-500/40 transition-all group">
                      <p className="text-3xl mb-6 shadow-inner">📍</p>
                      <p className="font-black text-indigo-900 dark:text-white uppercase text-xs tracking-widest">Nearby Surplus</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-bold leading-relaxed tracking-tight">5 pending donations detected within a 2km radius of your route.</p>
                    </div>
                    <div className="bg-emerald-500/5 backdrop-blur-sm border border-emerald-500/20 p-8 rounded-[2rem] hover:border-emerald-500/40 transition-all group">
                      <p className="text-3xl mb-6 shadow-inner">🚚</p>
                      <p className="font-black text-emerald-900 dark:text-white uppercase text-xs tracking-widest">Logistics Pulse</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-bold leading-relaxed tracking-tight">Avg. pickup time reduced to 18 mins. Your fleet is optimized.</p>
                    </div>
                    <div className="bg-amber-500/5 backdrop-blur-sm border border-amber-500/20 p-8 rounded-[2rem] hover:border-amber-500/40 transition-all group">
                      <p className="text-3xl mb-6 shadow-inner">🌟</p>
                      <p className="font-black text-amber-900 dark:text-white uppercase text-xs tracking-widest">Community Reach</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-bold leading-relaxed tracking-tight">340 meals successfully redistributed in your sector this month.</p>
                    </div>
                  </>
                ) : role === 'donor' ? (
                  <>
                    <div className="bg-indigo-500/5 backdrop-blur-sm border border-indigo-500/20 p-8 rounded-[2rem] hover:border-indigo-500/40 transition-all group">
                      <p className="text-3xl mb-6 shadow-inner">🤝</p>
                      <p className="font-black text-indigo-900 dark:text-white uppercase text-xs tracking-widest">Donation Spark</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-bold leading-relaxed tracking-tight">Your contributions reached 12 local NGOs this week. Impact!</p>
                    </div>
                    <div className="bg-amber-500/5 backdrop-blur-sm border border-amber-500/20 p-8 rounded-[2rem] hover:border-amber-500/40 transition-all group">
                      <p className="text-3xl mb-6 shadow-inner">⚡</p>
                      <p className="font-black text-amber-900 dark:text-white uppercase text-xs tracking-widest">Active Requests</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-bold leading-relaxed tracking-tight">3 NGOs currently seeking surplus in your immediate vicinity.</p>
                    </div>
                    <div className="bg-emerald-500/5 backdrop-blur-sm border border-emerald-500/20 p-8 rounded-[2rem] hover:border-emerald-500/40 transition-all group">
                      <p className="text-3xl mb-6 shadow-inner">📦</p>
                      <p className="font-black text-emerald-900 dark:text-white uppercase text-xs tracking-widest">Pickup Status</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-bold leading-relaxed tracking-tight">All scheduled pickups are on time. Driver 'Rajesh' is 5 mins away.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-amber-500/5 backdrop-blur-sm border border-amber-500/20 p-8 rounded-[2rem] hover:border-amber-500/40 transition-all group">
                      <p className="text-3xl mb-6 shadow-inner">🕒</p>
                      <p className="font-black text-amber-900 dark:text-white uppercase text-xs tracking-widest">Peak Demand</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-bold leading-relaxed tracking-tight">High traffic predicted for Tuesday Lunch. Adjust preparation.</p>
                    </div>
                    <div className="bg-indigo-500/5 backdrop-blur-sm border border-indigo-500/20 p-8 rounded-[2rem] hover:border-indigo-500/40 transition-all group">
                      <p className="text-3xl mb-6 shadow-inner">🧪</p>
                      <p className="font-black text-indigo-900 dark:text-white uppercase text-xs tracking-widest">Inventory Health</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-bold leading-relaxed tracking-tight">Optimal levels. 0 critical expiries detected in next 48h.</p>
                    </div>
                    <div className="bg-emerald-500/5 backdrop-blur-sm border border-emerald-500/20 p-8 rounded-[2rem] hover:border-emerald-500/40 transition-all group">
                      <p className="text-3xl mb-6 shadow-inner">📈</p>
                      <p className="font-black text-emerald-900 dark:text-white uppercase text-xs tracking-widest">Efficiency Spark</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-bold leading-relaxed tracking-tight">Canteen efficiency up by 12% following menu optimization.</p>
                    </div>
                  </>
                )}
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}