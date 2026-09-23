"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Leaf,
  Search,
  Bell,
  User as UserIcon,
  LogOut,
  Settings,
  BarChart3,
  Command,
  X,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Menu,
  CreditCard,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AppHeaderProps {
  onNavigateTab?: (tabId: string) => void;
  activeTab?: string;
  onToggleMobileSidebar?: () => void;
}

import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  NotificationItem,
} from "@/lib/notificationApi";

interface AppHeaderProps {
  onNavigateTab?: (tabId: string) => void;
  activeTab?: string;
  onToggleMobileSidebar?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onNavigateTab,
  activeTab = "dashboard",
  onToggleMobileSidebar,
}) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch real notifications and unread count
  const loadNotifications = async () => {
    if (!user) return;
    try {
      setLoadingNotifs(true);
      const data = await getNotifications(false, 1, 10);
      setNotifications(data.items || []);
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      console.warn("Failed to load header notifications:", err);
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Refresh when dropdown opens
  useEffect(() => {
    if (notifOpen && user) {
      loadNotifications();
    }
  }, [notifOpen, user]);

  const handleNotificationClick = async (n: NotificationItem) => {
    try {
      if (!n.is_read) {
        await markNotificationRead(n.id);
        setNotifications((prev) =>
          prev.map((item) => (item.id === n.id ? { ...item, is_read: true } : item))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      setNotifOpen(false);

      if (n.action_url) {
        router.push(n.action_url);
      } else if (n.type.includes("VALUATION")) {
        router.push("/app/valuation");
      } else if (n.type.includes("PAYMENT")) {
        router.push("/app/payments");
      } else if (n.type.includes("MARKETPLACE")) {
        router.push("/app/marketplace");
      } else {
        router.push("/app/notifications");
      }
    } catch (e) {
      console.warn("Error marking notification read:", e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.warn("Error marking all read:", e);
    }
  };

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
    }
  }, [searchOpen]);

  const userInitials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  const handleSearchSelect = (tabId: string) => {
    setSearchOpen(false);
    if (onNavigateTab) {
      onNavigateTab(tabId);
    } else {
      router.push(`/app?tab=${tabId}`);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return "Recent";
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#06140e]/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 border-b border-emerald-100 dark:border-emerald-900/40 shadow-xs">
        {/* Left: Mobile Drawer Trigger & RevalueIQ Branding */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Drawer"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => onNavigateTab ? onNavigateTab("dashboard") : router.push("/app")}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-hidden hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight leading-none text-slate-900 dark:text-white">
                Revalue<span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">IQ</span>
              </span>
              <span className="text-[10px] font-bold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase mt-0.5">
                Circular Platform
              </span>
            </div>
          </button>
        </div>

        {/* Center: Search Trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 text-slate-600 dark:text-slate-300 transition-all max-w-md w-full cursor-pointer focus:outline-hidden"
        >
          <Search className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-medium flex-1 text-left">Search devices, circular valuation, repair guides...</span>
          <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-slate-500 dark:text-slate-400">
            <Command className="w-3 h-3" />K
          </kbd>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Mobile Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-emerald-950 animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 transition-all duration-200">
                  <div className="px-5 py-3.5 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/30">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setNotifOpen(false)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-emerald-100 dark:divide-emerald-900/30">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="text-xs font-semibold">No notifications yet</p>
                        <p className="text-[11px] opacity-75 mt-0.5">Real events like payments & valuations appear here.</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-4 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer ${
                            !n.is_read ? "bg-emerald-500/[0.05]" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5 ${
                              n.type.includes("SUCCESS") || n.type.includes("COMPLETED")
                                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                                : n.type.includes("FAILED")
                                ? "bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400"
                                : "bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400"
                            }`}>
                              {n.type.includes("SUCCESS") || n.type.includes("COMPLETED") ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : n.type.includes("FAILED") ? (
                                <AlertCircle className="w-4 h-4" />
                              ) : (
                                <Leaf className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <p className={`text-xs font-bold ${!n.is_read ? "text-emerald-900 dark:text-emerald-200" : "text-slate-900 dark:text-white"}`}>
                                  {n.title}
                                </p>
                                {!n.is_read && (
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                              <p className="text-[10px] text-slate-400 mt-1 font-medium">{formatTimeAgo(n.created_at)}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-3 border-t border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20 text-center">
                    <button
                      onClick={() => {
                        setNotifOpen(false);
                        router.push("/app/notifications");
                      }}
                      className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
                    >
                      <span>View all notifications</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <ThemeToggle />

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 p-1 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors focus:outline-hidden cursor-pointer">
              <Avatar className="w-8 h-8 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || "User"} />
                <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-xs font-extrabold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-60 p-2 border-emerald-100 dark:border-emerald-900/50 bg-white dark:bg-[#0b1a13]" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal p-2">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {user?.displayName || "Eco Member"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || "user@revalueiq.com"}</p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-emerald-100 dark:bg-emerald-900/40" />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => onNavigateTab ? onNavigateTab("dashboard") : router.push("/app")}
                  className="cursor-pointer py-2.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                >
                  <BarChart3 className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Eco Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onNavigateTab ? onNavigateTab("profile") : router.push("/app/profile")}
                  className="cursor-pointer py-2.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                >
                  <UserIcon className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onNavigateTab ? onNavigateTab("payments") : router.push("/app/payments")}
                  className="cursor-pointer py-2.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                >
                  <CreditCard className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Payments
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/app/eco-plan")}
                  className="cursor-pointer py-2.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                >
                  <Zap className="mr-2 h-4 w-4 text-emerald-500 fill-emerald-500" /> Eco Plan & Quotas
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onNavigateTab ? onNavigateTab("settings") : router.push("/app/settings")}
                  className="cursor-pointer py-2.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                >
                  <Settings className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-emerald-100 dark:bg-emerald-900/40" />
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer py-2.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 focus:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 transition-all duration-200">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20">
              <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search modules, devices, or features..."
                className="flex-1 bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Jump Options */}
            <div className="p-4 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 px-2">
                Eco Platform Quick Jumps
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "dashboard", label: "🌱 Sustainability Dashboard", desc: "CO₂ saved & circular scores" },
                  { id: "valuation", label: "🤖 AI Eco Valuation", desc: "Grade & appraise device" },
                  { id: "repair", label: "🛠 Repair Advisor", desc: "Troubleshoot & repair" },
                  { id: "marketplace", label: "🛒 Eco Marketplace", desc: "Buy & sell pre-owned tech" },
                  { id: "repair-shops", label: "📍 Local Repair Network", desc: "Nearby verified centers" },
                  { id: "donation", label: "🎁 E-Waste Donation", desc: "Recycle & donate devices" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSearchSelect(item.id)}
                    className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-900/40 text-left transition-all duration-200 group cursor-pointer"
                  >
                    <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
