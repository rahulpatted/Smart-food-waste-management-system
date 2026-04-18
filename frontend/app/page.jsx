import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-300/30 rounded-full blur-3xl filter animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-300/20 rounded-full blur-3xl filter animate-pulse delay-1000"></div>

      <div className="z-10 text-center glass-card p-12 mx-4 max-w-3xl transform transition-all hover:scale-[1.02] duration-500">
        <div className="inline-block p-4 rounded-full bg-emerald-100 text-emerald-600 mb-6 shadow-sm">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-800 tracking-tight leading-tight mb-4">
          Smart Food Waste Management
        </h1>
        <p className="mt-4 text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
          An intelligent ecosystem to monitor, forecast, and dramatically reduce food waste in institutional dining. <span className="font-bold text-emerald-600">Save costs. Help society 🌱</span>
        </p>
        
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link href="/login" className="px-8 py-3.5 text-white font-semibold rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-1">
            Login
          </Link>
          <Link href="/register" className="px-8 py-3.5 text-emerald-700 font-semibold rounded-full bg-white border border-emerald-200 hover:bg-emerald-50 shadow-sm transition-all hover:-translate-y-1">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}