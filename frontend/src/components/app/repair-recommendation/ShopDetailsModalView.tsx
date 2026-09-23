"use client";

import React, { useState } from "react";
import { AuthorizedRepairCenter } from "@/types/repairRecommendation";
import { X, Star, MapPin, Phone, Globe, Clock, ShieldCheck, Truck, Car, Bus, Train, CheckCircle2, Wrench, Sparkles, AlertCircle, ThumbsUp } from "lucide-react";
import { AIReviewSummaryCard } from "./AIReviewSummaryCard";
import { CustomerReviewsSection } from "./CustomerReviewsSection";

interface ShopDetailsModalViewProps {
  center: AuthorizedRepairCenter | null;
  onClose: () => void;
  onBookCenter: (center: AuthorizedRepairCenter) => void;
}

export const ShopDetailsModalView: React.FC<ShopDetailsModalViewProps> = ({
  center,
  onClose,
  onBookCenter,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "pricing" | "reviews" | "perks">("overview");

  if (!center) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl space-y-0 relative my-6">
        {/* Top Hero Banner & Photo Preview */}
        <div className="relative h-48 sm:h-64 w-full bg-slate-950 overflow-hidden">
          <img
            src={center.heroImage}
            alt={center.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white transition-colors cursor-pointer border border-slate-800 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Overlay Content */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center text-3xl shrink-0 shadow-xl">
                {center.logo}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">{center.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                    {center.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{center.address}</span>
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-300" /> {center.rating} ({center.reviewCount})
              </span>
            </div>
          </div>
        </div>

        {/* Modal Navigation Bar */}
        <div className="bg-slate-950/80 p-3 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "overview" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Store Overview & Info
          </button>

          <button
            onClick={() => setActiveTab("pricing")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "pricing" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Repair Charges Catalog ({center.repairCharges.length})
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "reviews" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            AI Review Summary & Feedback
          </button>

          <button
            onClick={() => setActiveTab("perks")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "perks" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Amenities & Transit Access
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-thin">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Business Hours</span>
                  <p className="font-bold text-white flex items-center gap-1.5 pt-0.5">
                    <Clock className="w-4 h-4 text-emerald-400" /> {center.workingHoursText}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Est. Waiting Time</span>
                  <p className="font-bold text-white flex items-center gap-1.5 pt-0.5">
                    <Wrench className="w-4 h-4 text-teal-400" /> {center.waitingTime}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Contact Number</span>
                  <p className="font-bold text-emerald-400 flex items-center gap-1.5 pt-0.5">
                    <Phone className="w-4 h-4 text-emerald-400" /> {center.phone}
                  </p>
                </div>
              </div>

              {/* Certification & Brands */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Technician Certifications & Brands Supported
                </h4>

                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <span>Certification:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {center.certificationName}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-bold text-slate-400">Supported Devices & Brands:</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {center.brandsSupported.map((b) => (
                      <span key={b} className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Photo Carousel Preview */}
              {center.photos.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Store Photo Gallery</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {center.photos.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="Store interior"
                        className="w-full h-24 rounded-xl object-cover border border-slate-800"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PRICING TAB */}
          {activeTab === "pricing" && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Transparent Repair Charges & Warranties</h4>
              {center.repairCharges.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-white">{item.service}</h5>
                    <p className="text-xs text-emerald-400 font-medium">🛡️ Warranty Coverage: {item.warranty}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-lg font-extrabold text-white">₹{item.priceINR.toLocaleString("en-IN")}</div>
                    <span className="text-[10px] text-slate-400">Zero Hidden Diagnostic Charges</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <AIReviewSummaryCard summary={center.aiReviewSummary} />
              <CustomerReviewsSection reviews={center.reviews} />
            </div>
          )}

          {/* PERKS TAB */}
          {activeTab === "perks" && (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Truck className="w-4 h-4 text-emerald-400" /> Doorstep Pickup & Van
                  </div>
                  <p className="text-slate-400">{center.perks.pickupService ? "Available within 10 km radius" : "In-store Service Only"}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Car className="w-4 h-4 text-teal-400" /> Parking Availability
                  </div>
                  <p className="text-slate-400">{center.perks.parkingAvailable ? "Free Visitor Parking Spot Available" : "Public Parking Nearby"}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Train className="w-4 h-4 text-cyan-400" /> Nearby Metro Station
                  </div>
                  <p className="text-slate-400">{center.perks.nearbyMetro}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Bus className="w-4 h-4 text-emerald-400" /> Nearby Bus Stop
                  </div>
                  <p className="text-slate-400">{center.perks.nearbyBusStop}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400">Selected Store:</div>
            <div className="text-sm font-bold text-white line-clamp-1">{center.name}</div>
          </div>
          <button
            onClick={() => {
              onClose();
              onBookCenter(center);
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl transition-all cursor-pointer"
          >
            Book Appointment Now
          </button>
        </div>
      </div>
    </div>
  );
};
