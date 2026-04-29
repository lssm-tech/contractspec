import { describe, expect, it } from 'bun:test';
import type { IntegrationSpec } from '@contractspec/lib.contracts-integrations';
import { renderToStaticMarkup } from 'react-dom/server';
import {
	buildIntegrationCredentialSetupModel,
	IntegrationCredentialSetupBlock,
} from './index';

const baseIntegration: IntegrationSpec = {
	meta: {
		key: 'integration.postmark',
		version: '1.0.0',
		title: 'Postmark',
		description: 'Postmark email provider.',
		stability: 'experimental',
		owners: ['platform.marketplace'],
		tags: ['marketplace'],
		category: 'email',
	},
	supportedModes: ['managed', 'byok'],
	capabilities: { provides: [] },
	configSchema: {
		schema: {
			type: 'object',
			required: ['region'],
			properties: {
				region: { type: 'string', description: 'Provider region.' },
			},
		},
	},
	secretSchema: {
		schema: {
			type: 'object',
			required: ['apiToken'],
			properties: {
				apiToken: { type: 'string', description: 'API token.' },
			},
		},
	},
	byokSetup: {
		keyRotationSupported: true,
		provisioningSteps: ['Create an API token.'],
	},
};

describe('BYOK env UI config kit', () => {
	it('builds rows from legacy integration schemas', () => {
		const model = buildIntegrationCredentialSetupModel({
			integration: baseIntegration,
			selectedMode: 'byok',
		});

		expect(model.fields.map((field) => field.key)).toEqual([
			'region',
			'apiToken',
		]);
		expect(model.fields.find((field) => field.key === 'apiToken')?.status).toBe(
			'missing'
		);
		expect(
			model.warnings.some((warning) => warning.message.includes('required'))
		).toBe(true);
	});

	it('prefers explicit credential manifests over legacy fallback', () => {
		const model = buildIntegrationCredentialSetupModel({
			integration: {
				...baseIntegration,
				credentialManifest: {
					modes: {
						managed: {
							mode: 'managed',
							configFields: [{ key: 'workspaceId', required: true }],
						},
					},
				},
			},
			selectedMode: 'managed',
		});

		expect(model.fields.map((field) => field.key)).toEqual(['workspaceId']);
	});

	it('omits raw secret-looking values from the setup model', () => {
		const model = buildIntegrationCredentialSetupModel({
			credentialManifest: {
				modes: {
					byok: {
						mode: 'byok',
						secretFields: [{ key: 'apiToken', required: true }],
					},
				},
			},
			selectedMode: 'byok',
			secretRefs: { apiToken: 'sk_live_should_not_render' },
		});

		expect(JSON.stringify(model)).not.toContain('sk_live_should_not_render');
		expect(
			model.warnings.some((warning) => warning.message.includes('hidden'))
		).toBe(true);
	});

	it('renders managed mode actions and requirements', () => {
		const html = renderToStaticMarkup(
			<IntegrationCredentialSetupBlock
				credentialManifest={{
					modes: {
						managed: {
							mode: 'managed',
							configFields: [{ key: 'workspaceId', required: true }],
						},
					},
				}}
				supportedModes={['managed']}
				selectedMode="managed"
				onTestConnection={() => undefined}
				onSave={() => undefined}
			/>
		);

		expect(html).toContain('Managed');
		expect(html).toContain('WorkspaceId');
		expect(html).toContain('Test connection');
		expect(html).toContain('Save settings');
	});

	it('renders BYOK references, app aliases, and no raw secrets', () => {
		const html = renderToStaticMarkup(
			<IntegrationCredentialSetupBlock
				credentialManifest={{
					modes: {
						byok: {
							mode: 'byok',
							secretFields: [{ key: 'apiToken', required: true }],
						},
					},
				}}
				environment={{
					targets: {
						web: { id: 'web', framework: 'next', packageName: '@acme/web' },
						mobile: {
							id: 'mobile',
							framework: 'expo',
							packageName: '@acme/mobile',
						},
					},
					variables: {
						PUBLIC_API_URL: {
							key: 'PUBLIC_API_URL',
							sensitivity: 'public',
							aliases: [
								{
									targetId: 'web',
									framework: 'next',
									name: 'NEXT_PUBLIC_API_URL',
								},
								{
									targetId: 'mobile',
									framework: 'expo',
									name: 'EXPO_PUBLIC_API_URL',
								},
							],
						},
						apiToken: {
							key: 'apiToken',
							sensitivity: 'secret',
							aliases: [
								{
									targetId: 'web',
									framework: 'next',
									name: 'NEXT_PUBLIC_TOKEN',
								},
							],
						},
					},
				}}
				secretRefs={{ apiToken: 'env://POSTMARK_TOKEN' }}
				supportedModes={['byok']}
				selectedMode="byok"
				targetIds={['web', 'mobile']}
			/>
		);

		expect(html).toContain('BYOK');
		expect(html).toContain('env://POSTMARK_TOKEN');
		expect(html).toContain('NEXT_PUBLIC_API_URL');
		expect(html).toContain('EXPO_PUBLIC_API_URL');
		expect(html).toContain('@acme/web');
		expect(html).toContain('@acme/mobile');
		expect(html).toContain('Public client alias');
		expect(html).not.toContain('NEXT_PUBLIC_TOKEN');
	});
});
