import { fetchWithAuth, getApiUrl } from "./api";
import {
  RepairCenterItem,
  RepairCenterListResponse,
  RepairCenterQueryParams,
  RepairRecommendationPayload,
} from "@/types/repairCenter";

export interface DrivingRouteResult {
  distance_km: number;
  duration_minutes: number;
  geometry?: {
    type: string;
    coordinates: [number, number][];
  };
  summary?: string;
  provider: string;
}

/**
 * Searches and lists verified repair centers with query filters and GPS distance calculation.
 */
export async function getRepairCenters(
  params: RepairCenterQueryParams = {}
): Promise<RepairCenterListResponse> {
  const query = new URLSearchParams();

  if (params.search && params.search.trim()) query.append("search", params.search.trim());
  if (params.brand && params.brand !== "All") query.append("brand", params.brand);
  if (params.category && params.category !== "All") query.append("category", params.category);
  if (params.repair_type && params.repair_type !== "All") query.append("repair_type", params.repair_type);
  if (params.city && params.city !== "All") query.append("city", params.city);
  if (params.area) query.append("area", params.area);
  if (params.postal_code) query.append("postal_code", params.postal_code);
  if (params.latitude !== undefined && params.latitude !== null) query.append("latitude", params.latitude.toString());
  if (params.longitude !== undefined && params.longitude !== null) query.append("longitude", params.longitude.toString());
  if (params.radius) query.append("radius", params.radius.toString());
  if (params.verified_only) query.append("verified_only", "true");
  if (params.provider) query.append("provider", params.provider);
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const res = await fetchWithAuth(`/api/v1/repair-centers${queryString}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Unable to fetch repair centers.");
  }

  return res.json();
}

/**
 * Retrieves full details for a specific repair center by ID.
 */
export async function getRepairCenterById(centerId: string, provider?: string): Promise<RepairCenterItem> {
  const query = provider ? `?provider=${encodeURIComponent(provider)}` : "";
  const res = await fetchWithAuth(`/api/v1/repair-centers/${centerId}${query}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Repair center not found.");
  }

  return res.json();
}

/**
 * Recommends repair centers based on device context, problem symptoms, and location.
 */
export async function getRepairCenterRecommendations(
  payload: RepairRecommendationPayload,
  provider?: string
): Promise<RepairCenterListResponse> {
  const query = provider ? `?provider=${encodeURIComponent(provider)}` : "";
  const res = await fetchWithAuth(`/api/v1/repair-centers/recommend${query}`, null, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Unable to compute repair center recommendations.");
  }

  return res.json();
}

/**
 * Calculates live driving route, distance, and duration using OSRM.
 */
export async function getRepairCenterRoute(
  userLat: number,
  userLon: number,
  destLat: number,
  destLon: number,
  provider?: string
): Promise<DrivingRouteResult> {
  const query = new URLSearchParams({
    user_lat: userLat.toString(),
    user_lon: userLon.toString(),
    dest_lat: destLat.toString(),
    dest_lon: destLon.toString(),
  });
  if (provider) query.append("provider", provider);

  const res = await fetchWithAuth(`/api/v1/repair-centers/route?${query.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Unable to calculate route.");
  }

  return res.json();
}
