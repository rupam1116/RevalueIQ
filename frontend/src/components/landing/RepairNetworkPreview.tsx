"use client";

import Link from "next/link";
import { Wrench, MapPin, Star, Clock, ShieldCheck, ArrowRight, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const repairShops = [
  {
    id: 1,
    name: "TechMedic Micro-Repair",
    rating: 4.9,
    reviews: 248,
    distance: "0.8 km away",
    turnaround: "Same-Day Service",
    specialty: "Logic Board Soldering & OLED Displays",
    certified: "Apple & Samsung Certified",
    address: "742 MG Road, Tech District",
  },
  {
    id: 2,
    name: "iFixPro Electronics Hub",
    rating: 4.8,
    reviews: 194,
    distance: "1.4 km away",
    turnaround: "24-Hour Turnaround",
    specialty: "Laptop Battery & Port Replacements",
    certified: "RevalueIQ Authorized Partner",
    address: "1088 Koramangala, Suite 300",
  },
  {
    id: 3,
    name: "GreenCircuit Service Labs",
    rating: 5.0,
    reviews: 312,
    distance: "2.1 km away",
    turnaround: "1-2 Hour Express",
    specialty: "Water Damage Recovery & Glass Refurbishing",
    certified: "ESD Master Certified",
    address: "450 Indiranagar Blvd",
  },
];

export default function RepairNetworkPreview() {
  return (
    <section className="py-24 sm:py-32 bg-slate-50 dark:bg-[#06140e] relative overflow-hidden border-t border-emerald-100 dark:border-emerald-900/40 transition-colors duration-300">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[800px] h-[500px] bg-emerald-500/5 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-8 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Nationwide Partner Network
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Certified Local{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent">
                Repair Shops
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Don't replace when you can repair. RevalueIQ connects you with 500+ verified technicians with genuine OEM components and warranty coverage.
            </p>
          </div>

          <div className="lg:col-span-4 lg:text-right">
            <Link href="/repair-shops">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl px-6 h-12 shadow-lg shadow-emerald-600/20">
                Find Repair Shops
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Map Preview & Shop Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Interactive Map Preview Visual */}
          <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 flex flex-col justify-between relative overflow-hidden min-h-[380px] shadow-xl">
            {/* Map Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-10" />

            {/* Radar Scan Ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 rounded-full border border-emerald-500/20 animate-pulse" />
              <div className="w-48 h-48 rounded-full border border-dashed border-emerald-500/30" />
            </div>

            {/* Map Pins Visual */}
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-emerald-100 dark:border-slate-800">
                <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Live Geolocation Scan
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">14 Active Nearby</span>
              </div>
            </div>

            {/* Simulated Pin Overlay Badges */}
            <div className="relative z-10 py-12 flex flex-col items-center justify-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-md">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-600/20" />
                TechMedic Repair • 0.8 km
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                GreenCircuit Labs • 2.1 km
              </div>
            </div>

            <div className="relative z-10 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Geocoding coverage across India, US & Europe
              </p>
            </div>
          </div>

          {/* Right: Repair Shop Cards */}
          <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
            {repairShops.map((shop) => (
              <div
                key={shop.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all duration-300 shadow-sm hover:shadow-xl group hover:-translate-y-1"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                      {shop.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{shop.address}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                      {shop.distance}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800/40">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{shop.rating} ({shop.reviews})</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-mono text-emerald-700 dark:text-emerald-400 mb-4">
                  Specialty: {shop.specialty}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-3 border-t border-emerald-100 dark:border-slate-800/80 text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {shop.turnaround}
                  </span>
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {shop.certified}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
