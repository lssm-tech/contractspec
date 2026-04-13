import { input, select } from '@inquirer/prompts';
import type { FormSpecData, Stability } from '../../../types';

export async function formWizard(): Promise<FormSpecData> {
	const key = await input({
		message: 'Form key (e.g. "workspace.setup.form"):',
		validate: (value: string) =>
			/^[a-z][a-z0-9._-]*$/i.test(value) ||
			'Form key must use letters, numbers, dots, underscores, or hyphens',
	});

	const title = await input({
		message: 'Form title:',
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
		default: 'form',
	});

	const primaryFieldKey = await input({
		message: 'Starter field key:',
		default: 'value',
		validate: (value: string) =>
			/^[a-z][a-zA-Z0-9_]*$/.test(value) ||
			'Field key must be a valid identifier',
	});

	const primaryFieldLabel = await input({
		message: 'Starter field label token:',
		default: `${key}.field.${primaryFieldKey}.label`,
		validate: (value: string) =>
			value.trim().length > 0 || 'Field label is required',
	});

	const primaryFieldPlaceholder = await input({
		message: 'Starter field placeholder token:',
		default: `${key}.field.${primaryFieldKey}.placeholder`,
	});

	const actionKey = await input({
		message: 'Submit action key:',
		default: 'submit',
		validate: (value: string) =>
			value.trim().length > 0 || 'Action key is required',
	});

	const actionLabel = await input({
		message: 'Submit action label token:',
		default: `${key}.action.${actionKey}.label`,
		validate: (value: string) =>
			value.trim().length > 0 || 'Action label is required',
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
		primaryFieldKey,
		primaryFieldLabel,
		primaryFieldPlaceholder,
		actionKey,
		actionLabel,
	};
}
