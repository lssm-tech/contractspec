import type { ConnectVerdict } from '@contractspec/lib.contracts-spec/workspace-config';

type ConnectActorRef = {
	id: string;
	type: 'human' | 'agent' | 'service' | 'tool';
	sessionId?: string;
	traceId?: string;
};

export async function readRequiredStdin(): Promise<string> {
	const chunks: Buffer[] = [];

	for await (const chunk of process.stdin) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	}

	const content = Buffer.concat(chunks).toString('utf-8').trim();
	if (!content) {
		throw new Error('Expected JSON or text input on stdin.');
	}

	return content;
}

export function parseJsonOrText(
	content: string
): string | Record<string, unknown> {
	const trimmed = content.trim();
	if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
		return JSON.parse(trimmed) as Record<string, unknown>;
	}

	return trimmed;
}

export function buildActor(
	taskId: string,
	options: {
		actorId?: string;
		actorType?: ConnectActorRef['type'];
		sessionId?: string;
		traceId?: string;
	}
): ConnectActorRef {
	return {
		id: options.actorId ?? `cli:${taskId}`,
		type: options.actorType ?? 'human',
		sessionId: options.sessionId,
		traceId: options.traceId,
	};
}

export function requireNonEmptyString(value: string, label: string): string {
	const normalized = value.trim();
	if (!normalized) {
		throw new Error(`${label} is required.`);
	}
	return normalized;
}

export function requireExactlyOne(
	left: { label: string; value: string | undefined },
	right: { label: string; value: string | undefined }
) {
	if (Boolean(left.value) === Boolean(right.value)) {
		throw new Error(`Provide exactly one of ${left.label} or ${right.label}.`);
	}
}

export function exitCodeForVerdict(verdict: ConnectVerdict): number {
	switch (verdict) {
		case 'rewrite':
			return 10;
		case 'require_review':
			return 20;
		case 'deny':
			return 30;
		case 'permit':
		default:
			return 0;
	}
}

export function connectErrorExitCode(error: unknown): number {
	const message = error instanceof Error ? error.message : String(error);
	if (
		message.includes('Connect is not enabled') ||
		message.includes('.contractsrc.json') ||
		message.includes('Provide exactly one of') ||
		message.includes('is required') ||
		message.includes('Expected JSON or text input') ||
		message.includes('No stored Connect decision') ||
		message.includes('Could not load registry module')
	) {
		return 40;
	}

	return 1;
}
