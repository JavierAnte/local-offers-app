import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { getOffers } from '../services/offersService';
import { useLocation } from './useLocation';
import type { Category } from '../types';

export type CategoryFilter = Category | 'all';

export function useOffers() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const { coords, status: locationStatus, isUsingFallback, refresh: refreshLocation } =
    useLocation();

  useEffect(() => {
    const normalized = searchText.trim();
    if (normalized === '') {
      setDebouncedSearchText('');
      return;
    }

    const timeout = setTimeout(() => setDebouncedSearchText(normalized), 300);
    return () => clearTimeout(timeout);
  }, [searchText]);

  const query = useQuery({
    queryKey: [
      'offers',
      selectedCategory,
      debouncedSearchText,
      coords.latitude,
      coords.longitude,
    ],
    queryFn: () =>
      getOffers({
        category: selectedCategory,
        q: debouncedSearchText,
        latitude: coords.latitude,
        longitude: coords.longitude,
      }),
    enabled: locationStatus !== 'loading',
    placeholderData: (previousData) => previousData,
  });

  const clearFilters = useCallback(() => {
    setSelectedCategory('all');
    setSearchText('');
    setDebouncedSearchText('');
  }, []);

  return {
    ...query,
    selectedCategory,
    setSelectedCategory,
    searchText,
    setSearchText,
    clearFilters,
    hasActiveFilters: selectedCategory !== 'all' || searchText.trim() !== '',
    locationStatus,
    isUsingFallback,
    refreshLocation,
  };
}
