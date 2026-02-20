/**
 * Translation helper for the support-bot package.
 * @module i18n/messages
 */

import {
  createI18nFactory,
  type I18nInstance,
} from '@contractspec/lib.contracts-spec/translations';
import { enMessages } from './catalogs/en';
import { frMessages } from './catalogs/fr';
import { esMessages } from './catalogs/es';
import type { SupportBotMessageKey } from './keys';

export { interpolate } from '@contractspec/lib.contracts-spec/translations';

const factory = createI18nFactory<SupportBotMessageKey>({
  specKey: 'support-bot.messages',
  catalogs: [enMessages, frMessages, esMessages],
});

/** I18n instance type for the support-bot package. */
export type SupportBotI18n = I18nInstance<SupportBotMessageKey>;

/** Create an i18n instance for a given locale. */
export const createSupportBotI18n = factory.create;

/** Create a default (English) i18n instance. */
export const getDefaultI18n = factory.getDefault;

/** Reset the shared registry (useful for testing). @internal */
export const resetI18nRegistry = factory.resetRegistry;
