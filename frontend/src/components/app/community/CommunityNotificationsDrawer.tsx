"use client";

import React, { useState } from 'react';
import { Bell, CheckCheck, MessageSquare, Heart, Bookmark, Megaphone, AtSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_NOTIFICATIONS, CommunityNotification } from '@/lib/mockCommunityData';

interface CommunityNotificationsDrawerProps {
  onSelectNotificationPost?: (postId: string) => void;
}

export const CommunityNotificationsDrawer: React.FC<CommunityNotificationsDrawerProps> = ({
  onSelectNotificationPost,
}) => {
  const [notifications, setNotifications] = useState<CommunityNotification[]>(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'reply':
        return <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'like':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'bookmark':
        return <Bookmark className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-amber-500" />;
      default:
        return <AtSign className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-[#06140e] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            Community Activity & Notifications
          </h3>
        </div>
        <Button
          onClick={markAllRead}
          variant="ghost"
          size="sm"
          className="rounded-xl text-xs font-bold text-emerald-600 hover:bg-emerald-50"
        >
          <CheckCheck className="w-3.5 h-3.5 mr-1" /> Mark All Read
        </Button>
      </div>

      <div className="space-y-2.5">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => n.linkId && onSelectNotificationPost && onSelectNotificationPost(n.linkId)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
              n.isRead
                ? 'bg-slate-50/50 dark:bg-emerald-950/20 border-slate-100 dark:border-emerald-900/30'
                : 'bg-emerald-50/60 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
            }`}
          >
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-emerald-800 shrink-0">
              {getNotifIcon(n.type)}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{n.title}</h4>
                <span className="text-[10px] text-slate-400 font-bold">{n.timeAgo}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {n.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
