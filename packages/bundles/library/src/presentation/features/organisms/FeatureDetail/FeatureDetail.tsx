'use client';

import {
  StatCard,
  StatCardGroup,
  StatusChip,
} from '@contractspec/lib.design-system';
import { Box, HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import type { FeatureDetailProps } from './types';
import Link from 'next/link';

const stabilityTone = {
  stable: 'success' as const,
  beta: 'warning' as const,
  experimental: 'info' as const,
  deprecated: 'danger' as const,
};

/**
 * Detailed view of a feature module.
 * Shows full feature info including operations, events, capabilities, and tags.
 */
export function FeatureDetail({ feature, className }: FeatureDetailProps) {
  const { meta, operations, events, presentations, capabilities } = feature;

  const tone =
    stabilityTone[meta.stability as keyof typeof stabilityTone] ?? 'neutral';

  return (
    <VStack gap="lg" className={cn('w-full', className)}>
      <HStack gap="sm">
        <StatusChip tone={tone} label={meta.stability ?? 'unknown'} />
        <StatusChip tone="neutral" label={meta.key} size="sm" />
        <StatusChip tone="neutral" label={`v${meta.version}`} size="sm" />
      </HStack>

      <StatCardGroup>
        <Link href={`./${feature.meta.key}/operations`}>
          <StatCard label="Operations" value={operations?.length ?? 0} />
        </Link>
        <Link href={`./${feature.meta.key}/events`}>
          <StatCard label="Events" value={events?.length ?? 0} />
        </Link>
        <Link href={`./${feature.meta.key}/presentations`}>
          <StatCard label="Presentations" value={presentations?.length ?? 0} />
        </Link>
      </StatCardGroup>

      {capabilities?.provides?.length ? (
        <Box className="flex-col rounded-lg border p-4" gap="sm" align="start">
          <span className="font-semibold">Provides Capabilities</span>
          <HStack gap="xs" wrap="wrap">
            {capabilities.provides.map((cap) => (
              <StatusChip
                key={`${cap.key}-${cap.version}`}
                tone="success"
                label={`${cap.key} v${cap.version}`}
                size="sm"
              />
            ))}
          </HStack>
        </Box>
      ) : null}

      {capabilities?.requires?.length ? (
        <Box className="flex-col rounded-lg border p-4" gap="sm" align="start">
          <span className="font-semibold">Requires Capabilities</span>
          <HStack gap="xs" wrap="wrap">
            {capabilities.requires.map((req) => (
              <StatusChip
                key={req.key}
                tone="info"
                label={`${req.key}${req.version ? ` v${req.version}` : ''}${req.optional ? ' (optional)' : ''}`}
                size="sm"
              />
            ))}
          </HStack>
        </Box>
      ) : null}

      {meta.tags?.length ? (
        <Box className="flex-col rounded-lg border p-4" gap="sm" align="start">
          <span className="font-semibold">Tags</span>
          <HStack gap="xs" wrap="wrap">
            {meta.tags.map((tag) => (
              <StatusChip
                key={tag}
                tone="neutral"
                label={`#${tag}`}
                size="sm"
              />
            ))}
          </HStack>
        </Box>
      ) : null}

      {meta.owners?.length ? (
        <Box className="flex-col rounded-lg border p-4" gap="sm" align="start">
          <span className="font-semibold">Owners</span>
          <HStack gap="xs" wrap="wrap">
            {meta.owners.map((owner) => (
              <StatusChip key={owner} tone="neutral" label={owner} size="sm" />
            ))}
          </HStack>
        </Box>
      ) : null}
    </VStack>
  );
}
