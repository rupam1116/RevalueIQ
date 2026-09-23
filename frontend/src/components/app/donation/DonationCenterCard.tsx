"use client";

import React from "react";
import { DonationOrganization } from "@/lib/donationOrganizationApi";
import {
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  Phone,
  Eye,
  Building2,
  AlertTriangle,
  Globe,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DonationCenterCardProps {
  organization: DonationOrganization;
  isSelected?: boolean;
  onViewDetails: (org: DonationOrganization) => void;
  onGetDirections: (org: DonationOrganization) => void;
}

export const DonationCenterCard: React.FC<DonationCenterCardProps> = ({
  organization,
  isSelected = false,
  onViewDetails,
  onGetDirections,
}) => {
  return (
    <div
      className={`group relative rounded-3xl border bg-white dark:bg-[#0b1a13] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${
        isSelected
          ? "border-emerald-600 ring-2 ring-emerald-500/20 dark:border-emerald-500"
          : "border-emerald-100 dark:border-emerald-900/50"
      }`}
    >
      {/* Top Banner & Badges */}
      <div className="p-5 pb-3 border-b border-emerald-50 dark:border-emerald-950/40 bg-gradient-to-br from-emerald-50/40 to-transparent dark:from-emerald-950/20">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
            {organization.category}
          </span>

          {organization.is_verified ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Partner
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" /> {organization.provider.toUpperCase()} Record
            </span>
          )}
        </div>

        <h3
          onClick={() => onViewDetails(organization)}
          className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors cursor-pointer"
        >
          {organization.name}
        </h3>

        {/* Distance Badge */}
        {organization.distance_km !== null && organization.distance_km !== undefined ? (
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {organization.distance_km.toFixed(1)} km away
          </p>
        ) : (
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            {organization.city || "Mappable Location"}
          </p>
        )}

        {/* Real Rating and Review Count if available (only if supplied by provider) */}
        {organization.rating !== null && organization.rating !== undefined && (
          <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-amber-600">
            <span>★ {organization.rating.toFixed(1)}</span>
            {organization.review_count !== null && organization.review_count !== undefined && (
              <span className="text-slate-400 font-normal">({organization.review_count} reviews)</span>
            )}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Full Real Address */}
        <div className="space-y-2.5">
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {organization.address}
          </p>

          {/* Center Details & Cause */}
          <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300">
              <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{organization.category} Center</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
              {organization.description || (
                organization.category === "Education"
                  ? "Educational institution supporting student digital learning and hardware donations."
                  : organization.category === "NGOs"
                  ? "Community non-profit organization facilitating welfare, outreach, and reuse."
                  : organization.category === "Digital Literacy"
                  ? "Digital skills lab and community computer access center."
                  : organization.category === "Rural Schools"
                  ? "Village school providing students with computers and digital education access."
                  : organization.category === "Orphanages"
                  ? "Child welfare home accepting educational equipment and essentials."
                  : organization.category === "Government Collection"
                  ? "Designated public center for safe electronics collection and responsible disposal."
                  : organization.category === "E-Waste Recyclers"
                  ? "Authorized recycling facility for safe e-waste processing and material recovery."
                  : "Community donation center and responsible equipment drop-off point."
              )}
            </p>
          </div>

          {/* Confirmed Intake Badge (if available from provider) */}
          {organization.donation_acceptance_confirmed && organization.accepted_donation_types && organization.accepted_donation_types.length > 0 ? (
            <div className="p-2 rounded-xl bg-emerald-100/70 dark:bg-emerald-900/40 text-[11px] text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Donation acceptance confirmed • {organization.accepted_donation_types.join(", ")}</span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-[11px] px-1 text-slate-500 dark:text-slate-400">
              <span className="text-slate-400">Status:</span>
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                Donation acceptance not confirmed
              </span>
            </div>
          )}

          {/* Recommendation Reason (if present) */}
          {organization.recommendation_reason && (
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/30 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/30 font-medium">
              ✨ {organization.recommendation_reason}
            </p>
          )}

          {/* Real Operating Hours if available */}
          {organization.opening_hours && (
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{organization.opening_hours}</span>
            </div>
          )}
        </div>

        {/* Bottom Actions: Call (only if real phone exists), View Details, Directions */}
        <div className="space-y-2 pt-1">
          {organization.phone && (
            <a
              href={`tel:${organization.phone}`}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              Call ({organization.phone})
            </a>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              onClick={() => onViewDetails(organization)}
              className="rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs h-9 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 mr-1" /> View Details
            </Button>

            <Button
              size="sm"
              onClick={() => onGetDirections(organization)}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-9 shadow-xs cursor-pointer border-0"
            >
              <Navigation className="w-3.5 h-3.5 mr-1" /> Directions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
