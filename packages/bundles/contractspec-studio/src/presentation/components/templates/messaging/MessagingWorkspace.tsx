import { useState } from 'react';

import { registerTemplateComponents } from '../../../../templates/runtime';
import { ConversationList } from './ConversationList';
import { MessageThread } from './MessageThread';
import { MessageComposer } from './MessageComposer';

export function MessagingWorkspace() {
  const [conversationId, setConversationId] = useState<string | undefined>();

  return (
    <div className="grid gap-4 md:grid-cols-[280px,1fr]">
      <ConversationList
        selectedId={conversationId}
        onSelect={setConversationId}
      />
      <div className="flex flex-col gap-3">
        <MessageThread conversationId={conversationId} />
        <MessageComposer conversationId={conversationId} />
      </div>
    </div>
  );
}

registerTemplateComponents('messaging-app', {
  list: MessagingWorkspace,
  detail: MessageThread,
  form: MessageComposer,
});
