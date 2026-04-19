import { describe, expect, it } from 'bun:test';
import { validateSpecStructure } from './spec-structure';

describe('validateSpecStructure theme support', () => {
	it('accepts defineTheme-based theme specs', () => {
		const result = validateSpecStructure({
			filePath: 'src/design.theme.ts',
			specType: 'theme',
			sourceBlock: `
        import { defineTheme } from '@contractspec/lib.contracts-spec/themes';

        export const ConsoleTheme = defineTheme({
          meta: {
            key: 'design.console',
            version: '1.0.0',
            title: 'Console Theme',
            description: 'Theme for console surfaces.',
            domain: 'design-system',
            owners: ['@team-design'],
            tags: ['theme'],
            stability: 'experimental',
          },
          tokens: {
            colors: {
              primary: { value: '#2563eb' },
            },
          },
        });
      `,
		});

		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it('reports missing theme authoring markers', () => {
		const result = validateSpecStructure({
			filePath: 'src/design.theme.ts',
			specType: 'theme',
			sourceBlock: `
        export const ConsoleTheme = {
          tokens: {},
        };
      `,
		});

		expect(result.valid).toBe(false);
		expect(result.errors).toContain(
			'Missing defineTheme call or ThemeSpec type annotation'
		);
	});
});
