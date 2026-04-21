"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function OnboardingWizard() {
  const { user } = useAuth() || {};
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Only show if user is logged in and hasn't seen the tour yet
    if (user && localStorage.getItem(`tourCompleted_${user.id}`) !== 'true') {
      // Small delay to let the dashboard render
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const steps = [
    {
      title: "Welcome to Command Center",
      content: "This is your central hub for tracking, managing, and predicting food waste impacts.",
      highlightClasses: "fixed top-20 left-1/2 -translate-x-1/2" // Mock highlight position
    },
    {
      title: "Quick Action Network",
      content: "Use these glowing core modules to immediately book meals, log inventory, or interface with partners.",
      highlightClasses: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    },
    {
      title: "Settings & Personalization",
      content: "Don't forget to configure your SMS alerts and UI mode in the Settings Engine below your Profile.",
      highlightClasses: "fixed bottom-10 left-10"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      completeTour();
    }
  };

  const completeTour = () => {
    setIsOpen(false);
    if (user) {
      localStorage.setItem(`tourCompleted_${user.id}`, 'true');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] pointer-events-none">
        {/* Dark overlay background */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto"
          onClick={completeTour}
        />
        
        {/* Floating Tooltip */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className={`absolute pointer-events-auto bg-white dark:bg-slate-800 p-8 rounded-[2rem] max-w-sm shadow-2xl border border-emerald-500/30 ${steps[step].highlightClasses}`}
          style={{ zIndex: 101 }}
        >
          <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-black text-xs border border-emerald-500/30">
               {step + 1}/{steps.length}
             </div>
             <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">{steps[step].title}</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed mb-8">
            {steps[step].content}
          </p>
          
          <div className="flex items-center justify-between">
             <button onClick={completeTour} className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors tracking-widest">
                Skip Tour
             </button>
             <button onClick={handleNext} className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95 group">
                {step === steps.length - 1 ? (
                  <>Finish <Check size={14} className="group-hover:scale-110 transition-transform" /></>
                ) : (
                  <>Next <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
                )}
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
