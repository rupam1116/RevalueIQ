"use client";

import React from 'react';
import { Heart } from 'lucide-react';

interface WishlistButtonProps {
  isSaved: boolean;
  onToggle: (e: React.MouseEvent) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  isSaved,
  onToggle,
  className = '',
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonSizes = {
    sm: 'p-1.5',
    md: 'p-2.5',
    lg: 'p-3',
  };

  return (
    <button
      onClick={onToggle}
      aria-label={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
      className={`rounded-full transition-all duration-300 shadow-md backdrop-blur-md border cursor-pointer hover:scale-[1.05] active:scale-95 ${
        isSaved
          ? 'bg-rose-500/20 border-rose-500/50 text-rose-500 hover:bg-rose-500/30'
          : 'bg-white/80 dark:bg-[#0b1a13]/80 border-emerald-100 dark:border-emerald-900/40 text-slate-400 hover:text-rose-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/60'
      } ${buttonSizes[size]} ${className}`}
    >
      <Heart
        className={`${iconSizes[size]} transition-colors ${
          isSaved ? 'fill-rose-500 text-rose-500' : ''
        }`}
      />
    </button>
  );
};
