"use client";

import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl overflow-hidden p-4 animate-pulse flex flex-col space-y-4"
        >
          {/* Image Placeholder */}
          <div className="w-full h-48 bg-slate-800/70 rounded-xl" />

          {/* Title & Badge */}
          <div className="space-y-2">
            <div className="h-4 bg-slate-800/80 rounded w-3/4" />
            <div className="h-3 bg-slate-800/60 rounded w-1/2" />
          </div>

          {/* AI Metrics */}
          <div className="flex justify-between items-center pt-2">
            <div className="h-6 bg-slate-800/80 rounded-full w-24" />
            <div className="h-6 bg-slate-800/80 rounded-full w-16" />
          </div>

          {/* Price & Location */}
          <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center">
            <div className="h-6 bg-slate-800/90 rounded w-20" />
            <div className="h-4 bg-slate-800/60 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};
