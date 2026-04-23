"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDarkMode } from "@/components/DarkModeProvider";
import { useAuth } from "@/components/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowLeft, Sprout } from "lucide-react";
import { useRouter } from "next/navigation";
import socket from "@/services/socket";

export default function Navbar() {
  const pathname = usePathname();
  const darkMode = useDarkMode();
  const { user, logout } = useAuth() || {};
  const [alertsOpen, setAlertsOpen] = useState(false);
  const router = useRouter();
  const role = user?.role || "student";
  const isDashboard = pathname === "/dashboard";

  const [notifications, setNotifications] = useState({
    student: [
      {
        id: 101,
        icon: "✅",
        title: "Resources Distributed",
        message: "Fresh surplus has reached the community distribution hub!",
        link: "/meals",
        color: "text-emerald-600",
        isRead: false,
      },
      {
        id: 102,
        icon: "🍱",
        title: "Daily Meals Available",
        message: "Check today's freshly prepared food items for the community.",
        link: "/meals",
        color: "text-blue-600",
        isRead: false,
      },
    ],
    donor: [
      {
        id: 201,
        icon: "🏆",
        title: "Impact Milestone",
        message: "Your last 15kg donation has successfully reached students!",
        link: "/donations",
        color: "text-emerald-600",
        isRead: false,
      },
      {
        id: 202,
        icon: "📍",
        title: "Pickup Confirmed",
        message: "An NGO has successfully picked up your surplus food.",
        link: "/donations",
        color: "text-indigo-600",
        isRead: false,
      },
    ],
    ngo: [
      {
        id: 301,
        icon: "🤝",
        title: "New Surplus Alert",
        message: "Fresh surplus batch available from Downtown Canteen.",
        link: "/donations",
        color: "text-orange-600",
        isRead: false,
      },
      {
        id: 302,
        icon: "🛵",
        title: "Delivery in Transit",
        message: "A donation pickup is currently en-route for distribution.",
        link: "/map",
        color: "text-blue-600",
        isRead: false,
      },
      {
        id: 303,
        icon: "🌍",
        title: "Community Impact",
        message: "You completed 5 pickups! Redistribution metrics added.",
        link: "/profile",
        color: "text-amber-500",
        isRead: true,
      },
    ],
    staff: [
      {
        id: 501,
        icon: "⚠️",
        title: "Inventory Alert",
        message: "Critical low shelf life: Bread & Dairy in Main Canteen.",
        link: "/inventory",
        color: "text-rose-600",
        isRead: false,
      },
      {
        id: 502,
        icon: "♻️",
        title: "Sustainability Target",
        message: "Waste reduction goal for this week has been exceeded.",
        link: "/waste",
        color: "text-emerald-600",
        isRead: true,
      },
    ],
    admin: [
      {
        id: 601,
        icon: "🛡️",
        title: "System Heartbeat",
        message: "All donor-student distribution nodes are performing optimally.",
        link: "/admin",
        color: "text-indigo-600",
        isRead: false,
      },
      {
        id: 602,
        icon: "📈",
        title: "Global Report",
        message: "New monthly food waste reduction analytics are ready.",
        link: "/staff-reports",
        color: "text-teal-600",
        isRead: false,
      },
    ],
  });

  useEffect(() => {
    if (!user) return;

    const handleAlert = (msg) => {
      // Basic role-based filtering logic
      let shouldAdd = false;
      let targetRole = "student";
      let icon = "🔔";
      let link = "/dashboard";
      let color = "text-indigo-600";

      if (msg.includes("New Surplus Food Available") && (role === "ngo" || role === "admin")) {
        shouldAdd = true;
        targetRole = role;
        icon = "🤝";
        link = "/donations";
        color = "text-orange-600";
      } else if (msg.includes("Donation Claimed") && (role === "donor" || role === "admin")) {
        shouldAdd = true;
        targetRole = role;
        icon = "📍";
        link = "/donations";
        color = "text-blue-600";
      } else if (
        msg.includes("Distribution Complete") &&
        (role === "student" || role === "donor" || role === "admin" || role === "staff")
      ) {
        shouldAdd = true;
        targetRole = role;
        icon = "✅";
        title = "Community Success";
        link = role === "student" || role === "staff" ? "/meals" : "/donations";
        color = "text-emerald-600";
      } else if (msg.includes("Waste") && (role === "staff" || role === "admin")) {
        shouldAdd = true;
        targetRole = role;
        icon = "♻️";
        link = "/waste";
        color = "text-rose-600";
      } else if (msg.includes("Low stock") && (role === "staff" || role === "admin")) {
        shouldAdd = true;
        targetRole = role;
        icon = "⚠️";
        link = "/inventory";
        color = "text-amber-600";
      }

      if (shouldAdd) {
        setNotifications((prev) => ({
          ...prev,
          [targetRole]: [
            {
              id: Date.now(),
              icon,
              title: "System Alert",
              message: msg,
              link,
              color,
              isRead: false,
            },
            ...prev[targetRole],
          ],
        }));
      }
    };

    socket.on("alert", handleAlert);
    return () => socket.off("alert", handleAlert);
  }, [user, role]);

  const activeNotifications = notifications[role] || notifications.student;
  const unreadCount = activeNotifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (id, link) => {
    setNotifications((prev) => ({
      ...prev,
      [role]: prev[role].map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }));
    router.push(link);
    setAlertsOpen(false);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => ({
      ...prev,
      [role]: prev[role].map((n) => ({ ...n, isRead: true })),
    }));
  };

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm transition-all print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 flex items-center gap-3 relative group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 flex items-center justify-center shadow-lg relative z-10 group-hover:rotate-12 transition-transform">
                <Sprout size={24} className="text-white drop-shadow-md" />
              </div>
              <div className="absolute -inset-1 bg-emerald-400 rounded-xl blur-md opacity-0 group-hover:opacity-40 transition-opacity"></div>
              <Link
                href="/"
                className="font-black text-xl tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 dark:from-emerald-400 dark:via-teal-300 dark:to-indigo-400 uppercase italic"
              >
                Smart Wastage System
              </Link>
            </motion.div>

            {/* Back Icon - Show when logged in and NOT on dashboard */}
            {user && !isDashboard && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: -2, scale: 1.1 }}
                onClick={() => router.push("/dashboard")}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 hover:text-emerald-600 transition-all border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center cursor-pointer"
                title="Back to Dashboard"
              >
                <ArrowLeft size={18} />
              </motion.button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Alerts icon */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setAlertsOpen(!alertsOpen)}
                  className="p-2 rounded-full relative hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Notifications"
                >
                  <span className="text-lg">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></span>
                  )}
                </button>

                <AnimatePresence>
                  {alertsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden origin-top-right z-50 text-left"
                    >
                      <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 dark:text-white">Recent Updates</h3>
                        {unreadCount > 0 && (
                          <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded">
                            {unreadCount} New
                          </span>
                        )}
                      </div>
                      <div className="p-2 max-h-96 overflow-y-auto">
                        {activeNotifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif.id, notif.link)}
                            className={`p-3 mb-1 rounded-xl transition-colors cursor-pointer flex gap-3 items-start group ${notif.isRead ? "hover:bg-slate-50 dark:hover:bg-slate-700/50 opacity-75" : "bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20"}`}
                          >
                            <div className="text-xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform relative">
                              {notif.icon}
                              {!notif.isRead && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500"></div>
                              )}
                            </div>
                            <div>
                              <p className={`text-sm font-bold ${notif.color}`}>{notif.title}</p>
                              <p
                                className={`text-xs mt-0.5 leading-snug ${notif.isRead ? "text-slate-500 dark:text-slate-400" : "text-slate-700 dark:text-slate-300 font-medium"}`}
                              >
                                {notif.message}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {unreadCount > 0 && (
                        <div className="p-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-center">
                          <button
                            onClick={markAllAsRead}
                            className="text-xs font-bold text-indigo-600 hover:underline"
                          >
                            Mark all as read
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Dark mode toggle */}
            {darkMode && (
              <button
                onClick={darkMode.toggle}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                title="Toggle dark mode"
              >
                {darkMode.dark ? "☀️" : "🌙"}
              </button>
            )}

            {user ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 flex items-center gap-3"
              >
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] italic transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-white/10"
                >
                  <span className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shadow-md rotate-3">
                    {user.role?.[0]?.toUpperCase() || "U"}
                  </span>
                  {user.role === "student" ? "Beneficiary" : user.role}
                </Link>
                <button
                  onClick={logout}
                  className="text-[10px] px-4 py-2 rounded-xl bg-rose-500/10 text-rose-500 dark:text-rose-400 font-black uppercase tracking-[0.15em] hover:bg-rose-500 hover:text-white transition-all cursor-pointer border border-rose-500/20"
                >
                  Logout
                </button>
              </motion.div>
            ) : (
              pathname !== "/" && (
                <div className="flex items-center gap-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/login"
                      className="px-5 py-2 text-sm font-black rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center"
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/register"
                      className="px-5 py-2 text-sm font-black rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_8px_15px_rgba(16,185,129,0.25)] transition-all hover:shadow-emerald-500/40"
                    >
                      Signup
                    </Link>
                  </motion.div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-full text-slate-600 dark:text-slate-300 font-medium hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-200"
    >
      {children}
    </Link>
  );
}
