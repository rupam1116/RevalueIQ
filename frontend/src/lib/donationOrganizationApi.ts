import { getApiUrl } from "./api";

export interface DonationOrganization {
  id: string;
  provider: string;
  provider_organization_id?: string;
  name: string;
  category: string;
  description?: string | null;
  address: string;
  city: string;
  area?: string | null;
  postal_code?: string | null;
  latitude: number;
  longitude: number;
  phone?: string | null;
  website?: string | null;
  email?: string | null;
  opening_hours?: string | null;
  accepted_donation_types?: string[];
  accepted_item_categories?: string[];
  is_verified: boolean;
  verification_source?: string | null;
  provider_url?: string | null;
  last_updated?: string | null;
  donation_acceptance_confirmed: boolean;
  donation_acceptance_status?: string;
  rating?: number | null;
  review_count?: number | null;
  recommendation_score?: number | null;
  recommendation_reason?: string | null;
  donation_purpose?: string | null;
  distance_km?: number | null;
}

export interface DonationOrgListResponse {
  items: DonationOrganization[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
  user_location?: { latitude: number; longitude: number } | null;
  query_used?: string | null;
  provider: string;
}

export interface DonationRouteResult {
  distance_km: number;
  duration_minutes: number;
  geometry?: {
    type: string;
    coordinates: [number, number][];
  } | null;
  summary?: string | null;
  provider: string;
}

export interface DonationQueryParams {
  search?: string;
  category?: string;
  donation_type?: string;
  city?: string;
  area?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  page?: number;
  limit?: number;
}

export async function fetchDonationOrganizations(
  params: DonationQueryParams = {}
): Promise<DonationOrgListResponse> {
  const apiUrl = getApiUrl();
  const searchParams = new URLSearchParams();

  if (params.search && params.search.trim()) {
    searchParams.set("search", params.search.trim());
  }
  if (params.category && params.category !== "All Categories") {
    searchParams.set("category", params.category);
  }
  if (params.donation_type && params.donation_type.trim()) {
    searchParams.set("donation_type", params.donation_type.trim());
  }
  if (params.city && params.city.trim()) {
    searchParams.set("city", params.city.trim());
  }
  if (params.area && params.area.trim()) {
    searchParams.set("area", params.area.trim());
  }
  if (params.postal_code && params.postal_code.trim()) {
    searchParams.set("postal_code", params.postal_code.trim());
  }
  if (params.latitude !== undefined && params.latitude !== null) {
    searchParams.set("latitude", params.latitude.toString());
  }
  if (params.longitude !== undefined && params.longitude !== null) {
    searchParams.set("longitude", params.longitude.toString());
  }
  if (params.radius) {
    searchParams.set("radius", params.radius.toString());
  }
  if (params.page) {
    searchParams.set("page", params.page.toString());
  }
  if (params.limit) {
    searchParams.set("limit", params.limit.toString());
  }

  const queryString = searchParams.toString();
  const url = `${apiUrl}/api/v1/donation-organizations${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch donation organizations: ${response.statusText}`);
  }

  return await response.json();
}

export async function fetchDonationOrganizationById(
  id: string
): Promise<DonationOrganization> {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/api/v1/donation-organizations/${encodeURIComponent(id)}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch organization details: ${response.statusText}`);
  }

  return await response.json();
}

export async function fetchDonationRoute(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): Promise<DonationRouteResult> {
  const apiUrl = getApiUrl();
  const url = `${apiUrl}/api/v1/donation-organizations/route?lat1=${lat1}&lon1=${lon1}&lat2=${lat2}&lon2=${lon2}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch driving route: ${response.statusText}`);
  }

  return await response.json();
}

export interface DonationRecommendationPayload {
  device?: {
    category?: string;
    brand?: string;
    model?: string;
    condition?: string;
    valuation_id?: string;
  };
  donation?: {
    purpose?: string;
    recommended_action?: string;
  };
  location?: {
    latitude?: number;
    longitude?: number;
    city?: string;
    area?: string;
    postal_code?: string;
    radius_km?: number;
  };
}

export async function getDonationRecommendations(
  payload: DonationRecommendationPayload
): Promise<DonationOrgListResponse> {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/api/v1/donation-organizations/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to calculate donation recommendations: ${response.statusText}`);
  }

  return await response.json();
}
