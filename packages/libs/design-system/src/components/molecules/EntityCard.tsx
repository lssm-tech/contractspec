'use client';

import * as React from 'react';
import { Card, CardContent } from '@lssm/lib.ui-kit-web/ui/card';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@lssm/lib.ui-kit-web/ui/utils';

const entityCardVariants = cva('transition-all hover:shadow-2xs', {
  variants: {
    emphasis: {
      default: '',
      subtle: 'border-muted/60 bg-muted/20',
      strong: 'border-primary/50 bg-primary/5',
    },
    density: {
      compact: 'p-3',
      comfortable: 'p-4 md:p-5',
    },
  },
  defaultVariants: { emphasis: 'default', density: 'comfortable' },
});

export type EntityCardProps = React.ComponentProps<typeof Card> &
  VariantProps<typeof entityCardVariants> & {
    cardTitle: React.ReactNode;
    cardSubtitle?: React.ReactNode;
    chips?: React.ReactNode; // right-aligned small chips
    meta?: React.ReactNode; // rows of icon+text data
    footer?: React.ReactNode; // actions area
    href?: string; // optional link wrapper
    contentClassName?: string;
    preview?: React.ReactNode; // hover preview content
  };

export function EntityCard({
  cardTitle,
  cardSubtitle,
  chips,
  meta,
  footer,
  emphasis,
  density,
  className,
  contentClassName,
  href,
  preview,
  ...cardProps
}: EntityCardProps) {
  const Wrapper: React.ElementType = href ? 'a' : 'div';
  const cardContent = (
    <Card
      className={cn(entityCardVariants({ emphasis }), className)}
      {...cardProps}
    >
      <CardContent
        className={cn(entityCardVariants({ density }), contentClassName)}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-lg font-medium">{cardTitle}</div>
              {cardSubtitle && (
                <div className="text-muted-foreground text-base">
                  {cardSubtitle}
                </div>
              )}
            </div>
            {chips && (
              <div className="inline-flex shrink-0 items-center gap-1">
                {chips}
              </div>
            )}
          </div>
          {meta && <div className="space-y-1">{meta}</div>}
          {footer && (
            <div className="flex items-center justify-between">{footer}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const maybePreview = (() => {
    if (!preview) return cardContent;
    try {
      /* eslint-disable @typescript-eslint/no-require-imports */
      const { HoverPreview } =
        require('./HoverPreview') as typeof import('./HoverPreview');
      /* eslint-enable @typescript-eslint/no-require-imports */
      return <HoverPreview trigger={cardContent} content={preview} />;
    } catch {
      return cardContent;
    }
  })();

  return (
    <Wrapper href={href} className={href ? 'block' : undefined}>
      {maybePreview}
    </Wrapper>
  );
}
