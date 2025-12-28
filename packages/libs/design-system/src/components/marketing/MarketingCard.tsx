import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

export type MarketingCardTone = 'default' | 'muted' | 'elevated';

const toneClasses: Record<MarketingCardTone, string> = {
  default: 'border-border/60 bg-card/90',
  muted: 'border-border/50 bg-muted/50',
  elevated: 'border-border/50 bg-card shadow-lg shadow-black/5',
};

type MarketingCardProps = React.ComponentProps<typeof Card> & {
  tone?: MarketingCardTone;
};

export function MarketingCard({
  tone = 'default',
  className,
  ...props
}: MarketingCardProps) {
  return (
    <Card
      className={cn(
        'backdrop-blur transition-shadow',
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}

export {
  CardContent as MarketingCardContent,
  CardDescription as MarketingCardDescription,
  CardHeader as MarketingCardHeader,
  CardTitle as MarketingCardTitle,
};
