import type { AuthoringContractSpecType } from './spec-types';

export type PackageAuthoringTargetId =
	| 'module-bundle'
	| 'builder-spec'
	| 'provider-spec';

export type ConfigurableFolderConventionKey =
	| 'operations'
	| 'events'
	| 'presentations'
	| 'forms'
	| 'capabilities'
	| 'policies'
	| 'tests'
	| 'translations';

export type AuthoringTargetId =
	| AuthoringContractSpecType
	| PackageAuthoringTargetId;

export type AuthoringTargetPosture = 'file' | 'package';

export type AuthoringMaterializationKind =
	| 'runtime'
	| 'package'
	| 'docs'
	| 'none';

export type AuthoringValidationKind =
	| 'structure'
	| 'package-scaffold'
	| 'runtime-implementation';

export interface AuthoringTargetDefinition {
	id: AuthoringTargetId;
	title: string;
	posture: AuthoringTargetPosture;
	materialization: AuthoringMaterializationKind;
	validation: AuthoringValidationKind;
	defaultExtension: string;
	defaultBaseDir?: string;
	defaultPackagePrefix?: string;
	defaultSubdirectory?: string;
	folderConventionKey?: ConfigurableFolderConventionKey;
}

export const AUTHORING_TARGET_DEFINITIONS: readonly AuthoringTargetDefinition[] =
	[
		{
			id: 'operation',
			title: 'Operation',
			posture: 'file',
			materialization: 'runtime',
			validation: 'runtime-implementation',
			defaultExtension: '.contracts.ts',
			folderConventionKey: 'operations',
		},
		{
			id: 'event',
			title: 'Event',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.event.ts',
			folderConventionKey: 'events',
		},
		{
			id: 'presentation',
			title: 'Presentation',
			posture: 'file',
			materialization: 'runtime',
			validation: 'runtime-implementation',
			defaultExtension: '.presentation.ts',
			folderConventionKey: 'presentations',
		},
		{
			id: 'feature',
			title: 'Feature',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.feature.ts',
			defaultSubdirectory: 'features',
		},
		{
			id: 'capability',
			title: 'Capability',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.capability.ts',
			folderConventionKey: 'capabilities',
		},
		{
			id: 'data-view',
			title: 'Data view',
			posture: 'file',
			materialization: 'runtime',
			validation: 'runtime-implementation',
			defaultExtension: '.data-view.ts',
			defaultSubdirectory: 'data-views',
		},
		{
			id: 'visualization',
			title: 'Visualization',
			posture: 'file',
			materialization: 'runtime',
			validation: 'structure',
			defaultExtension: '.visualization.ts',
			defaultSubdirectory: 'visualizations',
		},
		{
			id: 'form',
			title: 'Form',
			posture: 'file',
			materialization: 'runtime',
			validation: 'runtime-implementation',
			defaultExtension: '.form.ts',
			folderConventionKey: 'forms',
		},
		{
			id: 'agent',
			title: 'Agent',
			posture: 'file',
			materialization: 'runtime',
			validation: 'structure',
			defaultExtension: '.agent.ts',
			defaultSubdirectory: 'agents',
		},
		{
			id: 'migration',
			title: 'Migration',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.migration.ts',
			defaultSubdirectory: 'migrations',
		},
		{
			id: 'workflow',
			title: 'Workflow',
			posture: 'file',
			materialization: 'runtime',
			validation: 'runtime-implementation',
			defaultExtension: '.workflow.ts',
			defaultSubdirectory: 'workflows',
		},
		{
			id: 'experiment',
			title: 'Experiment',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.experiment.ts',
			defaultSubdirectory: 'experiments',
		},
		{
			id: 'integration',
			title: 'Integration',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.integration.ts',
			defaultSubdirectory: 'integrations',
		},
		{
			id: 'theme',
			title: 'Theme',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.theme.ts',
			defaultSubdirectory: 'themes',
		},
		{
			id: 'knowledge',
			title: 'Knowledge space',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.knowledge.ts',
			defaultSubdirectory: 'knowledge',
		},
		{
			id: 'telemetry',
			title: 'Telemetry',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.telemetry.ts',
			defaultSubdirectory: 'telemetry',
		},
		{
			id: 'example',
			title: 'Example',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.ts',
		},
		{
			id: 'app-config',
			title: 'App blueprint',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.app-config.ts',
			defaultSubdirectory: 'app-config',
		},
		{
			id: 'product-intent',
			title: 'Product intent',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.product-intent.ts',
			defaultSubdirectory: 'product-intent',
		},
		{
			id: 'policy',
			title: 'Policy',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.policy.ts',
			folderConventionKey: 'policies',
		},
		{
			id: 'test-spec',
			title: 'Test spec',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.test-spec.ts',
			folderConventionKey: 'tests',
		},
		{
			id: 'harness-scenario',
			title: 'Harness scenario',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.harness-scenario.ts',
			defaultSubdirectory: 'harness/scenarios',
		},
		{
			id: 'harness-suite',
			title: 'Harness suite',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.harness-suite.ts',
			defaultSubdirectory: 'harness/suites',
		},
		{
			id: 'job',
			title: 'Job',
			posture: 'file',
			materialization: 'runtime',
			validation: 'structure',
			defaultExtension: '.job.ts',
			defaultSubdirectory: 'jobs',
		},
		{
			id: 'translation',
			title: 'Translation',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.translation.ts',
			folderConventionKey: 'translations',
		},
		{
			id: 'module-bundle',
			title: 'Module bundle',
			posture: 'package',
			materialization: 'package',
			validation: 'package-scaffold',
			defaultExtension: '.bundle.ts',
			defaultBaseDir: 'packages/bundles',
			defaultPackagePrefix: '@contractspec/bundle.',
		},
		{
			id: 'builder-spec',
			title: 'Builder spec',
			posture: 'package',
			materialization: 'package',
			validation: 'package-scaffold',
			defaultExtension: '.builder-spec.ts',
			defaultBaseDir: 'packages/libs',
			defaultPackagePrefix: '@contractspec/lib.',
		},
		{
			id: 'provider-spec',
			title: 'Provider spec',
			posture: 'package',
			materialization: 'package',
			validation: 'package-scaffold',
			defaultExtension: '.provider-spec.ts',
			defaultBaseDir: 'packages/libs',
			defaultPackagePrefix: '@contractspec/lib.',
		},
	] as const;
