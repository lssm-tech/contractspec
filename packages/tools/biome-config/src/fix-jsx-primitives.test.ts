import { describe, expect, it } from 'bun:test';
import { fixJsxPrimitivesInSource } from './fix-jsx-primitives';

function fix(source: string, filePath = 'packages/modules/demo/src/Probe.tsx') {
	return fixJsxPrimitivesInSource(source, { filePath });
}

describe('fix-jsx-primitives', () => {
	it('rewrites divs and sole raw text to Box and Text', () => {
		const result = fix(
			'export const Probe = () => <div className="x">Body</div>;'
		);

		expect(result.conflicts).toEqual([]);
		expect(result.changed).toBe(true);
		expect(result.output).toContain(
			"import { Box } from '@contractspec/lib.design-system/layout';"
		);
		expect(result.output).toContain(
			"import { Text } from '@contractspec/lib.design-system/typography';"
		);
		expect(result.output).toContain(
			'<Box className="x"><Text>Body</Text></Box>'
		);
	});

	it('rewrites headings to typography components without wrapping text', () => {
		const result = fix('export const Probe = () => <h1>Title</h1>;');

		expect(result.changed).toBe(true);
		expect(result.output).toContain(
			"import { H1 } from '@contractspec/lib.design-system/typography';"
		);
		expect(result.output).toContain('<H1>Title</H1>');
		expect(result.output).not.toContain('<Text>Title</Text>');
	});

	it('rewrites unordered lists to List and ListItem', () => {
		const result = fix(
			[
				"import { Text } from '@contractspec/lib.design-system/typography';",
				'export const Probe = () => <ul><li><Text>Item</Text></li></ul>;',
			].join('\n')
		);

		expect(result.changed).toBe(true);
		expect(result.output).toContain(
			"import { List, ListItem } from '@contractspec/lib.design-system/list';"
		);
		expect(result.output).toContain(
			'<List><ListItem><Text>Item</Text></ListItem></List>'
		);
	});

	it('rewrites ordered lists and wraps sole list item text', () => {
		const result = fix('export const Probe = () => <ol><li>Step</li></ol>;');

		expect(result.changed).toBe(true);
		expect(result.output).toContain(
			'<List type="ordered"><ListItem><Text>Step</Text></ListItem></List>'
		);
	});

	it('reports mixed text but leaves it unchanged', () => {
		const result = fix(
			"import { Box, Text } from '@contractspec/lib.design-system';\nexport const Probe = () => <Box>Hello <Text>ok</Text></Box>;"
		);

		expect(result.changed).toBe(false);
		expect(
			result.reports.some((report) => report.includes('Mixed JSX text'))
		).toBe(true);
		expect(result.output).toContain('<Box>Hello <Text>ok</Text></Box>');
	});

	it('skips app package files unless they are allowlisted', () => {
		const source = 'export const Probe = () => <div>Body</div>;';
		const skipped = fixJsxPrimitivesInSource(source, {
			filePath: 'packages/apps/web-landing/src/Probe.tsx',
		});
		const allowed = fixJsxPrimitivesInSource(source, {
			allowApps: ['web-landing'],
			filePath: 'packages/apps/web-landing/src/Probe.tsx',
		});

		expect(skipped.skipped).toBe(true);
		expect(skipped.changed).toBe(false);
		expect(allowed.skipped).toBe(false);
		expect(allowed.changed).toBe(true);
	});

	it('reports identifier collisions without rewriting the file', () => {
		const source = [
			'import { Box } from "other-ui";',
			'export const Probe = () => <div>Body</div>;',
		].join('\n');
		const result = fix(source);

		expect(result.skipped).toBe(true);
		expect(result.changed).toBe(false);
		expect(result.conflicts).toContain(
			'Box is already imported from other-ui.'
		);
		expect(result.output).toBe(source);
	});
});
