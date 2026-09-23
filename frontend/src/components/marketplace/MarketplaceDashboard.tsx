"use client";

import React from 'react';
import { MarketplaceProduct } from './types';
import { Plus, Package, DollarSign, Leaf, Eye, PauseCircle, PlayCircle, CheckCircle2, Trash2, ShieldCheck, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarketplaceDashboardProps {
  myListings: MarketplaceProduct[];
  onOpenSellModal: () => void;
  onDeleteListing: (id: string) => void;
  onTogglePauseListing: (id: string) => void;
  onMarkAsSold: (id: string) => void;
  onSelectProduct: (product: MarketplaceProduct) => void;
  onEditListing?: (product: MarketplaceProduct) => void;
}

export const MarketplaceDashboard: React.FC<MarketplaceDashboardProps> = ({
  myListings,
  onOpenSellModal,
  onDeleteListing,
  onTogglePauseListing,
  onMarkAsSold,
  onSelectProduct,
  onEditListing,
}) => {
  const activeCount = myListings.filter((i) => i.status === 'active').length;
  const soldListings = myListings.filter((i) => i.status === 'sold');
  const totalRevenue = soldListings.reduce((sum, item) => sum + item.price, 0);
  const totalCo2Saved = myListings.reduce((sum, item) => sum + (item.aiAppraisal.co2SavedKg || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-900 p-6 sm:p-8 rounded-3xl text-white shadow-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-200 text-xs font-bold backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Seller & Circular Contributor
          </div>
          <h2 className="text-2xl font-black">Marketplace Seller Dashboard</h2>
          <p className="text-emerald-100 text-xs max-w-xl">
            Track active listings, monitor real-time AI appraisals, inspect buyer inquiries, and calculate total environmental impact generated.
          </p>
        </div>

        <Button
          onClick={onOpenSellModal}
          size="lg"
          className="rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-black text-xs h-12 px-6 shadow-lg shrink-0 border-0"
        >
          <Plus className="w-4 h-4 mr-2" /> List New Electronics
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl shadow-xs space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Listings</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{activeCount}</span>
            <Package className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-[11px] text-slate-400">Listed on marketplace</p>
        </div>

        <div className="bg-white border border-emerald-100 p-5 rounded-2xl shadow-xs space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Sales</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{soldListings.length}</span>
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-[11px] text-slate-400">Successful circular trades</p>
        </div>

        <div className="bg-white border border-emerald-100 p-5 rounded-2xl shadow-xs space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales Earnings</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString("en-IN")}</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-[11px] text-slate-400">Earned from listings</p>
        </div>

        <div className="bg-white border border-emerald-100 p-5 rounded-2xl shadow-xs space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Impact Created</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">{totalCo2Saved.toFixed(1)} kg</span>
            <Leaf className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-[11px] text-slate-400">CO₂e diverted from manufacturing</p>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">Manage Your Devices ({myListings.length})</h3>
        </div>

        {myListings.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No Active Device Listings</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven&apos;t listed any pre-owned electronics yet. Start by creating a listing with instant AI Valuation.
            </p>
            <Button onClick={onOpenSellModal} className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
              <Plus className="w-4 h-4 mr-1.5" /> Sell First Device
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-emerald-100 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="pb-3 px-3">Device Details</th>
                  <th className="pb-3 px-3">Price</th>
                  <th className="pb-3 px-3">Circular Score</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Views / Inquiries</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {myListings.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        {item.images && item.images.length > 0 ? (
                          <img src={item.images[0]} alt={item.title} className="w-10 h-10 rounded-xl object-cover border border-emerald-100" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p onClick={() => onSelectProduct(item)} className="font-extrabold text-slate-900 cursor-pointer hover:text-emerald-700">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-slate-400">{item.brand} • {item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-extrabold text-slate-900">
                      ₹{item.price.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        {item.aiAppraisal.circularEconomyScore}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider ${
                          item.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : item.status === 'sold'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : item.status === 'draft'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 font-black'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 font-semibold">
                      {item.viewsCount} views • {item.inquiriesCount} inquiries
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectProduct(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="Preview Listing"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {onEditListing && item.status !== 'sold' && (
                          <button
                            onClick={() => onEditListing(item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-100 transition-colors"
                            title="Edit Listing (Replace Photo / Info)"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {item.status !== 'sold' && (
                          <button
                            onClick={() => onTogglePauseListing(item.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              item.status !== 'active'
                                ? 'text-emerald-600 hover:bg-emerald-100 hover:text-emerald-800'
                                : 'text-slate-500 hover:text-amber-700 hover:bg-amber-100'
                            }`}
                            title={item.status === 'active' ? 'Pause Listing' : 'Publish Listing'}
                          >
                            {item.status === 'active' ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4 text-emerald-600" />}
                          </button>
                        )}
                        {item.status !== 'sold' && (
                          <button
                            onClick={() => onMarkAsSold(item.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-100 transition-colors"
                            title="Mark as Sold"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteListing(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-100 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
