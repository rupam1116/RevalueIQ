"use client";

import React from "react";
import {
  LayoutDashboard,
  Leaf,
  Wrench,
  ShoppingBag,
  MapPin,
  Gift,
  Users,
  User,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  emoji: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", shortLabel: "Dashboard", icon: LayoutDashboard, emoji: "🏠" },
  { id: "valuation", label: "AI Valuation", shortLabel: "Valuation", icon: Leaf, emoji: "🌱" },
  { id: "repair", label: "Repair Advisor", shortLabel: "Repair", icon: Wrench, emoji: "🛠" },
  { id: "marketplace", label: "Marketplace", shortLabel: "Market", icon: ShoppingBag, emoji: "🛒" },
  { id: "repair-shops", label: "Repair Shops", shortLabel: "Shops", icon: MapPin, emoji: "📍" },
  { id: "donation", label: "Donation Centers", shortLabel: "Donation", icon: Gift, emoji: "🎁" },
  { id: "community", label: "Community", shortLabel: "Community", icon: Users, emoji: "👥" },
  { id: "profile", label: "Profile", shortLabel: "Profile", icon: User, emoji: "👤" },
];

interface AppBottomNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const AppBottomNav: React.FC<AppBottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-2 sm:px-4 pb-2 sm:pb-4 pt-1 pointer-events-none">
      <div className="max-w-5xl mx-auto pointer-events-auto">
        <div className="relative rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-[#0b1a13]/90 backdrop-blur-2xl border border-emerald-100 dark:border-emerald-900/50 shadow-2xl px-2 sm:px-3 py-1.5 sm:py-2">
          <ul className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <li key={item.id} className="relative shrink-0">
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={`
                      relative flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl sm:rounded-2xl text-[11px] font-bold
                      transition-all duration-200 cursor-pointer
                      ${
                        isActive
                          ? "text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600 dark:text-emerald-400" : ""}`} />
                    <span className="truncate max-w-[64px] sm:max-w-none">{item.shortLabel}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};
