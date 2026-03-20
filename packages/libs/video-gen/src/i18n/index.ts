/**
 * Internationalization (i18n) module for @contractspec/lib.video-gen.
 *
 * @module i18n
 *
 * @example
 * ```ts
 * import { createVideoGenI18n } from '@contractspec/lib.video-gen/i18n';
 *
 * const i18n = createVideoGenI18n("fr");
 * i18n.t("scene.hook.problem"); // => "Le probl\u00e8me"
 * ```
 */

// Catalogs
export { enMessages } from './catalogs/en';
export { esMessages } from './catalogs/es';
export { frMessages } from './catalogs/fr';
export type { VideoGenMessageKey } from './keys';

// Message keys
export {
	COMPOSITION_KEYS,
	I18N_KEYS,
	PROMPT_KEYS,
	SCENE_KEYS,
	SCRIPT_KEYS,
} from './keys';
export type { SupportedLocale } from './locale';
// Locale utilities
export {
	DEFAULT_LOCALE,
	isSupportedLocale,
	resolveLocale,
	SUPPORTED_LOCALES,
} from './locale';
export type { VideoGenI18n } from './messages';
// Core i18n API
export {
	createVideoGenI18n,
	getDefaultI18n,
	resetI18nRegistry,
} from './messages';
