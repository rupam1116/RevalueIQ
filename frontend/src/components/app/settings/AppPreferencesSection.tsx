"use client";

import React, { useState, useEffect } from "react";
import { AppPreferences } from "@/lib/settingsApi";
import { Sliders, Sun, Moon, Laptop, Globe, IndianRupee, Navigation, Calendar, Accessibility, Sparkles, LayoutList, Check } from "lucide-react";

interface AppPreferencesSectionProps {
  settings: AppPreferences;
  onSave: (updated: AppPreferences) => Promise<void> | void;
}

export const AppPreferencesSection: React.FC<AppPreferencesSectionProps> = ({
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<AppPreferences>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const applyTheme = (theme: "Light" | "Dark" | "System Default") => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    if (theme === "Dark") {
      root.classList.add("dark");
    } else if (theme === "Light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const handleChange = async <K extends keyof AppPreferences>(
    field: K,
    value: AppPreferences[K]
  ) => {
    const updated = { ...formData, [field]: value };
    // Always enforce INR currency
    updated.currency = "INR (₹)";

    setFormData(updated);

    if (field === "theme") {
      applyTheme(value as "Light" | "Dark" | "System Default");
    }

    setIsSaving(true);
    try {
      await onSave(updated);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAccessibilityChange = async <K extends keyof AppPreferences["accessibility"]>(
    key: K,
    value: AppPreferences["accessibility"][K]
  ) => {
    const updatedAccessibility = { ...formData.accessibility, [key]: value };
    await handleChange("accessibility", updatedAccessibility);
  };

  return (
    <section id="preferences" className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Application Preferences
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Customize visual themes, regional localization, animation speeds, and accessibility controls.
          </p>
        </div>

        {isSaved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 animate-in fade-in">
            <Check className="w-3.5 h-3.5" /> Saved to Database!
          </span>
        )}
      </div>

      {/* Theme Picker */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          Interface Theme
        </label>
        <div className="grid grid-cols-3 gap-3">
          {/* Light Theme */}
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleChange("theme", "Light")}
            className={`
              flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all cursor-pointer space-y-2
              ${
                formData.theme === "Light"
                  ? "bg-emerald-100 dark:bg-emerald-500/15 border-emerald-400 dark:border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold shadow-md"
                  : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              }
            `}
          >
            <Sun className="w-5 h-5" />
            <span className="text-xs">Light</span>
          </button>

          {/* Dark Theme */}
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleChange("theme", "Dark")}
            className={`
              flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all cursor-pointer space-y-2
              ${
                formData.theme === "Dark"
                  ? "bg-emerald-100 dark:bg-emerald-500/15 border-emerald-400 dark:border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold shadow-md"
                  : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              }
            `}
          >
            <Moon className="w-5 h-5" />
            <span className="text-xs">Dark</span>
          </button>

          {/* System Default */}
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleChange("theme", "System Default")}
            className={`
              flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all cursor-pointer space-y-2
              ${
                formData.theme === "System Default"
                  ? "bg-emerald-100 dark:bg-emerald-500/15 border-emerald-400 dark:border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold shadow-md"
                  : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              }
            `}
          >
            <Laptop className="w-5 h-5" />
            <span className="text-xs">System Default</span>
          </button>
        </div>
      </div>

      {/* Regional Formats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Language
          </label>
          <select
            value={formData.language}
            onChange={(e) => handleChange("language", e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            <option value="English (US)">English (US)</option>
            <option value="English (UK)">English (UK)</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Spanish">Spanish (Español)</option>
            <option value="German">German (Deutsch)</option>
          </select>
        </div>

        {/* Currency is locked to INR per rule */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Currency (Locked)
          </label>
          <div className="w-full bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-bold flex items-center justify-between select-none">
            <span>INR (₹ - Indian Rupee)</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Standard</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> Distance Unit
          </label>
          <select
            value={formData.distance_unit}
            onChange={(e) =>
              handleChange("distance_unit", e.target.value as AppPreferences["distance_unit"])
            }
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            <option value="Kilometers (km)">Kilometers (km)</option>
            <option value="Miles (mi)">Miles (mi)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> Date Format
          </label>
          <select
            value={formData.date_format}
            onChange={(e) =>
              handleChange("date_format", e.target.value as AppPreferences["date_format"])
            }
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY (EU/Asia)</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
          </select>
        </div>
      </div>

      {/* Accessibility & Motion Toggles */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <Accessibility className="w-4 h-4" /> Accessibility & Interface Layout
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* High Contrast Mode */}
          <div
            onClick={() =>
              handleAccessibilityChange("high_contrast", !formData.accessibility.high_contrast)
            }
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
          >
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-200">High Contrast Mode</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Enhance text & border contrast</p>
            </div>
            <input
              type="checkbox"
              checked={formData.accessibility.high_contrast}
              onChange={() => {}}
              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* Reduced Motion */}
          <div
            onClick={() =>
              handleAccessibilityChange("reduced_motion", !formData.accessibility.reduced_motion)
            }
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
          >
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-200">Reduced Motion</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Minimize CSS transition animations</p>
            </div>
            <input
              type="checkbox"
              checked={formData.accessibility.reduced_motion}
              onChange={() => {}}
              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* UI Animations */}
          <div
            onClick={() => handleChange("animations", !formData.animations)}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-200">Smooth CSS Transitions</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Enable micro-interactions & feedback</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.animations}
              onChange={() => {}}
              className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
            />
          </div>

          {/* Compact Mode */}
          <div
            onClick={() => handleChange("compact_mode", !formData.compact_mode)}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <LayoutList className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-200">Compact Table Mode</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Higher density table & list layout</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.compact_mode}
              onChange={() => {}}
              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
