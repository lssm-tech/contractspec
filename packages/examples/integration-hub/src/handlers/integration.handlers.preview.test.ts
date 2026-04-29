import { describe, expect, test } from 'bun:test';
import { web } from '@contractspec/lib.runtime-sandbox';
import { createIntegrationHandlers } from './integration.handlers';

const { LocalRuntimeServices } = web;

describe('integration hub preview runtime handlers', () => {
	test('list seeded integration hub data with PGLite placeholders', async () => {
		const runtime = new LocalRuntimeServices();
		await runtime.init();
		await runtime.seedTemplate({
			templateId: 'integration-hub',
			projectId: 'marketing-preview-integration-hub',
		});

		try {
			const handlers = createIntegrationHandlers(runtime.db);
			const integrations = await handlers.listIntegrations({
				projectId: 'marketing-preview-integration-hub',
				limit: 100,
			});
			const connections = await handlers.listConnections({ limit: 100 });
			const syncConfigs = await handlers.listSyncConfigs({ limit: 100 });

			expect(integrations.integrations.length).toBeGreaterThan(0);
			expect(connections.connections).toEqual([]);
			expect(syncConfigs.configs).toEqual([]);
			expect(integrations.integrations.map((item) => item.name)).toContain(
				'Salesforce'
			);

			const connection = await handlers.connectService({
				integrationId: integrations.integrations[0]!.id,
				name: 'Salesforce preview',
				credentials: { kind: 'oauth2-reference' },
				config: { region: 'us' },
			});
			const syncConfig = await handlers.configureSync({
				connectionId: connection.id,
				name: 'Accounts sync',
				sourceEntity: 'Account',
				targetEntity: 'WorkspaceAccount',
			});
			const mappings = await handlers.mapFields({
				syncConfigId: syncConfig.id,
				mappings: [{ sourceField: 'Name', targetField: 'displayName' }],
			});
			const synced = await handlers.runSync(syncConfig.id);

			expect(connection.status).toBe('CONNECTED');
			expect(syncConfig.status).toBe('ACTIVE');
			expect(mappings).toHaveLength(1);
			expect(synced.recordsSynced).toBeGreaterThan(0);
			expect(
				await handlers.validateByokKey({
					connectionId: connection.id,
					providerKey: 'preview-provider-key',
				})
			).toMatchObject({ valid: true, provider: 'Salesforce preview' });
		} finally {
			await runtime.db.close();
		}
	});
});
