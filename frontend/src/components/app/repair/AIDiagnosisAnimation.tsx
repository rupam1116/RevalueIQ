"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Eye, Database, CheckCircle2, ShieldCheck, Zap, Activity, Leaf } from "lucide-react";
import { RepairDeviceSelection, RepairProblemForm, UploadedRepairImage } from "@/types/repair";

interface AIDiagnosisAnimationProps {
  device: RepairDeviceSelection;
  problem: RepairProblemForm;
  images: UploadedRepairImage[];
  onComplete: () => void;
}

const STAGES = [
  { id: 1, name: "Neural Vision & Surface Inspection", icon: Eye, desc: "Detecting micro-cracks, screen fractures, and swelling markers..." },
  { id: 2, name: "Logic Circuit & Symptom Matrix", icon: Cpu, desc: "Cross-referencing telemetry, power draw, and liquid sensors..." },
  { id: 3, name: "Parts Supply & OEM Pricing Index", icon: Database, desc: "Querying global replacement part repositories and supplier stocks..." },
  { id: 4, name: "DIY Feasibility & Modularity Scoring", icon: Zap, desc: "Calculating disassembly risk rating, tools, and labor time..." },
  { id: 5, name: "Generating Actionable Executive Report", icon: ShieldCheck, desc: "Finalizing recommendation, shop locations, and environmental impact..." },
];

export const AIDiagnosisAnimation: React.FC<AIDiagnosisAnimationProps> = ({
  device,
  problem,
  images,
  onComplete,
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }
        return prev + 1.2;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const stage = Math.min(4, Math.floor((progress / 100) * 5));
    setCurrentStageIdx(stage);

    const logMessages = [
      `[VISION_CORE]: Initializing optical tensor stream for ${device.brand} ${device.model}...`,
      `[FEATURE_EXTRACT]: Identified surface geometry. ${images.length} frame(s) ingested.`,
      `[ANOMALY_DETECTOR]: High density stress patterns flagged on display glass & frame.`,
      `[HARDWARE_MATRIX]: Cross-checking ${problem.severity} severity symptoms with global database...`,
      `[PARTS_ENGINE]: Found 14 OEM compatible replacement modules in regional warehouse.`,
      `[DIAGNOSTIC_COMPLETE]: Diagnostics complete. Generating comprehensive repair report...`,
    ];

    const currentLogCount = Math.min(logMessages.length, Math.floor((progress / 100) * (logMessages.length + 1)));
    setLogs(logMessages.slice(0, currentLogCount));
  }, [progress, device, problem, images]);

  const currentStage = STAGES[currentStageIdx] || STAGES[0];
  const StageIcon = currentStage.icon;

  return (
    <div className="relative rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-10 shadow-2xl space-y-8 overflow-hidden transition-all duration-300 animate-in fade-in">
      {/* Background Pulse Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 dark:border-emerald-900/40 pb-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
            <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-spin" /> Neural Diagnostic HUD Active
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Repair & Cost Diagnostics
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Target: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{device.brand} {device.model}</span> ({device.color})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-right">
            <p className="text-[10px] uppercase font-bold text-slate-400">Scan Progress</p>
            <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
      </div>

      {/* Center Stages Progress Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative z-10">
        {STAGES.map((stg, idx) => {
          const isDone = idx < currentStageIdx;
          const isCurrent = idx === currentStageIdx;
          const Icon = stg.icon;

          return (
            <div
              key={stg.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                isDone
                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                  : isCurrent
                  ? "bg-emerald-100/70 dark:bg-emerald-900/60 border-emerald-400 text-slate-900 dark:text-white shadow-md scale-[1.02]"
                  : "bg-emerald-50/20 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-slate-400 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${isCurrent ? "bg-emerald-600 text-white" : "bg-emerald-100 dark:bg-emerald-950 text-emerald-600"}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
              </div>
              <p className="text-[11px] font-bold truncate">{stg.name}</p>
            </div>
          );
        })}
      </div>

      {/* Main Active Stage Detail & Terminal Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left: Active Stage Feature Card */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <StageIcon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{currentStage.name}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{currentStage.desc}</p>
            </div>
          </div>
        </div>

        {/* Right: Live AI Terminal Stream */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-950 border border-emerald-900/40 font-mono text-xs text-slate-300 space-y-2 h-44 overflow-y-auto scrollbar-thin">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest border-b border-slate-800 pb-1 mb-2">
            AI Diagnostics Live Console Stream
          </p>
          {logs.map((log, i) => (
            <p key={i} className="leading-tight text-[11px] text-emerald-300">
              {log}
            </p>
          ))}
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="space-y-2 pt-2 relative z-10">
        <div className="w-full h-3 bg-emerald-100 dark:bg-emerald-950 rounded-full overflow-hidden border border-emerald-200 dark:border-emerald-800 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-full shadow-md transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
