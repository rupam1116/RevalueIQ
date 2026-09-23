"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Menu, Sparkles, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import ProfileDropdown from "./ProfileDropdown";

interface TopNavbarProps {
  onToggleMobileSidebar: () => void;
}

export default function TopNavbar({ onToggleMobileSidebar }: TopNavbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dummyNotifications = [
    {
      id: 1,
      title: "AI Appraisal Completed",
      desc: "iPhone 14 Pro valuation updated to ₹68,500.",
      time: "10 mins ago",
      icon: Sparkles,
      color: "text-cyan-400 bg-cyan-500/10",
    },
    {
      id: 2,
      title: "Repair Dispatch Confirmed",
      desc: "Authorized service center booked for laptop screen repair.",
      time: "2 hours ago",
      icon: CheckCircle2,
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      id: 3,
      title: "Circular Economy Reward",
      desc: "+150 CO2 Diverted points added to your profile.",
      time: "1 day ago",
      icon: ShieldCheck,
      color: "text-blue-400 bg-blue-500/10",
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#08111f]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input Trigger */}
        <button
          type="button"
          onClick={() => setSearchModalOpen(true)}
          className="w-full max-w-sm flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs font-medium transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          <Search className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          <span className="truncate">Search AI appraisals, repair guides, parts...</span>
          <kbd className="hidden sm:inline-block ml-auto text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Notifications, Theme Toggle, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Notifications Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-800/90 text-slate-300 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0f172a]/95 backdrop-blur-2xl border border-slate-800 shadow-2xl p-4 z-50 animate-in zoom-in-95 duration-150 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="font-poppins font-bold text-sm text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-400" /> Notifications
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    3 New
                  </span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {dummyNotifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div
                        key={n.id}
                        className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition-colors"
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${n.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-bold text-white truncate">{n.title}</h5>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{n.desc}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Divider */}
        <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block" />

        {/* Profile Dropdown */}
        <ProfileDropdown />
      </div>

      {/* Global Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] w-full max-w-xl rounded-3xl border border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-400" /> Instant AI Workspace Search
              </h3>
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type device name, appraisal ID, or repair guide..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:outline-none text-white text-sm"
            />

            <div className="text-xs text-slate-500 space-y-2">
              <p className="font-bold uppercase tracking-wider text-[10px] text-slate-400">Quick Shortcuts</p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/upload"
                  onClick={() => setSearchModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white"
                >
                  📷 Scan New Device
                </Link>
                <Link
                  href="/repair"
                  onClick={() => setSearchModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white"
                >
                  🛠 Repair Advisor
                </Link>
                <Link
                  href="/marketplace"
                  onClick={() => setSearchModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white"
                >
                  🛒 Marketplace Tech
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
