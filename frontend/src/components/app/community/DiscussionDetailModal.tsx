"use client";

import React, { useState } from 'react';
import {
  X,
  Heart,
  Bookmark,
  Share2,
  Flag,
  MessageSquare,
  Award,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommunityPost } from '@/lib/mockCommunityData';

interface DiscussionDetailModalProps {
  post: CommunityPost;
  onClose: () => void;
  onToggleLike: (postId: string) => void;
  onToggleBookmark: (postId: string) => void;
  onAddReply: (postId: string, text: string) => void;
}

export const DiscussionDetailModal: React.FC<DiscussionDetailModalProps> = ({
  post,
  onClose,
  onToggleLike,
  onToggleBookmark,
  onAddReply,
}) => {
  const [newReplyText, setNewReplyText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSend = () => {
    if (!newReplyText.trim()) return;
    onAddReply(post.id, newReplyText.trim());
    setNewReplyText('');
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#06140e] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-emerald-900/40 bg-slate-50/50 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {post.category}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              • Posted {post.timeAgo}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-emerald-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Author info */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-11 h-11 rounded-full object-cover border border-emerald-200 dark:border-emerald-800"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {post.author.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {post.author.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {post.author.badgeTitle || 'Community Contributor'} • {post.author.karmaPoints} Eco Points
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleLike(post.id)}
                className={`p-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  post.isLiked
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                    : 'bg-slate-100 dark:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:bg-emerald-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                {post.likesCount}
              </button>

              <button
                onClick={() => onToggleBookmark(post.id)}
                className={`p-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  post.isBookmarked
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                    : 'bg-slate-100 dark:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:bg-emerald-50'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-emerald-600 text-emerald-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {post.title}
            </h2>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200/80 dark:border-emerald-800/60 text-slate-700 dark:text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
              {post.content || post.description}
            </div>
          </div>

          {/* Attached Images */}
          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {post.images.map((img, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden border border-emerald-100 dark:border-emerald-900/40 bg-slate-100 dark:bg-slate-900">
                  <img src={img} alt="Attached" className="w-full h-auto object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Replies & Comments Thread */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-emerald-900/40">
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600" /> Community Replies ({post.replies?.length || 0})
            </h4>

            {post.replies && post.replies.length > 0 ? (
              <div className="space-y-3">
                {post.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-100 dark:border-emerald-900/40 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={reply.author.avatar}
                          alt={reply.author.name}
                          className="w-6 h-6 rounded-full object-cover border border-emerald-200"
                        />
                        <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                          {reply.author.name}
                        </span>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          {reply.author.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">{reply.timeAgo}</span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                      {reply.content}
                    </p>

                    {reply.isHelpfulAnswer && (
                      <div className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Marked as Helpful Answer
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-medium italic">
                No replies yet. Be the first to answer!
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer Reply Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-emerald-900/40 bg-slate-50/50 dark:bg-emerald-950/30 flex items-center gap-3">
          <input
            type="text"
            value={newReplyText}
            onChange={(e) => setNewReplyText(e.target.value)}
            placeholder="Type your reply to help this community member..."
            className="flex-1 px-4 py-2.5 bg-white dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-800 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
          <Button
            onClick={handleSend}
            size="sm"
            className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs px-5 h-10 shadow-sm border-0"
          >
            <Send className="w-4 h-4 mr-1.5" /> Post Reply
          </Button>
        </div>
      </div>
    </div>
  );
};
