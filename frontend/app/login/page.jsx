"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/services/api";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ToastProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth() || {};
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/auth/login", { email, password });
      if (data.token) {
        // Store token and update auth state first
        if (login) login(data.token);
        else localStorage.setItem("token", data.token);
        toast("Welcome back! Logged in successfully.", "success");
        // Navigate outside the try/catch so navigation errors don't show as auth errors
        setLoading(false);
        router.push("/dashboard");
        return;
      }
    } catch (err) {
      console.error("Login error:", err);
      // Show the actual server error message, or a meaningful fallback
      const message =
        err.response?.data?.message ||
        (err.response
          ? `Server error (${err.response.status})`
          : "Unable to connect to server. Is the backend running?");
      setError(message);
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
        staggerChildren: 0.1,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden mesh-gradient">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Sunlight Effect Overlay - Only visible in Light Mode */}
        <div className="absolute inset-0 dark:hidden">
          <div className="absolute top-0 left-0 w-full h-full animate-sunlight opacity-20 pointer-events-none">
            <div className="absolute top-[10%] left-[10%] w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0)_60%)] rotate-[10deg]"></div>
          </div>
        </div>

        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-emerald-300/30 dark:bg-emerald-500/10 rounded-full mix-blend-soft-light dark:mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[25rem] h-[25rem] bg-teal-300/30 dark:bg-teal-500/10 rounded-full mix-blend-soft-light dark:mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[-5%] w-[20rem] h-[20rem] bg-indigo-300/15 dark:bg-indigo-500/5 rounded-full mix-blend-soft-light dark:mix-blend-multiply filter blur-3xl"
        />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 shadow-2xl mb-8 relative group"
          >
            <span className="text-4xl relative z-10">♻️</span>
            <div className="absolute inset-0 rounded-3xl bg-emerald-400 blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
          </motion.div>
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
            Welcome Back
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg"
          >
            Access your food waste dashboard
          </motion.p>
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-white/50 dark:border-slate-700/50 p-8 sm:p-12"
        >
          <form onSubmit={handleLogin} className="space-y-7">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-semibold border border-red-100 dark:border-red-900/30 text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 ml-1 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4.5 rounded-2xl border-2 border-slate-100 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-800 dark:text-white font-semibold placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="you@university.edu"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-500 uppercase tracking-wider"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4.5 pr-14 rounded-2xl border-2 border-slate-100 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-800 dark:text-white font-semibold placeholder-slate-400 dark:placeholder-slate-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors focus:outline-none p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {showPassword ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-lg font-black shadow-2xl shadow-emerald-500/30 transition-all disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center space-x-3 overflow-hidden group"
            >
              <span>{loading ? "Authenticating..." : "Sign In Now"}</span>
              {!loading && (
                <motion.svg
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </motion.svg>
              )}
            </motion.button>
          </form>

          <motion.div variants={itemVariants} className="mt-12 text-center">
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-wide">
              New to the platform?{" "}
              <Link
                href="/register"
                className="text-emerald-600 hover:text-emerald-500 font-black relative group inline-block"
              >
                <span>Create Account</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
