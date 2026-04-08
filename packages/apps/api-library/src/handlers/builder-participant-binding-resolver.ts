import type { BuilderStore } from '@contractspec/lib.builder-runtime/stores';

export async function resolveBuilderParticipantBindingId(input: {
	store: BuilderStore;
	workspaceId: string;
	channelType: 'telegram' | 'whatsapp';
	externalIdentityRef?: string;
	externalUserId?: string;
}): Promise<string | undefined> {
	if (!input.externalIdentityRef && !input.externalUserId) {
		return undefined;
	}
	const bindings = await input.store.listParticipantBindings(input.workspaceId);
	const binding = bindings.find(
		(item) =>
			!item.revokedAt &&
			item.channelType === input.channelType &&
			(item.externalIdentityRef === input.externalIdentityRef ||
				item.externalIdentityRef === input.externalUserId)
	);
	return binding?.id;
}
