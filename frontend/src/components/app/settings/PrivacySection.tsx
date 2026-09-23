"use client";

import React, { useState, useEffect } from "react";
import { PrivacyPreferences } from "@/lib/settingsApi";
import { Lock, Eye, Cookie, Bot, Check, ShieldCheck } from "lucide-react";

interface PrivacySectionProps {
  settings: PrivacyPreferences;
  onSave: (updated: PrivacyPreferences) => Promise<void> | void;
  onOpenCookiePreferences: () => void;
}

export const PrivacySection: React.FC<PrivacySectionProps> = ({
  settings,
  onSave,
  onOpenCookiePreferences,
}) => {
  const [formData, setFormData] = useState<PrivacyPreferences>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = async <K extends keyof PrivacyPreferences>(
    field: K,
    value: PrivacyPreferences[K]
  ) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setIsSaving(true);
    try {
      await onSave(updated);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section id="privacy" className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Privacy & Data Permissions
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Control visibility of your sustainability footprint, public activity, AI personalization, and telemetry.
          </p>
        </div>

        {isSaved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 animate-in fade-in">
            <Check className="w-3.5 h-3.5" /> Saved to Database!
          </span>
        )}
      </div>

      {/* Visibility Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Profile Visibility
          </label>
          <select
            value={formData.profile_visibility}
            disabled={isSaving}
            onChange={(e) =>
              handleChange("profile_visibility", e.target.value as PrivacyPreferences["profile_visibility"])
            }
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer font-medium"
          >
            <option value="Public">Public (Everyone)</option>
            <option value="Members Only">Members Only</option>
            <option value="Private">Private (Only You)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> Activity History Visibility
          </label>
          <select
            value={formData.activity_visibility}
            disabled={isSaving}
            onChange={(e) =>
              handleChange("activity_visibility", e.target.value as PrivacyPreferences["activity_visibility"])
            }
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer font-medium"
          >
            <option value="Public">Public</option>
            <option value="Followers Only">Followers Only</option>
            <option value="Private">Private</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Sustainability Stats
          </label>
          <select
            value={formData.stats_visibility}
            disabled={isSaving}
            onChange={(e) =>
              handleChange("stats_visibility", e.target.value as PrivacyPreferences["stats_visibility"])
            }
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer font-medium"
          >
            <option value="Public Leaderboards">Public Leaderboards</option>
            <option value="Members Only">Members Only</option>
            <option value="Hidden">Hidden</option>
          </select>
        </div>
      </div>

      {/* Checkbox Toggles */}
      <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">
          Data & Analytics Consents
        </h3>

        <div className="space-y-2">
          {/* Search Indexing */}
          <div
            onClick={() => !isSaving && handleChange("search_engine_indexing", !formData.search_engine_indexing)}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer text-xs"
          >
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-200">Search Engine Indexing</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Allow search engines to discover public RevalueIQ profile data.</p>
            </div>
            <input
              type="checkbox"
              checked={formData.search_engine_indexing}
              onChange={() => {}}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* AI Model Personalization */}
          <div
            onClick={() => !isSaving && handleChange("ai_data_personalization", !formData.ai_data_personalization)}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer text-xs"
          >
            <div className="flex items-center gap-3">
              <Bot className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-200">AI Valuation Personalization</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Use past device appraisal history to improve local resale value recommendations.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.ai_data_personalization}
              onChange={() => {}}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* Telemetry & Analytics */}
          <div
            onClick={() => !isSaving && handleChange("anonymized_analytics", !formData.anonymized_analytics)}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer text-xs"
          >
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-200">Anonymized Telemetry & Crash Analytics</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Send anonymous technical logs to help RevalueIQ resolve errors.</p>
            </div>
            <input
              type="checkbox"
              checked={formData.anonymized_analytics}
              onChange={() => {}}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Cookie Preferences Modal Trigger */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs pt-3">
        <div className="flex items-center gap-3">
          <Cookie className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-200">Granular Cookie Settings</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Manage essential, analytics, and functional cookie consents.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenCookiePreferences}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer border-0"
        >
          Manage Cookies
        </button>
      </div>
    </section>
  );
};
