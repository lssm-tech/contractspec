'use client';

import * as React from 'react';
import { StatusChip } from '@contractspec/lib.design-system';
import { HStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import {
  ArrowRight,
  Layout,
  Radio,
  Shield,
  Tag,
  Users,
  Zap,
} from 'lucide-react';
import type { FeatureModuleSpec } from '@contractspec/lib.contracts/features';

export interface FeatureHoverPreviewProps {
  /** The feature to preview */
  feature: FeatureModuleSpec;
}

/**
 * Rich hover preview content for feature cards.
 * Shows detailed stats, capabilities, and tags.
 */
export function FeatureHoverPreview({ feature }: FeatureHoverPreviewProps) {
  const { meta, operations, events, presentations, capabilities } = feature;

  const hasCapabilities =
    capabilities?.provides?.length || capabilities?.requires?.length;

  return (
    <>
      {/* Description */}
      {meta.description && (
        <p className="text-muted-foreground text-sm leading-relaxed">
          {meta.description}
        </p>
      )}

      {/* Stats Row */}
      <HStack gap="md" className="py-2">
        {operations?.length ? (
          <div className="flex items-center gap-1.5 text-sm">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="font-medium">{operations.length}</span>
            <span className="text-muted-foreground">ops</span>
          </div>
        ) : null}
        {events?.length ? (
          <div className="flex items-center gap-1.5 text-sm">
            <Radio className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{events.length}</span>
            <span className="text-muted-foreground">events</span>
          </div>
        ) : null}
        {presentations?.length ? (
          <div className="flex items-center gap-1.5 text-sm">
            <Layout className="h-4 w-4 text-purple-500" />
            <span className="font-medium">{presentations.length}</span>
            <span className="text-muted-foreground">views</span>
          </div>
        ) : null}
      </HStack>

      {/* Capabilities */}
      {hasCapabilities && (
        <div className="border-border/50 space-y-1.5 border-t pt-1">
          {capabilities?.provides?.length ? (
            <HStack gap="xs" wrap="wrap" className="items-start">
              <Shield className="mt-0.5 h-3.5 w-3.5 text-emerald-500" />
              <span className="text-muted-foreground text-xs">Provides:</span>
              {capabilities.provides.slice(0, 2).map((cap) => (
                <StatusChip
                  key={cap.key}
                  tone="success"
                  label={cap.key}
                  size="sm"
                />
              ))}
              {capabilities.provides.length > 2 && (
                <span className="text-muted-foreground text-xs">
                  +{capabilities.provides.length - 2}
                </span>
              )}
            </HStack>
          ) : null}
          {capabilities?.requires?.length ? (
            <HStack gap="xs" wrap="wrap" className="items-start">
              <ArrowRight className="mt-0.5 h-3.5 w-3.5 text-blue-500" />
              <span className="text-muted-foreground text-xs">Requires:</span>
              {capabilities.requires.slice(0, 2).map((req) => (
                <StatusChip
                  key={req.key}
                  tone="info"
                  label={req.key}
                  size="sm"
                />
              ))}
              {capabilities.requires.length > 2 && (
                <span className="text-muted-foreground text-xs">
                  +{capabilities.requires.length - 2}
                </span>
              )}
            </HStack>
          ) : null}
        </div>
      )}

      {/* Tags */}
      {meta.tags?.length ? (
        <HStack
          gap="xs"
          wrap="wrap"
          className="border-border/50 items-center border-t pt-1"
        >
          <Tag className="text-muted-foreground h-3.5 w-3.5" />
          {meta.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs"
            >
              #{tag}
            </span>
          ))}
          {meta.tags.length > 4 && (
            <span className="text-muted-foreground text-xs">
              +{meta.tags.length - 4}
            </span>
          )}
        </HStack>
      ) : null}

      {/* Owners */}
      {meta.owners?.length ? (
        <HStack gap="xs" className="text-muted-foreground items-center text-xs">
          <Users className="h-3.5 w-3.5" />
          <span>{meta.owners.join(', ')}</span>
        </HStack>
      ) : null}
    </>
  );
}
