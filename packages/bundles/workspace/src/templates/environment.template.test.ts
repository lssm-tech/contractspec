import { describe, expect, it } from 'bun:test';
import type { EnvironmentConfig } from '@contractspec/lib.contracts-spec/workspace-config/environment';
import {
	generateTargetEnvExample,
	generateWorkspaceEnvExample,
} from './environment.template';

describe('environment templates', () => {
	it('splits global and app-target env examples', () => {
		const config: EnvironmentConfig = {
			variables: {
				CONTRACTSPEC_ENV: {
					key: 'CONTRACTSPEC_ENV',
					sensitivity: 'internal',
					defaultValue: 'local',
				},
				PUBLIC_API_URL: {
					key: 'PUBLIC_API_URL',
					sensitivity: 'public',
					valueSource: { type: 'literal', value: 'https://api.example.com' },
					aliases: [
						{
							targetId: 'web',
							name: 'NEXT_PUBLIC_API_URL',
							exposure: 'public-client',
						},
					],
				},
			},
		};

		expect(generateWorkspaceEnvExample(config)).toBe('CONTRACTSPEC_ENV=local');
		expect(generateTargetEnvExample(config, 'web')).toContain(
			'NEXT_PUBLIC_API_URL=https://api.example.com'
		);
	});

	it('excludes framework-only aliases from root env examples', () => {
		const config: EnvironmentConfig = {
			variables: {
				PUBLIC_WEB_URL: {
					key: 'PUBLIC_WEB_URL',
					sensitivity: 'public',
					valueSource: { type: 'literal', value: 'https://web.example.com' },
					aliases: [
						{
							framework: 'next',
							name: 'NEXT_PUBLIC_WEB_URL',
							exposure: 'public-client',
						},
					],
				},
			},
		};

		expect(generateWorkspaceEnvExample(config)).toBe('');
	});

	it('keeps root aliases when a variable also has app-scoped aliases', () => {
		const config: EnvironmentConfig = {
			variables: {
				PUBLIC_API_URL: {
					key: 'PUBLIC_API_URL',
					sensitivity: 'public',
					valueSource: { type: 'literal', value: 'https://api.example.com' },
					aliases: [
						{
							name: 'PUBLIC_API_URL',
							exposure: 'server',
						},
						{
							framework: 'next',
							name: 'NEXT_PUBLIC_API_URL',
							exposure: 'public-client',
						},
					],
				},
			},
		};

		expect(generateWorkspaceEnvExample(config)).toBe(
			'PUBLIC_API_URL=https://api.example.com'
		);
	});
});
