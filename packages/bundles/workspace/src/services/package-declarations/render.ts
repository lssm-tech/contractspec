import { generateExampleSpec } from '../../templates/advanced-contracts.template';
import { createPackageTargetSpecSource } from '../package-scaffold';
import {
	buildDeclarationTags,
	buildDomain,
	buildExportName,
	buildPackageDeclarationKey,
	buildPackageTitle,
} from './helpers';
import type { WorkspacePackageInfo } from './types';

export interface PackageSpecRefs {
	operations: Array<{ key: string; version: string }>;
	events: Array<{ key: string; version: string }>;
	presentations: Array<{ key: string; version: string }>;
	experiments: Array<{ key: string; version: string }>;
	workflows: Array<{ key: string; version: string }>;
	dataViews: Array<{ key: string; version: string }>;
	capabilities: Array<{ key: string; version: string }>;
	features: Array<{ key: string; version: string }>;
}

export function renderPackageDeclaration(input: {
	pkg: WorkspacePackageInfo;
	refs: PackageSpecRefs;
	owners: string[];
	defaultTags: string[];
}): string {
	const { pkg, refs, owners, defaultTags } = input;
	const meta = {
		key: buildPackageDeclarationKey(pkg.relativePackageRoot),
		version: '1.0.0',
		title: buildPackageTitle(pkg.packageDirName),
		description:
			pkg.description ??
			`ContractSpec package declaration for ${pkg.packageName}.`,
		domain: buildDomain(pkg.packageDirName),
		owners,
		tags: buildDeclarationTags(pkg.packageDirName, pkg.kind, defaultTags),
		stability: 'experimental' as const,
	};

	switch (pkg.target) {
		case 'feature':
			return renderFeatureDeclaration(pkg, refs, meta);
		case 'integration':
			return renderIntegrationDeclaration(pkg, refs, meta);
		case 'app-config':
			return renderAppConfigDeclaration(pkg, refs, meta);
		case 'module-bundle':
			return createPackageTargetSpecSource({
				target: 'module-bundle',
				key: meta.key,
				title: meta.title,
				description: meta.description,
				exportName: buildExportName('module-bundle', pkg.packageDirName),
			});
		case 'example':
			return generateExampleSpec({
				key: meta.key,
				version: meta.version,
				description: meta.description,
				title: meta.title,
				domain: meta.domain,
				owners: meta.owners,
				tags: meta.tags,
				stability: meta.stability,
				packageName: pkg.packageName,
			});
	}
}

function renderFeatureDeclaration(
	pkg: WorkspacePackageInfo,
	refs: PackageSpecRefs,
	meta: FeatureMeta
): string {
	const sections = [
		renderVersionedSection('operations', refs.operations),
		renderVersionedSection('events', refs.events),
		renderVersionedSection('presentations', refs.presentations),
		renderVersionedSection('experiments', refs.experiments),
		renderVersionedSection('workflows', refs.workflows),
		renderVersionedSection('dataViews', refs.dataViews),
	].filter(Boolean);

	const defineFeatureImport =
		pkg.packageName === '@contractspec/lib.contracts-spec'
			? "import { defineFeature } from './features';"
			: "import { defineFeature } from '@contractspec/lib.contracts-spec/features';";

	return `${defineFeatureImport}

export const ${buildExportName('feature', pkg.packageDirName)} = defineFeature({
  meta: ${renderMeta(meta)},
${sections.length > 0 ? `${sections.join('\n')}\n` : ''}});
`;
}

function renderIntegrationDeclaration(
	pkg: WorkspacePackageInfo,
	refs: PackageSpecRefs,
	meta: FeatureMeta
): string {
	const capabilities = refs.capabilities
		.map((ref) => `      { key: '${ref.key}', version: '${ref.version}' },`)
		.join('\n');

	return `import { defineIntegration } from '@contractspec/lib.contracts-integrations';
import { defineSchemaModel } from '@contractspec/lib.schema';

const ${buildExportName('integration', pkg.packageDirName)}Config = defineSchemaModel({
  name: '${buildPackageTitle(pkg.packageDirName).replace(/\s+/g, '')}IntegrationConfig',
  description: 'Managed configuration for ${pkg.packageName}.',
  fields: {},
});

const ${buildExportName('integration', pkg.packageDirName)}Secrets = defineSchemaModel({
  name: '${buildPackageTitle(pkg.packageDirName).replace(/\s+/g, '')}IntegrationSecret',
  description: 'Secret material for ${pkg.packageName}.',
  fields: {},
});

export const ${buildExportName('integration', pkg.packageDirName)} = defineIntegration({
  meta: {
    ...${renderMetaObject(meta)},
    category: 'custom',
  },
  supportedModes: ['managed'],
  capabilities: {
    provides: [
${capabilities || '      // Add capability refs here'}
    ],
  },
  configSchema: { schema: ${buildExportName('integration', pkg.packageDirName)}Config, example: {} },
  secretSchema: { schema: ${buildExportName('integration', pkg.packageDirName)}Secrets, example: {} },
  healthCheck: { method: 'ping', timeoutMs: 5000 },
});
`;
}

function renderAppConfigDeclaration(
	pkg: WorkspacePackageInfo,
	refs: PackageSpecRefs,
	meta: FeatureMeta
): string {
	const features = refs.features
		.map((ref) => `      { key: '${ref.key}' },`)
		.join('\n');
	const workflows = renderNamedRefs(refs.workflows);
	const dataViews = renderNamedRefs(refs.dataViews);
	const capabilities = refs.capabilities
		.map((ref) => `      { key: '${ref.key}', version: '${ref.version}' },`)
		.join('\n');

	return `import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const ${buildExportName('app-config', pkg.packageDirName)} = defineAppConfig({
  meta: {
    ...${renderMetaObject(meta)},
    appId: '${escape(pkg.packageDirName)}',
  },
  capabilities: {
    enabled: [
${capabilities || '      // Add capability refs here'}
    ],
  },${features ? `\n  features: {\n    include: [\n${features}\n    ],\n  },` : ''}${dataViews ? `\n  dataViews: {\n${dataViews}\n  },` : ''}${workflows ? `\n  workflows: {\n${workflows}\n  },` : ''}
});
`;
}

type FeatureMeta = {
	key: string;
	version: string;
	title: string;
	description: string;
	domain: string;
	owners: string[];
	tags: string[];
	stability: 'experimental';
};

function renderVersionedSection(
	name: string,
	refs: Array<{ key: string; version: string }>
): string {
	if (refs.length === 0) return '';
	return `  ${name}: [\n${refs
		.map((ref) => `    { key: '${ref.key}', version: '${ref.version}' },`)
		.join('\n')}\n  ],`;
}

function renderNamedRefs(
	refs: Array<{ key: string; version: string }>
): string {
	return refs
		.map(
			(ref, index) => `    ${index === 0 ? 'primary' : `item${index + 1}`}: {
      key: '${ref.key}',
      version: '${ref.version}',
    },`
		)
		.join('\n');
}

function renderMeta(meta: FeatureMeta): string {
	return `{
    key: '${meta.key}',
    version: '${meta.version}',
    title: '${escape(meta.title)}',
    description: '${escape(meta.description)}',
    domain: '${escape(meta.domain)}',
    owners: [${meta.owners.map((owner) => `'${escape(owner)}'`).join(', ')}],
    tags: [${meta.tags.map((tag) => `'${escape(tag)}'`).join(', ')}],
    stability: '${meta.stability}',
  }`;
}

function renderMetaObject(meta: FeatureMeta): string {
	return `{ key: '${meta.key}', version: '${meta.version}', title: '${escape(meta.title)}', description: '${escape(meta.description)}', domain: '${escape(meta.domain)}', owners: [${meta.owners
		.map((owner) => `'${escape(owner)}'`)
		.join(', ')}], tags: [${meta.tags
		.map((tag) => `'${escape(tag)}'`)
		.join(', ')}], stability: '${meta.stability}' }`;
}

function escape(value: string): string {
	return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
