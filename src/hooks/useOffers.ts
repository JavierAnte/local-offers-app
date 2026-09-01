import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getOffers } from '../services/offersService';
import { useLocation } from './useLocation';
import type { Category } from '../types';

export type CategoryFilter = Category | 'all';

export function useOffers() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const { coords, status: locationStatus, isUsingFallback, refresh: refreshLocation } =
    useLocation();

  const query = useQuery({
    queryKey: ['offers', selectedCategory, coords.latitude, coords.longitude],
    queryFn: () =>
      getOffers({
        category: selectedCategory,
        latitude: coords.latitude,
        longitude: coords.longitude,
      }),
    enabled: locationStatus !== 'loading',
  });

  return {
    ...query,
    selectedCategory,
    setSelectedCategory,
    locationStatus,
    isUsingFallback,
    refreshLocation,
  };
}
