import { describe, expect, it } from 'bun:test';
import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { CapabilityRegistry, type CapabilitySpec } from '../capabilities';
import { DataViewRegistry } from '../data-views/registry';
import { FormRegistry, type FormSpec } from '../forms/forms';
import { JobSpecRegistry } from '../jobs/spec';
import { KnowledgeSpaceRegistry } from '../knowledge/spec';
import { StabilityEnum } from '../ownership';
import { PolicyRegistry } from '../policy/registry';
import { TelemetryRegistry } from '../telemetry/spec';
import { TranslationRegistry } from '../translations/registry';
import { VisualizationRegistry } from '../visualizations/registry';
import { WorkflowRegistry } from '../workflow/spec';
import { installFeature } from './install';
import { FeatureRegistry } from './registry';
import type { FeatureModuleSpec } from './types';

const emptyIntegrationLookup = {
	get() {
		return undefined;
	},
};

describe('installFeature', () => {
	const createFeature = (
		overrides?: Partial<FeatureModuleSpec>
	): FeatureModuleSpec => ({
		meta: {
			key: 'test.feature',
			version: '1.0.0',
			title: 'Test Feature',
			description: 'A test feature',
			stability: StabilityEnum.Stable,
			owners: ['platform.core'],
			tags: ['test'],
		},
		...overrides,
	});

	describe('basic registration', () => {
		it('should register feature in registry', () => {
			const features = new FeatureRegistry();
			const feature = createFeature();

			installFeature(feature, { features });

			expect(features.get('test.feature')).toBe(feature);
		});

		it('should return the registry for chaining', () => {
			const features = new FeatureRegistry();
			const feature = createFeature();

			const result = installFeature(feature, { features });

			expect(result).toBe(features);
		});
	});

	describe('capability validation', () => {
		const capabilitySpec: CapabilitySpec = {
			meta: {
				key: 'payments.stripe',
				version: '1.0.0',
				title: 'Stripe Payments',
				description: 'Stripe payment processing',
				stability: StabilityEnum.Stable,
				owners: ['team.payments'],
				tags: ['payments'],
				kind: 'integration',
			},
			provides: [
				{
					surface: 'operation',
					key: 'payments.charge.create',
					version: '1.0.0',
				},
			],
		};

		it('should throw when capability requirement is not satisfied', () => {
			const features = new FeatureRegistry();
			const capabilities = new CapabilityRegistry();
			const feature = createFeature({
				capabilities: {
					requires: [{ key: 'payments.stripe', version: '1.0.0' }],
				},
			});

			expect(() => installFeature(feature, { features, capabilities })).toThrow(
				/capability requirement not satisfied/
			);
		});

		it('should allow install when capability is registered', () => {
			const features = new FeatureRegistry();
			const capabilities = new CapabilityRegistry();
			capabilities.register(capabilitySpec);

			const feature = createFeature({
				capabilities: {
					requires: [{ key: 'payments.stripe', version: '1.0.0' }],
				},
			});

			expect(() =>
				installFeature(feature, { features, capabilities })
			).not.toThrow();
			expect(features.get('test.feature')).toBeDefined();
		});

		it('should allow capability requirements satisfied by locally provided capability', () => {
			const features = new FeatureRegistry();
			const capabilities = new CapabilityRegistry();
			capabilities.register(capabilitySpec);

			const feature = createFeature({
				capabilities: {
					provides: [{ key: 'payments.stripe', version: '1.0.0' }],
					requires: [{ key: 'payments.stripe', version: '1.0.0' }],
				},
			});

			expect(() =>
				installFeature(feature, { features, capabilities })
			).not.toThrow();
		});

		it('should throw when capability is provided but not registered', () => {
			const features = new FeatureRegistry();
			const capabilities = new CapabilityRegistry();

			const feature = createFeature({
				capabilities: {
					provides: [{ key: 'unregistered.cap', version: '1.0.0' }],
				},
			});

			expect(() => installFeature(feature, { features, capabilities })).toThrow(
				/capability not registered/
			);
		});

		it('should throw when requires present but no capability registry', () => {
			const features = new FeatureRegistry();

			const feature = createFeature({
				capabilities: {
					requires: [{ key: 'some.cap', version: '1.0.0' }],
				},
			});

			expect(() => installFeature(feature, { features })).toThrow(
				/capability registry required/
			);
		});
	});

	describe('presentation targets validation', () => {
		it('should validate V2 descriptor exists', () => {
			const features = new FeatureRegistry();
			const feature = createFeature({
				presentationsTargets: [
					{ key: 'missing.presentation', version: '1.0.0', targets: ['react'] },
				],
			});

			expect(() =>
				installFeature(feature, { features, descriptors: [] })
			).toThrow(/V2 descriptor not found/);
		});

		it('should validate V2 descriptor has required targets', () => {
			const features = new FeatureRegistry();
			const descriptors = [
				{
					meta: {
						key: 'user.profile',
						version: '1.0.0',
						title: 'Profile',
						description: 'User profile',
						stability: 'stable' as const,
						owners: [],
						tags: [],
						domain: '',
						goal: 'Profile view',
						context: 'Context',
					},
					targets: ['markdown'] as (
						| 'react'
						| 'markdown'
						| 'application/json'
						| 'application/xml'
					)[],
					source: {
						type: 'component' as const,
						componentKey: 'UserProfile',
						framework: 'react' as const,
					},
				},
			];

			const feature = createFeature({
				presentationsTargets: [
					{ key: 'user.profile', version: '1.0.0', targets: ['react'] },
				],
			});

			expect(() => installFeature(feature, { features, descriptors })).toThrow(
				/missing target react/
			);
		});

		it('should pass when descriptor has all required targets', () => {
			const features = new FeatureRegistry();
			const descriptors = [
				{
					meta: {
						key: 'user.profile',
						version: '1.0.0',
						title: 'Profile',
						description: 'Profile',
						stability: 'stable' as const,
						owners: [],
						tags: [],
						domain: '',
						goal: 'Profile view',
						context: 'Context',
					},
					targets: ['react', 'markdown'] as (
						| 'react'
						| 'markdown'
						| 'application/json'
						| 'application/xml'
					)[],
					source: {
						type: 'component' as const,
						componentKey: 'UserProfile',
						framework: 'react' as const,
					},
				},
			];

			const feature = createFeature({
				presentationsTargets: [
					{ key: 'user.profile', version: '1.0.0', targets: ['react'] },
				],
			});

			expect(() =>
				installFeature(feature, { features, descriptors })
			).not.toThrow();
		});
	});

	describe('workflow validation', () => {
		it('should throw when referenced workflow is not registered', () => {
			const features = new FeatureRegistry();
			const workflows = new WorkflowRegistry();
			const feature = createFeature({
				workflows: [{ key: 'missing.workflow', version: '1.0.0' }],
			});

			expect(() => installFeature(feature, { features, workflows })).toThrow(
				/workflow not found/
			);
		});

		it('should pass when workflow is registered', () => {
			const features = new FeatureRegistry();
			const workflows = new WorkflowRegistry();
			workflows.register({
				meta: {
					key: 'onboarding.flow',
					version: '1.0.0',
					title: 'Onboarding',
					description: 'Onboarding workflow',
					stability: StabilityEnum.Stable,
					owners: ['platform.core'],
					tags: [],
				},
				definition: { steps: [], transitions: [] },
			});
			const feature = createFeature({
				workflows: [{ key: 'onboarding.flow', version: '1.0.0' }],
			});

			expect(() =>
				installFeature(feature, { features, workflows })
			).not.toThrow();
		});
	});

	describe('visualization validation', () => {
		it('should throw when referenced visualization is not registered', () => {
			const features = new FeatureRegistry();
			const visualizations = new VisualizationRegistry();
			const feature = createFeature({
				visualizations: [{ key: 'analytics.mrr', version: '1.0.0' }],
			});

			expect(() =>
				installFeature(feature, { features, visualizations })
			).toThrow(/visualization not found/);
		});

		it('should pass when visualization is registered', () => {
			const features = new FeatureRegistry();
			const visualizations = new VisualizationRegistry();
			visualizations.register({
				meta: {
					key: 'analytics.mrr',
					version: '1.0.0',
					title: 'MRR',
					description: 'Monthly recurring revenue',
					goal: 'Show MRR',
					context: 'Analytics overview',
					stability: StabilityEnum.Stable,
					owners: ['platform.core'],
					tags: ['analytics'],
				},
				source: {
					primary: { key: 'analytics.query.execute', version: '1.0.0' },
				},
				visualization: {
					kind: 'metric',
					measures: [{ key: 'mrr', label: 'MRR', dataPath: 'mrr' }],
					measure: 'mrr',
				},
			});
			const feature = createFeature({
				visualizations: [{ key: 'analytics.mrr', version: '1.0.0' }],
			});

			expect(() =>
				installFeature(feature, { features, visualizations })
			).not.toThrow();
		});
	});

	describe('knowledge validation', () => {
		it('should throw when referenced knowledge space is not registered', () => {
			const features = new FeatureRegistry();
			const knowledge = new KnowledgeSpaceRegistry();
			const feature = createFeature({
				knowledge: [{ key: 'missing.space', version: '1.0.0' }],
			});

			expect(() => installFeature(feature, { features, knowledge })).toThrow(
				/knowledge space not found/
			);
		});
	});

	describe('telemetry validation', () => {
		it('should throw when referenced telemetry spec is not registered', () => {
			const features = new FeatureRegistry();
			const telemetry = new TelemetryRegistry();
			const feature = createFeature({
				telemetry: [{ key: 'missing.telemetry', version: '1.0.0' }],
			});

			expect(() => installFeature(feature, { features, telemetry })).toThrow(
				/telemetry spec not found/
			);
		});
	});

	describe('policy validation', () => {
		it('should throw when referenced policy is not registered', () => {
			const features = new FeatureRegistry();
			const policies = new PolicyRegistry();
			const feature = createFeature({
				policies: [{ key: 'missing.policy', version: '1.0.0' }],
			});

			expect(() => installFeature(feature, { features, policies })).toThrow(
				/policy not found/
			);
		});
	});

	describe('integration validation', () => {
		it('should throw when referenced integration is not registered', () => {
			const features = new FeatureRegistry();
			const feature = createFeature({
				integrations: [{ key: 'missing.integration', version: '1.0.0' }],
			});

			expect(() =>
				installFeature(feature, {
					features,
					integrations: emptyIntegrationLookup,
				})
			).toThrow(/integration not found/);
		});
	});

	describe('job validation', () => {
		it('should throw when referenced job is not registered', () => {
			const features = new FeatureRegistry();
			const jobs = new JobSpecRegistry();
			const feature = createFeature({
				jobs: [{ key: 'missing.job', version: '1.0.0' }],
			});

			expect(() => installFeature(feature, { features, jobs })).toThrow(
				/job not found/
			);
		});

		it('should pass when job is registered', () => {
			const features = new FeatureRegistry();
			const jobs = new JobSpecRegistry();
			jobs.register({
				meta: {
					key: 'payments.reconcile',
					version: '1.0.0',
					title: 'Reconcile Payments',
					description: 'Daily payment reconciliation',
					stability: StabilityEnum.Stable,
					owners: ['platform.payments'],
					tags: [],
				},
				payload: { schema: {} },
			});
			const feature = createFeature({
				jobs: [{ key: 'payments.reconcile', version: '1.0.0' }],
			});

			expect(() => installFeature(feature, { features, jobs })).not.toThrow();
		});
	});

	describe('translation validation', () => {
		it('should throw when referenced translation is not registered', () => {
			const features = new FeatureRegistry();
			const translations = new TranslationRegistry();
			const feature = createFeature({
				translations: [{ key: 'missing.messages', version: '1.0.0' }],
			});

			expect(() => installFeature(feature, { features, translations })).toThrow(
				/translation not found/
			);
		});

		it('should pass when translation key has at least one locale registered', () => {
			const features = new FeatureRegistry();
			const translations = new TranslationRegistry();
			translations.register({
				meta: {
					key: 'payments.messages',
					version: '1.0.0',
					domain: 'payments',
					owners: ['platform.payments'],
				},
				locale: 'en',
				messages: {
					'payment.success': { value: 'Payment successful' },
				},
			});
			const feature = createFeature({
				translations: [{ key: 'payments.messages', version: '1.0.0' }],
			});

			expect(() =>
				installFeature(feature, { features, translations })
			).not.toThrow();
		});

		it('should throw when specific locale is not registered', () => {
			const features = new FeatureRegistry();
			const translations = new TranslationRegistry();
			translations.register({
				meta: {
					key: 'payments.messages',
					version: '1.0.0',
					domain: 'payments',
					owners: ['platform.payments'],
				},
				locale: 'en',
				messages: {
					'payment.success': { value: 'Payment successful' },
				},
			});
			const feature = createFeature({
				translations: [
					{ key: 'payments.messages', version: '1.0.0', locale: 'fr' },
				],
			});

			expect(() => installFeature(feature, { features, translations })).toThrow(
				/translation locale fr not found/
			);
		});
	});

	describe('dataView validation', () => {
		it('should throw when referenced data view is not registered', () => {
			const features = new FeatureRegistry();
			const dataViews = new DataViewRegistry();
			const feature = createFeature({
				dataViews: [{ key: 'missing.view', version: '1.0.0' }],
			});

			expect(() => installFeature(feature, { features, dataViews })).toThrow(
				/data view not found/
			);
		});

		it('should pass when data view is registered', () => {
			const features = new FeatureRegistry();
			const dataViews = new DataViewRegistry();
			dataViews.register({
				meta: {
					key: 'dashboard.overview',
					version: '1.0.0',
					title: 'Dashboard Overview',
					description: 'Main dashboard view',
					stability: StabilityEnum.Stable,
					owners: ['platform.core'],
					tags: [],
					entity: 'dashboard',
				},
				source: {
					primary: { key: 'core.list', version: '1.0.0' },
				},
				view: {
					kind: 'table',
					fields: [{ key: 'name', label: 'Name', dataPath: 'name' }],
				},
			});
			const feature = createFeature({
				dataViews: [{ key: 'dashboard.overview', version: '1.0.0' }],
			});

			expect(() =>
				installFeature(feature, { features, dataViews })
			).not.toThrow();
		});
	});

	describe('form validation', () => {
		it('should throw when referenced form is not registered', () => {
			const features = new FeatureRegistry();
			const forms = new FormRegistry();
			const feature = createFeature({
				forms: [{ key: 'missing.form', version: '1.0.0' }],
			});

			expect(() => installFeature(feature, { features, forms })).toThrow(
				/form not found/
			);
		});

		it('should pass when form is registered', () => {
			const features = new FeatureRegistry();
			const forms = new FormRegistry();
			const model = new SchemaModel({
				name: 'ProfileModel',
				fields: {
					name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
				},
			});
			const formSpec: FormSpec<typeof model> = {
				meta: {
					key: 'user.profile.edit',
					version: '1.0.0',
					title: 'Edit Profile',
					description: 'User profile edit form',
					stability: StabilityEnum.Stable,
					owners: ['platform.core'],
					tags: [],
				},
				model,
				fields: [],
			};
			forms.register(formSpec);
			const feature = createFeature({
				forms: [{ key: 'user.profile.edit', version: '1.0.0' }],
			});

			expect(() => installFeature(feature, { features, forms })).not.toThrow();
		});
	});
});
