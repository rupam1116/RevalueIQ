"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DonationHeroHeader } from "../donation/DonationHeroHeader";
import { DonationImpactDashboard } from "../donation/DonationImpactDashboard";
import { DonationSearchFilter } from "../donation/DonationSearchFilter";
import { DonationCenterCard } from "../donation/DonationCenterCard";
import { DonationOrgDetailsDrawer, ActiveDonationDeviceContext } from "../donation/DonationOrgDetailsDrawer";
import { DonationInteractiveMap } from "../donation/DonationInteractiveMap";
import { DonationHelpSection } from "../donation/DonationHelpSection";
import {
  DonationOrganization,
  DonationRouteResult,
  fetchDonationOrganizations,
  fetchDonationRoute,
  getDonationRecommendations,
} from "@/lib/donationOrganizationApi";
import {
  HeartHandshake,
  Building2,
  BarChart3,
  Award,
  HelpCircle,
  Plus,
  RefreshCw,
  AlertCircle,
  Map as MapIcon,
  LayoutGrid,
  Columns,
  Laptop,
  X,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

function getDonationPurpose(category?: string, condition?: string, productName?: string): string {
  const cat = (category || "").toLowerCase();
  const prod = (productName || "").toLowerCase();
  const cond = (condition || "").toLowerCase();

  if (cond.includes("damaged") || cond.includes("scrap") || cond.includes("poor") || cond.includes("broken")) {
    return "Safe E-Waste Recycling / Component Recovery";
  }
  if (cat.includes("laptop") || prod.includes("macbook") || prod.includes("laptop") || cat.includes("computer") || prod.includes("pc")) {
    return "Digital Literacy / Reuse / Education";
  }
  if (cat.includes("phone") || prod.includes("iphone") || prod.includes("phone") || cat.includes("mobile") || cat.includes("tablet") || prod.includes("ipad")) {
    return "Digital Literacy / Reuse / Community Access";
  }
  return "Digital Literacy / Reuse / Recycling";
}

interface ModuleProps {
  onNavigateTab?: (tabId: string) => void;
}

function DonationModuleContent({ onNavigateTab }: ModuleProps) {
  const searchParams = useSearchParams();

  // Navigation view state
  const [currentView, setCurrentView] = useState<"home" | "dashboard" | "certificates" | "guide">("home");

  // Active Device Donation Context (passed from valuation / device flow)
  const [activeDonationContext, setActiveDonationContext] = useState<ActiveDonationDeviceContext | null>(null);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cityOrPincode, setCityOrPincode] = useState<string>("Hyderabad");
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");

  // Layout view mode: "split" (map + list) | "cards" (cards only) | "map" (map only)
  const [layoutMode, setLayoutMode] = useState<"split" | "cards" | "map">("split");

  // Real organizations data state
  const [organizations, setOrganizations] = useState<DonationOrganization[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Selected organization & Drawer state
  const [selectedOrg, setSelectedOrg] = useState<DonationOrganization | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // User GPS coordinates
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  // Active driving route
  const [activeRoute, setActiveRoute] = useState<DonationRouteResult | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState<boolean>(false);

  // 1. Parse active device donation context from URL or Session Storage
  useEffect(() => {
    const productParam = searchParams.get("product");
    const categoryParam = searchParams.get("category");
    const brandParam = searchParams.get("brand");
    const modelParam = searchParams.get("model");
    const conditionParam = searchParams.get("condition");
    const valIdParam = searchParams.get("valuation_id");

    if (productParam || categoryParam || brandParam) {
      const ctx: ActiveDonationDeviceContext = {
        productName: productParam || `${brandParam || ""} ${modelParam || ""}`.trim() || categoryParam || "Electronic Device",
        category: categoryParam || "Electronics",
        brand: brandParam || undefined,
        model: modelParam || undefined,
        condition: conditionParam || undefined,
        valuationId: valIdParam || undefined,
      };
      setActiveDonationContext(ctx);

      // Automatically tailor donation type filter to the product
      const catLower = (categoryParam || "").toLowerCase();
      const prodLower = (productParam || "").toLowerCase();
      if (catLower.includes("laptop") || prodLower.includes("laptop") || catLower.includes("computer") || prodLower.includes("computer") || prodLower.includes("macbook")) {
        setDeviceTypeFilter("Computers");
      } else if (catLower.includes("phone") || prodLower.includes("iphone") || prodLower.includes("phone") || catLower.includes("mobile")) {
        setDeviceTypeFilter("Mobile Phones");
      }
    } else if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("revalueiq_donation_context");
        if (stored) {
          const parsed = JSON.parse(stored);
          setActiveDonationContext(parsed);
          const catLower = (parsed.category || "").toLowerCase();
          const prodLower = (parsed.productName || "").toLowerCase();
          if (catLower.includes("laptop") || prodLower.includes("laptop") || catLower.includes("computer") || prodLower.includes("computer")) {
            setDeviceTypeFilter("Computers");
          } else if (catLower.includes("phone") || prodLower.includes("phone") || catLower.includes("mobile")) {
            setDeviceTypeFilter("Mobile Phones");
          }
        }
      } catch (e) {}
    }
  }, [searchParams]);

  // Try to acquire user's GPS coordinates on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          // Fallback to Hyderabad coordinates
          setUserCoords({ latitude: 17.3850, longitude: 78.4867 });
        },
        { timeout: 5000 }
      );
    } else {
      setUserCoords({ latitude: 17.3850, longitude: 78.4867 });
    }
  }, []);

  // Fetch genuine donation organizations from backend (either recommendation or search)
  const loadOrganizations = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      let res;
      // If active donation context is present and user has not typed an explicit search query or selected a specific category:
      if (activeDonationContext && !searchQuery.trim() && selectedCategory === "All Categories") {
        const derivedPurpose = getDonationPurpose(
          activeDonationContext.category,
          activeDonationContext.condition,
          activeDonationContext.productName
        );

        res = await getDonationRecommendations({
          device: {
            category: activeDonationContext.category,
            brand: activeDonationContext.brand,
            model: activeDonationContext.model,
            condition: activeDonationContext.condition,
            valuation_id: activeDonationContext.valuationId,
          },
          donation: {
            purpose: derivedPurpose,
            recommended_action: "DONATE",
          },
          location: {
            latitude: userCoords?.latitude,
            longitude: userCoords?.longitude,
            city: cityOrPincode,
            radius_km: 50.0,
          },
        });
      } else {
        res = await fetchDonationOrganizations({
          search: searchQuery,
          category: selectedCategory,
          city: cityOrPincode,
          donation_type: deviceTypeFilter,
          latitude: userCoords?.latitude,
          longitude: userCoords?.longitude,
          limit: 30,
        });
      }

      setOrganizations(res.items || []);
      setTotalCount(res.total || 0);

      // Automatically select first organization if none selected
      if ((!selectedOrg || !res.items.some((o) => o.id === selectedOrg.id)) && res.items.length > 0) {
        setSelectedOrg(res.items[0]);
      }
    } catch (err: any) {
      console.error("Error loading organizations:", err);
      setFetchError("Unable to discover organizations right now. Please check your internet connection and try again.");
      setOrganizations([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, cityOrPincode, deviceTypeFilter, userCoords, activeDonationContext]);

  // Compute category counts strictly from actual returned organizations (no fake counts)
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const org of organizations) {
      if (org.category) {
        counts[org.category] = (counts[org.category] || 0) + 1;
      }
    }
    return counts;
  }, [organizations]);

  // Trigger search on filter changes with a debounce for text input
  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrganizations();
    }, 350);

    return () => clearTimeout(timer);
  }, [loadOrganizations]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setCityOrPincode("Hyderabad");
    setDeviceTypeFilter("");
    setSelectedCategory("All Categories");
    setActiveRoute(null);
  };

  const handleClearDeviceContext = () => {
    setActiveDonationContext(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("revalueiq_donation_context");
    }
  };

  const handleSelectOrg = (org: DonationOrganization) => {
    setSelectedOrg(org);
    setIsDrawerOpen(true);
  };

  const handleGetDirections = async (org: DonationOrganization) => {
    if (!org.latitude || !org.longitude) {
      alert("Location coordinates unavailable for this organization.");
      return;
    }

    const startLat = userCoords?.latitude || 17.3850;
    const startLng = userCoords?.longitude || 78.4867;

    setIsCalculatingRoute(true);
    try {
      const route = await fetchDonationRoute(startLat, startLng, org.latitude, org.longitude);
      setActiveRoute(route);
      setSelectedOrg(org);
      if (layoutMode === "cards") {
        setLayoutMode("split");
      }
    } catch (err) {
      console.error("Directions error:", err);
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${org.latitude},${org.longitude}`;
      window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 transition-all duration-300">
      {/* Top Sub-Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-3xl shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setCurrentView("home")}
            variant={currentView === "home" ? "default" : "ghost"}
            size="sm"
            className={`rounded-2xl text-xs font-extrabold cursor-pointer ${
              currentView === "home"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950"
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 mr-1.5 text-emerald-300" />
            Donation Hub ({totalCount})
          </Button>

          <Button
            onClick={() => setCurrentView("dashboard")}
            variant={currentView === "dashboard" ? "default" : "ghost"}
            size="sm"
            className={`rounded-2xl text-xs font-extrabold cursor-pointer ${
              currentView === "dashboard"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-emerald-300" />
            Impact Dashboard
          </Button>

          <Button
            onClick={() => setCurrentView("certificates")}
            variant={currentView === "certificates" ? "default" : "ghost"}
            size="sm"
            className={`rounded-2xl text-xs font-extrabold cursor-pointer ${
              currentView === "certificates"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950"
            }`}
          >
            <Award className="w-3.5 h-3.5 mr-1.5 text-teal-300" />
            My Certificates
          </Button>

          <Button
            onClick={() => setCurrentView("guide")}
            variant={currentView === "guide" ? "default" : "ghost"}
            size="sm"
            className={`rounded-2xl text-xs font-extrabold cursor-pointer ${
              currentView === "guide"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-300" />
            CSR Guide
          </Button>
        </div>

        <Button
          onClick={() => {
            const el = document.getElementById("search-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          size="sm"
          className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs px-5 h-10 shadow-md shadow-emerald-600/20 border-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Locate Donation Drop-Off
        </Button>
      </div>

      {/* Active Context Banner per Section 5 */}
      {activeDonationContext && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-emerald-500/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              AI Donation Recommendation Active
            </div>

            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Recommended organizations for {activeDonationContext.productName}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700 dark:text-slate-300 font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                Donation purpose: {getDonationPurpose(activeDonationContext.category, activeDonationContext.condition, activeDonationContext.productName)}
              </span>

              {activeDonationContext.category && (
                <span className="text-slate-500">
                  Category: <strong className="text-slate-800 dark:text-slate-200">{activeDonationContext.category}</strong>
                </span>
              )}

              {activeDonationContext.brand && (
                <span className="text-slate-500">
                  • Brand: <strong className="text-slate-800 dark:text-slate-200">{activeDonationContext.brand}</strong>
                </span>
              )}

              {activeDonationContext.condition && (
                <span className="text-slate-500">
                  • Condition: <strong className="text-slate-800 dark:text-slate-200">{activeDonationContext.condition}</strong>
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0 self-end sm:self-center">
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearDeviceContext}
              className="rounded-xl border-emerald-300 dark:border-emerald-800 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:bg-emerald-100/50 cursor-pointer"
            >
              <X className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Clear Device
            </Button>
          </div>
        </div>
      )}

      {/* VIEW 1: HOME DONATION HUB */}
      {currentView === "home" && (
        <>
          {/* Section 1: Hero Header */}
          <DonationHeroHeader
            stats={{
              totalDevicesDonated: 1240,
              co2SavedTons: 18.4,
              peopleHelped: 3800,
              partnerOrganizations: totalCount || 28,
            }}
            onStartDonationClick={() => {
              const el = document.getElementById("search-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            onViewImpactClick={() => setCurrentView("dashboard")}
          />

          {/* Section 2: Smart Search & 8 Category Cards */}
          <div id="search-section">
            <DonationSearchFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              cityOrPincode={cityOrPincode}
              onCityOrPincodeChange={setCityOrPincode}
              deviceTypeFilter={deviceTypeFilter}
              onDeviceTypeChange={setDeviceTypeFilter}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              onResetFilters={handleResetFilters}
              resultsCount={totalCount}
              categoryCounts={categoryCounts}
            />
          </div>

          {/* Section 3: Verified Organization Cards & Interactive Map */}
          <div className="space-y-4 pt-2">
            {/* Header bar with count and layout toggles */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Verified Donation & Recycling Organizations
                </h2>
                <p className="text-xs text-slate-500">
                  Real mapped organizations discovered via OpenStreetMap community registry
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* View switcher buttons */}
                <div className="hidden sm:flex items-center p-1 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 shadow-2xs">
                  <button
                    onClick={() => setLayoutMode("split")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      layoutMode === "split"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                    }`}
                  >
                    <Columns className="w-3.5 h-3.5" /> Split
                  </button>
                  <button
                    onClick={() => setLayoutMode("cards")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      layoutMode === "cards"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" /> Cards
                  </button>
                  <button
                    onClick={() => setLayoutMode("map")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      layoutMode === "map"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5" /> Map
                  </button>
                </div>

                <span className="text-xs text-slate-400 font-bold px-2">
                  Showing {organizations.length} of {totalCount}
                </span>
              </div>
            </div>

            {/* Error Banner */}
            {fetchError && (
              <div className="p-4 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{fetchError}</span>
                </div>
                <Button
                  size="sm"
                  onClick={loadOrganizations}
                  className="rounded-xl bg-rose-600 text-white font-extrabold text-xs h-8"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
                </Button>
              </div>
            )}

            {/* Loading State Skeleton */}
            {isLoading && (
              <div className="flex items-center justify-center py-16 bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Querying genuine organizations and live map coordinates...
                  </span>
                </div>
              </div>
            )}

            {/* Main Content Layout based on layoutMode */}
            {!isLoading && organizations.length > 0 && (
              <>
                {layoutMode === "split" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Map Pane (Sticky on Large Screens) */}
                    <div className="lg:col-span-6 sticky top-20 z-10">
                      <DonationInteractiveMap
                        organizations={organizations}
                        selectedOrg={selectedOrg}
                        onSelectOrg={(org) => handleSelectOrg(org)}
                        userCoords={userCoords}
                        activeRoute={activeRoute}
                        onClearRoute={() => setActiveRoute(null)}
                      />
                    </div>

                    {/* Cards Column */}
                    <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {organizations.map((org) => (
                        <DonationCenterCard
                          key={org.id}
                          organization={org}
                          isSelected={selectedOrg?.id === org.id}
                          onViewDetails={(o) => handleSelectOrg(o)}
                          onGetDirections={(o) => handleGetDirections(o)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {layoutMode === "cards" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizations.map((org) => (
                      <DonationCenterCard
                        key={org.id}
                        organization={org}
                        isSelected={selectedOrg?.id === org.id}
                        onViewDetails={(o) => handleSelectOrg(o)}
                        onGetDirections={(o) => handleGetDirections(o)}
                      />
                    ))}
                  </div>
                )}

                {layoutMode === "map" && (
                  <div className="space-y-4">
                    <DonationInteractiveMap
                      organizations={organizations}
                      selectedOrg={selectedOrg}
                      onSelectOrg={(org) => handleSelectOrg(org)}
                      userCoords={userCoords}
                      activeRoute={activeRoute}
                      onClearRoute={() => setActiveRoute(null)}
                    />
                    <p className="text-xs text-center text-slate-400">
                      Click any pin on the map to inspect organization details, call, or navigate.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Empty Search Results State */}
            {!isLoading && organizations.length === 0 && !fetchError && (
              <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-12 text-center space-y-4 shadow-sm">
                <HeartHandshake className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No verified organizations found for this search. Try another location or category.
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We only show genuine, confirmed organizations. If none were found in this area, try searching a nearby city or selecting "All Categories".
                </p>
                <Button
                  onClick={handleResetFilters}
                  className="rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>

          {/* Section 4: CSR Support Guide & Help Section */}
          <DonationHelpSection />
        </>
      )}

      {/* VIEW 2: IMPACT DASHBOARD VIEW */}
      {currentView === "dashboard" && (
        <DonationImpactDashboard
          userDonations={[]}
          onViewCertificate={() => {}}
          onDonateClick={() => {
            setCurrentView("home");
            const el = document.getElementById("search-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />
      )}

      {/* VIEW 3: MY CERTIFICATES */}
      {currentView === "certificates" && (
        <DonationImpactDashboard
          userDonations={[]}
          onViewCertificate={() => {}}
          onDonateClick={() => {
            setCurrentView("home");
            const el = document.getElementById("search-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />
      )}

      {/* VIEW 4: CSR GUIDE */}
      {currentView === "guide" && <DonationHelpSection />}

      {/* ORGANIZATION DETAILS DRAWER */}
      <DonationOrgDetailsDrawer
        organization={selectedOrg}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onGetDirections={(org) => {
          setIsDrawerOpen(false);
          handleGetDirections(org);
        }}
        activeDonationContext={activeDonationContext}
      />
    </div>
  );
}

export const DonationModule: React.FC<ModuleProps> = (props) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-emerald-600">
          <RefreshCw className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <DonationModuleContent {...props} />
    </Suspense>
  );
};
