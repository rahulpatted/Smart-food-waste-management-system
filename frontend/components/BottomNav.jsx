"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Utensils,
  Package,
  Handshake,
  Map as MapIcon,
  Shield,
  Settings,
  User,
} from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth() || {};
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !user) return null;
  if (pathname === "/login" || pathname === "/register") return null;

  const roleMobileLinks = {
    admin: [
      { href: "/dashboard", icon: LayoutDashboard, text: "Home" },
      { href: "/inventory", icon: Package, text: "Stock" },
      { href: "/donations", icon: Handshake, text: "Board" },
      { href: "/admin", icon: Shield, text: "Admin" },
      { href: "/profile", icon: User, text: "Profile" },
    ],
    staff: [
      { href: "/dashboard", icon: LayoutDashboard, text: "Home" },
      { href: "/inventory", icon: Package, text: "Stock" },
      { href: "/meals", icon: Utensils, text: "Meals" },
      { href: "/map", icon: MapIcon, text: "Map" },
      { href: "/profile", icon: User, text: "Profile" },
    ],
    student: [
      { href: "/dashboard", icon: LayoutDashboard, text: "Hub" },
      { href: "/meals", icon: Utensils, text: "Meals" },
      { href: "/map", icon: MapIcon, text: "Map" },
      { href: "/profile", icon: User, text: "Profile" },
    ],
    ngo: [
      { href: "/dashboard", icon: LayoutDashboard, text: "Hub" },
      { href: "/donations", icon: Handshake, text: "Pickups" },
      { href: "/map", icon: MapIcon, text: "Route" },
      { href: "/profile", icon: User, text: "Profile" },
    ],
    donor: [
      { href: "/dashboard", icon: LayoutDashboard, text: "Impact" },
      { href: "/donations", icon: Handshake, text: "Donate" },
      { href: "/map", icon: MapIcon, text: "Map" },
      { href: "/profile", icon: User, text: "Profile" },
    ],
  };

  // Limit to max 5 items for mobile bottom bar
  const navLinks = (roleMobileLinks[user.role] || roleMobileLinks.student).slice(0, 5);

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50 pb-safe print:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
      <div className="flex justify-around items-center h-16">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative transition-all ${isActive ? "text-emerald-500" : "text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
            >
              {isActive && (
                <div className="absolute -top-[1px] w-8 h-[2px] bg-emerald-500 rounded-b-full shadow-[0_2px_10px_rgba(16,185,129,0.5)]"></div>
              )}
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 2}
                className={
                  isActive ? "scale-110 transition-transform" : "scale-100 transition-transform"
                }
              />
              <span
                className={`text-[9px] font-black uppercase tracking-widest ${isActive ? "opacity-100" : "opacity-70"}`}
              >
                {link.text}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
