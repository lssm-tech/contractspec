import * as React from 'react';
import { Button, type ButtonProps } from './button';
import { cn } from './utils';

export type CtaProps = ButtonProps & {
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
      className,
      as = 'button',
      href,
      onClick,
      size = 'lg',
      children,
      ...props
    },
    ref
  ) => {
    const handleClick: React.MouseEventHandler<
      HTMLButtonElement | HTMLAnchorElement
    > = (e) => {
      if (ctaName && capture) {
        try {
          capture(ctaName);
        } catch {}
      }
      onClick?.(e as any);
    };

    if (as === 'a') {
      return (
        <Button
          asChild
          size={size}
          className={cn('min-h-[44px]', className)}
          {...props}
        >
          {}
          <a href={href} onClick={handleClick} ref={ref as any}>
            {children}
          </a>
        </Button>
      );
    }

    return (
      <Button
        size={size}
        className={cn('min-h-[44px]', className)}
        onClick={handleClick as any}
        ref={ref as any}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
Cta.displayName = 'Cta';
