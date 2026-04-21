"use client";
import { useState, useEffect } from "react";
import API from "@/services/api";
import Sidebar from "@/components/Sidebar";
import { useToast } from "@/components/ToastProvider";
import Skeleton from "@/components/Skeleton";
import MapWrapper from "@/components/Map/MapWrapper";
import { useAuth } from "@/components/AuthProvider";
import { Handshake, PackageOpen, Truck, CheckCircle2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EnergyBeam from "@/components/Donations/EnergyBeam";

export default function Donations() {
  const { user } = useAuth() || {};
  const role = user?.role || 'student';
  const userName = user?.name || user?.email || "Unknown Entity";

  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("Main Campus");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [useLocation, setUseLocation] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [expandedMap, setExpandedMap] = useState(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(null);
  const [deliveryPhoto, setDeliveryPhoto] = useState(null);
  const [deliveryCoords, setDeliveryCoords] = useState(null);
  const [isCapturingCoords, setIsCapturingCoords] = useState(false);
  const toast = useToast();

  const fetchDonations = () => {
    API.get("/donation")
      .then(res => setDonations(res.data || []))
      .catch(() => toast("Failed to load donation board", "error"))
      .finally(() => setFetching(false));
  };

  useEffect(() => { fetchDonations(); }, []);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount) return;
    setLoading(true);
    try {
      await API.post("/donation/create", { 
        foodAmount: amount, 
        location, 
        destination,
        coordinates,
        donorId: user?.id 
      });
      toast("Donation successfully recorded!", "success");
      setAmount("");
      setDestination("");
      fetchDonations();
    } catch (err) {
      toast("Failed to process donation.", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, ngoName = null) => {
    try {
      await API.put(`/donation/${id}`, { status, ngoName });
      toast(`Donation status updated to ${status}`, "success");
      fetchDonations();
    } catch (err) {
      toast("Failed to update status", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`donation/${id}`);
      toast("Archived from board — data safely stored in database ✅", "success");
      setDonations(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      toast("Failed to archive record", "error");
    }
  };

  const columns = ["Pending", "Assigned", "Claimed & Collected", "Delivered"];

  const glowVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 transition-colors relative overflow-hidden mesh-gradient">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          variants={glowVariants}
          animate="animate"
          className="absolute top-[-10%] right-[-5%] w-[35rem] h-[35rem] bg-emerald-400/15 dark:bg-emerald-500/10 rounded-full mix-blend-soft-light dark:mix-blend-multiply filter blur-[80px]"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-teal-400/15 dark:bg-teal-500/10 rounded-full mix-blend-soft-light dark:mix-blend-multiply filter blur-[100px]"
        />
        <EnergyBeam color="stroke-cyan-500" delay={0} />
        <EnergyBeam color="stroke-indigo-500" delay={2} />
      </div>

      <Sidebar />
      <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)] px-6 lg:px-10 py-4 lg:py-6 relative z-10 transition-all duration-200">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delayChildren: 0.2, staggerChildren: 0.1 }}
          className="max-w-7xl mx-auto space-y-10"
        >
          <motion.header 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
             <div>
                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.3em] mb-2">Logistics Control</p>
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Food Donation Network</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold text-sm leading-relaxed max-w-xl">Distribute safe excess food to partnered NGOs and track the high-clearance delivery lifecycle.</p>
             </div>
             <div className="hidden md:block text-right">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Network Status</p>
                <div className="flex items-center justify-end gap-2 mt-1">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Online</p>
                </div>
             </div>
          </motion.header>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            {/* Form - Only for Donors and Staff */}
            {['donor', 'staff', 'admin'].includes(role) ? (
              <div className="lg:col-span-1 bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-xl flex flex-col">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
                  <h2 className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.3em] mb-2 relative z-10">CONTRIBUTE</h2>
                  <h3 className="text-3xl font-black tracking-tighter relative z-10">Donate Surplus</h3>
                </div>
                <form onSubmit={handleDonate} className="p-5 space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Food Quantity (kg)</label>
                    <input type="number" required min="1" value={amount}
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors bg-slate-50 dark:bg-slate-900/50 font-bold text-slate-900 dark:text-white placeholder-slate-400 text-sm"
                      placeholder="e.g. 15" onChange={e => setAmount(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Pickup Location</label>
                    <select value={location} onChange={e => setLocation(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors bg-slate-50 dark:bg-slate-900/50 font-bold text-slate-900 dark:text-white text-sm">
                      <option value="Main Campus">Main Campus Cafeteria</option>
                      <option value="North Wing">North Wing Dining</option>
                      <option value="East Hostel">East Hostel Mess</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Target Destination</label>
                    <input type="text" value={destination}
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors bg-slate-50 dark:bg-slate-900/50 font-bold text-slate-900 dark:text-white placeholder-slate-400 text-sm"
                      placeholder="e.g. Sunrise Orphanage" onChange={e => setDestination(e.target.value)} />
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
                     }} className="w-4 h-4 text-emerald-600 rounded bg-slate-100 border-slate-300 focus:ring-emerald-500" />
                     <label htmlFor="geoloc" className="text-sm font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                       Attach GPS Geotag 📍
                     </label>
                  </div>
                  {coordinates && (
                    <div className="w-full mt-2 animate-in fade-in zoom-in-95 duration-500">
                      <div className="flex items-center justify-between mb-2">
                         <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">GPS Attached 📍</p>
                         <button type="button" onClick={() => { setUseLocation(false); setCoordinates(null); }} className="text-[10px] font-bold text-rose-500 hover:underline">Remove</button>
                      </div>
                      <div className="h-[150px] w-full relative z-0 rounded-xl overflow-hidden border-2 border-emerald-500/20 shadow-inner">
                        <MapWrapper lat={coordinates.lat} lng={coordinates.lng} popupText="Donation Pickup" />
                      </div>
                    </div>
                  )}
                  <button type="submit" disabled={loading}
                    className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2">
                    {loading ? "Processing..." : "Submit Donation"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="lg:col-span-1 bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/60 flex flex-col items-center justify-center space-y-3 text-center">
                 <div className="text-4xl">🌟</div>
                 <h2 className="text-lg font-bold text-white">Redistribution Mode</h2>
                 <p className="text-sm text-slate-400 leading-relaxed">As an {role.toUpperCase()}, claim pending donations and deliver them to the Staff-managed Canteen Hub for students.</p>
                 <div className="w-full p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <p className="text-xs font-bold text-emerald-400">Pooled Surplus: {donations.reduce((sum, d) => sum + (d.status === 'Pending' ? d.foodAmount : 0), 0)} kg</p>
                 </div>
              </div>
            )}

            <motion.div className="lg:col-span-3 pb-8">
               <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-slate-200 dark:bg-slate-700"></span> LIVE DISTRIBUTION BOARD
               </h2>
              
              {fetching ? (
                <div className="flex gap-3">
                  {[1,2,3,4].map(i => <div key={i} className="flex-1"><Skeleton className="h-[200px] w-full rounded-[2rem]" /></div>)}
                </div>
              ) : (
                <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x snap-mandatory">
                  {columns.map(col => {
                    const items = donations.filter(d => d.status === col);
                    return (
                      <div key={col} className="min-w-[300px] flex-1 flex flex-col snap-start">
                        <div className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-t-[2rem] px-6 py-5 font-black text-slate-500 dark:text-slate-400 text-[10px] flex justify-between items-center uppercase tracking-widest border border-b-0 border-slate-200 dark:border-white/5">
                          {col} <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-slate-900 dark:text-white shadow-sm">{items.length}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-white/5 flex-1 p-3 rounded-b-[2rem] space-y-3 shadow-inner">
                          {items.length === 0 && (
                            <div className="text-center py-8 text-slate-400 text-[10px] font-black uppercase tracking-widest">— Empty —</div>
                          )}
                          {items.map(req => (
                            <div key={req._id} className="bg-white dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-white/5 p-5 rounded-[1.5rem] hover:border-emerald-500/30 transition-all shadow-sm hover:shadow-xl group">
                              <div className="flex justify-between items-start mb-3">
                                <span className="font-black text-emerald-500 text-lg tracking-tighter">{req.foodAmount} <span className="text-xs">kg</span></span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(req.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex flex-col gap-2 mb-4">
                                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                                  <span>📍 From: <span className="text-slate-700 dark:text-slate-300">{req.location}</span></span>
                                  {req.coordinates?.lat && (
                                    <button onClick={() => setExpandedMap(expandedMap === req._id ? null : req._id)} title="View Map" className="w-6 h-6 flex items-center justify-center bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-500/20 hover:scale-110 transition-all text-xs">🗺️</button>
                                  )}
                                </p>
                                {req.destination && (
                                  <p className="text-[11px] font-bold text-indigo-500/80 flex items-center">
                                    🎯 To: <span className="ml-1 text-indigo-600 dark:text-indigo-400">{req.destination}</span>
                                  </p>
                                )}
                              </div>

                              {expandedMap === req._id && req.coordinates && (
                                <div className="w-full h-[150px] mb-4 z-0 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-inner">
                                  <MapWrapper lat={req.coordinates.lat} lng={req.coordinates.lng} popupText={`${req.foodAmount}kg - ${req.location}`} />
                                </div>
                              )}

                              {col === "Pending" && (
                                role === "ngo" ? (
                                  <button onClick={() => updateStatus(req._id, "Assigned", userName)} className="w-full text-[11px] font-bold py-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                                    <PackageOpen size={12} /> Claim & Assign to Me
                                  </button>
                                ) : (
                                  <p className="text-[10px] text-center font-bold text-slate-500 bg-slate-500/5 py-1.5 rounded-lg border border-slate-500/10 italic">Awaiting NGO response...</p>
                                )
                              )}

                              {col === "Assigned" && (
                                (req.donorId === user?.id || role === "admin") ? (
                                  <button onClick={() => updateStatus(req._id, "Claimed & Collected")} className="w-full text-[11px] font-bold py-1.5 bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                                    <Truck size={12} /> Confirm NGO Pickup
                                  </button>
                                ) : (
                                  <div className="space-y-1.5">
                                    <p className="text-[10px] text-center font-bold text-amber-400 bg-amber-500/10 py-1.5 rounded-lg border border-amber-500/20 italic">NGO is claiming this...</p>
                                    <p className="text-[9px] text-center text-slate-500 font-medium">Awaiting Donor verification at kitchen.</p>
                                  </div>
                                )
                              )}

                              {col === "Claimed & Collected" && (
                                (req.ngoName === userName || req.donorId === user?.id || role === "admin") ? (
                                  <button onClick={() => setShowDeliveryModal(req)} className="w-full text-[11px] font-bold py-1.5 bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/25 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/10">
                                    <CheckCircle2 size={12} /> Complete Delivery
                                  </button>
                                ) : (
                                  <div className="space-y-1.5">
                                    <p className="text-[10px] text-center font-bold text-indigo-400 bg-indigo-500/10 py-1.5 rounded-lg border border-indigo-500/20 italic">Verified Collection ✓</p>
                                    <p className="text-[9px] text-center text-slate-500 font-medium">NGO is currently distributing food.</p>
                                  </div>
                                )
                              )}

                              {col === "Delivered" && (
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="flex-1 text-center text-[10px] font-bold py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg flex items-center justify-center gap-1.5">
                                    <CheckCircle2 size={12} /> {req.ngoName}
                                  </span>
                                  <button
                                    onClick={() => handleDelete(req._id)}
                                    title="Archive — removes from board, keeps data in database"
                                    className="p-1.5 rounded-lg bg-slate-600/50 text-slate-400 border border-slate-600/50 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 transition-colors shrink-0"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              )}
                              {col === "Assigned" && role === "student" && (
                                <p className="mt-1.5 text-[10px] italic text-slate-500 text-center">Routing to distribution center.</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Verified Delivery Modal Overlay */}
        {showDeliveryModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📦</div>
                <h3 className="text-xl font-black uppercase tracking-tight">Verify Delivery</h3>
                <p className="text-indigo-100/70 text-xs font-bold uppercase tracking-widest mt-1">Proof of Final Distribution</p>
              </div>

              <div className="p-6 space-y-5">
                <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Arrival Destination</label>
                   <input 
                      type="text" 
                      defaultValue={showDeliveryModal.destination || ""} 
                      id="finalDest"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Enter final drop-off location"
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Photo Proof (Optional)</label>
                    <div className="relative group cursor-pointer h-24 bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center hover:border-indigo-500/50 transition-all">
                       {deliveryPhoto ? (
                          <img src={deliveryPhoto} className="w-full h-full object-cover rounded-2xl" />
                       ) : (
                          <>
                            <span className="text-xl">📸</span>
                            <span className="text-[8px] font-bold text-slate-500 uppercase mt-1">Capture</span>
                          </>
                       )}
                       <input type="file" accept="image/*" onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                             const reader = new FileReader();
                             reader.onloadend = () => setDeliveryPhoto(reader.result);
                             reader.readAsDataURL(file);
                          }
                       }} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">GPS Geotag</label>
                    <button 
                      onClick={() => {
                        setIsCapturingCoords(true);
                        navigator.geolocation.getCurrentPosition(
                           (pos) => {
                              setDeliveryCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                              setIsCapturingCoords(false);
                              toast("Drop-off coordinates captured!", "success");
                           },
                           () => {
                              toast("GPS Access Denied", "error");
                              setIsCapturingCoords(false);
                           }
                        )
                      }}
                      className={`w-full h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${deliveryCoords ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-900/50 border-slate-700 hover:border-indigo-500/50'}`}
                    >
                       <span className="text-xl">{isCapturingCoords ? '⏳' : (deliveryCoords ? '📍' : '🌎')}</span>
                       <span className="text-[8px] font-bold text-slate-500 uppercase mt-1">
                          {isCapturingCoords ? 'Syncing...' : (deliveryCoords ? 'Locked' : 'Tag GPS')}
                       </span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                   <button onClick={() => { setShowDeliveryModal(null); setDeliveryPhoto(null); setDeliveryCoords(null); }} className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Cancel</button>
                   <button 
                      onClick={async () => {
                         const destInput = document.getElementById("finalDest").value;
                         try {
                            await API.put(`/donation/${showDeliveryModal._id}`, {
                               status: "Delivered",
                               destination: destInput,
                               deliveryProof: deliveryPhoto,
                               deliveryCoordinates: deliveryCoords
                            });
                            toast("Impact Verified! Food successfully delivered. 🏆", "success");
                            setShowDeliveryModal(null);
                            setDeliveryPhoto(null);
                            setDeliveryCoords(null);
                            fetchDonations();
                         } catch (err) { toast("Verification failed", "error"); }
                      }}
                      className="flex-[2] py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                   >
                      Confirm Distribution
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
