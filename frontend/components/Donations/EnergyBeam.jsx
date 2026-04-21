"use client";
import { motion } from "framer-motion";

export default function EnergyBeam({ color = "stroke-emerald-500", delay = 0 }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <svg className="w-full h-full opacity-30 dark:opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M -10,50 Q 25,20 50,50 T 110,50"
          fill="transparent"
          strokeWidth="0.5"
          className={color}
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ 
            pathLength: [0, 0.5, 0], 
            pathOffset: [0, 1] 
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: delay
          }}
        />
        <motion.path
          d="M -10,30 Q 30,60 60,30 T 110,30"
          fill="transparent"
          strokeWidth="0.3"
          className={color}
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ 
            pathLength: [0, 0.4, 0], 
            pathOffset: [0, 1] 
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "linear",
            delay: delay + 1
          }}
        />
      </svg>
    </div>
  );
}
