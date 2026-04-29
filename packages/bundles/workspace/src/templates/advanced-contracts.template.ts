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

export interface ExampleSpecTemplateData extends BaseTemplateData {
	packageName?: string;
}

export interface AgentSpecTemplateData {
	key: string;
	version: string;
	description: string;
	owners: string[];
	tags: string[];
	stability: Stability;
	instructions: string;
}

export interface ProductIntentSpecTemplateData extends BaseTemplateData {
	id?: string;
	question: string;
}

export interface HarnessScenarioSpecTemplateData extends BaseTemplateData {}

export interface HarnessSuiteSpecTemplateData extends BaseTemplateData {
	scenarioKey: string;
	scenarioVersion?: string;
}

export interface PwaAppManifestSpecTemplateData extends BaseTemplateData {
	appId?: string;
	currentRelease?: string;
}

export function generateExampleSpec(data: ExampleSpecTemplateData): string {
	const packageName =
		data.packageName ??
		`@contractspec/example.${toKebabCase(data.key.split('.').at(-1) ?? data.key)}`;
	const exportName = `${toPascalCase(data.key)}Example`;

	return `import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ${exportName} = defineExample({
  meta: {
    key: '${data.key}',
    version: '${data.version}',
    title: '${escape(resolveTitle(data))}',
    description: '${escape(data.description)}',
    kind: 'template',
    visibility: 'experimental',
    stability: '${data.stability}',
    owners: [${renderStringArray(data.owners)}],
    tags: [${renderStringArray(data.tags)}],
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['playground', 'specs'] },
    studio: { enabled: false, installable: false },
    mcp: { enabled: false },
  },
  entrypoints: {
    packageName: '${packageName}',
  },
});

export default ${exportName};
export { ${exportName} };
`;
}

export function generateAgentSpec(data: AgentSpecTemplateData): string {
	return `import { defineAgent } from '@contractspec/lib.contracts-spec/agent';

export const ${toPascalCase(data.key)}Agent = defineAgent({
  meta: {
    key: '${data.key}',
    version: '${data.version}',
    description: '${escape(data.description)}',
    owners: [${renderStringArray(data.owners)}],
    tags: [${renderStringArray(data.tags)}],
    stability: '${data.stability}',
  },
  instructions: '${escape(data.instructions)}',
  tools: [{ name: 'todo' }],
});
`;
}

export function generateProductIntentSpec(
	data: ProductIntentSpecTemplateData
): string {
	return `import { defineProductIntentSpec } from '@contractspec/lib.contracts-spec/product-intent';

export const ${toPascalCase(data.key)}ProductIntent = defineProductIntentSpec({
  id: '${data.id ?? `${data.key}-run`}',
  meta: {
    key: '${data.key}',
    version: '${data.version}',
    title: '${escape(resolveTitle(data))}',
    description: '${escape(data.description)}',
    goal: 'TODO: capture the desired product outcome',
    context: 'TODO: capture the decision context',
    stability: '${data.stability}',
    owners: [${renderStringArray(data.owners)}],
    tags: [${renderStringArray(data.tags)}],
  },
  question: '${escape(data.question)}',
  insights: { insights: [] },
});
`;
}

export function generateHarnessScenarioSpec(
	data: HarnessScenarioSpecTemplateData
): string {
	return `import { defineHarnessScenario } from '@contractspec/lib.contracts-spec/harness';

export const ${toPascalCase(data.key)}HarnessScenario = defineHarnessScenario({
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
    isolation: 'preview',
    preferredTargets: ['preview'],
  },
  allowedModes: ['deterministic-browser'],
  steps: [
    {
      key: 'open-home',
      description: 'Open the target application',
      actionClass: 'navigate',
      intent: 'Navigate to the primary page under test.',
    },
  ],
  assertions: [
    {
      key: 'step-completes',
      type: 'step-status',
      description: 'TODO: replace with a real scenario assertion',
      match: 'completed',
    },
  ],
});
`;
}

export function generateHarnessSuiteSpec(
	data: HarnessSuiteSpecTemplateData
): string {
	return `import { defineHarnessSuite } from '@contractspec/lib.contracts-spec/harness';

export const ${toPascalCase(data.key)}HarnessSuite = defineHarnessSuite({
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
  scenarios: [
    {
      scenario: {
        key: '${data.scenarioKey}',
        version: '${data.scenarioVersion ?? '1.0.0'}',
      },
      required: true,
      weight: 1,
    },
  ],
  summary: '${escape(data.description)}',
  tags: [${renderStringArray(data.tags)}],
});
`;
}

export function generatePwaAppManifestSpec(
	data: PwaAppManifestSpecTemplateData
): string {
	const currentRelease = data.currentRelease ?? data.version;

	return `import { definePwaAppManifest } from '@contractspec/lib.contracts-spec/pwa';

export const ${toPascalCase(data.key)}PwaApp = definePwaAppManifest({
  meta: {
    key: '${data.key}',
    version: '${data.version}',
    appId: '${data.appId ?? data.key}',
    title: '${escape(resolveTitle(data))}',
    description: '${escape(data.description)}',
    domain: '${escape(resolveDomain(data))}',
    stability: '${data.stability}',
    owners: [${renderStringArray(data.owners)}],
    tags: [${renderStringArray(data.tags)}],
  },
  currentRelease: '${currentRelease}',
  defaultUpdatePolicy: {
    mode: 'optional',
    minSupportedVersion: '${currentRelease}',
  },
  releases: [
    {
      version: '${currentRelease}',
      releasedAt: new Date().toISOString(),
      notes: 'Initial release manifest.',
    },
  ],
  offline: {
    supported: true,
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

function toKebabCase(value: string): string {
	return value
		.replace(/\./g, '-')
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.toLowerCase();
}

function escape(value: string): string {
	return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
