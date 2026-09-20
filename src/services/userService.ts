import { API_BASE_URL } from '../config/api';
import type { Offer, User } from '../types';
import type { ApiOffer } from '../types/offer';
import { mapApiOffer } from './offersService';

interface ApiUser {
  id: string;
  name: string;
  email: string;
}

function authorizationHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

export async function getMe(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/me`, {
    headers: authorizationHeaders(token),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch profile: ${response.status} — ${text}`);
  }

  const user: ApiUser = await response.json();
  return {
    ...user,
    avatarUrl: null,
    reputationScore: 0,
    badgesCount: 0,
  };
}

export async function getMyOffers(token: string): Promise<Offer[]> {
  const response = await fetch(`${API_BASE_URL}/me/offers`, {
    headers: authorizationHeaders(token),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to fetch profile offers: ${response.status} — ${text}`,
    );
  }

  const offers: ApiOffer[] = await response.json();
  return offers.map(mapApiOffer);
}
