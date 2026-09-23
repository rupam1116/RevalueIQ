"use client";

import React from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import AuthIllustration from "./AuthIllustration";

interface AuthLayoutProps {
  children: React.ReactNode;
  variant?: "split" | "centered";
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({
  children,
  variant = "split",
  title = "Welcome Back",
  subtitle = "Continue your AI-powered circular economy journey.",
}: AuthLayoutProps) {
  return (
    <div className="fixed inset-0 z-50 bg-[#06140e] text-slate-100 overflow-y-auto selection:bg-emerald-600 selection:text-white flex flex-col min-h-screen">
      {/* Dynamic Background Canvas */}
      <AnimatedBackground />

      {/* Top Header Identity */}
      <header className="w-full px-6 sm:px-10 py-6 flex items-center justify-between z-20 shrink-0">
        <Link href="/" className="inline-flex items-center gap-3 group hover:scale-[1.02] transition-transform duration-300">
          <div className="bg-emerald-500/10 p-2.5 rounded-2xl group-hover:bg-emerald-500/20 transition-all border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
            <Leaf className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Revalue<span className="text-emerald-400">IQ</span>
          </span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 z-10">
        {variant === "split" ? (
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Side: Illustration */}
            <div className="lg:col-span-6 hidden lg:block h-full animate-in fade-in slide-in-from-left-6 duration-300">
              <AuthIllustration />
            </div>

            {/* Right Side: Auth Form Container */}
            <div className="lg:col-span-6 w-full max-w-md mx-auto animate-in fade-in slide-in-from-right-6 duration-300">
              {children}
            </div>
          </div>
        ) : (
          /* Centered Variant */
          <div className="w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-300">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
