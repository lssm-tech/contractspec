import type { Locale, TranslationEntry } from './catalog';

export interface TenantTranslationOverride {
  tenantId: string;
  appId: string;
  blueprintName: string;
  blueprintVersion: number;
  entries: TranslationEntry[];
  defaultLocale?: Locale;
  enabledLocales?: Locale[];
  updatedAt?: string;
}
