import { describe, expect, it } from 'bun:test';
import {
	createFieldRendererRegistry,
	FALLBACK_FIELD_KIND,
} from './field-renderer-registry';

describe('createFieldRendererRegistry', () => {
	it('returns registry with get, has, getOrFallback', () => {
		const registry = createFieldRendererRegistry();
		expect(registry.get('text')).toBeDefined();
		expect(registry.has('text')).toBe(true);
		expect(registry.getOrFallback('text')).toBeDefined();
	});

	it('returns core field kinds (text, number, date, select)', () => {
		const registry = createFieldRendererRegistry();
		expect(registry.get('text')?.fieldKind).toBe('text');
		expect(registry.get('number')?.fieldKind).toBe('number');
		expect(registry.get('date')?.fieldKind).toBe('date');
		expect(registry.get('select')?.fieldKind).toBe('select');
	});

	it('returns stub field kinds (relation, rollup, formula, people)', () => {
		const registry = createFieldRendererRegistry();
		expect(registry.get('relation')?.fieldKind).toBe('relation');
		expect(registry.get('rollup')?.fieldKind).toBe('rollup');
		expect(registry.get('formula')?.fieldKind).toBe('formula');
		expect(registry.get('people')?.fieldKind).toBe('people');
	});

	it('returns undefined for unknown kind via get', () => {
		const registry = createFieldRendererRegistry();
		expect(registry.get('unknown')).toBeUndefined();
		expect(registry.has('unknown')).toBe(false);
	});

	it('returns fallback for unknown kind via getOrFallback', () => {
		const registry = createFieldRendererRegistry();
		const spec = registry.getOrFallback('unknown');
		expect(spec.fieldKind).toBe(FALLBACK_FIELD_KIND);
	});
});
