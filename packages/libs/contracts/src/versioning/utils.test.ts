/**
 * Tests for versioning utilities.
 */

import { describe, expect, it } from 'bun:test';
import {
  parseVersion,
  parseVersionStrict,
  formatVersion,
  compareVersions,
  isVersionGreater,
  isVersionLess,
  isVersionEqual,
  bumpVersion,
  determineBumpType,
  getBumpTypePriority,
  getMaxBumpType,
  isValidVersion,
  validateVersion,
} from './utils';

describe('parseVersion', () => {
  it('should parse simple semver', () => {
    expect(parseVersion('1.2.3')).toEqual({ major: 1, minor: 2, patch: 3 });
  });

  it('should parse version with prerelease', () => {
    expect(parseVersion('1.0.0-alpha.1')).toEqual({
      major: 1,
      minor: 0,
      patch: 0,
      prerelease: 'alpha.1',
    });
  });

  it('should parse version with build metadata', () => {
    expect(parseVersion('1.0.0+build.123')).toEqual({
      major: 1,
      minor: 0,
      patch: 0,
      build: 'build.123',
    });
  });

  it('should parse version with prerelease and build', () => {
    expect(parseVersion('2.0.0-beta.2+build.456')).toEqual({
      major: 2,
      minor: 0,
      patch: 0,
      prerelease: 'beta.2',
      build: 'build.456',
    });
  });

  it('should return null for invalid versions', () => {
    expect(parseVersion('invalid')).toBeNull();
    expect(parseVersion('1.2')).toBeNull();
    expect(parseVersion('1.2.3.4')).toBeNull();
    expect(parseVersion('')).toBeNull();
  });

  it('should handle whitespace in input', () => {
    expect(parseVersion('  1.2.3  ')).toEqual({ major: 1, minor: 2, patch: 3 });
  });
});

describe('parseVersionStrict', () => {
  it('should parse valid version', () => {
    expect(parseVersionStrict('1.2.3')).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
    });
  });

  it('should throw for invalid version', () => {
    expect(() => parseVersionStrict('invalid')).toThrow(
      'Invalid semantic version'
    );
  });
});

describe('formatVersion', () => {
  it('should format simple version', () => {
    expect(formatVersion({ major: 1, minor: 2, patch: 3 })).toBe('1.2.3');
  });

  it('should format version with prerelease', () => {
    expect(
      formatVersion({ major: 1, minor: 0, patch: 0, prerelease: 'alpha.1' })
    ).toBe('1.0.0-alpha.1');
  });

  it('should format version with build', () => {
    expect(
      formatVersion({ major: 1, minor: 0, patch: 0, build: 'build.123' })
    ).toBe('1.0.0+build.123');
  });

  it('should format version with prerelease and build', () => {
    expect(
      formatVersion({
        major: 2,
        minor: 0,
        patch: 0,
        prerelease: 'beta.2',
        build: 'build.456',
      })
    ).toBe('2.0.0-beta.2+build.456');
  });
});

describe('compareVersions', () => {
  it('should return 0 for equal versions', () => {
    expect(compareVersions('1.2.3', '1.2.3')).toBe(0);
  });

  it('should compare major versions', () => {
    expect(compareVersions('2.0.0', '1.0.0')).toBe(1);
    expect(compareVersions('1.0.0', '2.0.0')).toBe(-1);
  });

  it('should compare minor versions', () => {
    expect(compareVersions('1.3.0', '1.2.0')).toBe(1);
    expect(compareVersions('1.2.0', '1.3.0')).toBe(-1);
  });

  it('should compare patch versions', () => {
    expect(compareVersions('1.2.4', '1.2.3')).toBe(1);
    expect(compareVersions('1.2.3', '1.2.4')).toBe(-1);
  });

  it('should handle prerelease versions', () => {
    // Release > prerelease
    expect(compareVersions('1.0.0', '1.0.0-alpha.1')).toBe(1);
    expect(compareVersions('1.0.0-alpha.1', '1.0.0')).toBe(-1);

    // Compare prerelease strings
    expect(compareVersions('1.0.0-beta.1', '1.0.0-alpha.1')).toBe(1);
    expect(compareVersions('1.0.0-alpha.1', '1.0.0-beta.1')).toBe(-1);
  });
});

describe('isVersionGreater / isVersionLess / isVersionEqual', () => {
  it('isVersionGreater should work correctly', () => {
    expect(isVersionGreater('2.0.0', '1.0.0')).toBe(true);
    expect(isVersionGreater('1.0.0', '2.0.0')).toBe(false);
    expect(isVersionGreater('1.0.0', '1.0.0')).toBe(false);
  });

  it('isVersionLess should work correctly', () => {
    expect(isVersionLess('1.0.0', '2.0.0')).toBe(true);
    expect(isVersionLess('2.0.0', '1.0.0')).toBe(false);
    expect(isVersionLess('1.0.0', '1.0.0')).toBe(false);
  });

  it('isVersionEqual should work correctly', () => {
    expect(isVersionEqual('1.0.0', '1.0.0')).toBe(true);
    expect(isVersionEqual('1.0.0', '2.0.0')).toBe(false);
  });
});

describe('bumpVersion', () => {
  it('should bump patch version', () => {
    expect(bumpVersion('1.2.3', 'patch')).toBe('1.2.4');
  });

  it('should bump minor version and reset patch', () => {
    expect(bumpVersion('1.2.3', 'minor')).toBe('1.3.0');
  });

  it('should bump major version and reset minor/patch', () => {
    expect(bumpVersion('1.2.3', 'major')).toBe('2.0.0');
  });

  it('should handle 0.x versions', () => {
    expect(bumpVersion('0.1.0', 'patch')).toBe('0.1.1');
    expect(bumpVersion('0.1.0', 'minor')).toBe('0.2.0');
    expect(bumpVersion('0.1.0', 'major')).toBe('1.0.0');
  });
});

describe('determineBumpType', () => {
  it('should return major for breaking changes', () => {
    expect(determineBumpType(true, true)).toBe('major');
    expect(determineBumpType(true, false)).toBe('major');
  });

  it('should return minor for non-breaking changes', () => {
    expect(determineBumpType(false, true)).toBe('minor');
  });

  it('should return patch when no significant changes', () => {
    expect(determineBumpType(false, false)).toBe('patch');
  });
});

describe('getBumpTypePriority', () => {
  it('should return correct priorities', () => {
    expect(getBumpTypePriority('major')).toBe(3);
    expect(getBumpTypePriority('minor')).toBe(2);
    expect(getBumpTypePriority('patch')).toBe(1);
  });
});

describe('getMaxBumpType', () => {
  it('should return null for empty array', () => {
    expect(getMaxBumpType([])).toBeNull();
  });

  it('should return the maximum bump type', () => {
    expect(getMaxBumpType(['patch', 'minor', 'major'])).toBe('major');
    expect(getMaxBumpType(['patch', 'minor'])).toBe('minor');
    expect(getMaxBumpType(['patch'])).toBe('patch');
  });
});

describe('isValidVersion', () => {
  it('should return true for valid versions', () => {
    expect(isValidVersion('1.0.0')).toBe(true);
    expect(isValidVersion('1.0.0-alpha.1')).toBe(true);
    expect(isValidVersion('1.0.0+build.123')).toBe(true);
  });

  it('should return false for invalid versions', () => {
    expect(isValidVersion('invalid')).toBe(false);
    expect(isValidVersion('1.2')).toBe(false);
    expect(isValidVersion('')).toBe(false);
  });
});

describe('validateVersion', () => {
  it('should return empty array for valid versions', () => {
    expect(validateVersion('1.0.0')).toEqual([]);
  });

  it('should return errors for invalid versions', () => {
    const errors = validateVersion('invalid');
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('Invalid semantic version');
  });

  it('should detect whitespace issues', () => {
    const errors = validateVersion('  1.0.0  ');
    expect(errors.some((e) => e.includes('whitespace'))).toBe(true);
  });

  it('should handle non-string input', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors = validateVersion(null as any);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('non-empty string');
  });
});
