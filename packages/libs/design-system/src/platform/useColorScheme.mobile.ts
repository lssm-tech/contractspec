'use client';

import * as React from 'react';
import { Appearance, type ColorSchemeName } from 'react-native';

export type ColorScheme = 'light' | 'dark';

export function useColorScheme(): ColorScheme {
  const [scheme, setScheme] = React.useState<ColorScheme>(() =>
    (Appearance.getColorScheme?.() as ColorSchemeName) === 'dark'
      ? 'dark'
      : 'light'
  );

  React.useEffect(() => {
    const listener = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
      setScheme(colorScheme === 'dark' ? 'dark' : 'light');
    };
    const sub = (Appearance as any).addChangeListener?.(listener);
    return () => sub?.remove?.();
  }, []);

  return scheme;
}
