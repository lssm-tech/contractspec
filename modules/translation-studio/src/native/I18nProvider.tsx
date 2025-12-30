'use client';

import type React from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '../i18n';

interface Props {
  children: React.ReactNode;
}

export function I18nProviderNative({ children }: Props) {
  // React 18 vs 19 types: align JSX element type by casting to ComponentType
  const I18nextProviderCompat =
    I18nextProvider as unknown as React.ComponentType<{
      i18n: unknown;
      children?: React.ReactNode;
    }>;
  return <I18nextProviderCompat i18n={i18n}>{children}</I18nextProviderCompat>;
}
