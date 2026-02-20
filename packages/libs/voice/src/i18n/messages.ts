/**
 * Translation helper for the voice package.
 */

import {
  createI18nFactory,
  type I18nInstance,
} from '@contractspec/lib.contracts-spec/translations';
import { enMessages } from './catalogs/en';
import { frMessages } from './catalogs/fr';
import { esMessages } from './catalogs/es';
import type { VoiceMessageKey } from './keys';

const factory = createI18nFactory<VoiceMessageKey>({
  specKey: 'voice.messages',
  catalogs: [enMessages, frMessages, esMessages],
});

/** I18n instance type for the voice package. */
export type VoiceI18n = I18nInstance<VoiceMessageKey>;

/** Create an i18n instance for a given locale. */
export const createVoiceI18n = factory.create;

/** Create a default (English) i18n instance. */
export const getDefaultI18n = factory.getDefault;

/** Reset the shared registry (useful for testing). @internal */
export const resetI18nRegistry = factory.resetRegistry;
