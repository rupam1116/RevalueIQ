"use client";

import { Cpu, Wrench, HeartHandshake, ShieldCheck } from "lucide-react";

const stats = [
  {
    value: "50,000+",
    label: "Devices Valued",
    description: "Evaluated with sub-millimeter visual AI condition inspection",
    icon: Cpu,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    value: "500+",
    label: "Repair Partners",
    description: "Certified technicians and micro-soldering service centers",
    icon: Wrench,
    gradient: "from-teal-500 to-green-500",
  },
  {
    value: "100+",
    label: "Donation Centers",
    description: "Non-profit hubs redistributing devices to underserved schools",
    icon: HeartHandshake,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    value: "99%",
    label: "AI Accuracy",
    description: "Precision condition grading verified by hardware engineers",
    icon: ShieldCheck,
    gradient: "from-teal-600 to-emerald-500",
  },
];

export default function Statistics() {
  return (
    <section className="relative py-16 bg-white dark:bg-[#06140e] border-y border-emerald-100 dark:border-emerald-900/50 overflow-hidden transition-colors duration-300">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[300px] bg-emerald-500/5 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="relative p-6 sm:p-8 rounded-2xl bg-emerald-50/50 dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-xl group hover:-translate-y-1 shadow-sm hover:shadow-md"
              >
                {/* Glowing top border accent */}
                <div className={`absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r ${stat.gradient} opacity-40 group-hover:opacity-100 transition-opacity duration-300 rounded-full`} />

                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase">
                    METRIC #0{i + 1}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {stat.label}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
