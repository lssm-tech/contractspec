import * as React from 'react';
import { Button, type ButtonProps } from './Button';
import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonLink } from './ButtonLink';

const ctaVariants = cva('', {
  variants: {
    size: { sm: 'sm', md: 'md', lg: 'lg', touch: 'touch' },
    emphasis: { default: 'default', subtle: 'secondary', strong: 'default' },
  },
  defaultVariants: { size: 'touch', emphasis: 'default' },
});

export type CtaProps = ButtonProps &
  VariantProps<typeof ctaVariants> & {
    capture?: (cta: string) => void;
    ctaName?: string;
    as?: 'button' | 'a';
    href?: string;
    children?: React.ReactNode;
  };

export const Cta = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  CtaProps
>(
  (
    {
      capture,
      ctaName,
      as = 'button',
      href,
      onClick,
      size = 'touch',
      emphasis = 'default',
      children,
      ...props
    },
    ref
  ) => {
    const handleClick: React.MouseEventHandler<
      HTMLButtonElement | HTMLAnchorElement
    > = (e) => {
      if (ctaName) {
        try {
          if (capture) capture(ctaName);
          // Optional PostHog fallback if present globally
          const ph = (globalThis as any).posthog;
          if (ph && typeof ph.capture === 'function') {
            ph.capture('cta_click', { cta: ctaName });
          }
        } catch {}
      }
      onClick?.(e as any);
    };

    const uiSize = size as ButtonProps['size'];
    const uiVariant = (
      emphasis === 'subtle' ? 'secondary' : 'default'
    ) as ButtonProps['variant'];

    if (as === 'a') {
      return (
        <ButtonLink
          size={uiSize}
          variant={uiVariant}
          {...props}
          href={href}
          ref={ref as any}
        >
          {children}
        </ButtonLink>
      );
    }

    return (
      <Button
        size={uiSize}
        variant={uiVariant}
        onPress={handleClick as any}
        ref={ref as any}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
Cta.displayName = 'Cta';
