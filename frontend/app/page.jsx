"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Box, Share2, BarChart3, ArrowRight, ShieldCheck, Zap, LayoutDashboard, Sprout, Utensils, Compass } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useState } from 'react';

export default function Home() {
  const { user } = useAuth() || {};
  const [isNavigating, setIsNavigating] = useState(false);

  const containerVariants = {
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const glowVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-start pt-16 md:pt-16 bg-slate-50 dark:bg-slate-900 transition-colors mesh-gradient">
      {/* Dynamic Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Sunlight Effect Overlay - Only visible in Light Mode */}
        <div className="absolute inset-0 dark:hidden">
          <div className="absolute top-0 left-0 w-full h-full animate-sunlight opacity-30 pointer-events-none">
             <div className="absolute top-[10%] left-[10%] w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0)_60%)] rotate-[15deg]"></div>
          </div>
          <div className="absolute inset-0 light-shimmer opacity-20"></div>
        </div>

        <motion.div 
          variants={glowVariants}
          animate="animate"
          className="absolute top-[-15%] left-[-10%] w-[45rem] h-[45rem] bg-emerald-300/40 dark:bg-emerald-500/15 rounded-full mix-blend-soft-light dark:mix-blend-multiply filter blur-[80px]"
        />
        <motion.div 
          animate={{ x: [0, -60, 0], y: [0, 100, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-teal-300/40 dark:bg-teal-500/15 rounded-full mix-blend-soft-light dark:mix-blend-multiply filter blur-[100px]"
        />
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[15%] right-[-15%] w-[40rem] h-[40rem] bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full mix-blend-soft-light dark:mix-blend-multiply filter blur-[70px]"
        />
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="z-10 text-center px-6 max-w-5xl"
      >
        <motion.div variants={itemVariants} className="mb-10 inline-block">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center justify-center relative group"
          >
            <Sprout size={48} className="text-white relative z-10 drop-shadow-lg" />
            <div className="absolute inset-0 rounded-[2.5rem] bg-emerald-400 blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
          </motion.div>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.95] mb-8 text-glow"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-teal-300 to-indigo-500 animate-slow-pan uppercase">
            Smart Wastage<br />System
          </span>
        </motion.h1>

        <motion.div variants={itemVariants} className="space-y-8">
          <p className="text-xl md:text-2xl text-slate-800 dark:text-slate-200 font-extrabold leading-tight max-w-3xl mx-auto tracking-tight bg-white/40 dark:bg-slate-800/40 backdrop-blur-md px-8 py-4 rounded-[1.5rem] border border-white/20 dark:border-white/5 shadow-2xl">
            "Precision at the plate, <span className="text-emerald-500 dark:text-emerald-400">Sustainability</span> at heart."
          </p>
          
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed tracking-wide uppercase opacity-80">
            The world's most intelligent ecosystem to monitor, forecast, and dramatically reduce institutional food waste.
          </p>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="mt-14 flex flex-wrap gap-8 justify-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="group relative cursor-pointer">
            <Link href={user ? "/dashboard" : "/login"} onClick={() => setIsNavigating(true)}>
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xl font-black rounded-2xl shadow-2xl flex items-center space-x-3 transition-colors">
                <span className="tracking-tighter">
                  {isNavigating ? "UPLINK STARTED..." : (user ? "LAUNCH DASHBOARD" : "LOGIN")}
                </span>
                {isNavigating ? (
                   <span className="w-6 h-6 border-4 border-white/30 dark:border-slate-900/30 border-t-emerald-500 rounded-full animate-spin"></span>
                ) : user ? (
                   <LayoutDashboard size={24} className="group-hover:rotate-12 transition-transform" />
                ) : (
                   <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="group relative cursor-pointer">
            <Link href="/register">
              <div className="relative px-12 py-6 bg-transparent text-slate-900 dark:text-white text-xl font-black rounded-2xl border-2 border-slate-900/10 dark:border-white/10 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-xl flex items-center space-x-3 transition-all backdrop-blur-md">
                <span className="tracking-tighter">SIGNUP</span>
                <Zap size={24} className="text-emerald-500 group-hover:scale-125 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Feature Showcase Grid */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24">
        <motion.div 
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <h2 className="text-xs font-black text-emerald-600 uppercase tracking-[0.4em] mb-4">Core Ecosystem</h2>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Advanced Modules for Total Control</h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Box className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" size={40} />, 
              title: "Stock Intelligence", 
              desc: "Predictive inventory tracking with AI-driven expiry alerts and procurement optimization.",
              color: "hover:border-emerald-500/40"
            },
            { 
              icon: <Share2 className="text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" size={40} />, 
              title: "Rescue Network", 
              desc: "Seamless synchronization between donors and NGOs for rapid surplus redistribution.",
              color: "hover:border-indigo-500/40"
            },
            { 
              icon: <BarChart3 className="text-teal-500 drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]" size={40} />, 
              title: "Eco-Analytics", 
              desc: "Convert waste reduction into verifiable carbon credits and community impact metrics.",
              color: "hover:border-teal-500/40"
            },
            { 
              icon: <Utensils className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" size={40} />, 
              title: "Smart Meal Booking", 
              desc: "Sync student demand with kitchen output to eliminate production surplus at the source.",
              color: "hover:border-orange-500/40"
            },
            { 
              icon: <Compass className="text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" size={40} />, 
              title: "Geospatial Intel", 
              desc: "Live mapping of waste hotspots and certified NGO routes across the regional grid.",
              color: "hover:border-rose-500/40"
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                scale: 1.02, 
                transition: { duration: 0.2 } 
              }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6, ease: "easeOut" }}
              className={`premium-glass p-10 rounded-[3rem] border transition-all ${feature.color} group cursor-pointer`}
            >
              <div className="mb-8 w-20 h-20 rounded-3xl bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:rotate-12 transition-transform duration-500">
                {feature.icon}
              </div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{feature.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed">{feature.desc}</p>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Explore Module</span>
                <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

        {/* Floating Technical Decor Clusters */}
        <div className="absolute left-[8%] bottom-[15%] opacity-10 hidden lg:block animate-float">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20"></div>
            <div className="flex flex-col gap-6 transform -rotate-12">
               <Zap size={80} className="text-emerald-500" />
               <BarChart3 size={60} className="text-emerald-400 ml-10" />
            </div>
          </div>
        </div>
        
        <div className="absolute right-[5%] top-[15%] opacity-10 hidden lg:block" style={{ animation: 'float 12s ease-in-out infinite' }}>
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20"></div>
            <div className="flex flex-col gap-8 transform rotate-12">
               <ShieldCheck size={90} className="text-indigo-500" />
               <Box size={70} className="text-indigo-400 mr-12" />
            </div>
          </div>
        </div>
    </div>
  );
}