import { describe, it, expect, beforeEach } from 'bun:test';
import {
  createImageGenI18n,
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
// Translation (t function)
// =============================================================================

describe('createImageGenI18n', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should create an i18n instance with default locale', () => {
    const i18n = createImageGenI18n();
    expect(i18n.locale).toBe('en');
  });

  it('should create an i18n instance with options locale', () => {
    const i18n = createImageGenI18n('fr');
    expect(i18n.locale).toBe('fr');
  });

  it('should prefer runtime locale over options locale', () => {
    const i18n = createImageGenI18n('fr', 'es');
    expect(i18n.locale).toBe('es');
  });
});

describe('t() - English', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return English strings by default', () => {
    const i18n = createImageGenI18n('en');
    expect(i18n.t('image.error.noProvider')).toBe(
      'No image provider configured'
    );
    expect(i18n.t('image.error.generationFailed')).toBe(
      'Image generation failed'
    );
    expect(i18n.t('purpose.blogHero')).toBe('Blog hero image');
  });

  it('should interpolate placeholders', () => {
    const i18n = createImageGenI18n('en');
    const result = i18n.t('image.generate.description', {
      style: 'photorealistic',
      purpose: 'blog-hero',
    });
    expect(result).toBe('Generate a photorealistic image for blog-hero');
  });

  it('should interpolate featuring placeholder', () => {
    const i18n = createImageGenI18n('en');
    const result = i18n.t('image.prompt.featuring', {
      solutions: 'AI, automation',
    });
    expect(result).toBe('featuring AI, automation');
  });

  it('should interpolate industry context placeholder', () => {
    const i18n = createImageGenI18n('en');
    const result = i18n.t('image.prompt.industryContext', {
      industry: 'fintech',
    });
    expect(result).toBe('fintech context');
  });

  it('should return the key itself for unknown keys', () => {
    const i18n = createImageGenI18n('en');
    const result = i18n.t('nonexistent.key');
    expect(result).toBe('nonexistent.key');
  });
});

describe('t() - French', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return French strings', () => {
    const i18n = createImageGenI18n('fr');
    expect(i18n.t('image.error.noProvider')).toBe(
      "Aucun fournisseur d'images configuré"
    );
    expect(i18n.t('purpose.videoThumbnail')).toBe('Miniature vidéo');
  });

  it('should interpolate placeholders in French', () => {
    const i18n = createImageGenI18n('fr');
    const result = i18n.t('image.prompt.featuring', {
      solutions: 'IA, automatisation',
    });
    expect(result).toBe('mettant en avant IA, automatisation');
  });
});

describe('t() - Spanish', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return Spanish strings', () => {
    const i18n = createImageGenI18n('es');
    expect(i18n.t('image.error.generationFailed')).toBe(
      'La generación de imagen falló'
    );
    expect(i18n.t('purpose.icon')).toBe('Icono');
  });

  it('should interpolate placeholders in Spanish', () => {
    const i18n = createImageGenI18n('es');
    const result = i18n.t('image.prompt.industryContext', {
      industry: 'fintech',
    });
    expect(result).toBe('contexto de fintech');
  });
});

describe('getDefaultI18n', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return an English i18n instance', () => {
    const i18n = getDefaultI18n();
    expect(i18n.locale).toBe('en');
    expect(i18n.t('purpose.blogHero')).toBe('Blog hero image');
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
