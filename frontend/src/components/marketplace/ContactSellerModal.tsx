"use client";

import React, { useState } from 'react';
import { MarketplaceProduct } from './types';
import { MessageSquare, Send, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContactSellerModalProps {
  product: MarketplaceProduct | null;
  onClose: () => void;
}

export const ContactSellerModal: React.FC<ContactSellerModalProps> = ({
  product,
  onClose,
}) => {
  const [offerPrice, setOfferPrice] = useState<string>(
    product ? product.price.toString() : ''
  );
  const [message, setMessage] = useState<string>(
    product
      ? `Hi ${product.seller.name}, I am interested in purchasing your ${product.title}. Is it still available?`
      : ''
  );
  const [isSent, setIsSent] = useState(false);

  if (!product) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white border border-emerald-100 rounded-3xl shadow-2xl overflow-hidden text-slate-900 p-6 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Contact Seller</h3>
              <p className="text-xs text-slate-500">Inquire about {product.title}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSent ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-slate-900">Offer & Message Sent!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {product.seller.name} has been notified via RevalueIQ Escrow Chat.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            {/* Offer Price Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Your Offer Amount (₹):</label>
              <input
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-4 py-2.5 text-sm font-extrabold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <p className="text-[10px] text-slate-500">Listed Price: ₹{product.price.toLocaleString("en-IN")}</p>
            </div>

            {/* Custom Message Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Message to Seller:</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-emerald-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>

              <Button
                type="submit"
                size="sm"
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 border-0"
              >
                <Send className="w-4 h-4 mr-2" />
                <span>Send Offer & Message</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
