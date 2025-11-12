'use client';

import * as React from 'react';

interface Breakpoints {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

const DEFAULT: Breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 };

export function useResponsive(custom?: Partial<Breakpoints>) {
  const bp = React.useMemo(() => ({ ...DEFAULT, ...custom }), [custom]);
  const [width, setWidth] = React.useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : bp.md
  );

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
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
