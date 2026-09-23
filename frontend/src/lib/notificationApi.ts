import { fetchWithAuth } from './api';

export interface NotificationItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  related_entity_type?: string;
  related_entity_id?: string;
  action_url?: string;
  metadata?: Record<string, any>;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface NotificationListResponse {
  items: NotificationItem[];
  total: number;
  unread_count: number;
  page: number;
  limit: number;
  has_more: boolean;
}

/**
 * Retrieves paginated notifications for the authenticated user.
 */
export async function getNotifications(
  unreadOnly: boolean = false,
  page: number = 1,
  limit: number = 20,
  token?: string | null
): Promise<NotificationListResponse> {
  const params = new URLSearchParams();
  if (unreadOnly) params.set('unread_only', 'true');
  params.set('page', String(page));
  params.set('limit', String(limit));

  const res = await fetchWithAuth(`/api/v1/notifications?${params.toString()}`, token, {
    method: 'GET',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to fetch notifications (${res.status})`);
  }

  return await res.json();
}

/**
 * Fast endpoint for polling unread notification count.
 */
export async function getUnreadCount(token?: string | null): Promise<number> {
  const res = await fetchWithAuth('/api/v1/notifications/unread-count', token, {
    method: 'GET',
  });

  if (!res.ok) {
    return 0;
  }

  const data = await res.json();
  return data.unread_count || 0;
}

/**
 * Marks a single notification as read.
 */
export async function markNotificationRead(
  notificationId: string,
  token?: string | null
): Promise<NotificationItem> {
  const res = await fetchWithAuth(`/api/v1/notifications/${notificationId}/read`, token, {
    method: 'PATCH',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to mark notification as read (${res.status})`);
  }

  return await res.json();
}

/**
 * Marks all notifications as read.
 */
export async function markAllNotificationsRead(token?: string | null): Promise<number> {
  const res = await fetchWithAuth('/api/v1/notifications/read-all', token, {
    method: 'PATCH',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to mark all as read (${res.status})`);
  }

  const data = await res.json();
  return data.updated_count || 0;
}

/**
 * Deletes a notification record.
 */
export async function deleteNotification(
  notificationId: string,
  token?: string | null
): Promise<boolean> {
  const res = await fetchWithAuth(`/api/v1/notifications/${notificationId}`, token, {
    method: 'DELETE',
  });

  if (!res.ok) {
    return false;
  }

  const data = await res.json();
  return Boolean(data.success);
}
