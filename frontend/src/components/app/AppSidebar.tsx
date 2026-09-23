import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Leaf,
  Wrench,
  ShoppingBag,
  MapPin,
  HeartHandshake,
  Users,
  History,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Database,
  X,
  ArrowUpRight,
  Cpu,
  Crown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchWithAuth } from "@/lib/api";
import { subscribeEcoPlanUpdate } from "@/lib/ecoPlanApi";
import { EcoPlanModal } from "./eco-plan/EcoPlanModal";

export interface SidebarModule {
  id: string;
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const SIDEBAR_MODULES: SidebarModule[] = [
  { id: "dashboard", name: "Eco Dashboard", path: "/app", icon: LayoutDashboard },
  { id: "valuation", name: "AI Valuation", path: "/app/valuation", icon: Leaf },
  { id: "repair", name: "Repair Advisor", path: "/app/repair", icon: Wrench },
  { id: "marketplace", name: "Marketplace", path: "/app/marketplace", icon: ShoppingBag },
  { id: "repair-shops", name: "Repair Shops", path: "/app/repair-shops", icon: MapPin },
  { id: "donation", name: "Donation Hub", path: "/app/donation", icon: HeartHandshake },
  { id: "community", name: "Eco Community", path: "/app/community", icon: Users },
  { id: "history", name: "Impact History", path: "/app/history", icon: History },
];

interface AppSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  onNavigateTab?: (tabId: string) => void;
  activeTab?: string;
  className?: string;
}

interface UserStats {
  circular_score: number;
  co2_saved_kg: number;
  ewaste_prevented_kg: number;
  karma_points: number;
  level: number;
  eco_plan?: string;
  eco_plan_name?: string;
  monthly_valuations_limit?: number;
  monthly_valuations_used?: number;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
  onNavigateTab,
  activeTab,
  className = "",
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [isHoverExpanded, setIsHoverExpanded] = useState(false);
  const [ecoPlanModalOpen, setEcoPlanModalOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    circular_score: 100,
    co2_saved_kg: 0,
    ewaste_prevented_kg: 0,
    karma_points: 0,
    level: 1,
    eco_plan: "free",
    eco_plan_name: "Eco Starter",
    monthly_valuations_limit: 5,
    monthly_valuations_used: 0,
  });

  const loadStats = async () => {
    if (!user) return;
    try {
      const res = await fetchWithAuth("/api/v1/users/me/stats");
      if (res.ok) {
        const data = await res.json();
        setUserStats({
          circular_score: data.circular_score ?? 100,
          co2_saved_kg: data.co2_saved_kg ?? 0,
          ewaste_prevented_kg: data.ewaste_prevented_kg ?? 0,
          karma_points: data.karma_points ?? 0,
          level: data.level ?? 1,
          eco_plan: data.eco_plan ?? "free",
          eco_plan_name: data.eco_plan_name ?? "Eco Starter",
          monthly_valuations_limit: data.monthly_valuations_limit ?? 5,
          monthly_valuations_used: data.monthly_valuations_used ?? 0,
        });
      }
    } catch (err) {
      // Non-blocking fallback
    }
  };

  useEffect(() => {
    loadStats();
    // Real-time synchronization when plan upgrades
    const unsubscribe = subscribeEcoPlanUpdate((updated) => {
      if (updated?.tier) {
        setUserStats((prev) => ({
          ...prev,
          eco_plan: updated.tier,
          eco_plan_name: updated.tier_name || prev.eco_plan_name,
          monthly_valuations_limit: updated.tier === "free" ? 5 : -1,
        }));
      }
      loadStats();
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const effectiveExpanded = !isCollapsed || isHoverExpanded || mobileOpen;

  // Helper to deduce active module
  const checkIsActive = (module: SidebarModule) => {
    if (activeTab) {
      if (activeTab === module.id) return true;
      if (activeTab === "donation-centers" && module.id === "donation") return true;
    }
    if (module.id === "dashboard") {
      return pathname === "/app" || pathname === "/dashboard" || pathname === "/app/dashboard";
    }
    return pathname.includes(`/${module.id}`) || pathname.includes(`/app/${module.id}`);
  };

  const handleModuleClick = (module: SidebarModule) => {
    setIsHoverExpanded(false);
    if (onCloseMobile) onCloseMobile();
    if (onNavigateTab) {
      onNavigateTab(module.id);
    } else {
      router.push(module.path);
    }
  };

  const handleLogout = async () => {
    setIsHoverExpanded(false);
    if (onCloseMobile) onCloseMobile();
    try {
      await logout();
      router.push("/login");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-sm lg:hidden cursor-pointer animate-in fade-in transition-opacity duration-300"
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        onMouseEnter={() => {
          if (isCollapsed && !mobileOpen) setIsHoverExpanded(true);
        }}
        onMouseLeave={() => {
          if (isCollapsed && !mobileOpen) setIsHoverExpanded(false);
        }}
        className={`
          fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between
          bg-white/95 dark:bg-[#06140e]/95 backdrop-blur-md border-r border-emerald-100 dark:border-emerald-900/50 text-slate-800 dark:text-slate-100
          transition-all duration-300 ease-in-out select-none
          ${mobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"}
          ${!mobileOpen && (effectiveExpanded ? "lg:w-68 shadow-xl shadow-emerald-900/10 dark:shadow-2xl dark:shadow-emerald-950/90" : "lg:w-20")}
          ${className}
        `}
      >
        {/* Top Section: Branding Logo & Collapse Trigger */}
        <div className={`p-4 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center shrink-0 h-16 ${effectiveExpanded ? "justify-between" : "justify-center"}`}>
          {effectiveExpanded ? (
            <>
              <div
                onClick={() => handleModuleClick(SIDEBAR_MODULES[0])}
                className="flex items-center gap-3 cursor-pointer group overflow-hidden hover:scale-[1.02] transition-transform duration-300 min-w-0"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-none truncate">
                    Revalue<span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent">IQ</span>
                  </span>
                  <span className="text-[10px] font-bold tracking-wider text-emerald-700 dark:text-emerald-400/80 uppercase mt-0.5 truncate">
                    Circular Economy
                  </span>
                </div>
              </div>

              {onToggleCollapse && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsHoverExpanded(false);
                    onToggleCollapse();
                  }}
                  className="hidden lg:flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 dark:bg-[#0b1a13] border border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-xs shrink-0"
                  title="Collapse Sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <div className="relative group/logo flex items-center justify-center">
              <div
                onClick={() => handleModuleClick(SIDEBAR_MODULES[0])}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 flex items-center justify-center shadow-md shadow-emerald-600/20 cursor-pointer hover:scale-105 transition-transform"
                title="RevalueIQ - Click to expand"
              >
                <Leaf className="w-5 h-5 text-white" />
              </div>
              {onToggleCollapse && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsHoverExpanded(false);
                    onToggleCollapse();
                  }}
                  className="absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-emerald-600 dark:bg-emerald-700 border border-emerald-400 dark:border-emerald-500 text-white opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center shadow-lg cursor-pointer"
                  title="Expand Sidebar"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Middle: Navigation Modules */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none">
          <div className="space-y-1">
            {effectiveExpanded && (
              <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Eco Modules
              </p>
            )}

            <nav className="space-y-1">
              {SIDEBAR_MODULES.map((module) => {
                const Icon = module.icon;
                const isActive = checkIsActive(module);

                return (
                  <div key={module.id} className="relative group">
                    <button
                      onClick={() => handleModuleClick(module)}
                      onMouseEnter={() => setHoveredModule(module.id)}
                      onMouseLeave={() => setHoveredModule(null)}
                      className={`
                        w-full flex items-center gap-3 py-2.5 rounded-xl text-xs font-semibold
                        transition-all duration-200 cursor-pointer relative z-10
                        ${effectiveExpanded ? "justify-start px-3" : "justify-center px-0"}
                        ${isActive
                          ? "text-emerald-900 dark:text-emerald-300 font-bold bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/30"
                        }
                      `}
                    >
                      {/* Icon Container */}
                      <div
                        className={`
                          p-2 rounded-lg shrink-0 transition-all duration-200
                          ${isActive
                            ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 scale-105"
                            : "bg-emerald-50/80 dark:bg-[#0b1a13] border border-emerald-200/80 dark:border-emerald-900/50 text-slate-600 dark:text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 group-hover:border-emerald-300 dark:group-hover:border-emerald-700"
                          }
                        `}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Text Label */}
                      {effectiveExpanded && (
                        <span className="truncate tracking-tight flex-1 text-left">
                          {module.name}
                        </span>
                      )}

                      {/* Active Dot */}
                      {isActive && effectiveExpanded && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shadow-xs shadow-emerald-500" />
                      )}
                    </button>
                  </div>
                );
              })}

              {/* Logout */}
              <div className="relative group pt-2">
                <button
                  onClick={handleLogout}
                  onMouseEnter={() => setHoveredModule("logout")}
                  onMouseLeave={() => setHoveredModule(null)}
                  className={`
                    w-full flex items-center gap-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer
                    ${effectiveExpanded ? "justify-start px-3" : "justify-center px-0"}
                  `}
                >
                  <div className="p-2 rounded-lg shrink-0 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 group-hover:bg-rose-100 dark:group-hover:bg-rose-500/20">
                    <LogOut className="w-4 h-4" />
                  </div>
                  {effectiveExpanded && (
                    <span className="truncate tracking-tight font-bold">Logout</span>
                  )}
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Bottom Section: Sustainability & Circular Impact Card */}
        <div className="p-3 border-t border-emerald-100 dark:border-emerald-900/40 bg-white/80 dark:bg-[#06140e] shrink-0 space-y-3">
          {effectiveExpanded ? (
            <div className="space-y-3">
              {/* Dynamic Eco Card */}
              <div
                onClick={() => setEcoPlanModalOpen(true)}
                className="rounded-2xl bg-emerald-50/70 dark:bg-gradient-to-b dark:from-[#0b1a13] dark:to-[#08150f] border border-emerald-200/80 dark:border-emerald-900/60 p-3 space-y-2.5 cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-700/80 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    {userStats.eco_plan === "enterprise" ? (
                      <>
                        <Crown className="w-4 h-4 text-amber-500" />
                        <span>Circular Enterprise</span>
                      </>
                    ) : userStats.eco_plan === "pro" ? (
                      <>
                        <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                        <span>Circular Pioneer Pro</span>
                      </>
                    ) : (
                      <>
                        <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Eco Starter</span>
                      </>
                    )}
                  </span>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      userStats.eco_plan === "enterprise"
                        ? "bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30"
                        : userStats.eco_plan === "pro"
                        ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {userStats.eco_plan === "enterprise"
                      ? "Enterprise"
                      : userStats.eco_plan === "pro"
                      ? "Active Pro"
                      : "Free Tier"}
                  </span>
                </div>

                {/* AI Appraisals Quota or E-Waste Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-medium text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Database className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      {userStats.eco_plan === "free" ? "Monthly Appraisals" : "E-Waste Diverted"}
                    </span>
                    <span className="text-slate-900 dark:text-white font-bold">
                      {userStats.eco_plan === "free"
                        ? `${userStats.monthly_valuations_used ?? 0} / 5 used`
                        : `${userStats.ewaste_prevented_kg.toFixed(1)} kg`}
                    </span>
                  </div>
                  <div className="h-1.5 bg-emerald-200/60 dark:bg-emerald-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-600 dark:to-teal-400 rounded-full transition-all duration-500"
                      style={{
                        width:
                          userStats.eco_plan === "free"
                            ? `${Math.min(100, Math.max(0, ((userStats.monthly_valuations_used ?? 0) / 5) * 100))}%`
                            : `${Math.min(100, Math.max(0, (userStats.ewaste_prevented_kg / 25) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* AI Eco Credits & Perk Status */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-medium text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      Eco Credits
                    </span>
                    <span className="text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1">
                      {userStats.karma_points.toLocaleString()}
                      {userStats.eco_plan === "enterprise" && (
                        <span className="text-[8px] bg-amber-500 text-white px-1 rounded font-black">3X</span>
                      )}
                      {userStats.eco_plan === "pro" && (
                        <span className="text-[8px] bg-emerald-600 text-white px-1 rounded font-black">2X</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Circular Score Widget */}
                <div className="pt-2 border-t border-emerald-200/70 dark:border-emerald-900/50 flex items-center gap-3">
                  <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
                    <svg className="w-9 h-9 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-emerald-200/70 dark:text-emerald-950"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-600 dark:text-emerald-400"
                        strokeDasharray={`${Math.min(100, Math.max(0, userStats.circular_score))}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-black text-slate-900 dark:text-white">{userStats.circular_score}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                      Circular Score
                    </span>
                    <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                      {userStats.eco_plan === "free" ? "Upgrade to boost score" : "Top 5% Eco Platform"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Upgrade / Manage Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEcoPlanModalOpen(true);
                }}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs shadow-md transition-all duration-300 cursor-pointer active:scale-95 ${
                  userStats.eco_plan === "free"
                    ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-emerald-600/20 hover:scale-[1.02]"
                    : userStats.eco_plan === "enterprise"
                    ? "bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 dark:from-emerald-900 dark:to-teal-950 text-white border border-emerald-500/30 hover:scale-[1.02]"
                    : "bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white hover:scale-[1.02]"
                }`}
              >
                {userStats.eco_plan === "enterprise" ? (
                  <Crown className="w-4 h-4 text-amber-400" />
                ) : (
                  <Zap className="w-4 h-4 fill-white" />
                )}
                <span>{userStats.eco_plan === "free" ? "Upgrade Eco Plan" : "Manage Eco Plan"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Collapsed Indicators */
            <div className="flex flex-col items-center gap-2.5 py-1">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEcoPlanModalOpen(true);
                }}
                className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-[#0b1a13] border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs cursor-pointer hover:scale-105 transition-transform"
                title={`${userStats.eco_plan_name || "Eco Plan"} Active`}
              >
                {userStats.eco_plan === "enterprise" ? (
                  <Crown className="w-5 h-5 text-amber-500" />
                ) : (
                  <ShieldCheck className="w-5 h-5" />
                )}
              </div>

              <div
                className="relative w-8 h-8 flex items-center justify-center cursor-pointer"
                title={`Circular Score: ${userStats.circular_score}/100`}
              >
                <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-emerald-200 dark:text-emerald-950"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-600 dark:text-emerald-400"
                    strokeDasharray={`${Math.min(100, Math.max(0, userStats.circular_score))}, 100`}
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[9px] font-black text-slate-900 dark:text-white">{userStats.circular_score}</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEcoPlanModalOpen(true);
                }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 hover:scale-105 transition-transform cursor-pointer"
                title={userStats.eco_plan === "free" ? "Upgrade Eco Plan" : "Manage Eco Plan"}
              >
                {userStats.eco_plan === "enterprise" ? (
                  <Crown className="w-4 h-4 text-amber-300" />
                ) : (
                  <Zap className="w-4 h-4 fill-white" />
                )}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Global Eco Plan Modal */}
      <EcoPlanModal
        isOpen={ecoPlanModalOpen}
        onClose={() => setEcoPlanModalOpen(false)}
        onPlanChanged={() => loadStats()}
      />
    </>
  );
};
