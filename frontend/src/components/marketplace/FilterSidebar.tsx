"use client";

import React from 'react';
import { FilterState, ConditionGrade } from './types';
import { Filter, RotateCcw, ShieldCheck, Wrench, IndianRupee, Award, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const BRANDS = ['Apple', 'Sony', 'Samsung', 'Dell', 'Bose', 'Nintendo', 'Canon', 'DJI'];
const CONDITIONS: { grade: ConditionGrade; label: string }[] = [
  { grade: 'A+', label: 'Pristine / Mint' },
  { grade: 'A', label: 'Excellent' },
  { grade: 'B+', label: 'Very Good' },
  { grade: 'B', label: 'Good' },
  { grade: 'C', label: 'Fair / Refurbished' },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const toggleBrand = (brand: string) => {
    const current = filters.brand;
    const next = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    onFilterChange({ brand: next });
  };

  const toggleCondition = (grade: ConditionGrade) => {
    const current = filters.conditionGrades;
    const next = current.includes(grade)
      ? current.filter((g) => g !== grade)
      : [...current, grade];
    onFilterChange({ conditionGrades: next });
  };

  const content = (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-100/80 text-emerald-700">
            <Filter className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Refine Search</h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onResetFilters}
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-full px-2.5"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> Max Price
          </span>
          <span className="text-emerald-700 font-extrabold">
            ₹{filters.priceRange[1].toLocaleString("en-IN")}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={500000}
          step={5000}
          value={filters.priceRange[1]}
          onChange={(e) =>
            onFilterChange({
              priceRange: [filters.priceRange[0], parseInt(e.target.value)],
            })
          }
          className="w-full accent-emerald-600 cursor-pointer bg-emerald-100 rounded-lg h-2"
        />
      </div>

      {/* Brand Checkboxes */}
      <div className="space-y-2.5 pt-4 border-t border-emerald-100">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Brand
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {BRANDS.map((b) => {
            const checked = filters.brand.includes(b);
            return (
              <button
                key={b}
                onClick={() => toggleBrand(b)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all border font-semibold ${
                  checked
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-emerald-50/40 border-emerald-100 text-slate-700 hover:bg-emerald-100/60'
                }`}
              >
                <span>{b}</span>
                {checked && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Condition Grade */}
      <div className="space-y-2.5 pt-4 border-t border-emerald-100">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-emerald-600" /> Condition Grade
        </label>
        <div className="space-y-1.5">
          {CONDITIONS.map((c) => {
            const checked = filters.conditionGrades.includes(c.grade);
            return (
              <button
                key={c.grade}
                onClick={() => toggleCondition(c.grade)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all border ${
                  checked
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                    : 'bg-white border-emerald-100 text-slate-700 hover:bg-emerald-50/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
                    {c.grade}
                  </span>
                  <span>{c.label}</span>
                </div>
                {checked && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimum Circular Score */}
      <div className="space-y-3 pt-4 border-t border-emerald-100">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Min Circular Score
          </span>
          <span className="text-emerald-700 font-extrabold">{filters.minCircularScore}+ / 100</span>
        </div>
        <input
          type="range"
          min={0}
          max={95}
          step={5}
          value={filters.minCircularScore}
          onChange={(e) => onFilterChange({ minCircularScore: parseInt(e.target.value) })}
          className="w-full accent-emerald-600 cursor-pointer bg-emerald-100 rounded-lg h-2"
        />
      </div>

      {/* Repairable & Warranty Toggles */}
      <div className="space-y-2 pt-4 border-t border-emerald-100">
        <label className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100 cursor-pointer hover:bg-emerald-100/50 transition-colors">
          <div className="flex items-center gap-2 text-xs">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <Wrench className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Modular / Repairable</p>
              <p className="text-[10px] text-slate-500">Easily replaceable parts</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={filters.repairableOnly}
            onChange={(e) => onFilterChange({ repairableOnly: e.target.checked })}
            className="w-4 h-4 rounded accent-emerald-600"
          />
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 shrink-0 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sticky top-24 self-start">
        {content}
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs bg-white border-l border-emerald-100 p-6 h-full overflow-y-auto">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
