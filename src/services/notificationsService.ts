import { API_BASE_URL } from '../config/api';
import type { Notification } from '../types';

export async function getNotifications(token: string): Promise<Notification[]> {
  const response = await fetch(`${API_BASE_URL}/me/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to fetch notifications: ${response.status} — ${text}`,
    );
  }

  return response.json();
}
