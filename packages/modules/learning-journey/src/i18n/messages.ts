/**
 * Translation helper for the learning-journey package.
 * @module i18n/messages
 */

import {
  createI18nFactory,
  type I18nInstance,
} from '@contractspec/lib.contracts-spec/translations';
import { enMessages } from './catalogs/en';
import { frMessages } from './catalogs/fr';
import { esMessages } from './catalogs/es';
import type { LearningJourneyMessageKey } from './keys';

const factory = createI18nFactory<LearningJourneyMessageKey>({
  specKey: 'learning-journey.messages',
  catalogs: [enMessages, frMessages, esMessages],
});

/** I18n instance type for the learning-journey package. */
export type LearningJourneyI18n = I18nInstance<LearningJourneyMessageKey>;

/** Create an i18n instance for a given locale. */
export const createLearningJourneyI18n = factory.create;

/** Create a default (English) i18n instance. */
export const getDefaultI18n = factory.getDefault;

/** Reset the shared registry (useful for testing). @internal */
export const resetI18nRegistry = factory.resetRegistry;
