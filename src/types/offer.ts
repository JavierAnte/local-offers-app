export type ApiOfferType =
  | { type: 'percentage'; percentage: number; label?: string }
  | { type: 'bundle'; label: string }
  | { type: 'price'; currentPrice?: number; previousPrice?: number; label?: string }
  | { type: 'text'; label: string };

export interface ApiPostedBy {
  id: string;
  name: string;
}

export interface ApiComment {
  id: string;
  offerId: string;
  body: string;
  createdAt: string;
  postedBy: ApiPostedBy;
}

export interface ApiOffer {
  id: string;
  headline: string;
  description: string | null;
  businessName: string;
  isVerifiedBusiness: boolean;
  category: string;
  imageUrl: string | null;
  offerType: ApiOfferType;
  distanceMeters: number;
  latitude: number;
  longitude: number;
  confirmationsCount: number;
  invalidationsCount: number;
  commentsCount: number;
  createdAt: string;
  expiresAt?: string | null;
  postedBy: ApiPostedBy;
}
