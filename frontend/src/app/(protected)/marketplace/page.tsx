"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MarketplaceProduct, FilterState, MarketplaceViewMode, CategoryType } from '@/components/marketplace/types';
import {
  getMarketplaceListings,
  getMyMarketplaceListings,
  publishMarketplaceListing,
  unpublishMarketplaceListing,
  markMarketplaceListingSold,
  deleteMarketplaceListing,
} from '@/lib/marketplaceApi';
import { MarketplaceHero } from '@/components/marketplace/MarketplaceHero';
import { EnvironmentalImpactCards } from '@/components/marketplace/EnvironmentalImpactCards';
import { SmartSearch } from '@/components/marketplace/SmartSearch';
import { CategoryCards } from '@/components/marketplace/CategoryCards';
import { FilterSidebar } from '@/components/marketplace/FilterSidebar';
import { FeaturedDevices } from '@/components/marketplace/FeaturedDevices';
import { ProductGrid } from '@/components/marketplace/ProductGrid';
import { ProductDetailsModal } from '@/components/marketplace/ProductDetailsModal';
import { SellProductForm } from '@/components/marketplace/SellProductForm';
import { WishlistSection } from '@/components/marketplace/WishlistSection';
import { CompareDrawer } from '@/components/marketplace/CompareDrawer';
import { ContactSellerModal } from '@/components/marketplace/ContactSellerModal';
import { MarketplaceDashboard } from '@/components/marketplace/MarketplaceDashboard';
import { ShoppingBag, Package, Heart, Clock, Plus, BarChart3, Sparkles, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedMarketplacePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [myListings, setMyListings] = useState<MarketplaceProduct[]>([]);
  const [currentView, setCurrentView] = useState<MarketplaceViewMode>('home');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    brand: [],
    priceRange: [0, 500000],
    conditionGrades: [],
    minCircularScore: 0,
    repairableOnly: false,
    searchQuery: '',
    sortBy: 'newest',
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<MarketplaceProduct[]>([]);
  const [comparedIds, setComparedIds] = useState<string[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [editingProduct, setEditingProduct] = useState<MarketplaceProduct | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [contactProduct, setContactProduct] = useState<MarketplaceProduct | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Restore saved Wishlist & Recently Viewed scoped to authenticated user
  useEffect(() => {
    try {
      if (!user?.uid) {
        setWishlistIds([]);
        setRecentlyViewed([]);
        return;
      }
      const wishKey = `revalue_wishlist_${user.uid}`;
      const recentKey = `revalue_recent_${user.uid}`;

      const savedWish = localStorage.getItem(wishKey);
      if (savedWish) setWishlistIds(JSON.parse(savedWish));
      else setWishlistIds([]);

      const savedRecent = localStorage.getItem(recentKey);
      if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent));
      else setRecentlyViewed([]);
    } catch (e) {
      setWishlistIds([]);
      setRecentlyViewed([]);
    }
  }, [user?.uid]);

  // Fetch Public & User Listings from MongoDB via FastAPI
  const loadMarketplaceData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [pubResult, myResult] = await Promise.allSettled([
        getMarketplaceListings({
          category: filters.category !== 'All' ? filters.category : undefined,
          search: filters.searchQuery || undefined,
          sort: filters.sortBy,
          limit: 50,
        }),
        getMyMarketplaceListings({ limit: 50 }),
      ]);

      if (pubResult.status === 'fulfilled') {
        setProducts(pubResult.value.items || []);
      } else {
        console.warn('Could not load public marketplace listings:', pubResult.reason);
      }

      if (myResult.status === 'fulfilled') {
        setMyListings(myResult.value.items || []);
      } else {
        console.warn('Could not load seller listings:', myResult.reason);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load marketplace listings.');
    } finally {
      setIsLoading(false);
    }
  }, [filters.category, filters.searchQuery, filters.sortBy]);

  useEffect(() => {
    loadMarketplaceData();
  }, [loadMarketplaceData]);

  const handleToggleWishlist = (prod: MarketplaceProduct) => {
    setWishlistIds((prev) => {
      const next = prev.includes(prod.id)
        ? prev.filter((id) => id !== prod.id)
        : [...prev, prod.id];
      try {
        const wishKey = user?.uid ? `revalue_wishlist_${user.uid}` : 'revalue_wishlist';
        localStorage.setItem(wishKey, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleToggleCompare = (prod: MarketplaceProduct) => {
    setComparedIds((prev) => {
      if (prev.includes(prod.id)) return prev.filter((id) => id !== prod.id);
      if (prev.length >= 4) return prev;
      return [...prev, prod.id];
    });
  };

  const handleSelectProduct = (prod: MarketplaceProduct) => {
    setSelectedProduct(prod);
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== prod.id);
      const next = [prod, ...filtered].slice(0, 8);
      try {
        const recentKey = user?.uid ? `revalue_recent_${user.uid}` : 'revalue_recent';
        localStorage.setItem(recentKey, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      brand: [],
      priceRange: [0, 500000],
      conditionGrades: [],
      minCircularScore: 0,
      repairableOnly: false,
      searchQuery: '',
      sortBy: 'newest',
    });
  };

  const handlePublishListing = (newProd: MarketplaceProduct) => {
    setMyListings((prev) => [newProd, ...prev.filter((p) => p.id !== newProd.id)]);
    if (newProd.status === 'active') {
      setProducts((prev) => [newProd, ...prev.filter((p) => p.id !== newProd.id)]);
    }
    setCurrentView('dashboard');
  };

  const handleUpdateListing = (updatedProd: MarketplaceProduct) => {
    setMyListings((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    setEditingProduct(null);
    setCurrentView('dashboard');
  };

  const handleDeleteListing = async (id: string) => {
    try {
      await deleteMarketplaceListing(id);
      setMyListings((prev) => prev.filter((item) => item.id !== id));
      setProducts((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete listing.');
    }
  };

  const handleTogglePauseListing = async (id: string) => {
    const item = myListings.find((i) => i.id === id);
    if (!item) return;

    try {
      if (item.status === 'active') {
        const updated = await unpublishMarketplaceListing(id);
        setMyListings((prev) => prev.map((p) => (p.id === id ? updated : p)));
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        const updated = await publishMarketplaceListing(id);
        setMyListings((prev) => prev.map((p) => (p.id === id ? updated : p)));
        setProducts((prev) => [updated, ...prev.filter((p) => p.id !== id)]);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update listing status.');
    }
  };

  const handleMarkAsSold = async (id: string) => {
    try {
      const updated = await markMarketplaceListingSold(id);
      setMyListings((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to mark listing as sold.');
    }
  };

  // Client-side instant filter enhancements
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filters.category !== 'All' && p.category.toLowerCase() !== filters.category.toLowerCase()) return false;
      if (filters.brand.length > 0 && !filters.brand.some((b) => b.toLowerCase() === p.brand.toLowerCase())) return false;
      if (p.price > filters.priceRange[1]) return false;
      if (p.price < filters.priceRange[0]) return false;
      if (filters.conditionGrades.length > 0 && !filters.conditionGrades.includes(p.condition as any)) return false;
      if (filters.minCircularScore > 0 && p.aiAppraisal.circularEconomyScore < filters.minCircularScore) return false;
      if (filters.repairableOnly && !p.isRepairable) return false;
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-low') return a.price - b.price;
      if (filters.sortBy === 'price-high') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.seller.rating - a.seller.rating;
      if (filters.sortBy === 'ai-score') return b.aiAppraisal.circularEconomyScore - a.aiAppraisal.circularEconomyScore;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, filters]);

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  const comparedProducts = useMemo(() => {
    return products.filter((p) => comparedIds.includes(p.id));
  }, [products, comparedIds]);

  // Dynamic Category counts dictionary
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const liveImpactMetrics = useMemo(() => {
    if (products.length === 0) {
      return {
        totalCo2AvoidedKg: 0,
        totalEwasteDivertedKg: 0,
        totalWaterSavedLiters: 0,
        circularPlatformIndex: 0,
        totalDevicesRefurbished: 0,
      };
    }
    const totalCo2 = products.reduce((sum, p) => sum + (p.aiAppraisal?.co2SavedKg || 0), 0);
    const totalEwaste = products.reduce((sum, p) => sum + (p.aiAppraisal?.ewasteDivertedKg || 0), 0);
    const totalWater = products.reduce((sum, p) => sum + (p.aiAppraisal?.waterSavedLiters || 0), 0);
    const validScores = products
      .map((p) => p.aiAppraisal?.circularEconomyScore)
      .filter((s): s is number => typeof s === "number" && s > 0);
    const avgScore = validScores.length > 0 ? validScores.reduce((sum, s) => sum + s, 0) / validScores.length : 0;

    return {
      totalCo2AvoidedKg: Math.round(totalCo2 * 10) / 10,
      totalEwasteDivertedKg: Math.round(totalEwaste * 10) / 10,
      totalWaterSavedLiters: Math.round(totalWater),
      circularPlatformIndex: Math.round(avgScore),
      totalDevicesRefurbished: products.length,
    };
  }, [products]);

  return (
    <div className="space-y-8 pb-12">
      {/* Marketplace Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-emerald-100 p-4 rounded-3xl shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setCurrentView('home')}
            variant={currentView === 'home' ? 'default' : 'ghost'}
            size="sm"
            className={`rounded-2xl text-xs font-extrabold cursor-pointer ${
              currentView === 'home'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-1.5 text-emerald-300" /> Marketplace ({products.length})
          </Button>

          <Button
            onClick={() => setCurrentView('dashboard')}
            variant={currentView === 'dashboard' ? 'default' : 'ghost'}
            size="sm"
            className={`rounded-2xl text-xs font-extrabold cursor-pointer ${
              currentView === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50'
            }`}
          >
            <Package className="w-3.5 h-3.5 mr-1.5 text-emerald-300" /> My Listings ({myListings.length})
          </Button>

          <Button
            onClick={() => setCurrentView('wishlist')}
            variant={currentView === 'wishlist' ? 'default' : 'ghost'}
            size="sm"
            className={`rounded-2xl text-xs font-extrabold cursor-pointer ${
              currentView === 'wishlist'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50'
            }`}
          >
            <Heart className="w-3.5 h-3.5 mr-1.5 text-rose-300" /> Wishlist ({wishlistIds.length})
          </Button>

          <Button
            onClick={() => setCurrentView('recent')}
            variant={currentView === 'recent' ? 'default' : 'ghost'}
            size="sm"
            className={`rounded-2xl text-xs font-extrabold cursor-pointer ${
              currentView === 'recent'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5 mr-1.5 text-emerald-300" /> Recently Viewed ({recentlyViewed.length})
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={loadMarketplaceData}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="rounded-2xl text-xs font-bold border-emerald-200 text-slate-700 hover:bg-emerald-50 h-10"
            title="Refresh Listings"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            onClick={() => setIsSellModalOpen(true)}
            size="sm"
            className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs px-5 h-10 shadow-md shadow-emerald-600/20 border-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Sell Electronics
          </Button>
        </div>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <Button size="sm" variant="outline" onClick={loadMarketplaceData} className="text-xs">
            Retry
          </Button>
        </div>
      )}

      {/* VIEW: HOME MARKETPLACE */}
      {currentView === 'home' && (
        <>
          {/* Section 1: Marketplace Hero */}
          <MarketplaceHero
            onOpenSellModal={() => setIsSellModalOpen(true)}
            onExploreClick={() => {
              const el = document.getElementById('app-marketplace-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Section 13: Platform Environmental Impact Cards */}
          <EnvironmentalImpactCards metrics={liveImpactMetrics} />

          {/* Section 2: Smart Search */}
          <SmartSearch
            filters={filters}
            onFilterChange={handleFilterChange}
            onToggleMobileFilters={() => setIsMobileFilterOpen(true)}
            totalResults={filteredProducts.length}
          />

          {/* Section 4: Category Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Filter by Category
            </h3>
            <CategoryCards
              selectedCategory={filters.category}
              onSelectCategory={(cat) => handleFilterChange({ category: cat })}
              categoryCounts={categoryCounts}
            />
          </div>

          {/* Section 5: Featured Devices */}
          {products.length > 0 && (
            <FeaturedDevices
              products={products.slice(0, 6)}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              comparedIds={comparedIds}
              onToggleCompare={handleToggleCompare}
              onSelectProduct={handleSelectProduct}
            />
          )}

          {/* Main Grid Area: Section 3 (Filters Sidebar) & Section 6 (AI Verified Product Cards) */}
          <div id="app-marketplace-grid" className="flex flex-col lg:flex-row gap-6 items-start">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              isOpenMobile={isMobileFilterOpen}
              onCloseMobile={() => setIsMobileFilterOpen(false)}
            />

            <div className="flex-1 w-full min-w-0">
              {isLoading && products.length === 0 ? (
                <div className="py-20 text-center space-y-3 bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm">
                  <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
                  <p className="text-sm font-extrabold text-slate-800">Loading RevalueIQ Marketplace...</p>
                  <p className="text-xs text-slate-400">Fetching verified second-hand electronics from MongoDB</p>
                </div>
              ) : (
                <ProductGrid
                  products={filteredProducts}
                  wishlistIds={wishlistIds}
                  onToggleWishlist={handleToggleWishlist}
                  comparedIds={comparedIds}
                  onToggleCompare={handleToggleCompare}
                  onSelectProduct={handleSelectProduct}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
                  onOpenSellModal={() => setIsSellModalOpen(true)}
                  title="All Pre-Owned Electronics"
                  subtitle="Inspected with AI Diagnostic Diagnostics & Transparent Sustainability Metrics"
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* VIEW: MARKETPLACE DASHBOARD (Section 12) */}
      {currentView === 'dashboard' && (
        <MarketplaceDashboard
          myListings={myListings}
          onOpenSellModal={() => {
            setEditingProduct(null);
            setIsSellModalOpen(true);
          }}
          onDeleteListing={handleDeleteListing}
          onTogglePauseListing={handleTogglePauseListing}
          onMarkAsSold={handleMarkAsSold}
          onSelectProduct={handleSelectProduct}
          onEditListing={(prod) => {
            setEditingProduct(prod);
            setIsSellModalOpen(true);
          }}
        />
      )}

      {/* VIEW: WISHLIST (Section 9) */}
      {currentView === 'wishlist' && (
        <WishlistSection
          wishlistProducts={wishlistProducts}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          comparedIds={comparedIds}
          onToggleCompare={handleToggleCompare}
          onSelectProduct={handleSelectProduct}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}

      {/* VIEW: RECENTLY VIEWED */}
      {currentView === 'recent' && (
        <ProductGrid
          products={recentlyViewed}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          comparedIds={comparedIds}
          onToggleCompare={handleToggleCompare}
          onSelectProduct={handleSelectProduct}
          filters={filters}
          onFilterChange={handleFilterChange}
          title="Recently Viewed Electronics"
          subtitle="Pre-owned devices you inspected recently"
        />
      )}

      {/* MODALS & DRAWERS */}
      {/* Section 7: Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isWishlisted={wishlistIds.includes(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          isCompared={comparedIds.includes(selectedProduct.id)}
          onToggleCompare={handleToggleCompare}
          onContactSeller={(prod) => setContactProduct(prod)}
          relatedProducts={products.filter((p) => p.id !== selectedProduct.id)}
          onSelectRelated={handleSelectProduct}
        />
      )}

      {/* Section 8: Sell Device Multi-Step Form */}
      {isSellModalOpen && (
        <SellProductForm
          editProduct={editingProduct}
          onClose={() => {
            setIsSellModalOpen(false);
            setEditingProduct(null);
          }}
          onPublishListing={handlePublishListing}
          onUpdateListing={handleUpdateListing}
        />
      )}

      {/* Contact Seller Modal */}
      {contactProduct && (
        <ContactSellerModal
          product={contactProduct}
          onClose={() => setContactProduct(null)}
        />
      )}

      {/* Section 10: Compare Devices Drawer & Modal */}
      <CompareDrawer
        comparedProducts={comparedProducts}
        onRemoveProduct={(id) => setComparedIds((prev) => prev.filter((i) => i !== id))}
        onClearAll={() => setComparedIds([])}
        onSelectProduct={handleSelectProduct}
      />
    </div>
  );
}
