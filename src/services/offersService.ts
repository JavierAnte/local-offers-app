import type { Offer, PaginatedResponse, Category, VoteType, Pricing } from '../types';
import { MOCK_OFFERS } from '../constants/mockData';
import { simulateDelay } from './api';

export interface GetOffersParams {
  category?: Category | 'all';
  page?: number;
  limit?: number;
}

export interface CreateOfferPayload {
  headline: string;
  businessName: string;
  category: Category;
  pricing?: Pricing;
  expiresAt?: string;
  imageUri?: string;
}

export async function getOffers(
  params: GetOffersParams = {},
): Promise<PaginatedResponse<Offer>> {
  await simulateDelay();
  const { category = 'all', page = 1, limit = 20 } = params;
  const filtered =
    category === 'all'
      ? MOCK_OFFERS
      : MOCK_OFFERS.filter((o) => o.category === category);
  return {
    items: filtered.slice(0, limit),
    total: filtered.length,
    page,
    hasMore: false,
  };
}

export async function getOfferById(id: string): Promise<Offer> {
  await simulateDelay(300);
  const offer = MOCK_OFFERS.find((o) => o.id === id);
  if (!offer) throw new Error(`Offer ${id} not found`);
  return offer;
}

export async function createOffer(payload: CreateOfferPayload): Promise<Offer> {
  await simulateDelay(800);
  const newOffer: Offer = {
    id: `o${Date.now()}`,
    headline: payload.headline,
    businessName: payload.businessName,
    category: payload.category,
    pricing: payload.pricing,
    imageUrl: payload.imageUri ?? null,
    expiresAt: payload.expiresAt ?? null,
    distanceMeters: 100,
    createdAt: new Date().toISOString(),
    confirmationsCount: 0,
    invalidationsCount: 0,
    commentsCount: 0,
    postedBy: { id: 'me', name: 'Tú', avatarUrl: null, reputationScore: 0, badgesCount: 0 },
  };
  return newOffer;
}

export async function voteOffer(_offerId: string, _type: VoteType): Promise<void> {
  await simulateDelay(300);
  // No-op in mock — real API: POST /offers/:id/votes
}
