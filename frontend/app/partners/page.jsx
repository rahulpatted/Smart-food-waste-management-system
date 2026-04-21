"use client";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Mail, Phone, MapPin, Building2, ExternalLink, Search } from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import Sidebar from "@/components/Sidebar";
import API from "@/services/api";

const roleColors = {
  donor: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200/50",
  ngo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 border-indigo-200/50",
};

export default function PartnerDirectory() {
  const { user } = useAuth() || {};
  const router = useRouter();
  const toast = useToast();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user && !["admin", "staff", "ngo"].includes(user.role)) {
      router.push("/dashboard");
    } else {
      fetchPartners();
    }
  }, [user]);

  const fetchPartners = async () => {
    try {
      const { data } = await API.get("user/all-partners");
      // Filter for donors and NGOs only for the staff view
      const filtered = data.filter(u => ["donor", "ngo"].includes(u.role));
      setPartners(filtered);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      toast(`Failed to sync partner directory: ${errorMsg}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners = partners.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 transition-colors relative overflow-hidden mesh-gradient">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, 60, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full filter blur-[100px]"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, -80, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-15%] left-[-5%] w-[45rem] h-[45rem] bg-amber-400/10 dark:bg-amber-500/5 rounded-full filter blur-[120px]"
        />
      </div>

      <Sidebar />

      <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)] p-6 lg:p-10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-2 leading-none">Collaboration Hub</p>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Partner Directory</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold text-sm leading-relaxed max-w-xl">Coordinate with donor organizations and logistics partners across the network.</p>
            </div>

            <div className="relative group min-w-[300px]">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Search size={18} />
              </div>
              <input 
                type="text"
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/80 dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm dark:shadow-2xl"
              />
            </div>
          </header>

          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-[3rem] border border-white dark:border-white/5">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Syncing Network...</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartners.map((partner, i) => (
                <motion.div 
                  key={partner._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 shadow-xl dark:shadow-2xl hover:border-indigo-500/30 transition-all group flex flex-col h-full hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/20 group-hover:rotate-6 group-hover:scale-110 transition-transform">
                      {partner.name?.[0] || 'U'}
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${roleColors[partner.role]}`}>
                      {partner.role}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 truncate">{partner.name}</h3>
                  <div className="space-y-4 mb-8 flex-grow">
                    <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center shrink-0"><Mail size={14} className="text-slate-500" /></div>
                      <p className="text-sm font-bold truncate">{partner.email}</p>
                    </div>
                    {partner.location && (
                      <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center shrink-0"><MapPin size={14} className="text-slate-500" /></div>
                        <p className="text-sm font-bold truncate">{partner.location}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-auto">
                    <button className="py-4 px-4 bg-slate-50 dark:bg-white/5 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm">
                      <Mail size={12} /> Message
                    </button>
                    <button className="py-4 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 active:scale-95">
                      <ExternalLink size={12} /> Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredPartners.length === 0 && (
            <div className="text-center py-20 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-[3rem] border border-white dark:border-white/5">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-wide">No Partners Found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-bold max-w-xs mx-auto uppercase tracking-tight opacity-70">Expand our network by inviting more local donors and NGOs to join the mission.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
