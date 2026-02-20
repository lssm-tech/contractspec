import { describe, it, expect, beforeEach } from 'bun:test';
import {
  createLifecycleCoreI18n,
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

describe('createLifecycleCoreI18n', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should create an i18n instance with default locale', () => {
    const i18n = createLifecycleCoreI18n();
    expect(i18n.locale).toBe('en');
  });

  it('should create an i18n instance with options locale', () => {
    const i18n = createLifecycleCoreI18n('fr');
    expect(i18n.locale).toBe('fr');
  });
});

describe('t() - English', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return English milestone titles', () => {
    const i18n = createLifecycleCoreI18n('en');
    expect(i18n.t('milestone.stage0ProblemStatement.title')).toBe(
      'Write the pain statement'
    );
    expect(i18n.t('milestone.stage4GrowthLoop.title')).toBe(
      'Install a growth loop'
    );
  });

  it('should return English milestone descriptions', () => {
    const i18n = createLifecycleCoreI18n('en');
    expect(i18n.t('milestone.stage2Activation.description')).toBe(
      'Define the minimum steps required for a new user to succeed.'
    );
  });

  it('should return English action items', () => {
    const i18n = createLifecycleCoreI18n('en');
    expect(i18n.t('milestone.stage0ProblemStatement.action.0')).toBe(
      'Interview at least 5 ideal customers'
    );
  });

  it('should return the key itself for unknown keys', () => {
    const i18n = createLifecycleCoreI18n('en');
    expect(i18n.t('nonexistent.key')).toBe('nonexistent.key');
  });
});

describe('t() - French', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return French milestone titles', () => {
    const i18n = createLifecycleCoreI18n('fr');
    expect(i18n.t('milestone.stage0ProblemStatement.title')).toContain(
      'probl\u00e8me'
    );
    expect(i18n.t('milestone.stage4GrowthLoop.title')).toContain(
      'boucle de croissance'
    );
  });
});

describe('t() - Spanish', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return Spanish milestone titles', () => {
    const i18n = createLifecycleCoreI18n('es');
    expect(i18n.t('milestone.stage0ProblemStatement.title')).toContain(
      'problema'
    );
    expect(i18n.t('milestone.stage6RenewalOps.title')).toContain(
      'renovaci\u00f3n'
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
});
