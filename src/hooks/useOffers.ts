import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getOffers } from '../services/offersService';
import type { Category } from '../types';

export type CategoryFilter = Category | 'all';

export function useOffers() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');

  const query = useQuery({
    queryKey: ['offers', selectedCategory],
    queryFn: () => getOffers({ category: selectedCategory }),
  });

  return {
    ...query,
    selectedCategory,
    setSelectedCategory,
  };
}
