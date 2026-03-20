'use client';

import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { useTemplateRuntime } from '@contractspec/lib.example-shared-ui';
import { useEffect, useRef } from 'react';
import { type Message } from './types';

export const MESSAGES_QUERY = gql`
  query Messages($conversationId: ID!) {
    messages(conversationId: $conversationId, limit: 50) {
      id
      content
      senderId
      senderName
      createdAt
      status
    }
  }
`;

const SET_READ = gql`
  mutation SetMessagesRead($conversationId: ID!, $userId: String!) {
    setMessagesRead(conversationId: $conversationId, userId: $userId)
  }
`;

export interface MessageThreadProps {
	conversationId?: string;
	viewerId?: string;
}

export function MessageThread({
	conversationId,
	viewerId = 'local-user',
}: MessageThreadProps) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const enabled = Boolean(conversationId);
	const { data, loading } = useQuery<{ messages: Message[] }>(MESSAGES_QUERY, {
		variables: { conversationId },
		skip: !enabled,
		fetchPolicy: 'cache-and-network',
	});
	const [setRead] = useMutation(SET_READ);
	const { projectId } = useTemplateRuntime();
	void projectId; // reserved for future perms

	const messages: Message[] = data?.messages ?? [];

	useEffect(() => {
		if (!enabled || !conversationId) return;
		setRead({ variables: { conversationId, userId: viewerId } }).catch(() => {
			/* ignore */
		});
	}, [conversationId, enabled, setRead, viewerId]);

	useEffect(() => {
		const container = scrollRef.current;
		if (!container) return;
		container.scrollTop = container.scrollHeight;
	}, [messages]);

	if (!conversationId) {
		return (
			<div className="flex flex-1 items-center justify-center rounded-2xl border border-border border-dashed">
				<p className="text-muted-foreground text-sm">Select a conversation</p>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col rounded-2xl border border-border bg-card">
			<div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
				{loading ? (
					<p className="text-center text-muted-foreground text-sm">Loading…</p>
				) : (
					messages
						.slice()
						.reverse()
						.map((message) => (
							<div
								key={message.id}
								className={`flex flex-col ${
									message.senderId === viewerId ? 'items-end' : 'items-start'
								}`}
							>
								<div
									className={`max-w-xs rounded-2xl px-3 py-2 text-sm ${
										message.senderId === viewerId
											? 'bg-violet-500 text-white'
											: 'bg-muted text-foreground'
									}`}
								>
									<p>{message.content}</p>
								</div>
								<span className="mt-1 text-muted-foreground text-xs">
									{message.senderName || message.senderId} ·{' '}
									{new Date(message.createdAt).toLocaleTimeString([], {
										hour: '2-digit',
										minute: '2-digit',
									})}
								</span>
							</div>
						))
				)}
			</div>
		</div>
	);
}
