import { Command } from 'commander';
import {
	type ReleaseAuthoringCliOptions,
	type ReleaseBriefCliOptions,
	type ReleaseBuildCliOptions,
	type ReleaseCheckCliOptions,
	runReleaseBrief,
	runReleaseBuild,
	runReleaseCheck,
	runReleaseEdit,
	runReleaseInit,
	runReleasePrepare,
	withReleaseErrorHandling,
} from './actions';

export function createReleaseCommand(): Command {
	const command = new Command('release').description(
		'Scaffold, validate, and publish canonical release communication artifacts'
	);

	command
		.command('prepare')
		.description(
			'AI-assisted guided flow for creating or updating release artifacts'
		)
		.option('-b, --baseline <ref>', 'Git ref to compare against', 'main')
		.option('-s, --slug <slug>', 'Explicit release slug')
		.option('--summary <summary>', 'Starting release summary')
		.option('--packages <names>', 'Comma-separated package names')
		.option('--patch', 'Force a patch release')
		.option('--minor', 'Force a minor release')
		.option('--major', 'Force a major release')
		.option(
			'--provider <provider>',
			'AI provider override for release suggestions'
		)
		.option('--model <model>', 'AI model override for release suggestions')
		.action((options: ReleaseAuthoringCliOptions) =>
			withReleaseErrorHandling(() => runReleasePrepare(options))
		);

	command
		.command('edit')
		.argument('<slug>', 'Release slug to edit')
		.description(
			'Guided flow for revising one release capsule without raw YAML edits'
		)
		.option('-b, --baseline <ref>', 'Git ref to compare against', 'main')
		.option(
			'--provider <provider>',
			'AI provider override for release suggestions'
		)
		.option('--model <model>', 'AI model override for release suggestions')
		.action((slug: string, options: ReleaseAuthoringCliOptions) =>
			withReleaseErrorHandling(() => runReleaseEdit(slug, options))
		);

	command
		.command('init')
		.description(
			'Legacy scaffold: create a changeset and companion release capsule'
		)
		.option('-b, --baseline <ref>', 'Git ref to compare against', 'main')
		.option('-s, --slug <slug>', 'Explicit changeset slug')
		.option('--summary <summary>', 'Release summary for the changeset')
		.option('--packages <names>', 'Comma-separated package names')
		.option('--patch', 'Force a patch release')
		.option('--minor', 'Force a minor release')
		.option('--major', 'Force a major release')
		.action((options: ReleaseAuthoringCliOptions) =>
			withReleaseErrorHandling(() => runReleaseInit(options))
		);

	command
		.command('build')
		.description('Build generated release artifacts in generated/releases')
		.option('-o, --output <dir>', 'Output directory', 'generated/releases')
		.option('--dry-run', 'Preview output without writing files')
		.action((options: ReleaseBuildCliOptions) =>
			withReleaseErrorHandling(() => runReleaseBuild(options))
		);

	command
		.command('check')
		.description('Validate release communication completeness')
		.option('-b, --baseline <ref>', 'Git ref to compare against', 'main')
		.option(
			'-o, --output <dir>',
			'Artifact output directory',
			'generated/releases'
		)
		.option('--strict', 'Fail on missing generated artifacts')
		.action((options: ReleaseCheckCliOptions) =>
			withReleaseErrorHandling(() => runReleaseCheck(options))
		);

	command
		.command('brief')
		.description(
			'Emit maintainer, customer, migration, and agent upgrade views'
		)
		.option('-s, --slug <slug>', 'Specific release slug to render')
		.option('--agent <target>', 'Agent target for the upgrade prompt', 'codex')
		.action((options: ReleaseBriefCliOptions) =>
			withReleaseErrorHandling(() => runReleaseBrief(options))
		);

	return command;
}
