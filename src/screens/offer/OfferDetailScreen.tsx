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
import { PriceDisplay } from '../../components/common/PriceDisplay';
import type { FeedStackParamList, RootStackParamList } from '../../types';
import { formatDistance, formatRelativeTime, formatExpiry } from '../../utils/format';
import { colors } from '../../theme/colors';

type DetailRouteProp = RouteProp<FeedStackParamList, 'OfferDetail'>;
type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

export default function OfferDetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const rootNav = useNavigation<RootNavProp>();
  const { offerId } = route.params;
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
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const expiry = formatExpiry(offer.expiresAt);

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {offer.imageUrl ? (
          <Image source={{ uri: offer.imageUrl }} className="w-full h-56" resizeMode="cover" />
        ) : (
          <View className="w-full h-32 bg-surface items-center justify-center">
            <Ionicons name="pricetag-outline" size={48} color={colors.textMuted} />
          </View>
        )}

        <View className="p-4">
          <Text className="text-2xl font-bold text-text mb-1">{offer.title}</Text>
          <Text className="text-base text-muted mb-3">{offer.businessName}</Text>

          <PriceDisplay
            currentPrice={offer.currentPrice}
            previousPrice={offer.previousPrice}
            size="lg"
          />

          <View className="flex-row items-center gap-4 mt-3 mb-6">
            <View className="flex-row items-center gap-1">
              <Ionicons name="location-outline" size={14} color={colors.textMuted} />
              <Text className="text-sm text-muted">{formatDistance(offer.distance)}</Text>
            </View>
            {expiry && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="time-outline" size={14} color={colors.warning} />
                <Text className="text-sm text-warning">{expiry}</Text>
              </View>
            )}
            <Text className="text-sm text-muted">{formatRelativeTime(offer.createdAt)}</Text>
          </View>

          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              onPress={() => requireAuth(() => voteMutation.mutate('validate'))}
              className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl border border-success"
              style={{ backgroundColor: colors.successLight }}
            >
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text className="font-semibold text-success">
                Validar ({offer.validations})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => requireAuth(() => voteMutation.mutate('invalidate'))}
              className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl border border-danger"
              style={{ backgroundColor: colors.dangerLight }}
            >
              <Ionicons name="close-circle" size={20} color={colors.danger} />
              <Text className="font-semibold text-danger">
                Invalidar ({offer.invalidations})
              </Text>
            </TouchableOpacity>
          </View>

          <Text className="text-lg font-semibold text-text mb-3">
            Comentarios ({comments.length})
          </Text>

          {comments.length === 0 ? (
            <Text className="text-sm text-muted mb-4">Sé el primero en comentar.</Text>
          ) : (
            comments.map((comment) => (
              <View key={comment.id} className="mb-4 p-3 bg-surface rounded-xl">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm font-semibold text-text">{comment.author.name}</Text>
                  <Text className="text-xs text-muted">
                    {formatRelativeTime(comment.createdAt)}
                  </Text>
                </View>
                <Text className="text-sm text-text">{comment.text}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-3 flex-row gap-2">
        <TextInput
          className="flex-1 bg-surface rounded-full px-4 py-2 text-sm text-text border border-border"
          placeholder="Añade un comentario…"
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
          className="bg-primary w-10 h-10 rounded-full items-center justify-center"
        >
          <Ionicons name="send" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
