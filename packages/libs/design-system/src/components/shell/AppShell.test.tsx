import { describe, expect, it } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { AppShell } from './AppShell';

describe('AppShell', () => {
	it('renders shell brand, breadcrumbs, nested navigation, content, and page outline', () => {
		const html = renderToStaticMarkup(
			<AppShell
				title="Console"
				activeHref="/projects/active"
				breadcrumbs={[{ href: '/', label: 'Home' }, { label: 'Projects' }]}
				navigation={[
					{
						title: 'Workspace',
						items: [
							{
								label: 'Projects',
								href: '/projects',
								match: 'startsWith',
								children: [{ label: 'Active', href: '/projects/active' }],
							},
						],
					},
				]}
				pageOutline={[
					{ id: 'summary', label: 'Summary' },
					{ id: 'details', label: 'Details', level: 2 },
				]}
			>
				<section id="summary">Shell content</section>
			</AppShell>
		);

		expect(html).toContain('Console');
		expect(html).toContain('Home');
		expect(html).toContain('Projects');
		expect(html).toContain('Active');
		expect(html).toContain('Shell content');
		expect(html).toContain('href="#summary"');
		expect(html).toContain('href="#details"');
		expect(html).toContain('aria-current="page"');
	});
});
