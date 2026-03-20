import { describe, expect, test } from 'bun:test';
import { openCodeEchoInputHandler } from './open-code-echo-input.handler';

describe('@contractspec/example.opencode-cli echo handler', () => {
	test('echoes the prompt deterministically', async () => {
		const response = await openCodeEchoInputHandler(
			{
				prompt: 'Hello, OpenCode',
			},
			{} as never
		);

		expect(response).toEqual({
			message: 'Hello, OpenCode',
		});
	});
});
