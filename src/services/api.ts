// import axios from 'axios';

// export const apiClient = axios.create({
//   baseURL: 'http://localhost:3000/api/v1',
//   timeout: 10_000,
//   headers: { 'Content-Type': 'application/json' },
// });

// // Auth interceptor placeholder — will inject Bearer token in Phase 3
// apiClient.interceptors.request.use((config) => config);

export const simulateDelay = (ms = 400): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

import { API_BASE_URL } from '../config/api';
import type { ApiOffer, ApiComment } from '../types/offer';

interface NearbyOfferParams {
  latitude: number;
  longitude: number;
  category?: string;
  q?: string;
}

export async function getNearbyOffers(params: NearbyOfferParams): Promise<ApiOffer[]> {
  const query = new URLSearchParams({
    lat: String(params.latitude),
    lng: String(params.longitude),
  });
  if (params.category) query.set('category', params.category);
  if (params.q) query.set('q', params.q);

  const response = await fetch(`${API_BASE_URL}/offers/nearby?${query.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch offers');
  }

  return response.json();
}

export async function fetchOfferById(id: string): Promise<ApiOffer> {
  const response = await fetch(`${API_BASE_URL}/offers/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch offer ${id}`);
  }

  return response.json();
}

export async function fetchComments(offerId: string): Promise<ApiComment[]> {
  const response = await fetch(`${API_BASE_URL}/offers/${offerId}/comments`);

  if (!response.ok) {
    throw new Error(`Failed to fetch comments for offer ${offerId}`);
  }

  return response.json();
}
