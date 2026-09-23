"use client";

import React, { useState } from 'react';
import { BookOpen, Clock, Eye, Heart, Bookmark, ArrowUpRight, Sparkles, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RepairGuide } from '@/lib/mockCommunityData';
import { GuideDetailModal } from './GuideDetailModal';

interface RepairGuidesSectionProps {
  guides: RepairGuide[];
}

export const RepairGuidesSection: React.FC<RepairGuidesSectionProps> = ({ guides }) => {
  const [selectedGuide, setSelectedGuide] = useState<RepairGuide | null>(null);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Medium':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Step-by-Step Community Repair Guides
        </h3>
        <span className="text-[11px] font-extrabold text-slate-400">
          {guides.length} guides available
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="group bg-white dark:bg-[#06140e] border border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-700/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            {/* Guide Cover Image */}
            <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-900">
              <img
                src={guide.image}
                alt={guide.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getDifficultyBadge(guide.difficulty)}`}>
                  {guide.difficulty}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" /> {guide.estimatedTime}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {guide.category}
                </span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                  {guide.title}
                </h4>
              </div>

              {/* Author & Stats */}
              <div className="pt-3 border-t border-slate-100 dark:border-emerald-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={guide.author.avatar}
                      alt={guide.author.name}
                      className="w-6 h-6 rounded-full object-cover border border-emerald-200"
                    />
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                      {guide.author.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" /> {guide.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500" /> {guide.likes}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setSelectedGuide(guide)}
                  className="w-full rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 hover:text-white text-emerald-700 dark:text-emerald-300 font-extrabold text-xs h-10 border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Read Guide
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedGuide && (
        <GuideDetailModal guide={selectedGuide} onClose={() => setSelectedGuide(null)} />
      )}
    </div>
  );
};
