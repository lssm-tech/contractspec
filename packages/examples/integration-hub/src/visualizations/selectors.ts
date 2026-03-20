import type { VisualizationSurfaceItem } from '@contractspec/lib.design-system';
import type {
	Connection,
	Integration,
	SyncConfig,
} from '../handlers/integration.handlers';
import {
	AttentionSyncMetricVisualization,
	ConnectionStatusVisualization,
	HealthySyncMetricVisualization,
	IntegrationTypeVisualization,
} from './catalog';

interface SyncLike extends Pick<SyncConfig, 'recordsSynced'> {
	status: string;
}

function isHealthySync(status: string) {
	return status === 'ACTIVE' || status === 'SUCCESS';
}

export function createIntegrationVisualizationSections(
	integrations: Pick<Integration, 'type'>[],
	connections: Pick<Connection, 'status'>[],
	syncConfigs: SyncLike[]
) {
	const integrationTypes = new Map<string, number>();
	const connectionStatuses = new Map<string, number>();
	let healthySyncs = 0;
	let attentionSyncs = 0;

	for (const integration of integrations) {
		integrationTypes.set(
			integration.type,
			(integrationTypes.get(integration.type) ?? 0) + 1
		);
	}

	for (const connection of connections) {
		connectionStatuses.set(
			connection.status,
			(connectionStatuses.get(connection.status) ?? 0) + 1
		);
	}

	for (const syncConfig of syncConfigs) {
		if (isHealthySync(syncConfig.status)) {
			healthySyncs += 1;
		} else {
			attentionSyncs += 1;
		}
	}

	const primaryItems: VisualizationSurfaceItem[] = [
		{
			key: 'integration-types',
			spec: IntegrationTypeVisualization,
			data: {
				data: Array.from(integrationTypes.entries()).map(([type, count]) => ({
					type,
					count,
				})),
			},
			title: 'Integration Types',
			description: 'Configured integrations grouped by category.',
			height: 260,
		},
		{
			key: 'connection-status',
			spec: ConnectionStatusVisualization,
			data: {
				data: Array.from(connectionStatuses.entries()).map(
					([status, count]) => ({
						status,
						count,
					})
				),
			},
			title: 'Connection Status',
			description: 'Operational health across current connections.',
		},
	];

	const comparisonItems: VisualizationSurfaceItem[] = [
		{
			key: 'healthy-syncs',
			spec: HealthySyncMetricVisualization,
			data: { data: [{ value: healthySyncs }] },
			title: 'Healthy Syncs',
			description: 'Active or recently successful sync configurations.',
			height: 200,
		},
		{
			key: 'attention-syncs',
			spec: AttentionSyncMetricVisualization,
			data: { data: [{ value: attentionSyncs }] },
			title: 'Attention Needed',
			description: 'Paused, failed, or degraded sync configurations.',
			height: 200,
		},
	];

	return {
		primaryItems,
		comparisonItems,
	};
}
