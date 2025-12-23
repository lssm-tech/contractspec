import * as React from 'react';
import { VStack, HStack } from '../stack';
import { Button } from '../button';

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
      <div className="text-lg font-semibold">{title}</div>
      {summary && (
        <div className="text-muted-foreground text-base">{summary}</div>
      )}
      {ctaHref && (
        <HStack>
          <a href={ctaHref} onClick={onCtaClick}>
            <Button size="sm" variant="outline">
              {ctaLabel}
            </Button>
          </a>
        </HStack>
      )}
    </VStack>
  );
}
