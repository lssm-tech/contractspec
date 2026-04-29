import { docId } from '../../docs/registry';
import { defineEvent } from '../../events';
import { PWA_DOMAIN, PWA_OWNERS, PWA_STABILITY, PWA_TAGS } from '../constants';
import { PwaUpdateEventPayload } from './pwaUpdateApplied.event';

export const PwaUpdateDeferredEvent = defineEvent({
	meta: {
		key: 'pwa.update.deferred',
		version: '1.0.0',
		description: 'Emitted when a user defers an optional frontend PWA update.',
		domain: PWA_DOMAIN,
		owners: PWA_OWNERS,
		tags: [...PWA_TAGS, 'deferred'],
		stability: PWA_STABILITY,
		docId: [docId('docs.tech.contracts.pwa-updates')],
	},
	capability: { key: 'pwa.update-management', version: '1.0.0' },
	payload: PwaUpdateEventPayload,
});
