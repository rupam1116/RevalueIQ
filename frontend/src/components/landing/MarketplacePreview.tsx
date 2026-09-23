"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const previewProducts = [
  {
    id: 1,
    title: "iPhone 15 Pro Max - 256GB",
    specs: "Titanium • Unlocked • Battery 98%",
    originalPrice: "₹1,19,900",
    aiValuedPrice: "₹78,500",
    grade: "Grade A+ Refurbished",
    co2Saved: "42 kg CO₂",
    warranty: "12-Mo Warranty",
    badge: "Hot Deal",
  },
  {
    id: 2,
    title: "MacBook Pro 16\" M3 Max",
    specs: "36GB RAM • 1TB SSD • Space Black",
    originalPrice: "₹3,49,900",
    aiValuedPrice: "₹2,45,000",
    grade: "Grade A Mint",
    co2Saved: "185 kg CO₂",
    warranty: "12-Mo Warranty",
    badge: "Top Tier",
  },
  {
    id: 3,
    title: "iPad Pro 12.9\" M2 Chip",
    specs: "128GB • Wi-Fi • Space Gray",
    originalPrice: "₹1,09,900",
    aiValuedPrice: "₹68,000",
    grade: "Grade A+ Refurbished",
    co2Saved: "35 kg CO₂",
    warranty: "12-Mo Warranty",
    badge: "Popular",
  },
  {
    id: 4,
    title: "Sony WH-1000XM5 Headphones",
    specs: "Active Noise Cancelling • Black",
    originalPrice: "₹34,900",
    aiValuedPrice: "₹22,000",
    grade: "Grade A Refurbished",
    co2Saved: "12 kg CO₂",
    warranty: "6-Mo Warranty",
    badge: "Eco Choice",
  },
];

export default function MarketplacePreview() {
  return (
    <section className="py-24 sm:py-32 bg-white dark:bg-[#06140e] relative overflow-hidden border-t border-emerald-100 dark:border-emerald-900/40 transition-colors duration-300">
      {/* Subtle Mesh Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-1/4 w-[750px] h-[500px] bg-emerald-500/5 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Circular Marketplace Preview
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Verified Refurbished{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent">
                Tech Store
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Every device is AI-inspected, backed by a 50-point hardware checklist, and includes a full warranty.
            </p>
          </div>

          <div>
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl px-6 h-12 shadow-lg shadow-emerald-600/20">
                Explore Marketplace
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {previewProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl bg-slate-50 dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all duration-300 shadow-sm hover:shadow-xl group hover:-translate-y-1.5 relative"
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                  {product.badge}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>4.9</span>
                </div>
              </div>

              {/* Title & Specs */}
              <div className="space-y-1 mb-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {product.specs}
                </p>
              </div>

              {/* Grade & Warranty Pills */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {product.grade}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">{product.warranty}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between border border-emerald-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Carbon Offset:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{product.co2Saved}</span>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="pt-4 border-t border-emerald-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 line-through mr-2">{product.originalPrice}</span>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white">{product.aiValuedPrice}</span>
                </div>
                <Link href="/signup">
                  <Button size="sm" variant="ghost" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 px-3">
                    View <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
