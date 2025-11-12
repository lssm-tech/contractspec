import * as React from 'react';
import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import { cn } from './utils';
import { cva, type VariantProps } from 'class-variance-authority';

const baseStyle = 'flex';

// VStack variants using cva
const vStackVariants = cva(
  [baseStyle, 'flex-col'], // base classes
  {
    variants: {
      spacing: {
        none: '',
        xs: 'gap-y-1',
        sm: 'gap-y-2',
        md: 'gap-y-4',
        lg: 'gap-y-6',
        xl: 'gap-y-8',
        '2xl': 'gap-y-12',
      },
      align: {
        stretch: 'items-stretch',
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
      },
      justify: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      },
      width: {
        auto: 'w-auto',
        full: 'w-full',
        screen: 'w-screen',
        fit: 'w-fit',
      },
      padding: {
        none: '',
        xs: 'p-1',
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
      gap: {
        none: '',
        xs: 'gap-1',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8',
      },
    },
    defaultVariants: {
      spacing: 'md',
      align: 'stretch',
      justify: 'start',
      width: 'auto',
      padding: 'none',
      gap: 'none',
    },
  }
);

// HStack variants using cva
const hStackVariants = cva(
  [baseStyle, 'flex-row'], // base classes
  {
    variants: {
      spacing: {
        none: '',
        xs: 'gap-x-1',
        sm: 'gap-x-2',
        md: 'gap-x-4',
        lg: 'gap-x-6',
        xl: 'gap-x-8',
        '2xl': 'gap-x-12',
      },
      align: {
        stretch: 'items-stretch',
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
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
      width: {
        auto: 'w-auto',
        full: 'w-full',
        screen: 'w-screen',
        fit: 'w-fit',
      },
      padding: {
        none: '',
        xs: 'p-1',
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
      gap: {
        none: '',
        xs: 'gap-1',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8',
      },
      wrap: {
        nowrap: 'flex-nowrap',
        wrap: 'flex-wrap',
        reverse: 'flex-wrap-reverse',
      },
    },
    defaultVariants: {
      spacing: 'md',
      align: 'center',
      justify: 'start',
      width: 'auto',
      padding: 'none',
      gap: 'none',
      wrap: 'wrap',
    },
  }
);

const boxVariants = cva(
  [baseStyle, 'flex-row'], // base classes
  {
    variants: {
      spacing: {
        none: '',
        xs: 'gap-x-1',
        sm: 'gap-x-2',
        md: 'gap-x-4',
        lg: 'gap-x-6',
        xl: 'gap-x-8',
        '2xl': 'gap-x-12',
      },
      align: {
        stretch: 'items-stretch',
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
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
      width: {
        auto: 'w-auto',
        full: 'w-full',
        screen: 'w-screen',
        fit: 'w-fit',
      },
      padding: {
        none: '',
        xs: 'p-1',
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
      gap: {
        none: '',
        xs: 'gap-1',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8',
      },
      wrap: {
        nowrap: 'flex-nowrap',
        wrap: 'flex-wrap',
        reverse: 'flex-wrap-reverse',
      },
    },
    defaultVariants: {
      spacing: 'md',
      align: 'center',
      justify: 'center',
      width: 'auto',
      padding: 'none',
      gap: 'none',
      wrap: 'wrap',
    },
  }
);

type BoxProps = ViewProps &
  VariantProps<typeof boxVariants> & {
    ref?: React.RefObject<React.ComponentRef<typeof View>>;
  };

type VStackProps = ViewProps &
  VariantProps<typeof vStackVariants> & {
    ref?: React.RefObject<React.ComponentRef<typeof View>>;
  };

type HStackProps = ViewProps &
  VariantProps<typeof hStackVariants> & {
    ref?: React.RefObject<React.ComponentRef<typeof View>>;
  };

function Box({
  className,
  spacing,
  align,
  justify,
  width,
  padding,
  gap,
  wrap,
  ...props
}: BoxProps) {
  return (
    <View
      className={cn(
        boxVariants({ spacing, align, justify, width, padding, gap, wrap }),
        className
      )}
      {...props}
    />
  );
}

function HStack({
  className,
  spacing,
  align,
  justify,
  width,
  padding,
  gap,
  wrap,
  ...props
}: HStackProps) {
  return (
    <View
      className={cn(
        hStackVariants({ spacing, align, justify, width, padding, gap, wrap }),
        className
      )}
      {...props}
    />
  );
}

function VStack({
  className,
  spacing,
  align,
  justify,
  width,
  padding,
  gap,
  ...props
}: VStackProps) {
  return (
    <View
      className={cn(
        vStackVariants({ spacing, align, justify, width, padding, gap }),
        className
      )}
      {...props}
    />
  );
}

export {
  HStack,
  VStack,
  type HStackProps,
  type VStackProps,
  Box,
  type BoxProps,
};
