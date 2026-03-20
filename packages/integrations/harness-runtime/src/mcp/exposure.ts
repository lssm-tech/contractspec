export interface HarnessMcpToolDefinition {
	name: string;
	description: string;
	operationKey: string;
}

export interface HarnessMcpResourceDefinition {
	uriTemplate: string;
	description: string;
}

const HARNESS_TOOL_KEYS = [
	'harness.target.resolve',
	'harness.run.start',
	'harness.run.cancel',
	'harness.run.get',
	'harness.evidence.list',
	'harness.evidence.get',
	'harness.evaluation.run',
	'harness.evaluation.get',
];

export function buildHarnessMcpSurface() {
	const tools: HarnessMcpToolDefinition[] = HARNESS_TOOL_KEYS.map(
		(operationKey) => ({
			name: operationKey.replaceAll('.', '_'),
			description: `ContractSpec harness operation ${operationKey}`,
			operationKey,
		})
	);
	const resources: HarnessMcpResourceDefinition[] = [
		{
			uriTemplate: 'harness://runs/{runId}',
			description: 'Inspect one harness run.',
		},
		{
			uriTemplate: 'harness://evidence/{artifactId}',
			description: 'Inspect one harness artifact.',
		},
		{
			uriTemplate: 'harness://evaluations/{evaluationId}',
			description: 'Inspect one harness evaluation.',
		},
	];
	return { tools, resources };
}
