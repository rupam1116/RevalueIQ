"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { RepairCenterItem, ActiveRepairContext } from "@/types/repairCenter";
import { getRepairCenters, getRepairCenterRecommendations } from "@/lib/repairCenterApi";

import { LocationSearch } from "../repair-recommendation/LocationSearch";
import { InteractiveGoogleMap } from "../repair-recommendation/InteractiveGoogleMap";
import { RepairCenterCardsList } from "../repair-recommendation/RepairCenterCardsList";
import { ShopDetailsDrawer } from "../repair-recommendation/ShopDetailsDrawer";
import {
  ArrowLeft,
  Sparkles,
  Wrench,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModuleProps {
  onNavigateTab?: (tabId: string) => void;
}

export const RepairRecommendationModule: React.FC<ModuleProps> = ({ onNavigateTab }) => {
  const searchParams = useSearchParams();

  // Active AI Diagnostic / Valuation Context
  const [activeContext, setActiveContext] = useState<ActiveRepairContext | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Hyderabad");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedRepairType, setSelectedRepairType] = useState("All");
  const [selectedRadius, setSelectedRadius] = useState(50);
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);

  // Geo Location State
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Data & Selection State
  const [centers, setCenters] = useState<RepairCenterItem[]>([]);
  const [selectedCenterDetails, setSelectedCenterDetails] = useState<RepairCenterItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Parse active context from URL or Session Storage on mount
  useEffect(() => {
    let ctx: ActiveRepairContext | null = null;

    // Check URL parameters first
    const brandParam = searchParams.get("brand");
    const modelParam = searchParams.get("model");
    const problemParam = searchParams.get("problem");
    const categoryParam = searchParams.get("category");
    const severityParam = searchParams.get("severity");
    const actionParam = searchParams.get("action");
    const estCostParam = searchParams.get("estimated_cost");
    const valIdParam = searchParams.get("valuation_id");
    const advIdParam = searchParams.get("advisory_id");

    if (brandParam || modelParam || problemParam) {
      ctx = {
        brand: brandParam || undefined,
        model: modelParam || undefined,
        category: categoryParam || undefined,
        problem: problemParam || undefined,
        severity: severityParam || "HIGH",
        recommended_action: actionParam || "REPAIR",
        estimated_repair_cost: estCostParam ? Number(estCostParam) : undefined,
        valuation_id: valIdParam || undefined,
        advisory_id: advIdParam || undefined,
      };
    } else if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("revalueiq_repair_context");
        if (stored) {
          ctx = JSON.parse(stored);
        }
      } catch (e) {
        // ignore
      }
    }

    if (ctx) {
      setActiveContext(ctx);
      if (ctx.brand) setSelectedBrand(ctx.brand);
    }
  }, [searchParams]);

  // 2. Fetch Repair Centers (Recommendation or Discovery)
  const fetchCenters = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeContext) {
        // Run Context-Driven Recommendation Engine
        const res = await getRepairCenterRecommendations({
          device: {
            category: activeContext.category,
            brand: selectedBrand !== "All" ? selectedBrand : activeContext.brand,
            model: activeContext.model,
          },
          repair: {
            problem: selectedRepairType !== "All" ? selectedRepairType : activeContext.problem,
            severity: activeContext.severity,
            recommended_action: activeContext.recommended_action,
            estimated_repair_cost: activeContext.estimated_repair_cost,
            valuation_id: activeContext.valuation_id,
            advisory_id: activeContext.advisory_id,
          },
          location: {
            latitude: userCoords?.latitude,
            longitude: userCoords?.longitude,
            city: selectedCity !== "All" ? selectedCity : undefined,
            radius_km: selectedRadius,
          },
        });
        setCenters(res.items);
      } else {
        // Run Standard Direct Discovery
        const res = await getRepairCenters({
          search: searchQuery,
          city: selectedCity !== "All" ? selectedCity : undefined,
          brand: selectedBrand !== "All" ? selectedBrand : undefined,
          repair_type: selectedRepairType !== "All" ? selectedRepairType : undefined,
          latitude: userCoords?.latitude,
          longitude: userCoords?.longitude,
          radius: selectedRadius,
          verified_only: isVerifiedOnly,
        });
        setCenters(res.items);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load repair centers.");
    } finally {
      setIsLoading(false);
    }
  }, [
    activeContext,
    searchQuery,
    selectedCity,
    selectedBrand,
    selectedRepairType,
    selectedRadius,
    isVerifiedOnly,
    userCoords,
  ]);

  useEffect(() => {
    fetchCenters();
  }, [fetchCenters]);

  // 3. HTML5 Geolocation Detection Handler
  const handleAutoDetectLocation = () => {
    setIsDetectingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setIsDetectingLocation(false);
        },
        (err) => {
          console.warn("Geolocation permission denied or timed out:", err);
          setIsDetectingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setIsDetectingLocation(false);
    }
  };

  const handleClearContext = () => {
    setActiveContext(null);
    setSelectedBrand("All");
    setSelectedRepairType("All");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("revalueiq_repair_context");
    }
  };

  return (
    <div className="space-y-8 pb-12 text-slate-900 dark:text-white font-sans selection:bg-emerald-500/20 selection:text-emerald-800">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-extrabold">
            <Wrench className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Verified Repair Center Network
            </div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white">
              Repair Shops & Service Hub
            </h1>
          </div>
        </div>

        {onNavigateTab && (
          <Button
            onClick={() => onNavigateTab("repair")}
            variant="outline"
            size="sm"
            className="rounded-2xl border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-bold text-xs h-9 px-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 text-emerald-600 dark:text-emerald-400" /> Back to Diagnostics
          </Button>
        )}
      </div>

      {/* 1. ACTIVE AI DIAGNOSTIC CONTEXT HERO BANNER (When navigated from Valuation / Repair Advisory) */}
      {activeContext && (
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-[#062217] to-teal-950 border border-emerald-700/60 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  AI Repair Recommendation Active
                </span>
                {activeContext.severity && (
                  <span className="px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400" /> Severity: {activeContext.severity}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Recommended Repair Centers for {activeContext.brand || ""} {activeContext.model || "Your Device"}
              </h2>

              <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl leading-relaxed">
                Primary Issue Detected: <strong className="text-white font-bold">{activeContext.problem || "Hardware Diagnostics Required"}</strong>
                {activeContext.estimated_repair_cost ? ` • Estimated Repair Cost: ₹${activeContext.estimated_repair_cost.toLocaleString("en-IN")}` : ""}
              </p>
            </div>

            <Button
              onClick={handleClearContext}
              variant="outline"
              size="sm"
              className="rounded-2xl border-emerald-500/50 bg-emerald-900/40 hover:bg-emerald-800 text-white font-bold text-xs h-10 px-4 shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>Browse All Centers</span>
            </Button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-4 text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Repair center search is temporarily unavailable. Please try again later.</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchCenters()}
            className="rounded-xl border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 hover:bg-rose-100 text-[11px] h-7 px-2.5"
          >
            Retry
          </Button>
        </div>
      )}

      {/* 2. SMART SEARCH & FILTERS BAR */}
      <LocationSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        selectedBrand={selectedBrand}
        onBrandChange={setSelectedBrand}
        selectedRepairType={selectedRepairType}
        onRepairTypeChange={setSelectedRepairType}
        selectedRadius={selectedRadius}
        onRadiusChange={setSelectedRadius}
        onAutoDetect={handleAutoDetectLocation}
        isDetecting={isDetectingLocation}
        totalResults={centers.length}
        isVerifiedOnly={isVerifiedOnly}
        onToggleVerifiedOnly={() => setIsVerifiedOnly((prev) => !prev)}
      />

      {/* 3. INTERACTIVE MAP CANVAS */}
      <InteractiveGoogleMap
        centers={centers}
        selectedCenter={selectedCenterDetails}
        onSelectCenter={(c) => setSelectedCenterDetails(c)}
        userCoords={userCoords}
      />

      {/* 4. REPAIR SHOP CARDS LIST GRID */}
      <RepairCenterCardsList
        centers={centers}
        onSelectCenter={(c) => setSelectedCenterDetails(c)}
        isLoading={isLoading}
      />

      {/* 5. SHOP DETAILS RIGHT DRAWER */}
      <ShopDetailsDrawer
        center={selectedCenterDetails}
        onClose={() => setSelectedCenterDetails(null)}
      />
    </div>
  );
};
