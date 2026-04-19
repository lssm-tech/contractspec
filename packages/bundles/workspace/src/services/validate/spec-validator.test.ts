import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { SpecScanResult } from '@contractspec/module.workspace';
import { validateDiscoveredSpecs } from './spec-validator';

const tempDir = join(process.cwd(), '.tmp-spec-validator-tests');

beforeAll(async () => {
	await mkdir(tempDir, { recursive: true });
});

afterAll(async () => {
	await rm(tempDir, { recursive: true, force: true });
});

describe('validateDiscoveredSpecs authored validators', () => {
	it('runs theme validation for theme specs', async () => {
		const filePath = join(tempDir, 'invalid.theme.ts');
		const code = `import { defineTheme } from '@contractspec/lib.contracts-spec/themes';

export const BrokenTheme = defineTheme({
  meta: {
    key: 'design.console',
    version: '1.0.0',
    title: '',
    description: 'Theme with missing metadata.',
    domain: 'design-system',
    owners: [],
    tags: ['theme'],
    stability: 'experimental',
  },
  tokens: {},
  overrides: [{ scope: 'tenant', target: '' }],
});
`;
		await writeFile(filePath, code, 'utf-8');

		const [result] = await validateDiscoveredSpecs([
			createSpecScan({
				filePath,
				sourceBlock: code,
				specType: 'theme',
				kind: 'theme',
				exportName: 'BrokenTheme',
			}),
		]);

		expect(result?.valid).toBe(false);
		expect(result?.errors).toEqual(
			expect.arrayContaining([
				expect.stringContaining('meta.title'),
				expect.stringContaining('overrides[0].target'),
			])
		);
	});

	it('runs feature validation for feature specs', async () => {
		const filePath = join(tempDir, 'invalid.feature.ts');
		const code = `import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const BrokenFeature = defineFeature({
  meta: {
    key: 'workspace.setup',
    version: '1.0.0',
    title: 'Workspace Setup',
    description: 'Broken feature for validation.',
    domain: 'workspace',
    owners: ['@team-platform'],
    tags: ['feature'],
    stability: 'beta',
  },
  operations: [{ key: 'workspace.init', version: '1.0.0' }],
  opToPresentation: [
    {
      op: { key: 'workspace.missing', version: '1.0.0' },
      pres: { key: 'workspace.editor', version: '1.0.0' },
    },
  ],
});
`;
		await writeFile(filePath, code, 'utf-8');

		const [result] = await validateDiscoveredSpecs([
			createSpecScan({
				filePath,
				sourceBlock: code,
				specType: 'feature',
				kind: 'feature',
				exportName: 'BrokenFeature',
			}),
		]);

		expect(result?.valid).toBe(false);
		expect(result?.errors).toEqual(
			expect.arrayContaining([
				expect.stringContaining('opToPresentation[0].op'),
				expect.stringContaining('opToPresentation[0].pres'),
			])
		);
	});

	it('runs app-config validation for blueprint specs', async () => {
		const filePath = join(tempDir, 'invalid.app-config.ts');
		const code = `import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const BrokenBlueprint = defineAppConfig({
  meta: {
    key: 'demo.app',
    version: '1.0.0',
    appId: 'demo',
    title: 'Demo App',
    description: 'Broken blueprint for validation.',
    domain: 'demo',
    owners: ['platform.core'],
    tags: ['app-config'],
    stability: 'experimental',
  },
  integrationSlots: [
    { slotId: 'payments.primary', requiredCategory: 'payments' },
    { slotId: 'payments.primary', requiredCategory: 'payments' },
  ],
});
`;
		await writeFile(filePath, code, 'utf-8');

		const [result] = await validateDiscoveredSpecs([
			createSpecScan({
				filePath,
				sourceBlock: code,
				specType: 'app-config',
				kind: 'app-config',
				exportName: 'BrokenBlueprint',
			}),
		]);

		expect(result?.valid).toBe(false);
		expect(result?.errors).toEqual(
			expect.arrayContaining([expect.stringContaining('DUPLICATE_SLOT')])
		);
	});

	it('passes valid authored theme specs', async () => {
		const filePath = join(tempDir, 'valid.theme.ts');
		const code = `import { defineTheme } from '@contractspec/lib.contracts-spec/themes';

export const ConsoleTheme = defineTheme({
  meta: {
    key: 'design.console',
    version: '1.0.0',
    title: 'Console Theme',
    description: 'Valid theme for validation.',
    domain: 'design-system',
    owners: ['@team-design'],
    tags: ['theme'],
    stability: 'experimental',
    scopes: ['tenant'],
  },
  tokens: {
    colors: {
      primary: { value: '#2563eb' },
    },
  },
});
`;
		await writeFile(filePath, code, 'utf-8');

		const [result] = await validateDiscoveredSpecs([
			createSpecScan({
				filePath,
				sourceBlock: code,
				specType: 'theme',
				kind: 'theme',
				exportName: 'ConsoleTheme',
			}),
		]);

		expect(result?.valid).toBe(true);
		expect(result?.errors).toHaveLength(0);
	});
});

function createSpecScan(
	overrides: Partial<SpecScanResult> & {
		filePath: string;
		sourceBlock: string;
		specType: SpecScanResult['specType'];
	}
): SpecScanResult {
	return {
		filePath: overrides.filePath,
		specType: overrides.specType,
		key: overrides.key,
		version: overrides.version,
		kind: overrides.kind,
		exportName: overrides.exportName,
		hasMeta: true,
		hasIo: false,
		hasPolicy: false,
		hasPayload: false,
		hasContent: false,
		hasDefinition: false,
		sourceBlock: overrides.sourceBlock,
	};
}
