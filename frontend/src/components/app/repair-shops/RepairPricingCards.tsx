"use client";

import React from "react";
import { COMMON_REPAIR_CATALOG } from "@/lib/mockRepairShopData";
import { Wrench, Clock, ShieldCheck, Leaf, ArrowRight, Zap } from "lucide-react";

interface RepairPricingCardsProps {
  onSelectService: (serviceName: string) => void;
}

export const RepairPricingCards: React.FC<RepairPricingCardsProps> = ({
  onSelectService,
}) => {
  return (
    <div className="bg-white dark:bg-[#0b1a13] border border-emerald-200/80 dark:border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-100 dark:border-emerald-900/40">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 mb-1">
            <Zap className="w-3.5 h-3.5 text-emerald-600" /> Transparent Service Pricing Catalog
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Compare Standard Repair Rates
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Upfront pricing guidelines backed by eco-certified repair shop warranties.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {COMMON_REPAIR_CATALOG.map((service) => (
          <div
            key={service.id}
            className="group p-5 rounded-2xl bg-emerald-50/40 dark:bg-[#09140e] border border-emerald-200/80 dark:border-emerald-900/60 hover:border-emerald-400 dark:hover:border-emerald-700 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-2xs"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                  {service.category}
                </span>
                {service.popular && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold">
                    Popular
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {service.name}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {service.description}
              </p>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-emerald-100 dark:border-emerald-900/40">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Duration: <strong>{service.duration}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Warranty: <strong>{service.warranty}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Leaf className="w-3.5 h-3.5" />
                  <span>E-Waste Saved: <strong>{service.ecoSavingsKg} kg</strong></span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-medium">Starting at</span>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white">${service.price}</div>
              </div>
              <button
                onClick={() => onSelectService(service.name)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Book This</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
