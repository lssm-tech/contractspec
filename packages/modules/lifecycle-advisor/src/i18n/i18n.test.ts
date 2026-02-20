import { describe, it, expect, beforeEach } from 'bun:test';
import {
  createLifecycleAdvisorI18n,
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
  it('should default to "en"', () => {
    expect(resolveLocale()).toBe('en');
  });

  it('should use optionsLocale when provided', () => {
    expect(resolveLocale('fr')).toBe('fr');
  });

  it('should prefer runtimeLocale over optionsLocale', () => {
    expect(resolveLocale('fr', 'es')).toBe('es');
  });

  it('should fall back to base language for regional variants', () => {
    expect(resolveLocale('fr-CA')).toBe('fr');
  });

  it('should fall back to DEFAULT_LOCALE for unsupported locales', () => {
    expect(resolveLocale('de')).toBe('en');
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
// Translation
// =============================================================================

describe('createLifecycleAdvisorI18n', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should create an i18n instance with default locale', () => {
    const i18n = createLifecycleAdvisorI18n();
    expect(i18n.locale).toBe('en');
  });

  it('should create an i18n instance with options locale', () => {
    const i18n = createLifecycleAdvisorI18n('fr');
    expect(i18n.locale).toBe('fr');
  });
});

describe('t() - English', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return English focus areas', () => {
    const i18n = createLifecycleAdvisorI18n('en');
    expect(i18n.t('playbook.stage0.focus.0')).toBe('Discovery');
    expect(i18n.t('playbook.stage3.focus.0')).toBe('Retention');
  });

  it('should return English action titles', () => {
    const i18n = createLifecycleAdvisorI18n('en');
    expect(i18n.t('playbook.stage0.action0.title')).toBe(
      'Run a 5-day interview burst'
    );
    expect(i18n.t('playbook.stage4.action0.title')).toBe(
      'Codify a growth loop'
    );
  });

  it('should return English ceremony titles', () => {
    const i18n = createLifecycleAdvisorI18n('en');
    expect(i18n.t('ceremony.stage0.title')).toBe('Discovery Spark');
    expect(i18n.t('ceremony.stage6.title')).toBe('Renewal Summit');
  });

  it('should return English library descriptions', () => {
    const i18n = createLifecycleAdvisorI18n('en');
    expect(i18n.t('library.stage0.item0')).toBe(
      'Summarize interviews and synthesize IC insights.'
    );
  });

  it('should interpolate placeholders', () => {
    const i18n = createLifecycleAdvisorI18n('en');
    expect(i18n.t('engine.fallbackAction.title', { focus: 'Retention' })).toBe(
      'Advance Retention'
    );
    expect(
      i18n.t('engine.fallbackAction.description', { focus: 'Growth' })
    ).toBe('Identify one task that will improve "Growth" this week.');
  });

  it('should return the key itself for unknown keys', () => {
    const i18n = createLifecycleAdvisorI18n('en');
    expect(i18n.t('nonexistent.key')).toBe('nonexistent.key');
  });
});

describe('t() - French', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return French focus areas', () => {
    const i18n = createLifecycleAdvisorI18n('fr');
    expect(i18n.t('playbook.stage0.focus.0')).toBe('D\u00e9couverte');
    expect(i18n.t('playbook.stage3.focus.0')).toBe('R\u00e9tention');
  });

  it('should return French action titles', () => {
    const i18n = createLifecycleAdvisorI18n('fr');
    expect(i18n.t('playbook.stage0.action0.title')).toContain('entretiens');
    expect(i18n.t('playbook.stage4.action0.title')).toContain('croissance');
  });

  it('should return French ceremony titles', () => {
    const i18n = createLifecycleAdvisorI18n('fr');
    expect(i18n.t('ceremony.stage0.title')).toContain('d\u00e9couverte');
  });

  it('should interpolate French fallback templates', () => {
    const i18n = createLifecycleAdvisorI18n('fr');
    expect(
      i18n.t('engine.fallbackAction.title', { focus: 'R\u00e9tention' })
    ).toBe('Avancer sur R\u00e9tention');
  });
});

describe('t() - Spanish', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return Spanish focus areas', () => {
    const i18n = createLifecycleAdvisorI18n('es');
    expect(i18n.t('playbook.stage0.focus.0')).toBe('Descubrimiento');
    expect(i18n.t('playbook.stage3.focus.0')).toBe('Retenci\u00f3n');
  });

  it('should return Spanish ceremony titles', () => {
    const i18n = createLifecycleAdvisorI18n('es');
    expect(i18n.t('ceremony.stage6.title')).toContain('renovaci\u00f3n');
  });

  it('should interpolate Spanish fallback templates', () => {
    const i18n = createLifecycleAdvisorI18n('es');
    expect(
      i18n.t('engine.fallbackAction.title', { focus: 'Retenci\u00f3n' })
    ).toBe('Avanzar en Retenci\u00f3n');
  });
});

describe('getDefaultI18n', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return an English i18n instance', () => {
    const i18n = getDefaultI18n();
    expect(i18n.locale).toBe('en');
  });
});

// =============================================================================
// Catalog Completeness
// =============================================================================

describe('catalog completeness', () => {
  const allKeys = Object.keys(I18N_KEYS);

  it('should have all keys in English catalog', () => {
    const enKeys = Object.keys(enMessages.messages);
    for (const key of allKeys) {
      expect(enKeys).toContain(key);
    }
  });

  it('should have all keys in French catalog', () => {
    const frKeys = Object.keys(frMessages.messages);
    for (const key of allKeys) {
      expect(frKeys).toContain(key);
    }
  });

  it('should have all keys in Spanish catalog', () => {
    const esKeys = Object.keys(esMessages.messages);
    for (const key of allKeys) {
      expect(esKeys).toContain(key);
    }
  });

  it('should have matching key counts across all catalogs', () => {
    const enCount = Object.keys(enMessages.messages).length;
    const frCount = Object.keys(frMessages.messages).length;
    const esCount = Object.keys(esMessages.messages).length;

    expect(enCount).toBe(frCount);
    expect(enCount).toBe(esCount);
    expect(enCount).toBe(allKeys.length);
  });

  it('should have exactly 79 keys', () => {
    expect(allKeys).toHaveLength(79);
  });
});
