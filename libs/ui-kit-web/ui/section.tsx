import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-core/utils';

const sectionVariants = cva('', {
  variants: {
    width: {
      container: 'container mx-auto',
      narrow: 'mx-auto max-w-3xl',
      wide: 'mx-auto max-w-7xl',
      fluid: 'w-full',
    },
    px: {
      none: 'px-0',
      sm: 'px-3',
      md: 'px-4 sm:px-6',
      lg: 'px-4 sm:px-6 lg:px-32',
    },
    py: {
      none: 'py-0',
      sm: 'py-6',
      md: 'py-12',
      lg: 'py-20',
      xl: 'py-32',
    },
    tone: {
      plain: '',
      tint: 'bg-muted/50',
      subtle: 'bg-secondary/10',
    },
    text: {
      lg: 'text-lg',
      base: 'text-base',
    },
  },
  defaultVariants: {
    width: 'container',
    px: 'lg',
    py: 'lg',
    tone: 'plain',
    text: 'lg',
  },
});

export type SectionProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof sectionVariants> & {
    as?:
      | 'section'
      | 'div'
      | 'main'
      | 'header'
      | 'footer'
      | 'aside'
      | 'article'
      | 'nav';
  };

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ as = 'section', className, width, px, py, tone, text, ...props }, ref) => {
    const Comp = as as React.ElementType;
    return (
      <Comp
        ref={ref}
        className={cn(
          sectionVariants({ width, px, py, tone, text }),
          className
        )}
        {...props}
      />
    );
  }
);
Section.displayName = 'Section';

export { sectionVariants };
