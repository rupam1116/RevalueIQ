"use client";

import React from "react";
import { DonationOrganization } from "@/lib/donationOrganizationApi";
import {
  X,
  MapPin,
  Phone,
  Globe,
  Navigation,
  Clock,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Share2,
  ExternalLink,
  ShieldAlert,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ActiveDonationDeviceContext {
  productName: string;
  category?: string;
  brand?: string;
  model?: string;
  condition?: string;
  valuationId?: string;
}

interface DonationOrgDetailsDrawerProps {
  organization: DonationOrganization | null;
  isOpen: boolean;
  onClose: () => void;
  onGetDirections: (org: DonationOrganization) => void;
  activeDonationContext?: ActiveDonationDeviceContext | null;
}

export const DonationOrgDetailsDrawer: React.FC<DonationOrgDetailsDrawerProps> = ({
  organization,
  isOpen,
  onClose,
  onGetDirections,
  activeDonationContext,
}) => {
  if (!isOpen || !organization) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: organization.name,
        text: `${organization.name} - Donation & Community Organization on RevalueIQ`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Organization link copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300">
      {/* Backdrop click to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0b1a13] border-l border-emerald-100 dark:border-emerald-900/50 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-emerald-100 dark:border-emerald-900/40 flex items-start justify-between gap-4 bg-emerald-50/30 dark:bg-emerald-950/20">
          <div className="space-y-1.5 flex-1 pr-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {organization.category}
              </span>
              {organization.is_verified ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Official Partner
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <Info className="w-3 h-3 text-slate-400" /> {organization.verification_source || "OpenStreetMap Community Record"}
                </span>
              )}
            </div>

            <h2 className="text-xl font-black text-slate-900 dark:text-white leading-snug">
              {organization.name}
            </h2>

            {organization.distance_km !== null && organization.distance_km !== undefined && (
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {organization.distance_km.toFixed(1)} km away from search location
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
              title="Share organization"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Active Equipment Context (from Valuation or Device page) */}
          {activeDonationContext && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Equipment to Donate
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  Active Item
                </span>
              </div>
              <p className="text-sm font-black text-slate-900 dark:text-white">
                {activeDonationContext.productName}
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                {activeDonationContext.category && (
                  <span>Category: <strong>{activeDonationContext.category}</strong></span>
                )}
                {activeDonationContext.condition && (
                  <span>• Condition: <strong>{activeDonationContext.condition}</strong></span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 italic pt-1 border-t border-emerald-200/50 dark:border-emerald-800/40">
                Tip: When calling or visiting, mention you have this specific {activeDonationContext.productName} ready for handover.
              </p>
            </div>
          )}
          
          {/* Donation Center Details & Focus */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-extrabold text-xs">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Center Overview & Intake Focus</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {organization.description || (
                organization.category === "Education"
                  ? "Educational institution supporting student digital learning, hardware donations, and school lab empowerment."
                  : organization.category === "NGOs"
                  ? "Community non-profit organization facilitating welfare, outreach, and electronics reuse programs."
                  : organization.category === "Digital Literacy"
                  ? "Digital skills training facility and community technology access center."
                  : organization.category === "Rural Schools"
                  ? "Village school providing students with computers and digital education resources."
                  : organization.category === "Orphanages"
                  ? "Child welfare home accepting computers, tablets, educational equipment, and learning essentials."
                  : organization.category === "Government Collection"
                  ? "Designated public center for safe electronics collection, hazardous component containment, and responsible disposal."
                  : organization.category === "E-Waste Recyclers"
                  ? "Authorized recycling facility specializing in safe e-waste processing, dismantling, and precious metal recovery."
                  : "Community donation center and responsible equipment drop-off point."
              )}
            </p>

            <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold">Donation Acceptance:</span>
              <span className={`font-extrabold ${organization.donation_acceptance_confirmed ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-300"}`}>
                {organization.donation_acceptance_confirmed ? "Donation acceptance confirmed" : "Donation acceptance not confirmed"}
              </span>
            </div>

            {organization.donation_acceptance_confirmed && organization.accepted_donation_types && organization.accepted_donation_types.length > 0 && (
              <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Confirmed Intake Types:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {organization.accepted_donation_types.map((type, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Genuine Description */}
          {organization.description && (
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                About Organization
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-emerald-950/20 p-3.5 rounded-2xl border border-emerald-100/60 dark:border-emerald-900/30">
                {organization.description}
              </p>
            </div>
          )}

          {/* Address Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Location & Address
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/30 space-y-2">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                {organization.address}
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 font-medium">
                {organization.city && <span>City: <strong className="text-slate-700 dark:text-slate-300">{organization.city}</strong></span>}
                {organization.area && <span>• Area: <strong className="text-slate-700 dark:text-slate-300">{organization.area}</strong></span>}
                {organization.postal_code && <span>• PIN: <strong className="text-slate-700 dark:text-slate-300">{organization.postal_code}</strong></span>}
              </div>
              <p className="text-[10px] text-slate-400 font-mono pt-1">
                GPS: {organization.latitude.toFixed(5)}, {organization.longitude.toFixed(5)}
              </p>
            </div>
          </div>

          {/* Operating Hours - only if available */}
          {organization.opening_hours && (
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> Operating Hours
              </h3>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/30 text-xs text-slate-700 dark:text-slate-300 font-medium">
                {organization.opening_hours}
              </div>
            </div>
          )}

          {/* Rating and Reviews - only if available from provider */}
          {organization.rating !== null && organization.rating !== undefined && (
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Provider Rating
              </h3>
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                <span>★ {organization.rating.toFixed(1)} / 5.0</span>
                {organization.review_count !== null && organization.review_count !== undefined && (
                  <span className="text-slate-400 font-normal">({organization.review_count} verified reviews)</span>
                )}
              </div>
            </div>
          )}

          {/* Direct Phone Number - if available */}
          {organization.phone && (
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> Direct Telephone
              </h3>
              <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{organization.phone}</span>
                <a
                  href={`tel:${organization.phone}`}
                  className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  Call
                </a>
              </div>
            </div>
          )}

          {/* Verification Source & Metadata */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/30 space-y-1.5 text-[11px] text-slate-500">
            <p>
              <strong>Data Source:</strong> {organization.verification_source || "OpenStreetMap Community Record"}
            </p>
            {organization.last_updated && (
              <p>
                <strong>Last Updated:</strong> {new Date(organization.last_updated).toLocaleDateString()}
              </p>
            )}
            {organization.provider_url && (
              <a
                href={organization.provider_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline flex items-center gap-1 pt-1 font-bold"
              >
                View on OpenStreetMap <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

        </div>

        {/* Drawer Bottom Actions: Direct Contact & Directions */}
        <div className="p-5 border-t border-emerald-100 dark:border-emerald-900/50 bg-white dark:bg-[#0b1a13] space-y-3">
          <div className={`grid ${organization.phone && organization.website ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
            {/* Call Action - only if real phone exists */}
            {organization.phone && (
              <a
                href={`tel:${organization.phone}`}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-black text-xs hover:bg-emerald-100/80 transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                Call Directly
              </a>
            )}

            {/* Official Website Action - only if real website exists */}
            {organization.website && (
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
              >
                <Globe className="w-4 h-4 text-emerald-600" />
                Official Website
              </a>
            )}
          </div>

          {/* Directions Button */}
          <Button
            onClick={() => onGetDirections(organization)}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 cursor-pointer border-0"
          >
            <Navigation className="w-4 h-4" />
            Get Driving Directions
          </Button>
        </div>

      </div>
    </div>
  );
};
