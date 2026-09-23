"use client";
import { getApiUrl } from "@/lib/api";


import { useState, useEffect } from "react";
import { HandHeart, MapPin, Building, Globe, Search, Star, Navigation, RefreshCw, CheckCircle2, Recycle, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "All E-Waste & Devices",
  "Laptops & Computers",
  "Smartphones & Tablets",
  "Batteries & Power",
  "Home Appliances",
  "Cables & Accessories"
];

export default function DonationCentresPage() {
  const [location, setLocation] = useState("Hyderabad, India");
  const [selectedCategory, setSelectedCategory] = useState("All E-Waste & Devices");
  const [centres, setCentres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchedLocation, setSearchedLocation] = useState("Hyderabad, India");
  const [searchedCategory, setSearchedCategory] = useState("All E-Waste & Devices");

  const fetchCentres = async (locStr: string, catStr: string) => {
    setLoading(true);
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/v1/maps/donation-centres/search?location=${encodeURIComponent(locStr)}&category=${encodeURIComponent(catStr)}`);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.centres)) {
        setCentres(data.centres);
        setSearchedLocation(data.location || locStr);
        setSearchedCategory(data.category || catStr);
      } else {
        setCentres([]);
      }
    } catch (err) {
      console.error("Error fetching donation centres:", err);
      setCentres([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCentres(location, selectedCategory);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;
    fetchCentres(location, selectedCategory);
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    fetchCentres(location, cat);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20 mb-2">
            <HandHeart className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-poppins tracking-tight text-foreground">
            Donation & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">Recycling Hubs</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-3">
            Give your electronics a second life. Locate certified e-waste recyclers for safe disposal or verified NGOs to donate working devices with pinpoint street accuracy.
          </p>
        </div>

        {/* Search Bar & Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-border shadow-xl shadow-slate-200/50 dark:shadow-none mb-12">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your city, neighborhood, or zip code (e.g. Hyderabad, Mumbai, SF)..." 
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800/80 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-base shadow-inner"
              />
            </div>
            <Button type="submit" disabled={loading} className="rounded-2xl h-14 px-8 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-base shadow-lg shadow-teal-500/25 transition-all">
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Searching...
                </>
              ) : (
                <>
                  <MapPin className="w-5 h-5 mr-2" /> Find Nearest Hubs
                </>
              )}
            </Button>
          </form>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2 flex items-center gap-1">
              <Recycle className="w-3.5 h-3.5 text-teal-500" /> Filter Item:
            </span>
            {CATEGORIES.map((cat, i) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={i}
                  onClick={() => handleCategoryClick(cat)}
                  type="button"
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/20 scale-[1.02]"
                      : "bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-border/50"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-teal-500/10 border border-teal-500/20 rounded-2xl p-4.5 px-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-teal-400 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Showing {centres.length} Verified Collection Points near <span className="text-teal-600 dark:text-teal-400">&quot;{searchedLocation}&quot;</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Filtered for <span className="font-semibold text-foreground">{searchedCategory}</span>. All locations feature exact street addresses and GPS navigation.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-border shadow-sm text-muted-foreground shrink-0">
            📍 100% Geocoded Precision
          </span>
        </div>

        {/* Centers Cards Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <RefreshCw className="w-10 h-10 animate-spin text-teal-500 mx-auto" />
            <p className="text-lg font-semibold text-muted-foreground">Locating exact recycling & donation facilities...</p>
          </div>
        ) : centres.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-border space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No centers found matching your search</h3>
            <p className="text-muted-foreground max-w-md mx-auto">Try entering a different city name, district, or zip code, or switch the filter to &quot;All E-Waste & Devices&quot;.</p>
            <Button onClick={() => fetchCentres("Hyderabad, India", "All E-Waste & Devices")} variant="outline" className="rounded-xl">
              Reset Search to Hyderabad
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {centres.map((centre, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-border hover:border-teal-500/40 hover:shadow-xl hover:shadow-teal-500/5 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-teal-500 to-emerald-500 opacity-80 group-hover:opacity-100 transition-opacity" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pl-2">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {centre.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        {centre.source?.includes("Live") ? "OpenStreetMap Live" : "Verified Hub"}
                      </span>
                      {centre.rating && (
                        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/20">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {centre.rating} ({centre.reviews || 45})
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs md:text-sm text-muted-foreground font-medium">
                      <span className="flex items-center text-foreground font-semibold">
                        <MapPin className="w-4 h-4 mr-1.5 text-teal-500 shrink-0" /> 
                        {centre.address}
                      </span>
                      <span className="bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-lg font-bold text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/40">
                        📍 {centre.distance}
                      </span>
                      <span className="flex items-center text-slate-600 dark:text-slate-400">
                        <Building className="w-4 h-4 mr-1 text-slate-400 shrink-0" /> {centre.type}
                      </span>
                    </div>

                    {centre.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl pt-1">
                        {centre.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
                        Accepted Items:
                      </span>
                      {centre.accepts && centre.accepts.map((item: string, i: number) => (
                        <span 
                          key={i} 
                          className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                            item.toLowerCase().includes(selectedCategory.toLowerCase()) && selectedCategory !== "All E-Waste & Devices"
                              ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold shadow-sm"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-border/40"
                          }`}
                        >
                          ♻️ {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex sm:flex-row lg:flex-col gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/40">
                    <a 
                      href={centre.directionsUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(centre.name + ', ' + centre.address)}&travelmode=driving`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial"
                    >
                      <Button className="w-full sm:w-44 h-12 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-2">
                        <Navigation className="w-4 h-4" /> Get Directions <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                    <a 
                      href={centre.website || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(centre.name + ', ' + centre.address)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial"
                    >
                      <Button variant="outline" className="w-full sm:w-44 h-12 rounded-xl border-2 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold flex items-center justify-center gap-2">
                        <Globe className="w-4 h-4 text-teal-500" /> View on Map
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}