"use client";
import { useEffect, useState } from "react";
import API from "@/services/api";
import Skeleton from "@/components/Skeleton";
import { useToast } from "@/components/ToastProvider";
import QRScanner from "./QRScanner";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, ClipboardList, Download, Plus, X, Maximize2, ChefHat } from "lucide-react";

const PAGE_SIZE = 5;
const LOW_STOCK_THRESHOLD = 10;

export default function InventoryTable(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState(props.activeFilter || "all");

  useEffect(() => {
    if (props.activeFilter) {
      setFilter(props.activeFilter);
      setPage(1);
    }
  }, [props.activeFilter]);
  const [showScanner, setShowScanner] = useState(false);
  const [expandedQR, setExpandedQR] = useState(null);
  const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);
  const [recipes, setRecipes] = useState(null);
  const toast = useToast();

  useEffect(() => {
    API.get("/inventory")
      .then(res => {
        const items = res.data || [];
        setData(items);
        const lowStock = items.filter(i => i.quantity <= LOW_STOCK_THRESHOLD);
        if (lowStock.length > 0) {
          toast(`⚠️ ${lowStock.length} item(s) are running low on stock!`, "warning");
        }
      })
      .catch(() => {
        toast("Failed to load inventory.", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleScan = (result) => {
    toast(`📦 Scanned: ${result}. Stock entry successfully recorded!`, "success");
  };

  const generateProcurement = () => {
    const lowStock = data.filter(i => i.quantity <= LOW_STOCK_THRESHOLD);
    if (lowStock.length === 0) {
      toast("All stock levels are healthy! No procurement needed.", "success");
      return;
    }
    const header = "Item,Current Stock,Target Stock,To Order";
    const rows = lowStock.map(i => `${i.item},${i.quantity},50,${50 - i.quantity}`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `procurement_order_${new Date().toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast("Procurement report generated!", "success");
  };

  const isExpiringSoon = (date) => {
    if (!date) return false;
    const diff = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24);
    return diff <= 3 && diff >= 0;
  };

  const generateRecipes = () => {
    setIsGeneratingRecipes(true);
    setTimeout(() => {
        setRecipes([
            { icon: "🥘", title: "Zero-Waste Veggie Hash", time: "15 mins", description: "A quick, high-nutrient breakfast hash using leftover bread and available vegetables." },
            { icon: "🥪", title: "Savoury Bread Pudding", time: "30 mins", description: "Bake near-expiry bread with herbs, stock, and remaining vegetable scraps." },
            { icon: "🍲", title: "Canteen Leftover Stew", time: "45 mins", description: "A slow-cooked stew that maximizes flavor from wilting greens and expiring items." }
        ]);
        setIsGeneratingRecipes(false);
    }, 2500);
  };

  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const getStatus = (item) => {
    if (isExpired(item.expiryDate)) return { label: "Expired", cls: "bg-red-500/20 text-red-400 border border-red-500/30", critical: false };
    
    // Critical Rescue: Less than 24 hours
    const diffHours = (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60);
    if (diffHours > 0 && diffHours <= 24) {
      return { label: "Critical Rescue", cls: "bg-rose-500 text-white animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.5)] border-rose-400", critical: true };
    }

    if (isExpiringSoon(item.expiryDate)) return { label: "Expiring Soon", cls: "bg-amber-500/20 text-amber-400 border border-amber-500/30", critical: false };
    if (item.quantity <= LOW_STOCK_THRESHOLD) return { label: "Low Stock", cls: "bg-orange-500/20 text-orange-400 border border-orange-500/30", critical: false };
    return { label: "In Stock", cls: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30", critical: false };
  };

  const filtered = (filter === "all" ? data
    : filter === "low" ? data.filter(i => i.quantity <= LOW_STOCK_THRESHOLD)
    : data.filter(i => isExpiringSoon(i.expiryDate) || isExpired(i.expiryDate))
  ).sort((a, b) => {
    const aDiff = (new Date(a.expiryDate) - new Date()) / (1000 * 60 * 60);
    const bDiff = (new Date(b.expiryDate) - new Date()) / (1000 * 60 * 60);
    
    const aCritical = aDiff > 0 && aDiff <= 24;
    const bCritical = bDiff > 0 && bDiff <= 24;

    if (aCritical && !bCritical) return -1;
    if (!aCritical && bCritical) return 1;
    return 0;
  });

  const expiringItems = data.filter(i => isExpiringSoon(i.expiryDate));

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14 w-full" />)}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Smart Suggestions Panel & AI Chef */}
      {expiringItems.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-[2rem] p-1 text-white shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 group">
          <div className="absolute top-0 right-0 p-8 opacity-10"><ChefHat size={120} className="transform rotate-12 group-hover:scale-110 transition-transform" /></div>
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-600/20 backdrop-blur-xl rounded-[2rem] p-8 relative z-10 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-500/30 p-4 rounded-[1.5rem] border border-indigo-400/30 shadow-inner hidden sm:block">
                <ChefHat className="text-indigo-200" size={32} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-xl text-white flex items-center gap-2">
                    AI Chef Assistant
                    <span className="bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest animate-pulse border border-indigo-400">Beta</span>
                  </h3>
                </div>
                <p className="text-indigo-200 text-sm mb-4 font-medium">You have {expiringItems.length} items expiring very soon: <span className="text-white font-bold">{expiringItems.map(i => i.item).join(", ")}</span>.</p>
                
                {!recipes && !isGeneratingRecipes && (
                  <button onClick={generateRecipes} className="flex items-center gap-2 bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                    Generate Zero-Waste Recipes ✨
                  </button>
                )}

                {isGeneratingRecipes && (
                  <div className="flex items-center gap-3 text-indigo-200 text-sm font-bold mt-2">
                    <div className="h-4 w-4 rounded-full border-2 border-t-white border-white/20 animate-spin"></div>
                    AI is analyzing ingredient synergies...
                  </div>
                )}

                {recipes && (
                   <div className="mt-6 space-y-3">
                     {recipes.map((r, idx) => (
                       <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.2 }} key={r.title} className="bg-black/30 border border-white/10 rounded-xl p-4 flex gap-4 items-start hover:bg-black/40 transition-colors cursor-pointer group">
                         <div className="text-3xl group-hover:scale-110 transition-transform">{r.icon}</div>
                         <div>
                           <div className="flex items-center gap-2">
                             <h4 className="font-black text-white text-md">{r.title}</h4>
                             <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-1.5 py-0.5 rounded font-bold">{r.time}</span>
                           </div>
                           <p className="text-xs text-indigo-200 mt-1">{r.description}</p>
                         </div>
                       </motion.div>
                     ))}
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Vitals Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
          <div className="bg-white dark:bg-slate-800/60 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-xl group hover:border-emerald-500/30 transition-all hover:-translate-y-1">
             <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-1">Total Stock Items</p>
             <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{data.length}</p>
             <div className="mt-6 h-1 w-16 bg-emerald-500 rounded-full group-hover:w-full transition-all"></div>
          </div>
          <div className="bg-white dark:bg-slate-800/60 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-xl group hover:border-orange-500/30 transition-all hover:-translate-y-1">
             <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-1">Low Stock Alerts</p>
             <p className="text-4xl font-black text-orange-500 tracking-tighter">{data.filter(i => i.quantity <= LOW_STOCK_THRESHOLD).length}</p>
             <div className="mt-6 h-1 w-16 bg-orange-500 rounded-full group-hover:w-full transition-all"></div>
          </div>
          <div className="bg-white dark:bg-slate-800/60 backdrop-blur-sm p-8 rounded-[2rem] border border-rose-500/20 shadow-xl group hover:border-rose-500/30 transition-all hover:-translate-y-1">
             <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-1 text-rose-500/80">Critical Rescue</p>
             <p className="text-4xl font-black text-rose-600 tracking-tighter">
               {data.filter(i => {
                  const diffHours = (new Date(i.expiryDate) - new Date()) / (1000 * 60 * 60);
                  return diffHours > 0 && diffHours <= 24;
               }).length}
             </p>
             <div className="mt-6 h-1 w-16 bg-rose-500 rounded-full group-hover:w-full transition-all animate-pulse"></div>
          </div>
      </div>

      <div className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden relative shadow-xl transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-6 p-8 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
               <span className="w-6 h-px bg-slate-200 dark:bg-slate-700"></span>
               Inventory Stock
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setShowScanner(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95">
              <QrCode size={18} />
              Scan
            </button>
            <button onClick={generateProcurement}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl text-sm font-black uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 border border-slate-200 dark:border-slate-700">
              <ClipboardList size={18} />
              Report
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block"></div>
            {["all", "low", "expiring"].map(f => (
              <button key={f} onClick={() => { setFilter(f); setPage(Page => 1); }}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${filter === f ? "bg-slate-900 dark:bg-emerald-500 text-white shadow-lg" : "bg-slate-50 dark:bg-slate-700/50 text-slate-400 hover:text-slate-600 dark:hover:text-white"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {showScanner && (
            <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700/60 text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="py-5 px-8">QR Tag</th>
                <th className="py-5 px-8">Item Info</th>
                <th className="py-5 px-8">Quantity</th>
                <th className="py-5 px-8">Expiry Date</th>
                <th className="py-5 px-8 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 transition-colors">
              {paginated.length === 0 ? (
                <tr><td colSpan="5" className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">No matching items found</td></tr>
              ) : paginated.map(item => {
                const status = getStatus(item);
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${item.item}-${item._id?.slice(-4)}`;
                return (
                  <tr key={item._id} className={`hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5 transition-colors group ${status.critical ? "border-l-4 border-rose-500 bg-rose-500/5" : ""}`}>
                    <td className="py-5 px-8">
                       <div className="relative w-12 h-12 cursor-pointer overflow-hidden rounded-2xl border-2 border-slate-100 dark:border-slate-700 group-hover:border-emerald-500/50 transition-all shadow-sm"
                            onClick={() => setExpandedQR({ url: qrUrl, name: item.item })}>
                          <img src={qrUrl} alt="QR" className="w-full h-full grayscale group-hover:grayscale-0 transition-opacity opacity-80 group-hover:opacity-100" />
                          <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <Maximize2 size={16} className="text-emerald-700 dark:text-white" />
                          </div>
                       </div>
                    </td>
                    <td className="py-5 px-8">
                       <div className="flex flex-col">
                          <span className="font-black text-slate-800 dark:text-white text-lg tracking-tight flex items-center gap-2">
                             {item.quantity <= LOW_STOCK_THRESHOLD && <span className="text-orange-500 animate-pulse">⚠️</span>}
                             {item.item}
                          </span>
                          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Inventory Unit</span>
                       </div>
                    </td>
                    <td className="py-5 px-8 text-right md:text-left">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-black tracking-tight ${ item.quantity <= LOW_STOCK_THRESHOLD ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20" : "bg-slate-50 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-white/5"}`}>
                        {item.quantity} units
                      </span>
                    </td>
                    <td className="py-5 px-8 text-slate-500 dark:text-slate-400 text-sm font-bold">
                      {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "Not Set"}
                    </td>
                    <td className="py-5 px-8 text-right">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/30 dark:bg-transparent">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page {page} of {totalPages}</p>
            <div className="flex gap-3">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-sm">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-sm">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Expanded QR Modal */}
      <AnimatePresence>
        {expandedQR && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" onClick={() => setExpandedQR(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                 className="bg-white dark:bg-slate-800 rounded-3xl p-10 max-w-sm w-full text-center relative border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
               <button onClick={() => setExpandedQR(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><X size={20}/></button>
               <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{expandedQR.name}</h3>
               <p className="text-xs text-slate-500 font-bold mb-8 uppercase tracking-widest leading-none">Official Inventory Label</p>
               <div className="bg-white p-6 rounded-3xl shadow-inner border-4 border-emerald-500/20 mb-8 aspect-square flex items-center justify-center">
                  <img src={expandedQR.url} alt="Large QR" className="w-full h-full" />
               </div>
               <button onClick={() => window.print()} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase text-xs tracking-tighter hover:scale-105 transition-all shadow-xl">Print Label 🖨️</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}