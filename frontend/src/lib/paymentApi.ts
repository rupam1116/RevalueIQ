import { fetchWithAuth } from './api';

export interface CreatePaymentOrderPayload {
  purpose: 'MARKETPLACE_PURCHASE' | 'REPAIR_SERVICE_DEPOSIT';
  related_entity_type: string;
  related_entity_id: string;
  notes?: Record<string, any>;
}

export interface CreatePaymentOrderResponse {
  payment_id: string;
  razorpay_order_id: string;
  amount_inr: number;
  amount_paise: number;
  currency: string;
  status: string;
  key_id: string;
  purpose: string;
  related_entity_type: string;
  related_entity_id: string;
}

export interface VerifyPaymentPayload {
  payment_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentItem {
  id: string;
  order_id: string;
  user_id: string;
  gateway: string;
  gateway_order_id: string;
  gateway_payment_id?: string;
  amount_inr: number;
  amount_paise: number;
  currency: string;
  status: 'CREATED' | 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  purpose: string;
  related_entity_type: string;
  related_entity_id: string;
  receipt_reference: string;
  created_at: string;
  paid_at?: string;
  failed_at?: string;
  refunded_at?: string;
  refund_id?: string;
  metadata?: Record<string, any>;
}

export interface PaymentListResponse {
  items: PaymentItem[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

/**
 * Creates an internal payment record and Razorpay gateway order.
 */
export async function createPaymentOrder(
  payload: CreatePaymentOrderPayload,
  token?: string | null
): Promise<CreatePaymentOrderResponse> {
  const res = await fetchWithAuth('/api/v1/payments/orders', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Payment order creation failed (${res.status})`);
  }

  return await res.json();
}

/**
 * Verifies Razorpay payment signature server-side.
 */
export async function verifyPayment(
  payload: VerifyPaymentPayload,
  token?: string | null
): Promise<PaymentItem> {
  const res = await fetchWithAuth('/api/v1/payments/verify', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Payment verification failed (${res.status})`);
  }

  return await res.json();
}

/**
 * Retrieves payment history for authenticated user.
 */
export async function getPayments(
  statusFilter?: string,
  page: number = 1,
  limit: number = 20,
  token?: string | null
): Promise<PaymentListResponse> {
  const params = new URLSearchParams();
  if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
  params.set('page', String(page));
  params.set('limit', String(limit));

  const res = await fetchWithAuth(`/api/v1/payments?${params.toString()}`, token, {
    method: 'GET',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to fetch payment history (${res.status})`);
  }

  return await res.json();
}

/**
 * Retrieves details for a specific payment.
 */
export async function getPaymentById(
  paymentId: string,
  token?: string | null
): Promise<PaymentItem> {
  const res = await fetchWithAuth(`/api/v1/payments/${paymentId}`, token, {
    method: 'GET',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Payment record not found (${res.status})`);
  }

  return await res.json();
}

/**
 * Requests a refund for a paid transaction.
 */
export async function refundPayment(
  paymentId: string,
  reason: string = 'User requested refund',
  amount_inr?: number,
  token?: string | null
): Promise<PaymentItem> {
  const res = await fetchWithAuth(`/api/v1/payments/${paymentId}/refund`, token, {
    method: 'POST',
    body: JSON.stringify({ reason, amount_inr }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Refund processing failed (${res.status})`);
  }

  return await res.json();
}
