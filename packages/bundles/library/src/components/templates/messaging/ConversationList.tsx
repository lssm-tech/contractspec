import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTemplateRuntime } from '@contractspec/lib.example-shared-ui';
import { MessageCircle, Users } from 'lucide-react';
import { useMemo } from 'react';
import { type Conversation } from './types';

const CONVERSATIONS_QUERY = gql`
  query Conversations($projectId: ID!) {
    conversations(projectId: $projectId) {
      id
      name
      isGroup
      updatedAt
      participants {
        id
        userId
        displayName
      }
    }
  }
`;

export interface ConversationListProps {
	selectedId?: string;
	onSelect?: (conversationId: string) => void;
}

export function ConversationList({
	selectedId,
	onSelect,
}: ConversationListProps) {
	const { projectId } = useTemplateRuntime();
	const { data, loading } = useQuery<{ conversations: Conversation[] }>(
		CONVERSATIONS_QUERY,
		{
			variables: { projectId },
			fetchPolicy: 'cache-and-network',
		}
	);

	const conversations: Conversation[] = useMemo(
		() => data?.conversations ?? [],
		[data]
	);

	return (
		<aside className="h-full overflow-y-auto rounded-2xl border border-border bg-card">
			<header className="px -4 flex items-center justify-between border-border border-b px-4 py-3">
				<div>
					<p className="font-semibold text-sm">Conversations</p>
					<p className="text-muted-foreground text-xs">
						{loading ? 'Loading…' : `${conversations.length} active`}
					</p>
				</div>
				<Users className="h-4 w-4 text-muted-foreground" />
			</header>
			<div className="divide-y divide-border/70">
				{conversations.map((conversation) => {
					const isSelected = selectedId === conversation.id;
					return (
						<button
							key={conversation.id}
							type="button"
							className={`flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition ${
								isSelected
									? 'bg-violet-500/10 text-foreground'
									: 'hover:bg-muted/40'
							}`}
							onClick={() => onSelect?.(conversation.id)}
						>
							<div className="flex items-center gap-2">
								<MessageCircle className="h-4 w-4 text-muted-foreground" />
								<span className="font-medium text-sm">
									{conversation.name || 'Untitled conversation'}
								</span>
							</div>
							<p className="text-muted-foreground text-xs">
								{conversation.participants
									.map(
										(participant) =>
											participant.displayName || participant.userId
									)
									.join(' · ')}
							</p>
						</button>
					);
				})}
				{!loading && conversations.length === 0 ? (
					<p className="p-4 text-center text-muted-foreground text-xs">
						No conversations yet.
					</p>
				) : null}
			</div>
		</aside>
	);
}
