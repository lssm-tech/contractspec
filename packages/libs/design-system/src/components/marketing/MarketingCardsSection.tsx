import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { MarketingSection } from './MarketingSection';

const gridVariants = cva('grid gap-6', {
  variants: {
    columns: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    },
  },
  defaultVariants: {
    columns: 3,
  },
});

type MarketingCardsSectionProps = React.PropsWithChildren<
  Omit<React.ComponentProps<typeof MarketingSection>, 'children'> &
    VariantProps<typeof gridVariants> & {
      gridClassName?: string;
    }
>;

export function MarketingCardsSection({
  children,
  columns,
  gridClassName,
  ...sectionProps
}: MarketingCardsSectionProps) {
  return (
    <MarketingSection {...sectionProps}>
      <div className={cn(gridVariants({ columns }), gridClassName)}>
        {children}
      </div>
    </MarketingSection>
  );
}
