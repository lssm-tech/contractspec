import { describe, it, expect, beforeEach } from 'bun:test';
import {
  createLearningJourneyI18n,
  getDefaultI18n,
  resetI18nRegistry,
} from './messages';
import { resolveLocale, isSupportedLocale, SUPPORTED_LOCALES } from './locale';
import { I18N_KEYS } from './keys';
import { enMessages } from './catalogs/en';
import { frMessages } from './catalogs/fr';
import { esMessages } from './catalogs/es';
import { getXpSourceLabel } from '../engines/xp';

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
    expect(resolveLocale('es-MX')).toBe('es');
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

describe('createLearningJourneyI18n', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should create an i18n instance with default locale', () => {
    const i18n = createLearningJourneyI18n();
    expect(i18n.locale).toBe('en');
  });

  it('should create an i18n instance with options locale', () => {
    const i18n = createLearningJourneyI18n('es');
    expect(i18n.locale).toBe('es');
  });
});

describe('t() - English', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return English XP source labels', () => {
    const i18n = createLearningJourneyI18n('en');
    expect(i18n.t('xp.source.base')).toBe('Base');
    expect(i18n.t('xp.source.scoreBonus')).toBe('Score Bonus');
    expect(i18n.t('xp.source.perfectScore')).toBe('Perfect Score');
    expect(i18n.t('xp.source.firstAttempt')).toBe('First Attempt');
    expect(i18n.t('xp.source.retryPenalty')).toBe('Retry Penalty');
    expect(i18n.t('xp.source.streakBonus')).toBe('Streak Bonus');
  });

  it('should return the key itself for unknown keys', () => {
    const i18n = createLearningJourneyI18n('en');
    expect(i18n.t('nonexistent.key')).toBe('nonexistent.key');
  });
});

describe('t() - French', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return French XP source labels', () => {
    const i18n = createLearningJourneyI18n('fr');
    expect(i18n.t('xp.source.scoreBonus')).toBe('Bonus de score');
    expect(i18n.t('xp.source.streakBonus')).toBe('Bonus de s\u00e9rie');
  });
});

describe('t() - Spanish', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return Spanish XP source labels', () => {
    const i18n = createLearningJourneyI18n('es');
    expect(i18n.t('xp.source.firstAttempt')).toBe('Primer intento');
    expect(i18n.t('xp.source.streakBonus')).toBe('Bonificaci\u00f3n por racha');
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
// XP Source Label Helper
// =============================================================================

describe('getXpSourceLabel', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return English labels by default', () => {
    expect(getXpSourceLabel('base')).toBe('Base');
    expect(getXpSourceLabel('streak_bonus')).toBe('Streak Bonus');
  });

  it('should return French labels', () => {
    expect(getXpSourceLabel('score_bonus', 'fr')).toBe('Bonus de score');
  });

  it('should return Spanish labels', () => {
    expect(getXpSourceLabel('first_attempt', 'es')).toBe('Primer intento');
  });

  it('should return the source key for unknown sources', () => {
    expect(getXpSourceLabel('unknown_source')).toBe('unknown_source');
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

  it('should have exactly 6 keys', () => {
    expect(allKeys).toHaveLength(6);
  });
});
