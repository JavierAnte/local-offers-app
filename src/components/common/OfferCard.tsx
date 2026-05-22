import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Offer } from '../../types';
import { PriceDisplay } from './PriceDisplay';
import { formatDistance, formatRelativeTime } from '../../utils/format';
import { colors } from '../../theme/colors';

interface OfferCardProps {
  offer: Offer;
  onPress: () => void;
}

const CATEGORY_EMOJI: Record<string, string> = {
  food: '🍔',
  grocery: '🛒',
  electronics: '📱',
  fashion: '👗',
  sports: '⚽',
  home: '🏠',
  beauty: '💄',
  other: '📦',
};

export function OfferCard({ offer, onPress }: OfferCardProps) {
  const discountPercent =
    offer.previousPrice != null
      ? Math.round(((offer.previousPrice - offer.currentPrice) / offer.previousPrice) * 100)
      : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl mb-3 mx-4 overflow-hidden border border-border"
      activeOpacity={0.8}
      style={{ elevation: 1 }}
    >
      {offer.imageUrl ? (
        <View>
          <Image
            source={{ uri: offer.imageUrl }}
            className="w-full h-40"
            resizeMode="cover"
          />
          {discountPercent != null && (
            <View className="absolute top-2 left-2 bg-danger px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">-{discountPercent}%</Text>
            </View>
          )}
        </View>
      ) : (
        discountPercent != null && (
          <View className="absolute top-3 right-3 bg-danger px-2 py-1 rounded-full z-10">
            <Text className="text-white text-xs font-bold">-{discountPercent}%</Text>
          </View>
        )
      )}

      <View className="p-4">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-xs text-muted">
            {CATEGORY_EMOJI[offer.category]} {offer.businessName}
          </Text>
          <Text className="text-xs text-muted">{formatRelativeTime(offer.createdAt)}</Text>
        </View>

        <Text className="text-base font-semibold text-text mb-2" numberOfLines={2}>
          {offer.title}
        </Text>

        <PriceDisplay
          currentPrice={offer.currentPrice}
          previousPrice={offer.previousPrice}
          size="md"
        />

        <View className="flex-row items-center justify-between mt-3">
          <View className="flex-row items-center gap-1">
            <Ionicons name="location-outline" size={13} color={colors.textMuted} />
            <Text className="text-xs text-muted">{formatDistance(offer.distance)}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="checkmark-circle-outline" size={13} color={colors.success} />
            <Text className="text-xs text-success font-medium">{offer.validations}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
