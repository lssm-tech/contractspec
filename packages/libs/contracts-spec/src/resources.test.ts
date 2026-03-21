import { describe, expect, it } from 'bun:test';
import { z } from 'zod';
import { defineResourceTemplate, ResourceRegistry } from './resources';

describe('ResourceRegistry.match', () => {
	it('matches templates with literal regex metacharacters', () => {
		const registry = new ResourceRegistry();
		registry.register(
			defineResourceTemplate({
				meta: {
					uriTemplate: 'content://doc.v1/{id}',
					title: 'Doc',
					mimeType: 'text/plain',
				},
				input: z.object({ id: z.string() }),
				resolve: async ({ id }) => ({
					uri: `content://doc.v1/${id}`,
					data: '',
				}),
			})
		);

		expect(registry.match('content://doc.v1/123')?.params).toEqual({
			id: '123',
		});
	});

	it('does not match near-miss URIs when the template contains metacharacters', () => {
		const registry = new ResourceRegistry();
		registry.register(
			defineResourceTemplate({
				meta: {
					uriTemplate: 'content://doc.v1/{id}',
					title: 'Doc',
					mimeType: 'text/plain',
				},
				input: z.object({ id: z.string() }),
				resolve: async ({ id }) => ({
					uri: `content://doc.v1/${id}`,
					data: '',
				}),
			})
		);

		expect(registry.match('content://docXv1/123')).toBeUndefined();
	});

	it('extracts and decodes params for normal matches', () => {
		const registry = new ResourceRegistry();
		registry.register(
			defineResourceTemplate({
				meta: {
					uriTemplate: 'marketplace://offers/{city}/{tag}',
					title: 'Offers',
					mimeType: 'application/json',
				},
				input: z.object({ city: z.string(), tag: z.string() }),
				resolve: async ({ city, tag }) => ({
					uri: `marketplace://offers/${city}/${tag}`,
					data: '',
				}),
			})
		);

		expect(
			registry.match('marketplace://offers/paris/summer%20sale')?.params
		).toEqual({
			city: 'paris',
			tag: 'summer sale',
		});
	});
});
