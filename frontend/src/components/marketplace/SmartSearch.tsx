"use client";

import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';
import { FilterState, CategoryType } from './types';
import { Button } from '@/components/ui/button';

interface SmartSearchProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onToggleMobileFilters?: () => void;
  totalResults: number;
}

const QUICK_TAGS = ['iPhone 15 Pro', 'MacBook M3', 'Sony WH-1000XM5', 'Galaxy S24', 'PlayStation 5', 'iPad Pro'];

export const SmartSearch: React.FC<SmartSearchProps> = ({
  filters,
  onFilterChange,
  onToggleMobileFilters,
  totalResults,
}) => {
  return (
    <div className="bg-white border border-emerald-100 rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Main Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search by device, model, brand, or specs..."
            className="w-full pl-11 pr-10 py-3.5 bg-emerald-50/40 border border-emerald-100 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-56">
            <ArrowUpDown className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
              className="w-full pl-9 pr-8 py-3.5 bg-white border border-emerald-200 rounded-2xl text-xs font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-xs"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="ai-score">Sort: Highest Circular Score</option>
              <option value="price-low">Sort: Price (Low to High)</option>
              <option value="price-high">Sort: Price (High to Low)</option>
              <option value="rating">Sort: Top Seller Rating</option>
            </select>
          </div>

          {/* Mobile Filter Trigger */}
          {onToggleMobileFilters && (
            <Button
              onClick={onToggleMobileFilters}
              variant="outline"
              size="lg"
              className="lg:hidden rounded-2xl border-emerald-200 bg-white text-slate-700 hover:bg-emerald-50 font-bold text-xs h-12 px-4 shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2 text-emerald-600" />
              <span>Filters</span>
            </Button>
          )}
        </div>
      </div>

      {/* Recommended Quick Search Tags */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-400 font-semibold shrink-0 flex items-center gap-1 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Trending:
        </span>
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => onFilterChange({ searchQuery: tag })}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 border ${
              filters.searchQuery === tag
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-emerald-50/60 text-emerald-800 border-emerald-100 hover:bg-emerald-100/80'
            }`}
          >
            {tag}
          </button>
        ))}

        <div className="ml-auto text-[11px] font-bold text-slate-400 shrink-0">
          Showing <span className="text-emerald-700">{totalResults}</span> devices
        </div>
      </div>
    </div>
  );
};
