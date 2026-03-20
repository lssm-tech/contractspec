import { describe, expect, it } from 'bun:test';
import { StabilityEnum } from '../ownership';
import { defineJob, type JobSpec, JobSpecRegistry } from './spec';

const createJobSpec = (key: string, overrides?: Partial<JobSpec>): JobSpec => ({
	meta: {
		key,
		version: '1.0.0',
		title: `Job ${key}`,
		description: `Description for ${key}`,
		stability: StabilityEnum.Stable,
		owners: ['platform.core'],
		tags: ['test'],
	},
	payload: { schema: {} },
	...overrides,
});

describe('defineJob', () => {
	it('should return the same spec', () => {
		const spec = createJobSpec('core.ping');
		expect(defineJob(spec)).toBe(spec);
	});

	it('should accept schedule config', () => {
		const spec = defineJob(
			createJobSpec('billing.reconcile', {
				schedule: { cron: '0 * * * *' },
				timeoutMs: 30_000,
				retry: { maxRetries: 5 },
			})
		);
		expect(spec.schedule?.cron).toBe('0 * * * *');
		expect(spec.timeoutMs).toBe(30_000);
		expect(spec.retry?.maxRetries).toBe(5);
	});
});

describe('JobSpecRegistry', () => {
	it('should register and retrieve a job spec', () => {
		const registry = new JobSpecRegistry();
		const spec = createJobSpec('core.ping');

		registry.register(spec);

		expect(registry.get('core.ping', '1.0.0')).toBe(spec);
	});

	it('should list all registered specs', () => {
		const registry = new JobSpecRegistry();
		registry.register(createJobSpec('a'));
		registry.register(createJobSpec('b'));

		expect(registry.list()).toHaveLength(2);
	});

	it('should accept items via constructor', () => {
		const specs = [createJobSpec('x'), createJobSpec('y')];
		const registry = new JobSpecRegistry(specs);

		expect(registry.list()).toHaveLength(2);
		expect(registry.get('x', '1.0.0')).toBe(specs[0]);
	});

	it('should return undefined for unregistered key', () => {
		const registry = new JobSpecRegistry();
		expect(registry.get('missing', '1.0.0')).toBeUndefined();
	});
});
