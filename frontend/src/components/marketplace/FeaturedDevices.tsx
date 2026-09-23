"use client";

import React from 'react';
import { MarketplaceProduct } from './types';
import { ProductCard } from './ProductCard';
import { Sparkles, ShieldCheck, Award } from 'lucide-react';

interface FeaturedDevicesProps {
  products: MarketplaceProduct[];
  wishlistIds: string[];
  onToggleWishlist: (product: MarketplaceProduct) => void;
  comparedIds: string[];
  onToggleCompare: (product: MarketplaceProduct) => void;
  onSelectProduct: (product: MarketplaceProduct) => void;
}

export const FeaturedDevices: React.FC<FeaturedDevicesProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  comparedIds,
  onToggleCompare,
  onSelectProduct,
}) => {
  const featured = products.filter((p) => p.isFeatured || p.aiAppraisal.circularEconomyScore >= 94).slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <div className="space-y-4 bg-gradient-to-r from-emerald-900/5 via-teal-900/5 to-emerald-900/5 p-6 rounded-3xl border border-emerald-100/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              Featured Circular Devices
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                Top AI Eco Choices
              </span>
            </h3>
            <p className="text-xs text-slate-500">Highest circular scores and verified diagnostic integrity</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {featured.map((product) => (
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
    </div>
  );
};
