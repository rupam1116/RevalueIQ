"use client";

import React from "react";
import { Smartphone, Laptop, Gamepad2, Headphones, Watch, Cpu, Zap, Truck, ShieldCheck, Layers } from "lucide-react";

interface FilterChipsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CATEGORY_CHIPS = [
  { id: "All", label: "All Categories", icon: Layers },
  { id: "Smartphones", label: "Smartphones", icon: Smartphone },
  { id: "Laptops", label: "Laptops & MacBooks", icon: Laptop },
  { id: "Gaming Consoles", label: "Gaming Consoles", icon: Gamepad2 },
  { id: "Audio", label: "Audio & Headphones", icon: Headphones },
  { id: "Smartwatches", label: "Smartwatches", icon: Watch },
  { id: "Micro-soldering", label: "Micro-soldering", icon: Cpu },
  { id: "Fast Turnaround", label: "Express 1-Hr", icon: Zap },
  { id: "Pickup Available", label: "Free Pickup", icon: Truck },
  { id: "Certified OEM", label: "OEM Certified", icon: ShieldCheck },
];

export const FilterChips: React.FC<FilterChipsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
        {CATEGORY_CHIPS.map((chip) => {
          const Icon = chip.icon;
          const isSelected = selectedCategory === chip.id;

          return (
            <button
              key={chip.id}
              onClick={() => onSelectCategory(chip.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 shrink-0 border cursor-pointer ${
                isSelected
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20 scale-[1.02]"
                  : "bg-white dark:bg-[#0b1a13] border-emerald-200/80 dark:border-emerald-900/60 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-emerald-600 dark:text-emerald-400"}`} />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
