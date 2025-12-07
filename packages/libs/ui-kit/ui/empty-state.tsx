import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@lssm/lib.ui-kit-core/utils';
import { VStack } from './stack';
import { H3 } from './typography';
import { Text } from './text';
import { View } from 'react-native';

const containerVariants = cva('items-center text-center', {
  variants: {
    density: {
      compact: 'gap-3 p-6',
      default: 'gap-4 p-8',
    },
  },
  defaultVariants: {
    density: 'default',
  },
});

export interface EmptyStateProps extends VariantProps<
  typeof containerVariants
> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  density,
}: EmptyStateProps) {
  return (
    <VStack className={cn(containerVariants({ density }), className)}>
      {icon ? (
        <View className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
          {/* Consumers pass their own icon; keep neutral backdrop */}
          <View className="text-muted-foreground flex items-center justify-center">
            {icon}
          </View>
        </View>
      ) : null}

      <View>
        <H3 className="font-medium">{title}</H3>
        {description ? (
          <View className="text-muted-foreground text-base">
            <Text>{description}</Text>
          </View>
        ) : null}
      </View>

      {(primaryAction || secondaryAction) && (
        <View className="flex items-center justify-center gap-2">
          {primaryAction}
          {secondaryAction}
        </View>
      )}
    </VStack>
  );
}
