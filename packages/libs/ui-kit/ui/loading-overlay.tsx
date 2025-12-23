import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { VStack } from './stack';
import { Text } from './text';
import { H3 } from './typography';

interface LoadingOverlayProps {
  isVisible: boolean;
  title?: string;
  subtitle?: string;
}

export function LoadingOverlay({
  isVisible,
  title = 'Loading...',
  subtitle,
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <VStack className="items-center gap-y-4">
        <ActivityIndicator size="large" color="#6b7280" />
        <VStack className="items-center gap-y-2">
          <H3 className="text-center">{title}</H3>
          {subtitle && (
            <Text className="text-muted-foreground text-center">
              {subtitle}
            </Text>
          )}
        </VStack>
      </VStack>
    </View>
  );
}
