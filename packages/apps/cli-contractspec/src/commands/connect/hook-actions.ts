import { runAdoptionHook } from './adoption-hooks';
import { runContractsSpecHook } from './contracts-spec-hooks';
import { type ContractsSpecHookEvent } from './hook-payload';
import { buildActor, parseJsonOrText, readRequiredStdin } from './io';
import { createConnectCommandContext } from './runtime';

export async function runConnectContractsSpecHookCommand(options: {
	event: ContractsSpecHookEvent;
	json?: boolean;
}) {
	const ctx = await createConnectCommandContext(options);
	const payload = parseJsonOrText(await readRequiredStdin());
	const actor = buildActor(`contracts-spec:${options.event}`, {
		actorId: 'hook:contracts-spec',
		actorType: 'tool',
		sessionId: 'contracts-spec-hook',
	});
	return runContractsSpecHook({
		actor,
		ctx,
		event: options.event,
		json: options.json,
		payload,
	});
}

export async function runConnectAdoptionHookCommand(options: {
	event: ContractsSpecHookEvent;
	json?: boolean;
}) {
	const ctx = await createConnectCommandContext(options);
	const payload = parseJsonOrText(await readRequiredStdin());
	const actor = buildActor(`adoption:${options.event}`, {
		actorId: 'hook:adoption',
		actorType: 'tool',
		sessionId: 'adoption-hook',
	});
	return runAdoptionHook({
		actor,
		ctx,
		event: options.event,
		json: options.json,
		payload,
	});
}
