import { describe, expect, it } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { PageOutline } from './PageOutline';

describe('PageOutline', () => {
	it('renders three heading levels with active state', () => {
		const html = renderToStaticMarkup(
			<PageOutline
				activeId="install"
				items={[
					{
						id: 'intro',
						label: 'Intro',
						children: [
							{
								id: 'install',
								label: 'Install',
								children: [{ id: 'native', label: 'Native' }],
							},
						],
					},
				]}
			/>
		);

		expect(html).toContain('aria-label="On this page"');
		expect(html).toContain('href="#intro"');
		expect(html).toContain('href="#install"');
		expect(html).toContain('href="#native"');
		expect(html).toContain('aria-current="location"');
	});

	it('renders the floating variant as a reduced rail that expands on interaction', () => {
		const html = renderToStaticMarkup(
			<PageOutline
				activeId="details"
				variant="floating"
				items={[
					{ id: 'summary', label: 'Summary' },
					{ id: 'details', label: 'Details', level: 2 },
				]}
			/>
		);

		expect(html).toContain('href="#summary"');
		expect(html).toContain('href="#details"');
		expect(html).toContain('aria-current="location"');
		expect(html).toContain('w-10');
		expect(html).toContain('hover:w-64');
		expect(html).toContain('focus-within:w-64');
		expect(html).toContain('opacity-0');
		expect(html).toContain('group-hover:opacity-100');
	});

	it('keeps rail and compact variants available', () => {
		const items = [{ id: 'summary', label: 'Summary' }];
		const rail = renderToStaticMarkup(<PageOutline items={items} />);
		const compact = renderToStaticMarkup(
			<PageOutline items={items} variant="compact" />
		);

		expect(rail).toContain('sticky');
		expect(rail).toContain('border-l');
		expect(compact).toContain('rounded-md');
		expect(compact).toContain('border');
	});
});
