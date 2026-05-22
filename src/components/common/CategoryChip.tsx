import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { cn } from '../../utils/cn';

interface CategoryChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function CategoryChip({ label, selected, onPress }: CategoryChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        'px-4 py-1.5 rounded-full mr-2 border',
        selected ? 'bg-primary border-primary' : 'bg-white border-border',
      )}
    >
      <Text className={cn('text-sm font-medium', selected ? 'text-white' : 'text-text')}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
