import { pocketFamilyOfficeConnections } from '@contractspec/example.pocket-family-office/connections/samples';
import { pocketFamilyOfficeKnowledgeSources } from '@contractspec/example.pocket-family-office/knowledge/sources.sample';
import { pocketFamilyOfficeTenantSample } from '@contractspec/example.pocket-family-office/tenant.sample';
import {
	MetricRow,
	Panel,
	PanelHeader,
	PreviewList,
} from './native-preview-primitives';

export function PocketFamilyOfficeNativePreview() {
	return (
		<Panel>
			<PanelHeader
				title="Pocket family office bindings"
				eyebrow="Tenant configuration"
				description="Tenant integrations and knowledge sources are rendered from exported sample bindings."
			/>
			<MetricRow
				items={[
					['Connections', String(pocketFamilyOfficeConnections.length)],
					[
						'Knowledge sources',
						String(pocketFamilyOfficeKnowledgeSources.length),
					],
					[
						'Feature flags',
						String(pocketFamilyOfficeTenantSample.featureFlags?.length ?? 0),
					],
				]}
			/>
			<PreviewList
				eyebrow="Connections"
				items={pocketFamilyOfficeConnections.slice(0, 6).map((connection) => ({
					title: connection.meta.label,
					subtitle: `${connection.status} - ${connection.ownershipMode}`,
					body: connection.meta.integrationKey,
				}))}
			/>
		</Panel>
	);
}
