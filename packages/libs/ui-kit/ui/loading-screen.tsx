import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from './stack';
import { Skeleton } from './skeleton';
import { H3 } from './typography';

interface LoadingScreenProps {
  title?: string;
  variant?: 'default' | 'profile' | 'form' | 'list';
}

export function LoadingScreen({
  title = 'Loading...',
  variant = 'default',
}: LoadingScreenProps) {
  const renderContent = () => {
    switch (variant) {
      case 'profile':
        return (
          <VStack className="gap-y-6">
            {/* Header skeleton */}
            <VStack className="gap-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </VStack>

            {/* Profile card skeleton */}
            <VStack className="gap-y-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <VStack className="gap-y-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </VStack>
            </VStack>

            {/* Content skeleton */}
            <VStack className="gap-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </VStack>
          </VStack>
        );

      case 'form':
        return (
          <VStack className="gap-y-6">
            {/* Header */}
            <VStack className="gap-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </VStack>

            {/* Form fields */}
            <VStack className="gap-y-4">
              <VStack className="gap-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-12 w-full" />
              </VStack>
              <VStack className="gap-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-12 w-full" />
              </VStack>
              <Skeleton className="h-12 w-full" />
            </VStack>
          </VStack>
        );

      case 'list':
        return (
          <VStack className="gap-y-4">
            <Skeleton className="h-8 w-1/2" />
            {[...Array(5)].map((_, i) => (
              <VStack key={i} className="gap-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </VStack>
            ))}
          </VStack>
        );

      default:
        return (
          <VStack className="gap-y-4">
            <H3 className="text-muted-foreground text-center">{title}</H3>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </VStack>
        );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}
