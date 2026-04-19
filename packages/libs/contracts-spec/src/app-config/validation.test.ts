import { describe, expect, it } from 'bun:test';
import { KnowledgeSpaceRegistry } from '../knowledge/spec';
import {
	type AppConfigIntegrationConnection,
	type AppConfigIntegrationRegistry,
	type AppConfigIntegrationSpec,
} from './integrations';
import type { ResolvedAppConfig } from './runtime';
import type {
	AppBlueprintSpec,
	AppIntegrationSlot,
	TenantAppConfig,
} from './spec';
import {
	AppConfigValidationError,
	assertBlueprintValid,
	assertResolvedConfigValid,
	assertTenantConfigValid,
	type ValidationContext,
	validateBlueprint,
	validateResolvedConfig,
	validateTenantConfig,
} from './validation';

class TestIntegrationRegistry implements AppConfigIntegrationRegistry {
	private readonly items = new Map<string, AppConfigIntegrationSpec>();

	register(spec: AppConfigIntegrationSpec): this {
		this.items.set(`${spec.meta.key}.v${spec.meta.version}`, spec);
		return this;
	}

	get(key: string, version?: string): AppConfigIntegrationSpec | undefined {
		if (version) return this.items.get(`${key}.v${version}`);
		for (const spec of this.items.values()) {
			if (spec.meta.key === key) return spec;
		}
		return undefined;
	}
}

const baseBlueprint: AppBlueprintSpec = {
	meta: {
		key: 'example.app',
		version: '1.0.0',
		appId: 'example',
		title: 'Example App',
		description: 'Example blueprint for validation tests.',
		domain: 'example',
		owners: ['product.artisanos'],
		tags: [],
		stability: 'experimental',
	},
	integrationSlots: [
		{
			slotId: 'payments.primary',
			requiredCategory: 'payments',
			allowedModes: ['managed', 'byok'],
			requiredCapabilities: [{ key: 'payments.charge', version: '1.0.0' }],
			required: true,
		},
	],
	branding: {
		appNameKey: 'app.title',
	},
	translationCatalog: {
		key: 'example.catalog',
		version: '1.0.0',
	},
};

describe('validateBlueprint', () => {
	it('reports duplicate integration slots', () => {
		const originalSlot = {
			...((baseBlueprint.integrationSlots ?? [])[0] as AppIntegrationSlot),
		};
		const duplicateSlot = { ...originalSlot };
		const duplicated: AppBlueprintSpec = {
			...baseBlueprint,
			integrationSlots: [originalSlot, duplicateSlot],
		};

		const result = validateBlueprint(duplicated);
		expect(result.valid).toBe(false);
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					code: 'DUPLICATE_SLOT',
					path: 'integrationSlots.payments.primary',
				}),
			])
		);
	});
});

describe('validateTenantConfig', () => {
	it('captures integration, branding, locale, and translation issues', () => {
		const tenant: TenantAppConfig = {
			meta: {
				id: 'cfg-1',
				tenantId: 'tenant-a',
				appId: 'example',
				blueprintName: baseBlueprint.meta.key,
				blueprintVersion: '1.0.0',
				version: '3.0.0',
				status: 'draft',
			},
			integrations: [
				{
					slotId: 'payments.primary',
					connectionId: 'missing-conn',
				},
			],
			branding: {
				customDomain: 'http://bad-domain',
				assets: [
					{
						type: 'logo',
						url: 'http://insecure/logo.svg',
					},
				],
			},
			locales: {
				defaultLocale: 'fr',
				enabledLocales: ['en'],
			},
			translationOverrides: {
				entries: [
					{
						key: 'unknown.key',
						locale: 'fr',
						value: 'Unknown',
					},
				],
			},
			knowledge: [
				{
					spaceKey: 'support.faq',
				},
			],
		};

		const integrationRegistry = new TestIntegrationRegistry();

		const knowledgeRegistry = new KnowledgeSpaceRegistry().register({
			meta: {
				key: 'support.faq',
				version: '1.0.0',
				category: 'external',
				title: 'Support FAQ',

				description: 'External support knowledge base.',
				domain: 'knowledge',
				owners: ['product.artisanos'],
				tags: [],
				stability: 'experimental',
			},
			retention: {},
			access: {
				trustLevel: 'low',
				automationWritable: false,
			},
		});

		const context = {
			integrationSpecs: integrationRegistry,
			tenantConnections: [] as AppConfigIntegrationConnection[],
			existingConfigs: [tenant],
			translationCatalogs: {
				blueprint: {
					meta: { key: 'blueprint.i18n', version: '1.0.0' },
					defaultLocale: 'en',
					supportedLocales: ['en'],
					entries: [
						{ key: 'app.title', locale: 'en', value: 'Example' },
						{ key: 'app.title', locale: 'fr', value: 'Exemple' },
					],
				},
				platform: [],
			},
			knowledgeSpaces: knowledgeRegistry,
			knowledgeSources: [],
		} satisfies ValidationContext;

		const result = validateTenantConfig(baseBlueprint, tenant, context);
		expect(result.valid).toBe(false);
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					code: 'MISSING_INTEGRATION_CONNECTION',
					path: 'integrations.payments.primary',
				}),
				expect.objectContaining({
					code: 'MISSING_REQUIRED_SLOT',
					path: 'integrations.payments.primary',
				}),
				expect.objectContaining({
					code: 'INVALID_DOMAIN',
					path: 'branding.customDomain',
				}),
				expect.objectContaining({
					code: 'UNKNOWN_TRANSLATION_KEY',
					path: 'translationOverrides.entries[0]',
				}),
				expect.objectContaining({
					code: 'MISSING_KNOWLEDGE_SOURCES',
					path: 'knowledge[0]',
				}),
				expect.objectContaining({
					code: 'INSECURE_ASSET_URL',
					path: 'branding.assets[0].url',
				}),
				expect.objectContaining({
					code: 'MISSING_BLUEPRINT_CATALOG',
					path: 'translationCatalog',
				}),
			])
		);
		expect(result.warnings).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					code: 'LOCALE_NOT_ENABLED',
					path: 'locales.enabledLocales',
				}),
				expect.objectContaining({
					code: 'LOW_TRUST_KNOWLEDGE',
					path: 'knowledge[0]',
				}),
			])
		);
	});
});

describe('validateResolvedConfig', () => {
	it('ensures required integration slots are satisfied in resolved config', () => {
		const resolved: ResolvedAppConfig = {
			appId: 'example',
			tenantId: 'tenant-a',
			blueprintName: baseBlueprint.meta.key,
			blueprintVersion: baseBlueprint.meta.version,
			configVersion: '4.0.0',
			capabilities: { enabled: [], disabled: [] },
			features: { include: [], exclude: [] },
			dataViews: {},
			workflows: {},
			jobs: {},
			policies: [],
			experiments: { catalog: [], active: [], paused: [] },
			featureFlags: [],
			routes: [],
			integrations: [],
			knowledge: [],
			translation: {
				defaultLocale: 'en',
				supportedLocales: ['en'],
				blueprintCatalog: baseBlueprint.translationCatalog,
				tenantOverrides: [],
			},
			branding: {
				appName: 'Example',
				assets: {},
				colors: { primary: '#000000', secondary: '#ffffff' },
				domain: 'tenant-a.example.app',
			},
		};

		const result = validateResolvedConfig(baseBlueprint, resolved);
		expect(result.valid).toBe(false);
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					code: 'MISSING_REQUIRED_SLOT',
					path: 'integrations.payments.primary',
				}),
			])
		);
	});
});

describe('assert helpers', () => {
	it('assertBlueprintValid does not throw for a valid blueprint', () => {
		expect(() => assertBlueprintValid(baseBlueprint)).not.toThrow();
	});

	it('assertBlueprintValid throws for invalid blueprint', () => {
		const duplicated: AppBlueprintSpec = {
			...baseBlueprint,
			integrationSlots: [
				...(baseBlueprint.integrationSlots ?? []),
				...(baseBlueprint.integrationSlots ?? []),
			],
		};

		expect(() => assertBlueprintValid(duplicated)).toThrow(
			AppConfigValidationError
		);
	});

	it('assertTenantConfigValid throws for invalid tenant config', () => {
		const tenant: TenantAppConfig = {
			meta: {
				id: 'cfg-2',
				tenantId: 'tenant-a',
				appId: 'example',
				blueprintName: baseBlueprint.meta.key,
				blueprintVersion: '1.0.0',
				version: '1.0.0',
				status: 'draft',
			},
			integrations: [],
		};

		expect(() => assertTenantConfigValid(baseBlueprint, tenant)).toThrow(
			AppConfigValidationError
		);
	});

	it('assertResolvedConfigValid throws for invalid resolved config', () => {
		const resolved: ResolvedAppConfig = {
			appId: 'example',
			tenantId: 'tenant-a',
			blueprintName: baseBlueprint.meta.key,
			blueprintVersion: baseBlueprint.meta.version,
			configVersion: '4.0.0',
			capabilities: { enabled: [], disabled: [] },
			features: { include: [], exclude: [] },
			dataViews: {},
			workflows: {},
			jobs: {},
			policies: [],
			experiments: { catalog: [], active: [], paused: [] },
			featureFlags: [],
			routes: [],
			integrations: [],
			knowledge: [],
			translation: {
				defaultLocale: 'en',
				supportedLocales: ['en'],
				blueprintCatalog: baseBlueprint.translationCatalog,
				tenantOverrides: [],
			},
			branding: {
				appName: 'Example',
				assets: {},
				colors: { primary: '#000000', secondary: '#ffffff' },
				domain: 'tenant-a.example.app',
			},
		};

		expect(() => assertResolvedConfigValid(baseBlueprint, resolved)).toThrow(
			AppConfigValidationError
		);
	});
});
