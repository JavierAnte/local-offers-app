import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Offer, Category, Pricing } from '../../types';
import { formatDistance, formatTimeRemaining } from '../../utils/format';
import { colors } from '../../theme/colors';

interface OfferCardProps {
  offer: Offer;
  onPress: () => void;
}

const CATEGORY_ICON: Record<Category, string> = {
  food: 'restaurant-outline',
  grocery: 'cart-outline',
  electronics: 'phone-portrait-outline',
  fashion: 'shirt-outline',
  beauty: 'medkit-outline',
  sports: 'football-outline',
  home: 'home-outline',
  other: 'storefront-outline',
};

const CATEGORY_BG: Record<Category, string> = {
  food: '#FFF3E0',
  grocery: '#E8F5E9',
  electronics: '#E3F2FD',
  fashion: '#FCE4EC',
  beauty: '#F3E5F5',
  sports: '#E0F7FA',
  home: '#FFF8E1',
  other: '#F5F5F5',
};

function PricingBadge({ pricing }: { pricing: Pricing }) {
  if (pricing.type === 'percentage' && pricing.percentage != null) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-start',
          backgroundColor: colors.danger,
          borderRadius: 4,
          paddingHorizontal: 7,
          paddingVertical: 3,
          marginTop: 5,
        }}
      >
        <Text style={{ color: colors.white, fontSize: 12, fontWeight: '700' }}>
          -{pricing.percentage}%
        </Text>
      </View>
    );
  }

  if (pricing.type === 'bundle' && pricing.label) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-start',
          backgroundColor: colors.primary,
          borderRadius: 4,
          paddingHorizontal: 7,
          paddingVertical: 3,
          marginTop: 5,
        }}
      >
        <Text style={{ color: colors.white, fontSize: 12, fontWeight: '700' }}>
          {pricing.label}
        </Text>
      </View>
    );
  }

  if (pricing.type === 'price') {
    const discountPct =
      pricing.currentPrice != null && pricing.previousPrice != null
        ? Math.round(
            ((pricing.previousPrice - pricing.currentPrice) / pricing.previousPrice) * 100,
          )
        : null;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 5 }}>
        {discountPct != null && (
          <View
            style={{
              backgroundColor: colors.danger,
              borderRadius: 4,
              paddingHorizontal: 5,
              paddingVertical: 2,
            }}
          >
            <Text style={{ color: colors.white, fontSize: 11, fontWeight: '700' }}>
              -{discountPct}%
            </Text>
          </View>
        )}
        {pricing.currentPrice != null && (
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.success }}>
            $ {pricing.currentPrice.toLocaleString('es-AR')}
          </Text>
        )}
        {pricing.previousPrice != null && (
          <Text
            style={{ fontSize: 12, color: colors.textMuted, textDecorationLine: 'line-through' }}
          >
            $ {pricing.previousPrice.toLocaleString('es-AR')}
          </Text>
        )}
      </View>
    );
  }

  if (pricing.type === 'text' && pricing.label) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-start',
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 4,
          paddingHorizontal: 7,
          paddingVertical: 3,
          marginTop: 5,
        }}
      >
        <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '500' }}>
          {pricing.label}
        </Text>
      </View>
    );
  }

  return null;
}

export function OfferCard({ offer, onPress }: OfferCardProps) {
  const timeRemaining = formatTimeRemaining(offer.expiresAt);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: colors.white,
        borderRadius: 12,
        marginBottom: 10,
        marginHorizontal: 16,
        flexDirection: 'row',
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Content */}
      <View style={{ flex: 1, marginRight: 10 }}>
        {/* Business name + verified */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{ fontSize: 11, color: colors.textMuted, fontWeight: '500' }}
            numberOfLines={1}
          >
            {offer.businessName}
          </Text>
          {offer.isVerifiedBusiness && (
            <Ionicons
              name="checkmark-circle"
              size={12}
              color={colors.primary}
              style={{ marginLeft: 3 }}
            />
          )}
        </View>

        {/* Headline — hero element */}
        <Text
          style={{ fontSize: 17, fontWeight: '700', color: colors.text, marginTop: 3, lineHeight: 22 }}
          numberOfLines={2}
        >
          {offer.headline}
        </Text>

        {/* Pricing */}
        {offer.pricing && <PricingBadge pricing={offer.pricing} />}

        {/* Meta row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="location-outline" size={11} color={colors.textMuted} />
            <Text style={{ fontSize: 11, color: colors.textMuted }}>
              {formatDistance(offer.distanceMeters)}
            </Text>
          </View>
          {timeRemaining ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Ionicons name="time-outline" size={11} color={colors.textMuted} />
              <Text style={{ fontSize: 11, color: colors.textMuted }}>{timeRemaining}</Text>
            </View>
          ) : null}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="checkmark-circle-outline" size={11} color={colors.success} />
            <Text style={{ fontSize: 11, color: colors.success, fontWeight: '600' }}>
              {offer.confirmationsCount}
            </Text>
          </View>
        </View>
      </View>

      {/* Thumbnail */}
      {offer.imageUrl ? (
        <Image
          source={{ uri: offer.imageUrl }}
          style={{ width: 64, height: 64, borderRadius: 8, alignSelf: 'center' }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 8,
            backgroundColor: CATEGORY_BG[offer.category],
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
          }}
        >
          <Ionicons
            name={CATEGORY_ICON[offer.category] as any}
            size={28}
            color={colors.textMuted}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}
