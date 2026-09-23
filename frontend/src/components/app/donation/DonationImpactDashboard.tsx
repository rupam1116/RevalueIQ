"use client";

import React from "react";
import { Leaf, Recycle, Building2, Users, ShieldCheck, Sparkles, TrendingUp, Award, ArrowUpRight } from "lucide-react";
import { DonationRecord } from "@/lib/mockDonationData";

interface ImpactDashboardProps {
  userDonations?: DonationRecord[];
  onViewCertificate?: (record: DonationRecord) => void;
  onDonateClick?: () => void;
}

export const DonationImpactDashboard: React.FC<ImpactDashboardProps> = ({
  userDonations = [],
  onViewCertificate,
  onDonateClick,
}) => {
  const userDevicesCount = userDonations.length;
  const userCo2Saved = userDonations.reduce((acc, curr) => acc + curr.estimatedCo2SavedKg, 0);

  return (
    <div className="space-y-6">
      {/* 4 Premium Impact Statistics Cards matching Marketplace EnvironmentalImpactCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Devices Donated */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50/40 dark:from-emerald-950/40 dark:via-[#0b1a13] dark:to-teal-950/30 border border-emerald-100/80 dark:border-emerald-900/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all duration-300" />
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Recycle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Active Impact
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Devices Donated</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              14,280<span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">+</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            <span>Diverted from e-waste landfills</span>
          </p>
        </div>

        {/* 2. Verified Organizations */}
        <div className="bg-gradient-to-br from-teal-50 via-white to-emerald-50/40 dark:from-teal-950/40 dark:via-[#0b1a13] dark:to-emerald-950/30 border border-teal-100/80 dark:border-teal-900/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl group-hover:bg-teal-500/10 transition-all duration-300" />
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/10 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-100/80 dark:bg-teal-950 px-2.5 py-0.5 rounded-full">
              100% Audited
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Verified Organizations</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              142
            </span>
            <span className="text-sm font-extrabold text-teal-700 dark:text-teal-400">Partners</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            <span>NGOs, schools, & recycling hubs</span>
          </p>
        </div>

        {/* 3. Communities & People Supported */}
        <div className="bg-gradient-to-br from-cyan-50 via-white to-emerald-50/40 dark:from-cyan-950/40 dark:via-[#0b1a13] dark:to-emerald-950/30 border border-cyan-100/80 dark:border-cyan-900/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-all duration-300" />
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/10 text-cyan-700 dark:text-cyan-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-100/80 dark:bg-cyan-950 px-2.5 py-0.5 rounded-full">
              Digital Labs
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Communities Benefited</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              32,500<span className="text-sm font-extrabold text-cyan-600 dark:text-cyan-400">+</span>
            </span>
            <span className="text-sm font-extrabold text-cyan-700 dark:text-cyan-400">People</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            <span>Across 98 rural school labs</span>
          </p>
        </div>

        {/* 4. Circular Platform Score */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 border border-emerald-500 rounded-2xl p-5 text-white shadow-md shadow-emerald-900/10 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold backdrop-blur-md">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-200" /> CO₂ Offset
            </span>
          </div>
          <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">CO₂ Emissions Avoided</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black tracking-tight">84.5</span>
            <span className="text-sm font-extrabold text-emerald-200">Tons CO₂e</span>
          </div>
          <div className="mt-3 w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-300 h-full rounded-full transition-all duration-500 w-[84%]" />
          </div>
        </div>
      </div>

      {/* User Verified Certificates Table matching Marketplace Dashboard card */}
      {userDonations.length > 0 && (
        <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Your Verified Donation Certificates ({userDonations.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Download and verify your official circular economy tax-deductible certificates.</p>
            </div>
            {onDonateClick && (
              <button
                onClick={onDonateClick}
                className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                + Donate Device
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userDonations.map((rec) => (
              <div
                key={rec.id}
                className="bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-300 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {rec.certificateId}
                    </span>
                    <span className="text-[10px] text-slate-400">{rec.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{rec.deviceName}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    Recipient: <span className="text-slate-800 dark:text-slate-200 font-semibold">{rec.organizationName}</span>
                  </p>
                </div>

                {onViewCertificate && (
                  <button
                    onClick={() => onViewCertificate(rec)}
                    className="shrink-0 px-3.5 py-2 rounded-xl bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Certificate</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
