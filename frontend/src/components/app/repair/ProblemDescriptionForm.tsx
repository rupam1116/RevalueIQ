"use client";

import React from "react";
import { AlertTriangle, ShieldAlert, Zap, Droplets, Wrench, Power, CheckCircle, Sparkles } from "lucide-react";
import { RepairProblemForm } from "@/types/repair";

interface ProblemDescriptionFormProps {
  form: RepairProblemForm;
  onChange: (form: RepairProblemForm) => void;
}

const SYMPTOM_CATEGORIES = [
  "Screen & Battery",
  "Charging & Power",
  "Motherboard & Liquid",
  "Camera & Sensors",
  "Audio & Microphone",
  "Housing & Buttons",
  "Software / Unknown",
];

const CATEGORY_SYMPTOMS: Record<string, string[]> = {
  "Screen & Battery": [
    "Cracked Screen / Glass",
    "Touch Unresponsive",
    "Battery Draining Fast",
    "Swollen Battery / Lifting Display",
    "Black Screen / No Display",
    "Flickering / Display Lines",
  ],
  "Charging & Power": [
    "Won't Power On / Dead",
    "Not Charging",
    "Loose Charging Port",
    "Overheating While Charging",
    "Intermittent Power Cut",
  ],
  "Motherboard & Liquid": [
    "Liquid Contact / Corrosion",
    "Boot Loop / Crash",
    "No Power / Short Circuit",
    "Overheating Mainboard",
    "Random Restarts",
  ],
  "Camera & Sensors": [
    "Camera Blank / Black Screen",
    "Blurry / Cracked Camera Lens",
    "Biometric / Face ID Failure",
    "Proximity Sensor Issue",
    "Flashlight Inoperative",
  ],
  "Audio & Microphone": [
    "No Sound from Speaker",
    "Microphone Muffled / Inoperative",
    "Distorted / Crackling Audio",
    "Earpiece Low Volume",
    "Headphone Jack Fault",
  ],
  "Housing & Buttons": [
    "Broken Back Glass",
    "Bent Metal Chassis",
    "Stuck Power / Volume Button",
    "Damaged Hinge Mechanism",
    "Loose Frame",
  ],
  "Software / Unknown": [
    "Stuck on Boot Logo",
    "OS System Freezing",
    "Thermal Throttling",
    "Corrupt System Storage",
    "Unknown Diagnostic Failure",
  ],
};

const SEVERITY_LEVELS: { level: NonNullable<RepairProblemForm["severityLevel"]>; label: string; desc: string; color: string }[] = [
  { level: "Low", label: "Low Impact", desc: "Cosmetic scratch or minor feature drop", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  { level: "Medium", label: "Moderate Impact", desc: "Usable but degraded performance/battery", color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" },
  { level: "High", label: "High Severity", desc: "Cracked display glass, erratic touches, non-responsive port", color: "text-orange-400 border-orange-500/30 bg-orange-500/10" },
  { level: "Critical", label: "Critical Failure", desc: "Liquid damage, swollen battery, no power boot", color: "text-red-400 border-red-500/30 bg-red-500/10" },
];

export const ProblemDescriptionForm: React.FC<ProblemDescriptionFormProps> = ({
  form,
  onChange,
}) => {
  // Strict semantic boolean resolvers ensuring UI and state never desynchronize
  const isPowersOn = form.powersOn === true;
  const isLiquidExposed = form.liquidExposure === true;
  const isPreviouslyRepaired = form.previousRepairs === true;

  const currentCategory = form.symptomCategory || "Screen & Battery";
  const categorySymptoms = CATEGORY_SYMPTOMS[currentCategory] || CATEGORY_SYMPTOMS["Screen & Battery"];
  
  // Merge current category symptoms with any existing selected symptoms not in the list
  const activeCategorySymptoms = Array.from(
    new Set([...categorySymptoms, ...(form.symptoms || [])])
  );

  const handleToggleSymptom = (symptom: string) => {
    const current = form.symptoms || [];
    const updated = current.includes(symptom)
      ? current.filter((s) => s !== symptom)
      : [...current, symptom];
    onChange({ ...form, symptoms: updated });
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-8 space-y-6 shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-4">
        <div>
          <span className="inline-flex items-center text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Step 2 of 3
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            Problem Description & Diagnostics
          </h2>
        </div>
      </div>

      {/* Symptom Category Chips */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
          Primary Symptom Category
        </label>
        <div className="flex flex-wrap gap-2">
          {SYMPTOM_CATEGORIES.map((cat) => {
            const isSelected = form.symptomCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChange({ ...form, symptomCategory: cat })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-slate-700 dark:text-slate-300 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Observed Symptoms Multi-Select Chips */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
            Observed Diagnostic Symptoms ({form.symptoms?.length || 0} Selected)
          </label>
          {form.symptoms && form.symptoms.length > 0 && (
            <button
              type="button"
              onClick={() => onChange({ ...form, symptoms: [] })}
              className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer bg-transparent border-0 font-bold"
            >
              Clear Symptoms
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {activeCategorySymptoms.map((symptom) => {
            const isSelected = (form.symptoms || []).includes(symptom);
            return (
              <button
                key={symptom}
                type="button"
                onClick={() => handleToggleSymptom(symptom)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm ring-1 ring-emerald-500/40"
                    : "bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40 text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-emerald-500 shadow-xs shadow-emerald-500" : "bg-slate-400 dark:bg-slate-600"}`} />
                <span>{symptom}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Issue Headline */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
          Short Problem Summary / Title
        </label>
        <input
          type="text"
          value={form.mainIssue ?? form.issueHeadline ?? ""}
          onChange={(e) =>
            onChange({
              ...form,
              mainIssue: e.target.value,
              issueHeadline: e.target.value,
            })
          }
          placeholder="e.g., Shattered glass digitizer & battery drops quickly"
          className="w-full px-4 py-3 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
        />
      </div>

      {/* Detailed Description Textarea */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
          Detailed Description of Symptoms & Events
        </label>
        <textarea
          rows={3}
          value={form.description ?? form.userDescription ?? form.detailedDescription ?? ""}
          onChange={(e) =>
            onChange({
              ...form,
              description: e.target.value,
              userDescription: e.target.value,
              detailedDescription: e.target.value,
            })
          }
          placeholder="Describe how the issue occurred (e.g. dropped on concrete, liquid spill, sudden shutdown)..."
          className="w-full px-4 py-3 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
        />
      </div>

      {/* Severity Selector */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
          Assessed Symptom Severity
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {SEVERITY_LEVELS.map((item) => {
            const isSelected = (form.severityLevel || form.severity || "High") === item.level;
            return (
              <button
                key={item.level}
                type="button"
                onClick={() => onChange({ ...form, severityLevel: item.level, severity: item.level })}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? `${item.color} shadow-lg ring-2 ring-emerald-500/40 dark:ring-emerald-400/40`
                    : "bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40 text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black">{item.label}</span>
                    {isSelected && <CheckCircle className="w-4 h-4" />}
                  </div>
                  <p className="text-[10px] leading-snug opacity-90">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Toggles: Power, Liquid, Previous Repairs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {/* Power Status */}
        <button
          type="button"
          onClick={() => onChange({ ...form, powersOn: !isPowersOn })}
          className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
            isPowersOn
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <Power className="w-4 h-4" />
            <div className="text-left">
              <span className="text-xs font-bold block">Power / Boot Status</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {isPowersOn ? "Device Powers On" : "No Power / Black Screen"}
              </span>
            </div>
          </div>
          <div
            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
              isPowersOn ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                isPowersOn ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
        </button>

        {/* Liquid Exposure */}
        <button
          type="button"
          onClick={() => onChange({ ...form, liquidExposure: !isLiquidExposed })}
          className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
            isLiquidExposed
              ? "bg-teal-500/15 border-teal-500/40 text-teal-800 dark:text-teal-300"
              : "bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40 text-slate-700 dark:text-slate-400"
          }`}
        >
          <div className="flex items-center gap-3">
            <Droplets className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <div className="text-left">
              <span className="text-xs font-bold block">Liquid Exposure</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {isLiquidExposed ? "Water / Coffee Contact" : "No Liquid Exposure"}
              </span>
            </div>
          </div>
          <div
            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
              isLiquidExposed ? "bg-teal-600" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                isLiquidExposed ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
        </button>

        {/* Previous Repairs */}
        <button
          type="button"
          onClick={() => onChange({ ...form, previousRepairs: !isPreviouslyRepaired })}
          className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
            isPreviouslyRepaired
              ? "bg-purple-500/15 border-purple-500/40 text-purple-800 dark:text-purple-300"
              : "bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40 text-slate-700 dark:text-slate-400"
          }`}
        >
          <div className="flex items-center gap-3">
            <Wrench className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <div className="text-left">
              <span className="text-xs font-bold block">Prior Repair History</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {isPreviouslyRepaired ? "Previously Repaired" : "Factory Original"}
              </span>
            </div>
          </div>
          <div
            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
              isPreviouslyRepaired ? "bg-purple-600" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                isPreviouslyRepaired ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
        </button>
      </div>
    </div>
  );
};

