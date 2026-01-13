'use client';

import { EntityCard, StatusChip } from '@contractspec/lib.design-system';
import { HStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import type { FeatureCardProps } from './types';

const stabilityTone = {
  stable: 'success' as const,
  beta: 'warning' as const,
  experimental: 'info' as const,
  deprecated: 'danger' as const,
};

/**
 * Card component for displaying a feature module.
 * Shows title, description, stability badge, and counts.
 */
export function FeatureCard({
  feature,
  onSelect,
  className,
}: FeatureCardProps) {
  const { meta, operations, events, presentations } = feature;

  const tone =
    stabilityTone[meta.stability as keyof typeof stabilityTone] ?? 'neutral';

  const handleClick = onSelect ? () => onSelect(feature) : undefined;

  return (
    <EntityCard
      cardTitle={meta.title}
      cardSubtitle={meta.key}
      className={className}
      onClick={handleClick}
      chips={
        <StatusChip tone={tone} label={meta.stability ?? 'unknown'} size="sm" />
      }
      meta={
        meta.description ? (
          <span className="text-muted-foreground line-clamp-2 text-sm">
            {meta.description}
          </span>
        ) : undefined
      }
      footer={
        <HStack gap="sm" className="text-muted-foreground text-xs">
          {operations?.length ? <span>{operations.length} ops</span> : null}
          {events?.length ? <span>{events.length} events</span> : null}
          {presentations?.length ? (
            <span>{presentations.length} presentations</span>
          ) : null}
        </HStack>
      }
    />
  );
}
