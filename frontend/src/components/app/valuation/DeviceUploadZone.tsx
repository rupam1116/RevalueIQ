"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Camera,
  X,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Leaf,
  Smartphone,
  Laptop,
  Headphones,
  Image as ImageIcon,
  Tag,
} from "lucide-react";
import { UploadedImage } from "@/types/valuation";
import { DEMO_PRESETS, DemoPreset } from "@/lib/mockValuationData";
import { CameraModal } from "./CameraModal";

interface DeviceUploadZoneProps {
  images: UploadedImage[];
  onAddImage: (img: UploadedImage) => void;
  onRemoveImage: (id: string) => void;
  onSelectPreset: (preset: DemoPreset) => void;
  onUpdateImageAngle?: (id: string, angle: UploadedImage["angle"]) => void;
}

export const DeviceUploadZone: React.FC<DeviceUploadZoneProps> = ({
  images,
  onAddImage,
  onRemoveImage,
  onSelectPreset,
  onUpdateImageAngle,
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      const newImg: UploadedImage = {
        id: Math.random().toString(36).substring(2, 9),
        url,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        angle: "Front",
        file,
      };
      onAddImage(newImg);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleCapturePhoto = (capturedImage: UploadedImage | string) => {
    if (typeof capturedImage === "string") {
      const newImg: UploadedImage = {
        id: Math.random().toString(36).substring(2, 9),
        url: capturedImage,
        name: `camera_scan_${Date.now()}.jpg`,
        size: "1.2 MB",
        angle: "Front",
      };
      onAddImage(newImg);
    } else {
      onAddImage(capturedImage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Demo Presets Shortcut Ribbon */}
      <div className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Fast-Track Device Presets</span>
          </div>
          <span className="text-[10px] text-slate-500 font-semibold">1-Click Auto Fill</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEMO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/50 border border-emerald-100 dark:border-emerald-900/40 text-left transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Smartphone className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {preset.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate">{preset.details.condition} • {preset.brand}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Drag and Drop Upload Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-3xl border-2 border-dashed p-6 sm:p-10 text-center transition-all duration-300 ${
          isDragging
            ? "border-emerald-500 bg-emerald-100/30 dark:bg-emerald-950/40 scale-[1.01]"
            : "border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-[#0b1a13] hover:border-emerald-500 dark:hover:border-emerald-600"
        } shadow-sm space-y-5`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-md">
          <UploadCloud className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Upload Device Photos for AI Vision Scanning
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Drag & drop multi-angle images (Front, Back, Screen, Frame) or launch your webcam to inspect surface scratches, cracks, and model serials.
          </p>
        </div>

        {/* Upload Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center gap-2 border-0"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Select Local Files</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            className="px-6 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2"
          >
            <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Capture via Camera</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 text-[10px] font-semibold text-slate-400 pt-2">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Encrypted Scan</span>
          <span>•</span>
          <span>PNG, JPG, WEBP (Max 15MB each)</span>
        </div>
      </div>

      {/* Uploaded Images Thumbnails Grid */}
      {images.length > 0 && (
        <div className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Uploaded Photo Stack ({images.length})</span>
            </h4>
            <span className="text-[10px] text-slate-500 font-semibold">Select angle tags for precision AI grading</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative rounded-2xl overflow-hidden bg-emerald-50/50 dark:bg-[#06140e] border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-1 p-2 transition-all duration-300 animate-in fade-in"
              >
                <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-950">
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                  
                  {/* Delete Button Overlay */}
                  <button
                    type="button"
                    onClick={() => onRemoveImage(img.id)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-950/80 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Angle Tag Selector */}
                <div className="pt-1">
                  <select
                    value={img.angle}
                    onChange={(e) => onUpdateImageAngle?.(img.id, e.target.value as UploadedImage["angle"])}
                    className="w-full bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg px-2 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 focus:outline-none cursor-pointer"
                  >
                    <option value="Front">Front View</option>
                    <option value="Back">Back Cover</option>
                    <option value="Sides / Frame">Sides / Frame</option>
                    <option value="Screen / Display">Screen / Glass</option>
                    <option value="Ports / Serial">Ports & Serial</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Webcam Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCapturePhoto}
      />
    </div>
  );
};
