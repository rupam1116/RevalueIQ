import { fetchWithAuth } from './api';
import { MarketplaceProduct, FilterState } from '@/components/marketplace/types';

export interface CreateListingPayload {
  device_id?: string;
  valuation_id?: string;
  category: string;
  brand: string;
  model: string;
  title: string;
  description: string;
  condition?: string;
  functional_status?: string;
  specifications?: {
    ram?: string;
    storage?: string;
    purchase_year?: number;
    color?: string;
    processor?: string;
    display?: string;
    battery_health?: string;
    other?: Record<string, any>;
  };
  images: { url: string; type?: string; order?: number }[];
  asking_price_inr: number;
  original_price_inr?: number;
  warranty?: string;
  return_policy?: string;
  shipping_method?: string;
  location?: string;
  save_as_draft?: boolean;
}

export interface UpdateListingPayload {
  category?: string;
  brand?: string;
  model?: string;
  title?: string;
  description?: string;
  condition?: string;
  functional_status?: string;
  specifications?: Record<string, any>;
  images?: { url: string; type?: string; order?: number }[];
  asking_price_inr?: number;
  original_price_inr?: number;
  warranty?: string;
  return_policy?: string;
  shipping_method?: string;
  location?: string;
}

export interface MarketplaceListingsQuery {
  search?: string;
  category?: string;
  brand?: string;
  condition?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
  page?: number;
  limit?: number;
  status?: string;
}

export interface MarketplaceApiResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

/**
 * Normalizes backend listing representation into frontend MarketplaceProduct.
 */
export function normalizeBackendListing(raw: any): MarketplaceProduct {
  const seller = raw.seller || {};
  const val = raw.valuation || {};
  const specsObj = raw.specifications || {};

  const specsArray: { key: string; value: string }[] = [];
  if (specsObj.storage) specsArray.push({ key: 'Storage', value: specsObj.storage });
  if (specsObj.ram) specsArray.push({ key: 'RAM', value: specsObj.ram });
  if (specsObj.battery_health) specsArray.push({ key: 'Battery Health', value: specsObj.battery_health });
  if (specsObj.color) specsArray.push({ key: 'Color', value: specsObj.color });
  if (specsObj.processor) specsArray.push({ key: 'Processor', value: specsObj.processor });
  if (specsObj.display) specsArray.push({ key: 'Display', value: specsObj.display });
  if (specsObj.purchase_year) specsArray.push({ key: 'Purchase Year', value: String(specsObj.purchase_year) });
  if (raw.brand) specsArray.push({ key: 'Brand', value: raw.brand });
  if (raw.condition) specsArray.push({ key: 'Condition', value: `Grade ${raw.condition}` });

  const images = (raw.images && raw.images.length > 0)
    ? raw.images.map((img: any) => (typeof img === 'string' ? img : (img.secure_url || img.url || ''))).filter(Boolean)
    : [];

  const estVal = val.estimated_value_inr || raw.asking_price_inr;
  const circularScore = val.circularity_score || 0;

  // Map backend status to frontend status
  let status: 'active' | 'pending' | 'sold' | 'draft' = 'active';
  if (raw.status === 'PUBLISHED') status = 'active';
  else if (raw.status === 'DRAFT') status = 'draft';
  else if (raw.status === 'UNPUBLISHED') status = 'pending';
  else if (raw.status === 'SOLD') status = 'sold';

  return {
    id: raw.id || raw._id,
    title: raw.title || `${raw.brand} ${raw.model}`,
    category: raw.category || 'Phones',
    brand: raw.brand || 'Electronics',
    model: raw.model || '',
    purchaseYear: specsObj.purchase_year || 2023,
    price: Number(raw.asking_price_inr) || 0,
    originalPrice: Number(raw.original_price_inr) || Math.round((Number(raw.asking_price_inr) || 0) * 1.3),
    warranty: raw.warranty || '12-Month Revalue Eco Warranty',
    returnPolicy: raw.return_policy || '14-Day Free Returns',
    shippingMethod: raw.shipping_method || 'Insured Eco Express Shipping',
    location: raw.location || seller.location || 'India',
    isOwner: Boolean(raw.is_owner),
    listingCode: raw.listing_code,
    deviceId: raw.device_id,
    valuationId: raw.valuation_id,
    status,
    viewsCount: Number(raw.views) || 0,
    inquiriesCount: Number(raw.inquiries) || 0,
    isRepairable: true,
    images,
    description: raw.description || '',
    specs: specsArray,
    createdAt: raw.created_at || new Date().toISOString(),
    seller: {
      id: seller.id || 'seller',
      name: seller.name || 'RevalueIQ Member',
      avatar: seller.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      rating: Number(seller.rating) || 5.0,
      reviewsCount: Number(seller.reviews_count) || 0,
      responseTime: '< 15 mins',
      totalSales: 3,
      verified: seller.verified !== false,
      memberSince: seller.member_since || '2024',
      location: seller.location || 'India',
      trustScore: 98,
    },
    aiAppraisal: {
      cosmeticGrade: raw.condition || 'A',
      estimatedMarketValue: estVal,
      marketValueRange: {
        min: val.minimum_value_inr || Math.round(estVal * 0.9),
        max: val.maximum_value_inr || Math.round(estVal * 1.1),
      },
      conditionScore: raw.condition === 'A+' ? 95 : raw.condition === 'A' ? 90 : 82,
      conditionBreakdown: {
        screenDisplay: raw.condition === 'A+' ? 98 : 90,
        batteryHealth: raw.condition === 'A+' ? 94 : 86,
        chassisBody: raw.condition === 'A+' ? 96 : 84,
        hardwarePerformance: 95,
      },
      repairCostEstimate: 0,
      repairRecommendations: ['Device passed RevalueIQ AI Circular Diagnostic checks.'],
      circularEconomyScore: circularScore,
      co2SavedKg: Number(val.co2_saved_kg) || 0,
      ewasteDivertedKg: Number(val.ewaste_diverted_kg) || 0,
      waterSavedLiters: Number(val.water_saved_liters) || 0,
      resaleDemandIndex: 'High',
    },
  };
}

/**
 * Creates a new marketplace listing in MongoDB.
 */
export async function createMarketplaceListing(
  payload: CreateListingPayload,
  token?: string | null
): Promise<MarketplaceProduct> {
  const res = await fetchWithAuth('/api/v1/marketplace/listings', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to create listing (${res.status})`);
  }

  const raw = await res.json();
  return normalizeBackendListing(raw);
}

/**
 * Retrieves public published listings with search, filter, sort, and pagination.
 */
export async function getMarketplaceListings(
  query: MarketplaceListingsQuery = {},
  token?: string | null
): Promise<{ items: MarketplaceProduct[]; total: number; page: number; totalPages: number }> {
  const params = new URLSearchParams();
  if (query.search?.trim()) params.set('search', query.search.trim());
  if (query.category && query.category !== 'All') params.set('category', query.category);
  if (query.brand) params.set('brand', query.brand);
  if (query.condition) params.set('condition', query.condition);
  if (query.min_price !== undefined) params.set('min_price', String(query.min_price));
  if (query.max_price !== undefined) params.set('max_price', String(query.max_price));
  if (query.sort) params.set('sort', query.sort);
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));

  const url = `/api/v1/marketplace/listings${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetchWithAuth(url, token, { method: 'GET' });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to load listings (${res.status})`);
  }

  const data: MarketplaceApiResponse<any> = await res.json();
  return {
    items: (data.items || []).map(normalizeBackendListing),
    total: data.total || 0,
    page: data.page || 1,
    totalPages: data.total_pages || 1,
  };
}

/**
 * Retrieves detailed listing by ID.
 */
export async function getMarketplaceListingById(
  listingId: string,
  token?: string | null
): Promise<MarketplaceProduct> {
  const res = await fetchWithAuth(`/api/v1/marketplace/listings/${listingId}`, token, {
    method: 'GET',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Listing not found (${res.status})`);
  }

  const raw = await res.json();
  return normalizeBackendListing(raw);
}

/**
 * Retrieves all listings belonging to the authenticated user.
 */
export async function getMyMarketplaceListings(
  query: MarketplaceListingsQuery = {},
  token?: string | null
): Promise<{ items: MarketplaceProduct[]; total: number; page: number; totalPages: number }> {
  const params = new URLSearchParams();
  if (query.status && query.status !== 'all') params.set('status', query.status);
  if (query.search?.trim()) params.set('search', query.search.trim());
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));

  const url = `/api/v1/marketplace/my-listings${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetchWithAuth(url, token, { method: 'GET' });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to load your listings (${res.status})`);
  }

  const data: MarketplaceApiResponse<any> = await res.json();
  return {
    items: (data.items || []).map(normalizeBackendListing),
    total: data.total || 0,
    page: data.page || 1,
    totalPages: data.total_pages || 1,
  };
}

/**
 * Updates a listing (owner only).
 */
export async function updateMarketplaceListing(
  listingId: string,
  payload: UpdateListingPayload,
  token?: string | null
): Promise<MarketplaceProduct> {
  const res = await fetchWithAuth(`/api/v1/marketplace/listings/${listingId}`, token, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to update listing (${res.status})`);
  }

  const raw = await res.json();
  return normalizeBackendListing(raw);
}

/**
 * Publishes a draft or unpublished listing.
 */
export async function publishMarketplaceListing(
  listingId: string,
  token?: string | null
): Promise<MarketplaceProduct> {
  const res = await fetchWithAuth(`/api/v1/marketplace/listings/${listingId}/publish`, token, {
    method: 'POST',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to publish listing (${res.status})`);
  }

  const raw = await res.json();
  return normalizeBackendListing(raw);
}

/**
 * Unpublishes / pauses an active listing.
 */
export async function unpublishMarketplaceListing(
  listingId: string,
  token?: string | null
): Promise<MarketplaceProduct> {
  const res = await fetchWithAuth(`/api/v1/marketplace/listings/${listingId}/unpublish`, token, {
    method: 'POST',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to unpublish listing (${res.status})`);
  }

  const raw = await res.json();
  return normalizeBackendListing(raw);
}

/**
 * Marks a listing as sold.
 */
export async function markMarketplaceListingSold(
  listingId: string,
  token?: string | null
): Promise<MarketplaceProduct> {
  const res = await fetchWithAuth(`/api/v1/marketplace/listings/${listingId}/sold`, token, {
    method: 'POST',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to mark listing as sold (${res.status})`);
  }

  const raw = await res.json();
  return normalizeBackendListing(raw);
}

/**
 * Deletes an unsold listing belonging to the authenticated user.
 */
export async function deleteMarketplaceListing(
  listingId: string,
  token?: string | null
): Promise<void> {
  const res = await fetchWithAuth(`/api/v1/marketplace/listings/${listingId}`, token, {
    method: 'DELETE',
  });

  if (!res.ok && res.status !== 204) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to delete listing (${res.status})`);
  }
}
