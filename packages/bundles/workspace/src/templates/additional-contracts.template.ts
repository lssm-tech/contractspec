type Stability = 'experimental' | 'beta' | 'stable' | 'deprecated';

interface BaseTemplateData {
	key: string;
	version: string;
	description: string;
	owners: string[];
	tags: string[];
	stability: Stability;
	title?: string;
	domain?: string;
}

export interface CapabilitySpecTemplateData extends BaseTemplateData {
	kind?: 'api' | 'event' | 'data' | 'ui' | 'integration';
}

export interface PolicySpecTemplateData extends BaseTemplateData {
	scope?: 'global' | 'feature' | 'operation';
}

export interface TestSpecTemplateData extends BaseTemplateData {
	targetType: 'operation' | 'workflow';
	targetKey: string;
	targetVersion?: string;
}

export interface TranslationSpecTemplateData extends BaseTemplateData {
	locale: string;
	fallback?: string;
}

export interface JobSpecTemplateData extends BaseTemplateData {
	intervalMs?: number;
}

export interface VisualizationSpecTemplateData extends BaseTemplateData {
	sourceOperationKey: string;
	sourceOperationVersion?: string;
}

export function generateCapabilitySpec(
	data: CapabilitySpecTemplateData
): string {
	return `import { defineCapability } from '@contractspec/lib.contracts-spec/capabilities';

export const ${toPascalCase(data.key)}Capability = defineCapability({
  meta: {
    key: '${data.key}',
    version: '${data.version}',
    kind: '${data.kind ?? 'api'}',
    title: '${escape(resolveTitle(data))}',
    description: '${escape(data.description)}',
    domain: '${escape(resolveDomain(data))}',
    owners: [${renderStringArray(data.owners)}],
    tags: [${renderStringArray(data.tags)}],
    stability: '${data.stability}',
  },
  provides: [],
  requires: [],
});
`;
}

export function generatePolicySpec(data: PolicySpecTemplateData): string {
	return `import { definePolicy } from '@contractspec/lib.contracts-spec/policy';

export const ${toPascalCase(data.key)}Policy = definePolicy({
  meta: {
    key: '${data.key}',
    version: '${data.version}',
    title: '${escape(resolveTitle(data))}',
    description: '${escape(data.description)}',
    domain: '${escape(resolveDomain(data))}',
    owners: [${renderStringArray(data.owners)}],
    tags: [${renderStringArray(data.tags)}],
    stability: '${data.stability}',
    scope: '${data.scope ?? 'feature'}',
  },
  rules: [
    {
      effect: 'allow',
      actions: ['read'],
      resource: { type: '${escape(resolveDomain(data))}' },
      reason: 'TODO: replace with real access rules',
    },
  ],
});
`;
}

export function generateTestSpec(data: TestSpecTemplateData): string {
	const targetVersion = data.targetVersion ?? '1.0.0';
	const targetRef = `{ key: '${data.targetKey}', version: '${targetVersion}' }`;

	return `import { defineTestSpec } from '@contractspec/lib.contracts-spec/tests';

export const ${toPascalCase(data.key)}TestSpec = defineTestSpec({
  meta: {
    key: '${data.key}',
    version: '${data.version}',
    title: '${escape(resolveTitle(data))}',
    description: '${escape(data.description)}',
    domain: '${escape(resolveDomain(data))}',
    owners: [${renderStringArray(data.owners)}],
    tags: [${renderStringArray(data.tags)}],
    stability: '${data.stability}',
  },
  target: {
    type: '${data.targetType}',
    ${data.targetType}: ${targetRef},
  },
  scenarios: [
    {
      key: 'success',
      when: { ${data.targetType}: { key: '${data.targetKey}' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
  ],
});
`;
}

export function generateTranslationSpec(
	data: TranslationSpecTemplateData
): string {
	return `import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const ${toPascalCase(`${data.key}.${data.locale}`)}Translation = defineTranslation({
  meta: {
    key: '${data.key}',
    version: '${data.version}',
    domain: '${escape(resolveDomain(data))}',
    description: '${escape(data.description)}',
    owners: [${renderStringArray(data.owners)}],
    tags: [${renderStringArray(data.tags)}],
    stability: '${data.stability}',
  },
  locale: '${data.locale}',
  fallback: '${data.fallback ?? data.locale}',
  messages: {
    '${data.key}.title': {
      value: '${escape(resolveTitle(data))}',
      description: 'TODO: replace with a real localized message',
    },
  },
});
`;
}

export function generateJobSpec(data: JobSpecTemplateData): string {
	return `import { defineJob } from '@contractspec/lib.contracts-spec/jobs';

export const ${toPascalCase(data.key)}Job = defineJob({
  meta: {
    key: '${data.key}',
    version: '${data.version}',
    title: '${escape(resolveTitle(data))}',
    description: '${escape(data.description)}',
    domain: '${escape(resolveDomain(data))}',
    owners: [${renderStringArray(data.owners)}],
    tags: [${renderStringArray(data.tags)}],
    stability: '${data.stability}',
  },
  payload: { schema: {} },
  schedule: { intervalMs: ${data.intervalMs ?? 60000} },
});
`;
}

export function generateVisualizationSpec(
	data: VisualizationSpecTemplateData
): string {
	return `import { defineVisualization } from '@contractspec/lib.contracts-spec/visualizations';

export const ${toPascalCase(data.key)}Visualization = defineVisualization({
  meta: {
    key: '${data.key}',
    version: '${data.version}',
    title: '${escape(resolveTitle(data))}',
    description: '${escape(data.description)}',
    goal: 'TODO: describe the decision this visualization supports',
    context: 'TODO: describe where this visualization appears',
    domain: '${escape(resolveDomain(data))}',
    owners: [${renderStringArray(data.owners)}],
    tags: [${renderStringArray(data.tags)}],
    stability: '${data.stability}',
  },
  source: {
    primary: {
      key: '${data.sourceOperationKey}',
      version: '${data.sourceOperationVersion ?? '1.0.0'}',
    },
    resultPath: 'data',
  },
  visualization: {
    kind: 'metric',
    measures: [{ key: 'value', label: 'Value', dataPath: 'value', format: 'number' }],
    measure: 'value',
  },
});
`;
}

function resolveTitle(data: BaseTemplateData): string {
	return data.title ?? toTitleCase(data.key.split('.').at(-1) ?? data.key);
}

function resolveDomain(data: BaseTemplateData): string {
	return data.domain ?? data.key.split('.')[0] ?? 'contractspec';
}

function renderStringArray(values: string[]): string {
	return values.map((value) => `'${escape(value)}'`).join(', ');
}

function toPascalCase(value: string): string {
	return value
		.split(/[^a-zA-Z0-9]+/)
		.filter(Boolean)
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join('');
}

function toTitleCase(value: string): string {
	return value
		.split(/[-_.]/)
		.filter(Boolean)
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(' ');
}

function escape(value: string): string {
	return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
