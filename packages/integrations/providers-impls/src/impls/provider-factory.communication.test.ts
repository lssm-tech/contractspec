import { describe, expect, it } from 'bun:test';
import { GmailInboundProvider } from '@contractspec/integration.provider.email/impls/gmail-inbound';
import { GmailOutboundProvider } from '@contractspec/integration.provider.email/impls/gmail-outbound';
import type { IntegrationContext } from '@contractspec/integration.runtime/runtime';
import type {
	SecretProvider,
	SecretValue,
} from '@contractspec/integration.runtime/secrets/provider';
import type {
	IntegrationConnection,
	IntegrationSpec,
} from '@contractspec/lib.contracts-integrations';
import { IntegrationProviderFactory } from './provider-factory';

describe('IntegrationProviderFactory communication email coverage', () => {
	const factory = new IntegrationProviderFactory();

	it('creates Gmail outbound provider', async () => {
		const provider = await factory.createEmailOutboundProvider(
			buildContext({
				key: 'email.gmail',
				secret: {
					clientId: 'client-id',
					clientSecret: 'client-secret',
					refreshToken: 'refresh-token',
				},
			})
		);

		expect(provider).toBeInstanceOf(GmailOutboundProvider);
	});

	it('creates Gmail inbound provider', async () => {
		const provider = await factory.createEmailInboundProvider(
			buildContext({
				key: 'email.gmail',
				config: { includeSpamTrash: true },
				secret: {
					clientId: 'client-id',
					clientSecret: 'client-secret',
					refreshToken: 'refresh-token',
				},
			})
		);

		expect(provider).toBeInstanceOf(GmailInboundProvider);
	});
});

let contextCounter = 0;

function buildContext({
	key,
	config = {},
	secret = {},
}: {
	key: string;
	config?: Record<string, unknown>;
	secret?: Record<string, unknown>;
}): IntegrationContext {
	const spec: IntegrationSpec = {
		meta: {
			key,
			version: '1.0.0',
			category: key.split('.')[0] as IntegrationSpec['meta']['category'],
			title: key,
			description: `${key} provider`,
			domain: 'test',
			owners: ['test.owner'],
			tags: ['test'],
			stability: 'experimental',
		},
		supportedModes: ['managed'],
		capabilities: { provides: [] },
		configSchema: { schema: {} },
		secretSchema: { schema: {} },
	};

	const connection: IntegrationConnection = {
		meta: {
			id: `conn-${key}-${++contextCounter}`,
			tenantId: 'tenant',
			integrationKey: key,
			integrationVersion: '1.0.0',
			label: key,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		ownershipMode: 'managed',
		config,
		secretProvider: 'mock',
		secretRef: 'mock://secret',
		status: 'connected',
	};

	const secretProvider: SecretProvider = {
		id: 'mock',
		canHandle: () => true,
		getSecret: async () =>
			({
				data: Buffer.from(JSON.stringify(secret)),
				retrievedAt: new Date(),
			}) as SecretValue,
		setSecret: async () => ({ reference: 'mock://secret', version: '1' }),
		rotateSecret: async () => ({ reference: 'mock://secret', version: '2' }),
		deleteSecret: async () => undefined,
	};

	return {
		tenantId: 'tenant',
		appId: 'app',
		spec,
		connection,
		config,
		secretProvider,
		secretReference: 'mock://secret',
		trace: {
			blueprintName: 'blueprint',
			blueprintVersion: 1,
			configVersion: 1,
		},
	};
}
