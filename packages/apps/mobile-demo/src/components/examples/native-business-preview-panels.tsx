import {
	MOCK_COMPANIES,
	MOCK_CONTACTS,
	MOCK_DEALS,
	MOCK_STAGES,
} from '@contractspec/example.crm-pipeline/handlers/mock-data';
import {
	MOCK_PROJECTS,
	MOCK_SUBSCRIPTION,
	MOCK_USAGE_SUMMARY,
} from '@contractspec/example.saas-boilerplate/shared/mock-data';
import {
	WORKFLOW_SYSTEM_DEMO_DEFINITIONS,
	WORKFLOW_SYSTEM_DEMO_INSTANCES,
} from '@contractspec/example.workflow-system/shared/demo-scenario';
import {
	MetricRow,
	Panel,
	PanelHeader,
	PreviewList,
} from './native-preview-primitives';

export function CrmPipelineNativePreview() {
	const wonDeals = MOCK_DEALS.filter((deal) => deal.status === 'WON');

	return (
		<Panel>
			<PanelHeader
				title="CRM pipeline"
				eyebrow="Sales workflow"
				description="Pipeline stages and deals are rendered from the same exported mock data that powers the web example."
			/>
			<MetricRow
				items={[
					['Stages', String(MOCK_STAGES.length)],
					['Deals', String(MOCK_DEALS.length)],
					['Won deals', String(wonDeals.length)],
					['Contacts', String(MOCK_CONTACTS.length)],
				]}
			/>
			<PreviewList
				eyebrow="Open pipeline"
				items={MOCK_DEALS.slice(0, 5).map((deal) => {
					const company = MOCK_COMPANIES.find(
						(item) => item.id === deal.companyId
					);
					const stage = MOCK_STAGES.find((item) => item.id === deal.stageId);

					return {
						title: deal.name,
						subtitle: `${deal.status} - ${formatCurrency(deal.value)}`,
						body: `${company?.name ?? 'Company'} - ${stage?.name ?? 'Stage'}`,
					};
				})}
			/>
		</Panel>
	);
}

export function SaasBoilerplateNativePreview() {
	return (
		<Panel>
			<PanelHeader
				title="SaaS boilerplate"
				eyebrow="Workspace shell"
				description="Projects, subscription limits, and usage summaries are rendered from exported sample data."
			/>
			<MetricRow
				items={[
					['Projects', String(MOCK_PROJECTS.length)],
					['Plan', MOCK_SUBSCRIPTION.planName],
					[
						'API used',
						`${Math.round(MOCK_USAGE_SUMMARY.apiCalls.percentUsed)}%`,
					],
				]}
			/>
			<PreviewList
				items={MOCK_PROJECTS.slice(0, 4).map((project) => ({
					title: project.name,
					subtitle: `${project.status} - ${project.tags.join(', ')}`,
					body: project.description,
				}))}
			/>
		</Panel>
	);
}

export function WorkflowSystemNativePreview() {
	const activeDefinitions = WORKFLOW_SYSTEM_DEMO_DEFINITIONS.filter(
		(definition) => definition.status === 'ACTIVE'
	);
	const openInstances = WORKFLOW_SYSTEM_DEMO_INSTANCES.filter(
		(instance) => instance.status === 'IN_PROGRESS'
	);

	return (
		<Panel>
			<PanelHeader
				title="Workflow system"
				eyebrow="Approval operations"
				description="Workflow definitions, instances, and approval states come from the exported demo scenario."
			/>
			<MetricRow
				items={[
					['Definitions', String(WORKFLOW_SYSTEM_DEMO_DEFINITIONS.length)],
					['Active', String(activeDefinitions.length)],
					['Open instances', String(openInstances.length)],
				]}
			/>
			<PreviewList
				eyebrow="Definitions"
				items={WORKFLOW_SYSTEM_DEMO_DEFINITIONS.map((definition) => ({
					title: definition.name,
					subtitle: `${definition.status} - ${definition.steps.length} steps`,
					body: definition.description,
				}))}
			/>
		</Panel>
	);
}

function formatCurrency(value: number): string {
	return new Intl.NumberFormat('en-US', {
		currency: 'USD',
		maximumFractionDigits: 0,
		style: 'currency',
	}).format(value);
}
