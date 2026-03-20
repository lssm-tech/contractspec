'use client';

import { registerTemplateComponents } from '@contractspec/lib.example-shared-ui';
import { useState } from 'react';
import { ConversationList } from './ConversationList';
import { MessageComposer } from './MessageComposer';
import { MessageThread } from './MessageThread';

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
