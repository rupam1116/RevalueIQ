"use client";

import React, { useState } from 'react';
import {
  MessageSquare,
  Heart,
  Bookmark,
  Share2,
  Flag,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Award,
  Send,
  Image as ImageIcon,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommunityPost } from '@/lib/mockCommunityData';

interface CommunityFeedProps {
  posts: CommunityPost[];
  onSelectPost: (post: CommunityPost) => void;
  onToggleLike: (postId: string) => void;
  onToggleBookmark: (postId: string) => void;
  onAddReply: (postId: string, text: string) => void;
  onReportPost?: (postId: string) => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  posts,
  onSelectPost,
  onToggleLike,
  onToggleBookmark,
  onAddReply,
  onReportPost,
}) => {
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'Repair Expert':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'NGO':
        return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Moderator':
        return 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Verified Contributor':
        return 'bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800';
      default: // Student
        return 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
  };

  const handleShare = (postId: string) => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedId(postId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {}
  };

  const handleSendReply = (postId: string) => {
    if (!replyText.trim()) return;
    onAddReply(postId, replyText.trim());
    setReplyText('');
    setActiveReplyId(null);
  };

  if (posts.length === 0) {
    return (
      <div className="bg-white dark:bg-[#06140e] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-12 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">No discussions found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Try clearing your search filters or be the first community member to start a discussion!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const isLiked = post.isLiked;
        const isBookmarked = post.isBookmarked;

        return (
          <div
            key={post.id}
            className="bg-white dark:bg-[#06140e] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 space-y-4"
          >
            {/* Header: Author Info & Role */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-200 dark:border-emerald-800"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {post.author.name}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getRoleBadgeStyle(
                        post.author.role
                      )}`}
                    >
                      {post.author.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>{post.timeAgo}</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                      <Award className="w-3 h-3" /> {post.author.karmaPoints} pts
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-emerald-950/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-emerald-800">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-2 cursor-pointer" onClick={() => onSelectPost(post)}>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 font-medium">
                {post.description}
              </p>
            </div>

            {/* Optional Images */}
            {post.images && post.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {post.images.map((imgUrl, i) => (
                  <div
                    key={i}
                    onClick={() => onSelectPost(post)}
                    className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 group cursor-pointer"
                  >
                    <img
                      src={imgUrl}
                      alt="Post attachment"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center text-[10px] font-extrabold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-slate-200/60 dark:border-emerald-900/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => onToggleLike(post.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                    isLiked
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-emerald-950/60'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{post.likesCount}</span>
                </button>

                <button
                  onClick={() => onSelectPost(post)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-emerald-950/60 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{post.repliesCount} Replies</span>
                </button>

                <button
                  onClick={() => onToggleBookmark(post.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                    isBookmarked
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-emerald-950/60'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                  <span className="hidden sm:inline">Bookmark</span>
                </button>

                <button
                  onClick={() => handleShare(post.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-emerald-950/60 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">{copiedId === post.id ? 'Copied!' : 'Share'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {onReportPost && (
                  <button
                    onClick={() => onReportPost(post.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Report Post"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                )}
                <Button
                  onClick={() => onSelectPost(post)}
                  size="sm"
                  variant="ghost"
                  className="rounded-xl font-extrabold text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
                >
                  Read More <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Quick Reply Drawer / Field */}
            {activeReplyId === post.id && (
              <div className="pt-3 border-t border-slate-100 dark:border-emerald-900/40 flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a community reply..."
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-emerald-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Button
                  onClick={() => handleSendReply(post.id)}
                  size="sm"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 h-9"
                >
                  <Send className="w-3.5 h-3.5 mr-1" /> Send
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
