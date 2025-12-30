import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-core/utils';

const vStackVariants = cva('flex flex-col', {
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-6',
      '2xl': 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
  },
  defaultVariants: {
    gap: 'md',
    align: 'stretch',
    justify: 'start',
  },
});

type VStackProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof vStackVariants> & {
    as?:
      | 'div'
      | 'section'
      | 'nav'
      | 'main'
      | 'header'
      | 'footer'
      | 'article'
      | 'aside';
  };

const VStack = React.forwardRef<HTMLDivElement, VStackProps>(
  ({ className, gap, align, justify, as = 'div', ...props }, ref) => {
    const Comp = as as React.ElementType;
    return (
      <Comp
        ref={ref}
        className={cn(vStackVariants({ gap, align, justify }), className)}
        {...props}
      />
    );
  }
);
VStack.displayName = 'VStack';

const hStackVariants = cva('flex flex-row', {
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-6',
      '2xl': 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      nowrap: 'flex-nowrap',
      wrap: 'flex-wrap',
      wrapReverse: 'flex-wrap-reverse',
    },
  },
  defaultVariants: {
    gap: 'md',
    align: 'center',
    justify: 'start',
    wrap: 'wrap',
  },
});

type HStackProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof hStackVariants> & {
    as?: 'div' | 'section' | 'nav' | 'header' | 'footer' | 'article' | 'aside';
  };

const HStack = React.forwardRef<HTMLDivElement, HStackProps>(
  ({ className, gap, align, justify, wrap, as = 'div', ...props }, ref) => {
    const Comp = as as React.ElementType;
    return (
      <Comp
        ref={ref}
        className={cn(hStackVariants({ gap, align, justify, wrap }), className)}
        {...props}
      />
    );
  }
);
HStack.displayName = 'HStack';

const boxVariants = cva('flex flex-row', {
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-6',
      '2xl': 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      nowrap: 'flex-nowrap',
      wrap: 'flex-wrap',
      wrapReverse: 'flex-wrap-reverse',
    },
  },
  defaultVariants: {
    gap: 'md',
    align: 'center',
    justify: 'center',
    wrap: 'nowrap',
  },
});

type BoxProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof boxVariants> & {
    as?: 'div' | 'section' | 'nav' | 'header' | 'footer' | 'article' | 'aside';
  };

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, gap, align, justify, wrap, as = 'div', ...props }, ref) => {
    const Comp = as as React.ElementType;
    return (
      <Comp
        ref={ref}
        className={cn(boxVariants({ gap, align, justify, wrap }), className)}
        {...props}
      />
    );
  }
);
Box.displayName = 'Box';

export { VStack, HStack, vStackVariants, hStackVariants, boxVariants, Box };
