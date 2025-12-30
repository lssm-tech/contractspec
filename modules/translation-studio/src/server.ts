'use server';

import { i18n, type I18nNamespace } from './i18n';
import { fallbackLng, headerName } from './settings';
import { headers } from 'next/headers';
import type { KeyPrefix } from 'i18next';
import type { UseTranslationOptions } from 'react-i18next';

export const getT = async <
  Ns extends I18nNamespace,
  TKPrefix extends KeyPrefix<Ns> = undefined,
>(
  ns: Ns,
  options?: UseTranslationOptions<undefined>
) => {
  let lng: string | null = null;
  try {
    const headerList = await headers();
    lng = headerList.get(headerName);
  } catch {
    // Ignore error and use default language
  }
  if (lng && i18n.resolvedLanguage !== lng) {
    await i18n.changeLanguage(lng);
  }
  if (ns && !i18n.hasLoadedNamespace(ns)) {
    await i18n.loadNamespaces(ns);
  }
  return {
    t: i18n.getFixedT<Ns, TKPrefix>(
      lng ?? i18n.resolvedLanguage ?? fallbackLng,
      Array.isArray(ns) ? ns[0] : ns,
      options?.keyPrefix
    ),
    i18n: i18n,
  };
};
