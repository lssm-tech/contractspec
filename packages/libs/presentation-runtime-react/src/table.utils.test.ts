import { describe, expect, it } from 'bun:test';
import {
	clampTableSize,
	coerceRowSelectionState,
	createTableInitialState,
	formatTableValue,
	getAtPath,
	normalizeExpandedState,
	normalizePinningState,
	normalizePinState,
} from './table.utils';

describe('table.utils', () => {
	it('creates table state with pinned defaults', () => {
		const state = createTableInitialState(
			{
				pagination: { pageIndex: 1, pageSize: 10 },
				columnPinning: { left: ['id'], right: [] },
			},
			[{ accessorKey: 'name', defaultPinned: 'right' }]
		);

		expect(state.pagination.pageSize).toBe(10);
		expect(state.columnPinning.left).toContain('id');
		expect(state.columnPinning.right).toContain('name');
	});

	it('coerces single selection mode to one row', () => {
		const selection = coerceRowSelectionState(
			{ alpha: true, beta: true },
			'single'
		);

		expect(Object.keys(selection)).toHaveLength(1);
		expect(Object.values(selection)).toEqual([true]);
	});

	it('normalizes pinning and expanded state payloads', () => {
		expect(normalizePinningState({ left: ['id'] })).toEqual({
			left: ['id'],
			right: [],
		});
		expect(normalizeExpandedState(true, ['row-1', 'row-2'])).toEqual({
			'row-1': true,
			'row-2': true,
		});
		expect(normalizePinState(true)).toBe(false);
		expect(normalizePinState('left')).toBe('left');
	});

	it('formats values and reads nested data', () => {
		expect(getAtPath({ profile: { name: 'Ada' } }, 'profile.name')).toBe('Ada');
		expect(clampTableSize(20, 40, 100)).toBe(40);
		expect(formatTableValue(0.5, 'percentage')).toBe('50.0%');
		expect(
			formatTableValue(42.125, { type: 'number', maximumFractionDigits: 1 })
		).toBe('42.1');
		expect(
			formatTableValue(0.125, { type: 'percent', maximumFractionDigits: 1 })
		).toBe('12.5%');
		expect(
			formatTableValue(12.5, {
				type: 'percent',
				valueScale: 'whole',
				maximumFractionDigits: 1,
			})
		).toBe('12.5%');
		expect(
			formatTableValue(1234.56, {
				type: 'currency',
				currency: 'EUR',
				rounded: true,
			})
		).toContain('1,235');
		expect(
			formatTableValue(3661, {
				type: 'duration',
				unit: 'second',
				display: 'digital',
			})
		).toBe('1:01:01');
		expect(
			formatTableValue(61, {
				type: 'duration',
				unit: 'minute',
				display: 'digital',
			})
		).toBe('1:01:00');
	});
});
