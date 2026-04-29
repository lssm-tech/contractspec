import { docId } from '../../docs/registry';
import { defineEvent } from '../../events';
import { PWA_DOMAIN, PWA_OWNERS, PWA_STABILITY, PWA_TAGS } from '../constants';
import { PwaUpdateEventPayload } from './pwaUpdateApplied.event';

export const PwaUpdatePromptedEvent = defineEvent({
	meta: {
		key: 'pwa.update.prompted',
		version: '1.0.0',
		description: 'Emitted when a frontend prompts the user to update.',
		domain: PWA_DOMAIN,
		owners: PWA_OWNERS,
		tags: [...PWA_TAGS, 'prompt'],
		stability: PWA_STABILITY,
		docId: [docId('docs.tech.contracts.pwa-updates')],
	},
	capability: { key: 'pwa.update-management', version: '1.0.0' },
	payload: PwaUpdateEventPayload,
});
