import * as React from 'react';
import { VStack, HStack } from '../stack';
import { Text } from '../text';
import { Button } from '../button';
import { Link } from 'expo-router';

export function UseCaseCard({
  title,
  summary,
  ctaHref,
  ctaLabel = 'Learn more',
  onCtaClick,
}: {
  title: string;
  summary?: string;
  ctaHref?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}) {
  return (
    <VStack className="rounded-lg border p-4" gap="sm">
      <Text className="text-lg font-semibold">{title}</Text>
      {summary && (
        <Text className="text-muted-foreground text-base">{summary}</Text>
      )}
      {ctaHref && (
        <HStack>
          <Link href={ctaHref}>
            <Button size="sm" variant="outline" onPress={onCtaClick}>
              {ctaLabel}
            </Button>
          </Link>
        </HStack>
      )}
    </VStack>
  );
}
