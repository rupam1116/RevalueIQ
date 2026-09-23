"use client";

import React from "react";
import { Smartphone, Laptop, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

interface ActivityItem {
  id: string;
  deviceName: string;
  category: string;
  aiGrade: string;
  estimatedValue: number;
  repairCost: number;
  date: string;
  timeGroup: "Today" | "Yesterday" | "Last Week";
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const groups: Array<"Today" | "Yesterday" | "Last Week"> = ["Today", "Yesterday", "Last Week"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-poppins font-bold text-lg text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" /> Recent Activity Timeline
        </h3>
        <span className="text-xs text-slate-400 font-medium">Real-time AI Log</span>
      </div>

      <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {groups.map((group) => {
          const items = activities.filter((a) => a.timeGroup === group);
          if (items.length === 0) return null;

          return (
            <div key={group} className="space-y-3 relative pl-8">
              {/* Timeline Group Dot */}
              <div className="absolute left-2.5 top-1 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-cyan-500 border-4 border-[#08111f] shadow-md shadow-cyan-500/50" />

              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {group}
              </h4>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-md group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                        {item.category.toLowerCase().includes("laptop") || item.deviceName.toLowerCase().includes("macbook") ? (
                          <Laptop className="w-5 h-5" />
                        ) : (
                          <Smartphone className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                            {item.deviceName}
                          </h5>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Grade {item.aiGrade}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Scanned on {item.date} • {item.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60 text-right">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Est. Value</span>
                        <span className="text-sm font-extrabold text-cyan-400">
                          ₹{item.estimatedValue.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Repair Cost</span>
                        <span className="text-xs font-semibold text-slate-300">
                          ₹{item.repairCost.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <a
                        href={`/dashboard/${item.id}`}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-400 transition-colors"
                        title="View Report"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
