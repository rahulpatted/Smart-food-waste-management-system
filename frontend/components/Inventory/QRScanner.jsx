"use client";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, CheckCircle2, AlertCircle, RefreshCcw } from "lucide-react";

export default function QRScanner({ onScan, onClose }) {
  const [scannedResult, setScannedResult] = useState(null);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);

  const startScanner = async () => {
    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;
    setError(null);

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (result) => {
          setScannedResult(result);
          html5QrCode
            .stop()
            .then(() => {
              setTimeout(() => {
                onScan(result);
                onClose();
              }, 1000);
            })
            .catch((err) => console.error("Failed to stop", err));
        },
        (errorMessage) => {
          // Scanning...
        }
      );
    } catch (err) {
      console.error("Camera start failed", err);
      setError("Camera access denied or could not find a suitable device.");
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((err) => console.error("Cleanup failed", err));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-white/10"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Camera size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white">Inventory Scanner</h3>
              <p className="text-xs text-slate-500 font-medium">Scan QR code for stock entry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8">
          <div
            id="reader"
            className="overflow-hidden rounded-2xl border-4 border-emerald-500/20 shadow-inner bg-slate-900 aspect-square relative flex items-center justify-center"
          >
            {error && (
              <div className="p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
                <div className="w-12 h-12 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle size={24} />
                </div>
                <p className="text-sm font-bold text-slate-300">{error}</p>
                <button
                  onClick={startScanner}
                  className="flex items-center gap-2 mx-auto px-4 py-2 bg-white text-slate-900 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-colors"
                >
                  <RefreshCcw size={14} /> Retry Camera
                </button>
              </div>
            )}
            <div className="absolute bottom-4 inset-x-0 flex justify-center">
              <label className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl cursor-pointer text-[10px] font-black uppercase tracking-widest text-white transition-all border border-white/10">
                Scan from File 📁
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file && scannerRef.current) {
                      try {
                        const result = await scannerRef.current.scanFile(file, true);
                        setScannedResult(result);
                        setTimeout(() => {
                          onScan(result);
                          onClose();
                        }, 1500);
                      } catch (err) {
                        setError("Could not find a valid QR code in that image.");
                      }
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <AnimatePresence>
            {scannedResult && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                    Successfully Scanned
                  </p>
                  <p className="font-bold text-slate-800 dark:text-white truncate max-w-[200px]">
                    {scannedResult}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-8 pb-8 text-center text-xs text-slate-400 font-medium italic">
          {error
            ? "Please ensure camera permissions are granted."
            : "Point your camera at a stock label QR code"}
        </div>
      </motion.div>
    </div>
  );
}
