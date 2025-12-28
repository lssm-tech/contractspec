import * as React from 'react';
import { Button, type ButtonProps } from './button';
import { cn } from '@contractspec/lib.ui-kit-core/utils';

export type CtaProps = Omit<ButtonProps, 'onClick'> & {
  capture?: (cta: string) => void;
  ctaName?: string;
  as?: 'button' | 'a';
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
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
        } catch {
          // ignore
        }
      }
      onClick?.(e);
    };

    if (as === 'a') {
      return (
        <Button
          asChild
          size={size}
          className={cn('min-h-[44px]', className)}
          {...props}
        >
          <a
            href={href}
            onClick={handleClick}
            ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          >
            {children}
          </a>
        </Button>
      );
    }

    return (
      <Button
        size={size}
        className={cn('min-h-[44px]', className)}
        onClick={handleClick as React.MouseEventHandler<HTMLButtonElement>}
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
Cta.displayName = 'Cta';
