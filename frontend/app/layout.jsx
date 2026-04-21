import "./globals.css";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/components/ToastProvider";
import { DarkModeProvider } from "@/components/DarkModeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import BottomNav from "@/components/BottomNav";



import MouseTracker from "@/components/MouseTracker";

export const metadata = {
  title: "Smart Wastage Management System",
  description: "An intelligent ecosystem to monitor, forecast, and dramatically reduce food waste."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-slate-900 transition-colors">
        <script dangerouslySetInnerHTML={{ __html: `
          window.ethereum = undefined;
          window.web3 = undefined;
          console.log("🛡️ Web3 Jammer Active: MetaMask blocked.");
        ` }} />
        <MouseTracker />
        <DarkModeProvider>
          <AuthProvider>
            <ToastProvider>
              <Navbar />
                <main className="md:mb-0 mb-16">
                  {children}
                </main>
              <BottomNav />
            </ToastProvider>
          </AuthProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}