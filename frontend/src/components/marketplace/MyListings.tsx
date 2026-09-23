"use client";

import React, { useState } from 'react';
import { MarketplaceProduct } from './types';
import {
  Eye,
  MessageSquare,
  PauseCircle,
  PlayCircle,
  Trash2,
  Edit,
  CheckCircle2,
  Plus,
  Package,
  Clock,
  Sparkles,
  Leaf,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MyListingsProps {
  myListings: MarketplaceProduct[];
  onOpenSellModal: () => void;
  onDeleteListing: (id: string) => void;
  onTogglePauseListing: (id: string) => void;
  onMarkAsSold: (id: string) => void;
  onSelectProduct: (product: MarketplaceProduct) => void;
}

export const MyListings: React.FC<MyListingsProps> = ({
  myListings,
  onOpenSellModal,
  onDeleteListing,
  onTogglePauseListing,
  onMarkAsSold,
  onSelectProduct,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'sold'>('active');

  const filteredListings = myListings.filter((item) => {
    if (activeTab === 'active') return item.status === 'active';
    if (activeTab === 'sold') return item.status === 'sold';
    if (activeTab === 'pending') return item.status === 'pending' || item.status === 'draft';
    return true;
  });

  const activeCount = myListings.filter((i) => i.status === 'active').length;
  const soldCount = myListings.filter((i) => i.status === 'sold').length;
  const pendingCount = myListings.filter((i) => i.status === 'pending' || i.status === 'draft').length;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 dark:border-emerald-900/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Eco Listings Dashboard</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold border border-emerald-200 dark:border-emerald-800">
              {myListings.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Manage your active pre-owned device sales & circular stats</p>
        </div>

        <Button
          onClick={onOpenSellModal}
          size="sm"
          className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 border-0"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>List New Device</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-emerald-100 dark:border-emerald-900/40 pb-3">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'active'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-slate-600 dark:text-slate-400 hover:bg-emerald-100'
          }`}
        >
          Active Listings ({activeCount})
        </button>
        <button
          onClick={() => setActiveTab('sold')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'sold'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-slate-600 dark:text-slate-400 hover:bg-emerald-100'
          }`}
        >
          Sold ({soldCount})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-slate-600 dark:text-slate-400 hover:bg-emerald-100'
          }`}
        >
          Pending / Drafts ({pendingCount})
        </button>
      </div>

      {/* Listings Grid */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all shadow-xl"
            >
              <div className="flex gap-4">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-24 h-24 rounded-2xl object-cover border border-emerald-100 dark:border-emerald-900/40 cursor-pointer"
                  onClick={() => onSelectProduct(item)}
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-200 dark:border-emerald-800">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: #{item.id}</span>
                  </div>

                  <h4
                    onClick={() => onSelectProduct(item)}
                    className="font-bold text-slate-900 dark:text-white text-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer truncate"
                  >
                    {item.title}
                  </h4>

                  <div className="flex items-baseline gap-2">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">₹{item.price.toLocaleString("en-IN")}</span>
                    <span className="text-[10px] text-slate-400 line-through">₹{item.originalPrice.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-semibold"><Eye className="w-3.5 h-3.5 text-emerald-500" /> {item.viewsCount} views</span>
                    <span className="flex items-center gap-1 font-semibold"><MessageSquare className="w-3.5 h-3.5 text-teal-500" /> {item.inquiriesCount} inquiries</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.status === 'active' && (
                    <button
                      onClick={() => onMarkAsSold(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-200 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Sold
                    </button>
                  )}

                  {item.status !== 'sold' && (
                    <button
                      onClick={() => onTogglePauseListing(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                    >
                      {item.status === 'pending' ? <PlayCircle className="w-3.5 h-3.5" /> : <PauseCircle className="w-3.5 h-3.5" />}
                      {item.status === 'pending' ? 'Activate' : 'Pause'}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDeleteListing(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-emerald-100 dark:border-emerald-900/50 bg-white dark:bg-[#0b1a13] p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No {activeTab} listings</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            You currently do not have any devices in your {activeTab} section. List your pre-owned electronics now with automatic AI appraisal.
          </p>
          <Button
            onClick={onOpenSellModal}
            size="sm"
            className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold px-6 shadow-md border-0"
          >
            Sell a Device Now
          </Button>
        </div>
      )}
    </div>
  );
};
