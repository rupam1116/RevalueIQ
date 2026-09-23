"use client";

import React, { useState } from 'react';
import { MarketplaceProduct, FilterState } from './types';
import { ProductCard } from './ProductCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { LayoutGrid, List, SlidersHorizontal, PackageSearch, RefreshCw } from 'lucide-react';

interface ProductGridProps {
  products: MarketplaceProduct[];
  wishlistIds: string[];
  onToggleWishlist: (product: MarketplaceProduct) => void;
  comparedIds: string[];
  onToggleCompare: (product: MarketplaceProduct) => void;
  onSelectProduct: (product: MarketplaceProduct) => void;
  isLoading?: boolean;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onOpenMobileFilters?: () => void;
  onOpenSellModal?: () => void;
  title?: string;
  subtitle?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  comparedIds,
  onToggleCompare,
  onSelectProduct,
  isLoading = false,
  filters,
  onFilterChange,
  onOpenMobileFilters,
  onOpenSellModal,
  title,
  subtitle,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-6">
      {/* Top Header & View Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-emerald-100 p-4 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>{title || 'AI Verified Electronics'}</span>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {products.length} {products.length === 1 ? 'device' : 'devices'}
            </span>
          </h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Mobile Filter Trigger */}
          {onOpenMobileFilters && (
            <button
              onClick={onOpenMobileFilters}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              <span>Filters</span>
            </button>
          )}

          {/* Grid / List Mode Toggle */}
          <div className="hidden sm:flex items-center p-1 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Compact View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : products.length > 0 ? (
        <div
          className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              isCompared={comparedIds.includes(product.id)}
              onToggleCompare={onToggleCompare}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-emerald-100 bg-white p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100/80 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700">
            <PackageSearch className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            {filters.searchQuery || filters.category !== 'All' || filters.brand.length > 0
              ? 'No Electronics Found'
              : 'No Electronics Listed Yet'}
          </h3>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            {filters.searchQuery || filters.category !== 'All' || filters.brand.length > 0
              ? "We couldn't find any verified circular electronics matching your current search query or active filter criteria."
              : "No devices have been listed yet. Be the first circular pioneer to list your verified pre-owned electronics!"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {filters.searchQuery || filters.category !== 'All' || filters.brand.length > 0 ? (
              <button
                onClick={() =>
                  onFilterChange({
                    category: 'All',
                    brand: [],
                    searchQuery: '',
                    priceRange: [0, 500000],
                    minCircularScore: 0,
                    repairableOnly: false,
                  })
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
              </button>
            ) : onOpenSellModal ? (
              <button
                onClick={onOpenSellModal}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                + List Your First Device
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
