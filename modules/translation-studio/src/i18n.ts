import i18n from 'i18next';
// import Backend from 'i18next-http-backend';
import enCommon from './locales/en/common.json';
import enModules from './locales/en/modules.json';
import enLanding from './locales/en/appLanding.json';
import enRoommate from './locales/en/roommate.json';
import enSeller from './locales/en/seller.json';
import enEmails from './locales/en/emails.json';
import frCommon from './locales/fr/common.json';
import frModules from './locales/fr/modules.json';
import frLanding from './locales/fr/appLanding.json';
import frRoommate from './locales/fr/roommate.json';
import frSeller from './locales/fr/seller.json';
import frEmails from './locales/fr/emails.json';

const i18nNamespaces = [
  'common' as const,
  'modules' as const,
  'appLanding' as const,
  'roommate' as const,
  'seller' as const,
  'emails' as const,
];
export type I18nNamespaces = typeof i18nNamespaces;
export type I18nNamespace = I18nNamespaces[number];

export const resources = {
  en: {
    common: enCommon,
    modules: enModules,
    appLanding: enLanding,
    roommate: enRoommate,
    seller: enSeller,
    emails: enEmails,
  },
  fr: {
    common: frCommon,
    modules: frModules,
    appLanding: frLanding,
    roommate: frRoommate,
    seller: frSeller,
    emails: frEmails,
  },
} satisfies Record<string, Record<I18nNamespace, Record<string, unknown>>>;

void i18n
  // .use(initReactI18next)
  // .use(LanguageDetector)
  // .use(Backend)
  .init({
    compatibilityJSON: 'v4',
    resources,
    lng: 'fr',
    fallbackLng: 'fr',
    debug: false,
    ns: i18nNamespaces,
    interpolation: {
      escapeValue: false,
    },
  });

export type { TFunction } from 'i18next';
export { i18n };
