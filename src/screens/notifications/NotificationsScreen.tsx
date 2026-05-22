import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '../../components/common/EmptyState';
import { MOCK_NOTIFICATIONS } from '../../constants/mockData';
import type { Notification } from '../../types';
import { formatRelativeTime } from '../../utils/format';
import { colors } from '../../theme/colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const ICON_MAP: Record<Notification['type'], { name: IconName; color: string }> = {
  offer_validated: { name: 'checkmark-circle', color: colors.success },
  offer_invalidated: { name: 'close-circle', color: colors.danger },
  comment_received: { name: 'chatbubble', color: colors.primary },
  offer_expiring: { name: 'time', color: colors.warning },
};

export default function NotificationsScreen() {
  if (MOCK_NOTIFICATIONS.length === 0) {
    return (
      <EmptyState
        title="Sin notificaciones"
        description="Aquí aparecerán tus notificaciones."
        icon="🔔"
      />
    );
  }

  return (
    <FlatList
      className="flex-1 bg-surface"
      data={MOCK_NOTIFICATIONS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const icon = ICON_MAP[item.type];
        return (
          <View
            className="flex-row items-start gap-3 px-4 py-4 bg-white border-b border-border"
            style={!item.read ? { backgroundColor: '#EFF6FF' } : undefined}
          >
            <View className="w-9 h-9 rounded-full bg-surface items-center justify-center mt-0.5">
              <Ionicons name={icon.name} size={20} color={icon.color} />
            </View>
            <View className="flex-1">
              <Text className={`text-sm text-text${!item.read ? ' font-semibold' : ''}`}>
                {item.message}
              </Text>
              <Text className="text-xs text-muted mt-1">
                {formatRelativeTime(item.createdAt)}
              </Text>
            </View>
            {!item.read && (
              <View className="w-2 h-2 rounded-full bg-primary mt-2" />
            )}
          </View>
        );
      }}
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );
}
