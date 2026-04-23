"use client";
import dynamic from "next/dynamic";
import Skeleton from "@/components/Skeleton";

// Dynamically import the LiveMap component, disabling SSR so 'window' is defined
const LiveMap = dynamic(() => import("./LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[250px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center p-6 text-center">
      <div className="text-4xl mb-3 animate-pulse">🌍</div>
      <p className="font-semibold text-slate-500 dark:text-slate-400">Loading Map Data...</p>
    </div>
  ),
});

export default function MapWrapper(props) {
  return <LiveMap {...props} />;
}
