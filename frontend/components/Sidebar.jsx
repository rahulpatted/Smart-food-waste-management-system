"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Utensils,
  Package,
  Trash2,
  Handshake,
  Map as MapIcon,
  User as UserIcon,
  Users,
  LogOut,
  ChevronRight,
  ChefHat,
  BarChart3,
  Shield,
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth() || {};
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    // Brief timeout to ensure the UI state 'Signing Out...' is visible before the redirect clears memory
    setTimeout(() => {
      if (logout) logout();
      else {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }, 150);
  };

  const isAuthenticated = !!user;

  const roleLinks = {
    admin: [
      { href: "/dashboard", icon: LayoutDashboard, text: "Admin Dashboard" },
      { href: "/inventory", icon: Package, text: "Inventory Setup" },
      { href: "/waste", icon: Trash2, text: "Global Waste Logs" },
      { href: "/donations", icon: Handshake, text: "Donation Records" },
      { href: "/map", icon: MapIcon, text: "System Map" },
      { href: "/menu-planner", icon: ChefHat, text: "Menu Control" },
      { href: "/admin", icon: Shield, text: "Admin Console" },
    ],
    staff: [
      { label: "Core Operations" },
      { href: "/dashboard", icon: LayoutDashboard, text: "Staff Dashboard" },
      { href: "/inventory", icon: Package, text: "Manage Inventory" },
      { href: "/waste", icon: Trash2, text: "Log Waste" },
      { href: "/menu-planner", icon: ChefHat, text: "Menu Planner" },
      { label: "Partnership Hub" },
      { href: "/donations", icon: Handshake, text: "Donation Hub" },
      { href: "/map", icon: MapIcon, text: "Partner Map" },
      { href: "/partners", icon: Users, text: "Partner Directory" },
    ],
    donor: [
      { href: "/dashboard", icon: LayoutDashboard, text: "Impact Dashboard" },
      { href: "/donations", icon: Handshake, text: "My Donations" },
      { href: "/map", icon: MapIcon, text: "Impact Map" },
    ],
    ngo: [
      { href: "/dashboard", icon: LayoutDashboard, text: "NGO Dashboard" },
      { href: "/donations", icon: Handshake, text: "Redistribution Board" },
      { href: "/map", icon: MapIcon, text: "Live Route Map" },
      { href: "/partners", icon: Users, text: "Collaborators" },
    ],
    student: [
      { href: "/dashboard", icon: LayoutDashboard, text: "Student Hub" },
      { href: "/meals", icon: Utensils, text: "Student Meals" },
    ],
  };

  const navLinks =
    user?.role && roleLinks[user.role]
      ? roleLinks[user.role]
      : [{ href: "/dashboard", icon: LayoutDashboard, text: "Dashboard" }];

  return (
    <div className="hidden md:flex w-64 sticky top-16 h-[calc(100vh-64px)] bg-white/80 dark:bg-slate-900/60 backdrop-blur-3xl border-r border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 p-6 flex-col shadow-xl dark:shadow-[20px_0_50px_rgba(0,0,0,0.3)] shrink-0 z-50 overflow-hidden print:hidden">
      <div className="flex items-center gap-3 mb-10 px-2 group">
        <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-inner group-hover:scale-110 transition-transform">
          <div className="w-5 h-5 bg-emerald-500 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-xs font-black tracking-[0.2em] text-slate-400 dark:text-white uppercase leading-none">
            Navigation
          </h2>
          <div className="h-0.5 w-8 bg-emerald-500 mt-2 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </div>
      </div>

      <ul className="space-y-4 flex-grow overflow-y-auto no-scrollbar pr-2">
        {navLinks.map((link, idx) =>
          link.label ? (
            <li key={`lbl-${idx}`} className="pt-4 pb-2 px-5 first:pt-0">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                {link.label}
              </span>
            </li>
          ) : (
            <SidebarLink
              key={link.href + idx}
              href={link.href}
              icon={link.icon}
              text={link.text}
              active={pathname === link.href}
            />
          )
        )}
        {isAuthenticated && (
          <SidebarLink
            href="/profile"
            icon={UserIcon}
            text="My Profile"
            active={pathname === "/profile"}
          />
        )}
      </ul>

      <div className="mt-auto pt-8 flex flex-col gap-5 border-t border-slate-100 dark:border-white/10">
        {isAuthenticated ? (
          <>
            <Link href="/profile" className="block">
              <motion.div
                whileHover={{ x: 5, y: -2 }}
                className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer group shadow-sm dark:shadow-lg"
              >
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-black text-xs shadow-xl border border-white/10 group-hover:rotate-6 transition-transform">
                    {user.role?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></div>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight capitalize truncate">
                    {user.name || user.role}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${pathname === "/profile" ? "bg-indigo-500" : "bg-emerald-500 animate-pulse"}`}
                    ></div>
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate">
                      {pathname === "/profile" ? "Return to Hub →" : "Active Now"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`group flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 font-bold w-full ${
                isLoggingOut
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-wait"
                  : "bg-rose-500/5 text-rose-500 dark:text-rose-400 border-rose-500/10 hover:bg-rose-500 hover:text-white hover:shadow-xl hover:shadow-rose-500/20"
              }`}
            >
              <LogOut
                size={18}
                className={`${isLoggingOut ? "animate-pulse" : "group-hover:-translate-x-1"} transition-transform`}
              />
              <span className="text-xs">{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
              {!isLoggingOut && (
                <ChevronRight
                  size={14}
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                />
              )}
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase text-center tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="w-full py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-600 dark:text-white rounded-2xl text-xs font-black uppercase text-center tracking-widest hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarLink({ href, icon: Icon, text, active }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li>
      <Link href={href}>
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ x: 6 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative border ${
            active
              ? "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.2)]"
              : "bg-transparent border-transparent text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50/50 dark:hover:bg-white/5 hover:border-slate-200 dark:hover:border-white/10"
          }`}
        >
          {/* Active Border Indicator */}
          {active && (
            <motion.div
              layoutId="activeGlow"
              className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
            />
          )}

          <div
            className={`relative z-10 shrink-0 ${active ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-600 group-hover:text-emerald-500"} transition-colors`}
          >
            <Icon
              size={20}
              strokeWidth={active ? 2.5 : 2}
              className={active ? "drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" : ""}
            />
          </div>

          <div className="relative z-10 overflow-hidden">
            <span
              className={`text-[11px] font-black uppercase tracking-[0.15em] italic whitespace-nowrap transition-all ${active ? "text-emerald-600 dark:text-emerald-400" : ""}`}
            >
              {text}
            </span>
          </div>

          {!active && (
            <ChevronRight
              size={14}
              className="ml-auto text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
            />
          )}
        </motion.div>
      </Link>
    </li>
  );
}
