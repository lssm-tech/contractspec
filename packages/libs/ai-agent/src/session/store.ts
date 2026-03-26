import type { ModelMessage, StepResult, ToolSet } from 'ai';
import type { AgentSessionState } from '../types';

/**
 * Interface for persisting agent session state.
 *
 * Implementations can use in-memory storage, databases,
 * or external services like Redis.
 */
export interface AgentSessionStore {
	/**
	 * Get a session by ID.
	 */
	get(sessionId: string): Promise<AgentSessionState | null>;

	/**
	 * Create a new session.
	 */
	create(
		session: Omit<AgentSessionState, 'createdAt' | 'updatedAt'>
	): Promise<AgentSessionState>;

	/**
	 * Append a step to a session.
	 */
	appendStep(sessionId: string, step: StepResult<ToolSet>): Promise<void>;

	/**
	 * Append a message to a session.
	 */
	appendMessage(sessionId: string, message: ModelMessage): Promise<void>;

	/**
	 * Update session properties.
	 */
	update(
		sessionId: string,
		updates: Partial<
			Pick<
				AgentSessionState,
				| 'status'
				| 'metadata'
				| 'workflowId'
				| 'threadId'
				| 'traceId'
				| 'checkpointId'
				| 'pendingApprovalRequestId'
				| 'lastError'
			>
		>
	): Promise<void>;

	/**
	 * Delete a session.
	 */
	delete(sessionId: string): Promise<boolean>;

	/**
	 * List sessions by agent ID.
	 */
	listByAgent(agentId: string, limit?: number): Promise<AgentSessionState[]>;

	/**
	 * List sessions by tenant ID.
	 */
	listByTenant(tenantId: string, limit?: number): Promise<AgentSessionState[]>;
}

export interface InMemorySessionStoreOptions {
	maxSessions?: number;
	maxMessagesPerSession?: number;
	maxStepsPerSession?: number;
}

/**
 * In-memory session store for development and testing.
 */
export class InMemorySessionStore implements AgentSessionStore {
	private readonly sessions = new Map<string, AgentSessionState>();
	private readonly maxSessions: number;
	private readonly maxMessagesPerSession: number;
	private readonly maxStepsPerSession: number;

	constructor(options: InMemorySessionStoreOptions = {}) {
		this.maxSessions = options.maxSessions ?? 500;
		this.maxMessagesPerSession = options.maxMessagesPerSession ?? 200;
		this.maxStepsPerSession = options.maxStepsPerSession ?? 200;
	}

	async get(sessionId: string): Promise<AgentSessionState | null> {
		return this.sessions.get(sessionId) ?? null;
	}

	async create(
		session: Omit<AgentSessionState, 'createdAt' | 'updatedAt'>
	): Promise<AgentSessionState> {
		this.evictIfNeeded();

		const now = new Date();
		const fullSession: AgentSessionState = {
			...session,
			createdAt: now,
			updatedAt: now,
		};
		this.sessions.set(session.sessionId, fullSession);
		return fullSession;
	}

	async appendStep(
		sessionId: string,
		step: StepResult<ToolSet>
	): Promise<void> {
		const session = this.sessions.get(sessionId);
		if (session) {
			session.steps.push(step);
			this.trimArray(session.steps, this.maxStepsPerSession);
			session.updatedAt = new Date();
		}
	}

	async appendMessage(sessionId: string, message: ModelMessage): Promise<void> {
		const session = this.sessions.get(sessionId);
		if (session) {
			session.messages.push(message);
			this.trimArray(session.messages, this.maxMessagesPerSession);
			session.updatedAt = new Date();
		}
	}

	async update(
		sessionId: string,
		updates: Partial<
			Pick<
				AgentSessionState,
				| 'status'
				| 'metadata'
				| 'workflowId'
				| 'threadId'
				| 'traceId'
				| 'checkpointId'
				| 'pendingApprovalRequestId'
				| 'lastError'
			>
		>
	): Promise<void> {
		const session = this.sessions.get(sessionId);
		if (session) {
			Object.assign(session, updates, { updatedAt: new Date() });
		}
	}

	async delete(sessionId: string): Promise<boolean> {
		return this.sessions.delete(sessionId);
	}

	async listByAgent(
		agentId: string,
		limit = 100
	): Promise<AgentSessionState[]> {
		const results: AgentSessionState[] = [];
		for (const session of this.sessions.values()) {
			if (session.agentId === agentId) {
				results.push(session);
				if (results.length >= limit) break;
			}
		}
		return results.sort(
			(a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
		);
	}

	async listByTenant(
		tenantId: string,
		limit = 100
	): Promise<AgentSessionState[]> {
		const results: AgentSessionState[] = [];
		for (const session of this.sessions.values()) {
			if (session.tenantId === tenantId) {
				results.push(session);
				if (results.length >= limit) break;
			}
		}
		return results.sort(
			(a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
		);
	}

	/**
	 * Clear all sessions (for testing).
	 */
	clear(): void {
		this.sessions.clear();
	}

	private evictIfNeeded(): void {
		if (this.sessions.size < this.maxSessions) {
			return;
		}

		let oldestSessionId: string | null = null;
		let oldestUpdatedAt = Number.POSITIVE_INFINITY;

		for (const [sessionId, session] of this.sessions.entries()) {
			const updatedAt = session.updatedAt.getTime();
			if (updatedAt < oldestUpdatedAt) {
				oldestUpdatedAt = updatedAt;
				oldestSessionId = sessionId;
			}
		}

		if (oldestSessionId) {
			this.sessions.delete(oldestSessionId);
		}
	}

	private trimArray<T>(items: T[], maxItems: number): void {
		if (items.length <= maxItems) {
			return;
		}

		const overflow = items.length - maxItems;
		items.splice(0, overflow);
	}
}

/**
 * Create an in-memory session store.
 */
export function createInMemorySessionStore(
	options?: InMemorySessionStoreOptions
): AgentSessionStore {
	return new InMemorySessionStore(options);
}

function createSecureSessionToken(): string {
	const cryptoApi = globalThis.crypto;
	if (typeof cryptoApi?.randomUUID === 'function') {
		return cryptoApi.randomUUID();
	}

	if (typeof cryptoApi?.getRandomValues === 'function') {
		const bytes = cryptoApi.getRandomValues(new Uint8Array(16));
		const versionByte = bytes.at(6);
		const variantByte = bytes.at(8);
		if (versionByte === undefined || variantByte === undefined) {
			throw new Error(
				'Secure session token generation requires 16 random bytes.'
			);
		}
		bytes[6] = (versionByte & 0x0f) | 0x40;
		bytes[8] = (variantByte & 0x3f) | 0x80;
		const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0'));
		return [
			hex.slice(0, 4).join(''),
			hex.slice(4, 6).join(''),
			hex.slice(6, 8).join(''),
			hex.slice(8, 10).join(''),
			hex.slice(10, 16).join(''),
		].join('-');
	}

	throw new Error('Secure session IDs require Web Crypto support.');
}

/**
 * Generate a unique session ID.
 */
export function generateSessionId(): string {
	return `sess_${createSecureSessionToken()}`;
}
