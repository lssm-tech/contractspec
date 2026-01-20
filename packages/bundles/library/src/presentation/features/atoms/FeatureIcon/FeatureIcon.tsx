'use client';

import * as React from 'react';
import {
  FileText,
  Zap,
  Boxes,
  Settings,
  Globe,
  Shield,
  Database,
  MessageSquare,
  Layout,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

/** Domain to icon mapping */
const domainIconMap: Record<string, LucideIcon> = {
  platform: Settings,
  documentation: FileText,
  docs: FileText,
  integration: Workflow,
  api: Globe,
  security: Shield,
  data: Database,
  messaging: MessageSquare,
  ui: Layout,
  presentation: Layout,
};

/** Tag to icon mapping (fallback if domain not matched) */
const tagIconMap: Record<string, LucideIcon> = {
  documentation: FileText,
  guides: FileText,
  'api-reference': Globe,
  presentations: Layout,
  ui: Layout,
  rendering: Layout,
  mcp: Workflow,
  integration: Workflow,
  security: Shield,
  auth: Shield,
  data: Database,
  storage: Database,
};

/** Stability to tone mapping */
const stabilityToneMap: Record<
  string,
  'success' | 'warning' | 'info' | 'danger' | 'primary'
> = {
  stable: 'success',
  beta: 'warning',
  experimental: 'info',
  deprecated: 'danger',
};

export interface FeatureIconProps {
  /** Feature domain for icon selection */
  domain?: string;
  /** Feature tags for icon selection fallback */
  tags?: string[];
  /** Feature stability for tone selection */
  stability?: string;
  /** Override icon */
  icon?: LucideIcon;
  /** Size of the icon */
  size?: 'sm' | 'md' | 'lg';
  /** Additional class name */
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

/**
 * Smart icon component that maps feature domains/tags to appropriate icons.
 * Returns the icon element with semantic coloring based on stability.
 */
export function FeatureIcon({
  domain,
  tags = [],
  stability,
  icon: IconOverride,
  size = 'md',
  className,
}: FeatureIconProps) {
  const Icon: LucideIcon = React.useMemo((): LucideIcon => {
    if (IconOverride) return IconOverride;

    // Try domain first
    if (domain) {
      const domainIcon = domainIconMap[domain.toLowerCase()];
      if (domainIcon) return domainIcon;
    }

    // Try tags
    for (const tag of tags) {
      const tagIcon = tagIconMap[tag.toLowerCase()];
      if (tagIcon) return tagIcon;
    }

    // Default
    return Boxes;
  }, [domain, tags, IconOverride]);

  const tone = stability ? stabilityToneMap[stability] || 'primary' : 'primary';

  const toneClasses = {
    success: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
    info: 'text-blue-600 dark:text-blue-400',
    danger: 'text-red-600 dark:text-red-400',
    primary: 'text-primary',
  };

  return (
    <Icon className={cn(sizeClasses[size], toneClasses[tone], className)} />
  );
}

/** Get the icon tone for EntityCard based on stability */
export function getFeatureIconTone(
  stability?: string
): 'success' | 'warning' | 'info' | 'danger' | 'primary' {
  if (!stability) return 'primary';
  return stabilityToneMap[stability] || 'primary';
}
