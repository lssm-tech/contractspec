import { describe, it, expect, beforeEach } from 'bun:test';
import {
  createSupportBotI18n,
  getDefaultI18n,
  resetI18nRegistry,
  interpolate,
} from './messages';
import {
  resolveLocale,
  isSupportedLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from './locale';
import { I18N_KEYS } from './keys';
import { enMessages } from './catalogs/en';
import { frMessages } from './catalogs/fr';
import { esMessages } from './catalogs/es';

// =============================================================================
// Locale Resolution
// =============================================================================

describe('resolveLocale', () => {
  it('should default to "en" when no locale is provided', () => {
    expect(resolveLocale()).toBe('en');
    expect(resolveLocale(undefined, undefined)).toBe('en');
  });

  it('should use optionsLocale when provided', () => {
    expect(resolveLocale('fr')).toBe('fr');
    expect(resolveLocale('es')).toBe('es');
  });

  it('should prefer runtimeLocale over optionsLocale', () => {
    expect(resolveLocale('fr', 'es')).toBe('es');
    expect(resolveLocale('en', 'fr')).toBe('fr');
  });

  it('should fall back to base language for regional variants', () => {
    expect(resolveLocale('fr-CA')).toBe('fr');
    expect(resolveLocale('es-MX')).toBe('es');
    expect(resolveLocale('en-US')).toBe('en');
  });

  it('should fall back to DEFAULT_LOCALE for unsupported locales', () => {
    expect(resolveLocale('de')).toBe('en');
    expect(resolveLocale('ja')).toBe('en');
    expect(resolveLocale('zh-CN')).toBe('en');
  });
});

describe('isSupportedLocale', () => {
  it('should return true for supported locales', () => {
    expect(isSupportedLocale('en')).toBe(true);
    expect(isSupportedLocale('fr')).toBe(true);
    expect(isSupportedLocale('es')).toBe(true);
  });

  it('should return false for unsupported locales', () => {
    expect(isSupportedLocale('de')).toBe(false);
    expect(isSupportedLocale('ja')).toBe(false);
    expect(isSupportedLocale('fr-CA')).toBe(false);
  });
});

describe('DEFAULT_LOCALE', () => {
  it('should be "en"', () => {
    expect(DEFAULT_LOCALE).toBe('en');
  });
});

describe('SUPPORTED_LOCALES', () => {
  it('should contain en, fr, es', () => {
    expect(SUPPORTED_LOCALES).toContain('en');
    expect(SUPPORTED_LOCALES).toContain('fr');
    expect(SUPPORTED_LOCALES).toContain('es');
    expect(SUPPORTED_LOCALES).toHaveLength(3);
  });
});

// =============================================================================
// Interpolation
// =============================================================================

describe('interpolate', () => {
  it('should return template unchanged when no params', () => {
    expect(interpolate('Hello world')).toBe('Hello world');
    expect(interpolate('Hello world', undefined)).toBe('Hello world');
  });

  it('should replace single placeholder', () => {
    expect(interpolate('Hi {name},', { name: 'Alice' })).toBe('Hi Alice,');
  });

  it('should replace multiple placeholders', () => {
    expect(
      interpolate('Subject: {subject} Channel: {channel}', {
        subject: 'Billing',
        channel: 'email',
      })
    ).toBe('Subject: Billing Channel: email');
  });

  it('should leave unmatched placeholders as-is', () => {
    expect(interpolate('{a} and {b}', { a: 'X' })).toBe('X and {b}');
  });

  it('should handle numeric values', () => {
    expect(interpolate('Source {index}', { index: 3 })).toBe('Source 3');
  });
});

// =============================================================================
// Translation (t function)
// =============================================================================

describe('createSupportBotI18n', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should create an i18n instance with default locale', () => {
    const i18n = createSupportBotI18n();
    expect(i18n.locale).toBe('en');
  });

  it('should create an i18n instance with options locale', () => {
    const i18n = createSupportBotI18n('fr');
    expect(i18n.locale).toBe('fr');
  });

  it('should prefer runtime locale over options locale', () => {
    const i18n = createSupportBotI18n('fr', 'es');
    expect(i18n.locale).toBe('es');
  });
});

describe('t() - English', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return English strings by default', () => {
    const i18n = createSupportBotI18n('en');
    expect(i18n.t('responder.greeting.anonymous')).toBe('Hi there,');
    expect(i18n.t('responder.signature')).toBe('\u2014 ContractSpec Support');
    expect(i18n.t('error.ticketMissingId')).toBe('Ticket is missing id');
  });

  it('should interpolate placeholders', () => {
    const i18n = createSupportBotI18n('en');
    const result = i18n.t('responder.greeting.named', { name: 'Alice' });
    expect(result).toBe('Hi Alice,');
  });

  it('should interpolate subject in intro', () => {
    const i18n = createSupportBotI18n('en');
    const result = i18n.t('responder.intro.thanks', {
      subject: 'Login issue',
    });
    expect(result).toBe('Thanks for contacting us about "Login issue".');
  });

  it('should interpolate reply prefix', () => {
    const i18n = createSupportBotI18n('en');
    const result = i18n.t('responder.subject.replyPrefix', {
      subject: 'Billing',
    });
    expect(result).toBe('Re: Billing');
  });

  it('should interpolate source label with number', () => {
    const i18n = createSupportBotI18n('en');
    const result = i18n.t('responder.references.sourceLabel', { index: 2 });
    expect(result).toBe('Source 2');
  });

  it('should leave unmatched placeholders as-is', () => {
    const i18n = createSupportBotI18n('en');
    const result = i18n.t('resolver.question.subjectLabel');
    expect(result).toContain('{subject}');
  });

  it('should return the key itself for unknown keys', () => {
    const i18n = createSupportBotI18n('en');
    const result = i18n.t('nonexistent.key');
    expect(result).toBe('nonexistent.key');
  });
});

describe('t() - French', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return French strings', () => {
    const i18n = createSupportBotI18n('fr');
    expect(i18n.t('responder.greeting.anonymous')).toBe('Bonjour,');
    expect(i18n.t('responder.signature')).toBe('\u2014 Support ContractSpec');
  });

  it('should interpolate placeholders in French', () => {
    const i18n = createSupportBotI18n('fr');
    const result = i18n.t('responder.greeting.named', { name: 'Marie' });
    expect(result).toBe('Bonjour Marie,');
  });

  it('should interpolate subject in French intro', () => {
    const i18n = createSupportBotI18n('fr');
    const result = i18n.t('responder.intro.thanks', {
      subject: 'Facturation',
    });
    expect(result).toContain('Facturation');
    expect(result).toContain('contact\u00e9s');
  });

  it('should translate category intros', () => {
    const i18n = createSupportBotI18n('fr');
    expect(i18n.t('responder.category.billing')).toContain('facturation');
    expect(i18n.t('responder.category.technical')).toContain('technique');
  });
});

describe('t() - Spanish', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return Spanish strings', () => {
    const i18n = createSupportBotI18n('es');
    expect(i18n.t('responder.greeting.anonymous')).toBe('Hola,');
    expect(i18n.t('responder.signature')).toBe('\u2014 Soporte ContractSpec');
  });

  it('should interpolate placeholders in Spanish', () => {
    const i18n = createSupportBotI18n('es');
    const result = i18n.t('responder.greeting.named', { name: 'Carlos' });
    expect(result).toBe('Hola Carlos,');
  });

  it('should interpolate subject in Spanish intro', () => {
    const i18n = createSupportBotI18n('es');
    const result = i18n.t('responder.intro.thanks', {
      subject: 'Facturaci\u00f3n',
    });
    expect(result).toContain('Facturaci\u00f3n');
    expect(result).toContain('contactarnos');
  });

  it('should translate category intros', () => {
    const i18n = createSupportBotI18n('es');
    expect(i18n.t('responder.category.billing')).toContain('facturaci\u00f3n');
    expect(i18n.t('responder.category.technical')).toContain('t\u00e9cnico');
  });
});

describe('getDefaultI18n', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return an English i18n instance', () => {
    const i18n = getDefaultI18n();
    expect(i18n.locale).toBe('en');
    expect(i18n.t('responder.greeting.anonymous')).toBe('Hi there,');
  });
});

// =============================================================================
// Catalog Completeness
// =============================================================================

describe('catalog completeness', () => {
  const allKeys = Object.keys(I18N_KEYS);

  it('should have all keys defined in English catalog', () => {
    const enKeys = Object.keys(enMessages.messages);
    for (const key of allKeys) {
      expect(enKeys).toContain(key);
    }
  });

  it('should have all keys defined in French catalog', () => {
    const frKeys = Object.keys(frMessages.messages);
    for (const key of allKeys) {
      expect(frKeys).toContain(key);
    }
  });

  it('should have all keys defined in Spanish catalog', () => {
    const esKeys = Object.keys(esMessages.messages);
    for (const key of allKeys) {
      expect(esKeys).toContain(key);
    }
  });

  it('should have the same number of keys in all catalogs', () => {
    const enCount = Object.keys(enMessages.messages).length;
    const frCount = Object.keys(frMessages.messages).length;
    const esCount = Object.keys(esMessages.messages).length;

    expect(enCount).toBe(frCount);
    expect(enCount).toBe(esCount);
    expect(enCount).toBe(allKeys.length);
  });
});
