"use client";

import React from 'react';
import { CategoryType } from './types';
import {
  Grid,
  Smartphone,
  Laptop,
  Tablet,
  Camera,
  Gamepad2,
  Headphones,
  Watch,
} from 'lucide-react';

interface CategoryListProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  className?: string;
}

const CATEGORY_ITEMS: { name: CategoryType; icon: React.ElementType }[] = [
  { name: 'All', icon: Grid },
  { name: 'Phones', icon: Smartphone },
  { name: 'Laptops', icon: Laptop },
  { name: 'Tablets', icon: Tablet },
  { name: 'Gaming', icon: Gamepad2 },
  { name: 'Accessories', icon: Headphones },
  { name: 'Cameras', icon: Camera },
  { name: 'Smart Watches', icon: Watch },
];

export const CategoryList: React.FC<CategoryListProps> = ({
  selectedCategory,
  onSelectCategory,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none ${className}`}>
      {CATEGORY_ITEMS.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedCategory === cat.name;

        return (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(cat.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
              isSelected
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                : 'bg-white border-emerald-100 text-slate-700 hover:bg-emerald-50'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};
