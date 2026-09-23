"use client";

import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Greeting Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-slate-800/80 rounded-xl" />
        <div className="h-4 w-96 bg-slate-900/80 rounded-lg" />
      </div>

      {/* Stats Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="h-4 w-24 bg-slate-800 rounded" />
            <div className="h-8 w-32 bg-slate-800 rounded-lg" />
            <div className="h-3 w-40 bg-slate-800/60 rounded" />
          </div>
        ))}
      </div>

      {/* Quick Action Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="h-10 w-10 bg-slate-800 rounded-xl" />
            <div className="h-5 w-36 bg-slate-800 rounded" />
          </div>
        ))}
      </div>

      {/* Table & Panel Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 h-96 bg-slate-900/80 border border-slate-800 rounded-3xl p-6" />
        <div className="lg:col-span-4 h-96 bg-slate-900/80 border border-slate-800 rounded-3xl p-6" />
      </div>
    </div>
  );
}
