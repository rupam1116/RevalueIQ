import { fetchWithAuth } from "./api";

export type ValuationStatus = "pending" | "analyzing" | "processing" | "completed" | "failed";

function handleApiError(res: Response, errorData: any, defaultMsg: string): never {
  if (res.status === 401 || res.status === 403) {
    throw new Error("Your session has expired. Please sign in again.");
  }
  if (res.status === 404) {
    throw new Error("This valuation could not be found.");
  }
  if (res.status === 429) {
    throw new Error("AI analysis is temporarily unavailable due to usage limits. Please try again later.");
  }
  if (res.status === 502) {
    throw new Error("AI analysis service is temporarily unavailable.");
  }
  if (res.status === 504) {
    throw new Error("AI analysis took too long. Please try again.");
  }
  if (res.status === 400 && errorData.detail) {
    throw new Error(errorData.detail);
  }
  throw new Error(errorData.detail || defaultMsg);
}

/**
 * Triggers backend Gemini AI device image analysis for a valuation owned by the authenticated user.
 */
export async function analyzeValuation(
  token: string,
  valuationId: string
): Promise<ValuationResponse> {
  const res = await fetchWithAuth(`/api/v1/valuations/${valuationId}/analyze`, token, {
    method: "POST",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    handleApiError(res, errorData, "AI analysis could not be completed. You can enter the device details manually and continue.");
  }
  return res.json();
}

export interface ValuationInputData {
  device_name?: string | null;
  category?: string | null;
  brand?: string | null;
  model?: string | null;
  image_reference?: string | null;
  storage?: string | null;
  ram?: string | null;
  purchase_year?: number | null;
  condition?: string | null;
  functional_status?: string | null;
  has_original_box?: boolean | null;
  has_charger?: boolean | null;
  additional_notes?: string | null;
}

export interface ValuationResultData {
  estimated_resale_value?: number | null;
  repair_estimate?: number | null;
  estimated_repair_cost?: number | null;
  recommendation?: string | null;
  market_recommendation?: string | null;
  circular_recommendation?: string | null;
  circularity_score?: number | null;
  confidence?: number | null;
  reasoning?: string | null;
  condition?: string | null;
  damage_detected?: boolean;
  damage_description?: string | null;
  repair_recommendation?: string | null;
}

export interface ValuationResponse {
  id: string;
  valuation_code: string;
  user_id: string;
  device_id?: string | null;
  status: ValuationStatus;
  input: ValuationInputData;
  ai_analysis?: Record<string, any> | null;
  valuation: ValuationResultData;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
}

export interface CreateValuationRequest {
  device_id?: string | null;
  input?: ValuationInputData | null;
  device_name?: string | null;
  category?: string | null;
  brand?: string | null;
  model?: string | null;
  image_reference?: string | null;
}

export interface ValuationStatusResponse {
  id: string;
  valuation_code: string;
  status: ValuationStatus;
  updated_at: string;
  completed_at?: string | null;
}

/**
 * Creates a new pending device appraisal for the authenticated user.
 */
export async function createValuation(
  token: string,
  data: CreateValuationRequest
): Promise<ValuationResponse> {
  const res = await fetchWithAuth("/api/v1/valuations", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    handleApiError(res, errorData, "AI analysis could not be completed. You can enter the device details manually and continue.");
  }
  return res.json();
}

/**
 * Retrieves history of device appraisals belonging to the authenticated user with optional filtering.
 */
export async function getUserValuations(
  token: string,
  params?: { category?: string; status?: string; search?: string }
): Promise<ValuationResponse[]> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== "All") query.append("category", params.category);
  if (params?.status) query.append("status", params.status);
  if (params?.search) query.append("search", params.search);

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const res = await fetchWithAuth(`/api/v1/valuations${queryString}`, token);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    handleApiError(res, errorData, "Unable to retrieve valuation history.");
  }
  return res.json();
}

/**
 * Retrieves details for a specific valuation owned by the authenticated user.
 */
export async function getValuation(
  token: string,
  valuationId: string
): Promise<ValuationResponse> {
  const res = await fetchWithAuth(`/api/v1/valuations/${valuationId}`, token);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    handleApiError(res, errorData, "This valuation could not be found.");
  }
  return res.json();
}

/**
 * Deletes a valuation owned by the authenticated user.
 */
export async function deleteValuation(
  token: string,
  valuationId: string
): Promise<void> {
  const res = await fetchWithAuth(`/api/v1/valuations/${valuationId}`, token, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    handleApiError(res, errorData, "Unable to delete the valuation record.");
  }
}

/**
 * Retrieves status info for a specific valuation owned by the authenticated user.
 */
export async function getValuationStatus(
  token: string,
  valuationId: string
): Promise<ValuationStatusResponse> {
  const res = await fetchWithAuth(`/api/v1/valuations/${valuationId}/status`, token);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    handleApiError(res, errorData, "Valuation status not found.");
  }
  return res.json();
}

export interface ValuationCertificateResponse {
  certificate_id: string;
  valuation_code: string;
  verification_hash: string;
  issued_at: string;
  owner_id: string;
  device_name: string;
  category: string;
  brand: string;
  model: string;
  condition: string;
  estimated_resale_value: number;
  estimated_repair_cost: number;
  circularity_score: number;
  co2_offset_kg: number;
  ewaste_diverted_kg: number;
  market_recommendation: string;
  circular_recommendation: string;
  ai_confidence: number;
  materials_recovered?: {
    gold_mg?: number;
    silver_mg?: number;
    copper_grams?: number;
    cobalt_grams?: number;
    aluminum_grams?: number;
  };
}

/**
 * Retrieves official digital valuation certificate data for an owned valuation.
 */
export async function getValuationCertificate(
  token: string,
  valuationId: string
): Promise<ValuationCertificateResponse> {
  const res = await fetchWithAuth(`/api/v1/valuations/${valuationId}/certificate`, token);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    handleApiError(res, errorData, "Unable to load official valuation certificate.");
  }
  return res.json();
}

export interface RegisterDeviceFromValuationResponse {
  message: string;
  device_id: string;
  valuation_id: string;
  status: string;
}

/**
 * Converts an appraised valuation into a registered device item in user_devices collection.
 */
export async function registerDeviceFromValuation(
  token: string,
  valuationId: string
): Promise<RegisterDeviceFromValuationResponse> {
  const res = await fetchWithAuth(`/api/v1/valuations/${valuationId}/register-device`, token, {
    method: "POST",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    handleApiError(res, errorData, "Unable to register device from valuation.");
  }
  return res.json();
}

export interface DeviceDetectionResult {
  device_name?: string | null;
  category?: string | null;
  brand?: string | null;
  model?: string | null;
  purchase_year?: number | null;
  storage_capacity?: string | null;
  ram?: string | null;
  functional_status?: string | null;
  visible_condition?: string | null;
  damage_detected?: boolean;
  damage_description?: string | null;
  confidence?: number;
}

export interface DeviceDetectionResponse {
  device_detection: DeviceDetectionResult;
}

/**
 * Triggers backend Gemini AI device image detection prior to valuation creation.
 */
export async function detectDevice(
  token: string,
  imageReference: string
): Promise<DeviceDetectionResponse> {
  const res = await fetchWithAuth("/api/v1/valuations/detect-device", token, {
    method: "POST",
    body: JSON.stringify({ image_reference: imageReference }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    handleApiError(res, errorData, "We couldn't identify this device from the image. Please enter the details manually.");
  }
  return res.json();
}


