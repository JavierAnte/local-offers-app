import React from 'react';
import { View, Text } from 'react-native';
import type { Pricing } from '../../types';

interface PriceDisplayProps {
  pricing?: Pricing | null;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceDisplay({ pricing, size = 'md' }: PriceDisplayProps) {
  if (!pricing) return null;

  const mainSize = size === 'lg' ? 26 : size === 'sm' ? 16 : 20;
  const subSize = size === 'lg' ? 16 : size === 'sm' ? 13 : 14;
  const badgeSize = size === 'lg' ? 14 : 12;

  if (pricing.type === 'percentage' && pricing.percentage != null) {
    return (
      <View className="flex-row items-center gap-2 mt-1">
        <View className="bg-danger rounded px-2 py-1">
          <Text style={{ color: '#fff', fontSize: badgeSize, fontWeight: '700' }}>
            -{pricing.percentage}%
          </Text>
        </View>
        <Text className="text-muted" style={{ fontSize: subSize }}>
          descuento
        </Text>
      </View>
    );
  }

  if (pricing.type === 'bundle' && pricing.label) {
    return (
      <View className="flex-row items-center gap-2 mt-1">
        <View className="bg-primary rounded px-2 py-1">
          <Text style={{ color: '#fff', fontSize: badgeSize, fontWeight: '700' }}>
            {pricing.label}
          </Text>
        </View>
        <Text className="text-muted" style={{ fontSize: subSize }}>
          promoción
        </Text>
      </View>
    );
  }

  if (pricing.type === 'text' && pricing.label) {
    return (
      <View className="mt-1">
        <Text className="text-primary font-semibold" style={{ fontSize: mainSize }}>
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
      <View className="flex-row items-baseline gap-2 mt-1 flex-wrap">
        {discountPct != null && (
          <View className="bg-danger rounded px-2 py-0.5">
            <Text style={{ color: '#fff', fontSize: badgeSize, fontWeight: '700' }}>
              -{discountPct}%
            </Text>
          </View>
        )}
        {pricing.currentPrice != null && (
          <Text className="font-bold text-success" style={{ fontSize: mainSize }}>
            $ {pricing.currentPrice.toLocaleString('es-AR')}
          </Text>
        )}
        {pricing.previousPrice != null && (
          <Text className="line-through text-muted" style={{ fontSize: subSize }}>
            $ {pricing.previousPrice.toLocaleString('es-AR')}
          </Text>
        )}
      </View>
    );
  }

  return null;
}
