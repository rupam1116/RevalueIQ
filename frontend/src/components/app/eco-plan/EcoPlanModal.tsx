"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Zap,
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
  Leaf,
  Layers,
  Crown,
  CheckCircle2,
  Loader2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import {
  getEcoPlans,
  getCurrentSubscription,
  activateEcoPlan,
  cancelEcoPlan,
  EcoPlanDetail,
  UserSubscriptionResponse,
} from "@/lib/ecoPlanApi";

interface EcoPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanChanged?: (newTier: string) => void;
}

export const EcoPlanModal: React.FC<EcoPlanModalProps> = ({
  isOpen,
  onClose,
  onPlanChanged,
}) => {
  const [plans, setPlans] = useState<EcoPlanDetail[]>([]);
  const [currentSub, setCurrentSub] = useState<UserSubscriptionResponse | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<boolean>(true);
  const [upgradingTier, setUpgradingTier] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load plans and current status
  const loadData = async () => {
    try {
      setLoading(true);
      const [plansData, currentData] = await Promise.all([
        getEcoPlans(),
        getCurrentSubscription().catch(() => null),
      ]);
      setPlans(plansData);
      if (currentData) {
        setCurrentSub(currentData);
        setBillingCycle(currentData.billing_cycle || "monthly");
      }
    } catch (err) {
      console.warn("Failed to load eco plan modal data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  }, [isOpen]);

  // Handle instant demo activation
  const handleActivatePlan = async (tier: "free" | "pro" | "enterprise") => {
    try {
      setUpgradingTier(tier);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Simulate a realistic ultra-fast activation flow for presentation
      await new Promise((r) => setTimeout(r, 600));

      const res = await activateEcoPlan(tier, billingCycle);

      setSuccessMessage(`🎉 Successfully switched to ${res.tier_name}!`);
      setCurrentSub((prev) =>
        prev
          ? {
              ...prev,
              tier: res.tier,
              tier_name: res.tier_name,
              billing_cycle: res.billing_cycle as "monthly" | "yearly",
              is_pro_or_higher: res.tier !== "free",
              is_enterprise: res.tier === "enterprise",
              monthly_valuations_limit: res.tier === "free" ? 5 : -1,
            }
          : null
      );

      if (onPlanChanged) {
        onPlanChanged(res.tier);
      }

      // Hide success notification after 4 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to switch plan. Please try again.");
    } finally {
      setUpgradingTier(null);
    }
  };

  if (!isOpen) return null;

  const currentTier = currentSub?.tier || "free";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#08150f] border border-emerald-200/80 dark:border-emerald-900/60 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative px-6 sm:px-8 pt-7 pb-5 border-b border-emerald-100 dark:border-emerald-900/40 flex items-start justify-between bg-gradient-to-b from-emerald-50/70 to-transparent dark:from-[#0b1d14] shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Circular Membership & Eco Plans
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Instant Tier Activation
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Upgrade Your Sustainability & AI Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Unlock unlimited AI appraisals, computer vision hardware wear inspection, zero marketplace fees, and corporate ESG impact certificates.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Billing Cycle Switcher */}
        <div className="px-6 sm:px-8 py-3.5 bg-emerald-50/40 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Active Tier:
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white capitalize px-2 py-0.5 rounded-md bg-white dark:bg-[#0e2319] border border-emerald-200 dark:border-emerald-800">
              {currentSub?.tier_name || "Eco Starter"}
            </span>
            {currentSub && currentSub.monthly_valuations_limit > 0 ? (
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                ({currentSub.monthly_valuations_used} / {currentSub.monthly_valuations_limit} Appraisals used this month)
              </span>
            ) : (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                (Unlimited AI Appraisals)
              </span>
            )}
          </div>

          {/* Monthly / Yearly Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-emerald-100/70 dark:bg-[#071710] border border-emerald-200 dark:border-emerald-900/60">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-emerald-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                billingCycle === "yearly"
                  ? "bg-white dark:bg-emerald-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>Annual</span>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-600 dark:bg-emerald-900 text-white uppercase tracking-wider">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {successMessage && (
          <div className="mx-6 sm:mx-8 mt-4 p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mx-6 sm:mx-8 mt-4 p-3 rounded-xl bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-700 text-red-900 dark:text-red-200 flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top duration-200">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Cards Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              <p className="text-xs font-bold text-slate-500">Loading plan specifications...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isCurrent = currentTier === plan.id;
                const isUpgrading = upgradingTier === plan.id;
                const price =
                  billingCycle === "yearly"
                    ? Math.round(plan.price_yearly_inr / 12)
                    : plan.price_monthly_inr;

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 border ${
                      plan.popular
                        ? "bg-gradient-to-b from-emerald-500/[0.08] to-teal-500/[0.02] dark:from-emerald-950/40 dark:to-[#091a12] border-emerald-500 dark:border-emerald-500/80 shadow-xl shadow-emerald-500/10 scale-[1.02]"
                        : "bg-slate-50/80 dark:bg-[#0a1c14]/60 border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-800"
                    }`}
                  >
                    {/* Top Badges */}
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 fill-white" /> Recommended
                        </span>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Title & Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                          {plan.id === "free" && <Leaf className="w-4 h-4 text-emerald-600" />}
                          {plan.id === "pro" && <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />}
                          {plan.id === "enterprise" && <Crown className="w-4 h-4 text-amber-500" />}
                          {plan.name}
                        </span>
                        {plan.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {plan.badge}
                          </span>
                        )}
                      </div>

                      {/* Tagline */}
                      <p className="text-xs text-slate-600 dark:text-slate-400 min-h-[32px] leading-relaxed">
                        {plan.tagline}
                      </p>

                      {/* Price */}
                      <div className="pt-2 border-t border-emerald-100 dark:border-emerald-900/40">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-slate-900 dark:text-white">
                            {plan.id === "free" ? "Free" : `₹${price.toLocaleString()}`}
                          </span>
                          {plan.id !== "free" && (
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                              / month
                            </span>
                          )}
                        </div>
                        {plan.id !== "free" && billingCycle === "yearly" && (
                          <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                            Billed annually (₹{plan.price_yearly_inr.toLocaleString()} / year)
                          </p>
                        )}
                      </div>

                      {/* Feature Checklist */}
                      <div className="space-y-2.5 pt-3">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Included Circular Perks:
                        </p>
                        <ul className="space-y-2 text-xs">
                          {plan.features.map((feat, idx) => (
                            <li
                              key={idx}
                              className={`flex items-start gap-2.5 leading-snug ${
                                feat.included
                                  ? "text-slate-800 dark:text-slate-200 font-medium"
                                  : "text-slate-400 dark:text-slate-600 line-through"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full mt-0.5 shrink-0 flex items-center justify-center ${
                                  feat.included
                                    ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                                    : "bg-slate-100 dark:bg-slate-900 text-slate-400"
                                }`}
                              >
                                {feat.included ? (
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                ) : (
                                  <X className="w-2.5 h-2.5 stroke-[2]" />
                                )}
                              </div>
                              <span className="flex-1">
                                {feat.title}
                                {feat.badge && (
                                  <span className="ml-1.5 px-1.5 py-0.2 rounded bg-emerald-600 text-white font-extrabold text-[9px]">
                                    {feat.badge}
                                  </span>
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-6 mt-4 border-t border-emerald-100 dark:border-emerald-900/40">
                      {isCurrent ? (
                        <button
                          disabled
                          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center gap-2 cursor-default"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Current Active Plan</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivatePlan(plan.id)}
                          disabled={isUpgrading}
                          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer ${
                            plan.popular
                              ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/25 hover:scale-[1.02]"
                              : plan.id === "enterprise"
                              ? "bg-gradient-to-r from-teal-700 to-slate-900 dark:from-emerald-800 dark:to-slate-800 text-white hover:brightness-110"
                              : "bg-white dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-slate-900 dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/40"
                          }`}
                        >
                          {isUpgrading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Activating Plan...</span>
                            </>
                          ) : (
                            <>
                              <span>
                                {plan.id === "free"
                                  ? "Switch to Eco Starter"
                                  : plan.id === "pro"
                                  ? "Upgrade to Eco Pro"
                                  : "Upgrade to Enterprise"}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Guarantee Notice */}
        <div className="px-6 sm:px-8 py-3.5 border-t border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/60 dark:bg-[#071710] flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Verified Circular Membership:</strong> Instant tier activation with immediate quota unlock. Cancel or switch plans anytime.
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
