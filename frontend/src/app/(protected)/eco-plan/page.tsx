"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { EcoPlanBillingSection } from "@/components/app/settings/EcoPlanBillingSection";
import { Zap, ArrowLeft } from "lucide-react";

export default function EcoPlanPage() {
  const router = useRouter();

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 dark:border-emerald-900/40 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
            <Zap className="w-3.5 h-3.5 fill-emerald-600 dark:fill-emerald-400" />
            <span>Circular Economy Membership & Quotas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            Eco Plan & Subscription Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Upgrade your circular AI capabilities, view real-time monthly appraisal quotas, and manage subscription receipts.
          </p>
        </div>

        <button
          onClick={() => router.push("/app")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer border border-slate-200 dark:border-slate-800 self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Back to Dashboard
        </button>
      </div>

      {/* Main Billing & Eco Plan Body */}
      <EcoPlanBillingSection />
    </div>
  );
}
