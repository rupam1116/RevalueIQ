"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, X, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { UploadedRepairImage } from "@/types/repair";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (image: UploadedRepairImage) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    setError(null);
    setCapturedUrl(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn("Camera access failed or non-HTTPS environment:", err);
      setError("Unable to access live webcam. Using simulated high-resolution hardware snap.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleTakeSnap = () => {
    if (videoRef.current && stream) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 1280;
      canvas.height = videoRef.current.videoHeight || 720;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setCapturedUrl(dataUrl);
      }
    } else {
      // Fallback simulated photo
      const samplePhotos = [
        "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
      ];
      const randomPhoto = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
      setCapturedUrl(randomPhoto);
    }
  };

  const handleConfirmPhoto = () => {
    if (!capturedUrl) return;
    const newImage: UploadedRepairImage = {
      id: `cam-img-${Date.now()}`,
      url: capturedUrl,
      name: `camera_snap_${Date.now()}.jpg`,
      size: "2.8 MB",
      damageTag: "Cracked Screen",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    onCapture(newImage);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Live Hardware Diagnostics Camera</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-emerald-950/60 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden border border-emerald-900/40 flex items-center justify-center">
          {capturedUrl ? (
            <img src={capturedUrl} alt="Captured Hardware" className="w-full h-full object-cover" />
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          )}

          {/* Scanner Overlay HUD */}
          <div className="absolute inset-0 border-2 border-emerald-500/30 pointer-events-none rounded-2xl flex items-center justify-center">
            <div className="w-48 h-48 border border-dashed border-emerald-400/80 rounded-xl flex items-center justify-center">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-slate-950/80 px-2 py-0.5 rounded">
                Align Hardware Damage
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {capturedUrl ? (
            <>
              <button
                type="button"
                onClick={() => setCapturedUrl(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-emerald-950/60 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-2 cursor-pointer hover:bg-slate-200"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retake Photo
              </button>
              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg hover:scale-[1.02] cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Use Captured Image
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-emerald-950/60 text-slate-600 dark:text-slate-400 font-bold text-xs cursor-pointer hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTakeSnap}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 hover:scale-[1.02] cursor-pointer"
              >
                <Camera className="w-4 h-4" /> Capture Diagnostic Photo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
