import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Offer } from '../../types';
import { formatDistance, formatTimeRemaining } from '../../utils/format';
import { colors } from '../../theme/colors';

interface OfferCardProps {
  offer: Offer;
  onPress: () => void;
}

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400';

export function OfferCard({ offer, onPress }: OfferCardProps) {
  const discountPercent =
    offer.previousPrice != null
      ? Math.round(((offer.previousPrice - offer.currentPrice) / offer.previousPrice) * 100)
      : null;

  const timeRemaining = formatTimeRemaining(offer.expiresAt);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: colors.white,
        borderRadius: 12,
        marginBottom: 12,
        marginHorizontal: 16,
        flexDirection: 'row',
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Image */}
      <Image
        source={{ uri: offer.imageUrl ?? PLACEHOLDER_IMAGE }}
        style={{ width: 82, height: 82, borderRadius: 8 }}
        resizeMode="cover"
      />

      {/* Content */}
      <View style={{ flex: 1, marginLeft: 12, justifyContent: 'space-between' }}>
        {/* Business name + verified */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{ fontSize: 12, color: colors.textSecondary, fontWeight: '500' }}
            numberOfLines={1}
          >
            {offer.businessName}
          </Text>
          {offer.isVerifiedBusiness && (
            <Ionicons
              name="checkmark-circle"
              size={13}
              color={colors.primary}
              style={{ marginLeft: 3 }}
            />
          )}
        </View>

        {/* Title */}
        <Text
          style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 2 }}
          numberOfLines={1}
        >
          {offer.title}
        </Text>

        {/* Description */}
        {offer.description ? (
          <Text
            style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}
            numberOfLines={2}
          >
            {offer.description}
          </Text>
        ) : null}

        {/* Meta row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="location-outline" size={12} color={colors.textMuted} />
            <Text style={{ fontSize: 11, color: colors.textMuted }}>
              {formatDistance(offer.distance)}
            </Text>
          </View>
          {timeRemaining ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Ionicons name="time-outline" size={12} color={colors.textMuted} />
              <Text style={{ fontSize: 11, color: colors.textMuted }}>{timeRemaining}</Text>
            </View>
          ) : null}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="checkmark-circle-outline" size={12} color={colors.success} />
            <Text style={{ fontSize: 11, color: colors.success, fontWeight: '500' }}>
              {offer.validations}
            </Text>
          </View>
        </View>
      </View>

      {/* Right: discount + prices */}
      <View style={{ marginLeft: 8, alignItems: 'flex-end', justifyContent: 'space-between' }}>
        {discountPercent != null ? (
          <View
            style={{
              backgroundColor: colors.danger,
              borderRadius: 4,
              paddingHorizontal: 6,
              paddingVertical: 3,
            }}
          >
            <Text style={{ color: colors.white, fontSize: 11, fontWeight: '700' }}>
              -{discountPercent}%
            </Text>
          </View>
        ) : (
          <View />
        )}

        <View style={{ alignItems: 'flex-end', marginTop: 4 }}>
          {offer.previousPrice != null && (
            <Text
              style={{
                fontSize: 11,
                color: colors.textMuted,
                textDecorationLine: 'line-through',
              }}
            >
              R$ {offer.previousPrice.toFixed(2).replace('.', ',')}
            </Text>
          )}
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.success }}>
            R$ {offer.currentPrice.toFixed(2).replace('.', ',')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
