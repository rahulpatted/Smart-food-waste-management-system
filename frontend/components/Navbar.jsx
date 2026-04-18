"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDarkMode } from "@/components/DarkModeProvider";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const pathname = usePathname();
  const darkMode = useDarkMode();
  const { user, logout } = useAuth() || {};

  if (pathname === '/login' || pathname === '/register') return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <Link href="/" className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-800">
              FoodSave
            </Link>
          </div>



          <div className="flex items-center gap-3">
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
              <div className="flex items-center gap-2">
                <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold hover:bg-emerald-100 transition-colors">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                    {user.role?.[0]?.toUpperCase() || "U"}
                  </span>
                  {user.role}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm px-3 py-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="px-4 py-2 text-sm font-semibold rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
                Login
              </Link>
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