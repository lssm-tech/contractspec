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

// Core i18n API
export {
  createVideoGenI18n,
  getDefaultI18n,
  resetI18nRegistry,
} from './messages';
export type { VideoGenI18n } from './messages';

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
  PROMPT_KEYS,
  SCRIPT_KEYS,
  SCENE_KEYS,
  COMPOSITION_KEYS,
} from './keys';
export type { VideoGenMessageKey } from './keys';

// Catalogs
export { enMessages } from './catalogs/en';
export { frMessages } from './catalogs/fr';
export { esMessages } from './catalogs/es';
