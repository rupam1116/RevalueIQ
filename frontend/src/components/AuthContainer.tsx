"use client";

import React from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";

interface AuthContainerProps {
  children: React.ReactNode;
  showLogo?: boolean;
}

export default function AuthContainer({
  children,
  showLogo = true
}: AuthContainerProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#06140e] text-slate-100 overflow-hidden relative py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-600 selection:text-white">
      {/* Ambient Gradient Mesh Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-600/10 rounded-full blur-[160px] mix-blend-screen" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[160px] mix-blend-screen" />
        <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-green-700/10 rounded-full blur-[160px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.05]" />
      </div>

      {/* RevalueIQ Logo Header */}
      {showLogo && (
        <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-300">
          <Link href="/" className="inline-flex items-center gap-3 group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
            <div className="bg-emerald-600/15 p-3 rounded-2xl group-hover:bg-emerald-600/25 transition-all border border-emerald-500/30 shadow-lg shadow-emerald-600/10">
              <Leaf className="w-7 h-7 text-emerald-400" />
            </div>
            <span className="font-extrabold text-3xl tracking-tight text-white">
              Revalue<span className="text-emerald-400">IQ</span>
            </span>
          </Link>
        </div>
      )}

      {/* Centered Glassmorphism Auth Card */}
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
        <div className="relative">
          {/* Subtle Outer Glow Border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600/30 via-teal-500/30 to-green-600/30 rounded-[2.5rem] blur-xl opacity-50 pointer-events-none" />

          <div className="relative rounded-[2rem] bg-[#0b1a13]/90 backdrop-blur-2xl border border-emerald-900/50 p-8 sm:p-10 shadow-2xl space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
