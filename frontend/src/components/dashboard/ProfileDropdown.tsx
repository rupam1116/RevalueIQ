"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { User as UserIcon, Settings, LogOut, ShieldCheck, ChevronDown, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Enterprise User";
  const userEmail = user?.email || "user@revalueiq.com";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
      >
        <Avatar className="h-9 w-9 border border-blue-500/30 shadow-md">
          <AvatarImage src={user?.photoURL || undefined} alt={displayName} />
          <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-xs">
            {initial}
          </AvatarFallback>
        </Avatar>

        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-bold text-white truncate max-w-[110px]">
            {displayName}
          </span>
          <span className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> AI Pro Tier
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          {/* Backdrop click dismiss */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0f172a]/95 backdrop-blur-2xl border border-slate-800 shadow-2xl p-2 z-50 animate-in zoom-in-95 duration-150 space-y-1 text-slate-200">
            {/* Header info */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 mb-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-white truncate">{displayName}</p>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
            </div>

            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-800/80 hover:text-cyan-400 transition-colors"
            >
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span>My Profile</span>
            </Link>

            <Link
              href="/profile#settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-800/80 hover:text-cyan-400 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Account Settings</span>
            </Link>

            <div className="h-px bg-slate-800/80 my-1" />

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Log out</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
