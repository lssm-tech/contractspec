import { defineQuery } from '@contractspec/lib.contracts-spec/operations';
import { fromZod } from '@contractspec/lib.schema';
import { z } from 'zod';

const rowSchema = z.object({
	id: z.string(),
	account: z.string(),
	owner: z.string(),
	status: z.enum(['healthy', 'attention', 'risk']),
	region: z.enum(['North America', 'Europe', 'APAC']),
	arr: z.number(),
	renewalDate: z.string(),
	lastActivityAt: z.string(),
	notes: z.string(),
});

export const ListDataGridShowcaseRowsQuery = defineQuery({
	meta: {
		key: 'examples.data-grid-showcase.rows.list',
		version: '1.0.0',
		title: 'List Data Grid Showcase Rows',
		description: 'Lists the demo rows used by the data-grid showcase.',
		goal: 'Back the sample table data view contract.',
		context: 'Example and documentation surfaces.',
		owners: ['@platform.core'],
		tags: ['examples', 'table', 'data-grid'],
		stability: 'experimental',
	},
	io: {
		input: fromZod(
			z.object({
				projectId: z.string().optional(),
			})
		),
		output: fromZod(z.array(rowSchema)),
	},
	policy: {
		auth: 'anonymous',
	},
});
