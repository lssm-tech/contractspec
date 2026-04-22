import { describe, expect, it } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	generateAiRules,
	generateArtifactsForAudience,
	generateBiomePreset,
	generateGritPlugin,
	generateRawJsxTextGritPlugin,
} from './generate';
import { policyManifest } from './policies';

const repoRoot = resolve(
	dirname(fileURLToPath(import.meta.url)),
	'../../../..'
);
const biomeScript = join(repoRoot, 'scripts', 'biome.cjs');

function createTempWorkspace(): string {
	return mkdtempSync(join(tmpdir(), 'contractspec-biome-config-'));
}

function runBiomeCheck(
	source: string,
	config: Record<string, unknown>
): { output: string; status: number | null } {
	const workspace = createTempWorkspace();

	try {
		const sourcePath = join(
			workspace,
			'packages',
			'modules',
			'fixture',
			'src',
			'probe.tsx'
		);
		const configPath = join(workspace, 'biome.json');
		const pluginPath = join(workspace, 'repo-prefer-design-system.grit');
		const rawTextPluginPath = join(
			workspace,
			'repo-no-raw-jsx-text-outside-typography.grit'
		);

		mkdirSync(dirname(sourcePath), { recursive: true });
		writeFileSync(sourcePath, source, 'utf8');
		writeFileSync(pluginPath, generateGritPlugin('repo'), 'utf8');
		writeFileSync(
			rawTextPluginPath,
			generateRawJsxTextGritPlugin('repo'),
			'utf8'
		);
		writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

		const result = spawnSync(
			'node',
			[
				biomeScript,
				'check',
				sourcePath,
				'--config-path',
				configPath,
				'--colors=off',
				'--no-errors-on-unmatched',
				'--max-diagnostics=50',
			],
			{ encoding: 'utf8' }
		);

		return {
			output: `${result.stdout}${result.stderr}`,
			status: result.status,
		};
	} finally {
		rmSync(workspace, { force: true, recursive: true });
	}
}

describe('@contractspec/biome-config', () => {
	it('exposes a typed policy manifest for both audiences', () => {
		expect(policyManifest.some((rule) => rule.audience === 'repo')).toBe(true);
		expect(policyManifest.some((rule) => rule.audience === 'consumer')).toBe(
			true
		);
	});

	it('generates a repo preset with restricted element enforcement', () => {
		const preset = generateBiomePreset('repo');

		expect(preset).toContain('"!generated"');
		expect(preset).toContain('"!generated/**"');
		expect(preset).toContain('noRestrictedElements');
		expect(preset).toContain('packages/bundles/**/*.{jsx,tsx}');
		expect(preset).toContain('packages/modules/**/*.{jsx,tsx}');
		expect(preset).toContain('!packages/apps/mobile-demo/**/*.{js,jsx,ts,tsx}');
		expect(preset).toContain('../plugins/repo-prefer-design-system.grit');
		expect(preset).toContain(
			'../plugins/repo-no-raw-jsx-text-outside-typography.grit'
		);
		expect(preset).toContain('HStack, VStack, or Box');
		expect(preset).toContain('@contractspec/lib.design-system/layout');
		expect(preset).toContain('"ul"');
		expect(preset).toContain('"ol"');
		expect(preset).toContain('"li"');
		expect(preset).toContain('@contractspec/lib.design-system/list');
		expect(preset).toContain('"recommended": false');
		expect(preset).toContain('"tailwindDirectives": true');
		expect(preset).toContain('"noDuplicateClasses"');
		expect(preset).toContain('"useSortedClasses"');
		expect(preset).toContain('"functions": [');
		expect(preset).toContain('"cn"');
	});

	it('generates a consumer plugin and AI rule summary', () => {
		const plugin = generateGritPlugin('consumer');
		const rawTextPlugin = generateRawJsxTextGritPlugin('consumer');
		const aiRules = generateAiRules('consumer');
		const engineMatches = rawTextPlugin.match(/engine biome\(1\.0\)/g) ?? [];

		expect(plugin).toContain('@contractspec/lib.ui-kit-web/ui/button');
		expect(plugin).not.toContain('JsxText() as $text');
		expect(rawTextPlugin).toContain('JsxText() as $text');
		expect(rawTextPlugin).toContain('`{$string}` as $expression');
		expect(rawTextPlugin).toContain('<Text $attributes>$children</Text>');
		expect(rawTextPlugin).toContain(
			'<LegalHeading $attributes>$children</LegalHeading>'
		);
		expect(plugin).toContain(
			'@contractspec/lib.contracts-runtime-server-mcp/provider-mcp'
		);
		expect(engineMatches).toHaveLength(1);
		expect(plugin).toContain('or {');
		expect(aiRules).toContain('consumer/require-contract-first');
		expect(aiRules).toContain('consumer/no-deprecated-contracts-monolith');
		expect(aiRules).toContain(
			'consumer/prefer-contractspec-runtime-entrypoints'
		);
		expect(aiRules).toContain('consumer/no-raw-jsx-text-outside-typography');
	});

	it('bundles generated artifacts by audience', () => {
		const artifacts = generateArtifactsForAudience('repo');

		expect(artifacts.preset).toContain('noUnusedImports');
		expect(Object.keys(artifacts.plugins)).toEqual([
			'repo-prefer-design-system.grit',
			'repo-no-raw-jsx-text-outside-typography.grit',
		]);
	});

	it('rejects raw divs with layout primitive guidance', () => {
		const preset = JSON.parse(generateBiomePreset('repo')) as {
			overrides: Record<string, unknown>[];
		};
		const restrictedElementOverride = preset.overrides.find((override) =>
			JSON.stringify(override).includes('noRestrictedElements')
		);

		const result = runBiomeCheck('export const Probe = () => <div />;\n', {
			$schema: 'https://biomejs.dev/schemas/2.4.12/schema.json',
			formatter: { enabled: false },
			linter: {
				enabled: true,
				rules: {
					recommended: false,
				},
			},
			overrides: [restrictedElementOverride],
		});

		expect(result.status).not.toBe(0);
		expect(result.output).toContain('HStack, VStack, or Box');
		expect(result.output).toContain('@contractspec/lib.design-system/layout');
	});

	it('rejects raw JSX text outside typography containers', () => {
		const result = runBiomeCheck(
			[
				'export const BadBox = () => <Box>Hello</Box>;',
				'export const BadMixed = () => <Box>Hello <Text>ok</Text></Box>;',
				'export const BadButton = () => <Button>Save</Button>;',
				'export const BadString = () => <Box>{"Hello"}</Box>;',
			].join('\n'),
			{
				$schema: 'https://biomejs.dev/schemas/2.4.12/schema.json',
				formatter: { enabled: false },
				linter: {
					enabled: true,
					rules: {
						recommended: false,
					},
				},
				plugins: ['./repo-no-raw-jsx-text-outside-typography.grit'],
			}
		);

		expect(result.status).not.toBe(0);
		expect(result.output).toContain(
			'Wrap visible JSX text with Text or another approved typography component'
		);
	});

	it('rejects raw list and heading elements in shared presentation scope', () => {
		const preset = JSON.parse(generateBiomePreset('repo')) as {
			overrides: Record<string, unknown>[];
		};
		const restrictedElementOverride = preset.overrides.find((override) =>
			JSON.stringify(override).includes('noRestrictedElements')
		);

		const result = runBiomeCheck(
			[
				'export const BadList = () => <ul><li>Item</li></ul>;',
				'export const BadHeading = () => <h1>Title</h1>;',
			].join('\n'),
			{
				$schema: 'https://biomejs.dev/schemas/2.4.12/schema.json',
				formatter: { enabled: false },
				linter: {
					enabled: true,
					rules: {
						recommended: false,
					},
				},
				overrides: [restrictedElementOverride],
				plugins: ['./repo-no-raw-jsx-text-outside-typography.grit'],
			}
		);

		expect(result.status).not.toBe(0);
		expect(result.output).toContain('@contractspec/lib.design-system/list');
		expect(result.output).toContain(
			'Use Text or a typography heading component'
		);
		expect(result.output).toContain(
			'Wrap visible JSX text with Text or another approved typography component'
		);
	});

	it('allows text inside approved typography containers', () => {
		const result = runBiomeCheck(
			[
				'export const TextProbe = () => <Text>Hello</Text>;',
				'export const ParagraphProbe = () => <P>Hello</P>;',
				'export const ListProbe = () => <List><ListItem><Text>Item</Text></ListItem></List>;',
				'export const LayoutProbe = () => (',
				'  <Box>',
				'    <Text>ok</Text>',
				'  </Box>',
				');',
				'export const DynamicProbe = ({ label }: { label: string }) => <Box>{label}</Box>;',
			].join('\n'),
			{
				$schema: 'https://biomejs.dev/schemas/2.4.12/schema.json',
				formatter: { enabled: false },
				linter: {
					enabled: true,
					rules: {
						recommended: false,
					},
				},
				plugins: ['./repo-no-raw-jsx-text-outside-typography.grit'],
			}
		);

		expect(result.output).not.toContain('plugin');
		expect(result.status).toBe(0);
	});

	it('does not apply repo presentation guardrails to app packages by default', () => {
		const preset = JSON.parse(generateBiomePreset('repo')) as {
			overrides: Array<{ includes?: string[]; plugins?: string[] }>;
		};

		const rawTextOverride = preset.overrides.find((override) =>
			override.plugins?.some((plugin) =>
				plugin.includes('no-raw-jsx-text-outside-typography')
			)
		);
		const restrictedElementOverride = preset.overrides.find((override) =>
			JSON.stringify(override).includes('noRestrictedElements')
		);

		expect(rawTextOverride?.includes).not.toContain(
			'packages/apps/**/*.{jsx,tsx}'
		);
		expect(restrictedElementOverride?.includes).not.toContain(
			'packages/apps/**/*.{jsx,tsx}'
		);
	});

	it('can opt app packages into repo presentation guardrails', () => {
		const rawHtmlRule = policyManifest.find(
			(rule) => rule.id === 'repo/no-raw-html-in-app-surfaces'
		);
		const previousOptions = rawHtmlRule?.options;

		if (!rawHtmlRule) {
			throw new Error('Expected raw HTML policy rule to exist.');
		}

		rawHtmlRule.options = {
			...previousOptions,
			appPackageAllowList: ['web-landing'],
		};

		try {
			const preset = JSON.parse(generateBiomePreset('repo')) as {
				overrides: Array<{ includes?: string[] }>;
			};
			const restrictedElementOverride = preset.overrides.find((override) =>
				JSON.stringify(override).includes('noRestrictedElements')
			);

			expect(restrictedElementOverride?.includes).toContain(
				'packages/apps/web-landing/**/*.{jsx,tsx}'
			);
		} finally {
			rawHtmlRule.options = previousOptions;
		}
	});
});
