"use client";

import React from 'react';
import { Users, HelpCircle, BookOpen, UserCheck, MessageSquare, Plus, Sparkles, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_COMMUNITY_STATS } from '@/lib/mockCommunityData';

interface CommunityHeroHeaderProps {
  onOpenCreatePost: () => void;
  onSelectTab: (tab: string) => void;
}

export const CommunityHeroHeader: React.FC<CommunityHeroHeaderProps> = ({
  onOpenCreatePost,
  onSelectTab,
}) => {
  const statCards = [
    {
      label: 'Community Members',
      value: MOCK_COMMUNITY_STATS.totalMembers,
      icon: Users,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-100 dark:border-emerald-900/40',
    },
    {
      label: 'Questions Solved',
      value: MOCK_COMMUNITY_STATS.questionsSolved,
      icon: HelpCircle,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/50 border-teal-100 dark:border-teal-900/40',
    },
    {
      label: 'Repair Guides',
      value: MOCK_COMMUNITY_STATS.repairGuides,
      icon: BookOpen,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-100 dark:border-cyan-900/40',
    },
    {
      label: 'Expert Contributors',
      value: MOCK_COMMUNITY_STATS.expertContributors,
      icon: UserCheck,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-100 dark:border-indigo-900/40',
    },
    {
      label: 'Posts This Month',
      value: MOCK_COMMUNITY_STATS.postsThisMonth,
      icon: MessageSquare,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/50 border-amber-100 dark:border-amber-900/40',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#06140e] border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Circular Knowledge Platform
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Community Hub
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Learn, Share and Build a Sustainable Future Together. Ask repair questions, share restoration experiences, publish step-by-step guides, and collaborate with recyclers & experts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={onOpenCreatePost}
              className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs px-5 h-11 shadow-md shadow-emerald-600/20 border-0 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 mr-2" /> Create Discussion Post
            </Button>
            <Button
              onClick={() => onSelectTab('guides')}
              variant="outline"
              className="rounded-2xl border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-bold text-xs px-4 h-11 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" /> Browse Repair Guides
            </Button>
          </div>
        </div>
      </div>

      {/* 5 Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat, idx) => {
          const IconComp = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#06140e] border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-tight">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-xl border ${stat.bgColor}`}>
                  <IconComp className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
