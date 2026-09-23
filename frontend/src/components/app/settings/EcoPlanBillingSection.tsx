"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  ShieldCheck,
  CreditCard,
  Download,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Crown,
  Leaf,
  Layers,
} from "lucide-react";
import {
  getCurrentSubscription,
  subscribeEcoPlanUpdate,
  UserSubscriptionResponse,
} from "@/lib/ecoPlanApi";
import { EcoPlanModal } from "../eco-plan/EcoPlanModal";

export const EcoPlanBillingSection: React.FC = () => {
  const [sub, setSub] = useState<UserSubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const loadSub = async () => {
    try {
      setLoading(true);
      const data = await getCurrentSubscription();
      setSub(data);
    } catch (err) {
      console.warn("Could not load subscription in settings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSub();
    // Real-time synchronization
    const unsubscribe = subscribeEcoPlanUpdate((updated) => {
      loadSub();
    });
    return () => unsubscribe();
  }, []);

  const tier = sub?.tier || "free";
  const tierName = sub?.tier_name || "Eco Starter";
  const isUnlimited = sub?.monthly_valuations_limit === -1;

  const formatDate = (dStr?: string) => {
    if (!dStr) return "Ongoing";
    try {
      return new Date(dStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-200 dark:border-emerald-900/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
                {tier === "enterprise" && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                {tier === "pro" && <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />}
                {tier === "free" && <Leaf className="w-3.5 h-3.5 text-emerald-600" />}
                {tierName}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 uppercase">
                {sub?.status || "Active"}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {tier === "free"
                ? "You are currently on the Eco Starter tier"
                : `Active Membership: ${tierName}`}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              {tier === "free"
                ? "Upgrade to Pro to unlock unlimited AI diagnostics, deep computer vision hardware inspection, and zero marketplace seller fees."
                : `Your subscription is active with ${sub?.billing_cycle} renewal. Enjoy prioritized AI processing and carbon verification certificates.`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setModalOpen(true)}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{tier === "free" ? "Upgrade Eco Plan" : "Manage / Switch Plan"}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quota & Limit Progress Bars */}
        <div className="mt-6 pt-6 border-t border-emerald-100 dark:border-emerald-900/40 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/80 dark:bg-[#071710] p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>Monthly AI Appraisals</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {isUnlimited ? "Unlimited" : `${sub?.monthly_valuations_used || 0} / 5`}
              </span>
            </div>
            <div className="mt-2 h-2 bg-emerald-100 dark:bg-emerald-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                style={{
                  width: isUnlimited
                    ? "100%"
                    : `${Math.min(100, ((sub?.monthly_valuations_used || 0) / 5) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-white/80 dark:bg-[#071710] p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>Eco Credits Multiplier</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {(sub?.eco_credits_multiplier ?? sub?.karma_multiplier ?? 1.0)}x Boost
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              Earn 2x Eco Credits on every device appraised, repaired, or listed.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-[#071710] p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>Next Renewal / Period</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatDate(sub?.expires_at)}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              {sub?.billing_cycle ? `Billed ${sub.billing_cycle}` : "Free tier"}
            </p>
          </div>
        </div>
      </div>

      {/* Invoices & Receipt History */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Subscription Invoices & Receipts</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Authoritative transaction receipts and verified proof of circular membership.
            </p>
          </div>
          <button
            onClick={loadSub}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            title="Refresh Invoices"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-xs text-slate-400">Loading invoices...</div>
        ) : sub?.recent_invoices && sub.recent_invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-100 dark:border-emerald-900/40 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 px-3">Invoice Number</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Amount</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50 dark:divide-emerald-950/40">
                {sub.recent_invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20">
                    <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                      {inv.order_id}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">
                      {formatDate(inv.paid_at)}
                    </td>
                    <td className="py-3.5 px-3 font-extrabold text-emerald-700 dark:text-emerald-300">
                      ₹{inv.amount_inr.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => alert(`Receipt downloaded for ${inv.order_id}`)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-emerald-50/40 dark:bg-[#071710] border border-emerald-100 dark:border-emerald-900/40 text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-50" />
            <p className="font-semibold">No paid subscription invoices yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              When you activate an Eco Pro or Enterprise plan, your formal invoices will be listed here.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <EcoPlanModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onPlanChanged={() => loadSub()}
      />
    </div>
  );
};
