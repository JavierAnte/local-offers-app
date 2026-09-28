import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '../../components/common/EmptyState';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuthStore } from '../../store/authStore';
import type {
  FeedStackParamList,
  Notification,
  RootStackParamList,
} from '../../types';
import { formatRelativeTime } from '../../utils/format';
import { colors } from '../../theme/colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
type FeedNavigation = NativeStackNavigationProp<
  FeedStackParamList,
  'Notifications'
>;
type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

const ICON_MAP: Record<Notification['type'], { name: IconName; color: string }> = {
  offer_validated: { name: 'checkmark-circle', color: colors.success },
  offer_invalidated: { name: 'close-circle', color: colors.danger },
  comment_received: { name: 'chatbubble', color: colors.primary },
};

function notificationMessage(notification: Notification): string {
  switch (notification.type) {
    case 'comment_received':
      return `${notification.actor.name} comentó en tu oferta “${notification.offerHeadline}”.`;
    case 'offer_validated':
      return `${notification.actor.name} validó tu oferta “${notification.offerHeadline}”.`;
    case 'offer_invalidated':
      return `${notification.actor.name} marcó como inválida tu oferta “${notification.offerHeadline}”.`;
  }
}

export default function NotificationsScreen() {
  const feedNavigation = useNavigation<FeedNavigation>();
  const rootNavigation = useNavigation<RootNavigation>();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const notificationsQuery = useNotifications();

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        void notificationsQuery.refetch();
      }
    }, [isAuthenticated, notificationsQuery.refetch]),
  );

  if (!isAuthenticated) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-8">
        <Ionicons
          name="notifications-outline"
          size={72}
          color={colors.textMuted}
        />
        <Text className="text-xl font-bold text-text mt-4 mb-2">
          Inicia sesión
        </Text>
        <Text className="text-sm text-muted text-center mb-8">
          Accede para ver la actividad de tus ofertas.
        </Text>
        <TouchableOpacity
          onPress={() => rootNavigation.navigate('LoginModal', {})}
          className="bg-primary px-8 py-3 rounded-2xl"
        >
          <Text className="text-white font-bold">Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (notificationsQuery.isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (notificationsQuery.isError) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-8">
        <Ionicons name="cloud-offline-outline" size={56} color={colors.textMuted} />
        <Text className="text-base font-semibold text-text mt-4 mb-2">
          No pudimos cargar tus notificaciones
        </Text>
        <Text className="text-sm text-muted text-center mb-6">
          Revisa tu conexión e intenta nuevamente.
        </Text>
        <TouchableOpacity
          onPress={() => void notificationsQuery.refetch()}
          className="border border-primary px-5 py-2 rounded-xl"
        >
          <Text className="text-primary font-semibold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const notifications = notificationsQuery.data ?? [];

  if (notifications.length === 0) {
    return (
      <EmptyState
        title="Sin notificaciones"
        description="Aquí aparecerá la actividad de tus ofertas."
        icon="🔔"
      />
    );
  }

  return (
    <FlatList
      className="flex-1 bg-surface"
      data={notifications}
      keyExtractor={(item) => item.id}
      refreshing={notificationsQuery.isRefetching}
      onRefresh={() => void notificationsQuery.refetch()}
      renderItem={({ item }) => {
        const icon = ICON_MAP[item.type];
        return (
          <TouchableOpacity
            className="flex-row items-start gap-3 px-4 py-4 bg-white border-b border-border"
            onPress={() =>
              feedNavigation.navigate('OfferDetail', { offerId: item.offerId })
            }
          >
            <View className="w-9 h-9 rounded-full bg-surface items-center justify-center mt-0.5">
              <Ionicons name={icon.name} size={20} color={icon.color} />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-text">
                {notificationMessage(item)}
              </Text>
              <Text className="text-xs text-muted mt-1">
                {formatRelativeTime(item.createdAt)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        );
      }}
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );
}
