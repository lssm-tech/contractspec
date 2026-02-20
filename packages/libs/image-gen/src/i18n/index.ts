export { I18N_KEYS, PROMPT_KEYS, IMAGE_KEYS, PURPOSE_KEYS } from './keys';
export type { ImageGenMessageKey } from './keys';

export {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  resolveLocale,
  isSupportedLocale,
} from './locale';
export type { SupportedLocale } from './locale';

export {
  createImageGenI18n,
  getDefaultI18n,
  resetI18nRegistry,
} from './messages';
export type { ImageGenI18n } from './messages';
