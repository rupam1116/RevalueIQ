"use client";

import React from "react";
import { Cpu, Smartphone, Laptop, Wrench, RefreshCw, Leaf, Sparkles, ShieldCheck } from "lucide-react";

export default function AuthIllustration() {
  return (
    <div className="relative w-full h-full min-h-[480px] flex flex-col justify-between p-8 rounded-3xl bg-[#0b1a13]/80 border border-emerald-900/50 backdrop-blur-xl overflow-hidden shadow-2xl group">
      {/* Background Ambient Glow Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-emerald-600/20 via-teal-500/20 to-green-500/20 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1a3829_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Top Header Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
          <span>AI Circular Intelligence</span>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 font-mono">RevalueIQ Eco Engine</span>
      </div>

      {/* Center Interactive Visualization */}
      <div className="relative z-10 my-auto flex items-center justify-center py-6">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
          
          {/* Outer Orbiting Circular Economy Ring */}
          <div
            className="absolute inset-0 rounded-full border border-dashed border-emerald-500/30 animate-spin"
            style={{ animationDuration: '30s' }}
          />

          <div
            className="absolute inset-4 rounded-full border border-emerald-900/60"
          />

          {/* Floating Orbiting Node 1: Laptop Device */}
          <div className="absolute inset-0 pointer-events-none animate-spin" style={{ animationDuration: '25s' }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl bg-[#06140e] border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Laptop className="w-5 h-5" />
            </div>
          </div>

          {/* Floating Orbiting Node 2: Smartphone */}
          <div className="absolute inset-0 pointer-events-none animate-spin" style={{ animationDuration: '25s', animationDelay: '-6s' }}>
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#06140e] border border-teal-500/50 flex items-center justify-center text-teal-400 shadow-[0_0_20px_rgba(13,148,136,0.4)]">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>

          {/* Floating Orbiting Node 3: Repair Wrench */}
          <div className="absolute inset-0 pointer-events-none animate-spin" style={{ animationDuration: '25s', animationDelay: '-12s' }}>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl bg-[#06140e] border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Wrench className="w-5 h-5" />
            </div>
          </div>

          {/* Floating Orbiting Node 4: Eco Leaf */}
          <div className="absolute inset-0 pointer-events-none animate-spin" style={{ animationDuration: '25s', animationDelay: '-18s' }}>
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#06140e] border border-teal-500/50 flex items-center justify-center text-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.4)]">
              <Leaf className="w-5 h-5" />
            </div>
          </div>

          {/* Central Core: AI Processing Node */}
          <div
            className="relative w-36 h-36 rounded-3xl bg-gradient-to-tr from-[#06140e] via-[#0b1a13] to-[#0f2a1d] border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.25)] flex flex-col items-center justify-center gap-2 p-4 text-center z-10 animate-pulse"
          >
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-400">
              <Cpu className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-white tracking-wide">AI Eco Valuation</h4>
              <p className="text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Live Appraisal
              </p>
            </div>
          </div>

          {/* Connecting SVG Laser Beams */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            <line x1="50%" y1="50%" x2="50%" y2="10%" stroke="url(#emeraldGlow)" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="50%" y1="50%" x2="90%" y2="50%" stroke="url(#tealGlow)" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="50%" y1="50%" x2="50%" y2="90%" stroke="url(#emeraldGlow)" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="50%" y1="50%" x2="10%" y2="50%" stroke="url(#tealGlow)" strokeWidth="1.5" strokeDasharray="4 4" />
            <defs>
              <linearGradient id="emeraldGlow"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="transparent" /></linearGradient>
              <linearGradient id="tealGlow"><stop offset="0%" stopColor="#14b8a6" /><stop offset="100%" stopColor="transparent" /></linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Bottom Feature Telemetry Pills */}
      <div className="relative z-10 grid grid-cols-2 gap-3 pt-2">
        <div className="p-3 rounded-2xl bg-[#06140e]/90 border border-emerald-900/60 backdrop-blur-md flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-[11px] font-bold text-white">99.4% Accuracy</h5>
            <p className="text-[10px] text-slate-400">Market Value Index</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#06140e]/90 border border-emerald-900/60 backdrop-blur-md flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-[11px] font-bold text-white">Zero E-Waste</h5>
            <p className="text-[10px] text-slate-400">Circular Tech Goal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
