import React from 'react';
import { View, Text } from 'react-native';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
}

export function EmptyState({ title, description, icon = '🔍' }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Text className="text-5xl mb-4">{icon}</Text>
      <Text className="text-lg font-semibold text-text text-center mb-2">{title}</Text>
      {description && (
        <Text className="text-sm text-muted text-center leading-relaxed">{description}</Text>
      )}
    </View>
  );
}
