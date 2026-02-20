/**
 * Translation helper for the notifications package.
 * @module i18n/messages
 */

import {
  createI18nFactory,
  type I18nInstance,
} from '@contractspec/lib.contracts-spec/translations';
import { enMessages } from './catalogs/en';
import { frMessages } from './catalogs/fr';
import { esMessages } from './catalogs/es';
import type { NotificationsMessageKey } from './keys';

const factory = createI18nFactory<NotificationsMessageKey>({
  specKey: 'notifications.messages',
  catalogs: [enMessages, frMessages, esMessages],
});

/** I18n instance type for the notifications package. */
export type NotificationsI18n = I18nInstance<NotificationsMessageKey>;

/** Create an i18n instance for a given locale. */
export const createNotificationsI18n = factory.create;

/** Create a default (English) i18n instance. */
export const getDefaultI18n = factory.getDefault;

/** Reset the shared registry (useful for testing). @internal */
export const resetI18nRegistry = factory.resetRegistry;
