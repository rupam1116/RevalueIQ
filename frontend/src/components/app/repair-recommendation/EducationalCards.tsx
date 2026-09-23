"use client";

import React from "react";
import { ShieldCheck, Award, TrendingUp, Leaf, ArrowRight } from "lucide-react";

export const EducationalCards: React.FC = () => {
  const KNOWLEDGE_ITEMS = [
    {
      icon: ShieldCheck,
      title: "Why Authorized Centers",
      description: "Uses 100% genuine factory OEM parts, preserving display TrueTone calibration, water resistance seals, and manufacturer warranties.",
    },
    {
      icon: Award,
      title: "1-Year Certified Warranty",
      description: "Every repair booked via RevalueIQ includes a mandatory 180-Day to 1-Year replacement warranty on all replaced components and labor.",
    },
    {
      icon: TrendingUp,
      title: "Repair vs Replace Guide",
      description: "If repair costs under 50% of market value, repairing maximizes financial return and retains device resale liquidity.",
    },
    {
      icon: Leaf,
      title: "Environmental Impact",
      description: "Repairing your device diverts e-waste from landfills and saves over 12 kg of CO2 emissions compared to manufacturing a new phone.",
    },
  ];

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h2 className="text-lg font-extrabold text-white">Repair Knowledge & Circular Insights</h2>
        <span className="text-xs font-semibold text-[#94A3B8]">Compact Feature Guides</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {KNOWLEDGE_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-[#162433] border border-white/[0.06] hover:border-[#00D084]/40 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-[2px] transition-all duration-200 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#101C28] border border-white/[0.08] flex items-center justify-center text-[#00D084]">
                  <Icon className="w-5 h-5 text-[#00D084]" />
                </div>
                <h3 className="font-extrabold text-white text-xs leading-snug">{item.title}</h3>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed font-normal">{item.description}</p>
              </div>

              <button
                onClick={() => alert(`Opening ${item.title} policy`)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00D084] hover:underline pt-1 cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
