import type { LegacySpecType } from './spec-types';

export type PackageAuthoringTargetId =
	| 'module-bundle'
	| 'builder-spec'
	| 'provider-spec';

export type AuthoringTargetId = LegacySpecType | PackageAuthoringTargetId;

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
		},
		{
			id: 'event',
			title: 'Event',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.event.ts',
		},
		{
			id: 'presentation',
			title: 'Presentation',
			posture: 'file',
			materialization: 'runtime',
			validation: 'runtime-implementation',
			defaultExtension: '.presentation.ts',
		},
		{
			id: 'form',
			title: 'Form',
			posture: 'file',
			materialization: 'runtime',
			validation: 'runtime-implementation',
			defaultExtension: '.form.ts',
		},
		{
			id: 'feature',
			title: 'Feature',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.feature.ts',
		},
		{
			id: 'theme',
			title: 'Theme',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.theme.ts',
		},
		{
			id: 'workflow',
			title: 'Workflow',
			posture: 'file',
			materialization: 'runtime',
			validation: 'runtime-implementation',
			defaultExtension: '.workflow.ts',
		},
		{
			id: 'data-view',
			title: 'Data view',
			posture: 'file',
			materialization: 'runtime',
			validation: 'runtime-implementation',
			defaultExtension: '.data-view.ts',
		},
		{
			id: 'migration',
			title: 'Migration',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.migration.ts',
		},
		{
			id: 'telemetry',
			title: 'Telemetry',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.telemetry.ts',
		},
		{
			id: 'experiment',
			title: 'Experiment',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.experiment.ts',
		},
		{
			id: 'app-config',
			title: 'App blueprint',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.app-config.ts',
		},
		{
			id: 'integration',
			title: 'Integration',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.integration.ts',
		},
		{
			id: 'knowledge',
			title: 'Knowledge space',
			posture: 'file',
			materialization: 'docs',
			validation: 'structure',
			defaultExtension: '.knowledge.ts',
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
