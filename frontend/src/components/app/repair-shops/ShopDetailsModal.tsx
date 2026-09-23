"use client";

import React, { useState } from "react";
import { RepairShop } from "@/types/repairShop";
import { X, Star, MapPin, Phone, Mail, Globe, Clock, ShieldCheck, Truck, Leaf, Sparkles, CheckCircle2, Wrench } from "lucide-react";

interface ShopDetailsModalProps {
  shop: RepairShop | null;
  onClose: () => void;
  onBookShop: (shop: RepairShop) => void;
}

export const ShopDetailsModal: React.FC<ShopDetailsModalProps> = ({
  shop,
  onClose,
  onBookShop,
}) => {
  const [activeTab, setActiveTab] = useState<"services" | "reviews" | "impact">("services");

  if (!shop) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0b1a13] border border-emerald-200 dark:border-emerald-900 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-0 relative my-8">
        {/* Header Hero Bar */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shrink-0 shadow-lg">
              {shop.logo}
            </div>
            <div className="space-y-1 pr-6">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-extrabold">{shop.name}</h2>
                {shop.verifiedPartner && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified Partner
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200">{shop.tagline}</p>
              <div className="flex items-center gap-3 text-xs text-emerald-100 pt-1 flex-wrap">
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> {shop.rating} ({shop.reviewCount} reviews)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> {shop.aiTrustScore}% AI Trust
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-300" /> {shop.circularContributionScore}/100 Eco Score
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Info Grid */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
          {/* Shop Contact & Info Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 text-xs text-slate-700 dark:text-slate-300">
            <div className="space-y-2">
              <p className="flex items-center gap-2 font-medium">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{shop.address}, {shop.city}, {shop.state} {shop.zipCode}</span>
              </p>
              <p className="flex items-center gap-2 font-medium">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{shop.phone}</span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex items-center gap-2 font-medium">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{shop.businessHours}</span>
              </p>
              <p className="flex items-center gap-2 font-medium">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{shop.pickupDetails}</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-emerald-100 dark:border-emerald-900/40 pb-2">
            <button
              onClick={() => setActiveTab("services")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "services"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Services & Pricing Menu ({shop.services.length})
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "reviews"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Customer Reviews ({shop.reviews.length})
            </button>
            <button
              onClick={() => setActiveTab("impact")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "impact"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Eco Impact Metrics
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "services" && (
            <div className="space-y-3">
              {shop.services.map((serv) => (
                <div
                  key={serv.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#09140e] border border-emerald-200/80 dark:border-emerald-900/60 flex items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{serv.name}</h4>
                      {serv.popular && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                          Most Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{serv.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-300 pt-1 font-medium">
                      <span>⏱️ Est. {serv.duration}</span>
                      <span>•</span>
                      <span>🛡️ {serv.warranty}</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">🌱 Saves {serv.ecoSavingsKg} kg E-waste</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">${serv.price}</div>
                    <button
                      onClick={() => {
                        onClose();
                        onBookShop(shop);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              {shop.reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#09140e] border border-emerald-100 dark:border-emerald-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center font-bold text-xs text-emerald-900 dark:text-emerald-100">
                        {rev.author[0]}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{rev.author}</h4>
                        <p className="text-[10px] text-slate-500">{rev.date} • {rev.device}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-amber-400 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {rev.rating}.0
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">"{rev.content}"</p>
                  {rev.shopResponse && (
                    <div className="p-3 rounded-xl bg-emerald-100/50 dark:bg-emerald-950/50 text-[11px] text-slate-700 dark:text-slate-300 border-l-2 border-emerald-500">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300">Shop Response ({rev.shopResponse.date}):</span> {rev.shopResponse.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "impact" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-1">
                <Leaf className="w-6 h-6 text-emerald-600 mx-auto" />
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{shop.environmentalMetrics.eWastePreventedKg} kg</div>
                <p className="text-xs text-slate-500">E-Waste Prevented</p>
              </div>

              <div className="p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 space-y-1">
                <Sparkles className="w-6 h-6 text-teal-600 mx-auto" />
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{shop.environmentalMetrics.co2EmissionsSavedKg} kg</div>
                <p className="text-xs text-slate-500">CO2 Emissions Saved</p>
              </div>

              <div className="p-5 rounded-2xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 space-y-1">
                <ShieldCheck className="w-6 h-6 text-green-600 mx-auto" />
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{shop.environmentalMetrics.preciousMetalsRecoveredGrams} g</div>
                <p className="text-xs text-slate-500">Gold & Copper Recovered</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-[#07130c] border-t border-emerald-100 dark:border-emerald-900/60 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500">Ready to book with {shop.name}?</div>
            <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Guaranteed Genuine Parts</div>
          </div>
          <button
            onClick={() => {
              onClose();
              onBookShop(shop);
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            Book Appointment Now
          </button>
        </div>
      </div>
    </div>
  );
};
