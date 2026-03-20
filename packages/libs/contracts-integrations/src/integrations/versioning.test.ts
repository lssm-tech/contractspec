import { describe, expect, it } from 'bun:test';

import {
	getActiveVersions,
	getVersionInfo,
	type IntegrationVersionPolicy,
	isVersionDeprecated,
	resolveApiVersion,
} from './versioning';

const policy: IntegrationVersionPolicy = {
	currentVersion: '2024-11-20',
	supportedVersions: [
		{ version: '2024-11-20', status: 'stable', releasedAt: '2024-11-20' },
		{ version: '2024-06-01', status: 'deprecated', sunsetDate: '2025-06-01' },
		{ version: '2023-01-01', status: 'sunset' },
		{ version: '2025-01-01', status: 'beta' },
	],
	versionHeader: 'API-Version',
};

describe('resolveApiVersion', () => {
	it('should return current version when no override', () => {
		expect(resolveApiVersion(policy)).toBe('2024-11-20');
	});

	it('should return connection override when provided', () => {
		expect(resolveApiVersion(policy, '2024-06-01')).toBe('2024-06-01');
	});

	it('should return undefined when no policy', () => {
		expect(resolveApiVersion(undefined)).toBeUndefined();
	});
});

describe('getVersionInfo', () => {
	it('should return info for known version', () => {
		const info = getVersionInfo(policy, '2024-11-20');
		expect(info).toBeDefined();
		expect(info?.status).toBe('stable');
	});

	it('should return undefined for unknown version', () => {
		expect(getVersionInfo(policy, '9999-01-01')).toBeUndefined();
	});
});

describe('isVersionDeprecated', () => {
	it('should return false for stable version', () => {
		expect(isVersionDeprecated(policy, '2024-11-20')).toBe(false);
	});

	it('should return true for deprecated version', () => {
		expect(isVersionDeprecated(policy, '2024-06-01')).toBe(true);
	});

	it('should return true for sunset version', () => {
		expect(isVersionDeprecated(policy, '2023-01-01')).toBe(true);
	});

	it('should return false for beta version', () => {
		expect(isVersionDeprecated(policy, '2025-01-01')).toBe(false);
	});

	it('should return false for unknown version', () => {
		expect(isVersionDeprecated(policy, 'unknown')).toBe(false);
	});
});

describe('getActiveVersions', () => {
	it('should return only stable and beta versions', () => {
		const active = getActiveVersions(policy);
		expect(active).toHaveLength(2);
		expect(active.map((v) => v.version)).toEqual(['2024-11-20', '2025-01-01']);
	});
});
