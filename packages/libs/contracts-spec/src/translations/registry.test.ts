import { describe, it, expect, beforeEach } from 'bun:test";
import { TranslationRegistry } from './registry';
import type { TranslationSpec } from './spec';

// ─────────────────────────────────────────────────────────────────────────────
// Test Data
// ─────────────────────────────────────────────────────────────────────────────

const createTestSpec = (
  locale: string,
  version = '1.0.0',
  overrides?: Partial<TranslationSpec>
): TranslationSpec => ({
  meta: {
    key: 'test.messages',
    version,
    domain: 'test',
    owners: ['test'],
  },
  locale,
  fallback: locale === 'en' ? undefined : 'en',
  messages: {
    greeting: {
      value: locale === 'en' ? 'Hello' : locale === 'fr' ? 'Bonjour' : 'Hallo',
      description: 'Greeting',
    },
    farewell: {
      value:
        locale === 'en'
          ? 'Goodbye'
          : locale === 'fr'
            ? 'Au revoir'
            : 'Auf Wiedersehen',
      description: 'Farewell',
    },
  },
  ...overrides,
});

const englishSpec = createTestSpec('en');
const frenchSpec = createTestSpec('fr');
const germanSpec = createTestSpec('de');
const englishV2 = createTestSpec('en', '2.0.0', {
  messages: {
    greeting: { value: 'Hello!', description: 'Greeting v2' },
    farewell: { value: 'Bye!', description: 'Farewell v2' },
    'new.message': { value: 'New message', description: 'Added in v2' },
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Registry Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('TranslationRegistry', () => {
  let registry: TranslationRegistry;

  beforeEach(() => {
    registry = new TranslationRegistry();
  });

  describe('constructor', () => {
    it('should create empty registry', () => {
      expect(registry.list()).toHaveLength(0);
    });

    it('should initialize with provided specs', () => {
      const reg = new TranslationRegistry([englishSpec, frenchSpec]);
      expect(reg.list()).toHaveLength(2);
    });
  });

  describe('register', () => {
    it('should register a translation spec', () => {
      registry.register(englishSpec);

      expect(registry.has('test.messages', 'en')).toBe(true);
    });

    it('should track locales', () => {
      registry.register(englishSpec);
      registry.register(frenchSpec);

      expect(registry.getLocales().has('en')).toBe(true);
      expect(registry.getLocales().has('fr')).toBe(true);
    });

    it('should track domains', () => {
      registry.register(englishSpec);

      expect(registry.getDomains().has('test')).toBe(true);
    });

    it('should update latest when registering newer version', () => {
      registry.register(englishSpec);
      registry.register(englishV2);

      const latest = registry.getLatest('test.messages', 'en');
      expect(latest?.meta.version).toBe('2.0.0');
    });

    it('should not update latest when registering older version', () => {
      registry.register(englishV2);
      registry.register(englishSpec);

      const latest = registry.getLatest('test.messages', 'en');
      expect(latest?.meta.version).toBe('2.0.0');
    });
  });

  describe('get', () => {
    beforeEach(() => {
      registry.register(englishSpec);
      registry.register(englishV2);
    });

    it('should get spec by key, version, and locale', () => {
      const spec = registry.get('test.messages', '1.0.0', 'en');

      expect(spec).toBeDefined();
      expect(spec?.meta.version).toBe('1.0.0');
    });

    it('should return undefined for non-existing spec', () => {
      const spec = registry.get('nonexistent', '1.0.0', 'en');
      expect(spec).toBeUndefined();
    });

    it('should return undefined for non-existing version', () => {
      const spec = registry.get('test.messages', '99.0.0', 'en');
      expect(spec).toBeUndefined();
    });

    it('should return undefined for non-existing locale', () => {
      const spec = registry.get('test.messages', '1.0.0', 'ja');
      expect(spec).toBeUndefined();
    });
  });

  describe('getLatest', () => {
    beforeEach(() => {
      registry.register(englishSpec);
      registry.register(englishV2);
      registry.register(frenchSpec);
    });

    it('should return latest version for locale', () => {
      const spec = registry.getLatest('test.messages', 'en');

      expect(spec).toBeDefined();
      expect(spec?.meta.version).toBe('2.0.0');
    });

    it('should return undefined for non-existing locale', () => {
      const spec = registry.getLatest('test.messages', 'ja');
      expect(spec).toBeUndefined();
    });
  });

  describe('getMessage', () => {
    beforeEach(() => {
      registry.register(englishSpec);
      registry.register(englishV2);
    });

    it('should get message from latest version', () => {
      const message = registry.getMessage('test.messages', 'greeting', 'en');

      expect(message).toBeDefined();
      expect(message?.value).toBe('Hello!'); // v2 value
    });

    it('should get message from specific version', () => {
      const message = registry.getMessage(
        'test.messages',
        'greeting',
        'en',
        '1.0.0'
      );

      expect(message).toBeDefined();
      expect(message?.value).toBe('Hello'); // v1 value
    });

    it('should return undefined for non-existing message', () => {
      const message = registry.getMessage('test.messages', 'nonexistent', 'en');
      expect(message).toBeUndefined();
    });
  });

  describe('getWithFallback', () => {
    beforeEach(() => {
      registry.register(englishSpec);
      registry.register(frenchSpec);
      // French spec only has greeting and farewell, not new.message
      registry.register(englishV2); // Has new.message
    });

    it('should return message from primary locale', () => {
      const result = registry.getWithFallback(
        'test.messages',
        'greeting',
        'fr'
      );

      expect(result).toBeDefined();
      expect(result?.message.value).toBe('Bonjour');
      expect(result?.locale).toBe('fr');
      expect(result?.fromFallback).toBe(false);
    });

    it('should fallback to spec fallback locale', () => {
      // French spec has fallback: 'en', but we need a message that exists in en but not fr
      // Let's use a message that only exists in v2 English
      const greetingMessage = frenchSpec.messages['greeting'];
      if (!greetingMessage) throw new Error('Expected greeting message');
      const frenchWithMissing: TranslationSpec = {
        ...frenchSpec,
        messages: { greeting: greetingMessage },
        fallback: 'en',
      };
      registry.clear();
      registry.register(englishV2);
      registry.register(frenchWithMissing);

      const result = registry.getWithFallback(
        'test.messages',
        'new.message',
        'fr'
      );

      expect(result).toBeDefined();
      expect(result?.message.value).toBe('New message');
      expect(result?.locale).toBe('en');
      expect(result?.fromFallback).toBe(true);
    });

    it('should use explicit fallback over spec fallback', () => {
      registry.clear();
      registry.register(englishSpec);
      registry.register(frenchSpec);
      registry.register(germanSpec);

      const result = registry.getWithFallback(
        'test.messages',
        'greeting',
        'ja', // Japanese doesn't exist
        'de' // Explicit fallback to German
      );

      expect(result).toBeDefined();
      expect(result?.message.value).toBe('Hallo');
      expect(result?.locale).toBe('de');
      expect(result?.fromFallback).toBe(true);
    });

    it('should return undefined when message not found in any locale', () => {
      const result = registry.getWithFallback(
        'test.messages',
        'nonexistent',
        'en'
      );

      expect(result).toBeUndefined();
    });
  });

  describe('getValue', () => {
    beforeEach(() => {
      registry.register(englishSpec);
    });

    it('should return message value', () => {
      const value = registry.getValue('test.messages', 'greeting', 'en');
      expect(value).toBe('Hello');
    });

    it('should return fallback for missing message', () => {
      const value = registry.getValue(
        'test.messages',
        'nonexistent',
        'en',
        'Default'
      );
      expect(value).toBe('Default');
    });

    it('should return message key when no fallback provided', () => {
      const value = registry.getValue('test.messages', 'nonexistent', 'en');
      expect(value).toBe('nonexistent');
    });
  });

  describe('listLocales', () => {
    beforeEach(() => {
      registry.register(englishSpec);
      registry.register(frenchSpec);
      registry.register(germanSpec);
    });

    it('should list all locales for a spec', () => {
      const locales = registry.listLocales('test.messages');

      expect(locales).toContain('en');
      expect(locales).toContain('fr');
      expect(locales).toContain('de');
    });

    it('should return empty array for non-existing spec', () => {
      const locales = registry.listLocales('nonexistent');
      expect(locales).toHaveLength(0);
    });
  });

  describe('listByLocale', () => {
    beforeEach(() => {
      const secondSpec = createTestSpec('en', '1.0.0', {
        meta: { ...createTestSpec('en').meta, key: 'other.messages' },
      });
      registry.register(englishSpec);
      registry.register(secondSpec);
      registry.register(frenchSpec);
    });

    it('should list specs by locale', () => {
      const specs = registry.listByLocale('en');

      expect(specs).toHaveLength(2);
      expect(specs.every((s) => s.locale === 'en')).toBe(true);
    });
  });

  describe('listByDomain', () => {
    beforeEach(() => {
      const otherDomain = createTestSpec('en', '1.0.0', {
        meta: {
          ...createTestSpec('en').meta,
          key: 'other.messages',
          domain: 'other',
        },
      });
      registry.register(englishSpec);
      registry.register(otherDomain);
    });

    it('should list specs by domain', () => {
      const specs = registry.listByDomain('test');

      expect(specs).toHaveLength(1);
      expect(specs[0]?.meta.domain).toBe('test');
    });

    it('should list specs by other domain', () => {
      const specs = registry.listByDomain('other');

      expect(specs).toHaveLength(1);
      expect(specs[0]?.meta.domain).toBe('other');
    });
  });

  describe('has', () => {
    beforeEach(() => {
      registry.register(englishSpec);
    });

    it('should return true for existing spec', () => {
      expect(registry.has('test.messages', 'en')).toBe(true);
    });

    it('should return true for specific version', () => {
      expect(registry.has('test.messages', 'en', '1.0.0')).toBe(true);
    });

    it('should return false for non-existing spec', () => {
      expect(registry.has('nonexistent', 'en')).toBe(false);
    });

    it('should return false for non-existing version', () => {
      expect(registry.has('test.messages', 'en', '99.0.0')).toBe(false);
    });
  });

  describe('getStats', () => {
    beforeEach(() => {
      registry.register(englishSpec);
      registry.register(frenchSpec);
    });

    it('should return registry statistics', () => {
      const stats = registry.getStats();

      expect(stats.totalSpecs).toBe(2);
      expect(stats.locales).toContain('en');
      expect(stats.locales).toContain('fr');
      expect(stats.domains).toContain('test');
      expect(stats.totalMessages).toBe(4); // 2 messages per spec
    });
  });

  describe('clear', () => {
    it('should remove all specs', () => {
      registry.register(englishSpec);
      registry.register(frenchSpec);

      registry.clear();

      expect(registry.list()).toHaveLength(0);
      expect(registry.getLocales().size).toBe(0);
      expect(registry.getDomains().size).toBe(0);
    });
  });
});
