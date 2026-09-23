import { fetchWithAuth } from "./api";

export interface PlanFeatureItem {
  title: string;
  included: boolean;
  is_new?: boolean;
  badge?: string;
}

export interface EcoPlanDetail {
  id: "free" | "pro" | "enterprise";
  name: string;
  tagline: string;
  price_monthly_inr: number;
  price_yearly_inr: number;
  popular?: boolean;
  badge?: string;
  features: PlanFeatureItem[];
  limits: {
    monthly_valuations: number;
    karma_cap: number;
    karma_multiplier: number;
    cv_diagnostics: boolean;
    marketplace_fee_discount_pct: number;
    api_access: boolean;
  };
}

export interface PlanInvoice {
  id: string;
  order_id: string;
  amount_inr: number;
  currency: string;
  status: string;
  plan_tier: string;
  paid_at: string;
  receipt_reference?: string;
}

export interface UserSubscriptionResponse {
  tier: "free" | "pro" | "enterprise";
  tier_name: string;
  status: string;
  billing_cycle: "monthly" | "yearly";
  started_at?: string;
  expires_at?: string;
  is_pro_or_higher: boolean;
  is_enterprise: boolean;
  monthly_valuations_limit: number;
  monthly_valuations_used: number;
  eco_credits_multiplier?: number;
  karma_multiplier: number;
  can_export_certificates: boolean;
  has_api_access: boolean;
  has_cv_diagnostics: boolean;
  recent_invoices: PlanInvoice[];
}

export interface ActivatePlanResponse {
  success: boolean;
  message: string;
  tier: "free" | "pro" | "enterprise";
  tier_name: string;
  status: string;
  billing_cycle: string;
  expires_at?: string;
  invoice_id?: string;
}

const EVENT_NAME = "revalueiq:ecoplan-updated";

/**
 * Dispatches a global event so all UI components update in real-time.
 */
export function dispatchEcoPlanUpdate(data?: Partial<UserSubscriptionResponse>) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: data }));
  }
}

/**
 * Subscribe to real-time eco plan updates across components.
 */
export function subscribeEcoPlanUpdate(callback: (data?: Partial<UserSubscriptionResponse>) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const custom = e as CustomEvent<Partial<UserSubscriptionResponse>>;
    callback(custom.detail);
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

/**
 * Fetch all available eco plan tiers and perks.
 */
export async function getEcoPlans(): Promise<EcoPlanDetail[]> {
  try {
    const res = await fetchWithAuth("/api/v1/subscriptions/plans");
    if (!res.ok) throw new Error("Failed to fetch eco plans");
    return await res.json();
  } catch (err) {
    console.warn("Falling back to client eco plans definition", err);
    return [
      {
        id: "free",
        name: "Eco Starter",
        tagline: "Essential circular appraisal tools for conscious individuals.",
        price_monthly_inr: 0,
        price_yearly_inr: 0,
        popular: false,
        badge: "Community",
        features: [
          { title: "5 AI Device Appraisals per month", included: true },
          { title: "Standard Repair Guidance & Cost Estimations", included: true },
          { title: "Verified E-Waste Center Matching", included: true },
          { title: "Community Hub Discussions & Tips", included: true },
          { title: "Basic Impact Score (CO₂ & E-Waste tracked)", included: true },
          { title: "Computer Vision Deep Wear Inspection", included: false },
          { title: "Zero-fee Priority Marketplace Listings", included: false },
          { title: "Verified Green Hardware Certificate Exports", included: false },
        ],
        limits: {
          monthly_valuations: 5,
          karma_cap: 500,
          karma_multiplier: 1.0,
          cv_diagnostics: false,
          marketplace_fee_discount_pct: 0,
          api_access: false,
        },
      },
      {
        id: "pro",
        name: "Eco Pro (Circular Pioneer)",
        tagline: "Unlimited AI diagnostics, deep computer vision, and zero-fee resale.",
        price_monthly_inr: 499,
        price_yearly_inr: 4999,
        popular: true,
        badge: "Most Popular",
        features: [
          { title: "Unlimited AI Device Valuations & Appraisals", included: true, is_new: true },
          { title: "Computer Vision Hardware Degradation Detection", included: true },
          { title: "0% Seller Marketplace Fees & Featured Placement", included: true },
          { title: "Interactive Generative AI Repair Copilot", included: true },
          { title: "Downloadable Green Hardware Impact Certificates", included: true },
          { title: "2x Eco Credits Multiplier", included: true, badge: "2X" },
          { title: "Priority 24/7 Green Technicians Support", included: true },
        ],
        limits: {
          monthly_valuations: -1,
          karma_cap: 5000,
          karma_multiplier: 2.0,
          cv_diagnostics: true,
          marketplace_fee_discount_pct: 100,
          api_access: false,
        },
      },
      {
        id: "enterprise",
        name: "Circular Enterprise (Net-Zero Leader)",
        tagline: "For organizations, bulk refurbishers, and CSR/ESG compliance programs.",
        price_monthly_inr: 2499,
        price_yearly_inr: 24999,
        popular: false,
        badge: "Net-Zero Leader",
        features: [
          { title: "Everything included in Eco Pro Tier", included: true },
          { title: "Bulk CSV / Excel Inventory Batch Valuations", included: true, is_new: true },
          { title: "Formal Corporate CSR / ESG Compliance Audits", included: true },
          { title: "Full REST API Access (10,000 requests/day)", included: true },
          { title: "White-labeled Custom Valuation & PDF Reports", included: true },
          { title: "Dedicated Circular Economy Account Manager", included: true },
        ],
        limits: {
          monthly_valuations: -1,
          karma_cap: 50000,
          karma_multiplier: 3.0,
          cv_diagnostics: true,
          marketplace_fee_discount_pct: 100,
          api_access: true,
        },
      },
    ];
  }
}

/**
 * Fetch authenticated user's current subscription & quota status.
 */
export async function getCurrentSubscription(): Promise<UserSubscriptionResponse> {
  const res = await fetchWithAuth("/api/v1/subscriptions/current");
  if (!res.ok) {
    throw new Error("Failed to fetch subscription status");
  }
  return await res.json();
}

/**
 * Instant Demo Activation / Plan Switch.
 * Works immediately in real-time without requiring credit cards!
 */
export async function activateEcoPlan(
  tier: "free" | "pro" | "enterprise",
  billingCycle: "monthly" | "yearly" = "monthly"
): Promise<ActivatePlanResponse> {
  const res = await fetchWithAuth("/api/v1/subscriptions/activate", null, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tier, billing_cycle: billingCycle }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to activate plan");
  }

  const result: ActivatePlanResponse = await res.json();
  dispatchEcoPlanUpdate({
    tier: result.tier,
    tier_name: result.tier_name,
    status: result.status,
    billing_cycle: result.billing_cycle as "monthly" | "yearly",
    expires_at: result.expires_at,
    is_pro_or_higher: result.tier !== "free",
    is_enterprise: result.tier === "enterprise",
  });
  return result;
}

/**
 * Cancel subscription (reverts back to Free tier).
 */
export async function cancelEcoPlan(): Promise<ActivatePlanResponse> {
  const res = await fetchWithAuth("/api/v1/subscriptions/cancel", null, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to cancel subscription");
  }

  const result: ActivatePlanResponse = await res.json();
  dispatchEcoPlanUpdate({
    tier: "free",
    tier_name: "Eco Starter",
    status: "active",
    is_pro_or_higher: false,
    is_enterprise: false,
  });
  return result;
}
