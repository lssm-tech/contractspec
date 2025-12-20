'use client';

import * as React from 'react';
import { Button, type ButtonProps } from './Button';

export type CtaProps = ButtonProps & {
  capture?: (cta: string) => void;
  ctaName?: string;
  as?: 'button' | 'a';
  href?: string;
  children?: React.ReactNode;
};

export const Cta = React.forwardRef<unknown, CtaProps>(
  ({ capture, ctaName, size = 'touch', onClick, children, ...props }, ref) => {
    const handlePress = () => {
      try {
        if (ctaName) {
          if (capture) capture(ctaName);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let ph: any;
          try {
            // Prefer posthog-react-native if present (optional peer dependency)
            /* eslint-disable @typescript-eslint/no-require-imports */
            ph =
              require('posthog-react-native').default ??
              require('posthog-react-native');
            /* eslint-enable @typescript-eslint/no-require-imports */
          } catch {
            /* ignore */
          }
          if (ph && typeof ph.capture === 'function') {
            ph.capture('cta_click', { cta: ctaName });
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const globalPh = (globalThis as any).posthog;
            if (globalPh && typeof globalPh.capture === 'function') {
              globalPh.capture('cta_click', { cta: ctaName });
            }
          }
        }
      } catch {
        /* ignore */
      }
      // Bridge to any provided web-style onClick for API symmetry
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore cross-platform prop bridge
      onClick?.();
    };

    return (
      <Button
        size={size}
        // RN kits generally use onPress
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore cross-platform prop bridge
        onPress={handlePress}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(props as any)}
      >
        {children}
      </Button>
    );
  }
);

Cta.displayName = 'Cta';
