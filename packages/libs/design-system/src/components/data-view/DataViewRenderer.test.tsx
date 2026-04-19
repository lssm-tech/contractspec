import { describe, expect, it } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { DataViewRenderer } from './DataViewRenderer';

const tableSpec = {
	meta: {
		key: 'accounts.table',
		version: '1.0.0',
		title: 'Accounts',
		description: 'Account table',
		domain: 'accounts',
		entity: 'account',
		owners: ['@team.ops'],
	},
	source: {
		primary: { key: 'accounts.list', version: '1.0.0' },
	},
	view: {
		kind: 'table',
		filters: [
			{
				key: 'status',
				label: 'Status',
				field: 'status',
				type: 'enum',
				options: [{ value: 'healthy', label: 'Healthy' }],
			},
		],
		fields: [
			{
				key: 'account',
				label: 'Account',
				dataPath: 'account',
				sortable: true,
			},
		],
	},
} as const;

describe('DataViewRenderer table mode', () => {
	it('forwards toolbar/loading and does not duplicate header actions into filters', () => {
		const html = renderToStaticMarkup(
			<DataViewRenderer
				spec={tableSpec}
				items={[{ account: 'Northwind' }]}
				search=""
				onSearchChange={() => void 0}
				headerActions={<span>Header action</span>}
				toolbar={<span>Toolbar slot</span>}
				loading
			/>
		);

		expect(html).toContain('Toolbar slot');
		expect(html).toContain('Header action');
		expect(html.match(/Header action/g)?.length).toBe(1);
	});
});
