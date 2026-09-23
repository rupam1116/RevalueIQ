import { fetchWithAuth } from "./api";

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
}

export interface UserProfileResponse {
  id: string;
  firebase_uid: string;
  email: string;
  full_name: string;
  photo_url?: string;
  phone?: string;
  bio?: string;
  city?: string;
  country?: string;
  occupation?: string;
  organization?: string;
  language?: string;
  timezone?: string;
  role: string;
  status: string;
  circular_score: number;
  circular_grade: string;
  co2_saved_kg: number;
  ewaste_prevented_kg: number;
  karma_points: number;
  level: number;
  social_links?: SocialLinks;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfileUpdateRequest {
  full_name?: string;
  photo_url?: string;
  phone?: string;
  bio?: string;
  city?: string;
  country?: string;
  language?: string;
  timezone?: string;
  occupation?: string;
  organization?: string;
  social_links?: SocialLinks;
}

export interface UserStatsResponse {
  circular_score: number;
  circular_grade: string;
  co2_saved_kg: number;
  ewaste_prevented_kg: number;
  karma_points: number;
  level: number;
  devices_count: number;
  valuations_count: number;
  repair_reports_count: number;
  marketplace_listings_count: number;
  donations_count: number;
  portfolio_value?: number;
  repair_savings?: number;
  grade_a_percentage?: number;
}

export interface UserDeviceResponse {
  id: string;
  user_id: string;
  brand: string;
  model: string;
  category: string;
  storage?: string;
  ram?: string;
  serial_number?: string;
  purchase_year?: string;
  condition?: string;
  status?: string;
  primary_image?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserDeviceCreateRequest {
  brand: string;
  model: string;
  category: string;
  storage?: string;
  ram?: string;
  serial_number?: string;
  purchase_year?: string;
  condition?: string;
  status?: string;
  primary_image?: string;
  notes?: string;
}

export interface UserDeviceUpdateRequest {
  brand?: string;
  model?: string;
  category?: string;
  storage?: string;
  ram?: string;
  serial_number?: string;
  purchase_year?: string;
  condition?: string;
  status?: string;
  primary_image?: string;
  notes?: string;
}

/**
  Fetch authenticated user profile from FastAPI backend.
 */
export async function getUserProfile(token: string): Promise<UserProfileResponse> {
  const res = await fetchWithAuth("/api/v1/users/me/profile", token);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Unable to load your profile.");
  }
  return res.json();
}

/**
  Update authenticated user profile in FastAPI backend.
 */
export async function updateUserProfile(
  token: string,
  data: UserProfileUpdateRequest
): Promise<UserProfileResponse> {
  const res = await fetchWithAuth("/api/v1/users/me/profile", token, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Unable to update your profile. Please try again.");
  }
  return res.json();
}

/**
  Fetch real circular economy statistics for authenticated user.
 */
export async function getUserStats(token: string): Promise<UserStatsResponse> {
  const res = await fetchWithAuth("/api/v1/users/me/stats", token);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Unable to load your profile statistics.");
  }
  return res.json();
}

/**
  List all registered devices belonging to authenticated user.
 */
export async function getUserDevices(token: string): Promise<UserDeviceResponse[]> {
  const res = await fetchWithAuth("/api/v1/users/me/devices", token);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Unable to load your registered devices.");
  }
  return res.json();
}

/**
  Register a new device under authenticated user's portfolio.
 */
export async function createUserDevice(
  token: string,
  data: UserDeviceCreateRequest
): Promise<UserDeviceResponse> {
  const res = await fetchWithAuth("/api/v1/users/me/devices", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Unable to add the device. Please try again.");
  }
  return res.json();
}

/**
  Update a device owned by authenticated user.
 */
export async function updateUserDevice(
  token: string,
  deviceId: string,
  data: UserDeviceUpdateRequest
): Promise<UserDeviceResponse> {
  const res = await fetchWithAuth(`/api/v1/users/me/devices/${deviceId}`, token, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Unable to update the device. Please try again.");
  }
  return res.json();
}

/**
  Delete a device owned by authenticated user.
 */
export async function deleteUserDevice(
  token: string,
  deviceId: string
): Promise<void> {
  const res = await fetchWithAuth(`/api/v1/users/me/devices/${deviceId}`, token, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Unable to delete the device. Please try again.");
  }
}
