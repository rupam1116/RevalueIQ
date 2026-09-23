"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Leaf, Wrench, ShoppingBag, MapPin,
  Recycle, Users, Clock, Bookmark, User, Settings, LogOut,
  ShieldCheck, ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ProtectedSidebarProps {
  className?: string;
  onSelectMobileRoute?: () => void;
}

export const ProtectedSidebar: React.FC<ProtectedSidebarProps> = ({
  className = '',
  onSelectMobileRoute,
}) => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    {
      group: 'Core Platform',
      items: [
        { name: 'Eco Dashboard', path: '/dashboard', icon: LayoutDashboard, exact: true },
        { name: 'AI Device Valuation', path: '/valuation', icon: Leaf },
        { name: 'Repair Advisor', path: '/repair', icon: Wrench },
        { name: 'Eco Marketplace', path: '/marketplace', icon: ShoppingBag },
        { name: 'Repair Shops', path: '/repair-shops', icon: MapPin },
        { name: 'Donation Centers', path: '/donation', icon: Recycle },
        { name: 'Eco Community', path: '/community', icon: Users },
      ],
    },
    {
      group: 'History & Saved',
      items: [
        { name: 'Valuation History', path: '/history', icon: Clock },
        { name: 'Saved Devices', path: '/history', icon: Bookmark },
      ],
    },
    {
      group: 'Account',
      items: [
        { name: 'Profile', path: '/profile', icon: User },
        { name: 'Settings', path: '/settings', icon: Settings },
      ],
    },
  ];

  const checkIsActive = (path: string, exact: boolean = false) => {
    if (exact) return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <aside className={`w-64 shrink-0 bg-white dark:bg-[#06140e] border-r border-emerald-100 dark:border-emerald-900/50 p-4 flex flex-col justify-between overflow-y-auto ${className}`}>
      <div className="space-y-6">
        {navItems.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <span className="px-3 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest block mb-2">
              {sec.group}
            </span>
            <nav className="space-y-1">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = checkIsActive(item.path, item.exact);

                return (
                  <Link
                    key={item.path + item.name}
                    href={item.path}
                    onClick={onSelectMobileRoute}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 group ${
                      isActive
                        ? 'bg-emerald-100/60 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-emerald-50 dark:bg-emerald-950 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.name}</span>
                    </div>

                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer Area */}
      <div className="space-y-3 pt-4 border-t border-emerald-100 dark:border-emerald-900/40 mt-6">
        {/* Subscription Badge */}
        <div className="rounded-2xl bg-emerald-50/50 dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-3 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Circular Plan
            </span>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full font-bold">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Unlimited circular AI scans & repair diagnostics.</p>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 text-xs font-bold transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
};
