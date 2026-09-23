"use client";

import React, { useState } from "react";
import { Upload, Camera, Trash2, Tag, Image as ImageIcon, Sparkles, Plus, AlertCircle, Edit3 } from "lucide-react";
import { UploadedRepairImage } from "@/types/repair";
import { CameraModal } from "./CameraModal";

interface RepairImageUploadZoneProps {
  images: UploadedRepairImage[];
  onAddImage: (img: UploadedRepairImage) => void;
  onRemoveImage: (id: string) => void;
  onUpdateTag: (id: string, damageTag: string, customDamageTag?: string) => void;
}

const DAMAGE_TAGS: string[] = [
  "Cracked Screen",
  "Battery Swell",
  "Port Corrosion",
  "Liquid Damage",
  "Housing Scratch",
  "Camera Glass / Lens Damage",
  "Hinge / Frame Bend",
  "General Damage",
  "Other Damage (Enter Custom)",
];

const SAMPLE_DAMAGE_PHOTOS = [
  {
    url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80",
    name: "shattered_display_front.jpg",
    tag: "Cracked Screen" as const,
  },
  {
    url: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80",
    name: "battery_bulge_side.jpg",
    tag: "Battery Swell" as const,
  },
  {
    url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    name: "logic_board_watermark.jpg",
    tag: "Liquid Damage" as const,
  },
];

export const RepairImageUploadZone: React.FC<RepairImageUploadZoneProps> = ({
  images,
  onAddImage,
  onRemoveImage,
  onUpdateTag,
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const newImg: UploadedRepairImage = {
          id: `upload-${Date.now()}-${index}`,
          url,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          damageTag: "General Damage",
          tag: "General Damage",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        onAddImage(newImg);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleLoadSample = (sample: typeof SAMPLE_DAMAGE_PHOTOS[0]) => {
    const newImg: UploadedRepairImage = {
      id: `sample-${Date.now()}-${Math.random()}`,
      url: sample.url,
      name: sample.name,
      size: "3.2 MB",
      damageTag: sample.tag,
      tag: sample.tag,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    onAddImage(newImg);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-8 space-y-6 shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-4">
        <div>
          <span className="inline-flex items-center text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Step 3 of 3
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            Hardware Damage Inspection Upload
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Attach high-res photos of cracks, ports, or swelling for neural visual analysis.
          </p>
        </div>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) {
            handleFileUpload({ target: { files: e.dataTransfer.files } } as any);
          }
        }}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 ${
          isDragging
            ? "border-emerald-500 bg-emerald-100/40 dark:bg-emerald-950/60 scale-[1.01]"
            : "border-emerald-200 dark:border-emerald-800 bg-emerald-50/20 dark:bg-[#06100c] hover:border-emerald-400"
        }`}
      >
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800 shadow-inner">
            <Upload className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Drag & Drop Inspection Media
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              PNG, JPG, WEBP, HEIC up to 15MB each
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Browse Local Files</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/60 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Take Live Photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Demo Preset Damage Samples */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Or Test With Real Incident Damage Samples:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_DAMAGE_PHOTOS.map((sample) => (
            <button
              key={sample.name}
              type="button"
              onClick={() => handleLoadSample(sample)}
              className="p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40 text-left transition-all flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-emerald-200 dark:border-emerald-800">
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                  {sample.tag}
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                  {sample.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Uploaded Images List Cards */}
      {images.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-emerald-100 dark:border-emerald-900/40">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Attached Inspection Media ({images.length})</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Ready for Vision Scan</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img) => {
              const currentTag = img.damageTag || img.tag || "General Damage";
              const isOther = currentTag === "Other Damage (Enter Custom)";

              return (
                <div
                  key={img.id}
                  className="p-3 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 space-y-3 relative group"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-emerald-100 dark:border-emerald-900/50">
                    <img src={img.url} alt={img.name || "Damage photo"} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => onRemoveImage(img.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/80 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                        {img.name || "inspection_photo.jpg"}
                      </span>
                      <span className="text-[10px] text-slate-500">{img.size || "1.2 MB"}</span>
                    </div>

                    {/* Damage Tag Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-600 dark:text-slate-400 flex items-center gap-1 font-bold">
                        <Tag className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Inspection Category Tag:
                      </label>
                      <select
                        value={currentTag}
                        onChange={(e) => {
                          const newTag = e.target.value;
                          onUpdateTag(
                            img.id,
                            newTag,
                            newTag === "Other Damage (Enter Custom)" ? (img.customDamageTag || "") : undefined
                          );
                        }}
                        className="w-full text-xs bg-white dark:bg-[#0b1a13] border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer"
                      >
                        {DAMAGE_TAGS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>

                      {/* Custom Damage Description Input when 'Other' is selected */}
                      {isOther && (
                        <div className="pt-1 space-y-1 animate-in fade-in duration-200">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                            <Edit3 className="w-3 h-3" />
                            <span>Describe specific damage:</span>
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. Broken hinge, back glass shattered, water stains..."
                            value={img.customDamageTag || ""}
                            onChange={(e) => {
                              onUpdateTag(img.id, "Other Damage (Enter Custom)", e.target.value);
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#07130e] border border-emerald-300 dark:border-emerald-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            autoFocus
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(capturedImg) => {
          onAddImage(capturedImg);
        }}
      />
    </div>
  );
};
