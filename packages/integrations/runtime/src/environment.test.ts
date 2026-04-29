import { describe, expect, it } from 'bun:test';
import type { EnvironmentConfig } from '@contractspec/lib.contracts-spec/workspace-config/environment';
import {
	buildEnvExample,
	redactEnvironmentValue,
	resolveEnvironmentForTarget,
} from './environment';

describe('environment resolution', () => {
	it('materializes one logical public URL into Next and Expo aliases', () => {
		const config: EnvironmentConfig = {
			targets: {
				web: { id: 'web', framework: 'next' },
				mobile: { id: 'mobile', framework: 'expo' },
			},
			variables: {
				PUBLIC_API_URL: {
					key: 'PUBLIC_API_URL',
					sensitivity: 'public',
					valueSource: { type: 'literal', value: 'https://api.example.com' },
					aliases: [
						{
							targetId: 'web',
							framework: 'next',
							name: 'NEXT_PUBLIC_API_URL',
							exposure: 'public-client',
						},
						{
							targetId: 'mobile',
							framework: 'expo',
							name: 'EXPO_PUBLIC_API_URL',
							exposure: 'native-client',
						},
					],
				},
			},
		};

		const web = resolveEnvironmentForTarget({ config, targetId: 'web' });
		const mobile = resolveEnvironmentForTarget({ config, targetId: 'mobile' });

		expect(web.errors).toEqual([]);
		expect(mobile.errors).toEqual([]);
		expect(web.variables[0]?.envName).toBe('NEXT_PUBLIC_API_URL');
		expect(mobile.variables[0]?.envName).toBe('EXPO_PUBLIC_API_URL');
		expect(buildEnvExample(web)).toBe(
			'NEXT_PUBLIC_API_URL=https://api.example.com'
		);
	});

	it('returns schema validation errors for secret public aliases', () => {
		const report = resolveEnvironmentForTarget({
			config: {
				variables: {
					OPENAI_API_KEY: {
						key: 'OPENAI_API_KEY',
						sensitivity: 'secret',
						aliases: [{ name: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
					},
				},
			},
		});

		expect(report.errors.length).toBeGreaterThan(0);
		expect(report.variables).toEqual([]);
	});

	it('does not materialize aliases scoped to another app target', () => {
		const report = resolveEnvironmentForTarget({
			config: {
				targets: {
					web: { id: 'web', framework: 'next' },
					mobile: { id: 'mobile', framework: 'expo' },
				},
				variables: {
					PUBLIC_APP_URL: {
						key: 'PUBLIC_APP_URL',
						sensitivity: 'public',
						valueSource: { type: 'literal', value: 'https://web.example.com' },
						aliases: [
							{
								targetId: 'web',
								framework: 'next',
								name: 'NEXT_PUBLIC_APP_URL',
								exposure: 'public-client',
							},
						],
					},
				},
			},
			targetId: 'mobile',
		});

		expect(report.errors).toEqual([]);
		expect(report.variables).toEqual([]);
	});

	it('does not materialize framework-only Next aliases for Expo targets', () => {
		const report = resolveEnvironmentForTarget({
			config: {
				targets: {
					mobile: { id: 'mobile', framework: 'expo' },
				},
				variables: {
					PUBLIC_APP_URL: {
						key: 'PUBLIC_APP_URL',
						sensitivity: 'public',
						valueSource: { type: 'literal', value: 'https://web.example.com' },
						aliases: [
							{
								framework: 'next',
								name: 'NEXT_PUBLIC_APP_URL',
								exposure: 'public-client',
							},
						],
					},
				},
			},
			targetId: 'mobile',
		});

		expect(report.errors).toEqual([]);
		expect(report.variables).toEqual([]);
	});

	it('redacts secret host values in reports and examples', () => {
		const report = resolveEnvironmentForTarget({
			config: {
				variables: {
					STRIPE_SECRET_KEY: {
						key: 'STRIPE_SECRET_KEY',
						sensitivity: 'secret',
						valueSource: { type: 'env', envVar: 'STRIPE_SECRET_KEY' },
					},
				},
			},
			hostEnv: {
				STRIPE_SECRET_KEY: 'sk_live_should_not_leak',
			},
		});

		expect(report.errors).toEqual([]);
		expect(report.variables[0]?.redactedValue).toBe('[redacted]');
		expect(buildEnvExample(report)).not.toContain('sk_live_should_not_leak');
	});

	it('keeps secret refs as pointers instead of resolved values', () => {
		const report = resolveEnvironmentForTarget({
			config: {
				variables: {
					POSTMARK_TOKEN: {
						key: 'POSTMARK_TOKEN',
						sensitivity: 'secret',
						valueSource: {
							type: 'byok-connection',
							secretRef: 'env://POSTMARK_TOKEN',
						},
					},
				},
			},
		});

		expect(report.variables[0]?.status).toBe('secret-ref');
		expect(report.variables[0]?.redactedValue).toBe('[secret-ref]');
	});

	it('redacts sensitive values by default', () => {
		expect(
			redactEnvironmentValue(
				{ sensitivity: 'sensitive' },
				'internal-service-url'
			)
		).toBe('[redacted]');
	});
});
