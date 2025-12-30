import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../select';
import { Label } from '../../label';
import { HStack } from '../../stack';
import { View } from 'react-native';
import { Text } from '../../text';
import type { FilterSelectProps } from './types';

export const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  options,
  onChange,
  placeholder = 'Sélectionner...',
  label,
  disabled = false,
  className = '',
  showCounts = false,
}) => {
  return (
    <HStack className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-foreground text-base font-medium">{label}</Label>
      )}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-background">
          {/* All/Reset option */}
          <SelectItem value="all" label="Tous">
            <Text>Tous</Text>
            {showCounts && (
              <View className="text-muted-foreground ml-2 text-sm">
                ({options.reduce((sum, option) => sum + (option.count || 0), 0)}
                )
              </View>
            )}
          </SelectItem>

          {/* Filter options */}
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              label={option.label}
            >
              <HStack className="flex w-full items-center justify-between">
                <Text>{option.label}</Text>
                {showCounts && option.count !== undefined && (
                  <Text className="text-muted-foreground ml-2 text-sm">
                    ({option.count})
                  </Text>
                )}
              </HStack>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </HStack>
  );
};
