import type { Offer, PaginatedResponse, Category, VoteType, Pricing } from '../types';
import type { ApiOffer } from '../types/offer';
import { getNearbyOffers, fetchOfferById, simulateDelay } from './api';
import { API_BASE_URL } from '../config/api';


export interface GetOffersParams {
  latitude: number;
  longitude: number;
  category?: Category | 'all';
  page?: number;
  limit?: number;
}

export interface CreateOfferPayload {
  headline: string;
  businessName: string;
  category: Category;
  pricing: Pricing;
  expiresAt?: string;
  imageUri?: string;
  latitude: number;
  longitude: number;
}

function mapOfferType(offerType: ApiOffer['offerType']): Pricing {
  switch (offerType.type) {
    case 'percentage':
      return { type: 'percentage', percentage: offerType.percentage, label: offerType.label };
    case 'bundle':
      return { type: 'bundle', label: offerType.label };
    case 'price':
      return {
        type: 'price',
        currentPrice: offerType.currentPrice,
        previousPrice: offerType.previousPrice,
        label: offerType.label,
      };
    case 'text':
      return { type: 'text', label: offerType.label };
  }
}

function mapApiOffer(api: ApiOffer): Offer {
  return {
    id: api.id,
    headline: api.headline,
    description: api.description ?? undefined,
    businessName: api.businessName,
    isVerifiedBusiness: api.isVerifiedBusiness,
    category: api.category as Category,
    imageUrl: api.imageUrl ?? null,
    pricing: api.offerType ? mapOfferType(api.offerType) : undefined,
    distanceMeters: api.distanceMeters,
    confirmationsCount: api.confirmationsCount,
    invalidationsCount: api.invalidationsCount,
    commentsCount: api.commentsCount,
    createdAt: api.createdAt,
    expiresAt: api.expiresAt ?? null,
    postedBy: {
      id: String(api.postedBy.id),
      name: api.postedBy.name,
      avatarUrl: null,
      reputationScore: 0,
      badgesCount: 0,
    },
  };
}

export async function getOffers(params: GetOffersParams): Promise<PaginatedResponse<Offer>> {
  const { latitude, longitude, category = 'all', page = 1, limit = 20 } = params;

  const apiOffers = await getNearbyOffers(latitude, longitude);
  const mapped = apiOffers.map(mapApiOffer);

  const filtered =
    category === 'all' ? mapped : mapped.filter((o) => o.category === category);

  return {
    items: filtered.slice(0, limit),
    total: filtered.length,
    page,
    hasMore: false,
  };
}

export async function getOfferById(id: string): Promise<Offer> {
  const apiOffer = await fetchOfferById(id);
  return mapApiOffer(apiOffer);
}

export async function createOffer(payload: CreateOfferPayload, token: string): Promise<Offer> {
  const body: Record<string, unknown> = {
    headline: payload.headline,
    businessName: payload.businessName,
    category: payload.category,
    latitude: payload.latitude,
    longitude: payload.longitude,
  };

  body.offerType = payload.pricing;
  if (payload.expiresAt) body.expiresAt = payload.expiresAt;
  // imageUri requires multipart upload — not implemented yet

  const response = await fetch(`${API_BASE_URL}/offers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to create offer: ${response.status} — ${text}`);
  }

  // Backend returns 201 with empty body — reconstruct a local Offer from the payload
  return {
    id: `local-${Date.now()}`,
    headline: payload.headline,
    businessName: payload.businessName,
    category: payload.category,
    pricing: payload.pricing,
    imageUrl: payload.imageUri ?? null,
    expiresAt: payload.expiresAt ?? null,
    distanceMeters: 0,
    createdAt: new Date().toISOString(),
    confirmationsCount: 0,
    invalidationsCount: 0,
    commentsCount: 0,
    postedBy: { id: 'me', name: 'Tú', avatarUrl: null, reputationScore: 0, badgesCount: 0 },
  };
}

export async function voteOffer(_offerId: string, _type: VoteType): Promise<void> {
  await simulateDelay(300);
  // No-op in mock — real API: POST /offers/:id/votes
}
