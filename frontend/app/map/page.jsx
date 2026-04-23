"use client";
import { useState, useEffect } from "react";
import API from "@/services/api";
import Sidebar from "@/components/Sidebar";
import MapWrapper from "@/components/Map/MapWrapper";
import Skeleton from "@/components/Skeleton";
import { useToast } from "@/components/ToastProvider";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Building2, Navigation, Crosshair } from "lucide-react";
import SatelliteScan from "@/components/Map/SatelliteScan";

// Kerala & Karnataka NGOs with real coordinates
const NGO_DATA = [
  // Kerala NGOs
  {
    name: "Akshaya Patra Foundation",
    city: "Thiruvananthapuram",
    state: "Kerala",
    lat: 8.5241,
    lng: 76.9366,
    phone: "+91-471-2345678",
    email: "info@akshayapatra.org",
    type: "Food Distribution",
  },
  {
    name: "Helping Hands Kerala",
    city: "Kochi",
    state: "Kerala",
    lat: 9.9312,
    lng: 76.2673,
    phone: "+91-484-2345678",
    email: "helpinghandskerala@gmail.com",
    type: "Food Rescue",
  },
  {
    name: "Food for Life Kozhikode",
    city: "Kozhikode",
    state: "Kerala",
    lat: 11.2588,
    lng: 75.7804,
    phone: "+91-495-2345678",
    email: "ffl.kozhikode@gmail.com",
    type: "Community Kitchen",
  },
  {
    name: "Snehapoorvam Trust",
    city: "Thrissur",
    state: "Kerala",
    lat: 10.5276,
    lng: 76.2144,
    phone: "+91-487-2345678",
    email: "snehapoorvam@gmail.com",
    type: "Food Bank",
  },
  {
    name: "Green Kerala NGO",
    city: "Kollam",
    state: "Kerala",
    lat: 8.8932,
    lng: 76.6141,
    phone: "+91-474-2345678",
    email: "greenkerala@ngo.org",
    type: "Waste Reduction",
  },
  {
    name: "Amma Canteen Support",
    city: "Palakkad",
    state: "Kerala",
    lat: 10.7867,
    lng: 76.6548,
    phone: "+91-491-2345678",
    email: "ammacanteen@gmail.com",
    type: "Food Distribution",
  },
  {
    name: "Nava Kerala Foundation",
    city: "Malappuram",
    state: "Kerala",
    lat: 11.051,
    lng: 76.0711,
    phone: "+91-483-2345678",
    email: "navakeralafoundation@gmail.com",
    type: "Community Support",
  },
  {
    name: "Lokodaya Charitable Trust",
    city: "Kannur",
    state: "Kerala",
    lat: 11.8745,
    lng: 75.3704,
    phone: "+91-497-2345678",
    email: "lokodaya@charitable.org",
    type: "Food Bank",
  },

  // Karnataka NGOs
  {
    name: "Akshaya Patra Bangalore",
    city: "Bengaluru",
    state: "Karnataka",
    lat: 12.9716,
    lng: 77.5946,
    phone: "+91-80-30143400",
    email: "bangalore@akshayapatra.org",
    type: "Food Distribution",
  },
  {
    name: "Robin Hood Army Bangalore",
    city: "Bengaluru",
    state: "Karnataka",
    lat: 12.9352,
    lng: 77.6245,
    phone: "+91-98860-00001",
    email: "bangalore@robinhoodarmy.com",
    type: "Food Rescue",
  },
  {
    name: "Goonj Karnataka",
    city: "Bengaluru",
    state: "Karnataka",
    lat: 12.98,
    lng: 77.588,
    phone: "+91-80-23638935",
    email: "karnataka@goonj.org",
    type: "Community Support",
  },
  {
    name: "Dharwad Food Bank",
    city: "Dharwad",
    state: "Karnataka",
    lat: 15.4589,
    lng: 75.0078,
    phone: "+91-836-2345678",
    email: "dharwadfoodbank@gmail.com",
    type: "Food Bank",
  },
  {
    name: "Mysuru Annadaana Trust",
    city: "Mysuru",
    state: "Karnataka",
    lat: 12.2958,
    lng: 76.6394,
    phone: "+91-821-2345678",
    email: "annadaana.mysuru@gmail.com",
    type: "Community Kitchen",
  },
  {
    name: "Hubli Hunger Free Initiative",
    city: "Hubballi",
    state: "Karnataka",
    lat: 15.3647,
    lng: 75.124,
    phone: "+91-836-2987654",
    email: "hungerfree.hubli@gmail.com",
    type: "Food Distribution",
  },
  {
    name: "Mangaluru Food Relief",
    city: "Mangaluru",
    state: "Karnataka",
    lat: 12.9141,
    lng: 74.856,
    phone: "+91-824-2345678",
    email: "foodrelief.mangaluru@gmail.com",
    type: "Food Rescue",
  },
  {
    name: "Belagavi Community Kitchen",
    city: "Belagavi",
    state: "Karnataka",
    lat: 15.8497,
    lng: 74.4977,
    phone: "+91-831-2345678",
    email: "ck.belagavi@ngo.org",
    type: "Community Kitchen",
  },
];

// Haversine formula to calculate distance between two coordinates in km
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

export default function GlobalMapPage() {
  const [markers, setMarkers] = useState([]);
  const [userPos, setUserPos] = useState(null);
  const [recenterTrigger, setRecenterTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  const [nearbyNGOs, setNearbyNGOs] = useState([]);
  const toast = useToast();

  useEffect(() => {
    let watchId = null;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserPos({ lat: latitude, lng: longitude });

          // Calculate distance for each NGO and filter within 60km
          const withDistance = NGO_DATA.map((ngo) => ({
            ...ngo,
            distance: parseFloat(getDistanceKm(latitude, longitude, ngo.lat, ngo.lng)),
          }))
            .filter((ngo) => ngo.distance <= 60)
            .sort((a, b) => a.distance - b.distance);

          setNearbyNGOs(withDistance);
        },
        () => {
          toast("Location access denied. Showing all NGOs.", "warning");
          // If no GPS, show all NGOs with no distance
          setNearbyNGOs(NGO_DATA.map((n) => ({ ...n, distance: null })));
        },
        { enableHighAccuracy: true }
      );
    }

    const fetchData = async () => {
      try {
        const [wasteRes, donationRes] = await Promise.all([
          API.get("/waste"),
          API.get("/donation"),
        ]);

        const wasteMarkers = (wasteRes.data || [])
          .filter((w) => w.coordinates?.lat && w.coordinates?.lng)
          .map((w) => ({
            lat: w.coordinates.lat,
            lng: w.coordinates.lng,
            type: "waste",
            popupText: `Waste: ${w.weight}kg ${w.type}`,
            details: `Logged on ${new Date(w.createdAt || w.date).toLocaleDateString()}`,
          }));

        const donationMarkers = (donationRes.data || [])
          .filter((d) => d.coordinates?.lat && d.coordinates?.lng)
          .map((d) => ({
            lat: d.coordinates.lat,
            lng: d.coordinates.lng,
            type: "donation",
            popupText: `Donation: ${d.foodAmount}kg`,
            details: `Status: ${d.status} (${d.location})`,
          }));

        // Add all NGOs as purple markers on the map
        const ngoMarkers = NGO_DATA.map((ngo) => ({
          lat: ngo.lat,
          lng: ngo.lng,
          type: "ngo",
          popupText: `🤝 ${ngo.name}`,
          details: `${ngo.type} | ${ngo.city} | ${ngo.phone}`,
        }));

        setMarkers([...wasteMarkers, ...donationMarkers, ...ngoMarkers]);
      } catch (err) {
        toast("Failed to load map data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [toast]);

  const allMarkers = userPos
    ? [
        {
          lat: userPos.lat,
          lng: userPos.lng,
          type: "user",
          popupText: "🏠 You Are Here",
          details: "Current Location",
        },
        ...markers,
      ]
    : markers;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 transition-colors">
      <Sidebar />
      <div className="flex-1 px-6 lg:px-10 py-4 lg:py-6 overflow-y-auto w-full transition-all duration-200 h-[calc(100vh-64px)]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto space-y-10"
        >
          {/* Header */}
          <motion.header
            variants={itemVariants}
            className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.3em] mb-2">
                Global Operations
              </p>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                Geospatial Intelligence
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold text-sm leading-relaxed max-w-xl">
                Real-time mapping of waste hotspots, live donations, and partner networks within
                60km.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              {[
                { color: "bg-blue-500", label: "My Uplink" },
                { color: "bg-rose-500 animate-pulse", label: "Waste Node" },
                { color: "bg-emerald-500", label: "Donation Node" },
                { color: "bg-purple-500", label: "NGO Outpost" },
              ].map((l) => (
                <div
                  key={l.label}
                  className="flex items-center gap-2 bg-white dark:bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 dark:border-white/5 shadow-sm"
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${l.color} shadow-lg`}></span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                    {l.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.header>

          {/* Map */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-slate-800/60 backdrop-blur-sm p-2 rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/5 overflow-hidden h-[500px] relative group hover:border-emerald-500/30 transition-all"
          >
            {loading ? (
              <div className="h-full w-full p-8">
                <Skeleton className="h-full w-full rounded-[1.5rem]" />
              </div>
            ) : (
              <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                {userPos ? (
                  <>
                    <MapWrapper
                      markers={allMarkers}
                      lat={userPos?.lat}
                      lng={userPos?.lng}
                      recenterTrigger={recenterTrigger}
                    />

                    {/* Recenter Button */}
                    <button
                      onClick={() => setRecenterTrigger((prev) => prev + 1)}
                      className="absolute bottom-6 right-6 z-[1000] p-4 bg-white dark:bg-slate-800 text-emerald-500 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all group"
                      title="Direct Recenter on my location"
                    >
                      <Crosshair
                        size={24}
                        className="group-hover:rotate-90 transition-transform duration-500"
                      />
                    </button>
                  </>
                ) : (
                  <SatelliteScan />
                )}
              </div>
            )}
          </motion.div>

          {/* Nearby NGOs Panel */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/5 overflow-hidden relative"
          >
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                  <span className="w-6 h-px bg-slate-200 dark:bg-slate-700"></span>
                  Local NGO Directives
                </h2>
                <p className="text-sm text-slate-500 font-bold mt-2">
                  {userPos
                    ? `${nearbyNGOs.length} verified operations detected within 60km perimeter`
                    : "System scanning globally (Enable GPS for proximity filter)"}
                </p>
              </div>
              {!userPos && (
                <div className="text-[10px] uppercase tracking-widest bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 px-4 py-2 rounded-xl font-black">
                  📍 Enable GPS for localized sync
                </div>
              )}
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {(nearbyNGOs.length > 0
                ? nearbyNGOs
                : NGO_DATA.map((n) => ({ ...n, distance: null }))
              ).map((ngo, i) => (
                <div
                  key={ngo.name}
                  className="p-5 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <Building2 size={22} className="text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800 dark:text-white text-sm">
                          {ngo.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <MapPin size={11} className="text-slate-400" />
                          <span className="text-xs text-slate-500 font-medium">
                            {ngo.city}, {ngo.state}
                          </span>
                          <span className="text-[10px] mx-1 text-slate-400">•</span>
                          <span
                            className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider
                            bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400"
                          >
                            {ngo.type}
                          </span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              ngo.state === "Karnataka"
                                ? "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400"
                                : "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400"
                            }`}
                          >
                            {ngo.state}
                          </span>
                        </div>
                        <div className="flex gap-4 mt-3">
                          <a
                            href={`tel:${ngo.phone}`}
                            className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            <Phone size={12} /> {ngo.phone}
                          </a>
                          <a
                            href={`mailto:${ngo.email}`}
                            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <Mail size={12} /> {ngo.email}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      {ngo.distance !== null ? (
                        <>
                          <div
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-sm ${ngo.distance <= 20 ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : ngo.distance <= 40 ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}
                          >
                            <Navigation size={14} />
                            {ngo.distance} km
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {ngo.distance <= 20
                              ? "Very Close"
                              : ngo.distance <= 40
                                ? "Nearby"
                                : "Reachable"}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">
                          Location unavailable
                        </span>
                      )}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${ngo.lat},${ngo.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[10px] font-black text-purple-600 dark:text-purple-400 hover:underline uppercase tracking-widest"
                      >
                        <MapPin size={10} /> View on Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              ))}
              {userPos && nearbyNGOs.length === 0 && (
                <div className="p-12 text-center text-slate-400 font-medium">
                  <Building2 size={32} className="mx-auto mb-3 opacity-30" />
                  <p>No NGOs found within 60km of your current location.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Legend Info */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-rose-500/5 dark:bg-rose-500/10 p-8 rounded-[2rem] border border-rose-500/20 dark:border-rose-500/30 group hover:border-rose-500/50 hover:bg-rose-500/10 transition-all shadow-xl">
              <h4 className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> Waste
                Hotspots
              </h4>
              <p className="text-rose-900/70 dark:text-rose-200/70 text-sm font-bold leading-relaxed">
                Visualize where most food waste is occurring to optimize internal dining supply
                chains.
              </p>
            </div>
            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-8 rounded-[2rem] border border-emerald-500/20 dark:border-emerald-500/30 group hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all shadow-xl">
              <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Donation
                Points
              </h4>
              <p className="text-emerald-900/70 dark:text-emerald-200/70 text-sm font-bold leading-relaxed">
                Real-time pickup coordination vectors for verified NGOs and local charitable trusts.
              </p>
            </div>
            <div className="bg-purple-500/5 dark:bg-purple-500/10 p-8 rounded-[2rem] border border-purple-500/20 dark:border-purple-500/30 group hover:border-purple-500/50 hover:bg-purple-500/10 transition-all shadow-xl">
              <h4 className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span> Partner NGOs
              </h4>
              <p className="text-purple-900/70 dark:text-purple-200/70 text-sm font-bold leading-relaxed">
                Mapped outposts of certified partner organizations ready to distribute surplus
                safely.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
