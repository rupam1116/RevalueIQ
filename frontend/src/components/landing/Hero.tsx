"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, Play, X, Sparkles, Smartphone, Laptop, Camera, Watch, Tablet,
  CheckCircle2, Shield, Scan, Cpu, TrendingUp, Leaf, Recycle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingDevices = [
  { icon: Smartphone, label: "iPhone 15 Pro", category: "Phone", val: "₹78,500", grade: "Grade A+", delay: 0, x: -170, y: -70, color: "from-emerald-500/20 to-teal-500/20" },
  { icon: Laptop, label: "MacBook Pro M3", category: "Laptop", val: "₹1,45,000", grade: "Grade A", delay: 0.8, x: 170, y: -50, color: "from-teal-500/20 to-emerald-500/20" },
  { icon: Watch, label: "Apple Watch Ultra", category: "Smartwatch", val: "₹42,000", grade: "Grade A+", delay: 1.6, x: -140, y: 90, color: "from-emerald-500/20 to-green-500/20" },
  { icon: Tablet, label: "iPad Pro 12.9\"", category: "Tablet", val: "₹68,000", grade: "Grade B+", delay: 2.4, x: 150, y: 110, color: "from-green-500/20 to-teal-500/20" },
  { icon: Camera, label: "Sony WH-1000XM5", category: "Audio", val: "₹22,000", grade: "Grade A+", delay: 3.2, x: 0, y: -150, color: "from-teal-500/20 to-emerald-500/20" },
];

export default function LandingHero() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [activeScanIdx, setActiveScanIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveScanIdx((prev) => (prev + 1) % floatingDevices.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const activeDevice = floatingDevices[activeScanIdx];

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 dark:from-[#06140e] dark:via-[#081a13] dark:to-[#06140e] text-slate-900 dark:text-white pt-24 pb-16 transition-colors duration-300">
      {/* ── Background: Animated Gradient Mesh & Particles ── */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[650px] bg-gradient-to-tr from-emerald-600/15 via-teal-500/10 to-green-500/8 rounded-full blur-[180px]" />
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 -left-20 w-[650px] h-[650px] bg-teal-500/10 rounded-full blur-[180px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1.2px,transparent_1.2px)] [background-size:40px_40px] opacity-[0.05]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ── Left Column: Headline & CTAs ── */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left transition-all duration-300 animate-in fade-in">
            {/* Kicker Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/25 text-emerald-800 dark:text-emerald-400 backdrop-blur-md shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Next-Gen Circular Economy Platform</span>
              <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.06]">
              AI-Powered{" "}
              <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent">
                Circular Economy
              </span>
              <br />
              Platform
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              RevalueIQ uses vision AI to evaluate electronics, predict resale market values,
              recommend instant repairs, and streamline e-waste recycling — extending the life of every device.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start pt-2">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="text-sm font-semibold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white border-0 shadow-xl shadow-emerald-600/25 transition-all duration-300 px-8 h-13 rounded-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                onClick={() => setDemoModalOpen(true)}
                className="text-sm font-medium h-13 rounded-xl px-7 gap-2.5 bg-white dark:bg-slate-900/80 hover:bg-emerald-50 dark:hover:bg-slate-800 border-emerald-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-white backdrop-blur-md transition-all duration-300"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
                </div>
                Watch Demo
              </Button>
            </div>

            {/* Quick Metrics Pills */}
            <div className="pt-6 border-t border-emerald-100 dark:border-emerald-900/60 flex flex-wrap items-center gap-6 justify-center lg:justify-start text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Carbon Waste</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Instant AI Valuation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>500+ Certified Partners</span>
              </div>
            </div>
          </div>

          {/* ── Right Column: Interactive AI Scanning Graphic ── */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[460px]">
            <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center">
              
              {/* Central Glowing AI Reactor Ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center backdrop-blur-md">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex flex-col items-center justify-center shadow-2xl shadow-emerald-500/40 relative">
                    <Scan className="w-9 h-9 text-white animate-pulse" />
                    <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-100 uppercase mt-1">Revalue-AI</span>
                  </div>
                </div>
              </div>

              {/* Floating Devices Orbit */}
              {floatingDevices.map((device, i) => {
                const Icon = device.icon;
                const isScanning = i === activeScanIdx;
                return (
                  <div
                    key={device.label}
                    className="absolute top-1/2 left-1/2 transition-all duration-500"
                    style={{
                      transform: `translate(calc(-50% + ${device.x}px), calc(-50% + ${device.y}px))`,
                    }}
                  >
                    <div
                      className={`relative p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border ${
                        isScanning
                          ? "border-emerald-500 shadow-xl shadow-emerald-500/30 bg-white dark:bg-slate-900 scale-105"
                          : "border-emerald-100 dark:border-slate-800/80 shadow-md hover:border-emerald-300 dark:hover:border-slate-700"
                      } transition-all duration-300 backdrop-blur-xl group cursor-pointer`}
                      onClick={() => setActiveScanIdx(i)}
                    >
                      {/* Active Scan Marker Badge */}
                      {isScanning && (
                        <div className="absolute -top-2.5 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-[9px] font-bold text-white uppercase tracking-wider shadow-md">
                          Scanning
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${device.color} border border-emerald-200 dark:border-white/10 flex items-center justify-center shrink-0`}>
                          <Icon className={`w-5 h-5 ${isScanning ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-300"}`} />
                        </div>
                        <div className="pr-1 text-left hidden sm:block">
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{device.label}</p>
                          <div className="flex items-center gap-2 text-[11px] mt-0.5">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{device.val}</span>
                            <span className="text-slate-600 dark:text-slate-400 text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">{device.grade}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Dynamic Live AI Analysis Floating Card */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[290px] p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-emerald-400 dark:border-emerald-500/30 shadow-2xl backdrop-blur-2xl text-left z-20 transition-all duration-300">
                <div className="flex items-center justify-between border-b border-emerald-100 dark:border-slate-800 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-200">Live AI Valuation</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">99.4% Match</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="text-slate-900 dark:text-slate-100 font-bold">{activeDevice.label}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{activeDevice.category} • Vision Model v4.2</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{activeDevice.val}</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                      <TrendingUp className="w-3 h-3" /> Resale Peak
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ── Demo Video Modal ── */}
      {demoModalOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in"
          onClick={() => setDemoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-2xl bg-black border border-emerald-500/30 shadow-2xl shadow-emerald-950/50 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center backdrop-blur-sm transition-all border border-slate-700"
              aria-label="Close demo video"
            >
              <X className="w-5 h-5" />
            </button>

            <video
              controls
              autoPlay
              playsInline
              preload="auto"
              className="w-full h-full object-contain rounded-2xl bg-black"
            >
              <source src="/revalueiq.mp4" type="video/mp4" />
              Your browser does not support HTML5 video playback.
            </video>
          </div>
        </div>
      )}
    </section>
  );
}
