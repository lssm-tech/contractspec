import type {
	ComponentVariantSpec,
	ThemeModeSpec,
	ThemeOverride,
	ThemeScope,
	ThemeSpec,
	ThemeTokens,
} from './themes';

const SUPPORTED_COLOR_FORMATS = new Set(['hex', 'rgb', 'hsl', 'oklch', 'css']);

export type ThemeValidationLevel = 'error' | 'warning' | 'info';

export interface ThemeValidationIssue {
	level: ThemeValidationLevel;
	message: string;
	path?: string;
	context?: Record<string, unknown>;
}

export interface ThemeValidationResult {
	valid: boolean;
	issues: ThemeValidationIssue[];
}

export class ThemeValidationError extends Error {
	constructor(
		message: string,
		public readonly issues: ThemeValidationIssue[]
	) {
		super(message);
		this.name = 'ThemeValidationError';
	}
}

export function validateThemeSpec(spec: ThemeSpec): ThemeValidationResult {
	const issues: ThemeValidationIssue[] = [];

	validateMeta(spec, issues);
	validateMaterialConfig(spec, issues);
	validateTokens(spec.tokens, issues, 'tokens');
	validateComponents(spec.components, issues, 'components');
	validateModes(spec.modes, issues, 'modes');
	validateOverrides(spec.overrides, issues);

	return {
		valid: issues.every((issue) => issue.level !== 'error'),
		issues,
	};
}

export function assertThemeSpecValid(spec: ThemeSpec): void {
	const result = validateThemeSpec(spec);
	if (!result.valid) {
		throw new ThemeValidationError(
			`Theme ${spec.meta.key}.v${spec.meta.version} is invalid`,
			result.issues
		);
	}
}

function validateMeta(spec: ThemeSpec, issues: ThemeValidationIssue[]): void {
	const { meta } = spec;

	requireNonEmpty(
		meta.key,
		'Theme must have a non-empty key',
		'meta.key',
		issues
	);
	requireNonEmpty(
		meta.version,
		'Theme must have a non-empty version',
		'meta.version',
		issues
	);
	requireNonEmpty(
		meta.title,
		'Theme must have a non-empty title',
		'meta.title',
		issues
	);
	requireNonEmpty(
		meta.description,
		'Theme must have a non-empty description',
		'meta.description',
		issues
	);
	requireNonEmpty(
		meta.domain,
		'Theme must have a non-empty domain',
		'meta.domain',
		issues
	);

	if (!meta.stability) {
		issues.push({
			level: 'error',
			message: 'Theme must declare a stability level',
			path: 'meta.stability',
		});
	}

	if (!meta.owners.length) {
		issues.push({
			level: 'error',
			message: 'Theme must declare at least one owner',
			path: 'meta.owners',
		});
	}

	if (!meta.tags.length) {
		issues.push({
			level: 'error',
			message: 'Theme must declare at least one tag',
			path: 'meta.tags',
		});
	}

	if (
		meta.extends &&
		meta.extends.key === meta.key &&
		meta.extends.version === meta.version
	) {
		issues.push({
			level: 'error',
			message: 'Theme cannot extend itself',
			path: 'meta.extends',
		});
	}
}

function validateMaterialConfig(
	spec: ThemeSpec,
	issues: ThemeValidationIssue[]
): void {
	if (
		hasMaterialTokens(spec.tokens) ||
		hasMaterialComponents(spec.components) ||
		hasMaterialModes(spec.modes) ||
		hasMaterialOverrides(spec.overrides)
	) {
		return;
	}

	issues.push({
		level: 'error',
		message:
			'Theme must declare tokens, components, or overrides with material configuration',
		path: 'tokens',
	});
}

function validateTokens(
	tokens: ThemeTokens | undefined,
	issues: ThemeValidationIssue[],
	path: string
): void {
	if (!tokens) {
		return;
	}

	for (const [groupName, group] of Object.entries(tokens)) {
		if (group && Object.keys(group).length === 0) {
			issues.push({
				level: 'warning',
				message: `Theme token group "${groupName}" is empty`,
				path: `${path}.${groupName}`,
			});
		}
		validateTokenMetadata(group, groupName, issues, `${path}.${groupName}`);
	}
}

function validateTokenMetadata(
	group: unknown,
	groupName: string,
	issues: ThemeValidationIssue[],
	path: string
): void {
	if (!group || typeof group !== 'object') {
		return;
	}

	const tokens = group as Record<string, { format?: string } | undefined>;
	for (const [tokenName, token] of Object.entries(tokens)) {
		if (
			groupName === 'colors' &&
			token?.format &&
			!SUPPORTED_COLOR_FORMATS.has(token.format)
		) {
			issues.push({
				level: 'warning',
				message: `Theme color token "${tokenName}" declares unknown format "${token.format}"`,
				path: `${path}.${tokenName}.format`,
			});
		}
	}
}

function validateModes(
	modes: Record<string, ThemeModeSpec> | undefined,
	issues: ThemeValidationIssue[],
	path: string
): void {
	if (!modes) {
		return;
	}

	for (const [modeName, mode] of Object.entries(modes)) {
		const modePath = `${path}.${modeName}`;

		if (!modeName.trim()) {
			issues.push({
				level: 'error',
				message: 'Theme mode keys must be non-empty',
				path,
			});
			continue;
		}

		if (!hasMaterialMode(mode)) {
			issues.push({
				level: 'warning',
				message: `Theme mode "${modeName}" does not declare tokens or components`,
				path: modePath,
			});
		}

		validateTokens(mode.tokens, issues, `${modePath}.tokens`);
		validateComponents(mode.components, issues, `${modePath}.components`);
	}
}

function validateComponents(
	components: ComponentVariantSpec[] | undefined,
	issues: ThemeValidationIssue[],
	path: string
): void {
	if (!components?.length) {
		return;
	}

	const seenComponents = new Set<string>();
	const seenVariantsByComponent = new Map<string, Set<string>>();

	components.forEach((component, index) => {
		const componentPath = `${path}[${index}]`;
		const componentKey = component.component.trim();

		if (!componentKey) {
			issues.push({
				level: 'error',
				message:
					'Theme component entries must declare a non-empty component key',
				path: `${componentPath}.component`,
			});
			return;
		}

		if (seenComponents.has(componentKey)) {
			issues.push({
				level: 'error',
				message: `Duplicate component "${componentKey}" in theme`,
				path: `${componentPath}.component`,
			});
		}
		seenComponents.add(componentKey);

		const seenVariants = seenVariantsByComponent.get(componentKey) ?? new Set();
		for (const variantKey of Object.keys(component.variants)) {
			if (seenVariants.has(variantKey)) {
				issues.push({
					level: 'error',
					message: `Duplicate variant "${variantKey}" for component "${componentKey}"`,
					path: `${componentPath}.variants.${variantKey}`,
				});
			}
			seenVariants.add(variantKey);
			validateTokens(
				component.variants[variantKey]?.tokens,
				issues,
				`${componentPath}.variants.${variantKey}.tokens`
			);
		}
		seenVariantsByComponent.set(componentKey, seenVariants);
	});
}

function validateOverrides(
	overrides: ThemeOverride[] | undefined,
	issues: ThemeValidationIssue[]
): void {
	if (!overrides?.length) {
		return;
	}

	const seen = new Set<string>();

	overrides.forEach((override, index) => {
		const path = `overrides[${index}]`;
		const key = `${override.scope}:${override.target}`;

		if (!override.target.trim()) {
			issues.push({
				level: 'error',
				message: 'Theme override targets must be non-empty',
				path: `${path}.target`,
			});
			return;
		}

		if (seen.has(key)) {
			issues.push({
				level: 'error',
				message: `Duplicate override for ${override.scope}:${override.target}`,
				path,
			});
		}
		seen.add(key);

		if (isSuspiciousOverrideTarget(override.scope, override.target)) {
			issues.push({
				level: 'warning',
				message: `Override target "${override.target}" does not look scoped for ${override.scope} overrides`,
				path: `${path}.target`,
			});
		}

		validateTokens(override.tokens, issues, `${path}.tokens`);
		validateComponents(override.components, issues, `${path}.components`);
		validateModes(override.modes, issues, `${path}.modes`);
	});
}

function hasMaterialTokens(tokens: ThemeTokens | undefined): boolean {
	if (!tokens) {
		return false;
	}

	return Object.values(tokens).some(
		(group) => group !== undefined && Object.keys(group).length > 0
	);
}

function hasMaterialComponents(
	components: ComponentVariantSpec[] | undefined
): boolean {
	return Boolean(components?.length);
}

function hasMaterialMode(mode: ThemeModeSpec | undefined): boolean {
	return (
		hasMaterialTokens(mode?.tokens) || hasMaterialComponents(mode?.components)
	);
}

function hasMaterialModes(
	modes: Record<string, ThemeModeSpec> | undefined
): boolean {
	return Boolean(Object.values(modes ?? {}).some(hasMaterialMode));
}

function hasMaterialOverrides(overrides: ThemeOverride[] | undefined): boolean {
	return Boolean(
		overrides?.some(
			(override) =>
				hasMaterialTokens(override.tokens) ||
				hasMaterialComponents(override.components) ||
				hasMaterialModes(override.modes)
		)
	);
}

function isSuspiciousOverrideTarget(
	scope: ThemeScope,
	target: string
): boolean {
	if (scope === 'global') {
		return false;
	}

	return !target.startsWith(`${scope}:`);
}

function requireNonEmpty(
	value: string | undefined,
	message: string,
	path: string,
	issues: ThemeValidationIssue[]
): void {
	if (value?.trim()) {
		return;
	}

	issues.push({
		level: 'error',
		message,
		path,
	});
}
