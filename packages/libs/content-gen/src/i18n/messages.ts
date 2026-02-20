/**
 * Translation helper for the content-gen package.
 * @module i18n/messages
 */

import {
  createI18nFactory,
  type I18nInstance,
} from '@contractspec/lib.contracts-spec/translations';
import { enMessages } from './catalogs/en';
import { frMessages } from './catalogs/fr';
import { esMessages } from './catalogs/es';
import type { ContentGenMessageKey } from './keys';

const factory = createI18nFactory<ContentGenMessageKey>({
  specKey: 'content-gen.messages',
  catalogs: [enMessages, frMessages, esMessages],
});

/** I18n instance type for the content-gen package. */
export type ContentGenI18n = I18nInstance<ContentGenMessageKey>;

/** Create an i18n instance for a given locale. */
export const createContentGenI18n = factory.create;

/** Create a default (English) i18n instance. */
export const getDefaultI18n = factory.getDefault;

/** Reset the shared registry (useful for testing). @internal */
export const resetI18nRegistry = factory.resetRegistry;
