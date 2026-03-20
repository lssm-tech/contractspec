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

// Catalogs
export { enMessages } from './catalogs/en';
export { esMessages } from './catalogs/es';
export { frMessages } from './catalogs/fr';
export type { VoiceMessageKey } from './keys';

// Message keys
export {
	CONVERSATIONAL_KEYS,
	I18N_KEYS,
	STT_KEYS,
	TTS_PACE_KEYS,
	TTS_PROMPT_KEYS,
} from './keys';
export type { SupportedLocale } from './locale';
// Locale utilities
export {
	DEFAULT_LOCALE,
	isSupportedLocale,
	resolveLocale,
	SUPPORTED_LOCALES,
} from './locale';
export type { VoiceI18n } from './messages';
// Core i18n API
export { createVoiceI18n, getDefaultI18n, resetI18nRegistry } from './messages';
