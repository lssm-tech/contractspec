import { describe, expect, it } from 'bun:test';

import { isByokValidationStale, type ByokKeyMetadata } from './byok';

describe('isByokValidationStale', () => {
  it('should return true when lastValidatedAt is missing', () => {
    const meta: ByokKeyMetadata = {
      createdAt: new Date().toISOString(),
      validationStatus: 'unknown',
    };
    expect(isByokValidationStale(meta)).toBe(true);
  });

  it('should return true when validation is older than maxAge', () => {
    const meta: ByokKeyMetadata = {
      createdAt: new Date().toISOString(),
      lastValidatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      validationStatus: 'valid',
    };
    expect(isByokValidationStale(meta)).toBe(true);
  });

  it('should return false when validation is recent', () => {
    const meta: ByokKeyMetadata = {
      createdAt: new Date().toISOString(),
      lastValidatedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      validationStatus: 'valid',
    };
    expect(isByokValidationStale(meta)).toBe(false);
  });

  it('should respect custom maxAgeMs', () => {
    const meta: ByokKeyMetadata = {
      createdAt: new Date().toISOString(),
      lastValidatedAt: new Date(Date.now() - 120_000).toISOString(),
      validationStatus: 'valid',
    };
    expect(isByokValidationStale(meta, 60_000)).toBe(true);
    expect(isByokValidationStale(meta, 300_000)).toBe(false);
  });
});
