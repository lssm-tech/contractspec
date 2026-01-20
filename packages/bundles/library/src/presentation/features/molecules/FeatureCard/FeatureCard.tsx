'use client';

import { EntityCard, StatusChip } from '@contractspec/lib.design-system';
import { HStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Zap, Radio, Layout, Shield } from 'lucide-react';
import { FeatureIcon, getFeatureIconTone } from '../../atoms/FeatureIcon';
import { FeatureHoverPreview } from '../FeatureHoverPreview';
import type { FeatureCardProps } from './types';

const stabilityTone = {
  stable: 'success' as const,
  beta: 'warning' as const,
  experimental: 'info' as const,
  deprecated: 'danger' as const,
};

/**
 * Enhanced card component for displaying a feature module.
 * Shows icon, title, description, stability badge, stats, and capability indicators.
 * Includes hover preview with full feature details.
 */
export function FeatureCard({
  feature,
  onSelect,
  className,
}: FeatureCardProps) {
  const { meta, operations, events, presentations, capabilities } = feature;

  const tone =
    stabilityTone[meta.stability as keyof typeof stabilityTone] ?? 'neutral';

  const iconTone = getFeatureIconTone(meta.stability);

  // Use strong emphasis for stable features for visual highlight
  const emphasis = meta.stability === 'stable' ? 'strong' : 'default';

  const handleClick = onSelect ? () => onSelect(feature) : undefined;

  const hasCapabilities =
    capabilities?.provides?.length || capabilities?.requires?.length;

  return (
    <EntityCard
      cardTitle={meta.title}
      cardSubtitle={meta.key}
      className={className}
      onClick={handleClick}
      emphasis={emphasis}
      icon={
        <FeatureIcon
          domain={meta.domain}
          tags={meta.tags}
          stability={meta.stability}
          size="md"
        />
      }
      iconTone={iconTone}
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
      preview={<FeatureHoverPreview feature={feature} />}
      footer={
        <HStack
          gap="md"
          className="text-muted-foreground w-full justify-between text-xs"
        >
          <HStack gap="sm">
            {operations?.length ? (
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-amber-500" />
                {operations.length}
              </span>
            ) : null}
            {events?.length ? (
              <span className="flex items-center gap-1">
                <Radio className="h-3 w-3 text-blue-500" />
                {events.length}
              </span>
            ) : null}
            {presentations?.length ? (
              <span className="flex items-center gap-1">
                <Layout className="h-3 w-3 text-purple-500" />
                {presentations.length}
              </span>
            ) : null}
          </HStack>
          {hasCapabilities && (
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-emerald-500" />
              {(capabilities?.provides?.length ?? 0) +
                (capabilities?.requires?.length ?? 0)}
            </span>
          )}
        </HStack>
      }
    />
  );
}
