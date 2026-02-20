/**
 * Translation helper for the lifecycle-core package.
 * @module i18n/messages
 */

import {
  createI18nFactory,
  type I18nInstance,
} from '@contractspec/lib.contracts-spec/translations';
import { enMessages } from './catalogs/en';
import { frMessages } from './catalogs/fr';
import { esMessages } from './catalogs/es';
import type { LifecycleCoreMessageKey } from './keys';

const factory = createI18nFactory<LifecycleCoreMessageKey>({
  specKey: 'lifecycle-core.messages',
  catalogs: [enMessages, frMessages, esMessages],
});

/** I18n instance type for the lifecycle-core package. */
export type LifecycleCoreI18n = I18nInstance<LifecycleCoreMessageKey>;

/** Create an i18n instance for a given locale. */
export const createLifecycleCoreI18n = factory.create;

/** Create a default (English) i18n instance. */
export const getDefaultI18n = factory.getDefault;

/** Reset the shared registry (useful for testing). @internal */
export const resetI18nRegistry = factory.resetRegistry;
