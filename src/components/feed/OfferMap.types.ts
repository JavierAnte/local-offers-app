import type { Offer } from '../../types';
import type { Coords } from '../../hooks/useLocation';

export interface OfferMapProps {
  offers: Offer[];
  userCoords: Coords;
  isUsingFallback: boolean;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onOfferPress: (offer: Offer) => void;
}
