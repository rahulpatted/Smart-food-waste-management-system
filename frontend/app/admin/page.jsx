"use client";
import { useAuth } from "@/components/AuthProvider";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Trash2, UserCheck, UserX, Mail, BadgeAlert } from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import API from "@/services/api";

const roleColors = {
  admin: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400",
  staff: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  student: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400",
  donor: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  ngo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400",
};

export default function AdminPanelPage() {
  const { user } = useAuth() || {};
  const router = useRouter();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== "admin") router.push("/dashboard");
    if (user && user.role === "admin") {
      checkConnectivity();
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const checkConnectivity = async () => {
    try {
      const res = await API.get("ping");
      console.log("🔗 Backend Connectivity: OK", res.data);
    } catch (err) {
      console.error("❌ Backend Connectivity FAILED:", err.message);
      toast("Critical: Backend is unreachable or misconfigured.", "error");
    }
  };

  const fetchUsers = async () => {
    try {
      // Trying the new direct global admin path
      const { data } = await API.get("admin/users");
      setUsers(data);
    } catch (err) {
      console.error("ADMIN FETCH REASON:", err.response?.data || err.message);
      toast(`Failed to fetch real users: ${err.response?.data?.message || err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      await API.put(`user/admin/status/${id}`, { status: newStatus });
      toast(`User ${newStatus === "active" ? "Reactivated" : "Suspended"}`, "success");
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, status: newStatus } : u)));
    } catch (err) {
      console.error("ADMIN STATUS UPDATE ERROR:", err.response?.data || err.message);
      toast(`Error updating user status: ${err.response?.data?.message || err.message}`, "error");
    }
  };

  const sendNotice = (name) => {
    toast(`📧 Official Notice sent to ${name}!`, "success");
  };

  const handleDelete = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to PERMANENTLY delete user "${name}"? This cannot be undone.`
      )
    )
      return;
    try {
      await API.delete(`user/admin/${id}`);
      toast("User deleted successfully", "success");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("ADMIN DELETE ERROR:", err.response?.data || err.message);
      toast(`Error deleting user: ${err.response?.data?.message || err.message}`, "error");
    }
  };



  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 transition-colors">
      <Sidebar />
      <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)] px-6 lg:px-10 py-4 lg:py-6 relative z-10 transition-all duration-200">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin text-4xl text-violet-500">🛡️</div>
          </div>
        ) : (
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black text-violet-600 dark:text-violet-500 uppercase tracking-[0.3em] mb-2">
                Executive Command
              </p>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                Admin Panel
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold text-sm leading-relaxed max-w-xl">
                Manage system users, roles, and send notices. Available to Campus Administrators
                only.
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Total Users", val: users.length, color: "violet" },
              {
                label: "Active Access",
                val: users.filter((u) => u.status === "active").length,
                color: "emerald",
              },
              {
                label: "Suspended",
                val: users.filter((u) => u.status === "suspended").length,
                color: "rose",
              },
            ].map((s) => (
              <div
                key={s.label}
                className={`bg-white dark:bg-slate-800/60 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-xl group hover:border-${s.color}-500/30 transition-all hover:-translate-y-1`}
              >
                <p
                  className={`text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-1 ${s.color === "rose" ? "text-rose-500/80" : ""}`}
                >
                  {s.label}
                </p>
                <p
                  className={`text-4xl font-black text-slate-900 dark:text-white tracking-tighter`}
                >
                  {s.val}
                </p>
                <div
                  className={`mt-6 h-1 w-16 bg-${s.color}-500 rounded-full group-hover:w-full transition-all`}
                ></div>
              </div>
            ))}
          </div>

          {/* Authorized Administrators Section */}
          <div className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/5 overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between bg-violet-500/5">
              <h2 className="text-xs font-black text-violet-600 dark:text-violet-400 uppercase tracking-[0.3em] flex items-center gap-3">
                <Shield size={14} className="animate-pulse" />
                Authorized Administrators
              </h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {users
                .filter((u) =>
                  ["rahulpatted02@gmail.com", "darshanhallur36198@gmail.com"].includes(
                    u.email.toLowerCase()
                  )
                )
                .map((u, i) => (
                  <motion.div
                    key={u._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-6 hover:bg-violet-50/50 dark:hover:bg-violet-500/5 transition-colors group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-[1.5rem] bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-violet-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all border-2 border-white dark:border-slate-700">
                        {u.name?.[0] || "A"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-800 dark:text-white text-md tracking-tight">
                            {u.name}
                          </p>
                          <Shield size={12} className="text-violet-500" fill="currentColor" />
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{u.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 justify-end">
                      <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-violet-600 text-white shadow-sm">
                        ROOT ADMIN
                      </span>
                      <span
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${u.status === "active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"}`}
                      >
                        {u.status}
                      </span>

                      <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
                        <button
                          onClick={() => sendNotice(u.name)}
                          title="Send Notice"
                          className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-500 transition-all hover:scale-110 active:scale-95"
                        >
                          <Mail size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Regular System Users Section */}
          <div className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/5 overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-6 h-px bg-slate-200 dark:bg-slate-700"></span>
                System Users
              </h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {users
                .filter(
                  (u) =>
                    !["rahulpatted02@gmail.com", "darshanhallur36198@gmail.com"].includes(
                      u.email.toLowerCase()
                    )
                )
                .map((u, i) => (
                  <motion.div
                    key={u._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-[1.5rem] bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-slate-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all">
                        {u.name?.[0] || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white text-md tracking-tight">
                          {u.name}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">{u.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 justify-end">
                      <span
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${roleColors[u.role] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-white/5"}`}
                      >
                        {u.role}
                      </span>
                      <span
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${u.status === "active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse"}`}
                      >
                        {u.status}
                      </span>

                      <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
                        <button
                          onClick={() => sendNotice(u.name)}
                          title="Send Notice"
                          className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-500 transition-all hover:scale-110 active:scale-95"
                        >
                          <Mail size={16} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => toggleStatus(u._id, u.status)}
                          title={u.status === "active" ? "Suspend" : "Activate"}
                          className={`p-3 rounded-xl transition-all hover:scale-110 active:scale-95 ${u.status === "active" ? "bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-500" : "bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-500"}`}
                        >
                          {u.status === "active" ? (
                            <UserX size={16} strokeWidth={2.5} />
                          ) : (
                            <UserCheck size={16} strokeWidth={2.5} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(u._id, u.name)}
                          title="Permanently Delete User"
                          className="p-3 bg-red-50 dark:bg-red-500/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 transition-all hover:scale-110 active:scale-95"
                        >
                          <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
