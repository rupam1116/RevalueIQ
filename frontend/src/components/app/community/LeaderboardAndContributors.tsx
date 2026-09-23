"use client";

import React, { useState } from 'react';
import { Trophy, Award, Crown, CheckCircle2, UserCheck, Flame, Medal, Sparkles, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_CONTRIBUTORS, MOCK_LEADERBOARD, Contributor, LeaderboardUser } from '@/lib/mockCommunityData';

export const LeaderboardAndContributors: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contributors' | 'experts' | 'helpful' | 'active'>('contributors');
  const [contributors, setContributors] = useState<Contributor[]>(MOCK_CONTRIBUTORS);

  const toggleFollow = (id: string) => {
    setContributors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFollowing: !c.isFollowing } : c))
    );
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
          <Crown className="w-4 h-4 text-amber-950" />
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-black text-xs flex items-center justify-center shadow-md">
          2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="w-7 h-7 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center shadow-md">
          3
        </span>
      );
    }
    return (
      <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-emerald-950 text-slate-600 dark:text-slate-400 font-extrabold text-xs flex items-center justify-center">
        {rank}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation Header */}
      <div className="bg-white dark:bg-[#06140e] border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-3xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Button
            onClick={() => setActiveTab('contributors')}
            variant={activeTab === 'contributors' ? 'default' : 'ghost'}
            size="sm"
            className={`rounded-2xl text-xs font-extrabold ${
              activeTab === 'contributors'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-emerald-50'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Top Contributors
          </Button>

          <Button
            onClick={() => setActiveTab('experts')}
            variant={activeTab === 'experts' ? 'default' : 'ghost'}
            size="sm"
            className={`rounded-2xl text-xs font-extrabold ${
              activeTab === 'experts'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-emerald-50'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 mr-1.5 text-teal-400" /> Repair Experts
          </Button>

          <Button
            onClick={() => setActiveTab('helpful')}
            variant={activeTab === 'helpful' ? 'default' : 'ghost'}
            size="sm"
            className={`rounded-2xl text-xs font-extrabold ${
              activeTab === 'helpful'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-emerald-50'
            }`}
          >
            <Award className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> Most Helpful Members
          </Button>

          <Button
            onClick={() => setActiveTab('active')}
            variant={activeTab === 'active' ? 'default' : 'ghost'}
            size="sm"
            className={`rounded-2xl text-xs font-extrabold ${
              activeTab === 'active'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-emerald-50'
            }`}
          >
            <Flame className="w-3.5 h-3.5 mr-1.5 text-rose-400" /> Most Active Members
          </Button>
        </div>
      </div>

      {/* Top 3 Podium Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_LEADERBOARD.slice(0, 3).map((user) => (
          <div
            key={user.id}
            className={`relative rounded-3xl p-5 border text-center space-y-3 shadow-sm transition-all duration-200 ${
              user.rank === 1
                ? 'bg-gradient-to-b from-amber-500/10 via-white to-white dark:from-amber-500/10 dark:via-[#06140e] dark:to-[#06140e] border-amber-300 dark:border-amber-700/60'
                : 'bg-white dark:bg-[#06140e] border-emerald-100 dark:border-emerald-900/50'
            }`}
          >
            <div className="absolute top-4 right-4">{getRankBadge(user.rank)}</div>

            <div className="relative w-16 h-16 mx-auto">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover border-2 border-emerald-500 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black">
                {user.streakDays}d
              </span>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">{user.name}</h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold">{user.role}</p>
              <p className="text-[11px] text-slate-400 font-medium">{user.level}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-emerald-900/40 flex items-center justify-around text-xs font-bold">
              <div>
                <p className="text-slate-400 text-[10px]">Points</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-black">{user.points}</p>
              </div>
              <div className="h-6 w-px bg-slate-200 dark:bg-emerald-900/40" />
              <div>
                <p className="text-slate-400 text-[10px]">Solved</p>
                <p className="text-slate-800 dark:text-white font-black">{user.solvedQuestions}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard Table & Contributor Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Ranking Table */}
        <div className="lg:col-span-7 bg-white dark:bg-[#06140e] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" /> Global Eco Credits Leaderboard
          </h3>

          <div className="space-y-2">
            {MOCK_LEADERBOARD.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-100 dark:border-emerald-900/40 hover:border-emerald-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getRankBadge(user.rank)}
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-emerald-200"
                  />
                  <div>
                    <h5 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                      {user.name}
                    </h5>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                      <span className="text-emerald-600 dark:text-emerald-400">{user.role}</span>
                      <span>•</span>
                      <span>{user.solvedQuestions} Solved</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {user.points} pts
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium">{user.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Contributor Profile Cards */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-teal-600" /> Featured Experts & Advocates
          </h3>

          <div className="space-y-3">
            {contributors.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-3xl bg-white dark:bg-[#06140e] border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-10 h-10 rounded-full object-cover border border-emerald-200"
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{c.name}</h4>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">
                        {c.role} • {c.location}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => toggleFollow(c.id)}
                    size="sm"
                    variant={c.isFollowing ? 'outline' : 'default'}
                    className={`rounded-2xl text-xs font-extrabold px-3 h-8 ${
                      c.isFollowing
                        ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {c.isFollowing ? 'Following' : '+ Follow'}
                  </Button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium line-clamp-2">
                  {c.bio}
                </p>

                <div className="flex flex-wrap gap-1">
                  {c.badges.map((b, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg text-[9px] font-extrabold bg-slate-100 dark:bg-emerald-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-emerald-800"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
