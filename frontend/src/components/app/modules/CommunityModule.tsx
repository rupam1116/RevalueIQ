"use client";

import React from "react";
import { Users, Sparkles, Clock, Wrench, ShieldCheck, ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommunityModuleProps {
  onNavigateTab?: (tabId: string) => void;
}

export const CommunityModule: React.FC<CommunityModuleProps> = ({ onNavigateTab }) => {
  const handleNavigate = (tabId: string) => {
    if (onNavigateTab) {
      onNavigateTab(tabId);
    }
  };

  const upcomingHighlights = [
    {
      icon: Wrench,
      title: "Repair Knowledge Sharing",
      description: "Access and contribute to community-verified DIY repair guides, teardowns, and maintenance playbooks.",
    },
    {
      icon: Users,
      title: "Connect with Repair Experts",
      description: "Direct discussions and Q&A with certified technicians, refurbishers, and sustainability specialists.",
    },
    {
      icon: ShieldCheck,
      title: "Circular Economy Discussions",
      description: "Participate in local e-waste reduction initiatives, recycling drives, and circular-impact challenges.",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Breadcrumb Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-100 dark:border-emerald-900/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Eco Community
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              RevalueIQ Circular Ecosystem & Collaborative Network
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNavigate("dashboard")}
            className="rounded-xl border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-xs font-semibold"
          >
            <LayoutDashboard className="w-3.5 h-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Main Hero Card - Coming Soon */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-50/60 via-white to-white dark:from-[#0b1a13] dark:via-[#06140e] dark:to-[#06140e] border border-emerald-200/80 dark:border-emerald-900/60 p-8 sm:p-14 text-center shadow-sm">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold tracking-wide uppercase shadow-xs">
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>Coming Soon</span>
          </div>

          {/* Central Icon */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 p-0.5 shadow-xl shadow-emerald-600/20 flex items-center justify-center">
            <div className="w-full h-full rounded-[22px] bg-white dark:bg-[#06140e] flex items-center justify-center">
              <Users className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Eco Community
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Connect with repair experts, share repair knowledge, and participate in circular-economy discussions in a future update.
            </p>
          </div>

          {/* Info note */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            <p className="flex items-center justify-center gap-2 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                The Eco Community module is planned for a future phase of RevalueIQ. In the meantime, explore our active AI Valuation, Repair Advisor, and Donation Hub.
              </span>
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => handleNavigate("valuation")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-5 py-2.5 font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Explore AI Valuation</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNavigate("repair")}
              className="rounded-xl border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-xs font-bold"
            >
              <span>View Repair Advisor</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Planned Feature Highlights (Preview / What's Coming) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
              Planned Highlights for Future Release
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              A preview of what we are building for the upcoming Eco Community update
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingHighlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 space-y-3 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
