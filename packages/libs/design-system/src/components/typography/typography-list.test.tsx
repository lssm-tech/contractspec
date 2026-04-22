import { describe, expect, it } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { List, ListItem } from '../list';
import { H1, P, Text } from './Typography';

describe('design-system typography and list primitives', () => {
	it('renders themed typography wrappers and list primitives', () => {
		const html = renderToStaticMarkup(
			<>
				<H1>Heading</H1>
				<P>Paragraph</P>
				<List>
					<ListItem>
						<Text>Item</Text>
					</ListItem>
				</List>
			</>
		);

		expect(html).toContain('Heading');
		expect(html).toContain('Paragraph');
		expect(html).toContain('<ul');
		expect(html).toContain('<li');
		expect(html).toContain('Item');
	});
});
