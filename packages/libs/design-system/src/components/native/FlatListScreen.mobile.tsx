'use client';

import React from 'react';
import { FlatList, type FlatListProps, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@lssm/lib.ui-kit/ui/stack';
import { Text } from '@lssm/lib.ui-kit/ui/text';
import { cva, type VariantProps } from 'class-variance-authority';

export interface FlatListScreenProps<T>
  extends Omit<FlatListProps<T>, 'data' | 'renderItem'>,
    VariantProps<typeof containerVariants> {
  data: T[];
  renderItem: FlatListProps<T>['renderItem'];
  header?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  showsVerticalScrollIndicator?: boolean;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  onRefresh?: () => void;
  refreshing?: boolean;
  emptyComponent?: React.ReactNode;
  emptyText?: string;
}

const containerVariants = cva('', {
  variants: {
    padding: {
      none: '',
      sm: 'px-3 py-3',
      md: 'px-4 py-4',
      lg: 'px-5 py-5',
    },
  },
  defaultVariants: {
    padding: 'none',
  },
});

export function FlatListScreen<T>({
  children,
  data,
  renderItem,
  header,
  className,
  contentClassName,
  edges = ['top', 'left', 'right'],
  showsVerticalScrollIndicator = false,
  keyboardShouldPersistTaps = 'handled',
  onRefresh,
  refreshing = false,
  emptyComponent,
  emptyText = 'No items found',
  padding,
  ...flatListProps
}: FlatListScreenProps<T>) {
  const renderEmptyComponent = () => {
    if (emptyComponent) return emptyComponent;

    return (
      <VStack align="center" justify="center" className="py-20">
        <Text className="text-muted-foreground text-center">{emptyText}</Text>
      </VStack>
    );
  };

  const ListHeaderComponent = header ? (
    <VStack
      className={[containerVariants({ padding }), contentClassName]
        .filter(Boolean)
        .join(' ')}
    >
      {header}
    </VStack>
  ) : undefined;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={edges}>
      <FlatList<T>
        data={data}
        renderItem={renderItem}
        keyExtractor={(item: any, index) =>
          item?.id?.toString?.() || item?.key?.toString?.() || String(index)
        }
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={renderEmptyComponent}
        refreshing={refreshing}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
        {...flatListProps}
      />

      {children}
    </SafeAreaView>
  );
}
