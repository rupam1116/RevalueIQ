'use client';
import { getApiUrl } from "@/lib/api";

import React, { useState, useEffect } from "react";
import { Calendar, ExternalLink, RefreshCw, Sparkles, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPage() {
  const [realtimeNews, setRealtimeNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchNews = async () => {
    setLoading(true);
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/v1/news/blogs/realtime`);
      const data = await res.json();
      if (data.success && data.items) {
        setRealtimeNews(data.items);
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.error("Failed to fetch live news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();

    // Automatically poll and refresh the live feed every 5 minutes in the background
    const interval = setInterval(() => {
      fetchNews();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Top 3 picks from live news stream (Most Viewed Papers)
  const top3Picks = realtimeNews.slice(0, 3).filter((item) => {
    if (activeTab === "all" || activeTab === "featured" || activeTab === "realtime") return true;
    return item.category?.toLowerCase().includes(activeTab.toLowerCase()) || activeTab === item.category;
  });

  // Remaining live stream items
  const remainingRealtime = realtimeNews.slice(activeTab === "all" ? 3 : 0).filter((item) => {
    if (activeTab === "all" || activeTab === "realtime") return true;
    if (activeTab === "featured") return false;
    return item.category?.toLowerCase().includes(activeTab.toLowerCase()) || activeTab === item.category;
  });

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-slate-950 relative selection:bg-primary/20">
      {/* Glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-primary/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Streamed from GNews & Web</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-poppins tracking-tight text-foreground">
            RevalueIQ <span className="text-primary">Insights & Live News</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-4">
            Explore real-time sustainability research and industry news uploaded directly across global tech publishers.
          </p>
        </div>

        {/* Navigation & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 pb-6 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            {[
              { id: "all", label: "✨ All Content" },
              { id: "featured", label: "💎 RevalueIQ Research Picks" },
              { id: "realtime", label: "⚡ Live News Stream" },
              { id: "AI & Tech", label: "🤖 AI & Tech" },
              { id: "Circular Economy", label: "♻️ Circular Economy" },
              { id: "Consumer Tech", label: "🔋 Consumer Tech" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md shadow-primary/25 scale-105"
                    : "bg-white dark:bg-slate-900 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 border border-border/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Updated: {lastUpdated}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchNews}
              disabled={loading}
              className="rounded-full gap-2 text-xs bg-white dark:bg-slate-900 border-border/80 hover:border-primary/40 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-primary ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Streaming..." : "Refresh Live Feed"}</span>
            </Button>
          </div>
        </div>

        {/* Section 1: Top 3 Most Viewed Papers from Live News Stream */}
        {top3Picks.length > 0 && (
          <div className="mb-16 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-500 border border-amber-500/20 shadow-sm">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold font-poppins text-foreground">RevalueIQ Research Picks & Trending News</h2>
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm animate-pulse flex items-center gap-1">
                      🔥 Most Viewed Papers
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">The most viewed sustainability research, whitepapers, and industry analysis streaming live</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {top3Picks.map((item) => (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border-2 border-amber-500/30 shadow-md flex flex-col hover:shadow-2xl hover:border-amber-500 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group block relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500/15 to-transparent w-36 h-36 rounded-bl-full pointer-events-none" />
                  
                  {item.image && (
                    <div className="w-full h-48 mb-5 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative shadow-inner">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        🔥 Most Viewed
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs font-semibold mb-3 relative z-10">
                    <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-500/20">
                      ⚡ {item.category}
                    </span>
                    <span className="font-medium text-muted-foreground">📰 {item.source}</span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-amber-500 transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-6 flex-1 leading-relaxed line-clamp-3">
                    {item.snippet}
                  </p>

                  <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-auto text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> {item.pubDate}
                    </span>
                    <span className="flex items-center font-semibold text-amber-600 dark:text-amber-400 group-hover:underline">
                      Read Full Paper <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Real-Time Live Feed (Remaining items) */}
        {(activeTab === "all" || activeTab === "realtime" || remainingRealtime.length > 0) && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold font-poppins text-foreground">Real-Time Industry News Stream</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Live Feed
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Directly uploaded and aggregated in real-time from GNews & global tech publishers. Click any card to read the live article.
                  </p>
                </div>
              </div>
            </div>

            {loading && realtimeNews.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white/50 dark:bg-slate-900/50 rounded-3xl p-6 border border-border/40 shadow-sm animate-pulse h-64 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-1/3" />
                      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-4/6" />
                    </div>
                    <div className="space-y-2 pt-4">
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : remainingRealtime.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-border">
                <p className="text-muted-foreground font-medium">No additional live news articles matched the selected filter.</p>
                <Button variant="link" onClick={() => setActiveTab("all")} className="mt-2 text-primary">
                  View All Content
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {remainingRealtime.map((item) => (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={item.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-border/80 shadow-sm flex flex-col hover:shadow-xl hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden block"
                  >
                    {/* Live indicator stripe */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-80 group-hover:opacity-100 transition-opacity" />

                    {item.image && (
                      <div className="w-full h-44 mb-4 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-2.5 py-1 rounded-md border border-emerald-500/20">
                        ⚡ {item.category}
                      </span>
                      <span className="font-medium text-slate-500 dark:text-slate-400">
                        📰 {item.source}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-emerald-500 transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-muted-foreground mb-6 flex-1 leading-relaxed line-clamp-3">
                      {item.snippet}
                    </p>

                    <div className="flex items-center justify-between border-t border-border/60 pt-3 mt-auto text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-slate-400" /> {item.pubDate}
                      </span>
                      <span className="flex items-center font-semibold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                        Read Live Article <ExternalLink className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Live News Explainer Footer */}
        <div className="mt-20 p-8 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-border text-center max-w-2xl mx-auto space-y-2">
          <h4 className="font-semibold text-sm text-foreground flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            How Real-Time Stream Works
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our platform continuously monitors GNews RSS and global tech feeds for breaking advancements in artificial intelligence, e-waste recycling, and circular economy regulations. Clicking any live stream card redirects you instantly to the official publisher's website.
          </p>
        </div>

      </div>
    </div>
  );
}