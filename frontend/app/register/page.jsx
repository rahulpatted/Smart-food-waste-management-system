"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/services/api";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ToastProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth() || {};
  const toast = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/auth/register", formData);
      if (data.token) {
        if (login) login(data.token);
        else localStorage.setItem("token", data.token);
        toast("Account created! Welcome to Smart Wastage System ♻️", "success");
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        staggerChildren: 0.08,
        ease: "easeOut" 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden mesh-gradient">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Sunlight Effect Overlay - Only visible in Light Mode */}
        <div className="absolute inset-0 dark:hidden">
          <div className="absolute top-0 left-0 w-full h-full animate-sunlight opacity-20 pointer-events-none">
             <div className="absolute top-[10%] left-[10%] w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0)_60%)] rotate-[10deg]"></div>
          </div>
        </div>

        <motion.div 
          animate={{ rotate: 360, x: [0, 100, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-5%] right-[-10%] w-[35rem] h-[35rem] bg-teal-300/30 dark:bg-teal-500/10 rounded-full mix-blend-soft-light dark:mix-blend-multiply filter blur-3xl"
        />
        <motion.div 
          animate={{ rotate: -360, x: [0, -70, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-emerald-300/30 dark:bg-emerald-500/10 rounded-full mix-blend-soft-light dark:mix-blend-multiply filter blur-3xl"
        />
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-8">
          <motion.p 
            variants={itemVariants} 
            className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-500 mb-2"
          >
            SMART WASTAGE SYSTEM
          </motion.p>
          <motion.h2 
            variants={itemVariants}
            className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-tight"
          >
            Signup
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg"
          >
            Create an account to start saving food
          </motion.p>
        </div>

        <motion.div 
          variants={itemVariants}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-white/50 dark:border-slate-700/50 p-8 sm:p-10"
        >
          <form onSubmit={handleRegister} className="space-y-5">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold border border-red-100 dark:border-red-900/30 text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-800 dark:text-white font-semibold placeholder-slate-400"
                placeholder="Jane Doe"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-800 dark:text-white font-semibold placeholder-slate-400"
                placeholder="jane@university.edu"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-800 dark:text-white font-semibold placeholder-slate-400"
                placeholder="••••••••"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1 uppercase tracking-wider">Account Role</label>
              <div className="relative">
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-800 dark:text-white font-semibold appearance-none cursor-pointer"
                >
                  <option value="student">Community Recipient / Student</option>
                  <option value="staff">Staff Member</option>
                  <option value="admin">Administrator</option>
                  <option value="donor">Donor</option>
                  <option value="ngo">NGO</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-lg font-black shadow-2xl transition-all disabled:opacity-70 flex items-center justify-center space-x-3"
            >
              <span>{loading ? "Creating Account..." : "Start Saving Food"}</span>
              {!loading && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              )}
            </motion.button>
          </form>
          
          <motion.div variants={itemVariants} className="mt-10 text-center border-t border-slate-100 dark:border-slate-700/30 pt-8">
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-wide">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-600 hover:text-emerald-500 font-black decoration-2 underline-offset-4 hover:underline transition-all">
                Login here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}