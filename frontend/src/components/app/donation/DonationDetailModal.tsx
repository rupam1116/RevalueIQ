"use client";

import React, { useState } from "react";
import { X, Star, MapPin, Clock, Globe, Mail, Phone, ShieldCheck, HeartHandshake, CheckCircle2, Sparkles, Navigation, Calendar, Award, MessageSquare, ExternalLink, ArrowRight, Building2 } from "lucide-react";
import { DonationCenter } from "@/lib/mockDonationData";
import { Button } from "@/components/ui/button";

interface DetailModalProps {
  center: DonationCenter | null;
  onClose: () => void;
  onDonateHere: (center: DonationCenter) => void;
}

export const DonationDetailModal: React.FC<DetailModalProps> = ({
  center,
  onClose,
  onDonateHere,
}) => {
  if (!center) return null;

  const [activeTab, setActiveTab] = useState<"about" | "campaigns" | "reviews">("about");
  const [selectedImage, setSelectedImage] = useState<string>(center.gallery[0] || center.logo);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in transition-all">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Top Header Banner matching Marketplace ProductDetailsModal */}
        <div className="relative h-44 sm:h-56 bg-slate-950 overflow-hidden shrink-0">
          <img
            src={selectedImage}
            alt={center.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0b1a13] via-transparent to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title Overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="flex items-center gap-4">
              <img
                src={center.logo}
                alt={center.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-emerald-500 bg-slate-950 object-cover shadow-xl shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3 inline mr-1" />
                    {center.verificationBadge}
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {center.category}
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">{center.name}</h2>
              </div>
            </div>

            <Button
              onClick={() => onDonateHere(center)}
              size="lg"
              className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm h-11 px-6 shadow-lg shadow-emerald-600/20 border-0 cursor-pointer shrink-0"
            >
              <HeartHandshake className="w-4 h-4 mr-2" /> Donate Now
            </Button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Navigation Tabs matching Marketplace modal sub-nav */}
          <div className="flex items-center gap-2 border-b border-emerald-100 dark:border-emerald-900/40 pb-3">
            <button
              onClick={() => setActiveTab("about")}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "about"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 dark:bg-emerald-950/50 text-slate-700 dark:text-slate-300 hover:bg-emerald-100"
              }`}
            >
              Overview & Mission
            </button>
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "campaigns"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 dark:bg-emerald-950/50 text-slate-700 dark:text-slate-300 hover:bg-emerald-100"
              }`}
            >
              Active Campaigns ({center.campaigns.length})
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "reviews"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 dark:bg-emerald-950/50 text-slate-700 dark:text-slate-300 hover:bg-emerald-100"
              }`}
            >
              Community Reviews ({center.reviews.length})
            </button>
          </div>

          {/* TAB 1: OVERVIEW & MISSION */}
          {activeTab === "about" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left 2 Cols */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 p-5 rounded-2xl space-y-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4" /> Mission Statement
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {center.fullMission}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Organization Overview</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{center.description}</p>
                  </div>

                  {/* Photo Gallery Thumbnails */}
                  {center.gallery.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Photo Gallery</h4>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {center.gallery.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt="Gallery preview"
                            onClick={() => setSelectedImage(img)}
                            className={`w-20 h-16 rounded-xl object-cover cursor-pointer border-2 transition-all shrink-0 ${
                              selectedImage === img ? "border-emerald-600 scale-105" : "border-emerald-100 dark:border-emerald-900 opacity-70 hover:opacity-100"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Accepted vs Required Devices Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-2xl space-y-2">
                      <h4 className="text-xs font-extrabold uppercase text-emerald-700 dark:text-emerald-400">Accepted Devices</h4>
                      <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                        {center.acceptedDevices.map((item, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-2xl space-y-2">
                      <h4 className="text-xs font-extrabold uppercase text-amber-500">Urgent Demand Requirements</h4>
                      <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                        {center.requiredDevices.map((item, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="font-bold">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar Column */}
                <div className="space-y-4">
                  {/* Impact Stats Card */}
                  <div className="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 p-5 rounded-2xl space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Impact Statistics</h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Devices Handled:</span>
                        <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{center.impactStats.devicesReceived.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Beneficiaries:</span>
                        <span className="font-extrabold text-teal-700 dark:text-teal-400">{center.impactStats.beneficiariesCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">CO₂ Avoided:</span>
                        <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{(center.impactStats.co2SavedKg / 1000).toFixed(1)} Tons</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info Card */}
                  <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-5 rounded-2xl space-y-3 text-xs">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Contact & Hours</h3>
                    <div className="space-y-2 text-slate-700 dark:text-slate-300">
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                        <a href={`tel:${center.phone}`} className="hover:underline font-bold">{center.phone}</a>
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                        <a href={`mailto:${center.email}`} className="hover:underline font-bold">{center.email}</a>
                      </p>
                      <p className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                        <a href={center.website} target="_blank" rel="noreferrer" className="hover:underline font-bold flex items-center gap-1">
                          {center.website} <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      </p>
                      <p className="flex items-start gap-2 pt-1">
                        <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span className="font-semibold">{center.hours}</span>
                      </p>
                    </div>
                  </div>

                  {/* Google Map Simulation Container */}
                  <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-2xl space-y-2 text-center">
                    <div className="w-full h-28 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl flex flex-col items-center justify-center p-3 border border-emerald-100 dark:border-emerald-900/50 space-y-1">
                      <MapPin className="w-6 h-6 text-emerald-600 animate-bounce" />
                      <p className="text-[11px] font-bold text-slate-900 dark:text-white">{center.address}</p>
                      <p className="text-[9px] text-slate-500">{center.city} ({center.distance} away)</p>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a href={`tel:${center.phone}`} className="w-full">
                        <Button size="sm" variant="outline" className="w-full rounded-xl text-xs font-bold border-emerald-200">
                          <Phone className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Call
                        </Button>
                      </a>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.googleMapQuery)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full"
                      >
                        <Button size="sm" className="w-full rounded-xl bg-emerald-600 text-white text-xs font-bold">
                          <Navigation className="w-3.5 h-3.5 mr-1" /> Directions
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE CAMPAIGNS */}
          {activeTab === "campaigns" && (
            <div className="space-y-4 animate-in fade-in">
              {center.campaigns.map((camp) => {
                const progressPct = Math.round((camp.currentQuantity / camp.targetQuantity) * 100);
                return (
                  <div key={camp.id} className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                          Active Drive
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">{camp.title}</h3>
                      </div>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" /> Deadline: {camp.deadline}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300">{camp.description}</p>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">Progress:</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{camp.currentQuantity} / {camp.targetQuantity} Devices ({progressPct}%)</span>
                      </div>
                      <div className="h-2 bg-emerald-50 dark:bg-emerald-950 rounded-full overflow-hidden border border-emerald-100">
                        <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex gap-1">
                        {camp.deviceTypesNeeded.map((dt, i) => (
                          <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-lg border border-emerald-100">
                            {dt}
                          </span>
                        ))}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => onDonateHere(center)}
                        className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-extrabold"
                      >
                        Contribute To Drive
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: USER REVIEWS */}
          {activeTab === "reviews" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-black text-amber-500">{center.rating}</div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(center.rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">{center.reviewCount} verified donor reviews</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {center.reviews.map((rev) => (
                  <div key={rev.id} className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> {rev.userName}
                      </span>
                      <span className="text-slate-400">{rev.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">"{rev.comment}"</p>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                      Donated: {rev.donatedDevice}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
