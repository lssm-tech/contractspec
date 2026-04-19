import { input, select } from '@inquirer/prompts';
import type { Stability, ThemeSpecData } from '../../../types';

const THEME_SCOPES = ['global', 'tenant', 'user'] as const;
const SEMVER_PATTERN = /^\d+\.\d+\.\d+([-.][a-z0-9.]+)?$/i;

export async function themeWizard(): Promise<ThemeSpecData> {
	const key = await input({
		message: 'Theme key (e.g. "design.console"):',
		validate: required,
	});

	const version = await input({
		message: 'Version:',
		default: '1.0.0',
		validate: validateVersion,
	});

	const title = await input({
		message: 'Theme title:',
		validate: required,
	});

	const description = await input({
		message: 'Description:',
		default: 'Theme tokens and component variants.',
		validate: required,
	});

	const domain = await input({
		message: 'Domain:',
		default: key.split(/[._-]/)[0] || 'design-system',
		validate: required,
	});

	const stability = (await select({
		message: 'Stability:',
		choices: [
			{ value: 'experimental' },
			{ value: 'beta' },
			{ value: 'stable' },
			{ value: 'deprecated' },
		],
		default: 'experimental',
	})) as Stability;

	const owners = await input({
		message: 'Owners (comma-separated):',
		default: '@team-design',
		validate: validateList,
	});

	const tags = await input({
		message: 'Tags (comma-separated):',
		default: 'theme',
		validate: validateList,
	});

	const scopesInput = await input({
		message: 'Scopes (comma-separated: global, tenant, user):',
		default: 'tenant',
		validate: validateScopes,
	});

	return {
		key,
		version,
		title,
		description,
		domain,
		owners: splitList(owners),
		tags: splitList(tags),
		stability,
		scopes: splitList(scopesInput) as ThemeSpecData['scopes'],
	};
}

function splitList(value: string): string[] {
	return value
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}

function required(value: string) {
	return value.trim().length > 0 || 'Value is required';
}

function validateList(value: string) {
	return splitList(value).length > 0 || 'At least one value is required';
}

function validateVersion(value: string) {
	return SEMVER_PATTERN.test(value) || 'Version must look like 1.0.0';
}

function validateScopes(value: string) {
	const scopes = splitList(value);
	if (scopes.length === 0) {
		return 'At least one scope is required';
	}
	if (!scopes.every((scope) => THEME_SCOPES.includes(scope as never))) {
		return 'Scopes must be one or more of: global, tenant, user';
	}
	return true;
}
