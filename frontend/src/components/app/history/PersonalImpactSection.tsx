"use client";

import React, { useState } from "react";
import {
  Leaf,
  Recycle,
  Wrench,
  RotateCcw,
  HeartHandshake,
  IndianRupee,
  TreePine,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PersonalImpactSectionProps {
  verifiedCo2Saved: number;
  potentialCo2Opportunity: number;
  verifiedEwastePrevented: number;
  potentialEwasteOpportunity: number;
  devicesRepaired: number;
  devicesReused: number;
  devicesDonated: number;
  moneySaved: number;
  treesEquivalent: number;
}

export const PersonalImpactSection: React.FC<PersonalImpactSectionProps> = ({
  verifiedCo2Saved,
  potentialCo2Opportunity,
  verifiedEwastePrevented,
  potentialEwasteOpportunity,
  devicesRepaired,
  devicesReused,
  devicesDonated,
  moneySaved,
  treesEquivalent,
}) => {
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const hasVerifiedImpact = verifiedCo2Saved > 0 || devicesRepaired > 0 || devicesReused > 0 || devicesDonated > 0;

  const impactCards = [
    {
      title: "Verified CO₂ Saved",
      value: `${verifiedCo2Saved.toFixed(1)} kg`,
      subtext: "Strictly from confirmed completed actions",
      icon: Leaf,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/60",
      border: "border-emerald-200 dark:border-emerald-800/60",
      isVerified: true,
    },
    {
      title: "Potential CO₂ Abatement",
      value: `${potentialCo2Opportunity.toFixed(1)} kg`,
      subtext: "Identified via AI appraisals & diagnostics",
      icon: Lightbulb,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/60",
      border: "border-amber-200 dark:border-amber-800/60",
      isVerified: false,
    },
    {
      title: "Verified E-Waste Diverted",
      value: `${verifiedEwastePrevented.toFixed(2)} kg`,
      subtext: "Prevented heavy metal landfill toxicity",
      icon: Recycle,
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-50 dark:bg-teal-950/60",
      border: "border-teal-200 dark:border-teal-800/60",
      isVerified: true,
    },
    {
      title: "Verified Repairs Completed",
      value: `${devicesRepaired} Units`,
      subtext: "Hardware lifespan extended via repair",
      icon: Wrench,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/60",
      border: "border-blue-200 dark:border-blue-800/60",
      isVerified: true,
    },
    {
      title: "Devices Reused / Sold",
      value: `${devicesReused} Units`,
      subtext: "Resold into circular electronics marketplace",
      icon: RotateCcw,
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-50 dark:bg-cyan-950/60",
      border: "border-cyan-200 dark:border-cyan-800/60",
      isVerified: true,
    },
    {
      title: "Devices Donated",
      value: `${devicesDonated} Units`,
      subtext: "Transferred to verified NGOs & schools",
      icon: HeartHandshake,
      color: "text-pink-600 dark:text-pink-400",
      bg: "bg-pink-50 dark:bg-pink-950/60",
      border: "border-pink-200 dark:border-pink-800/60",
      isVerified: true,
    },
    {
      title: "Verified Money Earned / Saved",
      value: `₹${moneySaved.toLocaleString("en-IN")}`,
      subtext: "Confirmed resale earnings & repair savings",
      icon: IndianRupee,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/60",
      border: "border-green-200 dark:border-green-800/60",
      isVerified: true,
    },
    {
      title: "Mature Tree Equivalent",
      value: `${treesEquivalent} Trees`,
      subtext: "Annual carbon absorption equivalent",
      icon: TreePine,
      color: "text-emerald-700 dark:text-emerald-300",
      bg: "bg-emerald-100/70 dark:bg-emerald-900/40",
      border: "border-emerald-300 dark:border-emerald-700",
      isVerified: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Personal Circular Impact Audit</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Scientific life-cycle assessment (LCA) distinguishing confirmed realized metrics from potential opportunities.
          </p>
        </div>

        <button
          onClick={() => setShowFormulaModal(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 underline underline-offset-4 self-start sm:self-auto"
        >
          <Info className="w-3.5 h-3.5" />
          <span>How RevalueIQ Calculates Real Impact</span>
        </button>
      </div>

      {!hasVerifiedImpact && (
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200">
            <p className="font-bold mb-0.5">Strict Zero-Fake-Data Enforcement Active</p>
            <p className="opacity-90 leading-relaxed">
              Verified savings remain at 0.0 kg until physical completion is confirmed. As soon as you mark a repair completed, finalize a marketplace sale, or complete a donation, verified environmental savings are locked into your permanent record.
            </p>
          </div>
        </div>
      )}

      {/* 8 Impact Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {impactCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-2xl ${card.bg} border ${card.border} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {card.title}
                  </span>
                  <div className={`p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {card.value}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/40 dark:border-slate-800/40">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {card.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scientific Formula Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4 relative">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-emerald-900/40">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                Truthful LCA Calculation Methodology
              </h3>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
              <p>
                <strong>Tier 1: Recommendation Generated</strong> — Avoided embodied carbon emissions are calculated from category life-cycle assessment (LCA) benchmarks but marked purely as <em>potential opportunities</em>.
              </p>
              <p>
                <strong>Tier 2: Action Initiated</strong> — When an asset is placed in the circular marketplace or a repair inquiry is opened, it is classified as <em>in progress</em>. RevalueIQ does not claim completed carbon abatement.
              </p>
              <p>
                <strong>Tier 3: Externally Completed Action</strong> — Only when an item is marked <em>SOLD</em>, repair is confirmed completed, or donation is completed, the metric transitions to <em>Verified Realized Impact</em>.
              </p>
            </div>

            <Button
              onClick={() => setShowFormulaModal(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs"
            >
              Understood
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
