'use client';

export interface ColorTokens {
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  ring: string;
}

export interface RadiusTokens {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface SpaceTokens {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface TypographyTokens {
  h1: number;
  h2: number;
  h3: number;
  body: number;
  small: number;
}

export interface ThemeTokens {
  colors: ColorTokens;
  radii: RadiusTokens;
  space: SpaceTokens;
  typography: TypographyTokens;
  icons: { sm: number; md: number; lg: number };
}

export const defaultTokens: ThemeTokens = {
  colors: {
    background: '#ffffff',
    foreground: '#0a0a0a',
    muted: '#f4f4f5',
    mutedForeground: '#71717a',
    primary: '#0f49a0',
    primaryForeground: '#ffffff',
    accent: '#16a34a',
    accentForeground: '#ffffff',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#e4e4e7',
    ring: '#2563eb',
  },
  radii: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  typography: { h1: 30, h2: 24, h3: 20, body: 16, small: 14 },
  icons: { sm: 16, md: 20, lg: 24 },
};
