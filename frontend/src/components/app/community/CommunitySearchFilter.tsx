"use client";

import React from 'react';
import { Search, X, SlidersHorizontal, Sparkles, Flame, ThumbsUp, Wrench, ShoppingBag, HeartHandshake, Recycle, Megaphone, Lightbulb, Trophy } from 'lucide-react';
import { FilterChip } from '@/lib/mockCommunityData';

interface CommunitySearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeChip: FilterChip;
  onSelectChip: (chip: FilterChip) => void;
  totalResults: number;
}

export const CommunitySearchFilter: React.FC<CommunitySearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  activeChip,
  onSelectChip,
  totalResults,
}) => {
  const chips: { name: FilterChip; icon: React.ComponentType<{ className?: string }> }[] = [
    { name: 'Latest', icon: Sparkles },
    { name: 'Trending', icon: Flame },
    { name: 'Most Helpful', icon: ThumbsUp },
    { name: 'Repair', icon: Wrench },
    { name: 'Marketplace', icon: ShoppingBag },
    { name: 'Donation', icon: HeartHandshake },
    { name: 'Circular Economy', icon: Recycle },
    { name: 'Announcements', icon: Megaphone },
    { name: 'Tips', icon: Lightbulb },
    { name: 'Success Stories', icon: Trophy },
  ];

  return (
    <div className="bg-white dark:bg-[#06140e] border border-emerald-100 dark:border-emerald-900/50 p-5 rounded-3xl shadow-sm space-y-4">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-emerald-600 dark:text-emerald-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search discussions, repair guides or community posts..."
          className="w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-800/60 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Horizontal Filter Chips */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-2">
          {chips.map((chip) => {
            const IconComponent = chip.icon;
            const isActive = activeChip === chip.name;
            return (
              <button
                key={chip.name}
                onClick={() => onSelectChip(chip.name)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30 scale-[1.02]'
                    : 'bg-slate-100 dark:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/60 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200/80 dark:border-emerald-900/40'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                {chip.name}
              </button>
            );
          })}
        </div>

        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0 hidden sm:inline-block">
          {totalResults} discussions
        </span>
      </div>
    </div>
  );
};
