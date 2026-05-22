export type Category =
  | 'food'
  | 'grocery'
  | 'electronics'
  | 'fashion'
  | 'beauty'
  | 'sports'
  | 'home'
  | 'other';

export interface User {
  id: string;
  name: string;
  avatarUrl: string | null;
  reputationScore: number;
  badgesCount: number;
}

export interface Offer {
  id: string;
  title: string;
  businessName: string;
  currentPrice: number;
  previousPrice: number | null;
  imageUrl: string | null;
  category: Category;
  distance: number; // metres
  createdAt: string; // ISO 8601
  expiresAt: string | null; // ISO 8601
  validations: number;
  invalidations: number;
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
  MainTabs: undefined;
  LoginModal: { redirectBack?: boolean };
};

export type FeedStackParamList = {
  Feed: undefined;
  OfferDetail: { offerId: string };
  Notifications: undefined;
};

export type MainTabParamList = {
  FeedTab: undefined;
  CreateOffer: undefined;
  Profile: undefined;
};
