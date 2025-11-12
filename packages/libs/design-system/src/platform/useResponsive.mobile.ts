'use client';

import { useEffect, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';

interface Breakpoints {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

const DEFAULT: Breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 };

export function useResponsive(custom?: Partial<Breakpoints>) {
  const bp = useMemo(() => ({ ...DEFAULT, ...custom }), [custom]);
  const [width, setWidth] = useState<number>(Dimensions.get('window').width);

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setWidth(window.width);
    });
    return () => {
      // RN supports remove() on the subscription in newer versions
      if (typeof sub?.remove === 'function') {
        sub.remove();
      }
    };
  }, []);

  const isSM = width >= bp.sm;
  const isMD = width >= bp.md;
  const isLG = width >= bp.lg;
  const isXL = width >= bp.xl;

  const screen: 'mobile' | 'tablet' | 'desktop' = isLG
    ? 'desktop'
    : isSM
      ? 'tablet'
      : 'mobile';

  return {
    width,
    breakpoints: bp,
    isSM,
    isMD,
    isLG,
    isXL,
    screen,
  } as const;
}
