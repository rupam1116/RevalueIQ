"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Leaf,
  Search,
  Bell,
  User as UserIcon,
  LogOut,
  Settings,
  BarChart3,
  Menu,
  X,
  Command,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AppNavbarProps {
  onToggleMobileSidebar?: () => void;
}

const MOCK_NOTIFICATIONS: { id: string; title: string; desc: string; time: string }[] = [];

export const AppNavbar: React.FC<AppNavbarProps> = ({ onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = MOCK_NOTIFICATIONS.length;

  const userInitials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#06140e]/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 border-b border-emerald-100 dark:border-emerald-900/40">
        {/* Left: Mobile menu + Logo */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/dashboard" className="flex items-center gap-2.5 group hover:scale-[1.02] transition-transform duration-300">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-extrabold tracking-tight hidden sm:inline">
              <span className="text-slate-900 dark:text-white">Revalue</span>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">IQ</span>
            </span>
          </Link>
        </div>

        {/* Center: Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 hover:border-emerald-300 dark:hover:border-emerald-700 text-slate-600 dark:text-slate-300 transition-all max-w-md w-full lg:w-96"
        >
          <Search className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium flex-1 text-left">Search eco tools, devices, reports...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-slate-500 dark:text-slate-400">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
          >
            <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-[9px] font-extrabold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 transition-all duration-200">
                  <div className="px-4 py-3 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/30">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Eco Notifications</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-emerald-100 dark:divide-emerald-900/30">
                    {MOCK_NOTIFICATIONS.map(n => (
                      <div
                        key={n.id}
                        className="px-4 py-3 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                      >
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <ThemeToggle />

          {/* User Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 p-1 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors focus:outline-none cursor-pointer">
              <Avatar className="w-8 h-8 border border-emerald-200 dark:border-emerald-800">
                <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-xs font-extrabold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-2 border-emerald-100 dark:border-emerald-900/50 bg-white dark:bg-[#0b1a13]" align="end">
              <DropdownMenuLabel className="font-normal p-2">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {user?.displayName || 'Eco Member'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-emerald-100 dark:bg-emerald-900/40" />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push('/app')} className="cursor-pointer py-2.5 rounded-lg text-xs font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/50">
                  <BarChart3 className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Eco Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/app/profile')} className="cursor-pointer py-2.5 rounded-lg text-xs font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/50">
                  <UserIcon className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/app/settings')} className="cursor-pointer py-2.5 rounded-lg text-xs font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/50">
                  <Settings className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-emerald-100 dark:bg-emerald-900/40" />
              <DropdownMenuItem onClick={logout} className="cursor-pointer py-2.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 focus:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh]">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 transition-all duration-200">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-emerald-100 dark:border-emerald-900/40">
              <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search eco tools, devices, reports..."
                className="flex-1 bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
