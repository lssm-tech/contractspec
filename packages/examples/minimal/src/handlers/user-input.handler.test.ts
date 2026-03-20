import { describe, expect, test } from 'bun:test';
import { userInputHandler } from './user-input.handler';

describe('@contractspec/example.minimal user handler', () => {
	test('returns the stable user payload shape', async () => {
		const response = await userInputHandler(
			{
				email: 'hello@contractspec.io',
			},
			{} as never
		);

		expect(response).toEqual({
			email: 'hello@contractspec.io',
		});
	});
});
