"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  Camera,
  Wrench,
  BarChart3,
  Heart,
  Recycle,
  Newspaper,
  User,
  Settings,
  LogOut,
  Leaf,
  Sparkles,
  Zap,
  X,
} from "lucide-react";

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "AI Device Valuation", path: "/upload", icon: Camera },
    { name: "Repair Advisor", path: "/repair", icon: Wrench },
    { name: "Valuation History", path: "/dashboard#history", icon: BarChart3 },
    { name: "Saved Devices", path: "/marketplace", icon: Heart },
    { name: "Circular Score", path: "/dashboard#circular-score", icon: Recycle },
    { name: "News & Trends", path: "/blog", icon: Newspaper },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/profile#settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#08111f]/95 backdrop-blur-2xl border-r border-slate-800/80 text-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top: Logo & Nav */}
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo Header */}
          <div className="p-6 border-b border-slate-800/60 flex items-center justify-between shrink-0">
            <Link
              href="/"
              onClick={onCloseMobile}
              className="inline-flex items-center gap-3 group"
            >
              <div className="bg-blue-600/15 p-2 rounded-xl group-hover:bg-blue-600/25 transition-all border border-blue-500/30">
                <Leaf className="w-5 h-5 text-blue-400" />
              </div>
              <span className="font-poppins font-extrabold text-xl tracking-tight text-white">
                Revalue<span className="text-blue-500">IQ</span>
              </span>
            </Link>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5 flex-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Core Platform
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600/20 via-cyan-500/15 to-transparent text-cyan-400 border border-blue-500/30 shadow-md shadow-blue-500/5"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Card: Storage & Tier info */}
          <div className="p-4 border-t border-slate-800/60 shrink-0 space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Enterprise Plan
                </span>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  Active
                </span>
              </div>

              {/* Scan Usage Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                  <span>AI Scans Used</span>
                  <span className="text-white font-bold">14 / 50</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-[28%]" />
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
