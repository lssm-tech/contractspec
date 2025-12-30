'use client';

import * as React from 'react';

export type ColorScheme = 'light' | 'dark';

export function useColorScheme(): ColorScheme {
  const [scheme, setScheme] = React.useState<ColorScheme>('light');

  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setScheme(media.matches ? 'dark' : 'light');
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  return scheme;
}
