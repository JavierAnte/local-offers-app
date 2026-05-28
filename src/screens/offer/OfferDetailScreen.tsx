import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useOfferDetail } from '../../hooks/useOfferDetail';
import { useAuthStore } from '../../store/authStore';
import type { FeedStackParamList, RootStackParamList, Pricing } from '../../types';
import { formatDistance, formatRelativeTime } from '../../utils/format';
import { colors } from '../../theme/colors';

type DetailRouteProp = RouteProp<FeedStackParamList, 'OfferDetail'>;
type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

function PricingSection({ pricing }: { pricing: Pricing }) {
  if (pricing.type === 'price') {
    const discountPct =
      pricing.currentPrice != null && pricing.previousPrice != null
        ? Math.round(
            ((pricing.previousPrice - pricing.currentPrice) / pricing.previousPrice) * 100,
          )
        : null;

    return (
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Text style={{ fontSize: 12, color: colors.success, fontWeight: '500', marginBottom: 4 }}>
          Precio con descuento
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 28, fontWeight: '700', color: colors.success }}>
              {`$ ${pricing.currentPrice?.toLocaleString('es-AR')}`}
            </Text>
            {pricing.previousPrice != null && (
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textMuted,
                  textDecorationLine: 'line-through',
                  marginTop: 2,
                }}
              >
                {`Antes $ ${pricing.previousPrice.toLocaleString('es-AR')}`}
              </Text>
            )}
          </View>
          {discountPct != null && (
            <View
              style={{
                backgroundColor: colors.danger,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
            >
              <Text style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
                -{discountPct}%
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  if (pricing.type === 'percentage' && pricing.percentage != null) {
    return (
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={{ fontSize: 12, color: colors.textMuted, fontWeight: '500', marginBottom: 4 }}>
            Descuento
          </Text>
          <Text style={{ fontSize: 28, fontWeight: '700', color: colors.success }}>
            {pricing.percentage}% off
          </Text>
        </View>
        <View
          style={{
            backgroundColor: colors.danger,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <Text style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
            -{pricing.percentage}%
          </Text>
        </View>
      </View>
    );
  }

  if (pricing.type === 'bundle' && pricing.label) {
    return (
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Text style={{ fontSize: 12, color: colors.textMuted, fontWeight: '500', marginBottom: 8 }}>
          Promoción
        </Text>
        <View
          style={{
            backgroundColor: colors.primaryLight,
            borderRadius: 8,
            paddingHorizontal: 14,
            paddingVertical: 10,
            alignSelf: 'flex-start',
          }}
        >
          <Text style={{ color: colors.primary, fontSize: 22, fontWeight: '700' }}>
            {pricing.label}
          </Text>
        </View>
      </View>
    );
  }

  if (pricing.type === 'text' && pricing.label) {
    return (
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: '600', color: colors.primary }}>
          {pricing.label}
        </Text>
      </View>
    );
  }

  return null;
}

function abbreviateName(fullName: string): string {
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0]}.`;
}

export default function OfferDetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const rootNav = useNavigation<RootNavProp>();
  const { offerId, distanceMeters } = route.params;
  const { offer, comments, isLoading, voteMutation, commentMutation } = useOfferDetail(offerId);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [commentText, setCommentText] = useState('');

  function requireAuth(action: () => void) {
    if (!isAuthenticated) {
      rootNav.navigate('LoginModal', { redirectBack: true });
    } else {
      action();
    }
  }

  if (isLoading || !offer) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const expiryDate = offer.expiresAt ? new Date(offer.expiresAt) : null;
  const expiryLabel = expiryDate
    ? `${expiryDate.getDate()} ${expiryDate.toLocaleString('es', { month: 'short' })}`
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero image */}
        {offer.imageUrl ? (
          <Image
            source={{ uri: offer.imageUrl }}
            style={{ width: '100%', height: 220 }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: 140,
              backgroundColor: colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="pricetag-outline" size={48} color={colors.textMuted} />
          </View>
        )}

        {/* Business info */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 14,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
              {offer.businessName}
            </Text>
            {offer.isVerifiedBusiness && (
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={colors.primary}
                style={{ marginLeft: 5 }}
              />
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="location-outline" size={13} color={colors.textMuted} />
              <Text style={{ fontSize: 12, color: colors.textMuted }}>
                {formatDistance(distanceMeters)} de distancia
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="time-outline" size={13} color={colors.textMuted} />
              <Text style={{ fontSize: 12, color: colors.textMuted }}>
                Hace {formatRelativeTime(offer.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Pricing */}
        {offer.pricing && <PricingSection pricing={offer.pricing} />}

        {/* Headline + description */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 14,
            paddingBottom: 14,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: offer.description ? 6 : 0 }}>
            {offer.headline}
          </Text>
          {offer.description ? (
            <Text style={{ fontSize: 14, color: colors.textMuted, lineHeight: 20 }}>
              {offer.description}
            </Text>
          ) : null}
        </View>

        {/* Meta info rows */}
        <View style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
          {expiryLabel && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 13, color: colors.textMuted }}>Válido hasta</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>{expiryLabel}</Text>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Text style={{ fontSize: 13, color: colors.textMuted }}>Publicado por</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
              {abbreviateName(offer.postedBy.name)}
            </Text>
          </View>
        </View>

        {/* Confirmations + confirm CTA */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text style={{ fontSize: 14, color: colors.success, fontWeight: '500' }}>
              {offer.confirmationsCount} personas confirmaron esta oferta
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => requireAuth(() => voteMutation.mutate('validate'))}
            style={{
              borderWidth: 1.5,
              borderColor: colors.success,
              borderRadius: 10,
              paddingVertical: 14,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: colors.success, fontSize: 15, fontWeight: '600' }}>
              Confirmar oferta
            </Text>
          </TouchableOpacity>
        </View>

        {/* Comments */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            <Ionicons name="chatbubble-outline" size={17} color={colors.text} />
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
              Comentarios ({comments.length})
            </Text>
          </View>

          {comments.length === 0 ? (
            <Text style={{ fontSize: 13, color: colors.textMuted, marginBottom: 8 }}>
              Sé el primero en comentar.
            </Text>
          ) : (
            comments.map((comment) => (
              <View key={comment.id} style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>
                    {comment.author.name}
                  </Text>
                  <Ionicons name="checkmark-circle" size={13} color={colors.success} />
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>
                    {formatRelativeTime(comment.createdAt)}
                  </Text>
                </View>
                <Text style={{ fontSize: 13, color: colors.text, lineHeight: 18 }}>
                  {comment.text}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Report */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingVertical: 16,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            marginTop: 8,
          }}
        >
          <Ionicons name="flag-outline" size={15} color={colors.textMuted} />
          <Text style={{ fontSize: 13, color: colors.textMuted }}>Reportar oferta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Fixed comment input */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingHorizontal: 16,
          paddingVertical: 10,
          flexDirection: 'row',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: colors.surface,
            borderRadius: 20,
            paddingHorizontal: 14,
            paddingVertical: 8,
            fontSize: 13,
            color: colors.text,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          placeholder="Agrega un comentario..."
          placeholderTextColor={colors.textMuted}
          value={commentText}
          onChangeText={setCommentText}
          onFocus={() => {
            if (!isAuthenticated) requireAuth(() => {});
          }}
        />
        <TouchableOpacity
          onPress={() =>
            requireAuth(() => {
              if (commentText.trim()) {
                commentMutation.mutate(commentText.trim());
                setCommentText('');
              }
            })
          }
          style={{
            backgroundColor: colors.primary,
            width: 38,
            height: 38,
            borderRadius: 19,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="send" size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
