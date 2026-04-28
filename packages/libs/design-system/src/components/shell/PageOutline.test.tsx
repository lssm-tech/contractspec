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
});
