"use client";

import React from 'react';
import { SellerInfo, MarketplaceProduct } from './types';
import { X, Star, ShieldCheck, MapPin, Clock, Award, Leaf, Recycle, MessageSquare, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SellerProfileModalProps {
  seller: SellerInfo;
  sellerProducts?: MarketplaceProduct[];
  onClose: () => void;
  onSelectProduct?: (product: MarketplaceProduct) => void;
  onContactSeller?: () => void;
}

export const SellerProfileModal: React.FC<SellerProfileModalProps> = ({
  seller,
  sellerProducts = [],
  onClose,
  onSelectProduct,
  onContactSeller,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-emerald-100 rounded-3xl max-w-2xl w-full p-6 space-y-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-emerald-100">
          <div className="relative">
            <img
              src={seller.avatar}
              alt={seller.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
            />
            {seller.verified && (
              <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{seller.name}</h2>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <Award className="w-3 h-3 text-emerald-600" /> Trust Score: {seller.trustScore || 96}%
              </span>
            </div>

            <p className="text-xs text-slate-500">{seller.bio || 'Verified RevalueIQ Circular Economy Seller'}</p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {seller.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> Replies {seller.responseTime}
              </span>
              <span>•</span>
              <span>Member since {seller.memberSince}</span>
            </div>
          </div>
        </div>

        {/* Impact & Rating Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-lg">
              <Star className="w-4 h-4 fill-amber-400" /> {seller.rating.toFixed(1)}
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Rating ({seller.reviewsCount})</p>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-2xl text-center">
            <div className="text-slate-900 font-black text-lg">{seller.totalSales}</div>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Devices Sold</p>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-2xl text-center">
            <div className="text-emerald-700 font-black text-lg flex items-center justify-center gap-1">
              <Leaf className="w-4 h-4" /> {seller.co2SavedTotalKg || 420} kg
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">CO₂ Diverted</p>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-2xl text-center">
            <div className="text-teal-700 font-black text-lg flex items-center justify-center gap-1">
              <Recycle className="w-4 h-4" /> {seller.ewasteDivertedTotalKg || 12.5} kg
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">E-Waste Prevented</p>
          </div>
        </div>

        {/* Seller Active Listings */}
        {sellerProducts.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-emerald-600" /> Other Listings by {seller.name} ({sellerProducts.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
              {sellerProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    if (onSelectProduct) {
                      onSelectProduct(p);
                      onClose();
                    }
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-2xl border border-emerald-100 hover:border-emerald-300 bg-white hover:bg-emerald-50/40 cursor-pointer transition-all"
                >
                  <img src={p.images[0]} alt={p.title} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{p.title}</h4>
                    <p className="text-xs font-black text-emerald-700">₹{p.price.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {seller.reviews && seller.reviews.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-emerald-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600" /> Buyer Feedback
            </h3>
            <div className="space-y-2">
              {seller.reviews.map((rev) => (
                <div key={rev.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{rev.reviewerName}</span>
                    <div className="flex items-center text-amber-500 font-bold text-xs">
                      <Star className="w-3 h-3 fill-amber-400 mr-1" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 italic">&ldquo;{rev.comment}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="pt-4 border-t border-emerald-100 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="rounded-2xl text-xs font-bold">
            Close
          </Button>
          {onContactSeller && (
            <Button
              onClick={() => {
                onClose();
                onContactSeller();
              }}
              className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6"
            >
              Contact Seller
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
