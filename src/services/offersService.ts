import type { Offer, PaginatedResponse, Category, VoteType, Pricing } from '../types';
import type { ApiOffer } from '../types/offer';
import { getNearbyOffers, fetchOfferById, simulateDelay } from './api';


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
    pricing: mapOfferType(api.offerType),
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

export async function getOffers(
  params: GetOffersParams = {},
): Promise<PaginatedResponse<Offer>> {
  const { category = 'all', page = 1, limit = 20 } = params;

  const apiOffers = await getNearbyOffers();
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
