import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '../../utils/cn';
import { colors } from '../../theme/colors';

interface CategoryChipProps {
  label: string;
  icon?: string;
  selected: boolean;
  onPress: () => void;
}

export function CategoryChip({ label, icon, selected, onPress }: CategoryChipProps) {
  const iconColor = selected ? colors.white : colors.textSecondary;

  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        'flex-row items-center px-4 py-1.5 rounded-full mr-2 border',
        selected ? 'bg-primary border-primary' : 'bg-white border-border',
      )}
    >
      {icon ? (
        <Ionicons
          name={icon as any}
          size={13}
          color={iconColor}
          style={{ marginRight: 5 }}
        />
      ) : null}
      <Text className={cn('text-sm font-medium', selected ? 'text-white' : 'text-text')}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
