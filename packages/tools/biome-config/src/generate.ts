import { policyManifest } from './policies';
import type {
	ContractSpecPolicyRule,
	GeneratedBiomeArtifacts,
	PolicyAudience,
} from './types';

const tailwindClassFunctions = ['cn', 'clsx', 'cva', 'twMerge', 'tv'];

const tailwindClassOptions = {
	functions: tailwindClassFunctions,
};

function getRulesForAudience(
	audience: PolicyAudience
): ContractSpecPolicyRule[] {
	return policyManifest.filter((rule) => rule.audience === audience);
}

function stringifyArtifact(value: unknown): string {
	return `${JSON.stringify(value, null, 2)}\n`;
}

type GroupedPolicyRules = {
	includes: string[];
	rules: ContractSpecPolicyRule[];
};

function groupRulesByFiles(
	rules: ContractSpecPolicyRule[]
): GroupedPolicyRules[] {
	const groups = new Map<string, GroupedPolicyRules>();

	for (const rule of rules) {
		const key = JSON.stringify(rule.files);
		const existing = groups.get(key);

		if (existing) {
			existing.rules.push(rule);
			continue;
		}

		groups.set(key, {
			includes: [...rule.files],
			rules: [rule],
		});
	}

	return [...groups.values()];
}

function buildRestrictedImportOverrides(
	audience: PolicyAudience
): Record<string, unknown>[] {
	const nativeRules = getRulesForAudience(audience).filter(
		(rule) => rule.engine === 'biome-native' && rule.options?.paths
	);

	return groupRulesByFiles(nativeRules).map(({ includes, rules }) => ({
		includes,
		linter: {
			rules: {
				style: {
					noRestrictedImports: {
						level: 'error',
						options: {
							paths: Object.assign(
								{},
								...rules.map(
									(rule) => (rule.options?.paths as object | undefined) ?? {}
								)
							),
						},
					},
				},
			},
		},
	}));
}

function buildRestrictedElementOverrides(
	audience: PolicyAudience
): Record<string, unknown>[] {
	const elementRules = getRulesForAudience(audience).filter(
		(rule) => rule.engine === 'biome-native' && rule.options?.elements
	);

	return groupRulesByFiles(elementRules).map(({ includes, rules }) => ({
		includes,
		linter: {
			rules: {
				correctness: {
					noRestrictedElements: {
						level: 'error',
						options: {
							elements: Object.assign(
								{},
								...rules.map(
									(rule) => (rule.options?.elements as object | undefined) ?? {}
								)
							),
						},
					},
				},
			},
		},
	}));
}

function buildPluginOverrides(
	audience: PolicyAudience
): Record<string, unknown>[] {
	const gritRules = getRulesForAudience(audience).filter(
		(rule) => rule.engine === 'biome-grit'
	);

	return groupRulesByFiles(gritRules).map(({ includes }) => ({
		includes,
		plugins: [`../plugins/${audience}-prefer-design-system.grit`],
	}));
}

export function generateGritPlugin(audience: PolicyAudience): string {
	const gritRules = getRulesForAudience(audience).filter(
		(rule) => rule.engine === 'biome-grit'
	);

	const snippets = gritRules.flatMap((rule) => {
		const replacements = Object.entries(
			(rule.options?.replacements as Record<string, string> | undefined) ?? {}
		);
		const replacementTargets = [
			...new Set(replacements.map(([, target]) => target)),
		];

		return replacementTargets.map((target) => {
			const sources = replacements
				.filter(([, replacementTarget]) => replacementTarget === target)
				.map(([source]) => `\`${JSON.stringify(source)}\``)
				.join(', ');

			return `engine biome(1.0)
language js(typescript,jsx)

\`import $imports from $source\` where {
  $source <: or { ${sources} },
  register_diagnostic(
    span = $source,
    message = "${rule.message} Replace these imports with \\"${target}\\"."
  )
}`;
		});
	});

	return `${snippets.join('\n\n')}\n`;
}

export function generateAiRules(audience: PolicyAudience): string {
	const rules = getRulesForAudience(audience);
	const title =
		audience === 'repo'
			? '# ContractSpec Repo Policy Rules'
			: '# ContractSpec Consumer Policy Rules';

	const lines = [
		title,
		'',
		'Generated from the typed Biome policy manifest.',
		'',
	];

	for (const rule of rules) {
		lines.push(`## ${rule.id}`);
		lines.push(`- Engine: ${rule.engine}`);
		lines.push(`- Severity: ${rule.severity}`);
		lines.push(`- Message: ${rule.message}`);
		lines.push(`- Docs source: ${rule.docsSource}`);
		lines.push('');
	}

	return `${lines.join('\n')}\n`;
}

export function generateBiomePreset(audience: PolicyAudience): string {
	const pluginOverrides = buildPluginOverrides(audience);
	const restrictedImportOverrides = buildRestrictedImportOverrides(audience);
	const restrictedElementOverrides = buildRestrictedElementOverrides(audience);

	const preset = {
		$schema: 'https://biomejs.dev/schemas/2.4.8/schema.json',
		formatter: {
			enabled: true,
		},
		css: {
			parser: {
				tailwindDirectives: true,
			},
		},
		assist: {
			enabled: true,
			actions: {
				source: {
					organizeImports: 'on',
					noDuplicateClasses: {
						level: 'on',
						options: tailwindClassOptions,
					},
				},
			},
		},
		linter: {
			enabled: true,
			rules: {
				recommended: false,
				correctness: {
					noUnusedImports: 'error',
					noUnusedVariables: {
						level: 'error',
						options: {
							ignoreRestSiblings: true,
						},
					},
				},
				nursery: {
					useSortedClasses: {
						level: 'error',
						options: tailwindClassOptions,
					},
				},
			},
		},
		overrides: [
			...pluginOverrides,
			...restrictedImportOverrides,
			...restrictedElementOverrides,
		],
	};

	return stringifyArtifact(preset);
}

export function generateArtifactsForAudience(
	audience: PolicyAudience
): GeneratedBiomeArtifacts {
	return {
		preset: generateBiomePreset(audience),
		plugins: {
			[`${audience}-prefer-design-system.grit`]: generateGritPlugin(audience),
		},
		aiRules: generateAiRules(audience),
	};
}
