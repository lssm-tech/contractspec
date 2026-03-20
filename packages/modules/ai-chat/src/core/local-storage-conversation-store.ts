/**
 * LocalStorage-backed conversation store for web persistence
 */

import type { ConversationStore } from './conversation-store';
import type {
	ChatConversation,
	ChatMessage,
	ConversationStatus,
} from './message-types';

const DEFAULT_KEY = 'contractspec:ai-chat:conversations';

function generateId(prefix: string): string {
	return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function toSerializable(conv: ChatConversation): Record<string, unknown> {
	return {
		...conv,
		createdAt: conv.createdAt.toISOString(),
		updatedAt: conv.updatedAt.toISOString(),
		messages: conv.messages.map((m) => ({
			...m,
			createdAt: m.createdAt.toISOString(),
			updatedAt: m.updatedAt.toISOString(),
		})),
	};
}

function fromSerializable(raw: Record<string, unknown>): ChatConversation {
	const messages =
		(raw.messages as Record<string, unknown>[])?.map(
			(m) =>
				({
					...m,
					createdAt: new Date(m.createdAt as string),
					updatedAt: new Date(m.updatedAt as string),
				}) as ChatMessage
		) ?? [];
	return {
		...raw,
		createdAt: new Date(raw.createdAt as string),
		updatedAt: new Date(raw.updatedAt as string),
		messages,
	} as ChatConversation;
}

function loadAll(key: string): Map<string, ChatConversation> {
	if (typeof window === 'undefined') return new Map();
	try {
		const raw = window.localStorage.getItem(key);
		if (!raw) return new Map();
		const arr = JSON.parse(raw) as Record<string, unknown>[];
		const map = new Map<string, ChatConversation>();
		for (const item of arr) {
			const conv = fromSerializable(item);
			map.set(conv.id, conv);
		}
		return map;
	} catch {
		return new Map();
	}
}

function saveAll(key: string, map: Map<string, ChatConversation>): void {
	if (typeof window === 'undefined') return;
	try {
		const arr = Array.from(map.values()).map(toSerializable);
		window.localStorage.setItem(key, JSON.stringify(arr));
	} catch {
		// Ignore quota or other storage errors
	}
}

/**
 * Conversation store backed by localStorage.
 * Persists conversations across page reloads.
 */
export class LocalStorageConversationStore implements ConversationStore {
	private readonly key: string;
	private cache: Map<string, ChatConversation> | null = null;

	constructor(storageKey = DEFAULT_KEY) {
		this.key = storageKey;
	}

	private getMap(): Map<string, ChatConversation> {
		if (!this.cache) {
			this.cache = loadAll(this.key);
		}
		return this.cache;
	}

	private persist(): void {
		saveAll(this.key, this.getMap());
	}

	async get(conversationId: string): Promise<ChatConversation | null> {
		return this.getMap().get(conversationId) ?? null;
	}

	async create(
		conversation: Omit<ChatConversation, 'id' | 'createdAt' | 'updatedAt'>
	): Promise<ChatConversation> {
		const now = new Date();
		const full: ChatConversation = {
			...conversation,
			id: generateId('conv'),
			createdAt: now,
			updatedAt: now,
		};
		this.getMap().set(full.id, full);
		this.persist();
		return full;
	}

	async update(
		conversationId: string,
		updates: Partial<
			Pick<
				ChatConversation,
				| 'title'
				| 'status'
				| 'summary'
				| 'metadata'
				| 'projectId'
				| 'projectName'
				| 'tags'
			>
		>
	): Promise<ChatConversation | null> {
		const conv = this.getMap().get(conversationId);
		if (!conv) return null;

		const updated = {
			...conv,
			...updates,
			updatedAt: new Date(),
		};
		this.getMap().set(conversationId, updated);
		this.persist();
		return updated;
	}

	async appendMessage(
		conversationId: string,
		message: Omit<
			ChatMessage,
			'id' | 'conversationId' | 'createdAt' | 'updatedAt'
		>
	): Promise<ChatMessage> {
		const conv = this.getMap().get(conversationId);
		if (!conv) throw new Error(`Conversation ${conversationId} not found`);

		const now = new Date();
		const fullMessage: ChatMessage = {
			...message,
			id: generateId('msg'),
			conversationId,
			createdAt: now,
			updatedAt: now,
		};

		conv.messages.push(fullMessage);
		conv.updatedAt = now;
		this.persist();
		return fullMessage;
	}

	async updateMessage(
		conversationId: string,
		messageId: string,
		updates: Partial<ChatMessage>
	): Promise<ChatMessage | null> {
		const conv = this.getMap().get(conversationId);
		if (!conv) return null;

		const idx = conv.messages.findIndex((m) => m.id === messageId);
		if (idx === -1) return null;

		const msg = conv.messages[idx];
		if (!msg) return null;

		const updated = {
			...msg,
			...updates,
			updatedAt: new Date(),
		};
		conv.messages[idx] = updated;
		conv.updatedAt = new Date();
		this.persist();
		return updated;
	}

	async delete(conversationId: string): Promise<boolean> {
		const deleted = this.getMap().delete(conversationId);
		if (deleted) this.persist();
		return deleted;
	}

	async list(options?: {
		status?: ConversationStatus;
		projectId?: string;
		tags?: string[];
		limit?: number;
		offset?: number;
	}): Promise<ChatConversation[]> {
		let results = Array.from(this.getMap().values());

		if (options?.status) {
			results = results.filter((c) => c.status === options.status);
		}
		if (options?.projectId) {
			results = results.filter((c) => c.projectId === options.projectId);
		}
		if (options?.tags && options.tags.length > 0) {
			const tagSet = new Set(options.tags);
			results = results.filter(
				(c) => c.tags && c.tags.some((t) => tagSet.has(t))
			);
		}

		results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

		const offset = options?.offset ?? 0;
		const limit = options?.limit ?? 100;
		return results.slice(offset, offset + limit);
	}

	async fork(
		conversationId: string,
		upToMessageId?: string
	): Promise<ChatConversation> {
		const source = this.getMap().get(conversationId);
		if (!source) throw new Error(`Conversation ${conversationId} not found`);

		let messagesToCopy = source.messages;
		if (upToMessageId) {
			const idx = source.messages.findIndex((m) => m.id === upToMessageId);
			if (idx === -1) throw new Error(`Message ${upToMessageId} not found`);
			messagesToCopy = source.messages.slice(0, idx + 1);
		}

		const now = new Date();
		const forkedMessages: ChatMessage[] = messagesToCopy.map((m) => ({
			...m,
			id: generateId('msg'),
			conversationId: '',
			createdAt: new Date(m.createdAt),
			updatedAt: new Date(m.updatedAt),
		}));

		const forked: ChatConversation = {
			...source,
			id: generateId('conv'),
			title: source.title ? `${source.title} (fork)` : undefined,
			forkedFromId: source.id,
			createdAt: now,
			updatedAt: now,
			messages: forkedMessages,
		};

		for (const m of forked.messages) {
			m.conversationId = forked.id;
		}

		this.getMap().set(forked.id, forked);
		this.persist();
		return forked;
	}

	async truncateAfter(
		conversationId: string,
		messageId: string
	): Promise<ChatConversation | null> {
		const conv = this.getMap().get(conversationId);
		if (!conv) return null;

		const idx = conv.messages.findIndex((m) => m.id === messageId);
		if (idx === -1) return null;

		conv.messages = conv.messages.slice(0, idx + 1);
		conv.updatedAt = new Date();
		this.persist();
		return conv;
	}

	async search(query: string, limit = 20): Promise<ChatConversation[]> {
		const lowerQuery = query.toLowerCase();
		const results: ChatConversation[] = [];

		for (const conv of this.getMap().values()) {
			if (conv.title?.toLowerCase().includes(lowerQuery)) {
				results.push(conv);
				continue;
			}
			if (
				conv.messages.some((m) => m.content.toLowerCase().includes(lowerQuery))
			) {
				results.push(conv);
			}
			if (results.length >= limit) break;
		}

		return results;
	}
}

export function createLocalStorageConversationStore(
	storageKey?: string
): ConversationStore {
	return new LocalStorageConversationStore(storageKey);
}
