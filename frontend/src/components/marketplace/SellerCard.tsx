"use client";

import React from 'react';
import { SellerInfo } from './types';
import { Star, ShieldCheck, Clock, ShoppingBag, MapPin, MessageSquare, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SellerCardProps {
  seller: SellerInfo;
  onContactSeller?: () => void;
  onOpenProfile?: () => void;
  compact?: boolean;
}

export const SellerCard: React.FC<SellerCardProps> = ({
  seller,
  onContactSeller,
  onOpenProfile,
  compact = false,
}) => {
  return (
    <div className={`rounded-3xl border border-emerald-100 bg-white ${compact ? 'p-4' : 'p-5'} text-slate-900 shadow-sm relative overflow-hidden group`}>
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative cursor-pointer" onClick={onOpenProfile}>
          <img
            src={seller.avatar}
            alt={seller.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm group-hover:scale-105 transition-transform"
          />
          {seller.verified && (
            <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow-xs" title="Verified Seller">
              <ShieldCheck className="w-3.5 h-3.5 font-bold" />
            </span>
          )}
        </div>

        {/* Name & Basic Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              onClick={onOpenProfile}
              className="font-extrabold text-slate-900 text-base truncate hover:text-emerald-700 cursor-pointer flex items-center gap-1"
            >
              {seller.name}
              {onOpenProfile && <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
            </h4>
            {seller.verified && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                Verified
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
            <div className="flex items-center text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
              <span>{seller.rating.toFixed(1)}</span>
              <span className="text-slate-400 ml-1">({seller.reviewsCount})</span>
            </div>
            <span>•</span>
            <div className="flex items-center text-slate-500">
              <MapPin className="w-3 h-3 mr-1 text-emerald-600" />
              <span className="truncate">{seller.location}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {onContactSeller && (
          <Button
            onClick={onContactSeller}
            variant="outline"
            size="sm"
            className="rounded-xl border-emerald-200 text-emerald-800 hover:bg-emerald-50 text-xs font-bold px-4 h-9 shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            Contact
          </Button>
        )}
      </div>

      {!compact && (
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-emerald-100 text-center text-xs">
          <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
            <div className="flex items-center justify-center text-slate-400 mb-0.5 text-[10px] font-bold uppercase">
              <Clock className="w-3 h-3 mr-1 text-emerald-600" />
              <span>Response</span>
            </div>
            <p className="font-extrabold text-slate-900">{seller.responseTime}</p>
          </div>

          <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
            <div className="flex items-center justify-center text-slate-400 mb-0.5 text-[10px] font-bold uppercase">
              <ShoppingBag className="w-3 h-3 mr-1 text-teal-600" />
              <span>Sales</span>
            </div>
            <p className="font-extrabold text-slate-900">{seller.totalSales} items</p>
          </div>

          <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
            <div className="flex items-center justify-center text-slate-400 mb-0.5 text-[10px] font-bold uppercase">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              <span>Member</span>
            </div>
            <p className="font-extrabold text-slate-900">{seller.memberSince}</p>
          </div>
        </div>
      )}
    </div>
  );
};
