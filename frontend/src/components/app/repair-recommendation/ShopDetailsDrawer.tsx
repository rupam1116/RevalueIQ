"use client";

import React, { useState } from "react";
import { RepairCenterItem } from "@/types/repairCenter";
import {
  X,
  Star,
  MapPin,
  Phone,
  Globe,
  Clock,
  ShieldCheck,
  Navigation,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Wrench,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShopDetailsDrawerProps {
  center: RepairCenterItem | null;
  onClose: () => void;
}

export const ShopDetailsDrawer: React.FC<ShopDetailsDrawerProps> = ({
  center,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "services" | "brands">("overview");

  if (!center) return null;

  const phoneDigits = center.phone ? center.phone.replace(/[^0-9]/g, "") : "";
  const isIndianMobile =
    phoneDigits.length >= 10 &&
    (phoneDigits.startsWith("91") ||
      phoneDigits.startsWith("98") ||
      phoneDigits.startsWith("99") ||
      phoneDigits.startsWith("9") ||
      phoneDigits.startsWith("8") ||
      phoneDigits.startsWith("7") ||
      phoneDigits.startsWith("6"));
  const whatsappUrl = phoneDigits
    ? `https://wa.me/${phoneDigits.startsWith("91") ? phoneDigits : `91${phoneDigits}`}`
    : null;

  const isOsm = center.provider === "osm" || !center.google_place_id;
  const directionsUrl = isOsm
    ? `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=%3B${center.latitude}%2C${center.longitude}`
    : `https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}&destination_place_id=${center.google_place_id || ""}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      {/* 500px Right Side Slide Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-50">
        <div className="w-screen max-w-md sm:max-w-[500px] bg-white dark:bg-[#0b1a13] border-l border-emerald-100 dark:border-emerald-900/50 text-slate-900 dark:text-white shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out animate-in slide-in-from-right">
          
          {/* Header Bar */}
          <div className="p-4 sm:p-5 bg-white dark:bg-[#0b1a13] border-b border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-xl shrink-0">
                {center.logo || "🏢"}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm line-clamp-1">{center.name}</h3>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {center.city || "Verified Location"} {center.distance_km !== null && center.distance_km !== undefined ? `• ${center.distance_km} km away` : ""}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
            {/* Store Hero Image / Banner */}
            <div className="relative h-48 w-full rounded-3xl bg-emerald-950 overflow-hidden border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
              <img
                src={center.hero_image || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"}
                alt={center.name}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-900/90 text-emerald-300 font-extrabold text-[10px] backdrop-blur-md border border-emerald-700/60 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{center.is_authorized ? "Official OEM Authorized Center" : isOsm ? "OpenStreetMap Verified Business" : "Google Places Verified Business"}</span>
              </div>

              <div className="absolute bottom-3 left-3 bg-slate-950/85 text-emerald-300 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border border-emerald-800/60 shadow-md">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{center.rating} ({center.review_count} reviews)</span>
              </div>
            </div>

            {/* Direct Quick Action Strip */}
            <div className={`grid ${center.phone && whatsappUrl ? "grid-cols-3" : center.phone ? "grid-cols-2" : "grid-cols-1"} gap-2.5`}>
              {center.phone ? (
                <a
                  href={`tel:${center.phone}`}
                  className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-slate-800 dark:text-slate-100 font-bold text-xs flex flex-col items-center gap-1.5 border border-emerald-100 dark:border-emerald-900/50 transition-all text-center shadow-xs"
                >
                  <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Call Business</span>
                </a>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 font-bold text-xs flex flex-col items-center gap-1.5 border border-slate-200 dark:border-slate-800 text-center">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>Phone Unavailable</span>
                </div>
              )}

              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-slate-800 dark:text-slate-100 font-bold text-xs flex flex-col items-center gap-1.5 border border-emerald-100 dark:border-emerald-900/50 transition-all text-center shadow-xs"
              >
                <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Directions</span>
              </a>

              {center.phone && whatsappUrl && isIndianMobile && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-slate-800 dark:text-slate-100 font-bold text-xs flex flex-col items-center gap-1.5 border border-emerald-100 dark:border-emerald-900/50 transition-all text-center shadow-xs"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>

            {/* Recommendation Reason Banner if present */}
            {center.recommendation_reason && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{center.recommendation_reason}</span>
              </div>
            )}

            {/* Navigation Sub-Tabs */}
            <div className="flex items-center gap-1.5 border-b border-emerald-100 dark:border-emerald-900/50 pb-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("services")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "services"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                }`}
              >
                Services ({center.repair_services.length})
              </button>
              <button
                onClick={() => setActiveTab("brands")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "brands"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                }`}
              >
                Supported Brands ({center.brand_services.length})
              </button>
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" /> Verified Address
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                    {center.address}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" /> Operating Status
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 pl-6">{center.opening_hours || "Operating hours standard"}</p>
                </div>

                {center.phone && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white">
                      <Phone className="w-4 h-4 text-emerald-600 shrink-0" /> Contact Phone
                    </div>
                    <p className="text-emerald-700 dark:text-emerald-400 font-extrabold pl-6">{center.phone}</p>
                  </div>
                )}

                {center.website && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white">
                      <Globe className="w-4 h-4 text-emerald-600 shrink-0" /> Official Website
                    </div>
                    <a
                      href={center.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 underline font-semibold pl-6 block truncate"
                    >
                      {center.website}
                    </a>
                  </div>
                )}

                {center.google_maps_url && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white">
                      <ExternalLink className="w-4 h-4 text-emerald-600 shrink-0" /> Map Listing
                    </div>
                    <a
                      href={center.google_maps_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 underline font-semibold pl-6 block truncate"
                    >
                      View Map Details
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* SERVICES TAB */}
            {activeTab === "services" && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Service Capabilities</h4>
                <div className="grid grid-cols-1 gap-2">
                  {center.repair_services.map((service, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BRANDS TAB */}
            {activeTab === "brands" && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Supported Brands & Devices</h4>
                <div className="flex flex-wrap gap-2">
                  {center.brand_services.map((brand, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200 font-bold text-xs"
                    >
                      {brand}
                    </span>
                  ))}
                </div>

                <div className="pt-3 space-y-2">
                  <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Device Categories</h5>
                  <div className="flex flex-wrap gap-2">
                    {center.device_categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer CTA */}
          <div className="p-4 sm:p-5 bg-white dark:bg-[#0b1a13] border-t border-emerald-100 dark:border-emerald-900/50 sticky bottom-0 z-20 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Direct Navigation</div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">{center.city || "Destination"}</div>
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-10 px-6 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
