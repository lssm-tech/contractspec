/**
 * Internationalization (i18n) module for @contractspec/lib.voice.
 *
 * @example
 * ```ts
 * import { createVoiceI18n } from "@contractspec/lib.voice/i18n";
 *
 * const i18n = createVoiceI18n("fr");
 * i18n.t("conv.session.started"); // => "Session vocale demarree"
 * ```
 */

// Core i18n API
export { createVoiceI18n, getDefaultI18n, resetI18nRegistry } from './messages';
export type { VoiceI18n } from './messages';

// Locale utilities
export {
  resolveLocale,
  isSupportedLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from './locale';
export type { SupportedLocale } from './locale';

// Message keys
export {
  I18N_KEYS,
  TTS_PROMPT_KEYS,
  TTS_PACE_KEYS,
  STT_KEYS,
  CONVERSATIONAL_KEYS,
} from './keys';
export type { VoiceMessageKey } from './keys';

// Catalogs
export { enMessages } from './catalogs/en';
export { frMessages } from './catalogs/fr';
export { esMessages } from './catalogs/es';
