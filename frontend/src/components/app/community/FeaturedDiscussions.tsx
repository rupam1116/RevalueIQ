"use client";

import React from 'react';
import { Pin, Flame, MessageSquare, Eye, Heart, ArrowUpRight, Sparkles } from 'lucide-react';
import { CommunityPost } from '@/lib/mockCommunityData';

interface FeaturedDiscussionsProps {
  posts: CommunityPost[];
  onSelectPost: (post: CommunityPost) => void;
}

export const FeaturedDiscussions: React.FC<FeaturedDiscussionsProps> = ({
  posts,
  onSelectPost,
}) => {
  const featuredPosts = posts.filter((p) => p.isPinned || p.isTrending).slice(0, 2);

  if (featuredPosts.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" /> Featured Discussions
        </h3>
        <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
          Community Highlights
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featuredPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => onSelectPost(post)}
            className="group relative bg-white dark:bg-[#06140e] border border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-700/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Badges row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {post.category}
                  </span>
                  {post.isPinned && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      <Pin className="w-3 h-3 text-amber-500 fill-amber-500" /> Pinned
                    </span>
                  )}
                  {post.isTrending && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      <Flame className="w-3 h-3 text-rose-500 fill-rose-500" /> Trending
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                  {post.timeAgo}
                </span>
              </div>

              {/* Title & Preview */}
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                {post.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
                {post.description}
              </p>
            </div>

            {/* Author & Metrics footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-emerald-900/40 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-7 h-7 rounded-full object-cover border border-emerald-200 dark:border-emerald-800"
                />
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-slate-100 text-[11px]">
                    {post.author.name}
                  </p>
                  <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {post.author.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {post.repliesCount}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" /> {post.likesCount}
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
