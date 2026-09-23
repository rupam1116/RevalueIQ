"use client";

import React from 'react';
import { CategoryType } from './types';
import { Smartphone, Laptop, Tablet, Camera, Gamepad2, Headphones, Watch, Grid } from 'lucide-react';

interface CategoryCardsProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  categoryCounts?: Record<string, number>;
}

const CATEGORIES: { id: CategoryType; label: string; icon: React.ElementType }[] = [
  { id: 'All', label: 'All Devices', icon: Grid },
  { id: 'Phones', label: 'Smartphones', icon: Smartphone },
  { id: 'Laptops', label: 'Laptops & PCs', icon: Laptop },
  { id: 'Tablets', label: 'Tablets', icon: Tablet },
  { id: 'Gaming', label: 'Gaming Consoles', icon: Gamepad2 },
  { id: 'Accessories', label: 'Audio & Gear', icon: Headphones },
  { id: 'Cameras', label: 'Cameras & Lenses', icon: Camera },
  { id: 'Smart Watches', label: 'Wearables', icon: Watch },
];

export const CategoryCards: React.FC<CategoryCardsProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedCategory === cat.id;
        const count = categoryCounts[cat.id] || 0;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`p-3.5 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between group cursor-pointer ${
              isSelected
                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-600 shadow-md shadow-emerald-900/10'
                : 'bg-white hover:bg-emerald-50/50 border-emerald-100 text-slate-800 hover:border-emerald-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100/70 text-emerald-700 group-hover:bg-emerald-200/70'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                  isSelected ? 'bg-white/20 text-emerald-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                }`}
              >
                {count > 0 ? `${count} live` : 'Verified'}
              </span>
            </div>

            <div>
              <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                {cat.label}
              </h4>
              <p className={`text-[10px] mt-0.5 font-medium ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                {count} {count === 1 ? 'item' : 'items'}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
