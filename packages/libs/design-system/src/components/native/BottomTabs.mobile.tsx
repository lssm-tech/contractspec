'use client';

import * as React from 'react';
import { Pressable, View, Text } from 'react-native';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

export interface BottomTabItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onPress: () => void;
}

export function BottomTabs({
  items,
  className,
}: {
  items: BottomTabItem[];
  className?: string;
}) {
  return (
    <View
      className={cn(
        'bg-background flex flex-row items-stretch border-t',
        className
      )}
    >
      {items.map((it) => (
        <Pressable
          key={it.key}
          className={cn(
            'flex-1 items-center justify-center py-2',
            it.active ? 'bg-muted' : undefined
          )}
          onPress={it.onPress}
          accessibilityRole="tab"
          accessibilityState={{ selected: !!it.active }}
          accessibilityLabel={it.label}
        >
          {it.icon}
          <Text
            className={cn(
              'mt-1 text-xs',
              it.active ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {it.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
