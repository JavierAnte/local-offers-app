import type { NavigatorScreenParams } from '@react-navigation/native';

export type Category =
  | 'food'
  | 'grocery'
  | 'electronics'
  | 'fashion'
  | 'beauty'
  | 'sports'
  | 'home'
  | 'other';

export type PricingType = 'price' | 'percentage' | 'bundle' | 'text';

export interface Pricing {
  type: PricingType;
  currentPrice?: number;
  previousPrice?: number;
  percentage?: number;
  label?: string; // "2x1", "3x2", "2da al 50%", custom text
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatarUrl: string | null;
  reputationScore: number;
  badgesCount: number;
}

export interface Offer {
  id: string;
  headline: string;
  description?: string;
  businessName: string;
  isVerifiedBusiness?: boolean;
  category: Category;
  imageUrl?: string | null;
  pricing?: Pricing;
  distanceMeters: number;
  createdAt: string; // ISO 8601
  expiresAt: string | null; // ISO 8601
  confirmationsCount: number;
  invalidationsCount: number;
  commentsCount: number;
  postedBy: User;
}

export interface Comment {
  id: string;
  offerId: string;
  text: string;
  author: User;
  createdAt: string;
}

export type VoteType = 'validate' | 'invalidate';

export interface Vote {
  offerId: string;
  type: VoteType;
  userId: string;
}

export interface Notification {
  id: string;
  type: 'offer_validated' | 'offer_invalidated' | 'comment_received' | 'offer_expiring';
  message: string;
  offerId: string | null;
  read: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  hasMore: boolean;
}

// Navigation param lists
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  LoginModal: { redirectTo?: { offerId: string; distanceMeters: number } };
};

export type FeedStackParamList = {
  Feed: undefined;
  OfferDetail: { offerId: string; distanceMeters: number };
  Notifications: undefined;
};

export type MainTabParamList = {
  FeedTab: NavigatorScreenParams<FeedStackParamList> | undefined;
  CreateOffer: undefined;
  Profile: undefined;
};
