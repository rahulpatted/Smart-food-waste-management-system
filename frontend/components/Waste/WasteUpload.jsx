"use client";
import React, { useState, useEffect } from "react";
import API from "@/services/api";
import { useToast } from "@/components/ToastProvider";
import Skeleton from "@/components/Skeleton";
import MapWrapper from "@/components/Map/MapWrapper";
import { Trash2, Camera, X, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_SIZE = 5;

export default function WasteUpload() {
  const [weight, setWeight] = useState("");
  const [type, setType] = useState("edible");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [fetchingLogs, setFetchingLogs] = useState(true);
  const [page, setPage] = useState(1);
  const [useLocation, setUseLocation] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [expandedMap, setExpandedMap] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const toast = useToast();

  const fetchLogs = () => {
    setFetchingLogs(true);
    API.get("/waste")
      .then(res => setLogs(res.data || []))
      .catch(() => toast("Failed to load logs", "error"))
      .finally(() => setFetchingLogs(false));
  };

  useEffect(() => { fetchLogs(); }, []);

  const submitWaste = async (e) => {
    e.preventDefault();
    if (!weight) return;
    setLoading(true);
    try {
      await API.post("/waste/add", { type, weight: Number(weight), coordinates });
      toast(`✅ ${weight}kg of ${type} waste logged successfully!`, "success");
      setWeight("");
      fetchLogs();
    } catch (err) {
      toast("Failed to log waste. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (logs.length === 0) { toast("No data to export.", "warning"); return; }
    const header = "Type,Weight (kg),Date";
    const rows = logs.map(w => `${w.type},${w.weight},${new Date(w.createdAt || w.date).toLocaleDateString()}`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "waste_logs.csv"; a.click();
    URL.revokeObjectURL(url);
    toast("Waste logs exported as CSV!", "success");
  };

  const startVoiceEntry = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast("Voice recognition not supported in this browser.", "error");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast("Listening... Try: 'Log 5kg of edible waste'", "info");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("Voice Transcript:", transcript);

      // Simple Parsing Logic: "log [X]kg [type] waste"
      const weightMatch = transcript.match(/(\d+(\.\d+)?)\s*(kg|kilograms)/);
      const typeMatch = transcript.match(/(edible|spoiled|peels)/);

      if (weightMatch) {
        setWeight(weightMatch[1]);
        toast(`Captured Weight: ${weightMatch[1]}kg`, "success");
      }
      if (typeMatch) {
        setType(typeMatch[1]);
        toast(`Captured Type: ${typeMatch[1]}`, "success");
      }

      if (!weightMatch && !typeMatch) {
        toast("Couldn't process voice. Try 'Log 10kg edible'", "warning");
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast("Voice entry failed. Try again.", "error");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const totalPages = Math.ceil(logs.length / PAGE_SIZE);
  const paginated = logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Log Form */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="bg-rose-50 dark:bg-rose-900/20 border-b border-rose-100 dark:border-rose-900/40 p-6 flex items-center gap-3">
          <span className="text-3xl">🗑️</span>
          <div>
            <h2 className="text-xl font-bold text-rose-900 dark:text-rose-300">Log Daily Waste</h2>
            <p className="text-rose-700 dark:text-rose-400 text-sm font-medium">Capture excess for metrics generation</p>
          </div>
        </div>
        <form onSubmit={submitWaste} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Measured Weight (kg)</label>
              <div className="relative">
                <input type="number" step="0.1" required value={weight}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors bg-slate-50 dark:bg-slate-900 font-medium dark:text-white"
                  placeholder="Ex: 5.2" onChange={e => setWeight(e.target.value)} />
                <button 
                  type="button"
                  onClick={startVoiceEntry}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  title="Voice Entry"
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Condition Type</label>
              <select value={type} onChange={e => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors bg-slate-50 dark:bg-slate-900 font-medium text-slate-700 dark:text-white">
                <option value="edible">Edible (Donatable)</option>
                <option value="spoiled">Spoiled / Scrap</option>
                <option value="peels">Preparation Peels</option>
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Photo Verification (Optional)</label>
             <div className="flex items-center gap-4">
               <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all cursor-pointer group">
                 <div className="text-slate-400 group-hover:text-rose-500 transition-colors flex flex-col items-center">
                   <Camera size={24} className="mb-1" />
                   <span className="text-[10px] font-bold uppercase">Click to Capture/Upload</span>
                 </div>
                 <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                   const file = e.target.files[0];
                   if (file) {
                     const reader = new FileReader();
                     reader.onload = (re) => setPhotoPreview(re.target.result);
                     reader.readAsDataURL(file);
                     toast("Photo attached for verification!", "success");
                   }
                 }} />
               </label>
               {photoPreview && (
                 <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-rose-500 shadow-lg">
                   <img src={photoPreview} alt="Waste Preview" className="w-full h-full object-cover" />
                   <button type="button" onClick={() => setPhotoPreview(null)} className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-rose-500 hover:bg-white transition-colors">
                     <X size={12} />
                   </button>
                 </motion.div>
               )}
             </div>
          </div>
          <div className="flex items-center gap-2">
             <input type="checkbox" id="geoloc" checked={useLocation} onChange={e => {
                if (e.target.checked) {
                  setUseLocation(true);
                  if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(
                      pos => { setCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude }); toast("Location captured!", "info"); },
                      err => { toast("Please allow Location access to tag waste.", "warning"); setUseLocation(false); }
                    );
                  }
                } else { setUseLocation(false); setCoordinates(null); }
             }} className="w-4 h-4 text-rose-600 rounded bg-slate-100 border-slate-300 focus:ring-rose-500" />
             <label htmlFor="geoloc" className="text-sm font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
               Attach GPS Geotag 📍
             </label>
          </div>
          {coordinates && (
            <div className="w-full mt-2 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center justify-between mb-2">
                 <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest px-2 py-0.5 bg-rose-50 rounded-full border border-rose-100">GPS Attached 📍</p>
                 <button type="button" onClick={() => { setUseLocation(false); setCoordinates(null); }} className="text-[10px] font-bold text-rose-500 hover:underline">Remove</button>
              </div>
              <div className="h-[150px] w-full relative z-0 rounded-xl overflow-hidden border-2 border-rose-500/20 shadow-inner">
                <MapWrapper lat={coordinates.lat} lng={coordinates.lng} popupText={`${weight}kg Waste`} />
              </div>
            </div>
          )}
          <button type="submit" disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-rose-500/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2">
            {loading ? (
              <span className="flex items-center gap-2">Recording...</span>
            ) : (
              <>
                <Trash2 size={20} />
                Log Waste Measurement
              </>
            )}
          </button>
        </form>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg">Recent Waste Logs</h3>
          <button onClick={exportCSV}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
            📥 Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          {fetchingLogs ? (
            <div className="p-6 space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                  <th className="py-3 px-6 font-semibold">Type</th>
                  <th className="py-3 px-6 font-semibold">Weight (kg)</th>
                  <th className="py-3 px-6 font-semibold">Date</th>
                  <th className="py-3 px-6 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {paginated.length === 0 ? (
                  <tr><td colSpan="4" className="py-8 text-center text-slate-400">No logs yet. Add your first waste entry above!</td></tr>
                ) : paginated.map(log => (
                  <React.Fragment key={log._id}>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-slate-800 dark:text-slate-200 capitalize">{log.type}</td>
                      <td className="py-3.5 px-6 text-slate-600 dark:text-slate-300 font-semibold">{log.weight} kg</td>
                      <td className="py-3.5 px-6 text-slate-500 dark:text-slate-400">
                        {new Date(log.createdAt || log.date).toLocaleDateString("en-IN")}
                        {log.coordinates?.lat && (
                          <button onClick={() => setExpandedMap(expandedMap === log._id ? null : log._id)} title="Toggle Interactive Map" className="ml-2 inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded p-1 transition-colors">
                            🗺️
                          </button>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${log.type === "edible" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                          {log.type === "edible" ? "Donatable" : "Dispose"}
                        </span>
                      </td>
                    </tr>
                    {expandedMap === log._id && log.coordinates && (
                      <tr className="bg-slate-50 dark:bg-slate-700 border-t border-slate-100 dark:border-slate-600">
                        <td colSpan="4" className="p-4">
                          <div className="w-full h-[300px] z-0 rounded-xl overflow-hidden shadow-inner">
                            <MapWrapper lat={log.coordinates.lat} lng={log.coordinates.lng} popupText={`${log.weight}kg of ${log.type}`} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-700">
            <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">← Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}