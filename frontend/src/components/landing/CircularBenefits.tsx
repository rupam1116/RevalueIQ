"use client";

import { Recycle, ShieldAlert, RefreshCcw, Wrench, Globe2, CheckCircle2, Leaf } from "lucide-react";

const circularPillars = [
  {
    title: "Reduce E-Waste",
    tagline: "Prevent toxic heavy metals from entering soil and groundwater",
    description: "Electronics account for 70% of toxic waste in municipal landfills. RevalueIQ's AI lifespan tracking ensures functional hardware never gets discarded prematurely.",
    icon: ShieldAlert,
    color: "from-emerald-500 to-teal-500",
    metrics: "50M Tons E-Waste Preventable Globally",
  },
  {
    title: "Reuse Electronics",
    tagline: "Give working smartphones and laptops a second life",
    description: "Our certified secondary market benchmark establishes fair resale values, allowing pre-owned devices to circulate to new owners with 100% data sanitization.",
    icon: RefreshCcw,
    color: "from-teal-500 to-green-500",
    metrics: "+3.2 Years Extended Average Lifespan",
  },
  {
    title: "Repair Instead of Replace",
    tagline: "Empower micro-soldering and component-level repairs",
    description: "Fixing a broken screen or swapping a degraded lithium battery costs 80% less than buying new equipment while eliminating manufacturing carbon impact.",
    icon: Wrench,
    color: "from-green-500 to-emerald-600",
    metrics: "Up to ₹50,000 Saved Per Device",
  },
  {
    title: "Protect Environment",
    tagline: "Preserve rare earth elements & lower manufacturing carbon",
    description: "Manufacturing a single laptop consumes 1,200 kg of raw earth materials. Circular electronics preservation directly conserves global ecosystems.",
    icon: Globe2,
    color: "from-emerald-600 to-teal-600",
    metrics: "85% Mining Reduction Potential",
  },
];

export default function CircularBenefits() {
  return (
    <section id="about" className="py-24 sm:py-32 bg-slate-50 dark:bg-[#06140e] relative overflow-hidden border-t border-emerald-100 dark:border-emerald-900/40 transition-colors duration-300">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-emerald-500/5 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400">
            <Recycle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Environmental Impact
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            The 4 Pillars of the{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent">
              Circular Economy
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            By shifting from a linear &quot;take-make-dispose&quot; model to a circular ecosystem, RevalueIQ transforms electronics lifecycle management.
          </p>
        </div>

        {/* 4 Pillars Grid / Infographic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {circularPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-8 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all duration-300 shadow-sm hover:shadow-xl group hover:-translate-y-1 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                      {pillar.metrics}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-4">
                    {pillar.tagline}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-emerald-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Integrated into RevalueIQ Core Engine</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
