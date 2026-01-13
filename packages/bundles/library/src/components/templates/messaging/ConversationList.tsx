import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { MessageCircle, Users } from 'lucide-react';
import { useMemo } from 'react';

import { type Conversation } from './types';
import { useTemplateRuntime } from '@contractspec/lib.example-shared-ui';

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
    <aside className="border-border bg-card h-full overflow-y-auto rounded-2xl border">
      <header className="border-border px -4 flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="text-sm font-semibold">Conversations</p>
          <p className="text-muted-foreground text-xs">
            {loading ? 'Loading…' : `${conversations.length} active`}
          </p>
        </div>
        <Users className="text-muted-foreground h-4 w-4" />
      </header>
      <div className="divide-border/70 divide-y">
        {conversations.map((conversation) => {
          const isSelected = selectedId === conversation.id;
          return (
            <button
              key={conversation.id}
              type="button"
              className={`flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition ${
                isSelected
                  ? 'text-foreground bg-violet-500/10'
                  : 'hover:bg-muted/40'
              }`}
              onClick={() => onSelect?.(conversation.id)}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">
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
          <p className="text-muted-foreground p-4 text-center text-xs">
            No conversations yet.
          </p>
        ) : null}
      </div>
    </aside>
  );
}
