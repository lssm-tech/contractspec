'use client';

import * as React from 'react';
import { Card, CardContent } from '@contractspec/lib.ui-kit-web/ui/card';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { ChevronDown } from 'lucide-react';

const entityCardVariants = cva(
  'transition-all duration-200 hover:shadow-md group',
  {
    variants: {
      emphasis: {
        default: '',
        subtle: 'border-muted/60 bg-muted/20',
        strong: 'border-primary/50 bg-primary/5',
        accentGradient:
          'border-transparent bg-gradient-to-br from-primary/10 via-background to-secondary/10 ring-1 ring-primary/20',
      },
      density: {
        compact: 'p-3',
        comfortable: 'p-4 md:p-5',
      },
      interactive: {
        true: 'cursor-pointer hover:scale-[1.02] transform-gpu hover:border-primary/40',
        false: '',
      },
    },
    defaultVariants: {
      emphasis: 'default',
      density: 'comfortable',
      interactive: false,
    },
  }
);

const iconContainerVariants = cva(
  'flex shrink-0 items-center justify-center rounded-lg',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
      tone: {
        default: 'bg-muted text-muted-foreground',
        primary: 'bg-primary/10 text-primary',
        success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        danger: 'bg-red-500/10 text-red-600 dark:text-red-400',
      },
    },
    defaultVariants: { size: 'md', tone: 'default' },
  }
);

export type EntityCardIconTone =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger';

export type EntityCardProps = React.ComponentProps<typeof Card> &
  VariantProps<typeof entityCardVariants> & {
    cardTitle: React.ReactNode;
    cardSubtitle?: React.ReactNode;
    /** Icon element to display on the left */
    icon?: React.ReactNode;
    /** Icon container styling */
    iconTone?: EntityCardIconTone;
    iconSize?: 'sm' | 'md' | 'lg';
    chips?: React.ReactNode; // right-aligned small chips
    meta?: React.ReactNode; // rows of icon+text data
    footer?: React.ReactNode; // actions area
    href?: string; // optional link wrapper
    contentClassName?: string;
    preview?: React.ReactNode; // hover preview content
    /** Expandable content section */
    expandableContent?: React.ReactNode;
    /** Default expanded state */
    defaultExpanded?: boolean;
  };

export function EntityCard({
  cardTitle,
  cardSubtitle,
  icon,
  iconTone = 'default',
  iconSize = 'md',
  chips,
  meta,
  footer,
  emphasis,
  density,
  interactive,
  className,
  contentClassName,
  href,
  preview,
  expandableContent,
  defaultExpanded = false,
  onClick,
  ...cardProps
}: EntityCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const Wrapper: React.ElementType = href ? 'a' : 'div';
  const isInteractive = interactive ?? !!(onClick || href);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const cardContent = (
    <Card
      className={cn(
        entityCardVariants({ emphasis, interactive: isInteractive }),
        className
      )}
      onClick={onClick}
      {...cardProps}
    >
      <CardContent
        className={cn(entityCardVariants({ density }), contentClassName)}
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            {icon && (
              <div
                className={iconContainerVariants({
                  size: iconSize,
                  tone: iconTone,
                })}
              >
                {icon}
              </div>
            )}
            <div className="flex flex-1 items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="group-hover:text-primary truncate text-lg font-medium transition-colors">
                  {cardTitle}
                </div>
                {cardSubtitle && (
                  <div className="text-muted-foreground text-sm">
                    {cardSubtitle}
                  </div>
                )}
              </div>
              <div className="inline-flex shrink-0 items-center gap-2">
                {chips}
                {expandableContent && (
                  <button
                    type="button"
                    onClick={handleExpandClick}
                    className="hover:bg-muted rounded-md p-1 transition-colors"
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    <ChevronDown
                      className={cn(
                        'text-muted-foreground h-4 w-4 transition-transform duration-200',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
          {meta && <div className="space-y-1">{meta}</div>}
          {expandableContent && (
            <div
              className={cn(
                'overflow-hidden transition-all duration-200',
                isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="border-border/50 border-t pt-2">
                {expandableContent}
              </div>
            </div>
          )}
          {footer && (
            <div className="flex items-center justify-between pt-1">
              {footer}
            </div>
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
      return <HoverPreview className='bg-red-500' trigger={cardContent} content={preview} />;
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
