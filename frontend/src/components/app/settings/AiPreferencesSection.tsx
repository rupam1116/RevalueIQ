"use client";

import React, { useState, useEffect } from "react";
import { AiPreferences } from "@/lib/settingsApi";
import { Bot, Sparkles, Wrench, DollarSign, HeartHandshake, Scale, Check } from "lucide-react";

interface AiPreferencesSectionProps {
  settings: AiPreferences;
  onSave: (updated: AiPreferences) => Promise<void> | void;
}

export const AiPreferencesSection: React.FC<AiPreferencesSectionProps> = ({
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<AiPreferences>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = async <K extends keyof AiPreferences>(
    field: K,
    value: AiPreferences[K]
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
    <section id="ai" className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> AI Engine & Recommendation Preferences
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Customize how RevalueIQ neural vision and valuation models compute lifecycle recommendations.
          </p>
        </div>

        {isSaved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 animate-in fade-in">
            <Check className="w-3.5 h-3.5" /> Saved to Database!
          </span>
        )}
      </div>

      {/* Preferred Recommendation Style Picker */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          Preferred Recommendation Priority
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Repair First */}
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleChange("preferred_recommendation_style", "Repair First")}
            className={`
              p-4 rounded-xl border transition-all text-left space-y-2 cursor-pointer
              ${
                formData.preferred_recommendation_style === "Repair First"
                  ? "bg-emerald-100 dark:bg-emerald-500/15 border-emerald-400 dark:border-emerald-500 text-slate-900 dark:text-slate-100 font-bold shadow-md"
                  : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              }
            `}
          >
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 w-fit">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-200">Repair First</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Prioritize extending device lifespan & DIY repair guides</p>
            </div>
          </button>

          {/* Sell First */}
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleChange("preferred_recommendation_style", "Sell First")}
            className={`
              p-4 rounded-xl border transition-all text-left space-y-2 cursor-pointer
              ${
                formData.preferred_recommendation_style === "Sell First"
                  ? "bg-cyan-100 dark:bg-cyan-500/15 border-cyan-400 dark:border-cyan-500 text-slate-900 dark:text-slate-100 font-bold shadow-md"
                  : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              }
            `}
          >
            <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 w-fit">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-200">Sell First</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Prioritize cash recovery & instant marketplace buyer matching</p>
            </div>
          </button>

          {/* Donation First */}
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleChange("preferred_recommendation_style", "Donation First")}
            className={`
              p-4 rounded-xl border transition-all text-left space-y-2 cursor-pointer
              ${
                formData.preferred_recommendation_style === "Donation First"
                  ? "bg-teal-100 dark:bg-teal-500/15 border-teal-400 dark:border-teal-500 text-slate-900 dark:text-slate-100 font-bold shadow-md"
                  : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              }
            `}
          >
            <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 w-fit">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-200">Donation First</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Prioritize digital inclusion & verified NGO matching</p>
            </div>
          </button>

          {/* Balanced */}
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleChange("preferred_recommendation_style", "Balanced")}
            className={`
              p-4 rounded-xl border transition-all text-left space-y-2 cursor-pointer
              ${
                formData.preferred_recommendation_style === "Balanced"
                  ? "bg-emerald-100 dark:bg-emerald-500/15 border-emerald-400 dark:border-emerald-500 text-slate-900 dark:text-slate-100 font-bold shadow-md"
                  : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              }
            `}
          >
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 w-fit">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-200">Balanced</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Optimal trade-off between resale value, ROI, and carbon offset</p>
            </div>
          </button>
        </div>
      </div>

      {/* AI Behavior Toggles */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> Machine Learning & History Toggles
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Enable AI Learning */}
          <div
            onClick={() => !isSaving && handleChange("enable_ai_learning", !formData.enable_ai_learning)}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
          >
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-200">Enable AI Learning</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Refine model accuracy from repair feedback</p>
            </div>
            <input
              type="checkbox"
              checked={formData.enable_ai_learning}
              onChange={() => {}}
              className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
            />
          </div>

          {/* Enable Personalized Suggestions */}
          <div
            onClick={() =>
              !isSaving && handleChange("enable_personalized_suggestions", !formData.enable_personalized_suggestions)
            }
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
          >
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-200">Personalized Suggestions</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Customized repair shop & price alerts</p>
            </div>
            <input
              type="checkbox"
              checked={formData.enable_personalized_suggestions}
              onChange={() => {}}
              className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
            />
          </div>

          {/* Allow AI Device History */}
          <div
            onClick={() => !isSaving && handleChange("allow_ai_device_history", !formData.allow_ai_device_history)}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
          >
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-200">Allow AI Device History</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Retain past device diagnostic grades</p>
            </div>
            <input
              type="checkbox"
              checked={formData.allow_ai_device_history}
              onChange={() => {}}
              className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
