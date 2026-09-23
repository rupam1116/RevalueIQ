"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, X, RefreshCw, CheckCircle2, AlertCircle, Leaf } from "lucide-react";
import { UploadedImage } from "@/types/valuation";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (capturedImage: UploadedImage) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const [selectedAngle, setSelectedAngle] = useState<UploadedImage["angle"]>("Front");
  const [isCapturing, setIsCapturing] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    if (isOpen) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          activeStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setStreamActive(true);
          }
        })
        .catch((err) => {
          console.warn("Real camera access not available, using high-tech camera simulator mode", err);
          setCameraError("Real camera permission denied or unavailable. Running in High-Resolution Simulation Mode.");
        });
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCaptureSnapshot = () => {
    setIsCapturing(true);

    setTimeout(() => {
      const sampleImages: Record<UploadedImage["angle"], string> = {
        Front: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
        Back: "https://images.unsplash.com/photo-1695048133021-dbe293f0b2f0?q=80&w=800&auto=format&fit=crop",
        "Sides / Frame": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop",
        "Screen / Display": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop",
        "Ports / Serial": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop",
      };

      const newCaptured: UploadedImage = {
        id: `img-${Date.now()}`,
        url: sampleImages[selectedAngle],
        name: `Camera_Capture_${selectedAngle}_${Date.now()}.jpg`,
        size: "2.4 MB",
        angle: selectedAngle,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setIsCapturing(false);
      onCapture(newCaptured);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-6 shadow-2xl space-y-5 overflow-hidden transition-all duration-300 animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Vision WebCam Scanner</h3>
              <p className="text-[11px] text-slate-500">Live multi-angle photo capture for condition analysis</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Feed Viewport */}
        <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-950 border border-emerald-900/40 flex items-center justify-center">
          <video
            ref={videoRef}
            aria-label="Webcam feed"
            className={`w-full h-full object-cover ${streamActive ? "block" : "hidden"}`}
            muted
            playsInline
          />

          {!streamActive && (
            <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-4">
              <img
                src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop"
                alt="Camera Feed"
                className="w-full h-full object-cover opacity-50 absolute inset-0"
              />
              <div className="relative z-10 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 animate-pulse">
                  <Camera className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-white">AI Vision Scanner Active</p>
                {cameraError && (
                  <p className="text-[10px] text-amber-400 bg-slate-950/80 px-3 py-1 rounded-full border border-amber-500/30">
                    {cameraError}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Scanner Overlay HUD */}
          <div className="absolute inset-0 border-2 border-emerald-400/40 m-4 rounded-xl pointer-events-none flex items-center justify-center">
            <div className="w-24 h-24 border border-dashed border-emerald-400 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Angle selector & Snapshot trigger */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Select Angle Tag:</label>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
              Angle: {selectedAngle}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {(["Front", "Back", "Sides / Frame", "Screen / Display", "Ports / Serial"] as const).map(
              (angle) => (
                <button
                  key={angle}
                  type="button"
                  onClick={() => setSelectedAngle(angle)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedAngle === angle
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100"
                  }`}
                >
                  {angle}
                </button>
              )
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-emerald-100 dark:border-emerald-900/40">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-emerald-100 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleCaptureSnapshot}
              disabled={isCapturing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-2 border-0 disabled:opacity-50"
            >
              {isCapturing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Capture Snapshot</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
