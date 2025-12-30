import React from 'react';
import { ScrollView } from 'react-native';
import { VStack } from '@contractspec/lib.ui-kit/ui/stack';
import { cn } from '@contractspec/lib.ui-kit/ui/utils';
import { RefreshControlProps } from 'react-native/Libraries/Components/RefreshControl/RefreshControl';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * ScrollableScreen
 *
 * SafeArea + ScrollView wrapper. Variants control padding.
 */
interface ScrollableScreenProps extends VariantProps<typeof containerVariants> {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  showsVerticalScrollIndicator?: boolean;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

const containerVariants = cva('', {
  variants: {
    padding: {
      none: '',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    padding: 'none',
  },
});

export function ScrollableScreen({
  children,
  className,
  contentClassName,
  // edges = ['top', 'bottom', 'left', 'right'],
  edges = ['top', 'left', 'right'],
  showsVerticalScrollIndicator = false,
  keyboardShouldPersistTaps = 'handled',
  refreshControl,
  padding,
}: ScrollableScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={edges}>
      <ScrollView
        className={cn(containerVariants({ padding }), className)}
        contentContainerClassName="grow"
        // contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        refreshControl={refreshControl}
      >
        <VStack className={cn('flex-1', contentClassName)}>{children}</VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
