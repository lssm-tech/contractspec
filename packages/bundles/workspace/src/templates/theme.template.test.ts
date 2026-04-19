import { describe, expect, it } from 'bun:test';
import { generateThemeSpec, type ThemeSpecParams } from './theme.template';

describe('generateThemeSpec', () => {
	it('generates a theme spec using defineTheme', () => {
		const params: ThemeSpecParams = {
			key: 'design.console',
			version: '1.0.0',
			title: 'Console Theme',
			description: 'Theme used by the console.',
			domain: 'design-system',
			owners: ['@team-design'],
			tags: ['theme', 'console'],
			stability: 'experimental',
			scopes: ['tenant'],
		};

		const code = generateThemeSpec(params);

		expect(code).toContain('import { defineTheme }');
		expect(code).toContain("key: 'design.console'");
		expect(code).toContain("version: '1.0.0'");
		expect(code).toContain("scopes: ['tenant']");
		expect(code).toContain('tokens: {');
	});
});
