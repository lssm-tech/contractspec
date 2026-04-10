import { describe, expect, test } from 'bun:test';
import { getTemplateApolloClient } from './runtime-client';

describe('getTemplateApolloClient', () => {
	test('returns the apollo client exposed by the initialized runtime', () => {
		const apolloClient = { name: 'apollo-client' };
		const runtime = {
			graphql: {
				apollo: apolloClient,
			},
		};

		expect(getTemplateApolloClient(runtime)).toBe(apolloClient);
	});
});
