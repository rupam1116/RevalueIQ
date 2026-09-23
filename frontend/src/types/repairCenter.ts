export interface RepairCenterItem {
  id: string;
  name: string;
  provider?: string;
  provider_place_id?: string | null;
  google_place_id?: string | null;
  brand_services: string[];
  device_categories: string[];
  repair_services: string[];
  address: string;
  city: string;
  state?: string;
  postal_code?: string;
  latitude: number;
  longitude: number;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  rating: number;
  review_count: number;
  opening_hours?: string | null;
  open_now?: boolean | null;
  business_status?: string | null;
  google_maps_url?: string | null;
  types?: string[];
  photos?: string[];
  is_verified: boolean;
  is_active: boolean;
  is_authorized?: boolean;
  hero_image?: string | null;
  logo?: string | null;
  source?: string | null;
  last_synced_at?: string | null;
  distance_km?: number | null;
  match_score?: number | null;
  matched_services?: string[];
  matched_brands?: string[];
  recommendation_reason?: string | null;
}

export interface RepairCenterListResponse {
  items: RepairCenterItem[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
  user_location?: {
    latitude: number;
    longitude: number;
    city?: string;
  } | null;
  query_used?: string | null;
  provider?: string;
}

export interface RepairCenterQueryParams {
  search?: string;
  brand?: string;
  category?: string;
  repair_type?: string;
  city?: string;
  area?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  verified_only?: boolean;
  provider?: string;
  page?: number;
  limit?: number;
}

export interface RepairRecommendationPayload {
  device?: {
    category?: string;
    brand?: string;
    model?: string;
  };
  repair?: {
    problem?: string;
    severity?: string;
    recommended_action?: string;
    estimated_repair_cost?: number;
    valuation_id?: string;
    advisory_id?: string;
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

export interface ActiveRepairContext {
  category?: string;
  brand?: string;
  model?: string;
  problem?: string;
  severity?: string;
  recommended_action?: string;
  estimated_repair_cost?: number;
  valuation_id?: string;
  advisory_id?: string;
}
