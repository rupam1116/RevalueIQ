import { fetchWithAuth } from "./api";

export type LifecycleTier = "recommendation_generated" | "action_initiated" | "externally_completed";
export type ActivityType = "valuation" | "repair" | "marketplace" | "donation";

export interface ActivityDetails {
  condition_grade?: string | null;
  repair_shop?: string | null;
  buyer_or_ngo?: string | null;
  repair_cost?: number | null;
  resale_price?: number | null;
  location?: string | null;
  notes?: string | null;
  external_reference?: string | null;
  completed_at?: string | null;
}

export interface ActivityItem {
  id: string;
  event_code: string;
  type: ActivityType;
  tier: LifecycleTier;
  title: string;
  device_name: string;
  category: string;
  date: string;
  timestamp: number;
  status: string;
  value_inr: number;
  description: string;
  verified_co2_saved_kg: number;
  potential_co2_opportunity_kg: number;
  verified_ewaste_prevented_kg: number;
  potential_ewaste_opportunity_kg: number;
  report_id?: string | null;
  can_complete: boolean;
  details: ActivityDetails;
}

export interface ActivityTimelineResponse {
  items: ActivityItem[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface MonthlyTrendItem {
  month: string;
  valuations: number;
  repairs: number;
  sales: number;
  donations: number;
}

export interface CategoryDistributionItem {
  name: string;
  count: number;
  percentage: number;
}

export interface HistoryAnalyticsResponse {
  total_analyzed_units: number;
  recommendations_count: number;
  actions_initiated_count: number;
  externally_completed_count: number;
  repairs_completed: number;
  repairs_initiated: number;
  devices_sold: number;
  devices_listed: number;
  devices_donated: number;
  donations_initiated: number;
  verified_co2_saved_kg: number;
  potential_co2_opportunity_kg: number;
  verified_ewaste_prevented_kg: number;
  potential_ewaste_opportunity_kg: number;
  verified_money_earned_or_saved: number;
  circular_score: number;
  monthly_trends: MonthlyTrendItem[];
  category_breakdown: CategoryDistributionItem[];
}

export interface RecentAuditedDeviceItem {
  id: string;
  device_name: string;
  brand: string;
  category: string;
  condition: string;
  estimated_value_inr: number;
  recommended_action: string;
  status: string;
  last_updated: string;
  valuation_id?: string | null;
  device_id?: string | null;
}

export interface AuditReportItem {
  id: string;
  title: string;
  category: string;
  date: string;
  format: string;
  file_size: string;
  description: string;
  valuation_id?: string | null;
  event_id?: string | null;
}

export interface LogLifecycleEventPayload {
  type: ActivityType;
  device_name: string;
  category: string;
  tier?: LifecycleTier;
  title: string;
  description?: string;
  shop_name?: string;
  ngo_name?: string;
  value_inr?: number;
  device_id?: string;
  valuation_id?: string;
  external_reference?: string;
}

export interface ConfirmCompletionPayload {
  completed_date?: string;
  final_cost_or_earning_inr?: number;
  service_provider_or_recipient?: string;
  completion_notes?: string;
  receipt_or_reference?: string;
}

/**
 * Fetches real activity timeline from MongoDB.
 */
export async function fetchHistoryTimeline(
  token: string,
  params?: {
    q?: string;
    type?: string;
    tier?: string;
    page?: number;
    limit?: number;
  }
): Promise<ActivityTimelineResponse> {
  const query = new URLSearchParams();
  if (params?.q) query.set("q", params.q);
  if (params?.type && params.type !== "All") query.set("type", params.type.toLowerCase());
  if (params?.tier && params.tier !== "All") query.set("tier", params.tier);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const res = await fetchWithAuth(`/api/v1/history/timeline?${query.toString()}`, token);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Unable to load activity history timeline.");
  }
  return res.json();
}

/**
 * Fetches real aggregated analytics strictly computed from MongoDB.
 */
export async function fetchHistoryAnalytics(token: string): Promise<HistoryAnalyticsResponse> {
  const res = await fetchWithAuth("/api/v1/history/analytics", token);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Unable to load lifecycle analytics.");
  }
  return res.json();
}

/**
 * Fetches real recent devices audited or registered by user.
 */
export async function fetchRecentAuditedDevices(token: string): Promise<RecentAuditedDeviceItem[]> {
  const res = await fetchWithAuth("/api/v1/history/recent-devices", token);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Unable to load audited devices.");
  }
  return res.json();
}

/**
 * Fetches real audit certificates and reports.
 */
export async function fetchAuditReports(token: string): Promise<AuditReportItem[]> {
  const res = await fetchWithAuth("/api/v1/history/reports", token);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Unable to load audit certificates.");
  }
  return res.json();
}

/**
 * Logs a new action initiated or completed event.
 */
export async function logLifecycleEvent(
  token: string,
  payload: LogLifecycleEventPayload
): Promise<{ message: string; event_id: string; event_code: string; tier: string }> {
  const res = await fetchWithAuth("/api/v1/history/events", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to record lifecycle action.");
  }
  return res.json();
}

/**
 * Confirms external completion of an initiated action with verified details.
 */
export async function confirmCompletion(
  token: string,
  eventId: string,
  payload: ConfirmCompletionPayload
): Promise<{ message: string; event_id: string; tier: string; verified_co2_saved_kg: number; verified_ewaste_prevented_kg: number }> {
  const res = await fetchWithAuth(`/api/v1/history/events/${eventId}/complete`, token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to confirm action completion.");
  }
  return res.json();
}
