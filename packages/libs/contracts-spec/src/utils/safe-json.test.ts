import { describe, expect, it } from 'bun:test';
import { safeParseJson } from './safe-json';

describe('safeParseJson', () => {
  it('returns ok: true with parsed data for valid JSON', () => {
    const result = safeParseJson<{ foo: string }>('{"foo":"bar"}');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({ foo: 'bar' });
    }
  });

  it('returns ok: false for invalid JSON', () => {
    const result = safeParseJson('not valid json');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(Error);
    }
  });

  it('returns ok: false for empty string', () => {
    const result = safeParseJson('');
    expect(result.ok).toBe(false);
  });

  it('returns ok: true for JSON array', () => {
    const result = safeParseJson<number[]>('[1,2,3]');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual([1, 2, 3]);
    }
  });
});
