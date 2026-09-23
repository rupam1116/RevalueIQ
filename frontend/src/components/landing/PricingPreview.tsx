"use client";

import { Check, ArrowRight, Leaf } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Eco Individual",
    price: "₹0",
    period: "forever free",
    description: "Perfect for individuals getting started with circular device valuation & repair.",
    features: [
      "5 AI valuations per month",
      "Basic condition grading",
      "Marketplace browsing",
      "Repair shop locator",
      "Eco impact tracking",
    ],
    cta: "Get Started Free",
    href: "/signup",
    featured: false,
  },
  {
    name: "Circular Pro",
    price: "₹1,499",
    period: "per month",
    description: "For power users & repair shops who need unlimited scans & full reports.",
    features: [
      "Unlimited AI valuations",
      "Advanced condition reports",
      "Priority marketplace listing",
      "Repair cost estimator",
      "Full sustainability dashboard",
      "Export PDF reports & certificates",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=pro",
    featured: true,
  },
  {
    name: "Enterprise Fleet",
    price: "Custom",
    period: "contact sales",
    description: "For organizations managing large corporate device fleets & e-waste compliance.",
    features: [
      "Everything in Pro",
      "Bulk device processing & batch OCR",
      "Enterprise API access",
      "Custom integrations & webhooks",
      "Dedicated account manager",
      "SLA guarantee & ESG audit reports",
      "SSO & team permission roles",
      "Custom AI model tuning",
    ],
    cta: "Contact Enterprise Sales",
    href: "/contact",
    featured: false,
  },
];

export default function PricingPreview() {
  return (
    <section id="pricing" className="py-24 sm:py-32 bg-[#06140e] relative overflow-hidden border-t border-emerald-900/40">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-emerald-600/5 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div
          className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-in fade-in duration-500"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Plans for Individuals &{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
              Enterprise Fleets
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
            Start for free as a consumer or upgrade to unlock unlimited AI diagnostics and API access.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-8 rounded-3xl border transition-all duration-300 shadow-xl flex flex-col justify-between relative ${
                plan.featured
                  ? "bg-[#0b1a13] border-emerald-500 shadow-emerald-500/10 scale-[1.03] z-10"
                  : "bg-[#0b1a13]/70 border-emerald-900/50 hover:border-emerald-700"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 text-white uppercase tracking-wider shadow-md">
                  Most Popular Eco Plan
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-white">{plan.price}</span>
                  <span className="text-xs text-slate-400 font-semibold">/ {plan.period}</span>
                </div>

                <ul className="space-y-3 pt-4 border-t border-emerald-900/40 text-xs text-slate-300 font-medium">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link href={plan.href} className="w-full">
                  <Button
                    size="lg"
                    className={`w-full rounded-2xl font-extrabold text-xs h-12 ${
                      plan.featured
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/20 border-0"
                        : "bg-emerald-950/80 text-slate-200 hover:bg-emerald-900/80 border border-emerald-800"
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
