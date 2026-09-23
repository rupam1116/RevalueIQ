"use client";

import React from "react";
import { Check } from "lucide-react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", label, error, checked, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <label className="flex items-start gap-3 cursor-pointer select-none group">
          <div className="relative mt-0.5 shrink-0">
            <input
              type="checkbox"
              ref={ref}
              checked={checked}
              className="peer sr-only"
              {...props}
            />
            <div className="w-4 h-4 rounded-md bg-slate-950 border border-slate-800 peer-checked:bg-gradient-to-tr peer-checked:from-cyan-500 peer-checked:to-blue-600 peer-checked:border-cyan-400 peer-focus-visible:ring-2 peer-focus-visible:ring-cyan-500/40 transition-all flex items-center justify-center shadow-inner group-hover:border-slate-700">
              <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity stroke-[3]" />
            </div>
          </div>
          {label && <span className="text-xs font-medium text-slate-300 leading-tight group-hover:text-white transition-colors">{label}</span>}
        </label>
        {error && <p className="text-xs font-semibold text-red-400 pl-7">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
