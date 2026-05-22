import React from 'react';
import { View, Text } from 'react-native';
import { formatPrice } from '../../utils/format';

interface PriceDisplayProps {
  currentPrice: number;
  previousPrice?: number | null;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceDisplay({ currentPrice, previousPrice, size = 'md' }: PriceDisplayProps) {
  const currentSizeClass = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-xl';
  const previousSizeClass = size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <View className="flex-row items-baseline gap-2">
      <Text className={`font-bold text-primary ${currentSizeClass}`}>
        {formatPrice(currentPrice)}
      </Text>
      {previousPrice != null && (
        <Text className={`line-through text-muted ${previousSizeClass}`}>
          {formatPrice(previousPrice)}
        </Text>
      )}
    </View>
  );
}
