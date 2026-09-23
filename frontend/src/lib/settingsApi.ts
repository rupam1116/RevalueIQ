import { fetchWithAuth } from "./api";

export interface NotificationPreferences {
  in_app: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  marketplace_alerts: boolean;
  repair_status_updates: boolean;
  donation_impact_reports: boolean;
  promotional_newsletters: boolean;
}

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export interface PrivacyPreferences {
  profile_visibility: "Public" | "Members Only" | "Private";
  activity_visibility: "Public" | "Followers Only" | "Private";
  stats_visibility: "Public Leaderboards" | "Members Only" | "Hidden";
  search_engine_indexing: boolean;
  ai_data_personalization: boolean;
  anonymized_analytics: boolean;
  cookies: CookiePreferences;
}

export interface AccessibilityOptions {
  high_contrast: boolean;
  reduced_motion: boolean;
}

export interface AppPreferences {
  theme: "Light" | "Dark" | "System Default";
  language: string;
  currency: string;
  distance_unit: "Kilometers (km)" | "Miles (mi)";
  date_format: "YYYY-MM-DD" | "DD/MM/YYYY" | "MM/DD/YYYY";
  accessibility: AccessibilityOptions;
  animations: boolean;
  compact_mode: boolean;
}

export interface AiPreferences {
  preferred_recommendation_style: "Repair First" | "Sell First" | "Donation First" | "Balanced";
  enable_ai_learning: boolean;
  enable_personalized_suggestions: boolean;
  allow_ai_device_history: boolean;
}

export interface UserSettingsResponse {
  user_id: string;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  preferences: AppPreferences;
  ai: AiPreferences;
  updated_at?: string;
}

export interface UserSettingsUpdateRequest {
  notifications?: Partial<NotificationPreferences>;
  privacy?: Partial<PrivacyPreferences>;
  preferences?: Partial<AppPreferences>;
  ai?: Partial<AiPreferences>;
}

export interface SupportTicketCreateRequest {
  type: "contact" | "bug" | "feature";
  subject: string;
  details: string;
}

/**
 * Fetches authenticated user settings from FastAPI backend.
 */
export async function getUserSettings(token: string): Promise<UserSettingsResponse> {
  const res = await fetchWithAuth("/api/v1/settings", token);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Unable to load your settings.");
  }
  return res.json();
}

/**
 * Updates whitelisted preferences in FastAPI backend.
 */
export async function updateUserSettings(
  token: string,
  data: UserSettingsUpdateRequest
): Promise<UserSettingsResponse> {
  const res = await fetchWithAuth("/api/v1/settings", token, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Unable to update your settings. Please try again.");
  }
  return res.json();
}

/**
 * Exports full user-scoped archive for GDPR / privacy download.
 */
export async function exportUserData(token: string): Promise<any> {
  const res = await fetchWithAuth("/api/v1/account/export", token);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Unable to generate data export archive.");
  }
  return res.json();
}

/**
 * Purges user activity logs and notifications.
 */
export async function clearUserHistory(token: string): Promise<{ success: boolean; cleared_count: number }> {
  const res = await fetchWithAuth("/api/v1/account/clear-history", token, {
    method: "POST",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to clear activity history.");
  }
  return res.json();
}

/**
 * Deactivates authenticated user account.
 */
export async function deactivateAccount(token: string): Promise<{ success: boolean; message: string }> {
  const res = await fetchWithAuth("/api/v1/account/deactivate", token, {
    method: "POST",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to deactivate account.");
  }
  return res.json();
}

/**
 * Soft deletes user account permanently and invalidates sessions.
 */
export async function deleteAccount(token: string): Promise<{ success: boolean; message: string }> {
  const res = await fetchWithAuth("/api/v1/account/delete", token, {
    method: "POST",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to delete account.");
  }
  return res.json();
}

/**
 * Submits real customer support ticket or bug report.
 */
export async function submitSupportTicket(
  token: string,
  data: SupportTicketCreateRequest
): Promise<any> {
  const res = await fetchWithAuth("/api/v1/support/ticket", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to submit support ticket.");
  }
  return res.json();
}
