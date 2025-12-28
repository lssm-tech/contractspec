'use client';

import * as React from 'react';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@contractspec/lib.ui-kit-web/ui/hover-card';

export interface HoverPreviewProps {
  trigger: React.ReactNode; // usually a link or chip
  content: React.ReactNode; // preview panel
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  className?: string;
}

export function HoverPreview({
  trigger,
  content,
  align = 'center',
  sideOffset = 8,
  className,
}: HoverPreviewProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent
        align={align}
        sideOffset={sideOffset}
        className={className}
      >
        {content}
      </HoverCardContent>
    </HoverCard>
  );
}
