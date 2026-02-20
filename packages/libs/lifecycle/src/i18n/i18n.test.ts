import { describe, it, expect, beforeEach } from 'bun:test';
import {
  createLifecycleI18n,
  getDefaultI18n,
  resetI18nRegistry,
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
// Translation (t function)
// =============================================================================

describe('createLifecycleI18n', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should create an i18n instance with default locale', () => {
    const i18n = createLifecycleI18n();
    expect(i18n.locale).toBe('en');
  });

  it('should create an i18n instance with options locale', () => {
    const i18n = createLifecycleI18n('fr');
    expect(i18n.locale).toBe('fr');
  });

  it('should prefer runtime locale over options locale', () => {
    const i18n = createLifecycleI18n('fr', 'es');
    expect(i18n.locale).toBe('es');
  });
});

describe('t() - English stage names', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return English stage names', () => {
    const i18n = createLifecycleI18n('en');
    expect(i18n.t('stage.exploration.name')).toBe('Exploration / Ideation');
    expect(i18n.t('stage.productMarketFit.name')).toBe(
      'Product\u2013Market Fit'
    );
    expect(i18n.t('stage.maturityRenewal.name')).toBe('Maturity / Renewal');
  });

  it('should return English stage questions', () => {
    const i18n = createLifecycleI18n('en');
    expect(i18n.t('stage.exploration.question')).toBe(
      'Is there a problem worth my time?'
    );
    expect(i18n.t('stage.growthScaleUp.question')).toBe(
      'Can we grow this repeatably?'
    );
  });

  it('should return English signals', () => {
    const i18n = createLifecycleI18n('en');
    expect(i18n.t('stage.exploration.signal.0')).toBe(
      '20+ discovery interviews'
    );
    expect(i18n.t('stage.productMarketFit.signal.1')).toBe(
      'Organic word-of-mouth'
    );
  });

  it('should interpolate formatter placeholders', () => {
    const i18n = createLifecycleI18n('en');
    const result = i18n.t('formatter.stageTitle', {
      order: 0,
      name: 'Exploration / Ideation',
    });
    expect(result).toBe('Stage 0 \u00b7 Exploration / Ideation');
  });

  it('should return the key itself for unknown keys', () => {
    const i18n = createLifecycleI18n('en');
    expect(i18n.t('nonexistent.key')).toBe('nonexistent.key');
  });
});

describe('t() - French', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return French stage names', () => {
    const i18n = createLifecycleI18n('fr');
    expect(i18n.t('stage.exploration.name')).toBe(
      'Exploration / Id\u00e9ation'
    );
    expect(i18n.t('stage.maturityRenewal.name')).toBe(
      'Maturit\u00e9 / Renouvellement'
    );
  });

  it('should return French formatter strings', () => {
    const i18n = createLifecycleI18n('fr');
    expect(i18n.t('formatter.axis.product', { phase: 'MVP' })).toBe(
      'Produit : MVP'
    );
    expect(i18n.t('formatter.action.fallback')).toBe(
      'Concentrez-vous sur les prochains jalons.'
    );
  });
});

describe('t() - Spanish', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return Spanish stage names', () => {
    const i18n = createLifecycleI18n('es');
    expect(i18n.t('stage.exploration.name')).toBe(
      'Exploraci\u00f3n / Ideaci\u00f3n'
    );
    expect(i18n.t('stage.growthScaleUp.name')).toBe(
      'Crecimiento / Escalamiento'
    );
  });

  it('should return Spanish formatter strings', () => {
    const i18n = createLifecycleI18n('es');
    expect(i18n.t('formatter.axis.capital', { phase: 'Seed' })).toBe(
      'Capital: Seed'
    );
    expect(i18n.t('formatter.action.fallback')).toBe(
      'Conc\u00e9ntrese en los pr\u00f3ximos hitos.'
    );
  });
});

describe('getDefaultI18n', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return an English i18n instance', () => {
    const i18n = getDefaultI18n();
    expect(i18n.locale).toBe('en');
    expect(i18n.t('stage.exploration.name')).toBe('Exploration / Ideation');
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
