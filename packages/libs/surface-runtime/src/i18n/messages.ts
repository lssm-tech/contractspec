import {
  createI18nFactory,
  type I18nInstance,
} from '@contractspec/lib.contracts-spec/translations';
import { enMessages } from './catalogs/en';
import { frMessages } from './catalogs/fr';
import { esMessages } from './catalogs/es';
import type { SurfaceMessageKey } from './keys';

const factory = createI18nFactory<SurfaceMessageKey>({
  specKey: 'surface-runtime.messages',
  catalogs: [enMessages, frMessages, esMessages],
});

export type SurfaceI18n = I18nInstance<SurfaceMessageKey>;
export const createSurfaceI18n = factory.create;
export const getDefaultSurfaceI18n = factory.getDefault;
