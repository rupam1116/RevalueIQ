"use client";

import React from 'react';
import { MarketplaceViewMode } from './types';
import {
  ShoppingBag,
  Package,
  Heart,
  Clock,
  Plus,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarketplaceSidebarProps {
  currentView: MarketplaceViewMode;
  onSelectView: (view: MarketplaceViewMode) => void;
  wishlistCount: number;
  myListingsCount: number;
  recentlyViewedCount: number;
  onOpenSellModal: () => void;
  className?: string;
}

export const MarketplaceSidebar: React.FC<MarketplaceSidebarProps> = ({
  currentView,
  onSelectView,
  wishlistCount,
  myListingsCount,
  recentlyViewedCount,
  onOpenSellModal,
  className = '',
}) => {
  const menuItems = [
    {
      id: 'home' as const,
      label: 'Marketplace',
      icon: ShoppingBag,
      count: null,
    },
    {
      id: 'dashboard' as const,
      label: 'Seller Dashboard',
      icon: BarChart3,
      count: myListingsCount,
    },
    {
      id: 'wishlist' as const,
      label: 'Wishlist',
      icon: Heart,
      count: wishlistCount,
    },
    {
      id: 'recent' as const,
      label: 'Recently Viewed',
      icon: Clock,
      count: recentlyViewedCount,
    },
  ];

  return (
    <aside className={`w-64 shrink-0 space-y-6 ${className}`}>
      {/* Navigation Card */}
      <div className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm space-y-2">
        <div className="px-3 py-2 text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest flex items-center justify-between">
          <span>Navigation</span>
          <Sparkles className="w-3 h-3 text-emerald-600" />
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all group ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.count !== null && item.count > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`}
                  />
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Sell CTA Widget */}
      <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-sm space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>AI Instant Valuation</span>
        </div>

        <div>
          <h4 className="font-extrabold text-slate-900 text-sm">Have unused tech?</h4>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Get instant AI price appraisals & list in under 60 seconds.
          </p>
        </div>

        <Button
          onClick={onOpenSellModal}
          size="sm"
          className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-10 shadow-md shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4 mr-1" /> Sell Electronics Now
        </Button>
      </div>
    </aside>
  );
};
