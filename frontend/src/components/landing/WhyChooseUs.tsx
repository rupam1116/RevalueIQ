"use client";

import { Shield, Zap, Lock, HeartHandshake, Leaf } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "AI-Powered Eco Precision",
    description: "Our machine learning models deliver 99.2% accuracy on device condition grading and resale value prediction — faster and more reliable than manual appraisal.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Shield,
    title: "Trusted & Eco Verified",
    description: "Every marketplace listing is AI-verified. Every repair shop is vetted. Every donation center is certified. Trust is built into every interaction.",
    gradient: "from-teal-500 to-green-600",
  },
  {
    icon: Lock,
    title: "Enterprise-Grade Security",
    description: "SOC 2 compliant infrastructure with end-to-end encryption, secure authentication, and privacy-first design for both individuals and organizations.",
    gradient: "from-green-600 to-emerald-600",
  },
  {
    icon: HeartHandshake,
    title: "Measurable Environmental Impact",
    description: "Track your personal and organizational sustainability impact. Every device repaired, resold, or recycled contributes to measurable CO₂ reduction.",
    gradient: "from-emerald-600 to-teal-500",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 sm:py-32 bg-[#06140e] relative overflow-hidden border-t border-emerald-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="text-center mb-16 space-y-4 animate-in fade-in duration-500"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            Why RevalueIQ
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Built for the{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
              Future of Circular Tech
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium max-w-2xl mx-auto">
            Industry-leading technology combined with a mission-driven approach
            to create a truly sustainable electronics ecosystem.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <div
                key={i}
                className="p-6 sm:p-8 rounded-3xl bg-[#0b1a13] border border-emerald-900/50 hover:border-emerald-500/40 transition-all duration-300 shadow-xl group hover:scale-[1.01]"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300 text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{reason.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{reason.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
