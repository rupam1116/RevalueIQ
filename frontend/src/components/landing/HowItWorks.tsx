"use client";

import { UploadCloud, Cpu, DollarSign, RefreshCw, ArrowRight, Check } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Upload Device",
    subtitle: "Snap 3 photos or input device details",
    description: "Take quick photos of your phone, laptop, or gadget from front, back, and sides. Our system automatically reads model specs and serials.",
    icon: UploadCloud,
    gradient: "from-emerald-500 to-teal-500",
    visual: "Photo scan frame with camera auto-focus reticle",
  },
  {
    step: "02",
    title: "AI Analysis",
    subtitle: "Computer vision detects scratch severity & hardware grade",
    description: "Revalue-Vision models process cosmetic condition, screen micro-cracks, screen burn, and compare against 10M+ hardware data points.",
    icon: Cpu,
    gradient: "from-teal-500 to-green-500",
    visual: "Laser beam sweeping over device chassis",
  },
  {
    step: "03",
    title: "Receive Valuation",
    subtitle: "Instant fair market value + repair cost breakdown",
    description: "Get a certified valuation report showing current resale pricing, estimated component repair cost, and e-waste environmental impact.",
    icon: DollarSign,
    gradient: "from-green-500 to-emerald-600",
    visual: "Valuation score card with price trend graph",
  },
  {
    step: "04",
    title: "Repair, Sell or Donate",
    subtitle: "1-click actions tailored to your goals",
    description: "Choose to list on our certified marketplace, book local micro-repair with nearby shops, or donate to accredited e-waste recyclers.",
    icon: RefreshCw,
    gradient: "from-emerald-600 to-teal-600",
    visual: "3-path decision tree: Repair / Sell / Donate",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-white dark:bg-[#06140e] relative overflow-hidden border-t border-emerald-100 dark:border-emerald-900/40 transition-colors duration-300">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-emerald-500/5 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400">
            Simple 4-Step Process
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            How{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent">
              RevalueIQ Works
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            From photo scan to circular action in less than 60 seconds. Powered by cutting-edge computer vision and live market intelligence.
          </p>
        </div>

        {/* Steps Grid / Timeline */}
        <div className="relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-[110px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 z-0 opacity-30" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((stepItem) => {
              const Icon = stepItem.icon;
              return (
                <div
                  key={stepItem.step}
                  className="flex flex-col h-full bg-slate-50 dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-6 sm:p-7 relative hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all duration-300 shadow-sm hover:shadow-xl group"
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stepItem.gradient} p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                      <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>

                    <span className="text-2xl font-black font-mono text-slate-300 dark:text-slate-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {stepItem.step}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                    {stepItem.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
                    {stepItem.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                    {stepItem.description}
                  </p>

                  {/* Graphic Illustration Preview Pill */}
                  <div className="mt-6 pt-4 border-t border-emerald-100 dark:border-slate-800/80 flex items-center gap-2 text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950/60 p-2.5 rounded-xl border border-emerald-200 dark:border-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate">{stepItem.visual}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Arrow Indicator */}
        <div className="mt-12 text-center flex items-center justify-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>Upload</span>
          <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>AI Scan</span>
          <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Valuation</span>
          <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-emerald-700 dark:text-emerald-400">Action</span>
        </div>
      </div>
    </section>
  );
}
