import { describe, it, expect } from 'vitest';
import {
  validateTranslationSpec,
  validateICUFormat,
  findMissingTranslations,
  findAllMissingTranslations,
  validateTranslationRegistry,
  assertTranslationSpecValid,
  TranslationValidationError,
} from './validation';
import { TranslationRegistry } from './registry';
import type { TranslationSpec } from './spec';

// ─────────────────────────────────────────────────────────────────────────────
// Test Data
// ─────────────────────────────────────────────────────────────────────────────

const validSpec: TranslationSpec = {
  meta: {
    key: 'test.messages',
    version: '1.0.0',
    domain: 'test',
    owners: ['test'],
  },
  locale: 'en',
  messages: {
    greeting: {
      value: 'Hello, {name}!',
      description: 'Greeting message',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    count: {
      value: '{count, plural, one {1 item} other {{count} items}}',
      description: 'Item count',
      placeholders: [{ name: 'count', type: 'plural' }],
    },
  },
  pluralRules: [
    {
      variable: 'count',
      rules: [
        { category: 'one', value: '1 item' },
        { category: 'other', value: '{count} items' },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// validateTranslationSpec Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('validateTranslationSpec', () => {
  it('should pass for valid spec', () => {
    const result = validateTranslationSpec(validSpec);

    expect(result.valid).toBe(true);
    expect(result.issues.filter((i) => i.level === 'error')).toHaveLength(0);
  });

  describe('meta validation', () => {
    it('should error on missing key', () => {
      const spec: TranslationSpec = {
        ...validSpec,
        meta: { ...validSpec.meta, key: '' },
      };

      const result = validateTranslationSpec(spec);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          path: 'meta.key',
        })
      );
    });

    it('should error on missing version', () => {
      const spec: TranslationSpec = {
        ...validSpec,
        meta: { ...validSpec.meta, version: '' },
      };

      const result = validateTranslationSpec(spec);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          path: 'meta.version',
        })
      );
    });

    it('should error on missing domain', () => {
      const spec: TranslationSpec = {
        ...validSpec,
        meta: { ...validSpec.meta, domain: '' },
      };

      const result = validateTranslationSpec(spec);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          path: 'meta.domain',
        })
      );
    });

    it('should warn on missing owners', () => {
      const spec: TranslationSpec = {
        ...validSpec,
        meta: { ...validSpec.meta, owners: [] },
      };

      const result = validateTranslationSpec(spec);

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'warning',
          path: 'meta.owners',
        })
      );
    });
  });

  describe('locale validation', () => {
    it('should error on missing locale', () => {
      const spec: TranslationSpec = {
        ...validSpec,
        locale: '',
      };

      const result = validateTranslationSpec(spec);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          path: 'locale',
        })
      );
    });

    it('should warn on invalid locale format', () => {
      const spec: TranslationSpec = {
        ...validSpec,
        locale: 'english',
      };

      const result = validateTranslationSpec(spec);

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'warning',
          path: 'locale',
        })
      );
    });

    it('should accept valid locale formats', () => {
      const spec1: TranslationSpec = { ...validSpec, locale: 'en' };
      const spec2: TranslationSpec = { ...validSpec, locale: 'en-US' };

      expect(
        validateTranslationSpec(spec1).issues.filter(
          (i) => i.path === 'locale' && i.level === 'warning'
        )
      ).toHaveLength(0);
      expect(
        validateTranslationSpec(spec2).issues.filter(
          (i) => i.path === 'locale' && i.level === 'warning'
        )
      ).toHaveLength(0);
    });

    it('should warn when fallback equals locale', () => {
      const spec: TranslationSpec = {
        ...validSpec,
        fallback: 'en',
      };

      const result = validateTranslationSpec(spec);

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'warning',
          path: 'fallback',
        })
      );
    });
  });

  describe('messages validation', () => {
    it('should warn on empty messages', () => {
      const spec: TranslationSpec = {
        ...validSpec,
        messages: {},
      };

      const result = validateTranslationSpec(spec);

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'warning',
          message: expect.stringContaining('no messages'),
        })
      );
    });

    it('should error on empty message value', () => {
      const spec: TranslationSpec = {
        ...validSpec,
        messages: {
          empty: { value: '', description: 'Empty message' },
        },
      };

      const result = validateTranslationSpec(spec);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          path: 'messages.empty.value',
        })
      );
    });

    it('should warn on unused placeholder', () => {
      const spec: TranslationSpec = {
        ...validSpec,
        messages: {
          test: {
            value: 'Hello!',
            placeholders: [{ name: 'unused', type: 'string' }],
          },
        },
      };

      const result = validateTranslationSpec(spec);

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'warning',
          message: expect.stringContaining('unused'),
        })
      );
    });

    it('should info on undeclared placeholder', () => {
      const spec: TranslationSpec = {
        ...validSpec,
        messages: {
          test: {
            value: 'Hello, {name}!',
            placeholders: [], // name not declared
          },
        },
      };

      const result = validateTranslationSpec(spec);

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'info',
          message: expect.stringContaining('{name}'),
        })
      );
    });

    it('should error on invalid ICU format', () => {
      const spec: TranslationSpec = {
        ...validSpec,
        messages: {
          test: { value: 'Hello {unclosed', description: 'Invalid' },
        },
      };

      const result = validateTranslationSpec(spec);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          message: expect.stringContaining('invalid ICU'),
        })
      );
    });

    it('should warn on duplicate variant', () => {
      const spec: TranslationSpec = {
        ...validSpec,
        messages: {
          test: {
            value: 'Hello',
            variants: [
              { type: 'gender', key: 'male', value: 'Hello sir' },
              { type: 'gender', key: 'male', value: 'Hello sir again' },
            ],
          },
        },
      };

      const result = validateTranslationSpec(spec);

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'warning',
          message: expect.stringContaining('Duplicate variant'),
        })
      );
    });

    it('should error on empty variant value', () => {
      const spec: TranslationSpec = {
        ...validSpec,
        messages: {
          test: {
            value: 'Hello',
            variants: [{ type: 'gender', key: 'male', value: '' }],
          },
        },
      };

      const result = validateTranslationSpec(spec);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          message: expect.stringContaining('empty value'),
        })
      );
    });

    it('should error on invalid maxLength', () => {
      const spec: TranslationSpec = {
        ...validSpec,
        messages: {
          test: { value: 'Hello', maxLength: 0 },
        },
      };

      const result = validateTranslationSpec(spec);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          message: expect.stringContaining('maxLength'),
        })
      );
    });

    it('should warn when value exceeds maxLength', () => {
      const spec: TranslationSpec = {
        ...validSpec,
        messages: {
          test: { value: 'Hello World!', maxLength: 5 },
        },
      };

      const result = validateTranslationSpec(spec);

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'warning',
          message: expect.stringContaining('exceeds maxLength'),
        })
      );
    });
  });

  describe('plural rules validation', () => {
    it('should error on missing variable', () => {
      const spec: TranslationSpec = {
        ...validSpec,
        pluralRules: [
          { variable: '', rules: [{ category: 'other', value: 'items' }] },
        ],
      };

      const result = validateTranslationSpec(spec);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          message: expect.stringContaining('variable name'),
        })
      );
    });

    it('should error on missing rules', () => {
      const spec: TranslationSpec = {
        ...validSpec,
        pluralRules: [{ variable: 'count', rules: [] }],
      };

      const result = validateTranslationSpec(spec);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          message: expect.stringContaining('at least one category'),
        })
      );
    });

    it('should error on missing "other" category', () => {
      const spec: TranslationSpec = {
        ...validSpec,
        pluralRules: [
          { variable: 'count', rules: [{ category: 'one', value: '1 item' }] },
        ],
      };

      const result = validateTranslationSpec(spec);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          message: expect.stringContaining('"other" category'),
        })
      );
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// validateICUFormat Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('validateICUFormat', () => {
  it('should validate simple messages', () => {
    const result = validateICUFormat('Hello, World!');

    expect(result.valid).toBe(true);
    expect(result.placeholders).toHaveLength(0);
  });

  it('should extract simple placeholders', () => {
    const result = validateICUFormat('Hello, {name}!');

    expect(result.valid).toBe(true);
    expect(result.placeholders).toContain('name');
  });

  it('should extract multiple placeholders', () => {
    const result = validateICUFormat('{greeting}, {name}!');

    expect(result.valid).toBe(true);
    expect(result.placeholders).toContain('greeting');
    expect(result.placeholders).toContain('name');
  });

  it('should extract typed placeholders', () => {
    const result = validateICUFormat('{count, number}');

    expect(result.valid).toBe(true);
    expect(result.placeholders).toContain('count');
  });

  it('should identify plural placeholders', () => {
    const result = validateICUFormat(
      '{count, plural, one {item} other {items}}'
    );

    expect(result.valid).toBe(true);
    expect(result.plurals).toContain('count');
  });

  it('should identify select placeholders', () => {
    const result = validateICUFormat(
      '{gender, select, male {He} female {She} other {They}}'
    );

    expect(result.valid).toBe(true);
    expect(result.selects).toContain('gender');
  });

  it('should detect unbalanced opening brace', () => {
    const result = validateICUFormat('Hello {name');

    expect(result.valid).toBe(false);
    expect(result.error).toContain('Unbalanced');
  });

  it('should detect unbalanced closing brace', () => {
    const result = validateICUFormat('Hello name}');

    expect(result.valid).toBe(false);
    expect(result.error).toContain('Unbalanced');
  });

  it('should handle nested braces in plural', () => {
    const result = validateICUFormat(
      '{count, plural, one {{count} item} other {{count} items}}'
    );

    expect(result.valid).toBe(true);
    expect(result.plurals).toContain('count');
  });

  it('should handle escaped braces', () => {
    const result = validateICUFormat("Use '{' for braces");

    expect(result.valid).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// findMissingTranslations Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('findMissingTranslations', () => {
  it('should find missing messages', () => {
    const source: TranslationSpec = {
      ...validSpec,
      messages: {
        greeting: { value: 'Hello' },
        farewell: { value: 'Goodbye' },
        thanks: { value: 'Thanks' },
      },
    };

    const target: TranslationSpec = {
      ...validSpec,
      locale: 'fr',
      messages: {
        greeting: { value: 'Bonjour' },
        // farewell and thanks missing
      },
    };

    const missing = findMissingTranslations(source, target);

    expect(missing).toHaveLength(2);
    expect(missing.map((m) => m.messageKey)).toContain('farewell');
    expect(missing.map((m) => m.messageKey)).toContain('thanks');
  });

  it('should return empty array when all translations present', () => {
    const source: TranslationSpec = {
      ...validSpec,
      messages: { greeting: { value: 'Hello' } },
    };

    const target: TranslationSpec = {
      ...validSpec,
      locale: 'fr',
      messages: { greeting: { value: 'Bonjour' } },
    };

    const missing = findMissingTranslations(source, target);

    expect(missing).toHaveLength(0);
  });

  it('should include source message details', () => {
    const source: TranslationSpec = {
      ...validSpec,
      messages: {
        greeting: { value: 'Hello', description: 'Greeting message' },
      },
    };

    const target: TranslationSpec = {
      ...validSpec,
      locale: 'fr',
      messages: {},
    };

    const missing = findMissingTranslations(source, target);

    expect(missing).toHaveLength(1);
    const firstMissing = missing[0];
    expect(firstMissing).toBeDefined();
    expect(firstMissing?.sourceMessage.value).toBe('Hello');
    expect(firstMissing?.sourceLocale).toBe('en');
    expect(firstMissing?.targetLocale).toBe('fr');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// findAllMissingTranslations Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('findAllMissingTranslations', () => {
  it('should find missing translations across registry', () => {
    const en: TranslationSpec = {
      ...validSpec,
      messages: {
        greeting: { value: 'Hello' },
        farewell: { value: 'Goodbye' },
      },
    };

    const fr: TranslationSpec = {
      ...validSpec,
      locale: 'fr',
      messages: { greeting: { value: 'Bonjour' } },
    };

    const de: TranslationSpec = {
      ...validSpec,
      locale: 'de',
      messages: { greeting: { value: 'Hallo' } },
    };

    const registry = new TranslationRegistry([en, fr, de]);
    const result = findAllMissingTranslations(registry, 'test.messages', 'en');

    expect(result.get('fr')).toHaveLength(1);
    expect(result.get('de')).toHaveLength(1);
    expect(result.get('fr')?.[0]?.messageKey).toBe('farewell');
  });

  it('should return empty map when base locale not found', () => {
    const registry = new TranslationRegistry();
    const result = findAllMissingTranslations(registry, 'test.messages', 'en');

    expect(result.size).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// validateTranslationRegistry Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('validateTranslationRegistry', () => {
  it('should validate all specs in registry', () => {
    const valid1 = { ...validSpec };
    const valid2: TranslationSpec = {
      ...validSpec,
      meta: { ...validSpec.meta, key: 'other.messages' },
      locale: 'fr',
    };

    const registry = new TranslationRegistry([valid1, valid2]);
    const result = validateTranslationRegistry(registry);

    expect(result.valid).toBe(true);
  });

  it('should collect issues from all specs', () => {
    const invalid: TranslationSpec = {
      meta: { key: '', version: '', domain: '', owners: [] },
      locale: '',
      messages: {},
    };

    const registry = new TranslationRegistry([invalid]);
    const result = validateTranslationRegistry(registry);

    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// assertTranslationSpecValid Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('assertTranslationSpecValid', () => {
  it('should not throw for valid spec', () => {
    expect(() => assertTranslationSpecValid(validSpec)).not.toThrow();
  });

  it('should throw TranslationValidationError for invalid spec', () => {
    const invalid: TranslationSpec = {
      meta: { key: '', version: '', domain: '', owners: [] },
      locale: '',
      messages: {},
    };

    expect(() => assertTranslationSpecValid(invalid)).toThrow(
      TranslationValidationError
    );
  });

  it('should include issues in error', () => {
    const invalid: TranslationSpec = {
      meta: { key: '', version: '', domain: '', owners: [] },
      locale: '',
      messages: {},
    };

    try {
      assertTranslationSpecValid(invalid);
    } catch (error) {
      expect(error).toBeInstanceOf(TranslationValidationError);
      expect(
        (error as TranslationValidationError).issues.length
      ).toBeGreaterThan(0);
    }
  });
});
