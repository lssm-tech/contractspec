import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';

const createAdditionalContractSpecMock = mock(async () => undefined);

mock.module('./create-additional-contract', () => ({
	createAdditionalContractSpec: createAdditionalContractSpecMock,
}));

const { createCommand } = await import('./create-command');

const originalConsoleLog = console.log;

describe('createCommand', () => {
	beforeEach(() => {
		createAdditionalContractSpecMock.mockClear();
		console.log = mock(() => {}) as typeof console.log;
	});

	afterEach(() => {
		console.log = originalConsoleLog;
	});

	it('dispatches configurable new contract kinds to the additional creator', async () => {
		await createCommand(
			{ type: 'capability', ai: false } as never,
			{} as never
		);

		expect(createAdditionalContractSpecMock).toHaveBeenCalledWith(
			'capability',
			expect.objectContaining({ type: 'capability' }),
			expect.anything()
		);
	});

	it('dispatches fixed-layout new contract kinds to the additional creator', async () => {
		await createCommand({ type: 'job', ai: false } as never, {} as never);

		expect(createAdditionalContractSpecMock).toHaveBeenCalledWith(
			'job',
			expect.objectContaining({ type: 'job' }),
			expect.anything()
		);
	});
});
