"use client";

import { Sparkles, Wrench, ShoppingBag, MapPin, Recycle, RefreshCw, ArrowUpRight, Leaf } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Device Valuation",
    description: "Upload device photos for instant AI optical inspection, cosmetic grading, hardware failure diagnostics, and real-time resale pricing.",
    gradient: "from-emerald-500 via-teal-500 to-green-600",
    badge: "Vision AI",
  },
  {
    icon: Wrench,
    title: "Repair Advisor",
    description: "Receive AI repair vs replace cost-benefit breakdowns, component replacement estimates, and DIY troubleshooting guides.",
    gradient: "from-teal-500 via-green-500 to-emerald-600",
    badge: "Smart Diagnostics",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description: "Buy and sell verified pre-owned electronics directly with escrow protection, price benchmarks, and quality certification.",
    gradient: "from-green-500 via-emerald-600 to-teal-600",
    badge: "Escrow Protection",
  },
  {
    icon: MapPin,
    title: "Repair Shops",
    description: "Discover nearby certified repair service centers filtered by technician skill rating, parts inventory, and warranty guarantees.",
    gradient: "from-emerald-600 via-teal-600 to-green-500",
    badge: "Live Network",
  },
  {
    icon: Recycle,
    title: "Donation Centers",
    description: "Locate certified non-profit drop-off hubs to donate legacy tech, bridging the digital divide while securing tax-deductible receipts.",
    gradient: "from-teal-600 via-green-600 to-emerald-500",
    badge: "Tax Deductible",
  },
  {
    icon: RefreshCw,
    title: "Circular Economy",
    description: "Track your personal circular economy footprint including CO₂ emissions offset, heavy metals diverted, and lifetime tech sustainability score.",
    gradient: "from-green-600 via-emerald-500 to-teal-500",
    badge: "Eco Tracking",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-slate-50 dark:bg-[#06140e] relative overflow-hidden transition-colors duration-300 border-t border-emerald-100 dark:border-emerald-900/40">
      {/* Glow gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-500/5 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400">
            <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Everything you need for{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent">
              sustainable electronics
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            RevalueIQ combines multi-modal AI with nationwide repair and recycling networks to maximize device lifespan and minimize electronic waste.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-8 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between hover:-translate-y-1.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg shadow-emerald-500/10 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-medium font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/50 px-2.5 py-1 rounded-full">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-emerald-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <span>Learn more</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
