import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Send } from 'lucide-react';
import { useTemplateRuntime } from '../../../../templates/runtime';

const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
    }
  }
`;

export interface MessageComposerProps {
  conversationId?: string;
  viewerId?: string;
  viewerName?: string;
}

export function MessageComposer({
  conversationId,
  viewerId = 'local-user',
  viewerName = 'You',
}: MessageComposerProps) {
  const { projectId } = useTemplateRuntime();
  const [content, setContent] = useState('');
  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!conversationId || !content.trim()) return;
    await sendMessage({
      variables: {
        input: {
          projectId,
          conversationId,
          senderId: viewerId,
          senderName: viewerName,
          content: content.trim(),
        },
      },
      refetchQueries: [
        {
          query: gql`
            query Messages($conversationId: ID!) {
              messages(conversationId: $conversationId, limit: 50) {
                id
              }
            }
          `,
          variables: { conversationId },
        },
      ],
    });
    setContent('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border bg-card mt-3 flex items-center gap-2 rounded-2xl border px-4 py-3"
    >
      <input
        type="text"
        className="text-foreground flex-1 bg-transparent text-sm outline-none"
        placeholder={
          conversationId ? 'Type a message…' : 'Select a conversation to start'
        }
        disabled={!conversationId || loading}
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <button
        type="submit"
        className="btn-primary inline-flex items-center gap-1 text-sm"
        disabled={!conversationId || loading || !content.trim()}
      >
        <Send className="h-4 w-4" />
        Send
      </button>
    </form>
  );
}


