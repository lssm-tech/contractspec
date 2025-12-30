export type Locale = string;
export type MessageKey = string;

export interface TranslationEntry {
  key: MessageKey;
  locale: Locale;
  value: string;
  context?: string;
}

export interface TranslationCatalogMeta {
  key: string;
  version: string;
  description?: string;
}

export interface PlatformTranslationCatalog {
  meta: TranslationCatalogMeta;
  defaultLocale: Locale;
  supportedLocales: Locale[];
  entries: TranslationEntry[];
}

export interface BlueprintTranslationCatalog {
  meta: TranslationCatalogMeta;
  defaultLocale: Locale;
  supportedLocales: Locale[];
  entries: TranslationEntry[];
}
