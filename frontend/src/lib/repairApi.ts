import { fetchWithAuth } from "./api";

export interface DeviceContextInput {
  category?: string | null;
  brand?: string | null;
  model?: string | null;
  ram?: string | null;
  storage?: string | null;
  purchase_year?: number | null;
  functional_status?: string | null;
  condition?: string | null;
  device_id?: string | null;
  valuation_id?: string | null;
  previous_damage?: string | null;
  previous_valuation?: number | null;
}

export interface RepairProblemInput {
  symptom_category?: string | null;
  issue_headline?: string | null;
  detailed_description?: string | null;
  severity_level?: string | null;
  power_status?: boolean | null;
  liquid_exposure?: boolean | null;
  previous_repair_history?: boolean | null;
  symptoms?: string[];
  user_description?: string | null;
  additional_notes?: string | null;
}

export interface RepairAdvisoryRequest {
  device_id?: string | null;
  valuation_id?: string | null;
  device_context?: DeviceContextInput;
  problem_input?: RepairProblemInput;
  image_reference?: string | null;
  additional_notes?: string | null;
}

export interface RequiredPartItem {
  name: string;
  estimated_cost_inr?: number | null;
  part_type?: string;
  availability?: string;
}

export interface GeminiRepairAdvisoryResult {
  diagnosis: string;
  problem_detected: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "UNKNOWN";
  repairability: "REPAIRABLE" | "PARTIALLY_REPAIRABLE" | "NOT_RECOMMENDED" | "UNKNOWN";
  recommended_action: "REPAIR" | "MAINTAIN" | "REPLACE" | "PROFESSIONAL_INSPECTION";
  possible_causes: string[];
  recommended_steps: string[];
  required_parts: RequiredPartItem[];
  parts_cost?: number | null;
  labor_cost?: number | null;
  estimated_repair_cost?: number | null;
  minimum_repair_cost?: number | null;
  maximum_repair_cost?: number | null;
  safety_warnings: string[];
  confidence: number;
  reasoning: string;
}

export interface RepairAdvisoryResponse {
  id: string;
  advisory_code: string;
  user_id: string;
  device_id?: string | null;
  valuation_id?: string | null;
  status: string;
  device_info: Record<string, any>;
  problem_input: Record<string, any>;
  ai_analysis: GeminiRepairAdvisoryResult;
  image_metadata?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

function handleRepairApiError(res: Response, errorData: any, defaultMsg: string): never {
  if (res.status === 401 || res.status === 403) {
    throw new Error("Your session has expired. Please sign in again.");
  }
  if (res.status === 404) {
    throw new Error("This repair advisory could not be found.");
  }
  if (res.status === 429) {
    throw new Error("AI repair analysis is temporarily unavailable because the AI service has reached its usage limit. Please try again later.");
  }
  if (res.status === 503) {
    throw new Error("AI repair analysis is temporarily experiencing high demand. Please try again shortly.");
  }
  if (res.status === 504) {
    throw new Error("AI repair analysis request timed out. Please try again.");
  }
  if (res.status === 502) {
    throw new Error("AI repair analysis service is temporarily unavailable.");
  }
  if (res.status === 400 && errorData.detail) {
    throw new Error(errorData.detail);
  }
  throw new Error(errorData.detail || defaultMsg);
}

/**
 * Triggers backend Gemini AI repair diagnostic analysis for user-provided device & problem context.
 */
export async function analyzeRepairAdvisory(
  token: string,
  requestData: RepairAdvisoryRequest
): Promise<RepairAdvisoryResponse> {
  const res = await fetchWithAuth("/api/v1/repair-advisory/analyze", token, {
    method: "POST",
    body: JSON.stringify(requestData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    handleRepairApiError(res, errorData, "Unable to complete AI repair diagnostic analysis.");
  }
  return res.json();
}

/**
 * Retrieves history of repair advisories owned by the authenticated user.
 */
export async function getUserRepairAdvisories(
  token: string,
  params?: { device_id?: string; severity?: string; search?: string }
): Promise<RepairAdvisoryResponse[]> {
  const query = new URLSearchParams();
  if (params?.device_id) query.append("device_id", params.device_id);
  if (params?.severity && params.severity !== "All") query.append("severity", params.severity);
  if (params?.search) query.append("search", params.search);

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const res = await fetchWithAuth(`/api/v1/repair-advisory${queryString}`, token);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    handleRepairApiError(res, errorData, "Unable to retrieve repair advisory history.");
  }
  return res.json();
}

/**
 * Retrieves a single repair advisory by ID.
 */
export async function getRepairAdvisoryById(
  token: string,
  advisoryId: string
): Promise<RepairAdvisoryResponse> {
  const res = await fetchWithAuth(`/api/v1/repair-advisory/${advisoryId}`, token);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    handleRepairApiError(res, errorData, "This repair advisory could not be found.");
  }
  return res.json();
}

/**
 * Deletes a repair advisory owned by the authenticated user.
 */
export async function deleteRepairAdvisory(
  token: string,
  advisoryId: string
): Promise<void> {
  const res = await fetchWithAuth(`/api/v1/repair-advisory/${advisoryId}`, token, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    if (res.status === 401 || res.status === 403) {
      throw new Error("Your session has expired. Please sign in again.");
    }
    if (res.status === 404) {
      throw new Error("This diagnostic report no longer exists or you do not have permission to delete it.");
    }
    if (res.status >= 500) {
      throw new Error("Unable to delete the diagnostic report. Please try again.");
    }
    throw new Error(errorData.detail || "Unable to delete the diagnostic report. Please try again.");
  }
}
