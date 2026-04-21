"use client";
import { motion } from "framer-motion";
import { Navigation, Shield, Radio, Globe } from "lucide-react";

export default function SatelliteScan() {
  return (
    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-center p-12 relative overflow-hidden">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Rotating Orbital Rings */}
      <div className="relative mb-12">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-40px] border border-emerald-500/10 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-20px] border border-emerald-500/20 rounded-full border-dashed"
        />
        
        <div className="relative z-10 w-32 h-32 rounded-full bg-slate-800 border-4 border-emerald-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.2)]">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Globe size={48} className="text-emerald-500" />
          </motion.div>
          
          {/* Scanning Beam */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full bg-gradient-to-t from-emerald-500/40 to-transparent origin-center"
            style={{ clipPath: 'polygon(50% 50%, 50% 0%, 70% 0%)' }}
          />
        </div>
      </div>

      {/* Status Console */}
      <div className="relative z-20 space-y-4">
        <div className="flex items-center justify-center gap-6">
          <StatusNode icon={<Radio size={14} />} label="Signal" value="Locked" color="text-emerald-400" />
          <StatusNode icon={<Shield size={14} />} label="Secure" value="True" color="text-indigo-400" />
        </div>

        <h3 className="text-2xl font-black text-white tracking-[0.2em] uppercase">Acquiring Hybrid Link</h3>
        
        {/* Animated Progress Bar */}
        <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden mx-auto">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, repeat: Infinity }}
            className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
          />
        </div>

        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">
           Establishing Encrypted Geospatial Uplink...
        </p>
      </div>

      {/* Decorative Corners */}
      <Corner position="top-left" />
      <Corner position="top-right" />
      <Corner position="bottom-left" />
      <Corner position="bottom-right" />
    </div>
  );
}

function StatusNode({ icon, label, value, color }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`mb-1 ${color}`}>{icon}</div>
      <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{label}</p>
      <p className={`text-[10px] font-black uppercase ${color}`}>{value}</p>
    </div>
  );
}

function Corner({ position }) {
  const styles = {
    "top-left": "top-8 left-8 border-t-2 border-l-2",
    "top-right": "top-8 right-8 border-t-2 border-r-2",
    "bottom-left": "bottom-8 left-8 border-b-2 border-l-2",
    "bottom-right": "bottom-8 right-8 border-b-2 border-r-2"
  };
  return <div className={`absolute w-8 h-8 border-emerald-500/20 ${styles[position]}`} />;
}
