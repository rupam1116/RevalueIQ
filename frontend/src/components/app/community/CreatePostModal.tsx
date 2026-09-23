"use client";

import React, { useState } from 'react';
import { X, Upload, Plus, Tag, Sparkles, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostCategory, RoleBadge, CommunityPost } from '@/lib/mockCommunityData';

interface CreatePostModalProps {
  onClose: () => void;
  onPublish: (newPost: CommunityPost) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onPublish }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PostCategory>('Repair');
  const [role, setRole] = useState<RoleBadge>('Repair Expert');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['DIYRepair', 'CircularTech']);
  const [images, setImages] = useState<string[]>([]);
  const [draftSaved, setDraftSaved] = useState(false);

  const categories: PostCategory[] = [
    'Repair',
    'Marketplace',
    'Donation',
    'Circular Economy',
    'Announcements',
    'Tips',
    'Success Stories',
  ];

  const roles: RoleBadge[] = ['Student', 'Repair Expert', 'NGO', 'Moderator', 'Verified Contributor'];

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const cleanTag = tagInput.trim().replace(/^#/, '');
    if (!tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSimulateUpload = () => {
    const sampleImages = [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=800',
    ];
    const pick = sampleImages[images.length % sampleImages.length];
    setImages([...images, pick]);
  };

  const handleSaveDraft = () => {
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      content: description.trim(),
      author: {
        id: 'user-current',
        name: 'You (Alex Rivera)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: role,
        badgeTitle: 'Community Member',
        karmaPoints: 120,
        solvedCount: 3,
      },
      category: category,
      tags: tags,
      timeAgo: 'Just now',
      createdAt: new Date().toISOString(),
      repliesCount: 0,
      viewsCount: 1,
      likesCount: 1,
      bookmarksCount: 0,
      images: images,
      replies: [],
      isLiked: true,
    };

    onPublish(newPost);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#06140e] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-emerald-900/40 bg-slate-50/50 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Create Community Post</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-emerald-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePublishSubmit} className="p-6 space-y-5">
          {/* Post Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Discussion Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How to replace battery on Dell XPS 13 or E-Waste recycling tips"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Category & Role selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PostCategory)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-800 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Your Role / Identity *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as RoleBadge)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-800 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Description / Details *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide clear troubleshooting details, step-by-step instructions, or questions for the community..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Upload Images Section */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Upload Images (Optional)
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-emerald-200">
                  <img src={img} alt="Uploaded" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-1 bg-slate-900/80 text-white rounded-full hover:bg-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleSimulateUpload}
                className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 dark:border-emerald-800/80 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-emerald-600 hover:border-emerald-500 transition-colors"
              >
                <ImageIcon className="w-5 h-5" />
                <span className="text-[10px] font-bold">+ Photo</span>
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Tags
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag and press Enter"
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                size="sm"
                variant="outline"
                className="rounded-xl font-bold text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Tag
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-emerald-900/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handleSaveDraft}
                variant="outline"
                size="sm"
                className="rounded-2xl font-extrabold text-xs"
              >
                Save Draft
              </Button>
              {draftSaved && (
                <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Draft Saved!
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="rounded-2xl font-bold text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs px-6 h-10 shadow-md border-0"
              >
                Publish Post
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
