import type {
	AgentTarget,
	GeneratedReleaseManifest,
	GeneratedReleaseManifestEntry,
	UpgradePlan,
} from '@contractspec/lib.contracts-spec';

function formatPackages(entry: GeneratedReleaseManifestEntry): string[] {
	return entry.packages.map((pkg) => {
		const version = pkg.version ? `@${pkg.version}` : '';
		return `- ${pkg.name}${version} (${pkg.releaseType})`;
	});
}

function formatSteps(steps: string[]): string[] {
	return steps.map((step) => `  - ${step}`);
}

export function renderMaintainerSummary(
	entry: GeneratedReleaseManifestEntry
): string {
	const lines = [
		`### ${entry.summary}`,
		`- Slug: ${entry.slug}`,
		`- Date: ${entry.date}`,
		`- Breaking: ${entry.isBreaking ? 'yes' : 'no'}`,
		...formatPackages(entry),
	];

	if (entry.deprecations.length > 0) {
		lines.push('- Deprecations:');
		lines.push(...entry.deprecations.map((item) => `  - ${item}`));
	}

	return lines.join('\n');
}

export function renderCustomerPatchNote(
	entry: GeneratedReleaseManifestEntry
): string {
	const lines = [`### ${entry.summary}`, ...formatPackages(entry)];

	for (const instruction of entry.migrationInstructions) {
		lines.push(`- ${instruction.title}: ${instruction.summary}`);
	}

	return lines.join('\n');
}

export function renderMigrationGuide(
	entry: GeneratedReleaseManifestEntry
): string {
	const lines = [`### ${entry.summary}`];

	if (entry.migrationInstructions.length === 0) {
		lines.push('- No manual migration steps recorded.');
		return lines.join('\n');
	}

	for (const instruction of entry.migrationInstructions) {
		lines.push(`- ${instruction.title}: ${instruction.summary}`);
		lines.push(...formatSteps(instruction.steps));
	}

	return lines.join('\n');
}

export function renderPatchNotes(manifest: GeneratedReleaseManifest): string {
	return [
		'# Patch Notes',
		'',
		...manifest.releases.map(renderMaintainerSummary),
	].join('\n\n');
}

export function renderCustomerGuide(
	manifest: GeneratedReleaseManifest
): string {
	return [
		'# Customer Upgrade Guide',
		'',
		...manifest.releases.map(renderMigrationGuide),
	].join('\n\n');
}

export function renderUpgradeChecklist(plan: UpgradePlan): string {
	if (plan.steps.length === 0) {
		return '- No release-managed upgrade steps were found.';
	}

	return plan.steps
		.map((step) =>
			[
				`- [${step.level}] ${step.title}: ${step.summary}`,
				...formatSteps(step.instructions),
			].join('\n')
		)
		.join('\n');
}

export function renderUpgradePrompt(
	agent: AgentTarget,
	plan: UpgradePlan
): string {
	const targets = plan.targetPackages
		.map(
			(pkg) =>
				`${pkg.name}: ${pkg.currentVersion ?? 'unknown'} -> ${pkg.targetVersion ?? 'latest'}`
		)
		.join('\n');

	return [
		`Apply the ContractSpec upgrade plan in this workspace using ${agent}.`,
		'',
		'Target packages:',
		targets || '- No package version targets were inferred.',
		'',
		'Required steps:',
		renderUpgradeChecklist(plan),
	].join('\n');
}
