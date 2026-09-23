"use client";

import React from 'react';
import { MarketplaceProduct, FilterState } from './types';
import { ProductGrid } from './ProductGrid';
import { Heart, Leaf, Recycle, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WishlistSectionProps {
  wishlistProducts: MarketplaceProduct[];
  wishlistIds: string[];
  onToggleWishlist: (product: MarketplaceProduct) => void;
  comparedIds: string[];
  onToggleCompare: (product: MarketplaceProduct) => void;
  onSelectProduct: (product: MarketplaceProduct) => void;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onClearWishlist?: () => void;
}

export const WishlistSection: React.FC<WishlistSectionProps> = ({
  wishlistProducts,
  wishlistIds,
  onToggleWishlist,
  comparedIds,
  onToggleCompare,
  onSelectProduct,
  filters,
  onFilterChange,
  onClearWishlist,
}) => {
  const totalCo2Saved = wishlistProducts.reduce((sum, p) => sum + (p.aiAppraisal.co2SavedKg || 0), 0);
  const totalEwasteDiverted = wishlistProducts.reduce((sum, p) => sum + (p.aiAppraisal.ewasteDivertedKg || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-rose-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Bookmarked Devices ({wishlistProducts.length})
          </div>
          <h2 className="text-2xl font-black text-slate-900">Your Saved Wishlist</h2>
          <p className="text-xs text-slate-600">
            Keep track of prices, condition updates, and AI circular appraisals for devices you are interested in acquiring.
          </p>
        </div>

        {wishlistProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>{totalCo2Saved.toFixed(1)} kg CO₂e Potential Savings</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-2 text-xs font-extrabold text-teal-800">
              <Recycle className="w-4 h-4 text-teal-600" />
              <span>{totalEwasteDiverted.toFixed(2)} kg E-Waste Diverted</span>
            </div>
          </div>
        )}
      </div>

      {/* Grid of Wishlist Items */}
      <ProductGrid
        products={wishlistProducts}
        wishlistIds={wishlistIds}
        onToggleWishlist={onToggleWishlist}
        comparedIds={comparedIds}
        onToggleCompare={onToggleCompare}
        onSelectProduct={onSelectProduct}
        filters={filters}
        onFilterChange={onFilterChange}
        title="Saved Wishlist Items"
        subtitle="Saved pre-owned devices ready for purchase"
      />
    </div>
  );
};
