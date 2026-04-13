import { describe, expect, it } from 'bun:test';
import {
	type FeatureSpecParams,
	generateFeatureSpec,
} from './feature.template';

describe('generateFeatureSpec', () => {
	it('should generate a feature spec with basic params', () => {
		const params: FeatureSpecParams = {
			key: 'my-feature',
			version: '1.0.0',
			title: 'My Feature',
			domain: 'workspace',
			owners: ['@team-a'],
			tags: ['web'],
			operations: [],
			events: [],
			presentations: [],
			experiments: [],
		};
		const code = generateFeatureSpec(params);
		expect(code).toContain('export const MyFeatureFeature = defineFeature({');
		expect(code).toContain('meta: {');
		expect(code).toContain("key: 'my-feature'");
		expect(code).toContain("version: '1.0.0'");
		expect(code).toContain("owners: ['@team-a']");
	});

	it('should include references', () => {
		const params: FeatureSpecParams = {
			key: 'my-feature',
			version: '1.0.0',
			title: 'My Feature',
			domain: 'workspace',
			owners: [],
			tags: [],
			operations: [{ key: 'op1', version: '1.0.0' }],
			events: [{ key: 'ev1', version: '1.0.0' }],
			presentations: [{ key: 'pres1', version: '1.0.0' }],
			experiments: [{ key: 'exp1', version: '1.0.0' }],
		};
		const code = generateFeatureSpec(params);
		expect(code).toContain("{ key: 'op1', version: '1.0.0' }");
		expect(code).toContain("{ key: 'ev1', version: '1.0.0' }");
		expect(code).toContain("{ key: 'pres1', version: '1.0.0' }");
		expect(code).toContain("{ key: 'exp1', version: '1.0.0' }");
	});

	it('should use defaults', () => {
		const params: FeatureSpecParams = {
			key: 'my-feature',
			version: '1.0.0',
			title: 'My Feature',
			domain: 'workspace',
			owners: [],
			tags: [],
			operations: [],
			events: [],
			presentations: [],
			experiments: [],
		};
		const code = generateFeatureSpec(params);
		expect(code).toContain("stability: 'beta'");
		expect(code).toContain('// Add operations here');
	});
});
