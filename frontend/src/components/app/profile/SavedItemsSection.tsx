"use client";

import React, { useState } from "react";
import {
  SavedMarketplaceItem,
  SavedRepairCenter,
  SavedDonationOrg,
} from "@/lib/mockProfileData";
import {
  Bookmark,
  ShoppingBag,
  Wrench,
  Heart,
  Trash2,
  ExternalLink,
  Star,
  MapPin,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

interface SavedItemsSectionProps {
  marketplaceItems: SavedMarketplaceItem[];
  repairCenters: SavedRepairCenter[];
  donationOrgs: SavedDonationOrg[];
  onRemoveItem: (category: "marketplace" | "repair" | "donation", id: string) => void;
  onNavigateTab?: (tabId: string) => void;
}

export const SavedItemsSection: React.FC<SavedItemsSectionProps> = ({
  marketplaceItems,
  repairCenters,
  donationOrgs,
  onRemoveItem,
  onNavigateTab,
}) => {
  const [subTab, setSubTab] = useState<"marketplace" | "repair" | "donation">("marketplace");

  return (
    <div className="space-y-6">
      {/* Sub-tabs header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Saved & Bookmarked Content
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Access saved listings, verified repair hubs, and NGO partner drop-off centers.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setSubTab("marketplace")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 ${
              subTab === "marketplace"
                ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Marketplace ({marketplaceItems.length})
          </button>
          <button
            onClick={() => setSubTab("repair")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 ${
              subTab === "repair"
                ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Repair Hubs ({repairCenters.length})
          </button>
          <button
            onClick={() => setSubTab("donation")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 ${
              subTab === "donation"
                ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Donation Orgs ({donationOrgs.length})
          </button>
        </div>
      </div>

      {/* SubTab 1: Saved Marketplace Items */}
      {subTab === "marketplace" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketplaceItems.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 text-xs font-semibold bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl">
              No saved marketplace items found.
            </div>
          ) : (
            marketplaceItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-4 space-y-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xl"
              >
                <div className="space-y-3">
                  <div className="relative h-40 bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center p-2">
                    <img src={item.imageUrl} alt={item.title} className="max-h-full object-contain" />
                    <button
                      onClick={() => onRemoveItem("marketplace", item.id)}
                      className="absolute top-2 right-2 p-2 rounded-xl bg-white/90 dark:bg-slate-950/80 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors border border-slate-200 dark:border-slate-800 cursor-pointer"
                      title="Remove from Saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                      ₹{item.price.toLocaleString()} • {item.condition}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-600" /> {item.location}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab && onNavigateTab("marketplace")}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer border-0 flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> View Listing
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* SubTab 2: Saved Repair Centers */}
      {subTab === "repair" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {repairCenters.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 text-xs font-semibold bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl">
              No saved repair centers found.
            </div>
          ) : (
            repairCenters.map((hub) => (
              <div
                key={hub.id}
                className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">{hub.name}</h4>
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {hub.rating} ({hub.reviewCount} reviews)
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveItem("repair", hub.id)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors border border-slate-200 dark:border-slate-800 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80">
                    <strong className="text-slate-500 dark:text-slate-400">Specialty:</strong> {hub.specialty}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> {hub.location}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{hub.distance}</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab && onNavigateTab("repair-shops")}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer border-0 flex items-center justify-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Book Repair Appointment
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* SubTab 3: Saved Donation Orgs */}
      {subTab === "donation" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {donationOrgs.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 text-xs font-semibold bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl">
              No saved donation organizations found.
            </div>
          ) : (
            donationOrgs.map((org) => (
              <div
                key={org.id}
                className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">{org.name}</h4>
                        {org.verified && (
                          <span title="Verified NGO">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{org.location}</p>
                    </div>
                    <button
                      onClick={() => onRemoveItem("donation", org.id)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors border border-slate-200 dark:border-slate-800 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{org.cause}</p>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px]">
                    <span className="text-slate-500 font-semibold">Accepted Hardware: </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{org.devicesAccepted}</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab && onNavigateTab("donation")}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer border-0 flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Initiate Device Donation
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
