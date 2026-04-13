import { input, select } from '@inquirer/prompts';
import type { FeatureSpecData, Stability } from '../../../types';

function parseVersionedRefs(
	inputValue: string
): Array<{ key: string; version: string }> {
	return inputValue
		.split(',')
		.map((entry) => entry.trim())
		.filter(Boolean)
		.map((entry) => {
			const [rawKey, rawVersion] = entry.split('@').map((part) => part.trim());
			const key = rawKey ?? '';
			const version = rawVersion || '1.0.0';
			return { key, version };
		})
		.filter((entry) => entry.key.length > 0);
}

export async function featureWizard(): Promise<FeatureSpecData> {
	const key = await input({
		message: 'Feature key (e.g. "workspace.setup"):',
		validate: (value: string) =>
			/^[a-z][a-z0-9._-]*$/i.test(value) ||
			'Feature key must use letters, numbers, dots, underscores, or hyphens',
	});

	const title = await input({
		message: 'Feature title:',
		validate: (value: string) => value.trim().length > 0 || 'Title is required',
	});

	const version = await input({
		message: 'Version:',
		default: '1.0.0',
		validate: (value: string) =>
			/^\d+\.\d+\.\d+([-.][a-z0-9.]+)?$/i.test(value) ||
			'Version must look like 1.0.0',
	});

	const domain = await input({
		message: 'Domain:',
		default: key.split(/[._-]/)[0] || 'core',
		validate: (value: string) =>
			value.trim().length > 0 || 'Domain is required',
	});

	const description = await input({
		message: 'Description:',
		validate: (value: string) =>
			value.trim().length > 0 || 'Description is required',
	});

	const stability = (await select({
		message: 'Stability:',
		choices: [
			{ value: 'experimental' },
			{ value: 'beta' },
			{ value: 'stable' },
			{ value: 'deprecated' },
		],
		default: 'beta',
	})) as Stability;

	const ownersInput = await input({
		message: 'Owners (comma-separated):',
		default: '@team',
		validate: (value: string) => {
			const owners = value
				.split(',')
				.map((entry) => entry.trim())
				.filter(Boolean);
			if (owners.length === 0) return 'At least one owner is required';
			if (!owners.every((owner) => owner.startsWith('@'))) {
				return 'Owners must start with @';
			}
			return true;
		},
	});

	const tagsInput = await input({
		message: 'Tags (comma-separated):',
		default: 'feature',
	});

	const operationsInput = await input({
		message: 'Operations (comma-separated key@version, optional):',
	});
	const eventsInput = await input({
		message: 'Events (comma-separated key@version, optional):',
	});
	const presentationsInput = await input({
		message: 'Presentations (comma-separated key@version, optional):',
	});
	const experimentsInput = await input({
		message: 'Experiments (comma-separated key@version, optional):',
	});

	return {
		key,
		version,
		title,
		description,
		domain,
		owners: ownersInput
			.split(',')
			.map((entry) => entry.trim())
			.filter(Boolean),
		tags: tagsInput
			.split(',')
			.map((entry) => entry.trim())
			.filter(Boolean),
		stability,
		operations: parseVersionedRefs(operationsInput),
		events: parseVersionedRefs(eventsInput),
		presentations: parseVersionedRefs(presentationsInput),
		experiments: parseVersionedRefs(experimentsInput),
	};
}
