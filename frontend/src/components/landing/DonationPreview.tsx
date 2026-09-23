"use client";

import Link from "next/link";
import { Heart, Recycle, ShieldCheck, ArrowRight, TreePine, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const impactStats = [
  {
    value: "120,000+",
    label: "Devices Recycled",
    detail: "Diverted from toxic landfills worldwide",
    icon: Recycle,
    color: "from-emerald-500 to-teal-500",
  },
  {
    value: "4.5M kg",
    label: "CO₂ Emissions Saved",
    detail: "Equivalent to planting 200,000 trees annually",
    icon: TreePine,
    color: "from-teal-500 to-green-500",
  },
  {
    value: "100+",
    label: "Donation Centers",
    detail: "Certified non-profit drop-off hubs in our network",
    icon: Building2,
    color: "from-green-500 to-emerald-600",
  },
];

const donationHubs = [
  {
    name: "Digital Inclusion Foundation",
    location: "Bangalore, KA",
    focus: "Laptops for K-12 Students",
    certified: "R2v3 Certified Recycler",
  },
  {
    name: "EcoTech Relief Network",
    location: "Mumbai, MH",
    focus: "Refurbished Phones for Non-Profits",
    certified: "e-Stewards Accredited",
  },
  {
    name: "Global E-Waste Alliance",
    location: "Hyderabad, TS",
    focus: "Rare Earth Metal Extraction",
    certified: "ISO 14001 Environmental Standard",
  },
];

export default function DonationPreview() {
  return (
    <section className="py-24 sm:py-32 bg-white dark:bg-[#06140e] relative overflow-hidden border-t border-emerald-100 dark:border-emerald-900/40 transition-colors duration-300">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/3 left-1/3 w-[850px] h-[550px] bg-emerald-500/5 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400">
              <Heart className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              E-Waste Reduction & Giving
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Turn Old Tech Into{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent">
                Social Good
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Don't throw old phones or laptops in the trash. Donate your end-of-life electronics to certified partners who refurbish tech for schools or safely extract heavy metals.
            </p>
          </div>

          <div>
            <Link href="/donation-centres">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl px-6 h-12 shadow-lg shadow-emerald-600/20">
                Donate Device
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 3 Impact Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {impactStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-8 rounded-2xl bg-slate-50 dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all duration-300 shadow-sm hover:shadow-xl group hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-1">{stat.value}</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-2">{stat.label}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{stat.detail}</p>
              </div>
            );
          })}
        </div>

        {/* Certified Hub Partners Banner */}
        <div className="rounded-2xl bg-slate-50 dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-8 shadow-sm">
          <h3 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6 text-center">
            Certified Recycling Partners & Drop-Off Centers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {donationHubs.map((hub) => (
              <div key={hub.name} className="p-4 rounded-xl bg-white dark:bg-slate-950/60 border border-emerald-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{hub.name}</span>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{hub.location}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{hub.focus}</p>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{hub.certified}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
