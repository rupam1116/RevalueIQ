"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Leaf, Command } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectSuggestion?: (term: string) => void;
  className?: string;
}

const POPULAR_SEARCHES = [
  'iPhone 15 Pro Max',
  'MacBook Pro M3',
  'Sony WH-1000XM5',
  'PlayStation 5',
  'iPad Pro M2',
  'Apple Watch Ultra 2',
  'Galaxy S24 Ultra',
];

const RECENT_DEFAULT = ['MacBook Pro', 'Sony Headphones', 'PS5 Digital'];

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onSelectSuggestion,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(RECENT_DEFAULT);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (term: string) => {
    onSearchChange(term);
    if (onSelectSuggestion) onSelectSuggestion(term);

    // Save to recent
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item !== term);
      return [term, ...filtered].slice(0, 5);
    });

    setIsOpen(false);
  };

  const handleClear = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-xl ${className}`}>
      {/* Search Input Container */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-4 h-4 text-emerald-600 dark:text-emerald-400 pointer-events-none" />

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search AI appraised circular electronics (e.g. iPhone 15, M3 MacBook)..."
          className="w-full pl-11 pr-24 py-3 bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-full text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-inner backdrop-blur-xl"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {searchQuery ? (
            <button
              onClick={handleClear}
              className="p-1 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="hidden sm:flex items-center text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
              <Command className="w-2.5 h-2.5 mr-0.5" /> K
            </span>
          )}
        </div>
      </div>

      {/* Autocomplete Popover */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl shadow-2xl p-4 z-50 backdrop-blur-2xl transition-all duration-200 animate-in fade-in zoom-in-95"
        >
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-bold text-slate-500 mb-2 px-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Recent Searches
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSelect(term)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all flex items-center gap-1"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div>
            <div className="text-xs font-bold text-slate-500 mb-2 px-2 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Popular Circular Electronics
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SEARCHES.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSelect(item)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all flex items-center gap-1"
                >
                  <span>{item}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
