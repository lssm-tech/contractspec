import { pocketFamilyOfficeBlueprint } from '../blueprint';
import { pocketFamilyOfficeConnections } from '../connections/samples';
import { pocketFamilyOfficeKnowledgeSources } from '../knowledge/sources.sample';
import { pocketFamilyOfficeTenantSample } from '../tenant.sample';

const enabledCapabilities =
	pocketFamilyOfficeBlueprint.capabilities?.enabled ?? [];
const integrationSlots = pocketFamilyOfficeBlueprint.integrationSlots ?? [];
const workflowPointers = Object.values(
	pocketFamilyOfficeBlueprint.workflows ?? {}
);
const tenantKnowledge = pocketFamilyOfficeTenantSample.knowledge ?? [];

export const pocketFamilyOfficePreviewMetrics = [
	{
		label: 'Capabilities',
		value: String(enabledCapabilities.length),
	},
	{
		label: 'Integrations',
		value: String(integrationSlots.length),
	},
	{
		label: 'Workflows',
		value: String(workflowPointers.length),
	},
	{
		label: 'Knowledge spaces',
		value: String(tenantKnowledge.length),
	},
] as const;

export const pocketFamilyOfficePreviewConnections =
	pocketFamilyOfficeConnections.slice(0, 5).map((connection) => ({
		id: connection.meta.id,
		label: connection.meta.label,
		mode: connection.ownershipMode,
		status: connection.status,
	}));

export const pocketFamilyOfficePreviewKnowledge =
	pocketFamilyOfficeKnowledgeSources.map((source) => ({
		id: source.meta.id,
		label: source.meta.label,
		type: source.meta.sourceType,
		enabled: source.syncSchedule?.enabled ?? false,
	}));

export const pocketFamilyOfficePreviewWorkflows = workflowPointers;
