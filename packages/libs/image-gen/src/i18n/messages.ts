/**
 * Translation helper for the image-gen package.
 * @module i18n/messages
 */

import {
  createI18nFactory,
  type I18nInstance,
} from '@contractspec/lib.contracts-spec/translations';
import { enMessages } from './catalogs/en';
import { frMessages } from './catalogs/fr';
import { esMessages } from './catalogs/es';
import type { ImageGenMessageKey } from './keys';

const factory = createI18nFactory<ImageGenMessageKey>({
  specKey: 'image-gen.messages',
  catalogs: [enMessages, frMessages, esMessages],
});

/** I18n instance type for the image-gen package. */
export type ImageGenI18n = I18nInstance<ImageGenMessageKey>;

/** Create an i18n instance for a given locale. */
export const createImageGenI18n = factory.create;

/** Create a default (English) i18n instance. */
export const getDefaultI18n = factory.getDefault;

/** Reset the shared registry (useful for testing). @internal */
export const resetI18nRegistry = factory.resetRegistry;
