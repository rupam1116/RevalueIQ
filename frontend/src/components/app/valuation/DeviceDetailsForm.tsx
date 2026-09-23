"use client";

import React from "react";
import {
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  Gamepad2,
  Sliders,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { DeviceDetails, DeviceCategory, CosmeticCondition, FunctionalStatus } from "@/types/valuation";

interface DeviceDetailsFormProps {
  details: DeviceDetails;
  onChange: (updated: DeviceDetails) => void;
  onFieldUserEdit?: (field: keyof DeviceDetails) => void;
  detectionStatus?: "idle" | "analyzing" | "completed" | "partial" | "failed";
  detectionMessage?: string | null;
}

export const DeviceDetailsForm: React.FC<DeviceDetailsFormProps> = ({
  details,
  onChange,
  onFieldUserEdit,
  detectionStatus = "idle",
  detectionMessage,
}) => {
  const categories: { label: DeviceCategory; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: "Smartphone", icon: Smartphone },
    { label: "Laptop", icon: Laptop },
    { label: "Tablet", icon: Tablet },
    { label: "Smartwatch", icon: Watch },
    { label: "Audio", icon: Headphones },
    { label: "Gaming Console", icon: Gamepad2 },
    { label: "Other", icon: HelpCircle },
  ];

  const cosmeticOptions: CosmeticCondition[] = [
    "Pristine (Like New)",
    "Minor Scratches",
    "Visible Dents / Wear",
    "Cracked Screen / Glass",
    "Heavy Damage",
  ];

  const functionalOptions: FunctionalStatus[] = [
    "Not Detected / Unknown",
    "Fully Functional",
    "Battery Degraded",
    "Camera / Sensor Issue",
    "Port / Charging Issue",
    "Display Fault",
    "Non-Functional / Dead",
  ];

  const handleChangeField = <K extends keyof DeviceDetails>(field: K, value: DeviceDetails[K]) => {
    onFieldUserEdit?.(field);
    const updatedAiFields = { ...(details.aiDetectedFields || {}) };
    delete updatedAiFields[field as string];

    onChange({
      ...details,
      [field]: value,
      aiDetectedFields: updatedAiFields,
    });
  };

  const AIDetectedBadge = () => (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 shadow-xs animate-in fade-in">
      <Sparkles className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" /> AI Detected
    </span>
  );

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-8 space-y-6 shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Professional Hardware Specification Form
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review and edit any AI auto-filled field before confirming your appraisal.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
          Step 2 of 2
        </span>
      </div>

      {/* AI Detection Status Banner */}
      {detectionStatus === "completed" && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-3 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">
            {detectionMessage || "Device identified — please review the information below."}
          </p>
        </div>
      )}

      {detectionStatus === "partial" && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 flex items-center gap-3 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">
            {detectionMessage || "Some details could not be identified. Please review and complete them manually."}
          </p>
        </div>
      )}

      {detectionStatus === "failed" && (
        <div className="p-4 rounded-2xl bg-slate-500/10 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-slate-500 flex-shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">
            {detectionMessage || "We couldn't identify this device from the image. Please enter the details manually."}
          </p>
        </div>
      )}


      {/* Category Pills */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Device Category
          </label>
          {details.aiDetectedFields?.category && <AIDetectedBadge />}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = details.category === cat.label;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => handleChangeField("category", cat.label)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 ${
                  isSelected
                    ? "bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-slate-900 dark:text-white font-bold shadow-md"
                    : "bg-slate-50 dark:bg-emerald-950/40 border-slate-200 dark:border-emerald-800/80 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/50"
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}`} />
                <span className="text-xs font-semibold">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Brand */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Brand / Manufacturer</label>
            {details.aiDetectedFields?.brand && <AIDetectedBadge />}
          </div>
          <input
            type="text"
            value={details.brand}
            onChange={(e) => handleChangeField("brand", e.target.value)}
            placeholder="e.g. Apple, Dell, Sony, Samsung, Nintendo"
            className="w-full bg-slate-50 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Model */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Model Name / Number</label>
            {details.aiDetectedFields?.model && <AIDetectedBadge />}
          </div>
          <input
            type="text"
            value={details.model}
            onChange={(e) => handleChangeField("model", e.target.value)}
            placeholder="e.g. XPS 15, Galaxy S24, WH-1000XM5"
            className="w-full bg-slate-50 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Purchase Year */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Purchase Year</label>
            {details.aiDetectedFields?.purchaseYear && <AIDetectedBadge />}
          </div>
          <select
            value={details.purchaseYear}
            onChange={(e) => handleChangeField("purchaseYear", e.target.value)}
            className="w-full bg-slate-50 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {["Not detected", "2026", "2025", "2024", "2023", "2022", "2021", "2020 or earlier"].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Storage */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Storage Capacity</label>
            {details.aiDetectedFields?.storage && <AIDetectedBadge />}
          </div>
          <select
            value={details.storage}
            onChange={(e) => handleChangeField("storage", e.target.value)}
            className="w-full bg-slate-50 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {["Not detected", "64GB", "128GB", "256GB", "512GB", "1TB SSD", "2TB SSD", "N/A"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* RAM */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">RAM Memory</label>
            {details.aiDetectedFields?.ram && <AIDetectedBadge />}
          </div>
          <select
            value={details.ram}
            onChange={(e) => handleChangeField("ram", e.target.value)}
            className="w-full bg-slate-50 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {["Not detected", "4GB", "8GB", "12GB", "16GB", "32GB", "64GB", "N/A"].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Functional Status */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Functional Status</label>
            {details.aiDetectedFields?.functionalStatus && <AIDetectedBadge />}
          </div>
          <select
            value={details.functionalStatus}
            onChange={(e) => handleChangeField("functionalStatus", e.target.value as FunctionalStatus)}
            className="w-full bg-slate-50 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {functionalOptions.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cosmetic Condition Buttons */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Cosmetic Condition Assessment
          </label>
          {details.aiDetectedFields?.condition && <AIDetectedBadge />}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {cosmeticOptions.map((cond) => {
            const isSelected = details.condition === cond;
            return (
              <button
                key={cond}
                type="button"
                onClick={() => handleChangeField("condition", cond)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-slate-900 dark:text-white font-bold shadow-md"
                    : "bg-slate-50 dark:bg-emerald-950/40 border-slate-200 dark:border-emerald-800/80 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/50"
                }`}
              >
                <div className="text-xs">{cond}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Checkboxes: Accessories & Box */}
      <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-700 dark:text-slate-300">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={details.hasOriginalBox}
            onChange={(e) => handleChangeField("hasOriginalBox", e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
          <span>Includes Original Box (+2% Value)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={details.hasCharger}
            onChange={(e) => handleChangeField("hasCharger", e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
          <span>Includes Original Charger / Cable (+3% Value)</span>
        </label>
      </div>

      {/* Notes */}
      <div className="space-y-1.5 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Known Defects / Visual Damage Notes</label>
          {details.aiDetectedFields?.additionalNotes && <AIDetectedBadge />}
        </div>
        <textarea
          rows={2}
          value={details.additionalNotes}
          onChange={(e) => handleChangeField("additionalNotes", e.target.value)}
          placeholder="Mention minor dents, screen guard status, or visual damage detected..."
          className="w-full bg-slate-50 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>
    </div>
  );
};
