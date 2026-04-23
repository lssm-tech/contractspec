import { describe, expect, it } from 'bun:test';
import {
	createInitialListFilters,
	createScopedListState,
	sanitizeListUserFilters,
} from './index';

interface PostFilters extends Record<string, unknown> {
	status?: string;
	categoryId?: string;
	query?: string;
}

describe('list filter scope helpers', () => {
	it('keeps locked filters out of user-editable state', () => {
		const filters = sanitizeListUserFilters<PostFilters>(
			{ status: 'draft', categoryId: 'cat_2', query: '' },
			{ locked: { categoryId: 'cat_1' } }
		);

		expect(filters).toEqual({ status: 'draft' });
	});

	it('seeds initial filters and applies locked filters to effective state', () => {
		const scoped = createScopedListState<PostFilters>(
			{
				q: '',
				page: 2,
				limit: 20,
				filters: { status: 'draft', categoryId: 'cat_2' },
			},
			{
				initial: { status: 'published' },
				locked: { categoryId: 'cat_1' },
			}
		);

		expect(scoped.filters).toEqual({
			status: 'draft',
			categoryId: 'cat_1',
		});
	});

	it('separates initial filter seeding from locked constraints', () => {
		const filters = createInitialListFilters<PostFilters>({
			initial: { status: 'published', categoryId: 'cat_2' },
			locked: { categoryId: 'cat_1' },
		});

		expect(filters).toEqual({ status: 'published' });
	});
});
