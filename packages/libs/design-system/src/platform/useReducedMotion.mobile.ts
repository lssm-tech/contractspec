'use client';

import * as React from 'react';
import { AccessibilityInfo } from 'react-native';

export function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    AccessibilityInfo?.isReduceMotionEnabled().then((v: any) => {
      if (mounted) setReduced(Boolean(v));
    });
    const handler = (v: any) => {
      if (mounted) setReduced(Boolean(v));
    };
    // RN >= 0.71
    const sub = (AccessibilityInfo as any)?.addEventListener?.(
      'reduceMotionChanged',
      handler
    );
    return () => {
      mounted = false;
      // RN >= 0.71
      sub?.remove?.();
      // RN < 0.71
      (AccessibilityInfo as any)?.removeEventListener?.(
        'reduceMotionChanged',
        handler
      );
    };
  }, []);

  return reduced;
}
