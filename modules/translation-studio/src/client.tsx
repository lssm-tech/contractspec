'use client';

import { i18n } from './i18n';
import { useEffect, useState } from 'react';
import { useTranslation, type UseTranslationOptions } from 'react-i18next';
import type { FlatNamespace } from 'i18next';

const runsOnServerSide = typeof window === 'undefined';

export const useT = <
  const Ns extends
    | FlatNamespace
    | readonly [FlatNamespace?, ...FlatNamespace[]]
    | undefined = undefined,
>(
  ns?: Ns,
  options?: UseTranslationOptions<undefined>
) => {
  if (runsOnServerSide) {
    return useTranslation(ns, options);
  }
  // Track active language to trigger rerenders when language changes
  const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);

  useEffect(() => {
    if (activeLng === i18n.resolvedLanguage) return;
    setActiveLng(i18n.resolvedLanguage);
  }, [activeLng, i18n.resolvedLanguage]);

  return useTranslation<Ns>(ns, options);
};

export { I18nextProvider, useTranslation } from 'react-i18next';
