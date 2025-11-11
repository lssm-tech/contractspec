import { describe, it, expect } from 'vitest';
import {
  isValidIdentifier,
  isValidDotName,
  isValidVersion,
  validators,
} from './validation';

describe('isValidIdentifier', () => {
  it('should accept valid identifiers', () => {
    expect(isValidIdentifier('myVar')).toBe(true);
    expect(isValidIdentifier('_private')).toBe(true);
    expect(isValidIdentifier('$jquery')).toBe(true);
    expect(isValidIdentifier('camelCase123')).toBe(true);
  });

  it('should reject invalid identifiers', () => {
    expect(isValidIdentifier('123start')).toBe(false);
    expect(isValidIdentifier('my-var')).toBe(false);
    expect(isValidIdentifier('my.var')).toBe(false);
    expect(isValidIdentifier('')).toBe(false);
  });
});

describe('isValidDotName', () => {
  it('should accept valid dot notation names', () => {
    expect(isValidDotName('user.signup')).toBe(true);
    expect(isValidDotName('payment.charge.create')).toBe(true);
    expect(isValidDotName('simple')).toBe(true);
  });

  it('should reject invalid dot names', () => {
    expect(isValidDotName('user.')).toBe(false);
    expect(isValidDotName('.user')).toBe(false);
    expect(isValidDotName('user..signup')).toBe(false);
    expect(isValidDotName('123.start')).toBe(false);
  });
});

describe('isValidVersion', () => {
  it('should accept valid versions', () => {
    expect(isValidVersion(1)).toBe(true);
    expect(isValidVersion(42)).toBe(true);
    expect(isValidVersion(100)).toBe(true);
  });

  it('should reject invalid versions', () => {
    expect(isValidVersion(0)).toBe(false);
    expect(isValidVersion(-1)).toBe(false);
    expect(isValidVersion(1.5)).toBe(false);
    expect(isValidVersion(NaN)).toBe(false);
  });
});

describe('validators', () => {
  it('should validate spec names', () => {
    const result1 = validators.specName.safeParse('user.signup');
    expect(result1.success).toBe(true);

    const result2 = validators.specName.safeParse('invalid name');
    expect(result2.success).toBe(false);
  });

  it('should validate versions', () => {
    const result1 = validators.version.safeParse(1);
    expect(result1.success).toBe(true);

    const result2 = validators.version.safeParse(-1);
    expect(result2.success).toBe(false);
  });

  it('should validate owners', () => {
    const result1 = validators.owner.safeParse('@team');
    expect(result1.success).toBe(true);

    const result2 = validators.owner.safeParse('team');
    expect(result2.success).toBe(false);
  });
});

