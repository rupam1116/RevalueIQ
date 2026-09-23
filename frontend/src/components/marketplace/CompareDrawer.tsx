"use client";

import React, { useState } from 'react';
import { MarketplaceProduct } from './types';
import { X, ShieldCheck, Scale, ArrowRight, Trash2, Shield, Leaf, Recycle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompareDrawerProps {
  comparedProducts: MarketplaceProduct[];
  onRemoveProduct: (id: string) => void;
  onClearAll: () => void;
  onSelectProduct: (product: MarketplaceProduct) => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  comparedProducts,
  onRemoveProduct,
  onClearAll,
  onSelectProduct,
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  if (comparedProducts.length === 0) return null;

  return (
    <>
      {/* Bottom Launcher Bar */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 z-40 bg-white/95 border border-emerald-200 shadow-xl backdrop-blur-md rounded-2xl p-3 sm:px-6 flex items-center justify-between gap-4 max-w-2xl text-slate-900 transition-all duration-300">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 shrink-0">
            <Scale className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900">Compare Devices</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-200">
                {comparedProducts.length} / 4
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate hidden sm:block">
              {comparedProducts.map((p) => p.title).join(', ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClearAll}
            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Button
            onClick={() => setIsOpenModal(true)}
            size="sm"
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 border-0"
          >
            <span>Compare Matrix</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </div>

      {/* Side-by-Side Comparison Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Side-by-Side Device Comparison</h3>
                  <p className="text-xs text-slate-500">AI Diagnostic Integrity & Circular Impact Matrix</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClearAll}
                  className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsOpenModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-emerald-100">
                    <th className="p-4 text-slate-400 font-bold uppercase w-44">Attribute</th>
                    {comparedProducts.map((p) => (
                      <th key={p.id} className="p-4 min-w-[210px]">
                        <div className="space-y-2">
                          <div className="relative h-28 rounded-2xl overflow-hidden bg-slate-950 border border-emerald-100">
                            <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                            <button
                              onClick={() => onRemoveProduct(p.id)}
                              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-950/80 hover:bg-red-600 text-white transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="font-extrabold text-slate-900 text-sm line-clamp-1">{p.title}</p>
                          <p className="text-emerald-700 font-black text-sm">₹{p.price.toLocaleString("en-IN")}</p>
                          <Button
                            onClick={() => {
                              setIsOpenModal(false);
                              onSelectProduct(p);
                            }}
                            size="sm"
                            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                          >
                            Inspect Product
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  <tr>
                    <td className="p-4 font-bold text-slate-700">Category</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-4 text-slate-600 font-medium">{p.category}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-700">AI Cosmetic Grade</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-200">
                          {p.aiAppraisal.cosmeticGrade || 'Grade A'}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-700">Circular Score</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-4 font-black text-emerald-700">
                        {p.aiAppraisal.circularEconomyScore}/100
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-700">Environmental Impact</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-4 text-slate-700 font-bold">
                        <div className="space-y-0.5">
                          <p className="text-emerald-700 flex items-center gap-1">
                            <Leaf className="w-3 h-3" /> {p.aiAppraisal.co2SavedKg} kg CO₂
                          </p>
                          <p className="text-teal-700 flex items-center gap-1">
                            <Recycle className="w-3 h-3" /> {p.aiAppraisal.ewasteDivertedKg} kg e-waste
                          </p>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-700">Warranty Coverage</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-4 text-emerald-800 font-bold flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{p.warranty}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-700">Seller Rating</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-4 text-amber-500 font-bold">
                        ★ {p.seller.rating.toFixed(1)} ({p.seller.name})
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
