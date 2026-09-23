"use client";

import React, { useState } from 'react';
import { X, Clock, AlertTriangle, Wrench, Package, CheckCircle2, Bookmark, Heart, ShieldAlert, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RepairGuide } from '@/lib/mockCommunityData';

interface GuideDetailModalProps {
  guide: RepairGuide;
  onClose: () => void;
}

export const GuideDetailModal: React.FC<GuideDetailModalProps> = ({ guide, onClose }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(guide.isBookmarked || false);
  const [isLiked, setIsLiked] = useState(guide.isLiked || false);

  const toggleStep = (stepNum: number) => {
    if (completedSteps.includes(stepNum)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepNum));
    } else {
      setCompletedSteps([...completedSteps, stepNum]);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200';
      case 'Medium':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200';
      default:
        return 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#06140e] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-emerald-900/40 bg-slate-50/50 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${getDifficultyColor(guide.difficulty)}`}>
              {guide.difficulty} Difficulty
            </span>
            <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" /> {guide.estimatedTime}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-emerald-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Title & Image */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {guide.title}
            </h2>
            <div className="flex items-center gap-3">
              <img
                src={guide.author.avatar}
                alt={guide.author.name}
                className="w-8 h-8 rounded-full object-cover border border-emerald-200"
              />
              <div>
                <p className="font-extrabold text-slate-900 dark:text-white text-xs">{guide.author.name}</p>
                <p className="text-[10px] text-emerald-600 font-bold">{guide.author.role}</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-video border border-emerald-100 dark:border-emerald-900/40">
              <img src={guide.image} alt={guide.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Warning Note */}
          {guide.warningNote && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold mb-0.5">Safety Warning</p>
                <p className="leading-relaxed font-medium">{guide.warningNote}</p>
              </div>
            </div>
          )}

          {/* Tools & Parts Required */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200/80 dark:border-emerald-900/40 space-y-2">
              <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-emerald-600" /> Tools Required
              </h4>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 font-medium">
                {guide.toolsRequired.map((tool, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {tool}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200/80 dark:border-emerald-900/40 space-y-2">
              <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-4 h-4 text-teal-600" /> Parts Needed
              </h4>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 font-medium">
                {guide.partsNeeded.map((part, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> {part}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Step-by-Step Repair Instructions ({completedSteps.length}/{guide.steps.length} completed)
              </h4>
            </div>

            <div className="space-y-3">
              {guide.steps.map((step) => {
                const isDone = completedSteps.includes(step.stepNumber);
                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => toggleStep(step.stepNumber)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isDone
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700'
                        : 'bg-white dark:bg-[#06140e] border-slate-200 dark:border-emerald-900/40 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-emerald-950 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {step.stepNumber}
                        </div>
                        <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">
                          {step.title}
                        </h5>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">
                        {isDone ? 'Completed' : 'Click to complete'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium pl-8">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-emerald-900/40 bg-slate-50/50 dark:bg-emerald-950/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-1.5 ${
                isLiked ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} /> Helpful
            </button>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-1.5 ${
                isBookmarked ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-emerald-600 text-emerald-600' : ''}`} /> Save Guide
            </button>
          </div>

          <Button onClick={onClose} size="sm" className="rounded-2xl bg-emerald-600 text-white font-extrabold text-xs px-5">
            Done Reading
          </Button>
        </div>
      </div>
    </div>
  );
};
