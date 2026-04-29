import type { ReleaseAuthoringDraft } from '@contractspec/bundle.workspace';
import type {
	MigrationInstruction,
	ReleaseImpactAudience,
	UpgradePlanStep,
	UpgradeStepLevel,
	VersionBumpType,
} from '@contractspec/lib.contracts-spec';
import { confirm, input, select } from '@inquirer/prompts';

export async function promptForReleaseDraft(
	draft: ReleaseAuthoringDraft
): Promise<ReleaseAuthoringDraft> {
	const releaseType = await select<VersionBumpType>({
		message: 'Release type',
		choices: releaseTypeChoices(draft.releaseType),
	});
	const packageNamesInput = await input({
		message: 'Published packages (comma-separated)',
		default: draft.packages.map((pkg) => pkg.name).join(', '),
	});
	const packageNames =
		packageNamesInput.trim().length > 0
			? splitCsv(packageNamesInput)
			: draft.packages.map((pkg) => pkg.name);
	const packageMap = new Map(draft.packages.map((pkg) => [pkg.name, pkg]));
	const summaryInput = await input({
		message: 'Release summary',
		default: draft.summary,
	});
	const summary = summaryInput.trim() || draft.summary;
	const slugInput = await input({
		message: 'Release slug',
		default: draft.slug || slugify(summary),
	});
	const slug = slugInput.trim() || draft.slug || slugify(summary);
	const isBreaking = await confirm({
		message: 'Does this release contain breaking changes?',
		default: draft.isBreaking || releaseType === 'major',
	});
	const maintainerSummaryInput = await input({
		message: 'Maintainer summary',
		default: getAudienceSummary(draft.audiences, 'maintainer', summary),
	});
	const maintainerSummary =
		maintainerSummaryInput.trim() ||
		getAudienceSummary(draft.audiences, 'maintainer', summary);
	const customerSummaryInput = await input({
		message: 'Customer summary',
		default: getAudienceSummary(draft.audiences, 'customer', summary),
	});
	const customerSummary =
		customerSummaryInput.trim() ||
		getAudienceSummary(draft.audiences, 'customer', summary);
	const integratorSummaryInput = await input({
		message: 'Integrator summary',
		default: getAudienceSummary(draft.audiences, 'integrator', summary),
	});
	const integratorSummary =
		integratorSummaryInput.trim() ||
		getAudienceSummary(draft.audiences, 'integrator', summary);

	return {
		...draft,
		slug,
		summary,
		releaseType,
		isBreaking,
		packages: packageNames.map((name) => ({
			...(packageMap.get(name) ?? { name }),
			releaseType,
		})),
		audiences: buildAudiences(draft.audiences, [
			['maintainer', maintainerSummary],
			['customer', customerSummary],
			['integrator', integratorSummary],
		]),
		deprecations: await promptStringList(
			'deprecation',
			draft.deprecations,
			'Record a deprecation notice?'
		),
		migrationInstructions: await promptMigrationInstructions(
			draft.migrationInstructions
		),
		upgradeSteps: await promptUpgradeSteps(draft.upgradeSteps),
		validation: {
			commands: await promptStringList(
				'validation command',
				draft.validation.commands,
				'Add a validation command?'
			),
			evidence: await promptStringList(
				'validation evidence note',
				draft.validation.evidence,
				'Add a validation evidence note?'
			),
		},
	};
}

async function promptMigrationInstructions(
	items: MigrationInstruction[]
): Promise<MigrationInstruction[]> {
	const results = await promptStructuredItems(
		items,
		'migration instruction',
		async (item, index) => ({
			id:
				(
					await input({
						message: `Migration instruction ${index} id`,
						default: item?.id ?? `migration-${index}`,
					})
				).trim() || `migration-${index}`,
			title: await input({
				message: `Migration instruction ${index} title`,
				default: item?.title ?? '',
			}),
			summary: await input({
				message: `Migration instruction ${index} summary`,
				default: item?.summary ?? '',
			}),
			required: await confirm({
				message: `Migration instruction ${index} required?`,
				default: item?.required ?? false,
			}),
			when:
				(
					await input({
						message: `Migration instruction ${index} when (optional)`,
						default: item?.when ?? '',
					})
				).trim() || undefined,
			steps: await promptStringList(
				`migration instruction ${index} step`,
				item?.steps ?? [],
				`Add a step for migration instruction ${index}?`
			),
		})
	);
	return results.filter((item) => item.title.trim().length > 0);
}

async function promptUpgradeSteps(
	items: UpgradePlanStep[]
): Promise<UpgradePlanStep[]> {
	const results = await promptStructuredItems(
		items,
		'upgrade step',
		async (item, index) => ({
			id:
				(
					await input({
						message: `Upgrade step ${index} id`,
						default: item?.id ?? `upgrade-${index}`,
					})
				).trim() || `upgrade-${index}`,
			title: await input({
				message: `Upgrade step ${index} title`,
				default: item?.title ?? '',
			}),
			summary: await input({
				message: `Upgrade step ${index} summary`,
				default: item?.summary ?? '',
			}),
			level: await select<UpgradePlanStep['level']>({
				message: `Upgrade step ${index} level`,
				choices: [
					{
						value: (item?.level ?? 'manual') as UpgradeStepLevel,
						name: item?.level ?? 'manual',
					},
					...['auto', 'assisted', 'manual']
						.filter((value) => value !== (item?.level ?? 'manual'))
						.map((value) => ({
							value: value as UpgradeStepLevel,
							name: value,
						})),
				],
			}),
			instructions: await promptStringList(
				`upgrade step ${index} instruction`,
				item?.instructions ?? [],
				`Add an instruction for upgrade step ${index}?`
			),
		})
	);
	return results.filter((item) => item.title.trim().length > 0);
}

async function promptStringList(
	label: string,
	items: string[],
	emptyPrompt: string
): Promise<string[]> {
	const results: string[] = [];
	for (const [index, item] of items.entries()) {
		const value = (
			await input({
				message: `${capitalize(label)} ${index + 1}`,
				default: item,
			})
		).trim();
		if (value) {
			results.push(value);
		}
	}

	let shouldAdd =
		results.length === 0
			? await confirm({ message: emptyPrompt, default: false })
			: await confirm({
					message: `Add another ${label}?`,
					default: false,
				});

	while (shouldAdd) {
		const value = (
			await input({
				message: `${capitalize(label)} ${results.length + 1}`,
			})
		).trim();
		if (value) {
			results.push(value);
		}
		shouldAdd = await confirm({
			message: `Add another ${label}?`,
			default: false,
		});
	}

	return results;
}

async function promptStructuredItems<T>(
	items: T[],
	label: string,
	prompt: (item: T | undefined, index: number) => Promise<T>
): Promise<T[]> {
	const results: T[] = [];
	for (const [index, item] of items.entries()) {
		results.push(await prompt(item, index + 1));
	}

	let shouldAdd =
		items.length === 0
			? await confirm({ message: `Add a ${label}?`, default: false })
			: await confirm({ message: `Add another ${label}?`, default: false });

	while (shouldAdd) {
		results.push(await prompt(undefined, results.length + 1));
		shouldAdd = await confirm({
			message: `Add another ${label}?`,
			default: false,
		});
	}

	return results;
}

function buildAudiences(
	existing: ReleaseImpactAudience[],
	entries: Array<[ReleaseImpactAudience['kind'], string]>
): ReleaseImpactAudience[] {
	return entries
		.map(([kind, summary]) => {
			const previous = existing.find((item) => item.kind === kind);
			return {
				kind,
				summary,
				affectedPackages: previous?.affectedPackages,
				affectedFrameworks: previous?.affectedFrameworks,
				affectedRuntimes: previous?.affectedRuntimes,
			};
		})
		.filter((item) => item.summary.trim().length > 0);
}

function getAudienceSummary(
	audiences: ReleaseImpactAudience[],
	kind: ReleaseImpactAudience['kind'],
	fallback: string
): string {
	return audiences.find((item) => item.kind === kind)?.summary ?? fallback;
}

function releaseTypeChoices(selected: VersionBumpType) {
	return [selected, 'patch', 'minor', 'major']
		.filter((value, index, values) => values.indexOf(value) === index)
		.map((value) => ({ value: value as VersionBumpType, name: value }));
}

function splitCsv(value: string): string[] {
	return value
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}

function slugify(value: string): string {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);
}

function capitalize(value: string): string {
	return value.charAt(0).toUpperCase() + value.slice(1);
}
