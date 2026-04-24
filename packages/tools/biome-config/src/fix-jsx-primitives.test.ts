import { describe, expect, it } from 'bun:test';
import { fixJsxPrimitivesInSource } from './fix-jsx-primitives';

function fix(source: string, filePath = 'packages/modules/demo/src/Probe.tsx') {
	return fixJsxPrimitivesInSource(source, { filePath });
}

describe('fix-jsx-primitives', () => {
	it('preserves className on Box and wraps raw body text', () => {
		const result = fix(
			'export const Probe = () => <div className="space-y-4 rounded-2xl border">Body</div>;'
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
			'<Box className="space-y-4 rounded-2xl border"><Text>Body</Text></Box>'
		);
	});

	it('rewrites headings and preserves typography classes', () => {
		const result = fix(
			'export const Probe = () => <h2 className="font-bold text-2xl text-foreground">Title</h2>;'
		);

		expect(result.changed).toBe(true);
		expect(result.output).toContain(
			"import { H2 } from '@contractspec/lib.design-system/typography';"
		);
		expect(result.output).toContain(
			'<H2 className="font-bold text-2xl text-foreground">Title</H2>'
		);
	});

	it('rewrites unordered lists with inferred props and preserved residual classes', () => {
		const result = fix(
			[
				'export const Probe = () => (',
				'  <ul className="list-disc space-y-2 pl-6 rounded-xl">',
				'    <li>Item</li>',
				'  </ul>',
				');',
			].join('\n')
		);

		expect(result.changed).toBe(true);
		expect(result.output).toContain(
			"import { List, ListItem } from '@contractspec/lib.design-system/list';"
		);
		expect(result.output).toContain(
			'<List type="unordered" spacing="sm" className="pl-6 rounded-xl">'
		);
		expect(result.output).toContain('<ListItem><Text>Item</Text></ListItem>');
	});

	it('rewrites ordered lists and maps spacing tokens', () => {
		const result = fix(
			[
				'export const Probe = () => (',
				'  <ol className="list-decimal space-y-3">',
				'    <li>Step</li>',
				'  </ol>',
				');',
			].join('\n')
		);

		expect(result.changed).toBe(true);
		expect(result.output).toContain('<List type="ordered" spacing="md">');
		expect(result.output).toContain('<ListItem><Text>Step</Text></ListItem>');
	});

	it('wraps mixed visible text runs without crossing JSX element boundaries', () => {
		const result = fix(
			'export const Probe = () => <Box>Start with OSS <ArrowRight size={16} /></Box>;'
		);

		expect(result.changed).toBe(true);
		expect(result.output).toContain(
			'<Box><Text asChild><span>Start with OSS </span></Text><ArrowRight size={16} /></Box>'
		);
	});

	it('wraps text-expression runs into a single Text node', () => {
		const result = fix(
			"export const Probe = ({ count }: { count: number }) => <Box>{count} source{count !== 1 ? 's' : ''}</Box>;"
		);

		expect(result.changed).toBe(true);
		expect(result.output).toContain(
			"<Box><Text>{count} source{count !== 1 ? 's' : ''}</Text></Box>"
		);
	});

	it('reuses compatible imports from ui-kit modules', () => {
		const result = fix(
			[
				"import { Box } from '@contractspec/lib.ui-kit-web/ui/stack';",
				"import { Text } from '@contractspec/lib.ui-kit-web/ui/text';",
				'export const Probe = () => <div className="x">Body</div>;',
			].join('\n')
		);

		expect(result.changed).toBe(true);
		expect(result.output).not.toContain(
			'@contractspec/lib.design-system/layout'
		);
		expect(result.output).not.toContain(
			'@contractspec/lib.design-system/typography'
		);
		expect(result.output).toContain(
			'<Box className="x"><Text>Body</Text></Box>'
		);
	});

	it('keeps generic spans unchanged and reports them as unsupported', () => {
		const source =
			'export const Probe = () => <span className="inline-block">Inline</span>;';
		const result = fix(source);

		expect(result.changed).toBe(false);
		expect(
			result.unsupportedPatterns.some((message) => message.includes('<span>'))
		).toBe(true);
		expect(result.output).toBe(source);
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

	it('reports identifier collisions without rewriting the conflicting node', () => {
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
