"use client";

import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import {
  Bell,
  Plus,
  User,
  LogOut,
  Sparkles,
  Menu,
  ShieldCheck,
  Tag,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';


interface MarketplaceTopNavProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSellModal: () => void;
  onToggleMobileSidebar?: () => void;
}

const MOCK_NOTIFICATIONS: { id: string; title: string; desc: string; time: string; read: boolean }[] = [];

export const MarketplaceTopNav: React.FC<MarketplaceTopNavProps> = ({
  searchQuery,
  onSearchChange,
  onOpenSellModal,
  onToggleMobileSidebar,
}) => {
  const { user, logout } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left Area: Mobile Menu & Logo */}
      <div className="flex items-center gap-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <span className="font-extrabold text-slate-100 text-base tracking-tight">
              Revalue<span className="text-cyan-400">IQ</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 block -mt-1 tracking-wider uppercase">
              AI Marketplace
            </span>
          </div>
        </Link>
      </div>

      {/* Middle Area: Search Bar */}
      <div className="flex-1 max-w-xl mx-2">
        <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
      </div>

      {/* Right Area: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-all shadow-sm"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-slate-950 animate-pulse" />
            )}
          </button>

          {isNotifOpen && (
            <div
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-2xl shadow-2xl p-4 z-50 text-slate-900 dark:text-white space-y-3 animate-in fade-in zoom-in-95 transition-all duration-200"
            >
              <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-2 text-xs">
                <span className="font-bold text-slate-900 dark:text-white">Resale & Eco AI Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border text-xs space-y-0.5 ${
                      !n.read
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-slate-900 dark:text-white font-semibold'
                        : 'bg-white dark:bg-[#0b1a13] border-emerald-100 dark:border-emerald-900/30 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sell Product Primary CTA */}
        <Button
          onClick={onOpenSellModal}
          size="sm"
          className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs px-5 h-9 shadow-lg shadow-cyan-500/25 hidden md:flex"
        >
          <Plus className="w-4 h-4 mr-1" /> Sell a Device
        </Button>

        {/* User Profile Avatar / Menu */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-full bg-slate-900 border border-slate-700/60 hover:border-cyan-500/60 transition-all"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user?.displayName || "User"}
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-cyan-600/30 text-cyan-300 font-bold text-xs flex items-center justify-center border border-cyan-500/40">
                {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </button>

          {isProfileOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-2xl shadow-2xl p-3 z-50 text-slate-900 dark:text-white space-y-2 text-xs animate-in fade-in zoom-in-95 transition-all duration-200"
            >
              <div className="px-3 py-2 border-b border-emerald-100 dark:border-emerald-900/40">
                <p className="font-bold text-slate-900 dark:text-white truncate">
                  {user?.displayName || 'Eco Member'}
                </p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>

              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-bold"
              >
                <User className="w-3.5 h-3.5" /> Profile & Settings
              </Link>

              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left font-bold"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
