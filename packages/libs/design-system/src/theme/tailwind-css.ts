import type {
	ThemeCssVariableMap,
	ThemeCssVariables,
	ThemeTailwindBridgeOptions,
} from './tailwind-variables';

const DEFAULT_MODE_NAMES = ['light', 'dark'] as const;
const SHADCN_COLOR_ALIASES: Record<string, string[]> = {
	background: ['card', 'popover'],
	foreground: ['card-foreground', 'popover-foreground'],
	border: ['input'],
};

function cssBlock(selector: string, variables: ThemeCssVariableMap): string {
	const body = Object.entries(variables)
		.sort(([left], [right]) => left.localeCompare(right))
		.map(([name, value]) => `\t${name}: ${value};`)
		.join('\n');
	return `${selector} {\n${body}\n}`;
}

function mergedVariables(variables: ThemeCssVariables): ThemeCssVariableMap {
	return Object.assign({}, ...Object.values(variables.modes));
}

function tailwindVariableFor(name: string): string | undefined {
	if (name.startsWith('--ds-color-')) {
		return `--color-${name.slice('--ds-color-'.length)}`;
	}
	if (name.startsWith('--ds-radius-')) {
		return `--radius-${name.slice('--ds-radius-'.length)}`;
	}
	if (name.startsWith('--ds-space-')) {
		return `--spacing-${name.slice('--ds-space-'.length)}`;
	}
	if (name.startsWith('--ds-typography-')) {
		return `--text-${name.slice('--ds-typography-'.length)}`;
	}
	return undefined;
}

function shadcnAliasVariablesFor(name: string): string[] {
	if (!name.startsWith('--ds-color-')) {
		return [];
	}
	const colorName = name.slice('--ds-color-'.length);
	const aliases = SHADCN_COLOR_ALIASES[colorName] ?? [];

	return aliases.map((alias) => `--color-${alias}`);
}

function tailwindThemeBlock(variables: ThemeCssVariables): string {
	const lines = Object.keys(mergedVariables(variables))
		.sort()
		.flatMap((name) => {
			const tailwindName = tailwindVariableFor(name);
			const aliases = shadcnAliasVariablesFor(name);
			return [
				...(tailwindName ? [`\t${tailwindName}: var(${name});`] : []),
				...aliases.map((alias) => `\t${alias}: var(${name});`),
			];
		});

	return `@theme inline {\n${lines.join('\n')}\n}`;
}

export function themeSpecToTailwindCss(
	variables: ThemeCssVariables,
	options: ThemeTailwindBridgeOptions = {}
): string {
	const chunks = [
		options.includeCustomVariant
			? '@custom-variant dark (&:where(.dark, .dark *));'
			: undefined,
		cssBlock(options.rootSelector ?? ':root', variables.light),
		cssBlock(options.darkSelector ?? '.dark', variables.dark),
		...Object.entries(variables.modes)
			.filter(([mode]) => !DEFAULT_MODE_NAMES.includes(mode as never))
			.map(([mode, values]) => cssBlock(`[data-theme="${mode}"]`, values)),
		options.includeTheme === false ? undefined : tailwindThemeBlock(variables),
	];

	return chunks.filter(Boolean).join('\n\n');
}
