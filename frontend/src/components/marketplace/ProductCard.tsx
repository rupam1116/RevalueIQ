"use client";

import React from 'react';
import { MarketplaceProduct } from './types';
import { WishlistButton } from './WishlistButton';
import {
  ShieldCheck,
  Star,
  CheckSquare,
  Square,
  Leaf,
  Eye,
  Shield,
  Recycle,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: MarketplaceProduct;
  isWishlisted: boolean;
  onToggleWishlist: (product: MarketplaceProduct) => void;
  isCompared: boolean;
  onToggleCompare: (product: MarketplaceProduct) => void;
  onSelectProduct: (product: MarketplaceProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  isCompared,
  onToggleCompare,
  onSelectProduct,
}) => {
  const savings = Math.max(0, product.originalPrice - product.price);
  const discountPercent = product.originalPrice > 0 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative rounded-3xl border border-emerald-100 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-900 cursor-pointer flex items-center justify-center" onClick={() => onSelectProduct(product)}>
        {product.images && product.images.length > 0 && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80";
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-95 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-slate-400 p-4">
            <Recycle className="w-12 h-12 text-emerald-400/60 mb-2 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xs font-semibold text-slate-300 tracking-wide">{product.category || 'Device'}</span>
            <span className="text-[10px] text-emerald-400/80 font-mono mt-1">RevalueIQ Authenticated</span>
          </div>
        )}

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          {/* AI Verified or Sold Out Badge */}
          {product.status === 'sold' ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/95 text-white font-extrabold text-[10px] backdrop-blur-md border border-rose-500 shadow-md">
              <span>SOLD OUT</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-900/90 text-emerald-300 font-extrabold text-[10px] backdrop-blur-md border border-emerald-700/60 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Verified</span>
            </div>
          )}

          {/* Wishlist Button */}
          <div className="pointer-events-auto">
            <WishlistButton
              isSaved={isWishlisted}
              onToggle={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
              size="sm"
            />
          </div>
        </div>

        {/* Sold Overlay Banner */}
        {product.status === 'sold' && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center pointer-events-none z-10">
            <span className="text-white font-black text-sm tracking-widest uppercase bg-rose-700/90 border border-rose-500 px-4 py-1.5 rounded-full shadow-xl rotate-[-4deg]">
              Sold Out
            </span>
          </div>
        )}

        {/* Floating Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="pointer-events-auto rounded-full bg-white text-slate-900 font-extrabold text-xs shadow-lg hover:bg-emerald-50 px-4 py-2 flex items-center gap-1.5 border-0"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600" /> Quick View
          </Button>
        </div>

        {/* Bottom Badges Bar */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none text-[10px]">
          {/* Circular Score Badge */}
          <span className="px-2 py-0.5 rounded-md bg-slate-950/85 text-emerald-300 font-bold backdrop-blur-md border border-emerald-800/60 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            {product.aiAppraisal.circularEconomyScore}/100 Circular Score
          </span>

          {/* Condition Badge */}
          <span className="px-2 py-0.5 rounded-md bg-slate-950/85 text-amber-300 font-bold backdrop-blur-md border border-amber-800/60">
            {product.aiAppraisal.cosmeticGrade || 'Grade A+'}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Title & Category Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>{product.brand} • {product.category}</span>

            {/* Compare Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(product);
              }}
              className={`flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors ${
                isCompared ? 'text-emerald-700 font-extrabold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isCompared ? <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> : <Square className="w-3.5 h-3.5" />}
              <span>Compare</span>
            </button>
          </div>

          <h3
            onClick={() => onSelectProduct(product)}
            className="text-base font-extrabold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors cursor-pointer"
          >
            {product.title}
          </h3>
        </div>

        {/* Pricing Block */}
        <div className="space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">₹{product.price.toLocaleString("en-IN")}</span>
              <span className="text-xs text-slate-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
            </div>

            {discountPercent > 0 && (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                Save {discountPercent}% (₹{savings.toLocaleString("en-IN")})
              </span>
            )}
          </div>

          {/* Warranty Badge */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-xl border border-emerald-100/80">
            <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{product.warranty}</span>
          </div>

          {/* Environmental Impact Metrics */}
          <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1 text-emerald-700 font-bold shrink-0">
              <Leaf className="w-3.5 h-3.5" />
              <span>{product.aiAppraisal.co2SavedKg} kg CO₂e</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1 text-teal-700 font-bold shrink-0">
              <Recycle className="w-3.5 h-3.5" />
              <span>{product.aiAppraisal.ewasteDivertedKg} kg e-waste</span>
            </div>
          </div>
        </div>

        {/* Seller Info Footer */}
        <div className="flex items-center justify-between text-xs pt-3 border-t border-emerald-100">
          <div className="flex items-center gap-2">
            <img
              src={product.seller.avatar}
              alt={product.seller.name}
              className="w-6 h-6 rounded-full object-cover border border-emerald-200"
            />
            <span className="truncate max-w-[110px] font-bold text-slate-800">{product.seller.name}</span>
          </div>

          <div className="flex items-center text-amber-500 font-bold text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
            <span>{product.seller.rating.toFixed(1)}</span>
            <span className="text-[10px] text-slate-400 font-normal ml-0.5">({product.seller.reviewsCount})</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            size="sm"
            onClick={() => onSelectProduct(product)}
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-9"
          >
            Quick View
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onToggleCompare(product)}
            className={`w-full rounded-xl text-xs font-bold h-9 border ${
              isCompared
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'border-emerald-200 text-slate-700 hover:bg-emerald-50'
            }`}
          >
            {isCompared ? 'Comparing' : '+ Compare'}
          </Button>
        </div>
      </div>
    </div>
  );
};
