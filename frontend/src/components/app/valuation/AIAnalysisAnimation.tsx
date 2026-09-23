"use client";

import React, { useState, useEffect } from "react";
import { Cpu, RefreshCw, CheckCircle2, ShieldCheck, Activity, Leaf } from "lucide-react";
import { UploadedImage, DeviceDetails } from "@/types/valuation";

interface AIAnalysisAnimationProps {
  images: UploadedImage[];
  details: DeviceDetails;
  onComplete: () => void;
}

export const AIAnalysisAnimation: React.FC<AIAnalysisAnimationProps> = ({
  images,
  details,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { label: "1. Inspecting device image", threshold: 14 },
    { label: "2. Identifying device", threshold: 28 },
    { label: "3. Evaluating condition", threshold: 42 },
    { label: "4. Estimating resale value", threshold: 56 },
    { label: "5. Estimating repair cost", threshold: 70 },
    { label: "6. Calculating circularity score", threshold: 84 },
    { label: "7. Preparing recommendation", threshold: 100 },
  ];

  const primaryImageUrl =
    images.length > 0
      ? images[0].url
      : "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop";

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 1.5;
      if (currentProgress > 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 300);
      }
      setProgress(currentProgress);

      const nextStepIndex = steps.findIndex((step) => currentProgress <= step.threshold);
      if (nextStepIndex !== -1) {
        setCurrentStepIndex(nextStepIndex);
      } else {
        setCurrentStepIndex(steps.length - 1);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className="relative rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-8 sm:p-12 shadow-2xl overflow-hidden text-center space-y-8 max-w-3xl mx-auto my-8 transition-all duration-300 animate-in fade-in zoom-in-95"
    >
      {/* Background Pulse Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-spin" /> Eco AI Vision & Diagnostics in Progress
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Eco AI Vision & Diagnostics in Progress
        </h2>
        <p className="text-xs text-slate-500 font-semibold">
          Analyzing {details.brand} {details.model} ({details.category})
        </p>
      </div>

      {/* Visual Scanner Camera Frame */}
      <div className="relative w-48 h-48 mx-auto rounded-3xl overflow-hidden bg-slate-950 border-2 border-emerald-500/40 shadow-2xl flex items-center justify-center">
        <img
          src={primaryImageUrl}
          alt="Device Scan"
          className="w-full h-full object-cover opacity-70"
        />

        {/* Laser Scanner Motion Bar */}
        <div
          style={{ top: `${progress}%` }}
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-green-400 shadow-[0_0_15px_#10b981] transition-all duration-75 pointer-events-none"
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border border-dashed border-emerald-400/80 rounded-2xl flex items-center justify-center animate-pulse">
            <Activity className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Dynamic Steps List */}
      <div className="space-y-4 max-w-md mx-auto relative z-10 text-left">
        <div className="space-y-2">
          {steps.map((step, idx) => {
            const isFinished = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                  isFinished
                    ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                    : isCurrent
                    ? "bg-emerald-100/70 dark:bg-emerald-900/60 border-emerald-400 text-slate-900 dark:text-white shadow-sm"
                    : "bg-emerald-50/20 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-slate-400"
                }`}
              >
                <span>{step.label}</span>
                {isFinished ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin shrink-0" />
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="h-2.5 w-full bg-emerald-100 dark:bg-emerald-950 rounded-full overflow-hidden border border-emerald-200 dark:border-emerald-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
