import type { OnboardingPlan, OnboardingTrackDefinition } from './types';

export function renderOnboardingGuides(plan: Omit<OnboardingPlan, 'guides'>) {
	return {
		agentGuide: renderAgentGuide(plan),
		humanGuide: renderHumanGuide(plan),
	};
}

function renderAgentGuide(plan: Omit<OnboardingPlan, 'guides'>) {
	const lines = [
		'# ContractSpec Onboarding Guide',
		'',
		`Primary track: \`${plan.primaryTrack.id}\``,
		'',
		'Use the repo-local onboarding tracks before inventing new abstractions.',
		'',
		'## Workflow',
		'',
		'- Run `contractspec connect adoption resolve --family <family> --stdin` before adding new surfaces.',
		'- Prefer the starter example and the listed ContractSpec packages for the active track.',
		'- Treat `USAGE.md` as the human-facing implementation path and this file as AI operating guidance.',
		'- When Builder is not configured, recommend `contractspec init --preset builder-managed|builder-local|builder-hybrid` instead of inventing a runtime target model.',
		'',
		'## Recommended Tracks',
		'',
	];

	for (const recommendation of plan.recommendations) {
		lines.push(
			...renderAgentTrackSection(recommendation.track, recommendation.reason)
		);
	}

	return lines.join('\n');
}

function renderAgentTrackSection(
	track: OnboardingTrackDefinition,
	reason: string
) {
	const lines = [
		`### ${track.title}`,
		'',
		`Reason: ${reason}`,
		`Reuse family: \`${track.reuseFamily}\``,
		`Primary docs: \`${track.primaryDocsRoute}\``,
		`Starter example: \`${track.starterExample.key}\` (${track.starterExample.packageRef})`,
		'Commands:',
	];

	for (const command of track.recommendedCommands) {
		lines.push(`- \`${command}\``);
	}

	return [...lines, ''];
}

function renderHumanGuide(plan: Omit<OnboardingPlan, 'guides'>) {
	const lines = [
		'# ContractSpec Repo Onboarding',
		'',
		`Primary track: **${plan.primaryTrack.title}**`,
		'',
		plan.primaryTrack.summary,
		'',
		'## Start Here',
		'',
		...plan.nextCommands.map(
			(command, index) => `${index + 1}. \`${command}\``
		),
		'',
		'## Track Guide',
		'',
	];

	for (const recommendation of plan.recommendations) {
		lines.push(
			...renderHumanTrackSection(recommendation.track, recommendation.reason)
		);
	}

	if (plan.builderNextSteps.length > 0) {
		lines.push('## Builder Paths', '');
		for (const step of plan.builderNextSteps) {
			lines.push(`- \`${step}\``);
		}
		lines.push('');
	}

	return lines.join('\n');
}

function renderHumanTrackSection(
	track: OnboardingTrackDefinition,
	reason: string
) {
	const lines = [
		`### ${track.title}`,
		'',
		track.description,
		'',
		`Why it is recommended here: ${reason}`,
		'',
		`Primary docs: ${track.primaryDocsRoute}`,
	];

	if (track.secondaryDocsRoutes.length > 0) {
		lines.push(`More docs: ${track.secondaryDocsRoutes.join(', ')}`);
	}

	lines.push(
		`Starter example: ${track.starterExample.title} (\`${track.starterExample.key}\`)`,
		`Example package: \`${track.starterExample.packageRef}\``
	);

	if (track.advancedExample) {
		lines.push(
			`Advanced example: ${track.advancedExample.title} (\`${track.advancedExample.key}\`)`
		);
	}

	lines.push('', 'Commands:');
	for (const command of track.recommendedCommands) {
		lines.push(`- \`${command}\``);
	}

	lines.push(
		'',
		`Packages: ${track.packages.map((pkg) => `\`${pkg}\``).join(', ')}`,
		''
	);
	return lines;
}
