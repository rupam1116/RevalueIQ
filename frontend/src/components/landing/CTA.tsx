"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section id="contact" className="py-24 sm:py-32 bg-white dark:bg-[#06140e] relative overflow-hidden border-t border-emerald-100 dark:border-emerald-900/40 transition-colors duration-300">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-emerald-600/10 via-teal-500/10 to-green-500/10 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div
          className="relative rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-slate-900 dark:via-[#0b1a13] dark:to-slate-950 border border-emerald-200 dark:border-emerald-900/50 p-10 sm:p-16 lg:p-20 text-center shadow-2xl overflow-hidden transition-all duration-300"
        >
          {/* Top Gradient Border Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-green-400" />

          {/* Glowing Central Orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400">
              <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Get Started Today
            </div>

            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Ready to Join the{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent">
                Circular Economy?
              </span>
            </h2>

            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Evaluate your devices with instant AI condition grading, find top-rated repair shops near you, or sell refurbished hardware on our certified marketplace.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="text-base font-semibold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white border-0 shadow-2xl shadow-emerald-600/30 px-9 h-14 rounded-2xl hover:scale-105 transition-all duration-300"
                >
                  Start Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base font-medium h-14 rounded-2xl px-8 gap-2 bg-white dark:bg-slate-900/80 hover:bg-emerald-50 dark:hover:bg-slate-800 border-emerald-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-white backdrop-blur-md transition-all duration-300"
                >
                  <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Contact Us
                </Button>
              </Link>
            </div>

            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> No Credit Card Required
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Free AI Device Scan
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Instant Valuation Report
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
