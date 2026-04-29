import { describe, expect, it } from 'bun:test';
import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import {
	buildLegacyCredentialManifest,
	getIntegrationCredentialRequirements,
	integrationHasCredentialCoverage,
} from './credentials';
import type { IntegrationSpec } from './spec';

const baseSpec: IntegrationSpec = {
	meta: {
		key: 'payments.example',
		version: '1.0.0',
		category: 'payments',
		title: 'Example Payments',
		description: 'Example payment provider.',
		domain: 'payments',
		owners: ['platform.integrations'],
		tags: ['payments'],
		stability: StabilityEnum.Experimental,
	},
	supportedModes: ['managed', 'byok'],
	capabilities: {
		provides: [{ key: 'payments.psp', version: '1.0.0' }],
	},
	configSchema: {
		schema: {
			type: 'object',
			required: ['apiBaseUrl'],
			properties: {
				apiBaseUrl: { type: 'string', description: 'API base URL.' },
			},
		},
	},
	secretSchema: {
		schema: {
			type: 'object',
			required: ['apiKey'],
			properties: {
				apiKey: { type: 'string', description: 'Provider API key.' },
			},
		},
	},
	byokSetup: {
		setupInstructions: 'Create a restricted API key.',
		requiredScopes: ['payments:write'],
		keyRotationSupported: true,
	},
};

describe('integration credential manifests', () => {
	it('maps legacy schemas and byok setup into mode requirements', () => {
		const manifest = buildLegacyCredentialManifest(baseSpec);
		const byok = manifest.modes?.byok;

		expect(byok?.configFields?.[0]).toEqual({
			key: 'apiBaseUrl',
			required: true,
			description: 'API base URL.',
		});
		expect(byok?.secretFields?.[0]).toEqual({
			key: 'apiKey',
			required: true,
			description: 'Provider API key.',
		});
		expect(byok?.validationStrategy).toBe('byok-lifecycle');
		expect(byok?.rotation?.supported).toBe(true);
		expect(byok?.setupSteps).toEqual(['Create a restricted API key.']);
	});

	it('resolves explicit credential requirements before legacy mapping', () => {
		const spec: IntegrationSpec = {
			...baseSpec,
			credentialManifest: {
				modes: {
					managed: {
						mode: 'managed',
						validationStrategy: 'provider-health',
						allowedSecretProviders: ['managed-vault'],
					},
				},
			},
		};

		expect(
			getIntegrationCredentialRequirements(spec, 'managed')
				?.allowedSecretProviders
		).toEqual(['managed-vault']);
		expect(getIntegrationCredentialRequirements(spec, 'byok')).toBeUndefined();
	});

	it('reports full coverage from legacy schemas for every supported mode', () => {
		expect(integrationHasCredentialCoverage(baseSpec)).toBe(true);
	});
});
