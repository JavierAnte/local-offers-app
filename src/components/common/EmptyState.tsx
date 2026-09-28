import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon = '🔍',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Text className="text-5xl mb-4">{icon}</Text>
      <Text className="text-lg font-semibold text-text text-center mb-2">{title}</Text>
      {description && (
        <Text className="text-sm text-muted text-center leading-relaxed">{description}</Text>
      )}
      {actionLabel && onAction ? (
        <TouchableOpacity onPress={onAction} className="mt-5 px-4 py-2 rounded-lg bg-primary">
          <Text className="text-sm font-semibold text-white">{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
