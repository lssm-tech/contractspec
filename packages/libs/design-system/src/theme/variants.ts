'use client';

import { cva, type VariantProps } from 'class-variance-authority';

export type SizeVariant = 'sm' | 'md' | 'lg';
export type DensityVariant = 'compact' | 'comfortable';
export type ToneVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type EmphasisVariant = 'default' | 'subtle' | 'strong';

/**
 * Base CVA example to compose in DS components.
 * Consumers can extend this with component-specific classes.
 */
export const dsBaseVariants = cva('', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    density: {
      compact: '',
      comfortable: '',
    },
    tone: {
      neutral: '',
      info: '',
      success: '',
      warning: '',
      danger: '',
    },
    emphasis: {
      default: '',
      subtle: '',
      strong: '',
    },
  },
  defaultVariants: {
    size: 'md',
    density: 'comfortable',
    tone: 'neutral',
    emphasis: 'default',
  },
});

export type DSBaseVariantsProps = VariantProps<typeof dsBaseVariants>;
